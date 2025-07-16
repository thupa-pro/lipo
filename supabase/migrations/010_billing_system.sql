-- Migration: 010_billing_system.sql
-- Description: Create comprehensive billing and subscription system
-- Date: 2024

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Customers Table (Stripe Customer sync)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}',
  currency TEXT DEFAULT 'USD',
  balance INTEGER DEFAULT 0, -- in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_customers_user_id (user_id),
  INDEX idx_customers_stripe_id (stripe_customer_id),
  INDEX idx_customers_email (email)
);

-- 2. Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_price_id TEXT UNIQUE NOT NULL,
  stripe_product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL CHECK (interval IN ('day', 'week', 'month', 'year')),
  interval_count INTEGER DEFAULT 1,
  trial_period_days INTEGER,
  features TEXT[] DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_subscription_plans_stripe_price (stripe_price_id),
  INDEX idx_subscription_plans_active (is_active) WHERE is_active = true,
  INDEX idx_subscription_plans_interval (interval)
);

-- 3. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  quantity INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_subscriptions_user_id (user_id),
  INDEX idx_subscriptions_customer_id (customer_id),
  INDEX idx_subscriptions_stripe_id (stripe_subscription_id),
  INDEX idx_subscriptions_status (status),
  INDEX idx_subscriptions_plan_id (plan_id)
);

-- 4. Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  billing_details JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_payment_methods_user_id (user_id),
  INDEX idx_payment_methods_customer_id (customer_id),
  INDEX idx_payment_methods_stripe_id (stripe_payment_method_id),
  INDEX idx_payment_methods_default (is_default) WHERE is_default = true
);

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  invoice_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  currency TEXT NOT NULL,
  amount_due INTEGER NOT NULL, -- in cents
  amount_paid INTEGER DEFAULT 0, -- in cents
  amount_remaining INTEGER DEFAULT 0, -- in cents
  subtotal INTEGER NOT NULL, -- in cents
  total INTEGER NOT NULL, -- in cents
  tax INTEGER DEFAULT 0, -- in cents
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  hosted_invoice_url TEXT,
  invoice_pdf_url TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_invoices_user_id (user_id),
  INDEX idx_invoices_customer_id (customer_id),
  INDEX idx_invoices_subscription_id (subscription_id),
  INDEX idx_invoices_stripe_id (stripe_invoice_id),
  INDEX idx_invoices_status (status),
  INDEX idx_invoices_created_at (created_at)
);

-- 6. Invoice Line Items Table
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  stripe_line_item_id TEXT,
  description TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_amount INTEGER, -- in cents
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  proration BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_invoice_line_items_invoice_id (invoice_id)
);

-- 7. Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  metric_name TEXT NOT NULL,
  metric_value INTEGER NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_usage_tracking_user_id (user_id),
  INDEX idx_usage_tracking_subscription_id (subscription_id),
  INDEX idx_usage_tracking_metric (metric_name),
  INDEX idx_usage_tracking_period (period_start, period_end),
  
  -- Unique constraint to prevent duplicate metrics for same period
  UNIQUE(user_id, metric_name, period_start, period_end)
);

-- 8. Billing Events Table (for webhooks and event tracking)
CREATE TABLE IF NOT EXISTS billing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_billing_events_stripe_id (stripe_event_id),
  INDEX idx_billing_events_type (event_type),
  INDEX idx_billing_events_processed (processed),
  INDEX idx_billing_events_created_at (created_at)
);

-- 9. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_coupon_id TEXT UNIQUE NOT NULL,
  name TEXT,
  percent_off INTEGER, -- percentage (25 = 25%)
  amount_off INTEGER, -- in cents
  currency TEXT,
  duration TEXT NOT NULL CHECK (duration IN ('once', 'repeating', 'forever')),
  duration_in_months INTEGER,
  max_redemptions INTEGER,
  times_redeemed INTEGER DEFAULT 0,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_coupons_stripe_id (stripe_coupon_id),
  INDEX idx_coupons_active (is_active) WHERE is_active = true
);

-- 10. Billing Settings Table
CREATE TABLE IF NOT EXISTS billing_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications JSONB DEFAULT '{}',
  invoice_settings JSONB DEFAULT '{}',
  payment_settings JSONB DEFAULT '{}',
  usage_alerts JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint - one settings record per user
  UNIQUE(user_id),
  
  -- Indexes
  INDEX idx_billing_settings_user_id (user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Customers - Users can only access their own customer records
CREATE POLICY "Users can access their own customer data" ON customers
  FOR ALL USING (auth.uid() = user_id);

-- Subscription Plans - Public read access for active plans
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Subscriptions - Users can only access their own subscriptions
CREATE POLICY "Users can access their own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Payment Methods - Users can only access their own payment methods
CREATE POLICY "Users can access their own payment methods" ON payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Invoices - Users can only access their own invoices
CREATE POLICY "Users can access their own invoices" ON invoices
  FOR ALL USING (auth.uid() = user_id);

-- Invoice Line Items - Users can access line items for their invoices
CREATE POLICY "Users can access their own invoice line items" ON invoice_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE id = invoice_id AND user_id = auth.uid()
    )
  );

-- Usage Tracking - Users can access their own usage data
CREATE POLICY "Users can access their own usage data" ON usage_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Billing Events - Admin only access
CREATE POLICY "Admin can access billing events" ON billing_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Coupons - Public read access for active coupons
CREATE POLICY "Anyone can view active coupons" ON coupons
  FOR SELECT USING (is_active = true);

-- Billing Settings - Users can access their own settings
CREATE POLICY "Users can access their own billing settings" ON billing_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_billing_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods 
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
  BEFORE UPDATE ON invoices 
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at_column();

CREATE TRIGGER update_coupons_updated_at 
  BEFORE UPDATE ON coupons 
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at_column();

CREATE TRIGGER update_billing_settings_updated_at 
  BEFORE UPDATE ON billing_settings 
  FOR EACH ROW EXECUTE FUNCTION update_billing_updated_at_column();

-- Insert default subscription plans
INSERT INTO subscription_plans (
  stripe_price_id, stripe_product_id, name, description, amount, currency, interval, 
  trial_period_days, features, limits, is_popular, is_recommended
) VALUES
  (
    'price_starter_monthly',
    'prod_starter',
    'Starter',
    'Perfect for small businesses just getting started',
    2900, -- $29.00
    'USD',
    'month',
    14,
    ARRAY[
      'Up to 10 active listings',
      'Basic booking management',
      'Email support',
      '1 team member',
      '5GB storage'
    ],
    '{
      "listings": 10,
      "bookings": 100,
      "teamMembers": 1,
      "apiCalls": 1000,
      "storage": 5,
      "support": "basic"
    }'::jsonb,
    false,
    false
  ),
  (
    'price_professional_monthly',
    'prod_professional',
    'Professional',
    'For growing businesses with more advanced needs',
    7900, -- $79.00
    'USD',
    'month',
    14,
    ARRAY[
      'Up to 50 active listings',
      'Advanced booking features',
      'Priority support',
      '5 team members',
      '50GB storage',
      'Analytics dashboard'
    ],
    '{
      "listings": 50,
      "bookings": 1000,
      "teamMembers": 5,
      "apiCalls": 10000,
      "storage": 50,
      "support": "priority"
    }'::jsonb,
    true,
    false
  ),
  (
    'price_enterprise_monthly',
    'prod_enterprise',
    'Enterprise',
    'For large organizations requiring custom solutions',
    19900, -- $199.00
    'USD',
    'month',
    7,
    ARRAY[
      'Unlimited listings',
      'White-label solution',
      'Dedicated support',
      'Unlimited team members',
      '500GB storage',
      'Custom integrations',
      'Advanced analytics'
    ],
    '{
      "listings": -1,
      "bookings": -1,
      "teamMembers": -1,
      "apiCalls": 100000,
      "storage": 500,
      "support": "dedicated"
    }'::jsonb,
    false,
    true
  )
ON CONFLICT (stripe_price_id) DO NOTHING;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON customers TO authenticated;
GRANT SELECT ON subscription_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON payment_methods TO authenticated;
GRANT SELECT ON invoices TO authenticated;
GRANT SELECT ON invoice_line_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON usage_tracking TO authenticated;
GRANT SELECT ON billing_events TO authenticated;
GRANT SELECT ON coupons TO authenticated;
GRANT SELECT, INSERT, UPDATE ON billing_settings TO authenticated;

-- Comments for documentation
COMMENT ON TABLE customers IS 'Stripe customer data synced with local users';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans and pricing';
COMMENT ON TABLE subscriptions IS 'User subscriptions and billing cycles';
COMMENT ON TABLE payment_methods IS 'User payment methods stored in Stripe';
COMMENT ON TABLE invoices IS 'Billing invoices and payment history';
COMMENT ON TABLE invoice_line_items IS 'Detailed line items for each invoice';
COMMENT ON TABLE usage_tracking IS 'Track usage metrics for billing purposes';
COMMENT ON TABLE billing_events IS 'Stripe webhook events for audit trail';
COMMENT ON TABLE coupons IS 'Promotional codes and discounts';
COMMENT ON TABLE billing_settings IS 'User billing preferences and settings';
