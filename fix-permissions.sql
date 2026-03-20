-- Fix Row Level Security policies for categories and products

-- Enable RLS if not already enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Enable read access for all users - categories" ON categories;
DROP POLICY IF EXISTS "Allow insert for authenticated users - categories" ON categories;
DROP POLICY IF EXISTS "Allow update for authenticated users - categories" ON categories;

DROP POLICY IF EXISTS "Enable read access for all users - products" ON products;
DROP POLICY IF EXISTS "Allow insert for authenticated users - products" ON products;
DROP POLICY IF EXISTS "Allow update for authenticated users - products" ON products;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policies to allow public read access
CREATE POLICY "Enable read access for all users - categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users - products" ON products
  FOR SELECT USING (true);

-- Create policies for profiles table (CRITICAL for registration)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Optional: Allow authenticated users to insert/update (for admin functionality)
CREATE POLICY "Allow insert for authenticated users - categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users - categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users - products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users - products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT INSERT, UPDATE ON categories TO authenticated;
GRANT INSERT, UPDATE ON products TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
