-- Stripe Subscription System Tables
-- This migration creates tables for managing Stripe subscriptions and billing

-- Subscription status enum
CREATE TYPE subscription_status AS ENUM (
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid'
);

-- Subscription plan enum
CREATE TYPE subscription_plan AS ENUM (
  'free',
  'starter',
  'professional',
  'enterprise'
);

-- Invoice status enum
CREATE TYPE invoice_status AS ENUM (
  'draft',
  'open',
  'paid',
  'uncollectible',
  'void'
);

-- Subscription plans table (predefined plans)
CREATE TABLE subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id subscription_plan NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Pricing
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  
  -- Stripe configuration
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  stripe_product_id TEXT,
  
  -- Plan limits and features
  features JSONB DEFAULT '{}', -- {max_listings: 10, max_bookings: 100, priority_support: true}
  limits JSONB DEFAULT '{}', -- {max_listings: 10, max_bookings_per_month: 100}
  
  -- Plan metadata
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe data
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  
  -- Subscription details
  plan_id subscription_plan NOT NULL,
  status subscription_status NOT NULL DEFAULT 'incomplete',
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly
  
  -- Subscription lifecycle
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Usage tracking
  usage_data JSONB DEFAULT '{}', -- {listings_created: 5, bookings_this_month: 23}
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one active subscription per user
  UNIQUE(user_id, stripe_subscription_id)
);

-- Stripe invoices table (for tracking and analytics)
CREATE TABLE stripe_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  
  -- Stripe data
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  
  -- Invoice details
  status invoice_status NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  
  -- Dates
  invoice_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Invoice items and metadata
  line_items JSONB DEFAULT '[]',
  invoice_pdf TEXT, -- URL to invoice PDF
  hosted_invoice_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE user_payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe data
  stripe_payment_method_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  
  -- Payment method details
  type TEXT NOT NULL, -- card, bank_account, etc.
  card_brand TEXT, -- visa, mastercard, etc.
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- Status
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription usage tracking table
CREATE TABLE subscription_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  
  -- Usage period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Usage metrics
  listings_created INTEGER DEFAULT 0,
  listings_active INTEGER DEFAULT 0,
  bookings_received INTEGER DEFAULT 0,
  bookings_completed INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  
  -- Feature usage
  ai_credits_used INTEGER DEFAULT 0,
  api_calls_made INTEGER DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  
  -- Metadata
  usage_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, period_start, period_end)
);

-- Subscription events table (for audit trail)
CREATE TABLE subscription_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  
  -- Event details
  event_type TEXT NOT NULL, -- subscription.created, subscription.updated, etc.
  stripe_event_id TEXT,
  
  -- Event data
  event_data JSONB DEFAULT '{}',
  previous_attributes JSONB DEFAULT '{}',
  
  -- Processing
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_plan ON user_subscriptions(plan_id);
CREATE INDEX idx_stripe_invoices_user_id ON stripe_invoices(user_id);
CREATE INDEX idx_stripe_invoices_status ON stripe_invoices(status);
CREATE INDEX idx_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX idx_subscription_usage_user_period ON subscription_usage(user_id, period_start);
CREATE INDEX idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_type ON subscription_events(event_type);

-- RLS Policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Subscription plans are publicly readable
CREATE POLICY "Subscription plans are publicly readable" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Users can only access their own subscription data
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own invoices" ON stripe_invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment methods" ON user_payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own payment methods" ON user_payment_methods
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON subscription_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all subscription data" ON user_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all invoices" ON stripe_invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers
CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_id, name, description, price_monthly, price_yearly, features, limits, display_order) VALUES
(
  'free',
  'Free Plan',
  'Perfect for getting started with basic features',
  0.00,
  0.00,
  '{"basic_listings": true, "customer_support": false, "analytics": false, "priority_support": false}',
  '{"max_listings": 3, "max_bookings_per_month": 10, "max_images_per_listing": 3}',
  1
),
(
  'starter',
  'Starter Plan',
  'Great for individual service providers',
  19.99,
  199.99,
  '{"unlimited_listings": true, "basic_analytics": true, "customer_support": true, "priority_support": false, "ai_assistance": false}',
  '{"max_listings": 25, "max_bookings_per_month": 100, "max_images_per_listing": 10}',
  2
),
(
  'professional',
  'Professional Plan',
  'Perfect for growing businesses',
  49.99,
  499.99,
  '{"unlimited_listings": true, "advanced_analytics": true, "customer_support": true, "priority_support": true, "ai_assistance": true, "custom_branding": false}',
  '{"max_listings": 100, "max_bookings_per_month": 500, "max_images_per_listing": 20, "ai_credits_per_month": 100}',
  3
),
(
  'enterprise',
  'Enterprise Plan',
  'For large organizations with custom needs',
  199.99,
  1999.99,
  '{"unlimited_listings": true, "advanced_analytics": true, "customer_support": true, "priority_support": true, "ai_assistance": true, "custom_branding": true, "api_access": true, "white_label": true}',
  '{"max_listings": -1, "max_bookings_per_month": -1, "max_images_per_listing": 50, "ai_credits_per_month": 1000}',
  4
);

-- Functions for subscription management

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(p_user_id UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_id subscription_plan,
  status subscription_status,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN,
  features JSONB,
  limits JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    us.plan_id,
    us.status,
    us.stripe_subscription_id,
    us.current_period_end,
    us.cancel_at_period_end,
    sp.features,
    sp.limits
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.plan_id
  WHERE us.user_id = p_user_id 
    AND us.status IN ('trialing', 'active', 'past_due')
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check feature access
CREATE OR REPLACE FUNCTION check_feature_access(
  p_user_id UUID,
  p_feature TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_features JSONB;
BEGIN
  -- Get user's current plan features
  SELECT sp.features INTO user_features
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.plan_id
  WHERE us.user_id = p_user_id 
    AND us.status IN ('trialing', 'active', 'past_due')
  ORDER BY us.created_at DESC
  LIMIT 1;
  
  -- If no subscription found, assume free plan
  IF user_features IS NULL THEN
    SELECT features INTO user_features
    FROM subscription_plans 
    WHERE plan_id = 'free';
  END IF;
  
  -- Check if feature is enabled
  RETURN COALESCE((user_features ->> p_feature)::boolean, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_limit_type TEXT,
  p_current_usage INTEGER DEFAULT NULL
)
RETURNS TABLE(
  allowed BOOLEAN,
  limit_value INTEGER,
  current_usage INTEGER,
  remaining INTEGER
) AS $$
DECLARE
  user_limits JSONB;
  limit_val INTEGER;
  current_val INTEGER;
BEGIN
  -- Get user's current plan limits
  SELECT sp.limits INTO user_limits
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.plan_id
  WHERE us.user_id = p_user_id 
    AND us.status IN ('trialing', 'active', 'past_due')
  ORDER BY us.created_at DESC
  LIMIT 1;
  
  -- If no subscription found, assume free plan
  IF user_limits IS NULL THEN
    SELECT limits INTO user_limits
    FROM subscription_plans 
    WHERE plan_id = 'free';
  END IF;
  
  -- Get limit value (-1 means unlimited)
  limit_val := COALESCE((user_limits ->> p_limit_type)::integer, 0);
  
  -- Get current usage if not provided
  IF p_current_usage IS NULL THEN
    CASE p_limit_type
      WHEN 'max_listings' THEN
        SELECT COUNT(*) INTO current_val
        FROM listings
        WHERE provider_id = p_user_id AND status IN ('active', 'draft');
      WHEN 'max_bookings_per_month' THEN
        SELECT COUNT(*) INTO current_val
        FROM bookings
        WHERE provider_id = p_user_id 
          AND booking_date >= date_trunc('month', CURRENT_DATE)
          AND booking_date < date_trunc('month', CURRENT_DATE) + interval '1 month';
      ELSE
        current_val := 0;
    END CASE;
  ELSE
    current_val := p_current_usage;
  END IF;
  
  -- Return results
  RETURN QUERY SELECT
    (limit_val = -1 OR current_val < limit_val) as allowed,
    limit_val,
    current_val,
    CASE 
      WHEN limit_val = -1 THEN -1
      ELSE GREATEST(0, limit_val - current_val)
    END as remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track subscription usage
CREATE OR REPLACE FUNCTION update_subscription_usage(
  p_user_id UUID,
  p_metric TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  current_period_start DATE;
  current_period_end DATE;
BEGIN
  -- Get current billing period
  current_period_start := date_trunc('month', CURRENT_DATE)::DATE;
  current_period_end := (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::DATE;
  
  -- Insert or update usage record
  INSERT INTO subscription_usage (
    user_id, 
    subscription_id, 
    period_start, 
    period_end
  )
  SELECT 
    p_user_id,
    us.id,
    current_period_start,
    current_period_end
  FROM user_subscriptions us
  WHERE us.user_id = p_user_id 
    AND us.status IN ('trialing', 'active', 'past_due')
  ORDER BY us.created_at DESC
  LIMIT 1
  ON CONFLICT (user_id, period_start, period_end) 
  DO NOTHING;
  
  -- Update the specific metric
  CASE p_metric
    WHEN 'listings_created' THEN
      UPDATE subscription_usage 
      SET listings_created = listings_created + p_increment
      WHERE user_id = p_user_id 
        AND period_start = current_period_start 
        AND period_end = current_period_end;
    WHEN 'bookings_received' THEN
      UPDATE subscription_usage 
      SET bookings_received = bookings_received + p_increment
      WHERE user_id = p_user_id 
        AND period_start = current_period_start 
        AND period_end = current_period_end;
    WHEN 'bookings_completed' THEN
      UPDATE subscription_usage 
      SET bookings_completed = bookings_completed + p_increment
      WHERE user_id = p_user_id 
        AND period_start = current_period_start 
        AND period_end = current_period_end;
    WHEN 'ai_credits_used' THEN
      UPDATE subscription_usage 
      SET ai_credits_used = ai_credits_used + p_increment
      WHERE user_id = p_user_id 
        AND period_start = current_period_start 
        AND period_end = current_period_end;
  END CASE;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
