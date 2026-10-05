-- ─────────────────────────────────────────────────────────────────────────────
-- FYB Database Migration — Initial Schema & RLS Policies
-- Phase 1 Foundation
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enums ─────────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('customer', 'rep', 'admin');
CREATE TYPE product_category AS ENUM ('tshirt', 'hoodie', 'jacket', 'cap', 'bag', 'other');
CREATE TYPE product_size AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'ONE_SIZE');
CREATE TYPE design_status AS ENUM ('draft', 'saved', 'shared', 'archived');
CREATE TYPE design_element_type AS ENUM ('text', 'image', 'shape', 'logo');
CREATE TYPE reservation_status AS ENUM ('available', 'reserved', 'confirmed', 'expired', 'cancelled');
CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'paid',
  'processing',
  'in_production',
  'quality_check',
  'ready_for_dispatch',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refund_pending',
  'refunded'
);
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payment_provider AS ENUM ('paystack');
CREATE TYPE delivery_method AS ENUM ('shipping', 'pickup');
CREATE TYPE product_view AS ENUM ('front', 'back', 'left', 'right', 'detail');

-- ── Profiles ──────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  university TEXT,
  graduation_year INT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper security functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_rep()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('rep', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Products & Variants ───────────────────────────────────────────────────────

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL DEFAULT 'tshirt',
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  colour TEXT NOT NULL,
  colour_hex TEXT,
  size product_size NOT NULL,
  price_delta NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  stock_qty INT NOT NULL DEFAULT 100 CHECK (stock_qty >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_mockup BOOLEAN NOT NULL DEFAULT FALSE,
  view product_view NOT NULL DEFAULT 'front',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Designs & Assets ──────────────────────────────────────────────────────────

CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  name TEXT NOT NULL DEFAULT 'Untitled Design',
  status design_status NOT NULL DEFAULT 'draft',
  canvas_config JSONB NOT NULL DEFAULT '{"printAreaWidth": 400, "printAreaHeight": 500, "backgroundColor": "#FFFFFF", "elements": []}'::jsonb,
  preview_url TEXT,
  is_platform_design BOOLEAN NOT NULL DEFAULT FALSE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE design_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes INT NOT NULL,
  width_px INT,
  height_px INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE design_elements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  type design_element_type NOT NULL,
  position JSONB NOT NULL,
  dimensions JSONB NOT NULL,
  rotation NUMERIC NOT NULL DEFAULT 0,
  z_index INT NOT NULL DEFAULT 0,
  content TEXT,
  style JSONB NOT NULL DEFAULT '{}'::jsonb,
  asset_id UUID REFERENCES design_assets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Departments & Reservations ────────────────────────────────────────────────

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  university TEXT,
  description TEXT,
  rep_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE department_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (department_id, user_id)
);

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE RESTRICT,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status reservation_status NOT NULL DEFAULT 'reserved',
  reserved_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- ── Carts ─────────────────────────────────────────────────────────────────────

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  design_id UUID REFERENCES designs(id) ON DELETE SET NULL,
  design_snapshot JSONB,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Orders & Payments ─────────────────────────────────────────────────────────

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'pending_payment',
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  delivery_method delivery_method NOT NULL DEFAULT 'shipping',
  shipping_address JSONB,
  notes TEXT,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  design_id UUID REFERENCES designs(id) ON DELETE SET NULL,
  design_snapshot JSONB,
  product_snapshot JSONB NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  provider payment_provider NOT NULL DEFAULT 'paystack',
  provider_reference TEXT UNIQUE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  status payment_status NOT NULL DEFAULT 'pending',
  initialized_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  webhook_received_at TIMESTAMPTZ,
  metadata JSONB
);

-- ── Pricing Tiers & Utilities ─────────────────────────────────────────────────

CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  min_qty INT NOT NULL CHECK (min_qty > 0),
  max_qty INT CHECK (max_qty IS NULL OR max_qty >= min_qty),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RLS) POLICIES ────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own; admins read all
CREATE POLICY "Profiles readable by owner or admin" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Profiles updateable by owner" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products & Variants: public read active; admin write
CREATE POLICY "Products readable by anyone" ON products
  FOR SELECT USING (active = true OR is_admin());
CREATE POLICY "Products editable by admin" ON products
  FOR ALL USING (is_admin());

CREATE POLICY "Variants readable by anyone" ON product_variants
  FOR SELECT USING (active = true OR is_admin());
CREATE POLICY "Variants editable by admin" ON product_variants
  FOR ALL USING (is_admin());

CREATE POLICY "Product images readable by anyone" ON product_images
  FOR SELECT USING (true);

-- Designs: owner or platform designs readable; owner write
CREATE POLICY "Designs readable by owner or platform" ON designs
  FOR SELECT USING (user_id = auth.uid() OR is_platform_design = true OR is_admin() OR share_token IS NOT NULL);
CREATE POLICY "Designs editable by owner" ON designs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Design assets readable by owner" ON design_assets
  FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Design assets uploadable by owner" ON design_assets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Design elements manageable by design owner" ON design_elements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND user_id = auth.uid())
  );

-- Carts: owner only
CREATE POLICY "Carts accessible by owner" ON carts
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Cart items accessible by cart owner" ON cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM carts WHERE id = cart_id AND user_id = auth.uid())
  );

-- Orders & Payments: owner or admin read; system write
CREATE POLICY "Orders readable by owner or admin" ON orders
  FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Order items readable by order owner or admin" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR is_admin()))
  );

CREATE POLICY "Payments readable by order owner or admin" ON payments
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

-- Departments & Members
CREATE POLICY "Departments readable by anyone" ON departments
  FOR SELECT USING (true);
CREATE POLICY "Departments manageable by rep or admin" ON departments
  FOR ALL USING (rep_id = auth.uid() OR is_admin());

CREATE POLICY "Department members readable by members or rep" ON department_members
  FOR SELECT USING (user_id = auth.uid() OR is_rep());

-- Reservations
CREATE POLICY "Reservations readable by dept members or rep" ON reservations
  FOR SELECT USING (created_by = auth.uid() OR is_rep());

-- Pricing tiers
CREATE POLICY "Pricing tiers readable by anyone" ON pricing_tiers
  FOR SELECT USING (active = true OR is_admin());

-- Notifications
CREATE POLICY "Notifications readable by recipient" ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Notifications updateable by recipient" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Audit logs
CREATE POLICY "Audit logs accessible by admin only" ON audit_logs
  FOR ALL USING (is_admin());
