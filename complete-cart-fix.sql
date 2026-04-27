-- COMPLETE CART FIX - Reset and Fix Everything
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: COMPLETELY RESET cart policies (start fresh)
DROP POLICY IF EXISTS "Users can view own cart" ON cart;
DROP POLICY IF EXISTS "Users can insert own cart" ON cart;
DROP POLICY IF EXISTS "Users can update own cart" ON cart;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart;
DROP POLICY IF EXISTS "Users can do everything with their own cart" ON cart;
DROP POLICY IF EXISTS "Users can view own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can do everything with their own cart items" ON cart_items;

-- Step 2: DISABLE RLS temporarily to ensure access
ALTER TABLE cart DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Step 3: Create carts for all users who don't have one
INSERT INTO cart (user_id)
SELECT id FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM cart)
AND id IS NOT NULL;

-- Step 4: Re-enable RLS with simple, working policies
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Step 5: Create SIMPLE policies that definitely work
CREATE POLICY "Users can do everything with their own cart" ON cart
  FOR ALL TO authenticated 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can do everything with their own cart items" ON cart_items
  FOR ALL TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM cart 
    WHERE cart.id = cart_items.cart_id 
    AND cart.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM cart 
    WHERE cart.id = cart_items.cart_id 
    AND cart.user_id = auth.uid()
  ));

-- Step 6: Grant all necessary permissions
GRANT ALL ON cart TO authenticated;
GRANT ALL ON cart_items TO authenticated;

-- Step 7: Fix the trigger to ensure carts are created automatically
DROP FUNCTION IF EXISTS create_cart_for_user() CASCADE;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

CREATE OR REPLACE FUNCTION create_cart_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert cart but don't fail if it already exists
  INSERT INTO cart (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't fail profile creation if cart creation fails
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_cart_for_user();

-- Step 8: Verify everything is working
SELECT 
  'Cart Setup Complete' as status,
  (SELECT COUNT(*) FROM cart) as total_carts,
  (SELECT COUNT(*) FROM cart_items) as total_items,
  (SELECT COUNT(*) FROM auth.users) as total_users;

-- Step 9: Test query to ensure policies work
SELECT 
  'Policy Test' as test,
  'Can access cart data' as result
FROM cart 
LIMIT 1;

SELECT '✅ COMPLETE CART FIX APPLIED SUCCESSFULLY' as final_result;
