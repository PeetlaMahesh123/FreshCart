import { createClient } from '@supabase/supabase-js';

// 🔹 Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 🔹 Validate (IMPORTANT)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Missing Supabase environment variables.\n" +
    "Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file"
  );
}

// 🔹 Create client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🔹 Optional: connection test (safe)
export const validateSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connected successfully');
    return true;

  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
};