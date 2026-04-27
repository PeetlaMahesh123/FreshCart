-- TEST CART OPERATIONS - Run this in Supabase Dashboard

-- Step 1: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('cart', 'cart_items')
ORDER BY tablename;

-- Step 2: Check current policies
SELECT 
  tablename,
  policyname,
  cmd,
  roles 
FROM pg_policies 
WHERE tablename IN ('cart', 'cart_items')
ORDER BY tablename, policyname;

-- Step 3: Check if user has cart
SELECT 
  'Carts in database' as info,
  COUNT(*) as total_carts
FROM cart;

-- Step 4: Check cart items
SELECT 
  'Cart items in database' as info,
  COUNT(*) as total_items
FROM cart_items;

-- Step 5: Show sample data
SELECT 
  'Sample cart data' as info,
  c.id as cart_id,
  c.user_id,
  ci.product_id,
  ci.quantity,
  p.name as product_name
FROM cart c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
LEFT JOIN products p ON ci.product_id = p.id
LIMIT 5;

-- Step 6: Test direct insert (this will show permission errors)
-- This will help us identify the exact issue
INSERT INTO cart (user_id) 
SELECT id FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM cart)
LIMIT 1;

SELECT 'Test complete - check results above' as status;
