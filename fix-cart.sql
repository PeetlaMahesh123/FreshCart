-- Debug and fix cart functionality

-- Check if cart table exists and has proper structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('cart', 'cart_items') 
ORDER BY table_name, ordinal_position;

-- Check if cart policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('cart', 'cart_items');

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own cart" ON cart;
DROP POLICY IF EXISTS "Users can update own cart" ON cart;
DROP POLICY IF EXISTS "Users can insert own cart" ON cart;
DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;

-- Create cart policies
CREATE POLICY "Users can view own cart" ON cart FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own cart" ON cart FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own cart" ON cart FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL TO authenticated USING (cart_id IN (SELECT id FROM cart WHERE user_id = auth.uid()));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON cart TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;

-- Test query to check cart functionality
SELECT 'Cart policies setup complete' as status;
