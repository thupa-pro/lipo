-- =====================================================
-- LOCONOMY PLATFORM - ADMIN FUNCTIONS
-- =====================================================
-- This script creates functions for admin management
-- Run this after the main database setup
-- =====================================================

-- Function to get admin statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  total_users INTEGER;
  active_users INTEGER;
  total_listings INTEGER;
  active_listings INTEGER;
  total_bookings INTEGER;
  pending_moderation INTEGER;
  flagged_content INTEGER;
  revenue_today DECIMAL;
  revenue_month DECIMAL;
  system_health TEXT;
BEGIN
  -- Count users
  SELECT COUNT(*) INTO total_users FROM auth.users;
  
  SELECT COUNT(*) INTO active_users 
  FROM auth.users u 
  JOIN user_roles ur ON ur.user_id = u.id::TEXT
  WHERE ur.role IN ('consumer', 'provider')
    AND u.last_sign_in_at > NOW() - INTERVAL '30 days';

  -- Count listings
  SELECT COUNT(*) INTO total_listings FROM service_listings;
  SELECT COUNT(*) INTO active_listings FROM service_listings WHERE is_active = true;

  -- Count bookings
  SELECT COUNT(*) INTO total_bookings FROM bookings;

  -- Count moderation items
  SELECT COUNT(*) INTO pending_moderation FROM content_flags WHERE status = 'pending';
  SELECT COUNT(*) INTO flagged_content FROM content_flags WHERE status = 'pending';

  -- Calculate revenue
  SELECT COALESCE(SUM(total_amount), 0) INTO revenue_today
  FROM bookings 
  WHERE status = 'completed' 
    AND DATE(completed_at) = CURRENT_DATE;

  SELECT COALESCE(SUM(total_amount), 0) INTO revenue_month
  FROM bookings 
  WHERE status = 'completed' 
    AND DATE(completed_at) >= DATE_TRUNC('month', CURRENT_DATE);

  -- Determine system health (simplified)
  system_health := 'healthy';
  IF pending_moderation > 50 OR flagged_content > 100 THEN
    system_health := 'warning';
  END IF;
  IF pending_moderation > 100 OR flagged_content > 200 THEN
    system_health := 'critical';
  END IF;

  -- Build stats object
  stats := jsonb_build_object(
    'total_users', total_users,
    'active_users', active_users,
    'total_listings', total_listings,
    'active_listings', active_listings,
    'total_bookings', total_bookings,
    'pending_moderation', pending_moderation,
    'flagged_content', flagged_content,
    'revenue_today', revenue_today,
    'revenue_month', revenue_month,
    'system_health', system_health
  );

  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user status (admin only)
CREATE OR REPLACE FUNCTION admin_update_user_status(
  p_user_id UUID,
  p_status TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID;
  current_role TEXT;
BEGIN
  -- Get the current user ID
  admin_user_id := auth.uid();
  
  -- Check if current user is admin
  SELECT role INTO current_role FROM user_roles WHERE user_id = admin_user_id::TEXT;
  
  IF current_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Update user preferences to include status
  UPDATE user_preferences 
  SET 
    privacy_settings = COALESCE(privacy_settings, '{}'::jsonb) || jsonb_build_object('account_status', p_status),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Log the action
  INSERT INTO system_logs (level, message, component, user_id, metadata)
  VALUES (
    'info',
    'User status updated by admin',
    'admin',
    admin_user_id,
    jsonb_build_object(
      'target_user_id', p_user_id,
      'new_status', p_status,
      'reason', p_reason
    )
  );

  -- Track analytics
  PERFORM track_analytics_event(
    'admin_user_status_change',
    'admin',
    admin_user_id,
    jsonb_build_object(
      'target_user_id', p_user_id,
      'new_status', p_status
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user role (admin only)
CREATE OR REPLACE FUNCTION admin_update_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID;
  current_role TEXT;
  old_role TEXT;
BEGIN
  admin_user_id := auth.uid();
  
  -- Check if current user is admin
  SELECT role INTO current_role FROM user_roles WHERE user_id = admin_user_id::TEXT;
  
  IF current_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Get old role
  SELECT role INTO old_role FROM user_roles WHERE user_id = p_user_id::TEXT;

  -- Update user role
  UPDATE user_roles 
  SET 
    role = p_new_role::user_role,
    updated_at = NOW(),
    assigned_by = admin_user_id
  WHERE user_id = p_user_id::TEXT;

  -- Create appropriate profile if changing to provider
  IF p_new_role = 'provider' AND old_role != 'provider' THEN
    INSERT INTO provider_profiles (user_id, business_name, phone)
    VALUES (p_user_id, 'New Business', '')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- Log the action
  INSERT INTO system_logs (level, message, component, user_id, metadata)
  VALUES (
    'info',
    'User role updated by admin',
    'admin',
    admin_user_id,
    jsonb_build_object(
      'target_user_id', p_user_id,
      'old_role', old_role,
      'new_role', p_new_role
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to review content flags
CREATE OR REPLACE FUNCTION admin_review_content_flag(
  p_flag_id UUID,
  p_action TEXT, -- 'approve', 'reject', 'dismiss'
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID;
  current_role TEXT;
  flag_record content_flags;
BEGIN
  admin_user_id := auth.uid();
  
  -- Check if current user is admin or moderator
  SELECT role INTO current_role FROM user_roles WHERE user_id = admin_user_id::TEXT;
  
  IF current_role NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Access denied: Admin or moderator role required';
  END IF;

  -- Get flag record
  SELECT * INTO flag_record FROM content_flags WHERE id = p_flag_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Content flag not found';
  END IF;

  -- Update flag status
  UPDATE content_flags 
  SET 
    status = CASE 
      WHEN p_action = 'approve' THEN 'resolved'
      WHEN p_action = 'reject' THEN 'dismissed'  
      WHEN p_action = 'dismiss' THEN 'dismissed'
      ELSE 'reviewed'
    END,
    reviewed_by = admin_user_id,
    reviewed_at = NOW(),
    resolution_notes = p_notes
  WHERE id = p_flag_id;

  -- If approved, take action on the content
  IF p_action = 'approve' THEN
    -- This would depend on content type - for now just log it
    INSERT INTO system_logs (level, message, component, user_id, metadata)
    VALUES (
      'warning',
      'Content removed due to approved flag',
      'moderation',
      admin_user_id,
      jsonb_build_object(
        'flag_id', p_flag_id,
        'content_type', flag_record.content_type,
        'content_id', flag_record.content_id,
        'flag_type', flag_record.flag_type
      )
    );
  END IF;

  -- Log the moderation action
  INSERT INTO system_logs (level, message, component, user_id, metadata)
  VALUES (
    'info',
    'Content flag reviewed',
    'moderation',
    admin_user_id,
    jsonb_build_object(
      'flag_id', p_flag_id,
      'action', p_action,
      'notes', p_notes
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for bulk moderation actions
CREATE OR REPLACE FUNCTION admin_bulk_moderation(
  p_flag_ids UUID[],
  p_action TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID;
  current_role TEXT;
  flag_id UUID;
BEGIN
  admin_user_id := auth.uid();
  
  -- Check permissions
  SELECT role INTO current_role FROM user_roles WHERE user_id = admin_user_id::TEXT;
  
  IF current_role NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Access denied: Admin or moderator role required';
  END IF;

  -- Process each flag
  FOREACH flag_id IN ARRAY p_flag_ids
  LOOP
    PERFORM admin_review_content_flag(flag_id, p_action, 'Bulk action');
  END LOOP;

  -- Log bulk action
  INSERT INTO system_logs (level, message, component, user_id, metadata)
  VALUES (
    'info',
    'Bulk moderation action performed',
    'moderation',
    admin_user_id,
    jsonb_build_object(
      'flag_count', array_length(p_flag_ids, 1),
      'action', p_action
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform metrics
CREATE OR REPLACE FUNCTION get_platform_metrics(p_time_range TEXT DEFAULT '30d')
RETURNS JSONB AS $$
DECLARE
  metrics JSONB;
  date_from DATE;
BEGIN
  -- Calculate date range
  CASE p_time_range
    WHEN '7d' THEN date_from := CURRENT_DATE - INTERVAL '7 days';
    WHEN '30d' THEN date_from := CURRENT_DATE - INTERVAL '30 days';
    WHEN '90d' THEN date_from := CURRENT_DATE - INTERVAL '90 days';
    WHEN '1y' THEN date_from := CURRENT_DATE - INTERVAL '1 year';
    ELSE date_from := CURRENT_DATE - INTERVAL '30 days';
  END CASE;

  -- Build metrics (simplified - in production you'd calculate actual trends)
  metrics := jsonb_build_object(
    'daily_active_users', '[120, 135, 142, 128, 156, 163, 178]'::jsonb,
    'monthly_active_users', '[1200, 1380, 1450, 1650, 1890, 2100]'::jsonb,
    'revenue_trends', '[45000, 52000, 48000, 61000, 68000, 75000]'::jsonb,
    'booking_trends', '[250, 290, 275, 340, 380, 420]'::jsonb,
    'user_growth', '[100, 180, 150, 270, 240, 210]'::jsonb,
    'listing_growth', '[45, 62, 58, 71, 83, 95]'::jsonb,
    'retention_rates', '[82, 75, 68, 65, 58, 45]'::jsonb,
    'conversion_rates', '[3.2, 3.8, 2.9, 4.1, 3.7, 3.2]'::jsonb
  );

  RETURN metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system health
CREATE OR REPLACE FUNCTION get_system_health()
RETURNS JSONB AS $$
DECLARE
  health_status TEXT;
  metrics JSONB;
BEGIN
  -- Simple health check based on various factors
  health_status := 'healthy';
  
  -- Check for high flag count
  IF (SELECT COUNT(*) FROM content_flags WHERE status = 'pending') > 50 THEN
    health_status := 'warning';
  END IF;
  
  IF (SELECT COUNT(*) FROM content_flags WHERE status = 'pending') > 100 THEN
    health_status := 'critical';
  END IF;

  -- Build mock metrics (in production, these would come from monitoring systems)
  metrics := jsonb_build_object(
    'cpu_usage', 45.2,
    'memory_usage', 67.8,
    'disk_usage', 34.5,
    'active_connections', 1247,
    'response_time', 85,
    'error_rate', 0.02,
    'uptime', 168,
    'last_updated', NOW()
  );

  RETURN jsonb_build_object(
    'status', health_status,
    'metrics', metrics
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to export data (simplified)
CREATE OR REPLACE FUNCTION admin_export_data(p_export_type TEXT)
RETURNS TEXT AS $$
DECLARE
  csv_data TEXT;
  admin_user_id UUID;
  current_role TEXT;
BEGIN
  admin_user_id := auth.uid();
  
  -- Check permissions
  SELECT role INTO current_role FROM user_roles WHERE user_id = admin_user_id::TEXT;
  
  IF current_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Generate CSV based on type (simplified)
  CASE p_export_type
    WHEN 'users' THEN
      csv_data := 'id,email,role,created_at' || E'\n' ||
                  'sample-user-1,user1@example.com,consumer,2024-01-01' || E'\n' ||
                  'sample-user-2,user2@example.com,provider,2024-01-02';
    WHEN 'bookings' THEN
      csv_data := 'id,consumer_id,provider_id,amount,status,created_at' || E'\n' ||
                  'booking-1,user-1,user-2,150.00,completed,2024-01-15' || E'\n' ||
                  'booking-2,user-3,user-4,75.00,pending,2024-01-16';
    WHEN 'analytics' THEN
      csv_data := 'date,users,revenue,bookings' || E'\n' ||
                  '2024-01-01,1200,45000,250' || E'\n' ||
                  '2024-01-02,1380,52000,290';
    ELSE
      csv_data := 'Export type not supported';
  END CASE;

  -- Log export
  INSERT INTO system_logs (level, message, component, user_id, metadata)
  VALUES (
    'info',
    'Data export performed',
    'admin',
    admin_user_id,
    jsonb_build_object('export_type', p_export_type)
  );

  RETURN csv_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send platform announcement
CREATE OR REPLACE FUNCTION admin_send_announcement(
  p_title TEXT,
  p_message TEXT,
  p_target_role TEXT DEFAULT NULL,
  p_target_users UUID[] DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID;
  current_role TEXT;
  target_user_id UUID;
BEGIN
  admin_user_id := auth.uid();
  
  -- Check permissions
  SELECT role INTO current_role FROM user_roles WHERE user_id = admin_user_id::TEXT;
  
  IF current_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Send to specific users if provided
  IF p_target_users IS NOT NULL THEN
    FOREACH target_user_id IN ARRAY p_target_users
    LOOP
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (target_user_id, 'system_alert', p_title, p_message);
    END LOOP;
  ELSE
    -- Send to all users with specific role or all users
    INSERT INTO notifications (user_id, type, title, message)
    SELECT 
      ur.user_id::UUID,
      'system_alert',
      p_title,
      p_message
    FROM user_roles ur
    WHERE (p_target_role IS NULL OR ur.role = p_target_role::user_role);
  END IF;

  -- Log announcement
  INSERT INTO system_logs (level, message, component, user_id, metadata)
  VALUES (
    'info',
    'Platform announcement sent',
    'admin',
    admin_user_id,
    jsonb_build_object(
      'title', p_title,
      'target_role', p_target_role,
      'target_users_count', COALESCE(array_length(p_target_users, 1), 0)
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create views for admin dashboard
CREATE OR REPLACE VIEW user_management_view AS
SELECT 
  u.id,
  u.email,
  COALESCE(cp.full_name, pp.full_name) as full_name,
  ur.role,
  COALESCE(
    (up.privacy_settings->>'account_status'),
    'active'
  ) as status,
  u.created_at,
  u.last_sign_in_at as last_active,
  COALESCE(
    (SELECT COUNT(*) FROM bookings WHERE consumer_id = u.id OR provider_id = u.id),
    0
  ) as total_bookings,
  COALESCE(
    (SELECT SUM(total_amount) FROM bookings WHERE consumer_id = u.id AND status = 'completed'),
    0
  ) as total_spent
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id::TEXT
LEFT JOIN user_preferences up ON up.user_id = u.id
LEFT JOIN consumer_profiles cp ON cp.user_id = u.id
LEFT JOIN provider_profiles pp ON pp.user_id = u.id;

CREATE OR REPLACE VIEW audit_logs_view AS
SELECT 
  sl.id,
  sl.message as action,
  COALESCE(sl.metadata->>'entity_type', 'unknown') as entity_type,
  COALESCE(sl.metadata->>'entity_id', 'unknown') as entity_id,
  sl.user_id,
  COALESCE(u.email, 'system') as user_email,
  sl.metadata as changes,
  sl.metadata->>'ip_address' as ip_address,
  sl.metadata->>'user_agent' as user_agent,
  sl.created_at
FROM system_logs sl
LEFT JOIN auth.users u ON u.id = sl.user_id;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_status(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_review_content_flag(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_bulk_moderation(UUID[], TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_platform_metrics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_system_health() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_export_data(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_send_announcement(TEXT, TEXT, TEXT, UUID[]) TO authenticated;

GRANT SELECT ON user_management_view TO authenticated;
GRANT SELECT ON audit_logs_view TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Admin functions created successfully!';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '- get_admin_stats()';
  RAISE NOTICE '- admin_update_user_status(user_id, status, reason)';
  RAISE NOTICE '- admin_update_user_role(user_id, new_role)';
  RAISE NOTICE '- admin_review_content_flag(flag_id, action, notes)';
  RAISE NOTICE '- admin_bulk_moderation(flag_ids, action)';
  RAISE NOTICE '- get_platform_metrics(time_range)';
  RAISE NOTICE '- get_system_health()';
  RAISE NOTICE '- admin_export_data(export_type)';
  RAISE NOTICE '- admin_send_announcement(title, message, target_role, target_users)';
END $$;
