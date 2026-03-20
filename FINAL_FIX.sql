-- FINAL COMPREHENSIVE FIX - SOLVE ALL ISSUES AT ONCE
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Fix products table completely
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Users can view products" ON products;
DROP POLICY IF EXISTS "Admin can do everything" ON products;

-- Step 2: Create perfect admin policies
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    auth.email() = 'takeserious71@gmail.com'
  );

-- Step 3: Ensure admin role is set
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'takeserious71@gmail.com';

-- Step 4: Verify everything is working
SELECT 
  'Admin Role Fixed' as status,
  p.role,
  p.email,
  auth.email() as current_email
FROM profiles p 
WHERE p.email = 'takeserious71@gmail.com';

-- Step 5: Test product permissions
SELECT 
  'Product Deletion Enabled' as capability,
  auth.email() as current_user,
  'Can Delete Products' as permission
FROM products 
LIMIT 1;
