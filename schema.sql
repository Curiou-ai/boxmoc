-- Boxmoc Production SQL Schema
-- Target: PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Maps to Firebase Auth and Stripe Customers
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'supplier', 'logistics')),
    tenant_id TEXT NOT NULL, -- For SaaS isolation
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    stripe_price_id TEXT,
    stripe_subscription_status TEXT,
    stripe_current_period_end BIGINT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'onboarding', 'trialing', 'churned')),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_cus ON users(stripe_customer_id);
CREATE INDEX idx_users_tenant ON users(tenant_id);

-- 2. DESIGNS TABLE
-- Stores 3D canvas parameters and manufacturing assets
CREATE TABLE IF NOT EXISTS designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    box_tier VARCHAR(50) NOT NULL CHECK (box_tier IN ('shipper', 'retailer', 'bespoke')),
    dimensions JSONB NOT NULL, -- {width, height, depth}
    canvas_json JSONB,         -- {x, y, scale, rotation}
    logo_svg_url TEXT,
    preview_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_designs_user ON designs(user_id);

-- 3. SUPPLIERS TABLE
-- Manages manufacturing partners
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT,
    cost_per_unit INTEGER NOT NULL, -- in cents
    rating DECIMAL(3,2) DEFAULT 5.00,
    capacity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDERS TABLE
-- Main fulfillment and Shopify sync record
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tenant_id TEXT NOT NULL,
    design_id UUID REFERENCES designs(id) ON DELETE RESTRICT,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    shopify_order_id TEXT UNIQUE, -- e.g. gid://shopify/Order/...
    shopify_order_name TEXT,      -- e.g. #1024
    amount_total INTEGER NOT NULL, -- in cents
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(50) DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'PRICED', 'MATCHED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED')),
    print_status VARCHAR(50) DEFAULT 'PENDING' CHECK (print_status IN ('PENDING', 'READY', 'PRINTING', 'COMPLETED', 'SHIPPED')),
    shipping_address JSONB NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_shopify_id ON orders(shopify_order_id);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);

-- 5. WAITLIST TABLE
-- For early access management
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'waitlisted' CHECK (status IN ('waitlisted', 'active', 'redeemed')),
    code TEXT UNIQUE,
    source TEXT DEFAULT 'web_form',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_code ON waitlist(code);

-- 6. CONTACT SUBMISSIONS TABLE
-- General support and sales inquiries
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    source TEXT DEFAULT 'web_form',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. INTERACTION NOTES TABLE
-- CRM logs for Users and Contacts
CREATE TABLE IF NOT EXISTS interaction_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('user', 'contact')),
    target_id UUID NOT NULL, -- Polymorphic reference to users.id or contact_submissions.id
    content TEXT NOT NULL,
    author TEXT NOT NULL, -- Admin display name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_target ON interaction_notes(target_id, target_type);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
