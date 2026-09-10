import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isStaleEndpoint = supabaseUrl.includes('pgccmtdcopxdhgemzxpc');
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !isStaleEndpoint);

let supabase: SupabaseClient;

if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

export { supabase, isConfigured };
