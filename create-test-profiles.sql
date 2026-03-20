-- Create test profiles (users need to be created via Supabase Auth first)

-- Admin profile (for user with admin@freshcart.com)
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
  '00000000-0000-0000-0000-000000000001',
  'admin@freshcart.com',
  'Admin User',
  null,
  'Admin Office, FreshCart HQ',
  'admin',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Customer profile (for user with customer@freshcart.com)
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
  '00000000-0000-0000-0000-000000000002',
  'customer@freshcart.com',
  'Test Customer',
  '+91 9876543210',
  '123 Main Street, Bangalore, Karnataka 560001',
  'user',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;
