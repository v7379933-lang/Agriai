import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Support demo/testing tokens regardless of Supabase configuration state
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token === 'demo-admin-token') {
        req.user = {
          id: 'a0000000-0000-0000-0000-000000000000',
          email: 'admin@agrismart.ai',
          role: 'admin',
          fullName: 'System Administrator'
        };
        return next();
      }
      if (token === 'demo-farmer-token') {
        req.user = {
          id: 'f1111111-1111-1111-1111-111111111111',
          email: 'ramesh.farmer@agrismart.ai',
          role: 'farmer',
          fullName: 'Ramesh Reddy'
        };
        return next();
      }
    }

    // Development mode fallback when Supabase keys are not yet configured
    if (!isSupabaseConfigured()) {
      req.user = {
        id: 'f1111111-1111-1111-1111-111111111111',
        email: 'ramesh.farmer@agrismart.ai',
        role: 'farmer',
        fullName: 'Ramesh Reddy'
      };
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing Bearer token.',
        error: { code: 'UNAUTHORIZED' }
      });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token.',
        error: { code: 'INVALID_TOKEN' }
      });
    }

    // Fetch user profile role from profiles table
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      role: profile?.role || user.user_metadata?.role || 'farmer',
      fullName: profile?.full_name || user.user_metadata?.full_name || 'Farmer'
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privilege required.',
      error: { code: 'FORBIDDEN' }
    });
  }
  next();
};

