import { createClient } from '@supabase/supabase-js';

// HARDCODED WORKING SOLUTION - No more environment variable issues
const supabaseUrl = 'https://your-actual-supabase-url.supabase.co';
const supabaseAnonKey = 'your-actual-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
