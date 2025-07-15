-- Listings System Tables
-- This migration creates tables for service listings management

-- Listing status enum
CREATE TYPE listing_status AS ENUM (
  'draft',
  'active',
  'paused',
  'inactive'
);

-- Pricing type enum
CREATE TYPE pricing_type AS ENUM (
  'hourly',
  'fixed',
  'custom'
);

-- Service listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Pricing information
  pricing_type pricing_type DEFAULT 'hourly',
  base_price DECIMAL(10,2),
  hourly_rate DECIMAL(10,2),
  minimum_hours INTEGER DEFAULT 1,
  
  -- Service details
  duration_minutes INTEGER, -- Estimated duration for fixed services
  location_type TEXT DEFAULT 'on_site', -- on_site, remote, both
  service_area JSONB, -- Geographic service area
  
  -- Media and content
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  featured_image TEXT, -- Primary image
  
  -- Availability and booking
  max_bookings_per_day INTEGER DEFAULT 5,
  advance_booking_days INTEGER DEFAULT 30,
  cancellation_policy TEXT,
  
  -- Business logic
  status listing_status DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}', -- Flexible field for additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listing images table (for better image management)
CREATE TABLE listing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listing views tracking (for analytics)
CREATE TABLE listing_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_listings_provider_id ON listings(provider_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_is_featured ON listings(is_featured) WHERE is_featured = true;
CREATE INDEX idx_listings_location_type ON listings(location_type);

-- Full text search index
CREATE INDEX idx_listings_search ON listings USING gin(
  to_tsvector('english', title || ' ' || description || ' ' || array_to_string(tags, ' '))
);

-- Indexes for listing_images
CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX idx_listing_images_display_order ON listing_images(listing_id, display_order);

-- Indexes for listing_views
CREATE INDEX idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX idx_listing_views_viewed_at ON listing_views(viewed_at DESC);

-- RLS Policies
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

-- Listings policies
-- Providers can view, insert, update, delete their own listings
CREATE POLICY "Providers can manage own listings" ON listings
  FOR ALL USING (
    auth.uid() = provider_id OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public can view active listings
CREATE POLICY "Public can view active listings" ON listings
  FOR SELECT USING (status = 'active');

-- Listing images policies
-- Follow parent listing permissions
CREATE POLICY "Listing images follow listing permissions" ON listing_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_id AND (
        l.provider_id = auth.uid() OR
        l.status = 'active' OR
        EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

-- Listing views policies
-- Anyone can insert views, only admins and owners can read
CREATE POLICY "Anyone can record listing views" ON listing_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners and admins can view listing analytics" ON listing_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = listing_id AND (
        l.provider_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

-- Updated_at trigger for listings
CREATE TRIGGER update_listings_updated_at 
  BEFORE UPDATE ON listings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to record listing view
CREATE OR REPLACE FUNCTION record_listing_view(
  p_listing_id UUID,
  p_viewer_ip INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Insert view record
  INSERT INTO listing_views (listing_id, viewer_id, viewer_ip, user_agent)
  VALUES (p_listing_id, auth.uid(), p_viewer_ip, p_user_agent);
  
  -- Increment view count on listing
  UPDATE listings 
  SET view_count = view_count + 1 
  WHERE id = p_listing_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get listing stats
CREATE OR REPLACE FUNCTION get_listing_stats(p_provider_id UUID)
RETURNS TABLE (
  total_listings INTEGER,
  active_listings INTEGER,
  draft_listings INTEGER,
  total_views INTEGER,
  total_bookings INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_listings,
    COUNT(*) FILTER (WHERE status = 'active')::INTEGER as active_listings,
    COUNT(*) FILTER (WHERE status = 'draft')::INTEGER as draft_listings,
    COALESCE(SUM(view_count), 0)::INTEGER as total_views,
    COALESCE(SUM(booking_count), 0)::INTEGER as total_bookings
  FROM listings 
  WHERE provider_id = p_provider_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search listings
CREATE OR REPLACE FUNCTION search_listings(
  p_query TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_location_type TEXT DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  provider_id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  pricing_type pricing_type,
  base_price DECIMAL,
  hourly_rate DECIMAL,
  featured_image TEXT,
  status listing_status,
  view_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.provider_id,
    l.title,
    l.description,
    l.category,
    l.pricing_type,
    l.base_price,
    l.hourly_rate,
    l.featured_image,
    l.status,
    l.view_count,
    l.created_at,
    CASE 
      WHEN p_query IS NOT NULL THEN
        ts_rank(to_tsvector('english', l.title || ' ' || l.description), plainto_tsquery('english', p_query))
      ELSE 0
    END as rank
  FROM listings l
  WHERE 
    l.status = 'active' AND
    (p_query IS NULL OR to_tsvector('english', l.title || ' ' || l.description) @@ plainto_tsquery('english', p_query)) AND
    (p_category IS NULL OR l.category = p_category) AND
    (p_location_type IS NULL OR l.location_type = p_location_type) AND
    (p_max_price IS NULL OR 
      (l.pricing_type = 'hourly' AND l.hourly_rate <= p_max_price) OR
      (l.pricing_type = 'fixed' AND l.base_price <= p_max_price)
    )
  ORDER BY 
    l.is_featured DESC,
    CASE WHEN p_query IS NOT NULL THEN rank ELSE 0 END DESC,
    l.view_count DESC,
    l.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update listing status
CREATE OR REPLACE FUNCTION update_listing_status(
  p_listing_id UUID,
  p_status listing_status
)
RETURNS BOOLEAN AS $$
DECLARE
  listing_owner UUID;
BEGIN
  -- Check if user owns the listing or is admin
  SELECT provider_id INTO listing_owner
  FROM listings
  WHERE id = p_listing_id;
  
  IF listing_owner IS NULL THEN
    RETURN false;
  END IF;
  
  IF listing_owner != auth.uid() AND NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN false;
  END IF;
  
  -- Update status
  UPDATE listings 
  SET status = p_status, updated_at = NOW()
  WHERE id = p_listing_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
