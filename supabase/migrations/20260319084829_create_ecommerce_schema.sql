/*
  # E-Commerce Application Schema - FreshCart

  ## Overview
  Complete database schema for a fruits, vegetables, and dry fruits e-commerce platform.

  ## Tables Created

  ### 1. profiles
  - Extends auth.users with additional user information
  - Columns: id (uuid), email, full_name, phone, address, role (user/admin), created_at, updated_at
  - Links to auth.users via foreign key

  ### 2. categories
  - Product categories (fruits, vegetables, dry fruits, etc.)
  - Columns: id, name, description, image_url, slug, is_active, created_at

  ### 3. products
  - Product catalog with detailed information
  - Columns: id, category_id, name, description, price, discount_price, image_url, stock, unit, ratings, total_reviews, is_active, created_at, updated_at

  ### 4. cart
  - Shopping cart for each user
  - Columns: id, user_id, created_at, updated_at

  ### 5. cart_items
  - Items in user's shopping cart
  - Columns: id, cart_id, product_id, quantity, created_at, updated_at

  ### 6. orders
  - Customer orders
  - Columns: id, user_id, total_amount, shipping_address, phone, status, payment_id, created_at, updated_at

  ### 7. order_items
  - Line items for each order
  - Columns: id, order_id, product_id, quantity, price, created_at

  ### 8. payments
  - Payment transaction records
  - Columns: id, order_id, user_id, amount, payment_method, razorpay_payment_id, razorpay_order_id, status, created_at

  ### 9. otp_verifications
  - OTP codes for email and phone verification
  - Columns: id, user_id, email, phone, otp_code, otp_type, expires_at, is_verified, created_at

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies for authenticated users to access their own data
  - Admin-only policies for management operations
  - Public read access for products and categories
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  address text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  discount_price numeric(10, 2) CHECK (discount_price >= 0),
  image_url text,
  stock integer DEFAULT 0 CHECK (stock >= 0),
  unit text DEFAULT 'kg',
  ratings numeric(2, 1) DEFAULT 0 CHECK (ratings >= 0 AND ratings <= 5),
  total_reviews integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
  ON cart FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES cart(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cart_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_address text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  payment_method text DEFAULT 'razorpay',
  razorpay_payment_id text,
  razorpay_order_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create otp_verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  otp_code text NOT NULL,
  otp_type text NOT NULL CHECK (otp_type IN ('email', 'phone', 'password_reset')),
  expires_at timestamptz NOT NULL,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own OTP records"
  ON otp_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- Create function to automatically create cart on profile creation
CREATE OR REPLACE FUNCTION create_cart_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cart (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create cart
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_cart_for_user();