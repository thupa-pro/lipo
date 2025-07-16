-- =====================================================
-- LOCONOMY PLATFORM - BOOKING FUNCTIONS
-- =====================================================
-- This script creates functions for booking management
-- Run this after the main database setup
-- =====================================================

-- Function to create a new booking
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
  listing_record service_listings;
  end_time TIME;
  total_amount DECIMAL;
  service_fee DECIMAL;
  base_price DECIMAL;
BEGIN
  -- Get listing details
  SELECT * INTO listing_record FROM service_listings WHERE id = p_listing_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found or inactive';
  END IF;

  -- Calculate end time
  end_time := p_start_time + (p_duration_minutes || ' minutes')::INTERVAL;

  -- Calculate pricing
  IF listing_record.pricing_type = 'hourly' THEN
    base_price := listing_record.hourly_rate * (p_duration_minutes / 60.0);
  ELSE
    base_price := COALESCE(listing_record.base_price, 0);
  END IF;

  -- Calculate service fee (5% of base price)
  service_fee := base_price * 0.05;
  total_amount := base_price + service_fee;

  -- Check if slot is available
  IF NOT check_provider_availability(
    listing_record.provider_id, 
    p_booking_date, 
    p_start_time, 
    end_time
  ) THEN
    RAISE EXCEPTION 'Time slot is not available';
  END IF;

  -- Create the booking
  INSERT INTO bookings (
    listing_id,
    consumer_id,
    provider_id,
    scheduled_date,
    scheduled_time,
    estimated_duration,
    base_price,
    total_amount,
    special_instructions,
    service_address,
    booking_number
  ) VALUES (
    p_listing_id,
    p_customer_id,
    listing_record.provider_id,
    p_booking_date,
    p_start_time,
    p_duration_minutes,
    base_price,
    total_amount,
    p_special_requests,
    '{"type": "customer_location"}'::jsonb,
    generate_booking_number()
  ) RETURNING id INTO booking_id;

  -- Track analytics
  PERFORM track_analytics_event(
    'booking_created',
    'bookings',
    p_customer_id,
    jsonb_build_object(
      'booking_id', booking_id,
      'listing_id', p_listing_id,
      'provider_id', listing_record.provider_id,
      'total_amount', total_amount
    )
  );

  RETURN booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check provider availability
CREATE OR REPLACE FUNCTION check_provider_availability(
  p_provider_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  day_of_week_num INTEGER;
  day_name TEXT;
  has_regular_availability BOOLEAN := false;
  has_override BOOLEAN := false;
  is_override_available BOOLEAN := false;
  has_conflicting_booking BOOLEAN := false;
BEGIN
  -- Get day of week (0 = Sunday, 1 = Monday, etc.)
  day_of_week_num := EXTRACT(dow FROM p_date);
  
  -- Convert to day name
  day_name := CASE day_of_week_num
    WHEN 0 THEN 'sunday'
    WHEN 1 THEN 'monday'
    WHEN 2 THEN 'tuesday'
    WHEN 3 THEN 'wednesday'
    WHEN 4 THEN 'thursday'
    WHEN 5 THEN 'friday'
    WHEN 6 THEN 'saturday'
  END;

  -- Check if provider has regular availability for this day
  SELECT EXISTS(
    SELECT 1 FROM provider_availability 
    WHERE provider_id = p_provider_id 
      AND day_of_week = day_of_week_num
      AND is_available = true
      AND start_time <= p_start_time 
      AND end_time >= p_end_time
  ) INTO has_regular_availability;

  -- Check for availability overrides
  SELECT 
    EXISTS(SELECT 1 FROM provider_availability WHERE provider_id = p_provider_id AND date_override = p_date),
    COALESCE(bool_or(is_available), false)
  INTO has_override, is_override_available
  FROM provider_availability 
  WHERE provider_id = p_provider_id 
    AND date_override = p_date;

  -- Determine if available based on regular schedule or override
  IF has_override THEN
    IF NOT is_override_available THEN
      RETURN false;
    END IF;
  ELSIF NOT has_regular_availability THEN
    RETURN false;
  END IF;

  -- Check for conflicting bookings
  SELECT EXISTS(
    SELECT 1 FROM bookings 
    WHERE provider_id = p_provider_id 
      AND scheduled_date = p_date
      AND status NOT IN ('cancelled', 'completed')
      AND (
        (scheduled_time <= p_start_time AND (scheduled_time + (estimated_duration || ' minutes')::INTERVAL)::TIME > p_start_time) OR
        (scheduled_time < p_end_time AND scheduled_time >= p_start_time)
      )
  ) INTO has_conflicting_booking;

  RETURN NOT has_conflicting_booking;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available time slots for a provider on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  p_provider_id UUID,
  p_date DATE,
  p_slot_duration_minutes INTEGER DEFAULT 60
)
RETURNS TABLE (
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN
) AS $$
DECLARE
  day_of_week_num INTEGER;
  provider_start_time TIME;
  provider_end_time TIME;
  current_time TIME;
  slot_interval INTERVAL;
  busy_slots TIME[];
BEGIN
  -- Get day of week
  day_of_week_num := EXTRACT(dow FROM p_date);
  
  slot_interval := (p_slot_duration_minutes || ' minutes')::INTERVAL;

  -- Get provider's availability for this day
  SELECT pa.start_time, pa.end_time 
  INTO provider_start_time, provider_end_time
  FROM provider_availability pa 
  WHERE pa.provider_id = p_provider_id 
    AND pa.day_of_week = day_of_week_num
    AND pa.is_available = true
    AND pa.date_override IS NULL;

  -- If no regular availability, check for override
  IF provider_start_time IS NULL THEN
    SELECT pa.start_time, pa.end_time 
    INTO provider_start_time, provider_end_time
    FROM provider_availability pa 
    WHERE pa.provider_id = p_provider_id 
      AND pa.date_override = p_date
      AND pa.is_available = true;
  END IF;

  -- If still no availability, return empty
  IF provider_start_time IS NULL THEN
    RETURN;
  END IF;

  -- Get busy time slots (existing bookings)
  SELECT array_agg(scheduled_time) INTO busy_slots
  FROM bookings 
  WHERE provider_id = p_provider_id 
    AND scheduled_date = p_date
    AND status NOT IN ('cancelled', 'completed');

  -- Generate time slots
  current_time := provider_start_time;
  
  WHILE current_time + slot_interval <= provider_end_time LOOP
    RETURN QUERY SELECT 
      current_time as start_time,
      (current_time + slot_interval)::TIME as end_time,
      NOT (current_time = ANY(COALESCE(busy_slots, ARRAY[]::TIME[]))) as is_available;
    
    current_time := current_time + slot_interval;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update booking status
CREATE OR REPLACE FUNCTION update_booking_status(
  p_booking_id UUID,
  p_new_status booking_status,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  booking_record bookings;
  old_status booking_status;
BEGIN
  -- Get current booking
  SELECT * INTO booking_record FROM bookings WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  old_status := booking_record.status;

  -- Update booking status
  UPDATE bookings 
  SET 
    status = p_new_status,
    updated_at = NOW(),
    provider_notes = CASE 
      WHEN p_notes IS NOT NULL THEN p_notes 
      ELSE provider_notes 
    END
  WHERE id = p_booking_id;

  -- Log the status change
  INSERT INTO booking_status_history (
    booking_id, old_status, new_status, changed_by, reason
  ) VALUES (
    p_booking_id, old_status, p_new_status, auth.uid(), p_notes
  );

  -- Track analytics
  PERFORM track_analytics_event(
    'booking_status_changed',
    'bookings',
    auth.uid(),
    jsonb_build_object(
      'booking_id', p_booking_id,
      'old_status', old_status,
      'new_status', p_new_status,
      'provider_id', booking_record.provider_id,
      'consumer_id', booking_record.consumer_id
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get booking statistics
CREATE OR REPLACE FUNCTION get_booking_stats(
  p_user_id UUID,
  p_user_type TEXT DEFAULT 'consumer' -- 'consumer' or 'provider'
)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  total_bookings INTEGER;
  pending_bookings INTEGER;
  confirmed_bookings INTEGER;
  completed_bookings INTEGER;
  cancelled_bookings INTEGER;
  total_revenue DECIMAL;
  current_month_start DATE;
  current_month_bookings INTEGER;
  current_month_revenue DECIMAL;
BEGIN
  current_month_start := date_trunc('month', CURRENT_DATE);

  IF p_user_type = 'provider' THEN
    -- Provider stats
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE status = 'pending'),
      COUNT(*) FILTER (WHERE status = 'confirmed'),
      COUNT(*) FILTER (WHERE status = 'completed'),
      COUNT(*) FILTER (WHERE status = 'cancelled'),
      COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0),
      COUNT(*) FILTER (WHERE scheduled_date >= current_month_start),
      COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed' AND scheduled_date >= current_month_start), 0)
    INTO 
      total_bookings, pending_bookings, confirmed_bookings, 
      completed_bookings, cancelled_bookings, total_revenue,
      current_month_bookings, current_month_revenue
    FROM bookings 
    WHERE provider_id = p_user_id;
  ELSE
    -- Consumer stats
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE status = 'pending'),
      COUNT(*) FILTER (WHERE status = 'confirmed'),
      COUNT(*) FILTER (WHERE status = 'completed'),
      COUNT(*) FILTER (WHERE status = 'cancelled'),
      COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0),
      COUNT(*) FILTER (WHERE scheduled_date >= current_month_start),
      COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed' AND scheduled_date >= current_month_start), 0)
    INTO 
      total_bookings, pending_bookings, confirmed_bookings, 
      completed_bookings, cancelled_bookings, total_revenue,
      current_month_bookings, current_month_revenue
    FROM bookings 
    WHERE consumer_id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'total_bookings', COALESCE(total_bookings, 0),
    'pending_bookings', COALESCE(pending_bookings, 0),
    'confirmed_bookings', COALESCE(confirmed_bookings, 0),
    'completed_bookings', COALESCE(completed_bookings, 0),
    'cancelled_bookings', COALESCE(cancelled_bookings, 0),
    'total_revenue', COALESCE(total_revenue, 0),
    'this_month_bookings', COALESCE(current_month_bookings, 0),
    'this_month_revenue', COALESCE(current_month_revenue, 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel a booking
CREATE OR REPLACE FUNCTION cancel_booking(
  p_booking_id UUID,
  p_cancellation_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  booking_record bookings;
  cancellation_fee DECIMAL := 0;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record FROM bookings WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF booking_record.status IN ('cancelled', 'completed') THEN
    RAISE EXCEPTION 'Cannot cancel booking with status: %', booking_record.status;
  END IF;

  -- Calculate cancellation fee based on timing
  IF booking_record.scheduled_date <= CURRENT_DATE + INTERVAL '24 hours' THEN
    cancellation_fee := booking_record.total_amount * 0.5; -- 50% fee for late cancellation
  END IF;

  -- Update booking
  UPDATE bookings 
  SET 
    status = 'cancelled',
    cancelled_at = NOW(),
    cancellation_reason = p_cancellation_reason,
    cancelled_by = auth.uid(),
    updated_at = NOW()
  WHERE id = p_booking_id;

  -- Create status history
  INSERT INTO booking_status_history (
    booking_id, old_status, new_status, changed_by, reason
  ) VALUES (
    p_booking_id, booking_record.status, 'cancelled', auth.uid(), p_cancellation_reason
  );

  -- Track analytics
  PERFORM track_analytics_event(
    'booking_cancelled',
    'bookings',
    auth.uid(),
    jsonb_build_object(
      'booking_id', p_booking_id,
      'provider_id', booking_record.provider_id,
      'consumer_id', booking_record.consumer_id,
      'cancellation_reason', p_cancellation_reason,
      'cancellation_fee', cancellation_fee
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reschedule a booking
CREATE OR REPLACE FUNCTION reschedule_booking(
  p_booking_id UUID,
  p_new_date DATE,
  p_new_start_time TIME,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  booking_record bookings;
  new_end_time TIME;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record FROM bookings WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF booking_record.status NOT IN ('pending', 'confirmed') THEN
    RAISE EXCEPTION 'Cannot reschedule booking with status: %', booking_record.status;
  END IF;

  -- Calculate new end time
  new_end_time := p_new_start_time + (booking_record.estimated_duration || ' minutes')::INTERVAL;

  -- Check if new slot is available
  IF NOT check_provider_availability(
    booking_record.provider_id, 
    p_new_date, 
    p_new_start_time, 
    new_end_time
  ) THEN
    RAISE EXCEPTION 'New time slot is not available';
  END IF;

  -- Update booking
  UPDATE bookings 
  SET 
    scheduled_date = p_new_date,
    scheduled_time = p_new_start_time,
    updated_at = NOW()
  WHERE id = p_booking_id;

  -- Log the reschedule
  INSERT INTO booking_status_history (
    booking_id, old_status, new_status, changed_by, reason, metadata
  ) VALUES (
    p_booking_id, 
    booking_record.status, 
    booking_record.status, 
    auth.uid(), 
    COALESCE(p_reason, 'Booking rescheduled'),
    jsonb_build_object(
      'action', 'reschedule',
      'old_date', booking_record.scheduled_date,
      'old_time', booking_record.scheduled_time,
      'new_date', p_new_date,
      'new_time', p_new_start_time
    )
  );

  -- Track analytics
  PERFORM track_analytics_event(
    'booking_rescheduled',
    'bookings',
    auth.uid(),
    jsonb_build_object(
      'booking_id', p_booking_id,
      'provider_id', booking_record.provider_id,
      'consumer_id', booking_record.consumer_id,
      'old_date', booking_record.scheduled_date,
      'new_date', p_new_date
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_booking(UUID, UUID, DATE, TIME, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_provider_availability(UUID, DATE, TIME, TIME) TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_slots(UUID, DATE, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION update_booking_status(UUID, booking_status, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_booking_stats(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_booking(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reschedule_booking(UUID, DATE, TIME, TEXT) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Booking functions created successfully!';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '- create_booking(listing_id, customer_id, date, start_time, duration, requests)';
  RAISE NOTICE '- check_provider_availability(provider_id, date, start_time, end_time)';
  RAISE NOTICE '- get_available_slots(provider_id, date, slot_duration)';
  RAISE NOTICE '- update_booking_status(booking_id, new_status, notes)';
  RAISE NOTICE '- get_booking_stats(user_id, user_type)';
  RAISE NOTICE '- cancel_booking(booking_id, reason)';
  RAISE NOTICE '- reschedule_booking(booking_id, new_date, new_time, reason)';
END $$;
