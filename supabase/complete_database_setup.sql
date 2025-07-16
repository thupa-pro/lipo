-- =====================================================
-- LOCONOMY PLATFORM - COMPLETE SUPABASE DATABASE SETUP
-- =====================================================
-- This script creates a complete database schema for the Loconomy platform
-- Run this script in your Supabase SQL editor or via CLI
-- 
-- Features included:
-- - User roles and permissions (RBAC)
-- - Multi-tenant workspaces
-- - Service listings and bookings
-- - Payment and subscription management
-- - Reviews and ratings
-- - Messages and notifications
-- - Analytics and tracking
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable RLS globally
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CUSTOM TYPES AND ENUMS
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('guest', 'consumer', 'provider', 'admin');

-- Onboarding steps
CREATE TYPE onboarding_step AS ENUM (
  'welcome',
  'profile_setup', 
  'preferences',
  'service_categories',
  'service_details',
  'pricing_setup',
  'availability',
  'completion'
);

-- Onboarding status
CREATE TYPE onboarding_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Service categories
CREATE TYPE service_category AS ENUM (
  'cleaning',
  'plumbing',
  'electrical',
  'handyman',
  'moving',
  'landscaping',
  'automotive',
  'technology',
  'tutoring',
  'fitness',
  'beauty',
  'pet_care',
  'event_planning',
  'photography',
  'other'
);

-- Booking status
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'in_progress', 
  'completed',
  'cancelled',
  'disputed'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'disputed'
);

-- Subscription status
CREATE TYPE subscription_status AS ENUM (
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid'
);

-- Subscription plans
CREATE TYPE subscription_plan AS ENUM ('free', 'starter', 'professional', 'enterprise');

-- Notification types
CREATE TYPE notification_type AS ENUM (
  'booking_request',
  'booking_confirmed',
  'booking_cancelled',
  'payment_received',
  'review_received',
  'message_received',
  'system_alert'
);

-- Message types
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');

-- Review types
CREATE TYPE review_type AS ENUM ('service_review', 'provider_review', 'consumer_review');

-- =====================================================
-- CORE USER MANAGEMENT TABLES
-- =====================================================

-- User roles and permissions
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'consumer',
  tenant_id UUID, -- For multi-tenant provider spaces
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- User preferences for consent and settings
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_preferences JSONB DEFAULT '{}'::jsonb,
  notification_settings JSONB DEFAULT '{
    "email_notifications": true,
    "push_notifications": true,
    "sms_notifications": false,
    "marketing_emails": false
  }'::jsonb,
  privacy_settings JSONB DEFAULT '{
    "profile_visibility": "public",
    "show_contact_info": false,
    "show_location": true
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-tenant workspaces for providers
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ONBOARDING SYSTEM
-- =====================================================

-- User onboarding progress tracking
CREATE TABLE user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  current_step onboarding_step DEFAULT 'welcome',
  completed_steps onboarding_step[] DEFAULT '{}',
  status onboarding_status DEFAULT 'not_started',
  data JSONB DEFAULT '{}', -- Store step-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consumer profiles
CREATE TABLE consumer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address JSONB, -- {street, city, state, zip, coordinates}
  preferences JSONB DEFAULT '{}', -- Service preferences
  emergency_contact JSONB, -- {name, phone, relationship}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider business profiles
CREATE TABLE provider_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT NOT NULL,
  full_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  service_radius INTEGER DEFAULT 25, -- in miles
  
  -- Business details
  business_address JSONB, -- {street, city, state, zip, coordinates}
  business_license TEXT,
  insurance_info JSONB, -- {provider, policy_number, expiry_date}
  certifications TEXT[],
  
  -- Settings
  availability JSONB DEFAULT '{}', -- Weekly schedule
  instant_booking BOOLEAN DEFAULT false,
  background_check_verified BOOLEAN DEFAULT false,
  
  -- Social links
  website_url TEXT,
  social_links JSONB DEFAULT '{}', -- {facebook, instagram, linkedin}
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SERVICE LISTINGS SYSTEM
-- =====================================================

-- Service categories master table
CREATE TABLE service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  color TEXT,
  parent_id UUID REFERENCES service_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service listings
CREATE TABLE service_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  subcategory_id UUID REFERENCES service_categories(id),
  
  -- Pricing
  pricing_type TEXT CHECK (pricing_type IN ('hourly', 'fixed', 'quote')) DEFAULT 'hourly',
  base_price DECIMAL(10,2),
  minimum_price DECIMAL(10,2),
  maximum_price DECIMAL(10,2),
  
  -- Service details
  duration_estimate INTEGER, -- in minutes
  service_area JSONB, -- Geographic service area
  requirements TEXT, -- What customer needs to provide
  included_services TEXT[], -- What's included
  additional_services JSONB DEFAULT '[]', -- Optional add-ons with pricing
  
  -- Media
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  instant_booking BOOLEAN DEFAULT false,
  requires_quote BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service listing images with metadata
CREATE TABLE listing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES service_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  file_size INTEGER, -- in bytes
  dimensions JSONB, -- {width: 1200, height: 800}
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BOOKING AND CALENDAR SYSTEM
-- =====================================================

-- Provider availability
CREATE TABLE provider_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Schedule
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time TIME,
  end_time TIME,
  
  -- Time off
  date_override DATE, -- Specific date override
  is_available BOOLEAN DEFAULT true,
  
  -- Booking settings
  buffer_time INTEGER DEFAULT 15, -- minutes between bookings
  max_bookings_per_slot INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking requests and confirmations
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE, -- Human-readable booking number
  
  -- Parties
  consumer_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID NOT NULL REFERENCES auth.users(id),
  listing_id UUID NOT NULL REFERENCES service_listings(id),
  
  -- Booking details
  status booking_status DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  estimated_duration INTEGER, -- in minutes
  
  -- Location
  service_address JSONB NOT NULL, -- Where service will be performed
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  additional_services JSONB DEFAULT '[]', -- Selected add-ons
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Communication
  special_instructions TEXT,
  consumer_notes TEXT,
  provider_notes TEXT,
  
  -- Status tracking
  confirmed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking status history for tracking
CREATE TABLE booking_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_status booking_status,
  new_status booking_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PAYMENT AND BILLING SYSTEM
-- =====================================================

-- Subscription plans
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
  features JSONB DEFAULT '{}', -- {priority_support: true, analytics: true}
  limits JSONB DEFAULT '{}', -- {max_listings: 10, max_bookings_per_month: 100}
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id subscription_plan NOT NULL,
  
  -- Stripe data
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT,
  
  -- Subscription details
  status subscription_status NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Usage tracking
  usage_data JSONB DEFAULT '{}', -- Track plan usage
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Related entities
  booking_id UUID REFERENCES bookings(id),
  subscription_id UUID REFERENCES user_subscriptions(id),
  
  -- Payment details
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status payment_status DEFAULT 'pending',
  
  -- Participants
  payer_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  
  -- Platform fees
  platform_fee DECIMAL(10,2) DEFAULT 0,
  processing_fee DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  payment_method JSONB, -- Stripe payment method details
  failure_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REVIEWS AND RATINGS SYSTEM
-- =====================================================

-- Reviews and ratings
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  reviewee_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Review content
  type review_type NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  content TEXT,
  
  -- Provider-specific ratings
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- Media
  photos TEXT[] DEFAULT '{}',
  
  -- Status
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  flagged_at TIMESTAMP WITH TIME ZONE,
  flagged_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review responses from providers
CREATE TABLE review_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MESSAGING SYSTEM
-- =====================================================

-- Message conversations
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id), -- Optional: conversation tied to booking
  
  -- Participants
  participant_1 UUID NOT NULL REFERENCES auth.users(id),
  participant_2 UUID NOT NULL REFERENCES auth.users(id),
  
  -- Metadata
  title TEXT, -- Optional conversation title
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(participant_1, participant_2, booking_id)
);

-- Individual messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message details
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  type message_type DEFAULT 'text',
  content TEXT NOT NULL,
  
  -- Media attachments
  attachments JSONB DEFAULT '[]', -- File URLs and metadata
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_system_message BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS SYSTEM
-- =====================================================

-- User notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification details
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Related entities
  booking_id UUID REFERENCES bookings(id),
  review_id UUID REFERENCES reviews(id),
  message_id UUID REFERENCES messages(id),
  
  -- Delivery
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Channels
  sent_email BOOLEAN DEFAULT false,
  sent_push BOOLEAN DEFAULT false,
  sent_sms BOOLEAN DEFAULT false,
  
  -- Metadata
  action_url TEXT, -- Deep link or URL to relevant page
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS AND TRACKING
-- =====================================================

-- User activity tracking
CREATE TABLE user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Activity details
  activity_type TEXT NOT NULL,
  entity_type TEXT, -- 'booking', 'listing', 'review', etc.
  entity_id UUID,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Metadata
  properties JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform analytics and metrics
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Event details
  event_name TEXT NOT NULL,
  event_category TEXT,
  
  -- User context
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  
  -- Technical context
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  
  -- Event data
  properties JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADMIN AND MODERATION
-- =====================================================

-- Content moderation flags
CREATE TABLE content_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Flagged content
  content_type TEXT NOT NULL, -- 'listing', 'review', 'message', 'profile'
  content_id UUID NOT NULL,
  
  -- Flag details
  flag_type TEXT NOT NULL, -- 'inappropriate', 'spam', 'fake', 'other'
  reason TEXT,
  
  -- Reporter
  reported_by UUID REFERENCES auth.users(id),
  
  -- Moderation
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs for admin monitoring
CREATE TABLE system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Log details
  level TEXT NOT NULL, -- 'info', 'warning', 'error', 'critical'
  message TEXT NOT NULL,
  component TEXT, -- 'auth', 'booking', 'payment', etc.
  
  -- Context
  user_id UUID REFERENCES auth.users(id),
  request_id TEXT,
  
  -- Technical details
  error_details JSONB,
  stack_trace TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User roles indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_tenant_id ON user_roles(tenant_id);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Tenants indexes
CREATE INDEX idx_tenants_owner_id ON tenants(owner_id);
CREATE INDEX idx_tenants_slug ON tenants(slug);

-- Service listings indexes
CREATE INDEX idx_service_listings_provider_id ON service_listings(provider_id);
CREATE INDEX idx_service_listings_category ON service_listings(category);
CREATE INDEX idx_service_listings_active ON service_listings(is_active);
CREATE INDEX idx_service_listings_location ON service_listings USING GIN (service_area);

-- Bookings indexes
CREATE INDEX idx_bookings_consumer_id ON bookings(consumer_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);

-- Reviews indexes
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_public ON reviews(is_public);

-- Messages indexes
CREATE INDEX idx_conversations_participants ON conversations(participant_1, participant_2);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Analytics indexes
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Full-text search indexes
CREATE INDEX idx_service_listings_search ON service_listings USING GIN (
  to_tsvector('english', title || ' ' || description)
);

CREATE INDEX idx_provider_profiles_search ON provider_profiles USING GIN (
  to_tsvector('english', business_name || ' ' || COALESCE(bio, ''))
);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Log completion
INSERT INTO system_logs (level, message, component) 
VALUES ('info', 'Database schema setup completed successfully', 'setup');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Loconomy database setup completed successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Run the RLS policies script';
  RAISE NOTICE '2. Run the functions and triggers script';
  RAISE NOTICE '3. Optionally run the seed data script';
END $$;
