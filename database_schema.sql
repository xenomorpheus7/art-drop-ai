-- Database schema for payment and order management
-- This file contains SQL schema for storing Stripe payment data

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_session_id VARCHAR(255) UNIQUE NOT NULL,
    payment_intent_id VARCHAR(255),
    customer_email VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255),
    amount_total INTEGER NOT NULL, -- in cents
    currency VARCHAR(3) NOT NULL DEFAULT 'eur',
    payment_status VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    billing_address JSONB,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_image VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit_amount INTEGER NOT NULL, -- in cents
    total_amount INTEGER NOT NULL, -- in cents
    currency VARCHAR(3) NOT NULL DEFAULT 'eur',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment attempts table (for tracking failed payments, retries, etc.)
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_session_id VARCHAR(255) NOT NULL,
    payment_intent_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    amount INTEGER,
    currency VARCHAR(3),
    error_message TEXT,
    raw_event JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook events table (for audit trail)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    raw_event JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_checkout_session_id ON orders(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_checkout_session_id ON payment_attempts(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_payment_intent_id ON payment_attempts(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_created_at ON payment_attempts(created_at);

CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
