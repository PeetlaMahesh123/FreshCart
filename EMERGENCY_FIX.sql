-- EMERGENCY FIX: Bypass RLS for your admin account
-- Run this if normal RLS policies don't work

-- Step 1: Disable RLS temporarily (for testing)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Step 2: Manually set your admin role (if needed)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'takeserious71@gmail.com';

-- Step 3: Verify your admin status
SELECT 
  id,
  email,
  role,
  full_name
FROM profiles 
WHERE email = 'takeserious71@gmail.com';

-- Step 4: Re-enable RLS with simple policy
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 5: Create simple admin policy
CREATE POLICY "Admin can do everything" ON products
  FOR ALL USING (
    auth.email() = 'takeserious71@gmail.com'
  );

-- Step 6: Test policy effectiveness
SELECT 
  auth.email() as current_email,
  auth.uid() as current_user_id,
  'Can delete products' as permission
FROM products 
LIMIT 1;
