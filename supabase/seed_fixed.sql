-- ============================================================================
-- LOCONOMY SEED DATA - FIXED VERSION
-- Compatible with the corrected schema (schema_fixed.sql)
-- ============================================================================

-- Insert default tenant
INSERT INTO tenants (id, name, slug, domain, region, subscription_tier, settings, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Loconomy',
    'loconomy',
    'loconomy.com',
    'US',
    'enterprise',
    '{"features": ["advanced_analytics", "white_label", "api_access"], "limits": {"users": -1, "listings": -1}}',
    true
) ON CONFLICT (id) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (id, tenant_id, name, slug, description, icon_url, color_hex, sort_order, is_featured, is_active)
VALUES 
    ('10000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Home Services', 'home-services', 'Professional home maintenance and improvement services', '/icons/home.svg', '#2563eb', 1, true, true),
    ('10000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Cleaning', 'cleaning', 'Professional cleaning services for homes and offices', '/icons/cleaning.svg', '#059669', 2, true, true),
    ('10000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Plumbing', 'plumbing', 'Licensed plumbing services and repairs', '/icons/plumbing.svg', '#dc2626', 3, true, true),
    ('10000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Electrical', 'electrical', 'Licensed electrical services and installations', '/icons/electrical.svg', '#f59e0b', 4, true, true),
    ('10000000-0000-0000-0000-000000000005'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Gardening', 'gardening', 'Garden maintenance and landscaping services', '/icons/gardening.svg', '#16a34a', 5, true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, tenant_id, clerk_id, email, role, status, verification_status, first_name, last_name, display_name, timezone, locale, referral_code)
VALUES 
    ('20000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'clerk_user_admin', 'admin@loconomy.com', 'admin', 'active', 'verified', 'Admin', 'User', 'Admin User', 'UTC', 'en', 'ADMIN001'),
    ('20000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'clerk_user_provider1', 'john.doe@example.com', 'provider', 'active', 'verified', 'John', 'Doe', 'John D.', 'America/New_York', 'en', 'PROV001'),
    ('20000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'clerk_user_customer1', 'jane.smith@example.com', 'customer', 'active', 'verified', 'Jane', 'Smith', 'Jane S.', 'America/Los_Angeles', 'en', 'CUST001'),
    ('20000000-0000-0000-0000-000000000004'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'clerk_user_provider2', 'sarah.wilson@example.com', 'provider', 'active', 'verified', 'Sarah', 'Wilson', 'Sarah W.', 'Europe/London', 'en', 'PROV002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user profiles
INSERT INTO user_profiles (
    id, user_id, bio, skills, experience_years, city, state, country, 
    average_rating, total_reviews, total_jobs_completed, 
    identity_verified, background_check_verified, service_radius_km,
    hourly_rate_min, hourly_rate_max
)
VALUES 
    (
        '30000000-0000-0000-0000-000000000001'::uuid,
        '20000000-0000-0000-0000-000000000002'::uuid,
        'Experienced plumber with 15 years in residential and commercial plumbing. Licensed and insured.',
        ARRAY['Plumbing', 'Pipe Installation', 'Leak Repair', 'Water Heater Service'],
        15,
        'New York',
        'NY',
        'US',
        4.8,
        127,
        145,
        true,
        true,
        25,
        75.00,
        125.00
    ),
    (
        '30000000-0000-0000-0000-000000000002'::uuid,
        '20000000-0000-0000-0000-000000000003'::uuid,
        'Homeowner looking for reliable service providers in the Los Angeles area.',
        ARRAY[]::TEXT[],
        NULL,
        'Los Angeles',
        'CA',
        'US',
        0.00,
        0,
        0,
        true,
        false,
        NULL,
        NULL,
        NULL
    ),
    (
        '30000000-0000-0000-0000-000000000003'::uuid,
        '20000000-0000-0000-0000-000000000004'::uuid,
        'Professional cleaning service with eco-friendly products. Specializing in residential deep cleaning.',
        ARRAY['Deep Cleaning', 'Eco-Friendly Products', 'Post-Construction Cleanup', 'Move-in/Move-out Cleaning'],
        8,
        'London',
        'England',
        'GB',
        4.9,
        89,
        112,
        true,
        true,
        15,
        30.00,
        45.00
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample listings
INSERT INTO listings (
    id, provider_id, category_id, title, slug, description, short_description,
    pricing_type, base_price, currency, duration_minutes, location_type,
    status, is_featured, tags
)
VALUES 
    (
        '40000000-0000-0000-0000-000000000001'::uuid,
        '20000000-0000-0000-0000-000000000002'::uuid,
        '10000000-0000-0000-0000-000000000003'::uuid,
        'Emergency Plumbing Repair Services',
        'emergency-plumbing-repair-services',
        'Fast and reliable emergency plumbing services available 24/7. Licensed plumber with 15+ years experience. Specializing in leak repairs, pipe installations, water heater service, and drain cleaning. All work guaranteed and insured.',
        'Fast 24/7 emergency plumbing services. Licensed, insured, guaranteed.',
        'hourly',
        95.00,
        'USD',
        60,
        'on_site',
        'active',
        true,
        ARRAY['plumbing', 'emergency', '24/7', 'licensed', 'insured', 'leak repair', 'pipes']
    ),
    (
        '40000000-0000-0000-0000-000000000002'::uuid,
        '20000000-0000-0000-0000-000000000004'::uuid,
        '10000000-0000-0000-0000-000000000002'::uuid,
        'Eco-Friendly Deep House Cleaning',
        'eco-friendly-deep-house-cleaning',
        'Professional deep cleaning service using only eco-friendly, non-toxic products. Perfect for families with children and pets. We provide all supplies and equipment. Service includes all rooms, bathrooms, kitchen deep clean, and interior windows.',
        'Professional eco-friendly cleaning with non-toxic products. Family and pet safe.',
        'fixed',
        150.00,
        'USD',
        180,
        'on_site',
        'active',
        true,
        ARRAY['cleaning', 'eco-friendly', 'deep cleaning', 'non-toxic', 'family safe', 'pets']
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (
    id, customer_id, provider_id, listing_id, title, description, status,
    confirmation_code, scheduled_start, scheduled_end, location_type,
    base_price, total_amount, currency
)
VALUES 
    (
        '50000000-0000-0000-0000-000000000001'::uuid,
        '20000000-0000-0000-0000-000000000003'::uuid,
        '20000000-0000-0000-0000-000000000002'::uuid,
        '40000000-0000-0000-0000-000000000001'::uuid,
        'Kitchen Sink Leak Repair',
        'Urgent repair needed for kitchen sink leak under the cabinet.',
        'completed',
        'BOOK001',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days' + INTERVAL '2 hours',
        'on_site',
        95.00,
        190.00,
        'USD'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (
    id, booking_id, reviewer_id, reviewee_id, rating, title, content,
    communication_rating, quality_rating, timeliness_rating, professionalism_rating,
    is_verified, is_public
)
VALUES 
    (
        '60000000-0000-0000-0000-000000000001'::uuid,
        '50000000-0000-0000-0000-000000000001'::uuid,
        '20000000-0000-0000-0000-000000000003'::uuid,
        '20000000-0000-0000-0000-000000000002'::uuid,
        5,
        'Excellent Emergency Service!',
        'John was fantastic! He arrived quickly, diagnosed the problem immediately, and fixed my kitchen sink leak professionally. Very reasonable pricing and cleaned up after the work. Highly recommended!',
        5,
        5,
        5,
        5,
        true,
        true
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample subscriptions
INSERT INTO subscriptions (
    id, user_id, tier, status, price, currency, billing_cycle,
    current_period_start, current_period_end, stripe_subscription_id
)
VALUES 
    (
        '70000000-0000-0000-0000-000000000001'::uuid,
        '20000000-0000-0000-0000-000000000002'::uuid,
        'professional',
        'active',
        29.99,
        'USD',
        'monthly',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '1 month',
        'sub_1234567890'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (
    id, user_id, booking_id, type, status, amount, currency, description,
    platform_fee, processing_fee, net_amount, stripe_payment_intent_id, processed_at
)
VALUES 
    (
        '80000000-0000-0000-0000-000000000001'::uuid,
        '20000000-0000-0000-0000-000000000003'::uuid,
        '50000000-0000-0000-0000-000000000001'::uuid,
        'payment',
        'completed',
        190.00,
        'USD',
        'Payment for kitchen sink leak repair service',
        9.50,
        5.85,
        174.65,
        'pi_1234567890',
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (
    id, user_id, type, title, content, channels, related_booking_id
)
VALUES 
    (
        '90000000-0000-0000-0000-000000000001'::uuid,
        '20000000-0000-0000-0000-000000000002'::uuid,
        'booking_received',
        'New Booking Request',
        'You have received a new booking request for emergency plumbing service.',
        ARRAY['in_app', 'email']::notification_channel[],
        '50000000-0000-0000-0000-000000000001'::uuid
    ),
    (
        '90000000-0000-0000-0000-000000000002'::uuid,
        '20000000-0000-0000-0000-000000000003'::uuid,
        'booking_completed',
        'Service Completed',
        'Your plumbing service has been completed. Please leave a review!',
        ARRAY['in_app', 'email']::notification_channel[],
        '50000000-0000-0000-0000-000000000001'::uuid
    )
ON CONFLICT (id) DO NOTHING;

-- Update search vectors for listings (trigger will handle this automatically for new records)
UPDATE listings SET updated_at = NOW() WHERE search_vector IS NULL;

-- ============================================================================
-- VERIFICATION AND TESTING QUERIES
-- ============================================================================

-- Verify data integrity
DO $$
DECLARE
    tenant_count INTEGER;
    user_count INTEGER;
    category_count INTEGER;
    listing_count INTEGER;
    booking_count INTEGER;
    review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO tenant_count FROM tenants;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO category_count FROM categories;
    SELECT COUNT(*) INTO listing_count FROM listings;
    SELECT COUNT(*) INTO booking_count FROM bookings;
    SELECT COUNT(*) INTO review_count FROM reviews;
    
    RAISE NOTICE 'Seed data verification:';
    RAISE NOTICE 'Tenants: %', tenant_count;
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Categories: %', category_count;
    RAISE NOTICE 'Listings: %', listing_count;
    RAISE NOTICE 'Bookings: %', booking_count;
    RAISE NOTICE 'Reviews: %', review_count;
    
    IF tenant_count > 0 AND user_count > 0 AND category_count > 0 THEN
        RAISE NOTICE '✅ Seed data loaded successfully!';
    ELSE
        RAISE EXCEPTION '❌ Seed data failed to load properly';
    END IF;
END;
$$;

-- Test sample queries
SELECT 
    u.display_name,
    up.city,
    up.average_rating,
    up.total_reviews,
    up.hourly_rate_min,
    up.hourly_rate_max
FROM users u
JOIN user_profiles up ON u.id = up.user_id
WHERE u.role = 'provider';

SELECT 
    l.title,
    l.base_price,
    l.currency,
    c.name as category_name,
    u.display_name as provider_name
FROM listings l
JOIN categories c ON l.category_id = c.id
JOIN users u ON l.provider_id = u.id
WHERE l.status = 'active';

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- This seed file provides:
-- ✅ Sample tenant data for multi-tenancy testing
-- ✅ Test users across all roles (admin, provider, customer)
-- ✅ Service categories for the marketplace
-- ✅ Sample listings with proper relationships
-- ✅ Completed booking example with review
-- ✅ Transaction and payment data
-- ✅ Notification examples
-- ✅ Data integrity verification
-- ✅ Sample queries for testing

-- The seed data is production-safe and follows the corrected schema!