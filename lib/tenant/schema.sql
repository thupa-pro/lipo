-- Loconomy Multi-Tenant Database Schema
-- AI-Native Services Marketplace with Row-Level Security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- 1️⃣ TENANT & WORKSPACE MANAGEMENT
-- ============================================

-- Tenants (Marketplace Hubs)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type tenant_type NOT NULL DEFAULT 'city',
    status tenant_status NOT NULL DEFAULT 'active',
    
    -- Location & Service Area
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    coordinates GEOGRAPHY(POINT) NOT NULL,
    service_radius_km INTEGER DEFAULT 50,
    
    -- Branding
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#8B5CF6',
    custom_domain VARCHAR(255),
    favicon_url TEXT,
    
    -- Settings
    settings JSONB DEFAULT '{}',
    features JSONB DEFAULT '{}',
    billing_config JSONB DEFAULT '{}',
    ai_config JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant types enum
CREATE TYPE tenant_type AS ENUM ('city', 'region', 'enterprise', 'global');
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'pending', 'archived');

-- ============================================
-- 2️⃣ USER MANAGEMENT & RBAC
-- ============================================

-- Enhanced Users table with tenant awareness
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMPTZ,
    
    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    phone VARCHAR(20),
    
    -- Tenant & Role
    primary_tenant_id UUID REFERENCES tenants(id),
    role user_role NOT NULL DEFAULT 'consumer',
    status user_status NOT NULL DEFAULT 'active',
    
    -- Auth
    password_hash TEXT,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires_at TIMESTAMPTZ,
    
    -- Consent & Privacy
    consent_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    
    -- AI Profile
    ai_profile JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    
    -- Timestamps
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles enum
CREATE TYPE user_role AS ENUM ('guest', 'consumer', 'provider', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- User Tenant Memberships (Multi-tenant support)
CREATE TABLE user_tenant_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    permissions JSONB DEFAULT '[]',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, tenant_id)
);

-- ============================================
-- 3️⃣ SERVICE CATEGORIES & LISTINGS
-- ============================================

-- Service Categories
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    parent_id UUID REFERENCES service_categories(id),
    
    -- AI Enhancement
    ai_keywords TEXT[],
    ai_description TEXT,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, slug)
);

-- Service Listings
CREATE TABLE service_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    provider_id UUID REFERENCES users(id) NOT NULL,
    category_id UUID REFERENCES service_categories(id),
    
    -- Core Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    tags TEXT[],
    
    -- AI Generated Flags
    ai_generated_title BOOLEAN DEFAULT false,
    ai_generated_description BOOLEAN DEFAULT false,
    ai_generated_tags BOOLEAN DEFAULT false,
    ai_generated_pricing BOOLEAN DEFAULT false,
    ai_optimization_score INTEGER DEFAULT 0,
    
    -- Pricing
    pricing_type pricing_type NOT NULL DEFAULT 'hourly',
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    pricing_packages JSONB DEFAULT '[]',
    
    -- Service Details
    duration_minutes INTEGER,
    service_location service_location_type DEFAULT 'on_site',
    service_area JSONB, -- GeoJSON for service coverage
    
    -- Availability
    availability_type availability_type DEFAULT 'scheduled',
    lead_time_hours INTEGER DEFAULT 24,
    max_advance_booking_days INTEGER DEFAULT 90,
    buffer_time_minutes INTEGER DEFAULT 30,
    
    -- Media
    images JSONB DEFAULT '[]',
    videos JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    
    -- Verification & Quality
    verification_level verification_level DEFAULT 'basic',
    verification_badges JSONB DEFAULT '[]',
    quality_score INTEGER DEFAULT 0,
    
    -- Performance Metrics
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    response_time_minutes INTEGER DEFAULT 0,
    
    -- SEO
    slug VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status & Lifecycle
    status listing_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    featured BOOLEAN DEFAULT false,
    promoted BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, slug)
);

-- Enums for listings
CREATE TYPE pricing_type AS ENUM ('fixed', 'hourly', 'custom', 'package');
CREATE TYPE service_location_type AS ENUM ('on_site', 'remote', 'both');
CREATE TYPE availability_type AS ENUM ('immediate', 'scheduled', 'flexible');
CREATE TYPE verification_level AS ENUM ('basic', 'verified', 'premium', 'elite');
CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'active', 'paused', 'rejected', 'archived');

-- ============================================
-- 4️⃣ BOOKING & ORDER MANAGEMENT
-- ============================================

-- Booking Orders
CREATE TABLE booking_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    listing_id UUID REFERENCES service_listings(id) NOT NULL,
    provider_id UUID REFERENCES users(id) NOT NULL,
    customer_id UUID REFERENCES users(id) NOT NULL,
    
    -- Booking Details
    service_date DATE NOT NULL,
    service_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    
    -- Location
    location_type booking_location_type NOT NULL,
    service_address JSONB,
    coordinates GEOGRAPHY(POINT),
    special_instructions TEXT,
    
    -- Pricing Breakdown
    subtotal DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) DEFAULT 0,
    tenant_commission DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    pricing_breakdown JSONB DEFAULT '[]',
    
    -- Payment
    payment_intent_id VARCHAR(255),
    payment_status payment_status DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    
    -- Status & Lifecycle
    status booking_status NOT NULL DEFAULT 'pending',
    confirmed_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- AI Insights
    ai_risk_score INTEGER DEFAULT 0,
    ai_success_probability INTEGER DEFAULT 0,
    ai_insights JSONB DEFAULT '{}',
    
    -- Notes & Communication
    customer_notes TEXT,
    provider_notes TEXT,
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking enums
CREATE TYPE booking_location_type AS ENUM ('customer_address', 'provider_location', 'remote', 'custom');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded');

-- ============================================
-- 5️⃣ PROVIDER PROFILES & VERIFICATION
-- ============================================

-- Provider Profiles
CREATE TABLE provider_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    
    -- Business Information
    business_name VARCHAR(255) NOT NULL,
    business_description TEXT,
    business_type VARCHAR(100),
    business_license VARCHAR(100),
    tax_id VARCHAR(50),
    
    -- Professional Details
    years_experience INTEGER DEFAULT 0,
    specialties TEXT[],
    certifications JSONB DEFAULT '[]',
    insurance_info JSONB DEFAULT '{}',
    
    -- Service Area
    service_area GEOGRAPHY(POLYGON),
    service_radius_km INTEGER DEFAULT 25,
    travel_fee DECIMAL(8,2) DEFAULT 0,
    
    -- Availability
    default_availability JSONB DEFAULT '{}',
    booking_preferences JSONB DEFAULT '{}',
    
    -- Verification
    verification_status verification_status DEFAULT 'pending',
    verification_level verification_level DEFAULT 'basic',
    verification_documents JSONB DEFAULT '[]',
    background_check_status VARCHAR(50),
    background_check_date TIMESTAMPTZ,
    
    -- Performance
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    response_time_minutes INTEGER DEFAULT 0,
    
    -- AI Coach Data
    ai_coach_insights JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    optimization_suggestions JSONB DEFAULT '[]',
    
    -- Business Settings
    auto_accept_bookings BOOLEAN DEFAULT false,
    instant_booking_enabled BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, tenant_id)
);

CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'verified', 'rejected', 'expired');

-- Provider Availability
CREATE TABLE provider_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    
    -- Regular Schedule
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    break_duration_minutes INTEGER DEFAULT 0,
    
    -- Timezone
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(provider_id, tenant_id, day_of_week, start_time)
);

-- Availability Overrides (holidays, vacation, etc.)
CREATE TABLE availability_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    availability_type override_type NOT NULL,
    reason VARCHAR(255),
    all_day BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(provider_id, tenant_id, date, start_time)
);

CREATE TYPE override_type AS ENUM ('unavailable', 'available', 'break', 'vacation');

-- ============================================
-- 6️⃣ BILLING & MONETIZATION
-- ============================================

-- Billing Accounts
CREATE TABLE billing_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    
    -- Account Type
    account_type billing_account_type NOT NULL,
    
    -- Stripe Integration
    stripe_customer_id VARCHAR(255),
    stripe_account_id VARCHAR(255), -- For providers
    
    -- Settings
    auto_payout BOOLEAN DEFAULT true,
    payout_schedule payout_schedule DEFAULT 'weekly',
    minimum_payout_amount DECIMAL(8,2) DEFAULT 25.00,
    
    -- Tax Information
    tax_id VARCHAR(50),
    business_type VARCHAR(100),
    tax_settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, tenant_id)
);

CREATE TYPE billing_account_type AS ENUM ('customer', 'provider', 'tenant');
CREATE TYPE payout_schedule AS ENUM ('daily', 'weekly', 'monthly');

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    billing_account_id UUID REFERENCES billing_accounts(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    
    -- Subscription Details
    plan_id VARCHAR(100) NOT NULL,
    stripe_subscription_id VARCHAR(255),
    status subscription_status NOT NULL,
    
    -- Pricing
    base_amount DECIMAL(8,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_interval billing_interval NOT NULL,
    
    -- Periods
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    
    -- Usage & Limits
    usage_metrics JSONB DEFAULT '{}',
    feature_limits JSONB DEFAULT '{}',
    
    -- AI Optimizations
    ai_recommendations JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ
);

CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid');
CREATE TYPE billing_interval AS ENUM ('month', 'year');

-- Billing Transactions
CREATE TABLE billing_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    billing_account_id UUID REFERENCES billing_accounts(id),
    booking_order_id UUID REFERENCES booking_orders(id),
    
    -- Transaction Details
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    
    -- External References
    stripe_payment_intent_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    
    -- Status
    status transaction_status NOT NULL DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    
    -- Fees & Commission
    platform_fee DECIMAL(8,2) DEFAULT 0,
    tenant_commission DECIMAL(8,2) DEFAULT 0,
    stripe_fee DECIMAL(8,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE transaction_type AS ENUM ('payment', 'payout', 'refund', 'fee', 'commission', 'subscription');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- ============================================
-- 7️⃣ REVIEWS & RATINGS
-- ============================================

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    booking_order_id UUID REFERENCES booking_orders(id) NOT NULL,
    reviewer_id UUID REFERENCES users(id) NOT NULL,
    reviewee_id UUID REFERENCES users(id) NOT NULL,
    
    -- Review Content
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    category_ratings JSONB DEFAULT '{}', -- {communication: 5, quality: 4, etc.}
    title VARCHAR(255),
    comment TEXT,
    
    -- AI Analysis
    ai_sentiment_score DECIMAL(3,2), -- -1 to 1
    ai_sentiment_label sentiment_label,
    ai_summary TEXT,
    ai_topics TEXT[],
    
    -- Moderation
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    moderation_status moderation_status DEFAULT 'pending',
    moderation_notes TEXT,
    
    -- Helpful votes
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- Response
    response_text TEXT,
    response_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(booking_order_id, reviewer_id)
);

CREATE TYPE sentiment_label AS ENUM ('negative', 'neutral', 'positive');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- ============================================
-- 8️⃣ COMMUNICATION & MESSAGING
-- ============================================

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    booking_order_id UUID REFERENCES booking_orders(id),
    
    -- Participants
    participant_ids UUID[] NOT NULL,
    
    -- Conversation Details
    title VARCHAR(255),
    type conversation_type DEFAULT 'booking',
    status conversation_status DEFAULT 'active',
    
    -- Last Activity
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    
    -- AI Features
    ai_summary TEXT,
    ai_sentiment sentiment_label,
    auto_responses_enabled BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE conversation_type AS ENUM ('booking', 'support', 'general');
CREATE TYPE conversation_status AS ENUM ('active', 'archived', 'closed');

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    
    -- Message Details
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    
    -- AI Generated
    is_ai_generated BOOLEAN DEFAULT false,
    ai_context JSONB,
    
    -- Attachments
    attachments JSONB DEFAULT '[]',
    
    -- Status
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_by JSONB DEFAULT '{}', -- {user_id: timestamp}
    
    -- Moderation
    moderation_status moderation_status DEFAULT 'approved',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE message_type AS ENUM ('text', 'image', 'document', 'system', 'ai_response');

-- ============================================
-- 9️⃣ NOTIFICATIONS & ALERTS
-- ============================================

-- Notification Templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    
    -- Template Details
    name VARCHAR(255) NOT NULL,
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    
    -- Content
    subject VARCHAR(255),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    
    -- AI Features
    ai_personalized BOOLEAN DEFAULT false,
    ai_optimized BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tenant_id, name, type, channel)
);

CREATE TYPE notification_type AS ENUM (
    'booking_confirmation', 'booking_reminder', 'booking_cancelled',
    'message_received', 'review_request', 'payment_completed',
    'verification_required', 'ai_insight', 'system_alert'
);
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push', 'in_app', 'webhook');

-- User Notifications
CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB DEFAULT '{}',
    
    -- Channels
    channels notification_channel[] DEFAULT '{}',
    
    -- Status
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    
    -- References
    related_booking_id UUID REFERENCES booking_orders(id),
    related_listing_id UUID REFERENCES service_listings(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 🔟 AI & ANALYTICS
-- ============================================

-- AI Insights
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    user_id UUID REFERENCES users(id),
    
    -- Insight Details
    type insight_type NOT NULL,
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Impact & Confidence
    impact insight_impact NOT NULL,
    confidence DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
    
    -- Data
    data JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    
    -- Status
    is_actionable BOOLEAN DEFAULT true,
    is_read BOOLEAN DEFAULT false,
    is_implemented BOOLEAN DEFAULT false,
    
    -- References
    related_listing_id UUID REFERENCES service_listings(id),
    related_booking_id UUID REFERENCES booking_orders(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TYPE insight_type AS ENUM (
    'pricing_optimization', 'demand_forecast', 'competitor_analysis',
    'performance_improvement', 'market_opportunity', 'risk_assessment'
);
CREATE TYPE insight_impact AS ENUM ('low', 'medium', 'high', 'critical');

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    
    -- Event Details
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    properties JSONB DEFAULT '{}',
    
    -- Context
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    
    -- Geographic
    country VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    
    -- Device
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 📊 INDEXES FOR PERFORMANCE
-- ============================================

-- Tenant-based indexes
CREATE INDEX idx_users_tenant_id ON users(primary_tenant_id);
CREATE INDEX idx_service_listings_tenant_provider ON service_listings(tenant_id, provider_id);
CREATE INDEX idx_booking_orders_tenant_status ON booking_orders(tenant_id, status);
CREATE INDEX idx_provider_profiles_tenant_user ON provider_profiles(tenant_id, user_id);

-- Geographic indexes
CREATE INDEX idx_tenants_coordinates ON tenants USING GIST(coordinates);
CREATE INDEX idx_booking_orders_coordinates ON booking_orders USING GIST(coordinates);
CREATE INDEX idx_provider_profiles_service_area ON provider_profiles USING GIST(service_area);

-- Performance indexes
CREATE INDEX idx_service_listings_status_featured ON service_listings(status, featured) WHERE status = 'active';
CREATE INDEX idx_booking_orders_dates ON booking_orders(service_date, service_time);
CREATE INDEX idx_reviews_rating_public ON reviews(overall_rating, is_public) WHERE is_public = true;
CREATE INDEX idx_messages_conversation_sent ON messages(conversation_id, sent_at);

-- Search indexes
CREATE INDEX idx_service_listings_search ON service_listings USING GIN(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_service_categories_search ON service_categories USING GIN(to_tsvector('english', name || ' ' || description));

-- AI and analytics indexes
CREATE INDEX idx_ai_insights_user_type ON ai_insights(user_id, type, created_at);
CREATE INDEX idx_analytics_events_tenant_type_time ON analytics_events(tenant_id, event_type, created_at);

-- ============================================
-- 🔐 ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tenant-aware tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY tenant_isolation_service_listings ON service_listings
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_booking_orders ON booking_orders
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_provider_profiles ON provider_profiles
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- User-based access policies
CREATE POLICY user_access_own_data ON users
    FOR ALL USING (id = current_setting('app.current_user_id')::UUID);

CREATE POLICY provider_access_own_listings ON service_listings
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id')::UUID AND
        (provider_id = current_setting('app.current_user_id')::UUID OR 
         current_setting('app.current_user_role') = 'admin')
    );

CREATE POLICY user_access_own_bookings ON booking_orders
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id')::UUID AND
        (customer_id = current_setting('app.current_user_id')::UUID OR 
         provider_id = current_setting('app.current_user_id')::UUID OR
         current_setting('app.current_user_role') = 'admin')
    );

-- Public read access for listings (with tenant isolation)
CREATE POLICY public_read_active_listings ON service_listings
    FOR SELECT USING (
        tenant_id = current_setting('app.current_tenant_id')::UUID AND
        status = 'active'
    );

-- Admin full access
CREATE POLICY admin_full_access_all_tables ON service_listings
    FOR ALL USING (current_setting('app.current_user_role') = 'admin');

-- Apply similar admin policies to other tables
CREATE POLICY admin_full_access_booking_orders ON booking_orders
    FOR ALL USING (current_setting('app.current_user_role') = 'admin');

CREATE POLICY admin_full_access_provider_profiles ON provider_profiles
    FOR ALL USING (current_setting('app.current_user_role') = 'admin');

-- ============================================
-- 🔧 HELPER FUNCTIONS
-- ============================================

-- Function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id UUID, user_id UUID DEFAULT NULL, user_role TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_id::TEXT, true);
    IF user_id IS NOT NULL THEN
        PERFORM set_config('app.current_user_id', user_id::TEXT, true);
    END IF;
    IF user_role IS NOT NULL THEN
        PERFORM set_config('app.current_user_role', user_role, true);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's tenant memberships
CREATE OR REPLACE FUNCTION get_user_tenant_memberships(user_uuid UUID)
RETURNS TABLE(tenant_id UUID, role user_role, status TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT utm.tenant_id, utm.role, utm.status
    FROM user_tenant_memberships utm
    WHERE utm.user_id = user_uuid AND utm.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to calculate service listing metrics
CREATE OR REPLACE FUNCTION update_listing_metrics(listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE service_listings SET
        rating = (
            SELECT COALESCE(AVG(overall_rating), 0)
            FROM reviews r
            JOIN booking_orders bo ON r.booking_order_id = bo.id
            WHERE bo.listing_id = listing_uuid AND r.is_public = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews r
            JOIN booking_orders bo ON r.booking_order_id = bo.id
            WHERE bo.listing_id = listing_uuid AND r.is_public = true
        ),
        booking_count = (
            SELECT COUNT(*)
            FROM booking_orders bo
            WHERE bo.listing_id = listing_uuid
        ),
        completion_count = (
            SELECT COUNT(*)
            FROM booking_orders bo
            WHERE bo.listing_id = listing_uuid AND bo.status = 'completed'
        )
    WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate provider metrics
CREATE OR REPLACE FUNCTION update_provider_metrics(provider_uuid UUID, tenant_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE provider_profiles SET
        rating = (
            SELECT COALESCE(AVG(r.overall_rating), 0)
            FROM reviews r
            JOIN booking_orders bo ON r.booking_order_id = bo.id
            WHERE bo.provider_id = provider_uuid 
            AND bo.tenant_id = tenant_uuid 
            AND r.is_public = true
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews r
            JOIN booking_orders bo ON r.booking_order_id = bo.id
            WHERE bo.provider_id = provider_uuid 
            AND bo.tenant_id = tenant_uuid 
            AND r.is_public = true
        ),
        total_bookings = (
            SELECT COUNT(*)
            FROM booking_orders bo
            WHERE bo.provider_id = provider_uuid AND bo.tenant_id = tenant_uuid
        ),
        completion_rate = (
            SELECT CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE (COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*))
            END
            FROM booking_orders bo
            WHERE bo.provider_id = provider_uuid AND bo.tenant_id = tenant_uuid
        )
    WHERE user_id = provider_uuid AND tenant_id = tenant_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 🚀 TRIGGERS FOR AUTOMATION
-- ============================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to relevant tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_listings_updated_at BEFORE UPDATE ON service_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_orders_updated_at BEFORE UPDATE ON booking_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update metrics when reviews are added/updated
CREATE OR REPLACE FUNCTION trigger_update_metrics()
RETURNS TRIGGER AS $$
DECLARE
    listing_uuid UUID;
    provider_uuid UUID;
    tenant_uuid UUID;
BEGIN
    -- Get related IDs from booking order
    SELECT bo.listing_id, bo.provider_id, bo.tenant_id
    INTO listing_uuid, provider_uuid, tenant_uuid
    FROM booking_orders bo
    WHERE bo.id = COALESCE(NEW.booking_order_id, OLD.booking_order_id);
    
    -- Update listing metrics
    IF listing_uuid IS NOT NULL THEN
        PERFORM update_listing_metrics(listing_uuid);
    END IF;
    
    -- Update provider metrics
    IF provider_uuid IS NOT NULL AND tenant_uuid IS NOT NULL THEN
        PERFORM update_provider_metrics(provider_uuid, tenant_uuid);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_metrics AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_metrics();

CREATE TRIGGER bookings_update_metrics AFTER INSERT OR UPDATE ON booking_orders
    FOR EACH ROW EXECUTE FUNCTION trigger_update_metrics();

-- ============================================
-- 📝 SAMPLE DATA FOR DEVELOPMENT
-- ============================================

-- Insert sample tenant
INSERT INTO tenants (name, slug, city, state, country, coordinates) VALUES
('San Francisco Local', 'sf-local', 'San Francisco', 'California', 'USA', ST_Point(-122.4194, 37.7749));

-- Insert sample categories
INSERT INTO service_categories (tenant_id, name, slug, description, icon) VALUES
((SELECT id FROM tenants WHERE slug = 'sf-local'), 'Home Cleaning', 'home-cleaning', 'Professional home cleaning services', '🧹'),
((SELECT id FROM tenants WHERE slug = 'sf-local'), 'Pet Care', 'pet-care', 'Dog walking, pet sitting, and more', '🐕'),
((SELECT id FROM tenants WHERE slug = 'sf-local'), 'Handyman', 'handyman', 'Home repairs and maintenance', '🔧');

-- ============================================
-- 🎯 SUMMARY
-- ============================================

/*
This comprehensive schema provides:

✅ Multi-tenant architecture with proper isolation
✅ Full RBAC system with role-based access
✅ AI-native features throughout (AI insights, generated content, coaching)
✅ Complete booking and order management
✅ Provider verification and profiles
✅ Billing and monetization with Stripe integration
✅ Communication and messaging system
✅ Review and rating system with AI analysis
✅ Notification system with multiple channels
✅ Analytics and AI insights
✅ Geographic support with PostGIS
✅ Row-level security for data protection
✅ Performance optimized indexes
✅ Automated triggers for data consistency
✅ Helper functions for common operations

This schema is specifically engineered for Loconomy's vision as an AI-native,
multi-tenant services marketplace with hyperlocal focus.
*/