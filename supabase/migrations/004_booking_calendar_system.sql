-- Booking & Calendar System Tables
-- This migration creates tables for booking management and availability

-- Booking status enum
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'disputed'
);

-- Availability type enum
CREATE TYPE availability_type AS ENUM (
  'available',
  'booked',
  'blocked',
  'break'
);

-- Day of week enum
CREATE TYPE day_of_week AS ENUM (
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
);

-- Provider availability template (weekly schedule)
CREATE TABLE provider_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  break_duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure no overlapping time slots for same day
  CONSTRAINT no_overlap_availability EXCLUDE USING gist (
    provider_id WITH =,
    day_of_week WITH =,
    tsrange(start_time::text::timestamp, end_time::text::timestamp) WITH &&
  ) WHERE (is_available = true)
);

-- Specific date overrides for availability
CREATE TABLE availability_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  availability_type availability_type NOT NULL,
  reason TEXT, -- For blocked/break times
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(provider_id, date, start_time, end_time)
);

-- Service bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Booking details
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Service information
  service_title TEXT NOT NULL,
  service_description TEXT,
  special_requests TEXT,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Status and metadata
  status booking_status DEFAULT 'pending',
  confirmation_code TEXT UNIQUE,
  cancellation_reason TEXT,
  
  -- Communication
  customer_notes TEXT,
  provider_notes TEXT,
  
  -- Location (can be override from listing)
  location_type TEXT, -- on_site, remote, both
  service_address JSONB, -- {street, city, state, zip}
  
  -- Timestamps
  confirmed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure no double bookings
  CONSTRAINT no_overlap_bookings EXCLUDE USING gist (
    provider_id WITH =,
    booking_date WITH =,
    tsrange(start_time::text::timestamp, end_time::text::timestamp) WITH &&
  ) WHERE (status NOT IN ('cancelled', 'disputed'))
);

-- Booking reviews (separate from general reviews)
CREATE TABLE booking_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  
  -- Review categories (JSON for flexibility)
  category_ratings JSONB DEFAULT '{}', -- {communication: 5, quality: 4, timeliness: 5}
  
  -- Review metadata
  is_verified BOOLEAN DEFAULT true, -- Verified booking reviews
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking messages (communication thread per booking)
CREATE TABLE booking_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  message_text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, image, file, system
  attachments TEXT[] DEFAULT '{}', -- Array of file URLs
  
  -- System messages (booking updates, etc.)
  is_system_message BOOLEAN DEFAULT false,
  system_event_type TEXT, -- booking_confirmed, time_changed, etc.
  
  -- Message metadata
  read_by UUID[] DEFAULT '{}', -- Array of user IDs who have read
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_provider_availability_provider_day ON provider_availability(provider_id, day_of_week);
CREATE INDEX idx_availability_overrides_provider_date ON availability_overrides(provider_id, date);
CREATE INDEX idx_bookings_provider_date ON bookings(provider_id, booking_date);
CREATE INDEX idx_bookings_customer_date ON bookings(customer_id, booking_date DESC);
CREATE INDEX idx_bookings_listing_date ON bookings(listing_id, booking_date DESC);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_confirmation_code ON bookings(confirmation_code);
CREATE INDEX idx_booking_reviews_booking ON booking_reviews(booking_id);
CREATE INDEX idx_booking_messages_booking ON booking_messages(booking_id, created_at);

-- RLS Policies
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_messages ENABLE ROW LEVEL SECURITY;

-- Provider availability policies
CREATE POLICY "Providers can manage their availability" ON provider_availability
  FOR ALL USING (auth.uid() = provider_id);

CREATE POLICY "Public can view provider availability" ON provider_availability
  FOR SELECT USING (is_available = true);

-- Availability overrides policies  
CREATE POLICY "Providers can manage their availability overrides" ON availability_overrides
  FOR ALL USING (auth.uid() = provider_id);

CREATE POLICY "Public can view availability overrides" ON availability_overrides
  FOR SELECT USING (availability_type = 'available');

-- Bookings policies
CREATE POLICY "Users can view their bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = provider_id OR 
    auth.uid() = customer_id OR
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers and customers can update their bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = provider_id OR 
    auth.uid() = customer_id
  );

-- Booking reviews policies
CREATE POLICY "Users can view booking reviews" ON booking_reviews
  FOR SELECT USING (
    is_public = true OR
    auth.uid() = reviewer_id OR
    auth.uid() = reviewee_id OR
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Booking participants can create reviews" ON booking_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = booking_id AND 
      (b.provider_id = auth.uid() OR b.customer_id = auth.uid()) AND
      b.status = 'completed'
    )
  );

-- Booking messages policies
CREATE POLICY "Booking participants can view messages" ON booking_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = booking_id AND 
      (b.provider_id = auth.uid() OR b.customer_id = auth.uid())
    )
  );

CREATE POLICY "Booking participants can send messages" ON booking_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = booking_id AND 
      (b.provider_id = auth.uid() OR b.customer_id = auth.uid())
    )
  );

-- Triggers
CREATE TRIGGER update_provider_availability_updated_at 
  BEFORE UPDATE ON provider_availability 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_reviews_updated_at 
  BEFORE UPDATE ON booking_reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate confirmation code function
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate confirmation codes
CREATE OR REPLACE FUNCTION set_booking_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code = generate_confirmation_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_confirmation_code_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_confirmation_code();

-- Function to check provider availability
CREATE OR REPLACE FUNCTION check_provider_availability(
  p_provider_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  day_name day_of_week;
  has_regular_availability BOOLEAN := false;
  has_override BOOLEAN := false;
  override_available BOOLEAN := false;
BEGIN
  -- Get day of week
  day_name = CASE EXTRACT(DOW FROM p_date)
    WHEN 0 THEN 'sunday'::day_of_week
    WHEN 1 THEN 'monday'::day_of_week
    WHEN 2 THEN 'tuesday'::day_of_week
    WHEN 3 THEN 'wednesday'::day_of_week
    WHEN 4 THEN 'thursday'::day_of_week
    WHEN 5 THEN 'friday'::day_of_week
    WHEN 6 THEN 'saturday'::day_of_week
  END;
  
  -- Check for date-specific overrides first
  SELECT COUNT(*) > 0, bool_or(availability_type = 'available')
  INTO has_override, override_available
  FROM availability_overrides
  WHERE provider_id = p_provider_id 
    AND date = p_date
    AND (
      (start_time IS NULL AND end_time IS NULL) OR
      (start_time <= p_start_time AND end_time >= p_end_time)
    );
  
  -- If there's an override, use that
  IF has_override THEN
    RETURN override_available;
  END IF;
  
  -- Check regular weekly availability
  SELECT COUNT(*) > 0
  INTO has_regular_availability
  FROM provider_availability
  WHERE provider_id = p_provider_id 
    AND day_of_week = day_name
    AND is_available = true
    AND start_time <= p_start_time 
    AND end_time >= p_end_time;
  
  -- Check for conflicting bookings
  IF has_regular_availability THEN
    IF EXISTS (
      SELECT 1 FROM bookings
      WHERE provider_id = p_provider_id
        AND booking_date = p_date
        AND status NOT IN ('cancelled', 'disputed')
        AND (
          (start_time < p_end_time AND end_time > p_start_time)
        )
    ) THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN has_regular_availability;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get provider available slots for a date
CREATE OR REPLACE FUNCTION get_available_slots(
  p_provider_id UUID,
  p_date DATE,
  p_slot_duration_minutes INTEGER DEFAULT 60
)
RETURNS TABLE(
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN
) AS $$
DECLARE
  day_name day_of_week;
  current_time TIME;
  end_time_slot TIME;
  slot_interval INTERVAL;
BEGIN
  -- Get day of week
  day_name = CASE EXTRACT(DOW FROM p_date)
    WHEN 0 THEN 'sunday'::day_of_week
    WHEN 1 THEN 'monday'::day_of_week
    WHEN 2 THEN 'tuesday'::day_of_week
    WHEN 3 THEN 'wednesday'::day_of_week
    WHEN 4 THEN 'thursday'::day_of_week
    WHEN 5 THEN 'friday'::day_of_week
    WHEN 6 THEN 'saturday'::day_of_week
  END;
  
  slot_interval = (p_slot_duration_minutes || ' minutes')::INTERVAL;
  
  -- Get available time ranges for the day
  FOR current_time, end_time_slot IN
    SELECT pa.start_time, pa.end_time
    FROM provider_availability pa
    WHERE pa.provider_id = p_provider_id 
      AND pa.day_of_week = day_name
      AND pa.is_available = true
  LOOP
    -- Generate time slots within this range
    WHILE current_time + slot_interval <= end_time_slot LOOP
      RETURN QUERY SELECT 
        current_time,
        current_time + slot_interval,
        check_provider_availability(
          p_provider_id, 
          p_date, 
          current_time, 
          current_time + slot_interval
        );
      
      current_time = current_time + slot_interval;
    END LOOP;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a booking
CREATE OR REPLACE FUNCTION create_booking(
  p_listing_id UUID,
  p_customer_id UUID,
  p_booking_date DATE,
  p_start_time TIME,
  p_duration_minutes INTEGER,
  p_special_requests TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  booking_id UUID;
  provider_id UUID;
  listing_data RECORD;
  end_time TIME;
  total_price DECIMAL(10,2);
BEGIN
  -- Calculate end time
  end_time = p_start_time + (p_duration_minutes || ' minutes')::INTERVAL;
  
  -- Get listing and provider information
  SELECT l.provider_id, l.title, l.description, l.hourly_rate, l.base_price, l.pricing_type
  INTO provider_id, listing_data
  FROM listings l
  WHERE l.id = p_listing_id AND l.status = 'active';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found or not active';
  END IF;
  
  -- Check availability
  IF NOT check_provider_availability(provider_id, p_booking_date, p_start_time, end_time) THEN
    RAISE EXCEPTION 'Provider is not available at the requested time';
  END IF;
  
  -- Calculate total price
  IF listing_data.pricing_type = 'hourly' THEN
    total_price = listing_data.hourly_rate * (p_duration_minutes / 60.0);
  ELSE
    total_price = listing_data.base_price;
  END IF;
  
  -- Create booking
  INSERT INTO bookings (
    listing_id,
    provider_id,
    customer_id,
    booking_date,
    start_time,
    end_time,
    duration_minutes,
    service_title,
    service_description,
    special_requests,
    base_price,
    service_fee,
    total_amount,
    status
  ) VALUES (
    p_listing_id,
    provider_id,
    p_customer_id,
    p_booking_date,
    p_start_time,
    end_time,
    p_duration_minutes,
    listing_data.title,
    listing_data.description,
    p_special_requests,
    CASE 
      WHEN listing_data.pricing_type = 'hourly' THEN listing_data.hourly_rate 
      ELSE listing_data.base_price 
    END,
    total_price * 0.05, -- 5% service fee
    total_price * 1.05, -- Total with service fee
    'pending'
  ) RETURNING id INTO booking_id;
  
  -- Update listing booking count
  UPDATE listings 
  SET booking_count = booking_count + 1 
  WHERE id = p_listing_id;
  
  RETURN booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update booking status
CREATE OR REPLACE FUNCTION update_booking_status(
  p_booking_id UUID,
  p_new_status booking_status,
  p_user_id UUID DEFAULT auth.uid(),
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  booking_record RECORD;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record
  FROM bookings
  WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check authorization
  IF p_user_id != booking_record.provider_id AND 
     p_user_id != booking_record.customer_id AND
     NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = p_user_id AND role = 'admin') THEN
    RETURN false;
  END IF;
  
  -- Update booking with appropriate timestamp
  UPDATE bookings 
  SET 
    status = p_new_status,
    confirmed_at = CASE WHEN p_new_status = 'confirmed' THEN NOW() ELSE confirmed_at END,
    started_at = CASE WHEN p_new_status = 'in_progress' THEN NOW() ELSE started_at END,
    completed_at = CASE WHEN p_new_status = 'completed' THEN NOW() ELSE completed_at END,
    cancelled_at = CASE WHEN p_new_status = 'cancelled' THEN NOW() ELSE cancelled_at END,
    provider_notes = CASE WHEN p_user_id = booking_record.provider_id THEN p_notes ELSE provider_notes END,
    customer_notes = CASE WHEN p_user_id = booking_record.customer_id THEN p_notes ELSE customer_notes END,
    cancellation_reason = CASE WHEN p_new_status = 'cancelled' THEN p_notes ELSE cancellation_reason END,
    updated_at = NOW()
  WHERE id = p_booking_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
