-- QUICK FIX: Enable Admin Product Deletion
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Users can view products" ON products;

-- Step 3: Create simple admin policies
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Step 4: Allow everyone to view active products
CREATE POLICY "Users can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Step 5: Test the policy by checking current user
-- Run this to verify your admin role:
SELECT 
  auth.uid() as current_user_id,
  p.role,
  p.email,
  p.full_name
FROM profiles p 
WHERE p.id = auth.uid();
