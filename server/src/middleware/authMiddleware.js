import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    // Dev fallback: only when Supabase is completely unconfigured (no real credentials)
    if (!isSupabaseConfigured()) {
      req.user = {
        id: 'f1111111-1111-1111-1111-111111111111',
        email: 'dev@agrismart.local',
        role: 'farmer',
        fullName: 'Dev Farmer (Unconfigured)'
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.',
        error: { code: 'UNAUTHORIZED' }
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid. Please sign in again.',
        error: { code: 'INVALID_TOKEN' }
      });
    }

    // Role MUST come from DB — never trust client-submitted roles
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      role: profile?.role || 'farmer',
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
      message: 'Access denied. Administrative privileges required.',
      error: { code: 'FORBIDDEN' }
    });
  }
  next();
};
