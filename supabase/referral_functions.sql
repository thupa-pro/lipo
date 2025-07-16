-- Referral System Database Functions
-- These functions handle the core referral system logic

-- Function to get referral stats for a user
CREATE OR REPLACE FUNCTION get_referral_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_referrals INTEGER;
  successful_referrals INTEGER;
  total_earnings DECIMAL;
  pending_earnings DECIMAL;
  monthly_referrals INTEGER;
  monthly_earnings DECIMAL;
  conversion_rate DECIMAL;
BEGIN
  -- Get total referrals
  SELECT COUNT(*) INTO total_referrals
  FROM referral_history rh
  JOIN referral_codes rc ON rh.referral_code = rc.code
  WHERE rc.user_id = get_referral_stats.user_id;

  -- Get successful referrals
  SELECT COUNT(*) INTO successful_referrals
  FROM referral_history rh
  JOIN referral_codes rc ON rh.referral_code = rc.code
  WHERE rc.user_id = get_referral_stats.user_id
  AND rh.status = 'completed';

  -- Get total earnings
  SELECT COALESCE(SUM(rr.amount), 0) INTO total_earnings
  FROM referral_rewards rr
  WHERE rr.user_id = get_referral_stats.user_id
  AND rr.status = 'credited';

  -- Get pending earnings
  SELECT COALESCE(SUM(rr.amount), 0) INTO pending_earnings
  FROM referral_rewards rr
  WHERE rr.user_id = get_referral_stats.user_id
  AND rr.status = 'pending';

  -- Get monthly referrals (last 30 days)
  SELECT COUNT(*) INTO monthly_referrals
  FROM referral_history rh
  JOIN referral_codes rc ON rh.referral_code = rc.code
  WHERE rc.user_id = get_referral_stats.user_id
  AND rh.created_at >= NOW() - INTERVAL '30 days';

  -- Get monthly earnings (last 30 days)
  SELECT COALESCE(SUM(rr.amount), 0) INTO monthly_earnings
  FROM referral_rewards rr
  WHERE rr.user_id = get_referral_stats.user_id
  AND rr.status = 'credited'
  AND rr.created_at >= NOW() - INTERVAL '30 days';

  -- Calculate conversion rate
  IF total_referrals > 0 THEN
    conversion_rate := (successful_referrals::DECIMAL / total_referrals::DECIMAL) * 100;
  ELSE
    conversion_rate := 0;
  END IF;

  -- Build result JSON
  result := json_build_object(
    'total_referrals', total_referrals,
    'successful_referrals', successful_referrals,
    'total_earnings', total_earnings,
    'pending_earnings', pending_earnings,
    'monthly_referrals', monthly_referrals,
    'monthly_earnings', monthly_earnings,
    'conversion_rate', ROUND(conversion_rate, 2)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get referral history with pagination
CREATE OR REPLACE FUNCTION get_referral_history(
  user_id UUID,
  page_size INTEGER DEFAULT 10,
  page_number INTEGER DEFAULT 1
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_count INTEGER;
  offset_count INTEGER;
BEGIN
  offset_count := (page_number - 1) * page_size;

  -- Get total count
  SELECT COUNT(*) INTO total_count
  FROM referral_history rh
  JOIN referral_codes rc ON rh.referral_code = rc.code
  WHERE rc.user_id = get_referral_history.user_id;

  -- Get paginated data
  SELECT json_build_object(
    'data', COALESCE(json_agg(row_to_json(history_data)), '[]'::json),
    'pagination', json_build_object(
      'page', page_number,
      'limit', page_size,
      'total', total_count,
      'pages', CEIL(total_count::DECIMAL / page_size::DECIMAL)
    )
  ) INTO result
  FROM (
    SELECT 
      rh.id,
      rh.referrer_id,
      rh.referred_user_id,
      rh.referred_email,
      rh.referral_code,
      rh.referral_source,
      rh.status,
      rh.reward_amount,
      rh.created_at,
      rh.completed_at,
      rh.first_booking_id,
      p.first_name || ' ' || p.last_name as referred_user_name
    FROM referral_history rh
    JOIN referral_codes rc ON rh.referral_code = rc.code
    LEFT JOIN profiles p ON rh.referred_user_id = p.user_id
    WHERE rc.user_id = get_referral_history.user_id
    ORDER BY rh.created_at DESC
    LIMIT page_size
    OFFSET offset_count
  ) history_data;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a referral code
CREATE OR REPLACE FUNCTION create_referral_code(
  user_id UUID,
  custom_code TEXT DEFAULT NULL,
  max_uses INTEGER DEFAULT NULL,
  expires_at TIMESTAMP DEFAULT NULL
)
RETURNS referral_codes AS $$
DECLARE
  generated_code TEXT;
  new_record referral_codes;
  code_exists BOOLEAN;
BEGIN
  -- Generate or use custom code
  IF custom_code IS NOT NULL THEN
    generated_code := custom_code;
  ELSE
    -- Generate a unique code based on user ID and timestamp
    generated_code := UPPER(SUBSTR(MD5(user_id::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT), 1, 8));
  END IF;

  -- Check if code already exists
  SELECT EXISTS(
    SELECT 1 FROM referral_codes WHERE code = generated_code
  ) INTO code_exists;

  -- If code exists and it's a generated one, add a suffix
  IF code_exists AND custom_code IS NULL THEN
    generated_code := generated_code || FLOOR(RANDOM() * 1000)::TEXT;
  ELSIF code_exists AND custom_code IS NOT NULL THEN
    RAISE EXCEPTION 'Custom referral code already exists';
  END IF;

  -- Insert new referral code
  INSERT INTO referral_codes (
    user_id,
    code,
    max_uses,
    expires_at,
    is_active,
    created_at
  ) VALUES (
    create_referral_code.user_id,
    generated_code,
    create_referral_code.max_uses,
    create_referral_code.expires_at,
    true,
    NOW()
  ) RETURNING * INTO new_record;

  RETURN new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate a referral code
CREATE OR REPLACE FUNCTION validate_referral_code(referral_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  code_record referral_codes;
BEGIN
  -- Get the referral code record
  SELECT * INTO code_record
  FROM referral_codes
  WHERE code = validate_referral_code.referral_code
  AND is_active = true;

  -- Check if code exists
  IF code_record.id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if code has expired
  IF code_record.expires_at IS NOT NULL AND code_record.expires_at < NOW() THEN
    RETURN false;
  END IF;

  -- Check if max uses exceeded
  IF code_record.max_uses IS NOT NULL AND code_record.uses_count >= code_record.max_uses THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process a referral
CREATE OR REPLACE FUNCTION process_referral(
  referral_code TEXT,
  referred_user_id UUID,
  referral_source TEXT DEFAULT 'direct_link'
)
RETURNS referral_history AS $$
DECLARE
  code_record referral_codes;
  new_referral referral_history;
  program_record referral_programs;
BEGIN
  -- Validate referral code
  IF NOT validate_referral_code(process_referral.referral_code) THEN
    RAISE EXCEPTION 'Invalid or expired referral code';
  END IF;

  -- Get referral code details
  SELECT * INTO code_record
  FROM referral_codes
  WHERE code = process_referral.referral_code;

  -- Check if user is trying to refer themselves
  IF code_record.user_id = process_referral.referred_user_id THEN
    RAISE EXCEPTION 'Users cannot refer themselves';
  END IF;

  -- Check if user has already been referred
  IF EXISTS(
    SELECT 1 FROM referral_history 
    WHERE referred_user_id = process_referral.referred_user_id
  ) THEN
    RAISE EXCEPTION 'User has already been referred';
  END IF;

  -- Get active referral program
  SELECT * INTO program_record
  FROM referral_programs
  WHERE is_active = true
  AND start_date <= NOW()
  AND (end_date IS NULL OR end_date >= NOW())
  LIMIT 1;

  -- Create referral history record
  INSERT INTO referral_history (
    referrer_id,
    referred_user_id,
    referral_code,
    referral_source,
    status,
    reward_amount,
    created_at
  ) VALUES (
    code_record.user_id,
    process_referral.referred_user_id,
    process_referral.referral_code,
    process_referral.referral_source,
    'pending',
    COALESCE(program_record.referrer_reward, 10),
    NOW()
  ) RETURNING * INTO new_referral;

  -- Update referral code usage count
  UPDATE referral_codes
  SET uses_count = uses_count + 1
  WHERE id = code_record.id;

  RETURN new_referral;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a referral
CREATE OR REPLACE FUNCTION complete_referral(
  referral_id UUID,
  booking_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  referral_record referral_history;
  program_record referral_programs;
BEGIN
  -- Get referral record
  SELECT * INTO referral_record
  FROM referral_history
  WHERE id = complete_referral.referral_id
  AND status = 'pending';

  IF referral_record.id IS NULL THEN
    RAISE EXCEPTION 'Referral not found or already completed';
  END IF;

  -- Get active referral program
  SELECT * INTO program_record
  FROM referral_programs
  WHERE is_active = true
  AND start_date <= NOW()
  AND (end_date IS NULL OR end_date >= NOW())
  LIMIT 1;

  -- Update referral status
  UPDATE referral_history
  SET 
    status = 'completed',
    completed_at = NOW(),
    first_booking_id = complete_referral.booking_id
  WHERE id = complete_referral.referral_id;

  -- Create reward for referrer
  INSERT INTO referral_rewards (
    referral_id,
    user_id,
    reward_type,
    amount,
    status,
    created_at
  ) VALUES (
    complete_referral.referral_id,
    referral_record.referrer_id,
    'credit',
    referral_record.reward_amount,
    'pending',
    NOW()
  );

  -- Create reward for referee if applicable
  IF program_record.referee_reward > 0 THEN
    INSERT INTO referral_rewards (
      referral_id,
      user_id,
      reward_type,
      amount,
      status,
      created_at
    ) VALUES (
      complete_referral.referral_id,
      referral_record.referred_user_id,
      'credit',
      program_record.referee_reward,
      'pending',
      NOW()
    );
  END IF;

  -- Log referral event
  INSERT INTO referral_events (
    referral_id,
    event_type,
    event_data,
    created_at
  ) VALUES (
    complete_referral.referral_id,
    'first_booking',
    json_build_object('booking_id', complete_referral.booking_id),
    NOW()
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get referral leaderboard
CREATE OR REPLACE FUNCTION get_referral_leaderboard(
  period_type TEXT DEFAULT 'monthly',
  limit_count INTEGER DEFAULT 10
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
BEGIN
  -- Set date filter based on period
  CASE period_type
    WHEN 'monthly' THEN
      date_filter := NOW() - INTERVAL '30 days';
    WHEN 'quarterly' THEN
      date_filter := NOW() - INTERVAL '90 days';
    WHEN 'yearly' THEN
      date_filter := NOW() - INTERVAL '365 days';
    ELSE
      date_filter := '1900-01-01'::TIMESTAMP;
  END CASE;

  -- Get leaderboard data
  SELECT json_agg(leaderboard_data ORDER BY total_referrals DESC, total_earnings DESC) INTO result
  FROM (
    SELECT 
      rc.user_id,
      p.first_name || ' ' || p.last_name as user_name,
      COUNT(rh.id) as total_referrals,
      COALESCE(SUM(rr.amount), 0) as total_earnings,
      ROW_NUMBER() OVER (ORDER BY COUNT(rh.id) DESC, COALESCE(SUM(rr.amount), 0) DESC) as rank,
      period_type as period
    FROM referral_codes rc
    JOIN profiles p ON rc.user_id = p.user_id
    LEFT JOIN referral_history rh ON rh.referral_code = rc.code 
      AND rh.status = 'completed'
      AND rh.completed_at >= date_filter
    LEFT JOIN referral_rewards rr ON rr.user_id = rc.user_id 
      AND rr.status = 'credited'
      AND rr.created_at >= date_filter
    GROUP BY rc.user_id, p.first_name, p.last_name
    HAVING COUNT(rh.id) > 0
    ORDER BY total_referrals DESC, total_earnings DESC
    LIMIT limit_count
  ) leaderboard_data;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get referral analytics
CREATE OR REPLACE FUNCTION get_referral_analytics(period_type TEXT DEFAULT 'last_30_days')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
  total_referrals INTEGER;
  successful_referrals INTEGER;
  conversion_rate DECIMAL;
  total_rewards_paid DECIMAL;
  avg_conversion_time INTERVAL;
BEGIN
  -- Set date filter
  CASE period_type
    WHEN 'last_7_days' THEN
      date_filter := NOW() - INTERVAL '7 days';
    WHEN 'last_30_days' THEN
      date_filter := NOW() - INTERVAL '30 days';
    WHEN 'last_90_days' THEN
      date_filter := NOW() - INTERVAL '90 days';
    WHEN 'last_year' THEN
      date_filter := NOW() - INTERVAL '365 days';
    ELSE
      date_filter := '1900-01-01'::TIMESTAMP;
  END CASE;

  -- Get basic metrics
  SELECT COUNT(*) INTO total_referrals
  FROM referral_history
  WHERE created_at >= date_filter;

  SELECT COUNT(*) INTO successful_referrals
  FROM referral_history
  WHERE created_at >= date_filter
  AND status = 'completed';

  SELECT COALESCE(SUM(amount), 0) INTO total_rewards_paid
  FROM referral_rewards
  WHERE created_at >= date_filter
  AND status = 'credited';

  -- Calculate conversion rate
  IF total_referrals > 0 THEN
    conversion_rate := (successful_referrals::DECIMAL / total_referrals::DECIMAL) * 100;
  ELSE
    conversion_rate := 0;
  END IF;

  -- Calculate average time to conversion
  SELECT AVG(completed_at - created_at) INTO avg_conversion_time
  FROM referral_history
  WHERE created_at >= date_filter
  AND status = 'completed';

  -- Build comprehensive result
  SELECT json_build_object(
    'period', period_type,
    'total_referrals', total_referrals,
    'successful_referrals', successful_referrals,
    'conversion_rate', ROUND(conversion_rate, 2),
    'total_rewards_paid', total_rewards_paid,
    'average_time_to_conversion', EXTRACT(EPOCH FROM COALESCE(avg_conversion_time, INTERVAL '0'))::INTEGER,
    'top_referral_sources', (
      SELECT json_agg(source_data ORDER BY count DESC)
      FROM (
        SELECT 
          referral_source as source,
          COUNT(*) as count,
          ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2) as conversion_rate
        FROM referral_history
        WHERE created_at >= date_filter
        GROUP BY referral_source
        ORDER BY COUNT(*) DESC
        LIMIT 5
      ) source_data
    ),
    'geographic_distribution', (
      SELECT json_agg(geo_data ORDER BY referrals DESC)
      FROM (
        SELECT 
          COALESCE(p.location, 'Unknown') as location,
          COUNT(*) as referrals,
          ROUND((COUNT(CASE WHEN rh.status = 'completed' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2) as conversion_rate
        FROM referral_history rh
        LEFT JOIN profiles p ON rh.referred_user_id = p.user_id
        WHERE rh.created_at >= date_filter
        GROUP BY p.location
        ORDER BY COUNT(*) DESC
        LIMIT 10
      ) geo_data
    ),
    'referral_channels', (
      SELECT json_agg(channel_data ORDER BY referrals DESC)
      FROM (
        SELECT 
          referral_source as channel,
          COUNT(*) as referrals,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as conversions
        FROM referral_history
        WHERE created_at >= date_filter
        GROUP BY referral_source
        ORDER BY COUNT(*) DESC
      ) channel_data
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get affiliate stats
CREATE OR REPLACE FUNCTION get_affiliate_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_commissions', COALESCE(SUM(commission_amount), 0),
    'pending_commissions', COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0),
    'paid_commissions', COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END), 0),
    'total_bookings_generated', COUNT(*),
    'conversion_rate', CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(CASE WHEN status != 'cancelled' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2)
      ELSE 0 
    END,
    'average_commission_amount', CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND(AVG(commission_amount), 2)
      ELSE 0 
    END
  ) INTO result
  FROM affiliate_commissions
  WHERE affiliate_id = get_affiliate_stats.user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get affiliate commissions with pagination
CREATE OR REPLACE FUNCTION get_affiliate_commissions(
  user_id UUID,
  page_size INTEGER DEFAULT 10,
  page_number INTEGER DEFAULT 1
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_count INTEGER;
  offset_count INTEGER;
BEGIN
  offset_count := (page_number - 1) * page_size;

  -- Get total count
  SELECT COUNT(*) INTO total_count
  FROM affiliate_commissions
  WHERE affiliate_id = get_affiliate_commissions.user_id;

  -- Get paginated data
  SELECT json_build_object(
    'data', COALESCE(json_agg(row_to_json(commission_data)), '[]'::json),
    'pagination', json_build_object(
      'page', page_number,
      'limit', page_size,
      'total', total_count,
      'pages', CEIL(total_count::DECIMAL / page_size::DECIMAL)
    )
  ) INTO result
  FROM (
    SELECT *
    FROM affiliate_commissions
    WHERE affiliate_id = get_affiliate_commissions.user_id
    ORDER BY created_at DESC
    LIMIT page_size
    OFFSET offset_count
  ) commission_data;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user referral tier
CREATE OR REPLACE FUNCTION get_user_referral_tier(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  user_referrals INTEGER;
  user_earnings DECIMAL;
  current_tier referral_tiers;
  next_tier referral_tiers;
  progress DECIMAL;
BEGIN
  -- Get user's referral stats
  SELECT 
    COUNT(rh.id),
    COALESCE(SUM(rr.amount), 0)
  INTO user_referrals, user_earnings
  FROM referral_codes rc
  LEFT JOIN referral_history rh ON rh.referral_code = rc.code AND rh.status = 'completed'
  LEFT JOIN referral_rewards rr ON rr.user_id = rc.user_id AND rr.status = 'credited'
  WHERE rc.user_id = get_user_referral_tier.user_id;

  -- Get current tier
  SELECT * INTO current_tier
  FROM referral_tiers
  WHERE min_referrals <= user_referrals
  AND (max_referrals IS NULL OR max_referrals >= user_referrals)
  ORDER BY min_referrals DESC
  LIMIT 1;

  -- Get next tier
  SELECT * INTO next_tier
  FROM referral_tiers
  WHERE min_referrals > user_referrals
  ORDER BY min_referrals ASC
  LIMIT 1;

  -- Calculate progress to next tier
  IF next_tier.id IS NOT NULL THEN
    progress := (user_referrals::DECIMAL / next_tier.min_referrals::DECIMAL) * 100;
  ELSE
    progress := 100;
  END IF;

  -- Build result
  SELECT json_build_object(
    'user_id', get_user_referral_tier.user_id,
    'current_tier_id', current_tier.id,
    'total_referrals', user_referrals,
    'total_earnings', user_earnings,
    'next_tier_id', next_tier.id,
    'next_tier_progress', ROUND(LEAST(progress, 100), 1)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_referral_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_referral_history(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION create_referral_code(UUID, TEXT, INTEGER, TIMESTAMP) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_referral_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION process_referral(TEXT, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_referral(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_referral_leaderboard(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_referral_analytics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_affiliate_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_affiliate_commissions(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_referral_tier(UUID) TO authenticated;
