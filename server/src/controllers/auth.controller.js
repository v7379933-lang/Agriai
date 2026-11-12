import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { env } from '../config/env.js';

export class AuthController {
  // POST /api/v1/auth/register
  // Body: { fullName, email, phone, password }
  static async register(req, res, next) {
    try {
      const { fullName, email, phone, password } = req.body;
      if (!fullName?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
      }
      if (phone && !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Mobile number must be a valid 10-digit Indian number starting with 6-9.' });
      }
      if (!isSupabaseConfigured()) {
        return res.status(503).json({ success: false, message: 'Authentication service is not configured.' });
      }

      // Check phone uniqueness
      if (phone) {
        const { data: existingPhone } = await supabaseAdmin.from('profiles').select('id').eq('phone', phone).maybeSingle();
        if (existingPhone) {
          return res.status(409).json({ success: false, message: 'This mobile number is already registered with another account.' });
        }
      }

      // Create user via Supabase Auth admin API
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName.trim(),
          phone: phone || null,
          role: 'farmer'
        }
      });

      if (createError) {
        const msg = createError.message || '';
        if (msg.includes('already') || msg.includes('registered') || createError.code === 'email_exists') {
          return res.status(409).json({ success: false, message: 'This email address is already registered.' });
        }
        throw new Error(msg);
      }

      const userId = createData.user.id;

      // Upsert profile row (the DB trigger also creates one, but we ensure phone is saved)
      const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
        id: userId,
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: 'farmer',
        preferred_language: 'en'
      }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile upsert warning:', profileError.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Registration successful! You can now sign in with your credentials.',
        data: { id: userId, email: email.toLowerCase().trim(), fullName: fullName.trim(), role: 'farmer' }
      });
    } catch (err) { next(err); }
  }

  // POST /api/v1/auth/login
  // Body: { email, password }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }
      if (!isSupabaseConfigured()) {
        return res.status(503).json({ success: false, message: 'Authentication service is not configured.' });
      }

      // Call Supabase REST endpoint directly to sign in with password
      const signInRes = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password })
      });

      const signInData = await signInRes.json();

      if (!signInRes.ok || signInData.error) {
        const msg = signInData.error_description || signInData.error || 'Invalid email or password.';
        return res.status(401).json({ success: false, message: msg });
      }

      const { access_token, refresh_token, expires_at, user: authUser } = signInData;

      // Fetch profile from DB for role and name
      const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', authUser.id).single();

      const userRole = profile?.role || authUser.user_metadata?.role || 'farmer';
      const fullName = profile?.full_name || authUser.user_metadata?.full_name || 'Farmer';

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          session: { access_token, refresh_token, expires_at },
          user: { id: authUser.id, email: authUser.email, role: userRole, fullName, phone: profile?.phone || null }
        }
      });
    } catch (err) { next(err); }
  }

  // POST /api/v1/auth/logout
  static async logout(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ') && isSupabaseConfigured()) {
        const token = authHeader.split(' ')[1];
        await supabaseAdmin.auth.admin.signOut(token).catch(() => {});
      }
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (err) { next(err); }
  }

  // POST /api/v1/auth/forgot-password  Body: { email }
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: 'Email address is required.' });
      if (!isSupabaseConfigured()) return res.status(503).json({ success: false, message: 'Authentication service is not configured.' });

      await fetch(`${env.SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': env.SUPABASE_ANON_KEY },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      // Always succeed to prevent email enumeration
      return res.status(200).json({ success: true, message: 'If an account exists for this email, a password reset link has been sent.' });
    } catch (err) { next(err); }
  }

  // POST /api/v1/auth/reset-password  Body: { accessToken, password }
  static async resetPassword(req, res, next) {
    try {
      const { accessToken, password } = req.body;
      if (!accessToken || !password) return res.status(400).json({ success: false, message: 'Token and new password are required.' });
      if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
      if (!isSupabaseConfigured()) return res.status(503).json({ success: false, message: 'Authentication service is not configured.' });

      const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
      if (userErr || !user) return res.status(401).json({ success: false, message: 'Invalid or expired reset link. Please request a new one.' });

      const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password });
      if (error) throw new Error(error.message);

      return res.status(200).json({ success: true, message: 'Password has been reset. You can now sign in.' });
    } catch (err) { next(err); }
  }

  // GET /api/v1/auth/me (requires requireAuth middleware)
  static async getMe(req, res, next) {
    try {
      let profile = null;
      if (isSupabaseConfigured()) {
        const { data } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user.id).single();
        profile = data;
      }
      return res.status(200).json({
        success: true,
        data: { id: req.user.id, email: req.user.email, role: req.user.role, fullName: req.user.fullName, profile }
      });
    } catch (err) { next(err); }
  }

  // POST /api/v1/auth/google/url — returns the OAuth redirect URL for the client
  static async googleAuthUrl(req, res, next) {
    try {
      if (!isSupabaseConfigured()) return res.status(503).json({ success: false, message: 'Authentication service is not configured.' });
      const redirectTo = `${env.CLIENT_URL}/auth/callback`;
      return res.status(200).json({ success: true, data: { url: `${env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}` } });
    } catch (err) { next(err); }
  }

  // POST /api/v1/auth/refresh  Body: { refresh_token }
  static async refreshToken(req, res, next) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) return res.status(400).json({ success: false, message: 'Refresh token is required.' });
      if (!isSupabaseConfigured()) return res.status(503).json({ success: false, message: 'Auth not configured.' });

      const refreshRes = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': env.SUPABASE_ANON_KEY },
        body: JSON.stringify({ refresh_token })
      });

      const refreshData = await refreshRes.json();
      if (!refreshRes.ok || refreshData.error) {
        return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
      }

      const { data: profile } = await supabaseAdmin.from('profiles').select('role, full_name').eq('id', refreshData.user.id).single();

      return res.status(200).json({
        success: true,
        data: {
          session: { access_token: refreshData.access_token, refresh_token: refreshData.refresh_token, expires_at: refreshData.expires_at },
          user: { id: refreshData.user.id, email: refreshData.user.email, role: profile?.role || 'farmer', fullName: profile?.full_name || 'Farmer' }
        }
      });
    } catch (err) { next(err); }
  }
}
