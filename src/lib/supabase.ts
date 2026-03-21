import { createClient } from '@supabase/supabase-js';

// Enhanced environment variable handling
const getSupabaseUrl = () => {
  if (import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }
  // Fallback for different environments
  if (typeof __SUPABASE_URL__ !== 'undefined') {
    return __SUPABASE_URL__;
  }
  console.error('❌ VITE_SUPABASE_URL not found in environment variables');
  return null;
};

const getSupabaseAnonKey = () => {
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  // Fallback for different environments
  if (typeof __SUPABASE_ANON_KEY__ !== 'undefined') {
    return __SUPABASE_ANON_KEY__;
  }
  console.error('❌ VITE_SUPABASE_ANON_KEY not found in environment variables');
  return null;
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not properly configured!');
  console.error('Please check your environment variables or GitHub Secrets');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client with error handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Enhanced debug logging
console.log('🔧 Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'NOT CONFIGURED');
console.log('🔑 Supabase Key:', supabaseAnonKey ? 'LOADED ✓' : 'MISSING ❌');
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('📱 Client Status:', supabase ? 'CONNECTED ✓' : 'DISCONNECTED ❌');

// Enhanced validation function
export const validateSupabaseConnection = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not initialized');
    return false;
  }
  
  try {
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Database accessible');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return false;
  }
};

// Export connection status
export const isSupabaseConnected = () => supabase !== null;
