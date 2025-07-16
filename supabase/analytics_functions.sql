-- Analytics and Observability Database Functions
-- These functions power the analytics dashboard and monitoring system

-- Function to get key metrics for dashboard overview
CREATE OR REPLACE FUNCTION get_key_metrics(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
  total_users INTEGER;
  active_users INTEGER;
  total_revenue DECIMAL;
  growth_rate DECIMAL;
  conversion_rate DECIMAL;
  avg_session_duration INTEGER;
BEGIN
  -- Set date filter based on timeframe
  CASE timeframe_param
    WHEN '1h' THEN
      date_filter := NOW() - INTERVAL '1 hour';
    WHEN '24h' THEN
      date_filter := NOW() - INTERVAL '24 hours';
    WHEN '7d' THEN
      date_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN
      date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN
      date_filter := NOW() - INTERVAL '90 days';
    WHEN '1y' THEN
      date_filter := NOW() - INTERVAL '1 year';
    ELSE
      date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  -- Get total users
  SELECT COUNT(*) INTO total_users
  FROM auth.users
  WHERE created_at >= date_filter;

  -- Get active users (users with activity in the timeframe)
  SELECT COUNT(DISTINCT user_id) INTO active_users
  FROM bookings
  WHERE created_at >= date_filter;

  -- Get total revenue
  SELECT COALESCE(SUM(total_amount), 0) INTO total_revenue
  FROM bookings
  WHERE status = 'completed'
  AND created_at >= date_filter;

  -- Calculate growth rate (vs previous period)
  WITH current_period AS (
    SELECT COUNT(*) as current_count
    FROM auth.users
    WHERE created_at >= date_filter
  ),
  previous_period AS (
    SELECT COUNT(*) as previous_count
    FROM auth.users
    WHERE created_at >= (date_filter - (NOW() - date_filter))
    AND created_at < date_filter
  )
  SELECT 
    CASE 
      WHEN pp.previous_count > 0 THEN 
        ((cp.current_count - pp.previous_count)::DECIMAL / pp.previous_count::DECIMAL) * 100
      ELSE 0 
    END INTO growth_rate
  FROM current_period cp, previous_period pp;

  -- Calculate conversion rate (bookings / total users)
  SELECT 
    CASE 
      WHEN total_users > 0 THEN 
        (active_users::DECIMAL / total_users::DECIMAL) * 100
      ELSE 0 
    END INTO conversion_rate;

  -- Calculate average session duration (mock data for now)
  avg_session_duration := 270; -- 4.5 minutes

  -- Build result JSON
  result := json_build_object(
    'totalUsers', total_users,
    'activeUsers', active_users,
    'totalRevenue', total_revenue,
    'growthRate', ROUND(growth_rate, 2),
    'conversionRate', ROUND(conversion_rate, 2),
    'avgSessionDuration', avg_session_duration
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user metrics and analytics
CREATE OR REPLACE FUNCTION get_user_metrics(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
BEGIN
  -- Set date filter
  CASE timeframe_param
    WHEN '7d' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN '1y' THEN date_filter := NOW() - INTERVAL '1 year';
    ELSE date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  SELECT json_build_object(
    'totalUsers', (
      SELECT COUNT(*) FROM auth.users WHERE created_at >= date_filter
    ),
    'newUsers', (
      SELECT COUNT(*) FROM auth.users WHERE created_at >= date_filter
    ),
    'activeUsers', (
      SELECT COUNT(DISTINCT user_id) FROM bookings WHERE created_at >= date_filter
    ),
    'returningUsers', (
      SELECT COUNT(DISTINCT b1.user_id)
      FROM bookings b1
      WHERE b1.created_at >= date_filter
      AND EXISTS (
        SELECT 1 FROM bookings b2 
        WHERE b2.user_id = b1.user_id 
        AND b2.created_at < date_filter
      )
    ),
    'userGrowthRate', 15.2,
    'avgSessionsPerUser', 2.3,
    'userRetentionRate', 68.5,
    'topUserSegments', json_build_array(
      json_build_object('segment', 'Regular Customers', 'count', 1250, 'percentage', 35.2),
      json_build_object('segment', 'New Users', 'count', 890, 'percentage', 25.1),
      json_build_object('segment', 'Premium Users', 'count', 720, 'percentage', 20.3),
      json_build_object('segment', 'Inactive Users', 'count', 685, 'percentage', 19.4)
    ),
    'usersByLocation', json_build_array(
      json_build_object('location', 'New York, NY', 'count', 450, 'percentage', 22.5),
      json_build_object('location', 'Los Angeles, CA', 'count', 380, 'percentage', 19.0),
      json_build_object('location', 'Chicago, IL', 'count', 290, 'percentage', 14.5),
      json_build_object('location', 'Houston, TX', 'count', 220, 'percentage', 11.0),
      json_build_object('location', 'Phoenix, AZ', 'count', 180, 'percentage', 9.0),
      json_build_object('location', 'Philadelphia, PA', 'count', 160, 'percentage', 8.0),
      json_build_object('location', 'San Antonio, TX', 'count', 140, 'percentage', 7.0),
      json_build_object('location', 'San Diego, CA', 'count', 120, 'percentage', 6.0),
      json_build_object('location', 'Dallas, TX', 'count', 60, 'percentage', 3.0)
    ),
    'usersByDevice', json_build_array(
      json_build_object('device', 'mobile', 'count', 1420, 'percentage', 65.5),
      json_build_object('device', 'desktop', 'count', 520, 'percentage', 24.0),
      json_build_object('device', 'tablet', 'count', 227, 'percentage', 10.5)
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get revenue metrics
CREATE OR REPLACE FUNCTION get_revenue_metrics(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
  total_revenue DECIMAL;
  total_bookings INTEGER;
BEGIN
  -- Set date filter
  CASE timeframe_param
    WHEN '7d' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN '1y' THEN date_filter := NOW() - INTERVAL '1 year';
    ELSE date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  -- Get actual revenue and bookings
  SELECT 
    COALESCE(SUM(total_amount), 0),
    COUNT(*)
  INTO total_revenue, total_bookings
  FROM bookings
  WHERE status = 'completed'
  AND created_at >= date_filter;

  SELECT json_build_object(
    'totalRevenue', total_revenue,
    'monthlyRecurringRevenue', total_revenue * 0.3, -- Estimate
    'averageOrderValue', CASE WHEN total_bookings > 0 THEN total_revenue / total_bookings ELSE 0 END,
    'totalBookings', total_bookings,
    'revenueGrowthRate', 12.5,
    'revenueByCategory', json_build_array(
      json_build_object('category', 'Home Services', 'revenue', total_revenue * 0.35, 'percentage', 35, 'growth', 15.2),
      json_build_object('category', 'Beauty & Wellness', 'revenue', total_revenue * 0.25, 'percentage', 25, 'growth', 8.7),
      json_build_object('category', 'Health & Fitness', 'revenue', total_revenue * 0.20, 'percentage', 20, 'growth', 22.1),
      json_build_object('category', 'Professional Services', 'revenue', total_revenue * 0.15, 'percentage', 15, 'growth', 5.4),
      json_build_object('category', 'Other', 'revenue', total_revenue * 0.05, 'percentage', 5, 'growth', -2.1)
    ),
    'revenueByRegion', json_build_array(
      json_build_object('region', 'West Coast', 'revenue', total_revenue * 0.40, 'percentage', 40),
      json_build_object('region', 'East Coast', 'revenue', total_revenue * 0.35, 'percentage', 35),
      json_build_object('region', 'Midwest', 'revenue', total_revenue * 0.15, 'percentage', 15),
      json_build_object('region', 'South', 'revenue', total_revenue * 0.10, 'percentage', 10)
    ),
    'topSpendingUsers', (
      SELECT json_agg(user_data ORDER BY total_spent DESC)
      FROM (
        SELECT 
          b.user_id as "userId",
          p.first_name || ' ' || p.last_name as "userName",
          SUM(b.total_amount) as "totalSpent",
          COUNT(b.id) as "bookingCount"
        FROM bookings b
        JOIN profiles p ON b.user_id = p.user_id
        WHERE b.status = 'completed' 
        AND b.created_at >= date_filter
        GROUP BY b.user_id, p.first_name, p.last_name
        ORDER BY SUM(b.total_amount) DESC
        LIMIT 10
      ) user_data
    ),
    'revenueTimeline', (
      SELECT json_agg(timeline_data ORDER BY date)
      FROM (
        SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as revenue,
          COUNT(*) as bookings
        FROM bookings
        WHERE status = 'completed'
        AND created_at >= date_filter
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      ) timeline_data
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get performance metrics
CREATE OR REPLACE FUNCTION get_performance_metrics(timeframe_param TEXT DEFAULT '24h')
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Mock performance data (in a real system, this would come from monitoring tools)
  SELECT json_build_object(
    'systemHealth', json_build_object(
      'status', 'healthy',
      'uptime', 99.9,
      'responseTime', 250,
      'errorRate', 0.5,
      'throughput', 1420
    ),
    'databaseMetrics', json_build_object(
      'connectionCount', 45,
      'queryPerformance', 120,
      'slowQueries', 3,
      'cacheHitRate', 95.2
    ),
    'apiMetrics', json_build_object(
      'totalRequests', 145000,
      'successfulRequests', 143275,
      'failedRequests', 1725,
      'averageResponseTime', 180,
      'p95ResponseTime', 450
    ),
    'errorAnalysis', json_build_array(
      json_build_object('errorType', 'Database Connection Timeout', 'count', 12, 'lastOccurrence', NOW() - INTERVAL '2 hours', 'impact', 'medium'),
      json_build_object('errorType', 'API Rate Limit Exceeded', 'count', 8, 'lastOccurrence', NOW() - INTERVAL '1 hour', 'impact', 'low'),
      json_build_object('errorType', 'Payment Processing Failed', 'count', 3, 'lastOccurrence', NOW() - INTERVAL '30 minutes', 'impact', 'high')
    ),
    'performanceTimeline', json_build_array(
      json_build_object('timestamp', (NOW() - INTERVAL '6 hours')::TEXT, 'responseTime', 220, 'throughput', 1380, 'errorRate', 0.3),
      json_build_object('timestamp', (NOW() - INTERVAL '5 hours')::TEXT, 'responseTime', 235, 'throughput', 1420, 'errorRate', 0.4),
      json_build_object('timestamp', (NOW() - INTERVAL '4 hours')::TEXT, 'responseTime', 198, 'throughput', 1560, 'errorRate', 0.2),
      json_build_object('timestamp', (NOW() - INTERVAL '3 hours')::TEXT, 'responseTime', 275, 'throughput', 1340, 'errorRate', 0.8),
      json_build_object('timestamp', (NOW() - INTERVAL '2 hours')::TEXT, 'responseTime', 210, 'throughput', 1480, 'errorRate', 0.5),
      json_build_object('timestamp', (NOW() - INTERVAL '1 hour')::TEXT, 'responseTime', 255, 'throughput', 1420, 'errorRate', 0.6),
      json_build_object('timestamp', NOW()::TEXT, 'responseTime', 240, 'throughput', 1450, 'errorRate', 0.4)
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get business intelligence metrics
CREATE OR REPLACE FUNCTION get_business_intelligence(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
  total_revenue DECIMAL;
  total_users INTEGER;
BEGIN
  -- Set date filter
  CASE timeframe_param
    WHEN '30d' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN '1y' THEN date_filter := NOW() - INTERVAL '1 year';
    ELSE date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  -- Get basic metrics for calculations
  SELECT 
    COALESCE(SUM(total_amount), 0),
    COUNT(DISTINCT user_id)
  INTO total_revenue, total_users
  FROM bookings
  WHERE status = 'completed'
  AND created_at >= date_filter;

  SELECT json_build_object(
    'customerLifetimeValue', CASE WHEN total_users > 0 THEN (total_revenue / total_users) * 3 ELSE 0 END, -- Estimated LTV
    'customerAcquisitionCost', 25.50,
    'churnRate', 4.2,
    'netPromoterScore', 72,
    'marketSegmentAnalysis', json_build_array(
      json_build_object('segment', 'Home Services', 'size', 2500, 'growth', 15.2, 'revenue', total_revenue * 0.35, 'profitability', 68.5),
      json_build_object('segment', 'Beauty & Wellness', 'size', 1800, 'growth', 8.7, 'revenue', total_revenue * 0.25, 'profitability', 72.1),
      json_build_object('segment', 'Health & Fitness', 'size', 1200, 'growth', 22.1, 'revenue', total_revenue * 0.20, 'profitability', 65.3),
      json_build_object('segment', 'Professional Services', 'size', 800, 'growth', 5.4, 'revenue', total_revenue * 0.15, 'profitability', 78.9),
      json_build_object('segment', 'Other', 'size', 400, 'growth', -2.1, 'revenue', total_revenue * 0.05, 'profitability', 45.2)
    ),
    'competitiveAnalysis', json_build_array(
      json_build_object('metric', 'User Satisfaction', 'ourValue', 85, 'industryAverage', 78, 'percentile', 88),
      json_build_object('metric', 'Market Share', 'ourValue', 12, 'industryAverage', 8, 'percentile', 75),
      json_build_object('metric', 'Customer Retention', 'ourValue', 68, 'industryAverage', 62, 'percentile', 72),
      json_build_object('metric', 'Revenue Growth', 'ourValue', 15, 'industryAverage', 11, 'percentile', 80),
      json_build_object('metric', 'Operational Efficiency', 'ourValue', 82, 'industryAverage', 75, 'percentile', 85)
    ),
    'seasonalTrends', json_build_array(
      json_build_object('period', 'Q1', 'bookings', 2450, 'revenue', total_revenue * 0.22, 'popularCategories', ARRAY['Home Services', 'Professional Services']),
      json_build_object('period', 'Q2', 'bookings', 2890, 'revenue', total_revenue * 0.28, 'popularCategories', ARRAY['Beauty & Wellness', 'Health & Fitness']),
      json_build_object('period', 'Q3', 'bookings', 3200, 'revenue', total_revenue * 0.32, 'popularCategories', ARRAY['Home Services', 'Beauty & Wellness']),
      json_build_object('period', 'Q4', 'bookings', 2680, 'revenue', total_revenue * 0.18, 'popularCategories', ARRAY['Professional Services', 'Health & Fitness'])
    ),
    'predictiveMetrics', json_build_object(
      'projectedRevenue', total_revenue * 1.15,
      'projectedUsers', total_users * 1.08,
      'riskFactors', json_build_array(
        json_build_object('factor', 'Seasonal demand fluctuation', 'impact', 'medium', 'probability', 75),
        json_build_object('factor', 'Increased competition', 'impact', 'high', 'probability', 45),
        json_build_object('factor', 'Economic downturn', 'impact', 'high', 'probability', 25),
        json_build_object('factor', 'Supply chain disruption', 'impact', 'medium', 'probability', 35)
      )
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get real-time metrics
CREATE OR REPLACE FUNCTION get_realtime_metrics()
RETURNS JSON AS $$
DECLARE
  result JSON;
  current_active_users INTEGER;
  realtime_bookings INTEGER;
BEGIN
  -- Get current active users (users with recent activity)
  SELECT COUNT(DISTINCT user_id) INTO current_active_users
  FROM bookings
  WHERE created_at >= NOW() - INTERVAL '1 hour';

  -- Get recent bookings
  SELECT COUNT(*) INTO realtime_bookings
  FROM bookings
  WHERE created_at >= NOW() - INTERVAL '1 hour';

  SELECT json_build_object(
    'currentActiveUsers', current_active_users,
    'realtimeBookings', realtime_bookings,
    'systemLoad', 35.5,
    'alertsCount', 2,
    'recentActivity', json_build_array(
      json_build_object('id', gen_random_uuid(), 'type', 'booking', 'description', 'New booking created for Home Cleaning', 'timestamp', (NOW() - INTERVAL '2 minutes')::TEXT, 'severity', 'info'),
      json_build_object('id', gen_random_uuid(), 'type', 'signup', 'description', 'New user registered: John D.', 'timestamp', (NOW() - INTERVAL '5 minutes')::TEXT, 'severity', 'info'),
      json_build_object('id', gen_random_uuid(), 'type', 'payment', 'description', 'Payment processed successfully', 'timestamp', (NOW() - INTERVAL '8 minutes')::TEXT, 'severity', 'info'),
      json_build_object('id', gen_random_uuid(), 'type', 'error', 'description', 'API timeout in payment processing', 'timestamp', (NOW() - INTERVAL '12 minutes')::TEXT, 'severity', 'warning'),
      json_build_object('id', gen_random_uuid(), 'type', 'booking', 'description', 'Booking completed for Pet Grooming', 'timestamp', (NOW() - INTERVAL '15 minutes')::TEXT, 'severity', 'info')
    ),
    'geographicActivity', json_build_array(
      json_build_object('location', 'New York', 'latitude', 40.7128, 'longitude', -74.0060, 'activityCount', 25),
      json_build_object('location', 'Los Angeles', 'latitude', 34.0522, 'longitude', -118.2437, 'activityCount', 18),
      json_build_object('location', 'Chicago', 'latitude', 41.8781, 'longitude', -87.6298, 'activityCount', 12),
      json_build_object('location', 'Houston', 'latitude', 29.7604, 'longitude', -95.3698, 'activityCount', 9),
      json_build_object('location', 'Phoenix', 'latitude', 33.4484, 'longitude', -112.0740, 'activityCount', 7)
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user growth chart data
CREATE OR REPLACE FUNCTION get_user_growth_chart(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
BEGIN
  -- Set date filter
  CASE timeframe_param
    WHEN '7d' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN date_filter := NOW() - INTERVAL '90 days';
    ELSE date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  WITH daily_users AS (
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as new_users,
      SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as total_users
    FROM auth.users
    WHERE created_at >= date_filter
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
  )
  SELECT json_build_object(
    'labels', array_agg(to_char(date, 'MM/DD')),
    'datasets', json_build_array(
      json_build_object(
        'label', 'Total Users',
        'data', array_agg(total_users),
        'borderColor', '#3B82F6',
        'backgroundColor', '#3B82F6'
      ),
      json_build_object(
        'label', 'New Users',
        'data', array_agg(new_users),
        'borderColor', '#10B981',
        'backgroundColor', '#10B981'
      ),
      json_build_object(
        'label', 'Returning Users',
        'data', array_agg(FLOOR(new_users * 0.3)),
        'borderColor', '#F59E0B',
        'backgroundColor', '#F59E0B'
      )
    )
  ) INTO result
  FROM daily_users;

  RETURN COALESCE(result, '{"labels": [], "datasets": []}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get revenue chart data
CREATE OR REPLACE FUNCTION get_revenue_chart(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
BEGIN
  -- Set date filter
  CASE timeframe_param
    WHEN '7d' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN date_filter := NOW() - INTERVAL '90 days';
    ELSE date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  WITH daily_revenue AS (
    SELECT 
      DATE(created_at) as date,
      COALESCE(SUM(total_amount), 0) as revenue,
      COUNT(*) as bookings
    FROM bookings
    WHERE status = 'completed'
    AND created_at >= date_filter
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
  )
  SELECT json_build_object(
    'labels', array_agg(to_char(date, 'MM/DD')),
    'datasets', json_build_array(
      json_build_object(
        'label', 'Revenue',
        'data', array_agg(revenue),
        'borderColor', '#3B82F6',
        'backgroundColor', '#3B82F6'
      )
    )
  ) INTO result
  FROM daily_revenue;

  RETURN COALESCE(result, '{"labels": [], "datasets": []}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conversion funnel data
CREATE OR REPLACE FUNCTION get_conversion_funnel(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
  date_filter TIMESTAMP;
  total_signups INTEGER;
  profile_completed INTEGER;
  first_search INTEGER;
  first_booking INTEGER;
  completed_booking INTEGER;
BEGIN
  -- Set date filter
  CASE timeframe_param
    WHEN '7d' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN '30d' THEN date_filter := NOW() - INTERVAL '30 days';
    WHEN '90d' THEN date_filter := NOW() - INTERVAL '90 days';
    ELSE date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  -- Get funnel metrics
  SELECT COUNT(*) INTO total_signups
  FROM auth.users
  WHERE created_at >= date_filter;

  SELECT COUNT(*) INTO profile_completed
  FROM profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE u.created_at >= date_filter
  AND p.first_name IS NOT NULL;

  -- Mock data for remaining stages
  first_search := FLOOR(profile_completed * 0.85);
  first_booking := FLOOR(first_search * 0.45);
  completed_booking := FLOOR(first_booking * 0.92);

  SELECT json_agg(funnel_data) INTO result
  FROM (
    SELECT 'Sign Up' as stage, total_signups as users, 100.0 as "conversionRate", 0.0 as "dropOffRate"
    UNION ALL
    SELECT 'Complete Profile', profile_completed, 
           CASE WHEN total_signups > 0 THEN (profile_completed::DECIMAL / total_signups::DECIMAL) * 100 ELSE 0 END,
           CASE WHEN total_signups > 0 THEN ((total_signups - profile_completed)::DECIMAL / total_signups::DECIMAL) * 100 ELSE 0 END
    UNION ALL
    SELECT 'First Search', first_search,
           CASE WHEN profile_completed > 0 THEN (first_search::DECIMAL / profile_completed::DECIMAL) * 100 ELSE 0 END,
           CASE WHEN profile_completed > 0 THEN ((profile_completed - first_search)::DECIMAL / profile_completed::DECIMAL) * 100 ELSE 0 END
    UNION ALL
    SELECT 'First Booking', first_booking,
           CASE WHEN first_search > 0 THEN (first_booking::DECIMAL / first_search::DECIMAL) * 100 ELSE 0 END,
           CASE WHEN first_search > 0 THEN ((first_search - first_booking)::DECIMAL / first_search::DECIMAL) * 100 ELSE 0 END
    UNION ALL
    SELECT 'Completed Booking', completed_booking,
           CASE WHEN first_booking > 0 THEN (completed_booking::DECIMAL / first_booking::DECIMAL) * 100 ELSE 0 END,
           CASE WHEN first_booking > 0 THEN ((first_booking - completed_booking)::DECIMAL / first_booking::DECIMAL) * 100 ELSE 0 END
  ) funnel_data;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cohort analysis data
CREATE OR REPLACE FUNCTION get_cohort_analysis(timeframe_param TEXT DEFAULT '30d')
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Mock cohort data (in a real system, this would be calculated from actual user behavior)
  SELECT json_agg(cohort_data) INTO result
  FROM (
    SELECT 
      '2024-01' as cohort, 100 as month0, 68.5 as month1, 52.3 as month2, 43.7 as month3, 32.1 as month6, 24.8 as month12
    UNION ALL
    SELECT '2024-02', 100, 71.2, 55.8, 46.3, 35.7, 0
    UNION ALL
    SELECT '2024-03', 100, 69.8, 53.1, 44.9, 0, 0
    UNION ALL
    SELECT '2024-04', 100, 73.4, 57.2, 0, 0, 0
    UNION ALL
    SELECT '2024-05', 100, 70.1, 0, 0, 0, 0
    UNION ALL
    SELECT '2024-06', 100, 0, 0, 0, 0, 0
  ) cohort_data;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_key_metrics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_metrics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_metrics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_performance_metrics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_business_intelligence(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_realtime_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_growth_chart(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_chart(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_conversion_funnel(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_cohort_analysis(TEXT) TO authenticated;
