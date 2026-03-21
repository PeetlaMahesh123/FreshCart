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

// Create Supabase client with error handling and retry logic
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'X-Client-Info': 'freshcart-ecommerce'
        }
      }
    })
  : null;

// Enhanced debug logging
console.log('🔧 Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'NOT CONFIGURED');
console.log('🔑 Supabase Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING ❌');
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('📱 Client Status:', supabase ? 'CONNECTED ✓' : 'DISCONNECTED ❌');

// Enhanced validation function with better error handling
export const validateSupabaseConnection = async () => {
  if (!supabase) {
    console.error('❌ Supabase client not initialized');
    return false;
  }
  
  try {
    // Test connection with a simple health check
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      
      // Handle specific error cases
      if (error.message.includes('Invalid API key')) {
        console.error('🔑 SOLUTION: Your Supabase API key is invalid or expired');
        console.error('🔧 STEPS TO FIX:');
        console.error('1. Go to https://supabase.com/dashboard');
        console.error('2. Select your project or create a new one');
        console.error('3. Go to Project Settings > API');
        console.error('4. Copy the Project URL and anon public key');
        console.error('5. Update your .env file with the correct values');
        console.error('6. Restart your development server');
      } else if (error.message.includes('permission denied') || error.message.includes('does not exist')) {
        console.error('🗄️ SOLUTION: Database tables not created or RLS enabled');
        console.error('🔧 STEPS TO FIX:');
        console.error('1. Go to your Supabase project dashboard');
        console.error('2. Navigate to the Table Editor');
        console.error('3. Create the required tables (profiles, products, orders, etc.)');
        console.error('4. OR go to Authentication > Policies and disable RLS for testing');
        console.error('5. OR create proper RLS policies');
      }
      
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Database accessible');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    console.error('🔧 This might be a network or configuration issue');
    return false;
  }
};

// Export connection status
export const isSupabaseConnected = () => supabase !== null;

// Add fallback mock data for development when Supabase is not available
export const getMockData = () => ({
  profiles: [],
  products: [
    { id: 1, name: 'Sample Product', price: 29.99, category: 'electronics' },
    { id: 2, name: 'Another Product', price: 19.99, category: 'clothing' }
  ],
  orders: []
});
