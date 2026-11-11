import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const isConfigured = 
  env.SUPABASE_URL && 
  env.SUPABASE_SERVICE_ROLE_KEY && 
  !env.SUPABASE_URL.includes('mock-supabase');

export const supabaseAdmin = isConfigured
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export const createScopedUserClient = (token) => {
  if (!isConfigured) return null;
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      persistSession: false
    }
  });
};

export const isSupabaseConfigured = () => Boolean(isConfigured);

