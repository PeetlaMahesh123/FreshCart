-- Verify RLS policies for common tables that might cause 406 errors

-- Check if RLS is enabled on key tables
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'categories', 'profiles', 'cart', 'cart_items', 'orders')
ORDER BY tablename;

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('products', 'categories', 'profiles', 'cart', 'cart_items', 'orders')
ORDER BY tablename, policyname;

-- Ensure basic SELECT policies exist for public data
-- Products and categories should be readable by everyone
DO $$
BEGIN
  -- Products
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND cmd = 'SELECT'
  ) THEN
    CREATE POLICY "Enable read access for all users - products" ON products
      FOR SELECT USING (is_active = true);
  END IF;
  
  -- Categories  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND cmd = 'SELECT'
  ) THEN
    CREATE POLICY "Enable read access for all users - categories" ON categories
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- Grant permissions to public and authenticated users
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;

SELECT 'RLS policies verified and fixed' as status;
