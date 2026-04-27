-- Debug Cart Issues - Run this in Supabase Dashboard

-- Step 1: Check if cart policies exist
SELECT 
  tablename,
  policyname,
  cmd,
  roles 
FROM pg_policies 
WHERE tablename IN ('cart', 'cart_items')
ORDER BY tablename, policyname;

-- Step 2: Check if user has a cart
-- Replace 'YOUR_USER_ID' with actual user ID from auth.users table
SELECT 
  'Current carts' as info,
  COUNT(*) as total_carts
FROM cart;

-- Step 3: Check cart_items
SELECT 
  'Current cart items' as info,
  COUNT(*) as total_items
FROM cart_items;

-- Step 4: Test if we can create a cart (this will show permission errors)
-- This will fail if policies are broken, which tells us what to fix
INSERT INTO cart (user_id) 
SELECT id FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM cart)
LIMIT 1;

-- Step 5: Show sample users to test with
SELECT 
  id,
  email,
  created_at
FROM auth.users 
LIMIT 3;

-- Step 6: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('cart', 'cart_items')
ORDER BY tablename;

SELECT 'Debug complete - check results above' as status;
