-- ReplyGenie Database Schema
-- Designed for PostgreSQL with Multi-Tenancy support via RLS

-- Enable UUID extension for secure IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS (Tenants)
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. CONNECTED ACCOUNTS
-- ==========================================
CREATE TABLE connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) CHECK (platform IN ('facebook', 'instagram')), -- Removed WhatsApp
    page_id VARCHAR(255) NOT NULL,
    page_name VARCHAR(255),
    access_token TEXT NOT NULL, -- WARNING: Store encrypted (AES-256)
    token_expiry TIMESTAMP WITH TIME ZONE,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);

-- ==========================================
-- 3. COUNTRIES (Global Data)
-- ==========================================
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    currency_code CHAR(3) NOT NULL
);

-- ==========================================
-- 4. STATES / REGIONS
-- ==========================================
CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

-- ==========================================
-- 5. SHIPPING COMPANIES
-- ==========================================
CREATE TABLE shipping_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

-- ==========================================
-- 6. PRODUCTS
-- ==========================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    stock INT DEFAULT 0,
    primary_image TEXT,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    
    -- Scheduling Logic
    publish_mode VARCHAR(20) CHECK (publish_mode IN ('instant', 'scheduled')) DEFAULT 'instant',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    publish_status VARCHAR(20) CHECK (publish_status IN ('draft', 'scheduled', 'published')) DEFAULT 'published',

    -- Recurring Logic
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_interval INT DEFAULT 7, -- Days
    last_published_at TIMESTAMP WITH TIME ZONE,
    next_publish_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6.1 PRODUCT PUBLISH TARGETS
-- ==========================================
CREATE TABLE product_publish_targets (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, account_id)
);

-- ==========================================
-- 7. PRODUCT IMAGES
-- ==========================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 8. PRODUCT DELIVERY (Shipping Rules)
-- ==========================================
CREATE TABLE product_delivery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    state_id UUID NOT NULL REFERENCES states(id),
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    free_shipping BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- 9. PRODUCT PAYMENT METHODS
-- ==========================================
CREATE TABLE product_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    method VARCHAR(20) CHECK (method IN ('cod', 'prepaid')),
    UNIQUE(product_id, method)
);

-- ==========================================
-- 10. ORDERS
-- ==========================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id), -- Denormalized for tenant isolation
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    state_id UUID REFERENCES states(id),
    address TEXT,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 11. CONVERSATIONS
-- ==========================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) CHECK (platform IN ('facebook', 'instagram')), -- Removed WhatsApp
    customer_id VARCHAR(255) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    auto_reply_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, platform, customer_id)
);

-- ==========================================
-- 12. MESSAGES
-- ==========================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) CHECK (sender IN ('customer', 'bot', 'admin')),
    content TEXT,
    platform_message_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 13. WEBHOOK LOGS
-- ==========================================
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50),
    payload JSONB,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_status VARCHAR(20) CHECK (processed_status IN ('processed', 'failed', 'ignored'))
);

-- ==========================================
-- 14. PUBLISH LOGS
-- ==========================================
CREATE TABLE publish_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    account_id UUID REFERENCES connected_accounts(id) ON DELETE SET NULL,
    publish_type VARCHAR(20) CHECK (publish_type IN ('instant', 'scheduled', 'recurring')),
    status VARCHAR(20) CHECK (status IN ('success', 'failed')),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT
);

-- ==========================================
-- 15. SUBSCRIPTIONS
-- ==========================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'past_due')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXING
-- ==========================================

-- Tenant Lookups
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_connected_accounts_user_id ON connected_accounts(user_id);

-- Performance Lookups
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_publish_status ON products(publish_status); -- New Index for scheduler
CREATE INDEX idx_products_next_publish_at ON products(next_publish_at); -- Index for recurring scheduler
CREATE INDEX idx_product_delivery_product_state ON product_delivery(product_id, state_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_states_country ON states(country_id);

-- ==========================================
-- SECURITY (Row Level Security)
-- ==========================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_logs ENABLE ROW LEVEL SECURITY;