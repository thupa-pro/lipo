-- =====================================================
-- LOCONOMY PLATFORM - ROW LEVEL SECURITY POLICIES
-- =====================================================
-- This script creates comprehensive RLS policies for all tables
-- Run this after the main database setup script
-- 
-- Security principles:
-- - Users can only access their own data or public data
-- - Providers can manage their own listings and bookings
-- - Admins have elevated access for moderation
-- - Multi-tenant isolation for provider workspaces
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS FOR ROLE CHECKING
-- =====================================================

-- Function to get user's role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role_result TEXT;
BEGIN
  SELECT role INTO user_role_result
  FROM user_roles
  WHERE user_id = user_uuid::TEXT;
  
  RETURN COALESCE(user_role_result, 'guest');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is provider
CREATE OR REPLACE FUNCTION is_provider()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(auth.uid()) IN ('provider', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check tenant membership
CREATE OR REPLACE FUNCTION is_tenant_member(tenant_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()::TEXT
    AND ur.tenant_id = tenant_uuid
  ) OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USER ROLES AND PERMISSIONS POLICIES
-- =====================================================

-- Users can view their own role
CREATE POLICY "users_can_view_own_role" ON user_roles
  FOR SELECT USING (auth.uid()::TEXT = user_id);

-- Admins can view all roles
CREATE POLICY "admins_can_view_all_roles" ON user_roles
  FOR SELECT USING (is_admin());

-- Admins can manage roles
CREATE POLICY "admins_can_insert_roles" ON user_roles
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "admins_can_update_roles" ON user_roles
  FOR UPDATE USING (is_admin());

-- =====================================================
-- USER PREFERENCES POLICIES
-- =====================================================

-- Users can manage their own preferences
CREATE POLICY "users_can_manage_own_preferences" ON user_preferences
  FOR ALL USING (auth.uid()::TEXT = user_id);

-- =====================================================
-- TENANTS POLICIES
-- =====================================================

-- Users can view tenants they belong to or own
CREATE POLICY "users_can_view_accessible_tenants" ON tenants
  FOR SELECT USING (
    owner_id = auth.uid()::TEXT OR
    is_tenant_member(id) OR
    is_admin()
  );

-- Providers and admins can create tenants
CREATE POLICY "providers_can_create_tenants" ON tenants
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()::TEXT AND
    is_provider()
  );

-- Owners can update their tenants
CREATE POLICY "owners_can_update_tenants" ON tenants
  FOR UPDATE USING (owner_id = auth.uid()::TEXT OR is_admin());

-- =====================================================
-- ONBOARDING POLICIES
-- =====================================================

-- Users can manage their own onboarding
CREATE POLICY "users_can_manage_own_onboarding" ON user_onboarding
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PROFILE POLICIES
-- =====================================================

-- Consumer profiles
CREATE POLICY "users_can_view_consumer_profiles" ON consumer_profiles
  FOR SELECT USING (
    auth.uid() = user_id OR -- Own profile
    is_admin() -- Admin access
  );

CREATE POLICY "users_can_manage_own_consumer_profile" ON consumer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_consumer_profile" ON consumer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Provider profiles (more open for discovery)
CREATE POLICY "anyone_can_view_provider_profiles" ON provider_profiles
  FOR SELECT USING (true); -- Public profiles for discovery

CREATE POLICY "providers_can_manage_own_profile" ON provider_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_provider());

CREATE POLICY "providers_can_update_own_profile" ON provider_profiles
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- =====================================================
-- SERVICE CATEGORIES POLICIES
-- =====================================================

-- Anyone can view service categories
CREATE POLICY "anyone_can_view_service_categories" ON service_categories
  FOR SELECT USING (is_active = true);

-- Only admins can manage categories
CREATE POLICY "admins_can_manage_service_categories" ON service_categories
  FOR ALL USING (is_admin());

-- =====================================================
-- SERVICE LISTINGS POLICIES
-- =====================================================

-- Anyone can view active public listings
CREATE POLICY "anyone_can_view_active_listings" ON service_listings
  FOR SELECT USING (is_active = true);

-- Providers can manage their own listings
CREATE POLICY "providers_can_manage_own_listings" ON service_listings
  FOR INSERT WITH CHECK (auth.uid() = provider_id AND is_provider());

CREATE POLICY "providers_can_update_own_listings" ON service_listings
  FOR UPDATE USING (auth.uid() = provider_id OR is_admin());

CREATE POLICY "providers_can_delete_own_listings" ON service_listings
  FOR DELETE USING (auth.uid() = provider_id OR is_admin());

-- =====================================================
-- LISTING IMAGES POLICIES
-- =====================================================

-- Anyone can view images for public listings
CREATE POLICY "anyone_can_view_listing_images" ON listing_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM service_listings sl
      WHERE sl.id = listing_id AND sl.is_active = true
    )
  );

-- Providers can manage images for their own listings
CREATE POLICY "providers_can_manage_own_listing_images" ON listing_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM service_listings sl
      WHERE sl.id = listing_id 
      AND (sl.provider_id = auth.uid() OR is_admin())
    )
  );

-- =====================================================
-- PROVIDER AVAILABILITY POLICIES
-- =====================================================

-- Providers can manage their own availability
CREATE POLICY "providers_can_manage_own_availability" ON provider_availability
  FOR ALL USING (auth.uid() = provider_id OR is_admin());

-- Anyone can view provider availability (for booking)
CREATE POLICY "anyone_can_view_provider_availability" ON provider_availability
  FOR SELECT USING (is_available = true);

-- =====================================================
-- BOOKINGS POLICIES
-- =====================================================

-- Users can view bookings they're involved in
CREATE POLICY "users_can_view_own_bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = consumer_id OR
    auth.uid() = provider_id OR
    is_admin()
  );

-- Consumers can create bookings
CREATE POLICY "consumers_can_create_bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = consumer_id);

-- Involved parties can update bookings
CREATE POLICY "involved_parties_can_update_bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = consumer_id OR
    auth.uid() = provider_id OR
    is_admin()
  );

-- =====================================================
-- BOOKING STATUS HISTORY POLICIES
-- =====================================================

-- Users can view status history for their bookings
CREATE POLICY "users_can_view_booking_status_history" ON booking_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_id
      AND (b.consumer_id = auth.uid() OR b.provider_id = auth.uid())
    ) OR is_admin()
  );

-- System can insert status history
CREATE POLICY "system_can_insert_booking_status_history" ON booking_status_history
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- SUBSCRIPTION PLANS POLICIES
-- =====================================================

-- Anyone can view active subscription plans
CREATE POLICY "anyone_can_view_subscription_plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Only admins can manage plans
CREATE POLICY "admins_can_manage_subscription_plans" ON subscription_plans
  FOR ALL USING (is_admin());

-- =====================================================
-- USER SUBSCRIPTIONS POLICIES
-- =====================================================

-- Users can view their own subscriptions
CREATE POLICY "users_can_view_own_subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- System can manage subscriptions (for Stripe webhooks)
CREATE POLICY "system_can_manage_subscriptions" ON user_subscriptions
  FOR ALL USING (true);

-- =====================================================
-- PAYMENTS POLICIES
-- =====================================================

-- Users can view their own payments
CREATE POLICY "users_can_view_own_payments" ON payments
  FOR SELECT USING (
    auth.uid() = payer_id OR
    auth.uid() = recipient_id OR
    is_admin()
  );

-- System can manage payments (for Stripe webhooks)
CREATE POLICY "system_can_manage_payments" ON payments
  FOR ALL USING (true);

-- =====================================================
-- REVIEWS POLICIES
-- =====================================================

-- Anyone can view public reviews
CREATE POLICY "anyone_can_view_public_reviews" ON reviews
  FOR SELECT USING (is_public = true);

-- Users can view reviews they wrote or received
CREATE POLICY "users_can_view_own_reviews" ON reviews
  FOR SELECT USING (
    auth.uid() = reviewer_id OR
    auth.uid() = reviewee_id OR
    is_admin()
  );

-- Users can create reviews for their bookings
CREATE POLICY "users_can_create_reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_id
      AND (b.consumer_id = auth.uid() OR b.provider_id = auth.uid())
      AND b.status = 'completed'
    )
  );

-- Users can update their own reviews
CREATE POLICY "users_can_update_own_reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewer_id OR is_admin());

-- =====================================================
-- REVIEW RESPONSES POLICIES
-- =====================================================

-- Anyone can view responses to public reviews
CREATE POLICY "anyone_can_view_review_responses" ON review_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reviews r
      WHERE r.id = review_id AND r.is_public = true
    )
  );

-- Reviewees can respond to their reviews
CREATE POLICY "reviewees_can_respond_to_reviews" ON review_responses
  FOR INSERT WITH CHECK (
    auth.uid() = responder_id AND
    EXISTS (
      SELECT 1 FROM reviews r
      WHERE r.id = review_id AND r.reviewee_id = auth.uid()
    )
  );

-- =====================================================
-- CONVERSATIONS POLICIES
-- =====================================================

-- Users can view conversations they're part of
CREATE POLICY "users_can_view_own_conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = participant_1 OR
    auth.uid() = participant_2 OR
    is_admin()
  );

-- Users can create conversations
CREATE POLICY "users_can_create_conversations" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

-- =====================================================
-- MESSAGES POLICIES
-- =====================================================

-- Users can view messages in their conversations
CREATE POLICY "users_can_view_own_messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    ) OR is_admin()
  );

-- Users can send messages in their conversations
CREATE POLICY "users_can_send_messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    )
  );

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "users_can_view_own_notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- System can create notifications
CREATE POLICY "system_can_create_notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "users_can_update_own_notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- ANALYTICS POLICIES
-- =====================================================

-- Users can view their own activities
CREATE POLICY "users_can_view_own_activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- System can track activities
CREATE POLICY "system_can_track_activities" ON user_activities
  FOR INSERT WITH CHECK (true);

-- Admins can view analytics events
CREATE POLICY "admins_can_view_analytics_events" ON analytics_events
  FOR SELECT USING (is_admin());

-- System can track analytics events
CREATE POLICY "system_can_track_analytics_events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- CONTENT MODERATION POLICIES
-- =====================================================

-- Users can view flags they created
CREATE POLICY "users_can_view_own_flags" ON content_flags
  FOR SELECT USING (auth.uid() = reported_by OR is_admin());

-- Users can create content flags
CREATE POLICY "users_can_create_flags" ON content_flags
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Admins can manage all flags
CREATE POLICY "admins_can_manage_flags" ON content_flags
  FOR UPDATE USING (is_admin());

-- =====================================================
-- SYSTEM LOGS POLICIES
-- =====================================================

-- Only admins can view system logs
CREATE POLICY "admins_can_view_system_logs" ON system_logs
  FOR SELECT USING (is_admin());

-- System can create logs
CREATE POLICY "system_can_create_logs" ON system_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Log completion
INSERT INTO system_logs (level, message, component) 
VALUES ('info', 'RLS policies setup completed successfully', 'rls_setup');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies setup completed successfully!';
  RAISE NOTICE 'All tables now have proper row-level security policies.';
  RAISE NOTICE 'Next: Run the functions and triggers script for automated features.';
END $$;
