-- =====================================================
-- LOCONOMY PLATFORM - SEED DATA SCRIPT
-- =====================================================
-- This script populates the database with sample data for development
-- Run this after all other setup scripts
-- 
-- WARNING: This is for development/testing only!
-- Do NOT run this in production environments
-- =====================================================

-- =====================================================
-- SERVICE CATEGORIES SEED DATA
-- =====================================================

INSERT INTO service_categories (name, slug, description, icon_name, color, sort_order) VALUES
('Home Cleaning', 'home-cleaning', 'Professional house and office cleaning services', 'home', '#10B981', 1),
('Plumbing', 'plumbing', 'Licensed plumbing repair and installation services', 'wrench', '#3B82F6', 2),
('Electrical', 'electrical', 'Certified electrical work and repairs', 'zap', '#F59E0B', 3),
('Handyman', 'handyman', 'General home repair and maintenance services', 'hammer', '#8B5CF6', 4),
('Moving & Delivery', 'moving-delivery', 'Professional moving and delivery services', 'truck', '#EF4444', 5),
('Landscaping', 'landscaping', 'Lawn care, gardening, and outdoor beautification', 'leaf', '#22C55E', 6),
('Automotive', 'automotive', 'Car repair, maintenance, and detailing services', 'car', '#6B7280', 7),
('Technology', 'technology', 'Computer repair, setup, and tech support', 'monitor', '#06B6D4', 8),
('Tutoring', 'tutoring', 'Educational tutoring and instruction services', 'book', '#EC4899', 9),
('Fitness', 'fitness', 'Personal training and fitness instruction', 'dumbbell', '#F97316', 10),
('Beauty & Wellness', 'beauty-wellness', 'Beauty treatments and wellness services', 'sparkles', '#A855F7', 11),
('Pet Care', 'pet-care', 'Pet sitting, grooming, and veterinary services', 'heart', '#14B8A6', 12),
('Event Planning', 'event-planning', 'Party and event planning services', 'calendar', '#84CC16', 13),
('Photography', 'photography', 'Professional photography services', 'camera', '#F43F5E', 14),
('Other Services', 'other', 'Miscellaneous professional services', 'more-horizontal', '#64748B', 15);

-- =====================================================
-- SUBSCRIPTION PLANS SEED DATA
-- =====================================================

INSERT INTO subscription_plans (plan_id, name, description, price_monthly, price_yearly, features, limits, stripe_product_id) VALUES
(
  'free',
  'Free',
  'Perfect for getting started with basic features',
  0.00,
  0.00,
  '{"basic_listings": true, "basic_support": true, "mobile_app": true}',
  '{"max_listings": 3, "max_bookings_per_month": 10, "max_images_per_listing": 3}',
  'prod_free'
),
(
  'starter',
  'Starter',
  'Great for individual service providers',
  29.99,
  299.99,
  '{"unlimited_listings": true, "priority_support": true, "analytics": true, "custom_branding": false}',
  '{"max_listings": 25, "max_bookings_per_month": 100, "max_images_per_listing": 10}',
  'prod_starter'
),
(
  'professional',
  'Professional',
  'Perfect for growing businesses',
  79.99,
  799.99,
  '{"unlimited_listings": true, "priority_support": true, "advanced_analytics": true, "custom_branding": true, "api_access": true}',
  '{"max_listings": 100, "max_bookings_per_month": 500, "max_images_per_listing": 25}',
  'prod_professional'
),
(
  'enterprise',
  'Enterprise',
  'For large businesses with custom needs',
  199.99,
  1999.99,
  '{"unlimited_everything": true, "dedicated_support": true, "custom_integrations": true, "white_label": true, "advanced_reporting": true}',
  '{"max_listings": -1, "max_bookings_per_month": -1, "max_images_per_listing": -1}',
  'prod_enterprise'
);

-- =====================================================
-- SAMPLE ADMIN USER
-- =====================================================
-- Note: This requires an actual user to be created in Supabase Auth first
-- Replace 'your-admin-user-id' with the actual UUID of your admin user

-- Example insert (commented out - replace with actual admin user ID):
-- INSERT INTO user_roles (user_id, role) VALUES ('your-admin-user-id', 'admin') ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- =====================================================
-- SAMPLE CONSUMERS (for development)
-- =====================================================
-- Note: These would typically be created through the application
-- This is just for development/testing purposes

-- Sample consumer profiles (these need real auth.users entries first)
/*
INSERT INTO consumer_profiles (user_id, full_name, phone, address) VALUES
(
  'consumer-1-uuid',
  'Sarah Johnson',
  '+1-555-0101',
  '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "zip": "94102", "lat": 37.7749, "lng": -122.4194}'::jsonb
),
(
  'consumer-2-uuid',
  'Michael Chen',
  '+1-555-0102',
  '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "lat": 34.0522, "lng": -118.2437}'::jsonb
),
(
  'consumer-3-uuid',
  'Emily Rodriguez',
  '+1-555-0103',
  '{"street": "789 Pine St", "city": "Seattle", "state": "WA", "zip": "98101", "lat": 47.6062, "lng": -122.3321}'::jsonb
);
*/

-- =====================================================
-- SAMPLE PROVIDERS (for development)
-- =====================================================

-- Sample provider profiles (these need real auth.users entries first)
/*
INSERT INTO provider_profiles (
  user_id, business_name, full_name, phone, email, bio, experience_years, 
  hourly_rate, service_radius, business_address, certifications, 
  background_check_verified, instant_booking
) VALUES
(
  'provider-1-uuid',
  'CleanPro Services',
  'David Wilson',
  '+1-555-0201',
  'david@cleanpro.com',
  'Professional cleaning service with 10+ years experience. We use eco-friendly products and guarantee satisfaction.',
  10,
  35.00,
  15,
  '{"street": "100 Business Blvd", "city": "San Francisco", "state": "CA", "zip": "94105", "lat": 37.7849, "lng": -122.4094}'::jsonb,
  ARRAY['Certified Green Cleaner', 'Bonded & Insured'],
  true,
  true
),
(
  'provider-2-uuid',
  'QuickFix Plumbing',
  'Maria Santos',
  '+1-555-0202',
  'maria@quickfix.com',
  'Licensed plumber specializing in emergency repairs and bathroom renovations. Available 24/7 for urgent issues.',
  8,
  85.00,
  20,
  '{"street": "200 Trade St", "city": "San Francisco", "state": "CA", "zip": "94107", "lat": 37.7649, "lng": -122.3994}'::jsonb,
  ARRAY['Licensed Plumber CA #123456', 'Backflow Certified'],
  true,
  false
),
(
  'provider-3-uuid',
  'Tech Solutions Pro',
  'James Kim',
  '+1-555-0203',
  'james@techsolutions.com',
  'Computer repair and tech support specialist. I can fix laptops, desktops, and help with software issues.',
  5,
  65.00,
  25,
  '{"street": "300 Innovation Way", "city": "San Francisco", "state": "CA", "zip": "94103", "lat": 37.7849, "lng": -122.4194}'::jsonb,
  ARRAY['CompTIA A+ Certified', 'Microsoft Certified'],
  true,
  true
);
*/

-- =====================================================
-- SAMPLE SERVICE LISTINGS (for development)
-- =====================================================

-- Sample service listings (these need real provider users first)
/*
INSERT INTO service_listings (
  provider_id, title, description, category, pricing_type, base_price, 
  duration_estimate, service_area, included_services, is_active, instant_booking
) VALUES
(
  'provider-1-uuid',
  'Professional House Cleaning',
  'Complete house cleaning service including all rooms, bathrooms, and kitchen. We bring our own eco-friendly supplies and equipment.',
  'cleaning',
  'hourly',
  35.00,
  180,
  '{"lat": 37.7749, "lng": -122.4194, "radius": 15}'::jsonb,
  ARRAY['All cleaning supplies included', 'Vacuum and mop floors', 'Clean bathrooms and kitchen', 'Dust all surfaces'],
  true,
  true
),
(
  'provider-2-uuid',
  'Emergency Plumbing Repair',
  '24/7 emergency plumbing services for leaks, clogs, and pipe repairs. Licensed and insured with 8+ years experience.',
  'plumbing',
  'hourly',
  85.00,
  60,
  '{"lat": 37.7749, "lng": -122.4194, "radius": 20}'::jsonb,
  ARRAY['Diagnostic and assessment', 'Basic repair materials', 'Cleanup after work', '1-year warranty on parts'],
  true,
  false
),
(
  'provider-3-uuid',
  'Computer Repair & Setup',
  'Professional computer repair, virus removal, and setup services. I can come to your home or office.',
  'technology',
  'fixed',
  120.00,
  90,
  '{"lat": 37.7749, "lng": -122.4194, "radius": 25}'::jsonb,
  ARRAY['Hardware diagnosis', 'Software troubleshooting', 'Virus removal', 'Basic setup and configuration'],
  true,
  true
);
*/

-- =====================================================
-- SAMPLE BOOKINGS (for development)
-- =====================================================

-- Sample bookings (these need real users and listings first)
/*
INSERT INTO bookings (
  consumer_id, provider_id, listing_id, status, scheduled_date, scheduled_time,
  estimated_duration, service_address, base_price, total_amount, special_instructions
) VALUES
(
  'consumer-1-uuid',
  'provider-1-uuid',
  'listing-1-uuid',
  'confirmed',
  CURRENT_DATE + INTERVAL '3 days',
  '10:00:00',
  180,
  '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "zip": "94102", "apartment": "2B"}'::jsonb,
  105.00,
  105.00,
  'Please focus on the kitchen and living room. Cat-friendly cleaning products preferred.'
),
(
  'consumer-2-uuid',
  'provider-2-uuid',
  'listing-2-uuid',
  'pending',
  CURRENT_DATE + INTERVAL '1 day',
  '14:00:00',
  60,
  '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "apartment": "5A"}'::jsonb,
  85.00,
  85.00,
  'Kitchen sink is completely blocked. Emergency repair needed.'
);
*/

-- =====================================================
-- SAMPLE REVIEWS (for development)
-- =====================================================

-- Sample reviews (these need real bookings first)
/*
INSERT INTO reviews (
  booking_id, reviewer_id, reviewee_id, type, rating, title, content,
  quality_rating, punctuality_rating, communication_rating, value_rating
) VALUES
(
  'booking-1-uuid',
  'consumer-1-uuid',
  'provider-1-uuid',
  'service_review',
  5,
  'Excellent cleaning service!',
  'David and his team did an amazing job cleaning our house. They were thorough, professional, and used great eco-friendly products. The house looked spotless when they finished.',
  5,
  5,
  5,
  4
),
(
  'booking-2-uuid',
  'consumer-2-uuid',
  'provider-2-uuid',
  'service_review',
  4,
  'Quick and professional',
  'Maria responded quickly to our emergency and fixed the problem efficiently. The price was fair and she explained everything clearly.',
  4,
  5,
  5,
  4
);
*/

-- =====================================================
-- DEVELOPMENT UTILITIES
-- =====================================================

-- Function to create a sample user with all required data
CREATE OR REPLACE FUNCTION create_sample_user(
  user_email TEXT,
  user_name TEXT,
  user_role user_role DEFAULT 'consumer'
)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  message TEXT;
BEGIN
  -- Note: In a real application, users are created through Supabase Auth
  -- This is just a helper function for development
  
  user_id := gen_random_uuid();
  
  -- Create user role
  INSERT INTO user_roles (user_id, role) VALUES (user_id::TEXT, user_role);
  
  -- Create user preferences
  INSERT INTO user_preferences (user_id) VALUES (user_id);
  
  -- Create onboarding
  INSERT INTO user_onboarding (user_id, role) VALUES (user_id, user_role);
  
  -- Create appropriate profile
  IF user_role = 'consumer' THEN
    INSERT INTO consumer_profiles (user_id, full_name)
    VALUES (user_id, user_name);
  ELSIF user_role = 'provider' THEN
    INSERT INTO provider_profiles (user_id, business_name, full_name, phone)
    VALUES (user_id, user_name || ' Services', user_name, '+1-555-0000');
  END IF;
  
  message := 'Sample ' || user_role || ' user created with ID: ' || user_id::TEXT;
  
  -- Log the creation
  INSERT INTO system_logs (level, message, component)
  VALUES ('info', message, 'seed_data');
  
  RETURN message;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ANALYTICS SAMPLE DATA
-- =====================================================

-- Sample analytics events for the last 30 days
DO $$
DECLARE
  i INTEGER;
  event_date TIMESTAMP WITH TIME ZONE;
  event_names TEXT[] := ARRAY['page_view', 'search', 'booking_request', 'signup', 'login'];
  event_name TEXT;
BEGIN
  FOR i IN 1..1000 LOOP
    event_date := NOW() - (RANDOM() * INTERVAL '30 days');
    event_name := event_names[1 + FLOOR(RANDOM() * array_length(event_names, 1))];
    
    INSERT INTO analytics_events (event_name, event_category, properties, created_at)
    VALUES (
      event_name,
      'user_interaction',
      '{"page": "/dashboard", "source": "organic"}'::jsonb,
      event_date
    );
  END LOOP;
END $$;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Log completion
INSERT INTO system_logs (level, message, component) 
VALUES ('info', 'Seed data script completed successfully', 'seed_data');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed data script completed successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Sample data created:';
  RAISE NOTICE '- 15 service categories';
  RAISE NOTICE '- 4 subscription plans';
  RAISE NOTICE '- 1000 sample analytics events';
  RAISE NOTICE '- Development utility functions';
  RAISE NOTICE '';
  RAISE NOTICE 'To create sample users, listings, and bookings:';
  RAISE NOTICE '1. First create users through Supabase Auth';
  RAISE NOTICE '2. Uncomment and modify the sample data sections';
  RAISE NOTICE '3. Replace UUIDs with actual user IDs';
  RAISE NOTICE '4. Run the modified script';
  RAISE NOTICE '';
  RAISE NOTICE 'Database setup is now complete!';
END $$;
