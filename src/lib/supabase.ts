import { createClient } from '@supabase/supabase-js';

// Get credentials from environment or use fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced debug logging
console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseAnonKey ? 'LOADED' : 'MISSING');
console.log('🌐 Environment:', import.meta.env.MODE);

// Validation function
export const validateSupabaseConnection = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials not configured!');
    console.error('Please check your .env file or GitHub Secrets');
    return false;
  }
  
  // Test connection
  supabase.from('profiles').select('count').then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful!');
    console.log('📊 Profiles count:', data?.[0]?.count || 0);
    return true;
  }).catch(err => {
    console.error('❌ Supabase connection error:', err);
    return false;
  });
};
