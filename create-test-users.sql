-- Create test users for FreshCart application

-- Create Admin User (for testing admin functionality)
-- Email: admin@freshcart.com | Password: admin123
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@freshcart.com',
  now(),
  null,
  null,
  now(),
  now(),
  '{"role": "admin", "full_name": "Admin User"}'
);

-- Create Admin Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  address,
  role,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@freshcart.com'),
  'admin@freshcart.com',
  'Admin User',
  null,
  'Admin Office, FreshCart HQ',
  'admin',
  now(),
  now()
);

-- Create Customer User (for testing customer functionality)
-- Email: customer@freshcart.com | Password: customer123
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'customer@freshcart.com',
  now(),
  '+91 9876543210',
  null,
  now(),
  now(),
  '{"role": "user", "full_name": "Test Customer"}'
);

-- Create Customer Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  address,
  role,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'customer@freshcart.com'),
  'customer@freshcart.com',
  'Test Customer',
  '+91 9876543210',
  '123 Main Street, Bangalore, Karnataka 560001',
  'user',
  now(),
  now()
);

-- Create additional test customer
-- Email: john@freshcart.com | Password: john123
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'john@freshcart.com',
  now(),
  '+91 9876543211',
  null,
  now(),
  now(),
  '{"role": "user", "full_name": "John Doe"}'
);

-- Create John's Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  phone,
  address,
  role,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'john@freshcart.com'),
  'john@freshcart.com',
  'John Doe',
  '+91 9876543211',
  '456 Park Avenue, Mumbai, Maharashtra 400001',
  'user',
  now(),
  now()
);

-- Note: These users will need to set their passwords through the Supabase auth system
-- or you can use the Supabase dashboard to set passwords directly
