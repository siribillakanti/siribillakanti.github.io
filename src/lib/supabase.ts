/**
 * Supabase Client — Portfolio CMS
 * 
 * Uses ONLY the public anon/publishable key (never the service-role key).
 * All write protection is enforced by PostgreSQL RLS policies.
 * 
 * Environment variables:
 *   VITE_SUPABASE_URL       — Your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY  — Your Supabase public anon/publishable key
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

// Clean inputs: strip whitespace and trailing slash
export const supabaseUrl = rawUrl.trim().replace(/\/+$/, '');
const supabaseAnonKey = rawKey.trim();

// Only create the client if credentials are configured
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    if (import.meta.env.DEV) {
      try {
        const parsed = new URL(supabaseUrl);
        console.log(`[Supabase Client] Configured host: ${parsed.hostname}`);
      } catch {
        console.warn(`[Supabase Client] Configured URL may be malformed: ${supabaseUrl}`);
      }
    }
  } catch (err: any) {
    console.error('[Supabase Client] Failed to initialize client:', err.message);
  }
}

export { supabase };

/**
 * Check whether Supabase is configured and available.
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

/**
 * Storage bucket name for uploaded stickers and assets.
 */
export const STICKER_BUCKET = 'stickers';
export const PORTFOLIO_BUCKET = 'portfolio-assets';
