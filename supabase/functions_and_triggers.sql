-- =====================================================
-- LOCONOMY PLATFORM - DATABASE FUNCTIONS AND TRIGGERS
-- =====================================================
-- This script creates automated functions and triggers
-- Run this after the database setup and RLS policies scripts
-- 
-- Features included:
-- - Automatic user profile creation
-- - Timestamp management
-- - Booking number generation
-- - Notification automation
-- - Analytics tracking
-- - Data validation
-- =====================================================

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
  booking_num TEXT;
  prefix TEXT := 'LCN';
  year_part TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
  random_part TEXT;
BEGIN
  -- Generate random 6-digit number
  random_part := LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0');
  booking_num := prefix || '-' || year_part || '-' || random_part;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM bookings WHERE booking_number = booking_num) LOOP
    random_part := LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0');
    booking_num := prefix || '-' || year_part || '-' || random_part;
  END LOOP;
  
  RETURN booking_num;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 FLOAT,
  lon1 FLOAT,
  lat2 FLOAT,
  lon2 FLOAT
)
RETURNS FLOAT AS $$
DECLARE
  earth_radius FLOAT := 3959; -- miles
  dlat FLOAT;
  dlon FLOAT;
  a FLOAT;
  c FLOAT;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- USER MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user role entry (default: consumer)
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id::TEXT, 'consumer');
  
  -- Create user preferences entry
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Create onboarding entry
  INSERT INTO user_onboarding (user_id, role)
  VALUES (NEW.id, 'consumer');
  
  -- Log the user creation
  INSERT INTO system_logs (level, message, component, user_id)
  VALUES ('info', 'New user account created', 'auth', NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user role and create appropriate profile
CREATE OR REPLACE FUNCTION update_user_role_and_profile(
  target_user_id UUID,
  new_role user_role
)
RETURNS VOID AS $$
BEGIN
  -- Update user role
  UPDATE user_roles 
  SET role = new_role, updated_at = NOW()
  WHERE user_id = target_user_id::TEXT;
  
  -- Create appropriate profile based on role
  IF new_role = 'provider' THEN
    -- Create provider profile if it doesn't exist
    INSERT INTO provider_profiles (user_id, business_name, phone)
    VALUES (target_user_id, 'New Business', '')
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update onboarding for provider flow
    UPDATE user_onboarding 
    SET role = 'provider', current_step = 'profile_setup'
    WHERE user_id = target_user_id;
    
  ELSIF new_role = 'consumer' THEN
    -- Create consumer profile if it doesn't exist
    INSERT INTO consumer_profiles (user_id)
    VALUES (target_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  -- Log the role change
  INSERT INTO system_logs (level, message, component, user_id)
  VALUES ('info', 'User role updated to ' || new_role::TEXT, 'rbac', target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BOOKING MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to handle booking creation
CREATE OR REPLACE FUNCTION handle_booking_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate booking number if not provided
  IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
    NEW.booking_number := generate_booking_number();
  END IF;
  
  -- Create initial status history entry
  INSERT INTO booking_status_history (booking_id, new_status, changed_by)
  VALUES (NEW.id, NEW.status, NEW.consumer_id);
  
  -- Create conversation between consumer and provider
  INSERT INTO conversations (participant_1, participant_2, booking_id)
  VALUES (NEW.consumer_id, NEW.provider_id, NEW.id)
  ON CONFLICT (participant_1, participant_2, booking_id) DO NOTHING;
  
  -- Send notification to provider
  INSERT INTO notifications (
    user_id, type, title, message, booking_id
  ) VALUES (
    NEW.provider_id,
    'booking_request',
    'New Booking Request',
    'You have received a new booking request for ' || 
    (SELECT title FROM service_listings WHERE id = NEW.listing_id),
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle booking status changes
CREATE OR REPLACE FUNCTION handle_booking_status_change()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_user_id UUID;
BEGIN
  -- Only proceed if status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Set timestamp based on new status
  CASE NEW.status
    WHEN 'confirmed' THEN
      NEW.confirmed_at := NOW();
    WHEN 'in_progress' THEN
      NEW.started_at := NOW();
    WHEN 'completed' THEN
      NEW.completed_at := NOW();
    WHEN 'cancelled' THEN
      NEW.cancelled_at := NOW();
  END CASE;
  
  -- Create status history entry
  INSERT INTO booking_status_history (
    booking_id, old_status, new_status, changed_by
  ) VALUES (
    NEW.id, OLD.status, NEW.status, auth.uid()
  );
  
  -- Determine notification recipient and content
  CASE NEW.status
    WHEN 'confirmed' THEN
      notification_user_id := NEW.consumer_id;
      notification_title := 'Booking Confirmed';
      notification_message := 'Your booking has been confirmed by the provider.';
    WHEN 'cancelled' THEN
      -- Notify the other party
      notification_user_id := CASE 
        WHEN NEW.cancelled_by = NEW.consumer_id THEN NEW.provider_id
        ELSE NEW.consumer_id
      END;
      notification_title := 'Booking Cancelled';
      notification_message := 'A booking has been cancelled.';
    WHEN 'completed' THEN
      notification_user_id := NEW.consumer_id;
      notification_title := 'Service Completed';
      notification_message := 'Your service has been marked as completed. Please leave a review!';
  END CASE;
  
  -- Send notification if applicable
  IF notification_user_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id, type, title, message, booking_id
    ) VALUES (
      notification_user_id,
      'booking_' || NEW.status,
      notification_title,
      notification_message,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- REVIEW MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to handle review creation
CREATE OR REPLACE FUNCTION handle_review_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Send notification to reviewee
  INSERT INTO notifications (
    user_id, type, title, message, review_id
  ) VALUES (
    NEW.reviewee_id,
    'review_received',
    'New Review Received',
    'You have received a new ' || NEW.rating || '-star review.',
    NEW.id
  );
  
  -- Update provider's average rating if this is a service review
  IF NEW.type = 'service_review' THEN
    -- This would be handled by a separate analytics function
    PERFORM update_provider_rating(NEW.reviewee_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update provider's average rating
CREATE OR REPLACE FUNCTION update_provider_rating(provider_user_id UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  total_reviews INTEGER;
BEGIN
  -- Calculate average rating from all reviews for this provider
  SELECT 
    AVG(rating)::DECIMAL(3,2),
    COUNT(*)
  INTO avg_rating, total_reviews
  FROM reviews 
  WHERE reviewee_id = provider_user_id 
    AND type = 'service_review' 
    AND is_public = true;
  
  -- Update provider profile with new rating
  UPDATE provider_profiles 
  SET 
    updated_at = NOW()
  WHERE user_id = provider_user_id;
  
  -- You could store the rating in a dedicated field if needed
  -- For now, ratings are calculated dynamically
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MESSAGING FUNCTIONS
-- =====================================================

-- Function to handle new message creation
CREATE OR REPLACE FUNCTION handle_message_creation()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
BEGIN
  -- Update conversation last message timestamp
  UPDATE conversations 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  -- Determine recipient (the other participant)
  SELECT 
    CASE 
      WHEN participant_1 = NEW.sender_id THEN participant_2
      ELSE participant_1
    END
  INTO recipient_id
  FROM conversations 
  WHERE id = NEW.conversation_id;
  
  -- Send notification to recipient
  IF recipient_id IS NOT NULL AND NOT NEW.is_system_message THEN
    INSERT INTO notifications (
      user_id, type, title, message, message_id
    ) VALUES (
      recipient_id,
      'message_received',
      'New Message',
      LEFT(NEW.content, 100) || CASE WHEN LENGTH(NEW.content) > 100 THEN '...' ELSE '' END,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ANALYTICS FUNCTIONS
-- =====================================================

-- Function to track user activity
CREATE OR REPLACE FUNCTION track_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_properties JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_activities (
    user_id, activity_type, entity_type, entity_id, properties
  ) VALUES (
    p_user_id, p_activity_type, p_entity_type, p_entity_id, p_properties
  );
END;
$$ LANGUAGE plpgsql;

-- Function to track analytics events
CREATE OR REPLACE FUNCTION track_analytics_event(
  p_event_name TEXT,
  p_event_category TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_properties JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO analytics_events (
    event_name, event_category, user_id, properties
  ) VALUES (
    p_event_name, p_event_category, p_user_id, p_properties
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NOTIFICATION FUNCTIONS
-- =====================================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_booking_id UUID DEFAULT NULL,
  p_review_id UUID DEFAULT NULL,
  p_message_id UUID DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id, type, title, message, booking_id, review_id, message_id, action_url, metadata
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_booking_id, p_review_id, p_message_id, p_action_url, p_metadata
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEARCH FUNCTIONS
-- =====================================================

-- Function to search service listings
CREATE OR REPLACE FUNCTION search_service_listings(
  search_term TEXT DEFAULT NULL,
  category_filter service_category DEFAULT NULL,
  location_lat FLOAT DEFAULT NULL,
  location_lng FLOAT DEFAULT NULL,
  max_distance INTEGER DEFAULT 25,
  min_rating FLOAT DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  sort_by TEXT DEFAULT 'relevance'
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category service_category,
  base_price DECIMAL,
  provider_name TEXT,
  distance FLOAT,
  avg_rating FLOAT,
  review_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.id,
    sl.title,
    sl.description,
    sl.category,
    sl.base_price,
    pp.business_name as provider_name,
    CASE 
      WHEN location_lat IS NOT NULL AND location_lng IS NOT NULL THEN
        calculate_distance(
          location_lat, 
          location_lng,
          (sl.service_area->>'lat')::FLOAT,
          (sl.service_area->>'lng')::FLOAT
        )
      ELSE NULL
    END as distance,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id)::INTEGER as review_count
  FROM service_listings sl
  JOIN provider_profiles pp ON pp.user_id = sl.provider_id
  LEFT JOIN reviews r ON r.reviewee_id = sl.provider_id AND r.type = 'service_review' AND r.is_public = true
  WHERE 
    sl.is_active = true
    AND (search_term IS NULL OR sl.title ILIKE '%' || search_term || '%' OR sl.description ILIKE '%' || search_term || '%')
    AND (category_filter IS NULL OR sl.category = category_filter)
    AND (max_price IS NULL OR sl.base_price <= max_price)
    AND (location_lat IS NULL OR location_lng IS NULL OR 
         calculate_distance(
           location_lat, 
           location_lng,
           (sl.service_area->>'lat')::FLOAT,
           (sl.service_area->>'lng')::FLOAT
         ) <= max_distance)
  GROUP BY sl.id, sl.title, sl.description, sl.category, sl.base_price, pp.business_name, sl.service_area
  HAVING (min_rating IS NULL OR AVG(r.rating) >= min_rating)
  ORDER BY 
    CASE sort_by
      WHEN 'price_low' THEN sl.base_price
      WHEN 'price_high' THEN -sl.base_price
      WHEN 'rating' THEN -COALESCE(AVG(r.rating), 0)
      WHEN 'distance' THEN calculate_distance(
        location_lat, 
        location_lng,
        (sl.service_area->>'lat')::FLOAT,
        (sl.service_area->>'lng')::FLOAT
      )
      ELSE random() -- relevance (simplified as random for now)
    END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Triggers for updated_at timestamps
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON user_onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consumer_profiles_updated_at
  BEFORE UPDATE ON consumer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at
  BEFORE UPDATE ON provider_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_listings_updated_at
  BEFORE UPDATE ON service_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_responses_updated_at
  BEFORE UPDATE ON review_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_availability_updated_at
  BEFORE UPDATE ON provider_availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Business logic triggers
CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_booking_creation();

CREATE TRIGGER on_booking_status_changed
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_booking_status_change();

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION handle_review_creation();

CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION handle_message_creation();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Log completion
INSERT INTO system_logs (level, message, component) 
VALUES ('info', 'Database functions and triggers setup completed successfully', 'functions_setup');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database functions and triggers setup completed successfully!';
  RAISE NOTICE 'Automated features now active:';
  RAISE NOTICE '- User profile creation on signup';
  RAISE NOTICE '- Booking number generation';
  RAISE NOTICE '- Status change notifications';
  RAISE NOTICE '- Review notifications';
  RAISE NOTICE '- Message notifications';
  RAISE NOTICE '- Analytics tracking';
  RAISE NOTICE 'Next: Optionally run the seed data script for sample data.';
END $$;
