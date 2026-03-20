-- 🚀 Create Single Admin User Directly in Supabase

-- Step 1: Create the admin user in auth.users
-- Replace with your admin details
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  phone,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  gen_random_uuid(), -- This will generate a unique ID
  'admin@freshcart.com', -- CHANGE: Your admin email
  now(), -- Email already confirmed
  '+1234567890', -- CHANGE: Your admin phone
  now(),
  now(),
  '{"full_name": "FreshCart Admin", "role": "admin", "phone": "+1234567890"}',
  false
) RETURNING id;

-- Step 2: Create the admin profile in profiles table
-- NOTE: Replace the 'user_id' with the ID returned from the above query
INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  role,
  created_at,
  updated_at
) VALUES (
  'PASTE_THE_USER_ID_HERE', -- PASTE the ID from Step 1
  'admin@freshcart.com', -- CHANGE: Your admin email
  'FreshCart Admin', -- CHANGE: Your admin name
  '+1234567890', -- CHANGE: Your admin phone
  'admin',
  now(),
  now()
);

-- Step 3: Set a secure password for the admin
-- Run this after creating the user, replace the UUID with the actual user ID
-- This will set the password to 'admin123' (CHANGE this in production)

-- To set password, you'll need to use Supabase Auth Admin API or Dashboard
-- Go to Supabase Dashboard -> Authentication -> Users
-- Find your admin user and click "Reset Password" or set it directly

-- Alternative: Use this SQL to create user with password (requires auth admin function)
-- SELECT auth.sign_up('admin@freshcart.com', 'admin123', {
--   'data': '{"full_name": "FreshCart Admin", "role": "admin", "phone": "+1234567890"}',
--   'email_confirm': true
-- });
