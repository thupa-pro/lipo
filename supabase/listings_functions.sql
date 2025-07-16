-- =====================================================
-- LOCONOMY PLATFORM - LISTINGS FUNCTIONS
-- =====================================================
-- This script creates functions for listings management
-- Run this after the main database setup
-- =====================================================

-- Function to get listing statistics for a provider
CREATE OR REPLACE FUNCTION get_listing_stats(p_provider_id UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_listings', COUNT(*),
    'active_listings', COUNT(*) FILTER (WHERE is_active = true),
    'draft_listings', COUNT(*) FILTER (WHERE is_active = false),
    'total_views', COALESCE(SUM((metadata->>'view_count')::INTEGER), 0),
    'total_bookings', COALESCE(SUM((metadata->>'booking_count')::INTEGER), 0),
    'average_rating', (
      SELECT AVG(rating)
      FROM reviews r
      WHERE r.reviewee_id = p_provider_id 
        AND r.type = 'service_review' 
        AND r.is_public = true
    )
  ) INTO stats
  FROM service_listings
  WHERE provider_id = p_provider_id;

  RETURN COALESCE(stats, '{
    "total_listings": 0,
    "active_listings": 0,
    "draft_listings": 0,
    "total_views": 0,
    "total_bookings": 0,
    "average_rating": null
  }'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search listings with filters
CREATE OR REPLACE FUNCTION search_listings(
  p_query TEXT DEFAULT NULL,
  p_category service_category DEFAULT NULL,
  p_location_type TEXT DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category service_category,
  base_price DECIMAL,
  hourly_rate DECIMAL,
  pricing_type TEXT,
  provider_name TEXT,
  provider_rating DECIMAL,
  view_count INTEGER,
  booking_count INTEGER,
  is_featured BOOLEAN,
  images TEXT[],
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.id,
    sl.title,
    sl.description,
    sl.category,
    sl.base_price,
    sl.hourly_rate,
    sl.pricing_type,
    pp.business_name as provider_name,
    COALESCE(AVG(r.rating), 0)::DECIMAL as provider_rating,
    COALESCE((sl.metadata->>'view_count')::INTEGER, 0) as view_count,
    COALESCE((sl.metadata->>'booking_count')::INTEGER, 0) as booking_count,
    sl.is_featured,
    sl.images,
    sl.created_at
  FROM service_listings sl
  JOIN provider_profiles pp ON pp.user_id = sl.provider_id
  LEFT JOIN reviews r ON r.reviewee_id = sl.provider_id AND r.type = 'service_review' AND r.is_public = true
  WHERE 
    sl.is_active = true
    AND (p_query IS NULL OR sl.title ILIKE '%' || p_query || '%' OR sl.description ILIKE '%' || p_query || '%')
    AND (p_category IS NULL OR sl.category = p_category)
    AND (p_max_price IS NULL OR 
         (sl.pricing_type = 'fixed' AND sl.base_price <= p_max_price) OR
         (sl.pricing_type = 'hourly' AND sl.hourly_rate <= p_max_price))
  GROUP BY sl.id, sl.title, sl.description, sl.category, sl.base_price, sl.hourly_rate, sl.pricing_type, 
           pp.business_name, sl.metadata, sl.is_featured, sl.images, sl.created_at
  ORDER BY 
    sl.is_featured DESC,
    COALESCE(AVG(r.rating), 0) DESC,
    sl.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update listing status
CREATE OR REPLACE FUNCTION update_listing_status(
  p_listing_id UUID,
  p_status TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  is_valid_status BOOLEAN;
BEGIN
  -- Validate status
  is_valid_status := p_status IN ('active', 'draft', 'paused', 'inactive');
  
  IF NOT is_valid_status THEN
    RAISE EXCEPTION 'Invalid status: %', p_status;
  END IF;

  -- Update the listing
  UPDATE service_listings 
  SET 
    is_active = CASE WHEN p_status = 'active' THEN true ELSE false END,
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('status', p_status),
    updated_at = NOW()
  WHERE id = p_listing_id;

  -- Log the status change
  INSERT INTO system_logs (level, message, component, metadata)
  VALUES (
    'info', 
    'Listing status updated', 
    'listings',
    jsonb_build_object('listing_id', p_listing_id, 'new_status', p_status)
  );

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a listing view
CREATE OR REPLACE FUNCTION record_listing_view(
  p_listing_id UUID,
  p_viewer_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_views INTEGER;
BEGIN
  -- Get current view count
  SELECT COALESCE((metadata->>'view_count')::INTEGER, 0) INTO current_views
  FROM service_listings
  WHERE id = p_listing_id;

  -- Update view count
  UPDATE service_listings
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('view_count', current_views + 1)
  WHERE id = p_listing_id;

  -- Log the view (for analytics)
  PERFORM track_analytics_event(
    'listing_viewed',
    'listings',
    NULL,
    jsonb_build_object(
      'listing_id', p_listing_id,
      'viewer_ip', p_viewer_ip,
      'user_agent', p_user_agent
    )
  );

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment booking count
CREATE OR REPLACE FUNCTION increment_listing_booking_count(p_listing_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_bookings INTEGER;
BEGIN
  -- Get current booking count
  SELECT COALESCE((metadata->>'booking_count')::INTEGER, 0) INTO current_bookings
  FROM service_listings
  WHERE id = p_listing_id;

  -- Update booking count
  UPDATE service_listings
  SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('booking_count', current_bookings + 1)
  WHERE id = p_listing_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get featured listings
CREATE OR REPLACE FUNCTION get_featured_listings(p_limit INTEGER DEFAULT 6)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category service_category,
  base_price DECIMAL,
  hourly_rate DECIMAL,
  pricing_type TEXT,
  provider_name TEXT,
  provider_rating DECIMAL,
  images TEXT[],
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.id,
    sl.title,
    sl.description,
    sl.category,
    sl.base_price,
    sl.hourly_rate,
    sl.pricing_type,
    pp.business_name as provider_name,
    COALESCE(AVG(r.rating), 0)::DECIMAL as provider_rating,
    sl.images,
    sl.created_at
  FROM service_listings sl
  JOIN provider_profiles pp ON pp.user_id = sl.provider_id
  LEFT JOIN reviews r ON r.reviewee_id = sl.provider_id AND r.type = 'service_review' AND r.is_public = true
  WHERE 
    sl.is_active = true 
    AND sl.is_featured = true
  GROUP BY sl.id, sl.title, sl.description, sl.category, sl.base_price, sl.hourly_rate, 
           sl.pricing_type, pp.business_name, sl.images, sl.created_at
  ORDER BY COALESCE(AVG(r.rating), 0) DESC, sl.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular listings by category
CREATE OR REPLACE FUNCTION get_popular_listings_by_category(
  p_category service_category,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  base_price DECIMAL,
  hourly_rate DECIMAL,
  pricing_type TEXT,
  provider_name TEXT,
  provider_rating DECIMAL,
  booking_count INTEGER,
  images TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.id,
    sl.title,
    sl.description,
    sl.base_price,
    sl.hourly_rate,
    sl.pricing_type,
    pp.business_name as provider_name,
    COALESCE(AVG(r.rating), 0)::DECIMAL as provider_rating,
    COALESCE((sl.metadata->>'booking_count')::INTEGER, 0) as booking_count,
    sl.images
  FROM service_listings sl
  JOIN provider_profiles pp ON pp.user_id = sl.provider_id
  LEFT JOIN reviews r ON r.reviewee_id = sl.provider_id AND r.type = 'service_review' AND r.is_public = true
  WHERE 
    sl.is_active = true 
    AND sl.category = p_category
  GROUP BY sl.id, sl.title, sl.description, sl.base_price, sl.hourly_rate, 
           sl.pricing_type, pp.business_name, sl.metadata, sl.images
  ORDER BY 
    COALESCE((sl.metadata->>'booking_count')::INTEGER, 0) DESC,
    COALESCE(AVG(r.rating), 0) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle listing deletion (soft delete)
CREATE OR REPLACE FUNCTION soft_delete_listing(p_listing_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Mark as inactive instead of hard delete
  UPDATE service_listings 
  SET 
    is_active = false,
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('deleted_at', NOW()::TEXT),
    updated_at = NOW()
  WHERE id = p_listing_id;

  -- Log the deletion
  INSERT INTO system_logs (level, message, component, metadata)
  VALUES (
    'info', 
    'Listing soft deleted', 
    'listings',
    jsonb_build_object('listing_id', p_listing_id)
  );

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically increment booking count when a booking is created
CREATE OR REPLACE FUNCTION handle_listing_booking_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment the booking count for the listing
  PERFORM increment_listing_booking_count(NEW.listing_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking creation
DROP TRIGGER IF EXISTS on_listing_booking_created ON bookings;
CREATE TRIGGER on_listing_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_listing_booking_created();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_listing_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_listings(TEXT, service_category, TEXT, DECIMAL, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION update_listing_status(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION record_listing_view(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_listing_booking_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_featured_listings(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_listings_by_category(service_category, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_listing(UUID) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Listings functions created successfully!';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '- get_listing_stats(provider_id)';
  RAISE NOTICE '- search_listings(query, category, location_type, max_price, limit, offset)';
  RAISE NOTICE '- update_listing_status(listing_id, status)';
  RAISE NOTICE '- record_listing_view(listing_id, viewer_ip, user_agent)';
  RAISE NOTICE '- get_featured_listings(limit)';
  RAISE NOTICE '- get_popular_listings_by_category(category, limit)';
END $$;
