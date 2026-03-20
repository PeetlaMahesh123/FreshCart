import { createClient } from '@supabase/supabase-js';

// FALLBACK VALUES - Replace with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-actual-anon-key-here';

// Create client with fallback
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug logging
console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseAnonKey ? 'LOADED' : 'MISSING');
