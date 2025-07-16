-- Migration: 008_analytics_system.sql
-- Description: Create analytics and observability system tables
-- Date: 2024

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Analytics Events Table (for tracking user interactions and system events)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  properties JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  
  -- Indexes for performance
  INDEX idx_analytics_events_type (event_type),
  INDEX idx_analytics_events_name (event_name),
  INDEX idx_analytics_events_user_id (user_id),
  INDEX idx_analytics_events_timestamp (timestamp),
  INDEX idx_analytics_events_session (session_id)
);

-- 2. Analytics Alert Rules Table
CREATE TABLE IF NOT EXISTS analytics_alert_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  metric TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('greater_than', 'less_than', 'equals', 'percentage_change')),
  threshold DECIMAL NOT NULL,
  timeframe TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notifications JSONB DEFAULT '[]', -- Array of notification channels/emails
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_triggered TIMESTAMP WITH TIME ZONE
);

-- 3. Analytics Alerts Table
CREATE TABLE IF NOT EXISTS analytics_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID NOT NULL REFERENCES analytics_alert_rules(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id),
  resolved_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  
  -- Indexes
  INDEX idx_analytics_alerts_rule_id (rule_id),
  INDEX idx_analytics_alerts_status (status),
  INDEX idx_analytics_alerts_severity (severity),
  INDEX idx_analytics_alerts_triggered (triggered_at)
);

-- 4. Analytics Dashboards Table
CREATE TABLE IF NOT EXISTS analytics_dashboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  widgets JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_analytics_dashboards_created_by (created_by),
  INDEX idx_analytics_dashboards_public (is_public) WHERE is_public = true
);

-- 5. Analytics Sessions Table (for user session tracking)
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  landing_page TEXT,
  exit_page TEXT,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  country TEXT,
  city TEXT,
  
  -- Indexes
  INDEX idx_analytics_sessions_session_id (session_id),
  INDEX idx_analytics_sessions_user_id (user_id),
  INDEX idx_analytics_sessions_started_at (started_at),
  INDEX idx_analytics_sessions_duration (duration_seconds)
);

-- 6. Analytics Metrics Table (for storing pre-calculated metrics)
CREATE TABLE IF NOT EXISTS analytics_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL NOT NULL,
  dimensions JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  timeframe TEXT, -- '1h', '1d', '1w', '1m', etc.
  
  -- Indexes
  INDEX idx_analytics_metrics_name (metric_name),
  INDEX idx_analytics_metrics_timestamp (timestamp),
  INDEX idx_analytics_metrics_timeframe (timeframe),
  
  -- Unique constraint to prevent duplicate metrics for same time period
  UNIQUE(metric_name, timeframe, timestamp, dimensions)
);

-- 7. System Health Metrics Table
CREATE TABLE IF NOT EXISTS system_health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cpu_usage DECIMAL,
  memory_usage DECIMAL,
  disk_usage DECIMAL,
  network_io DECIMAL,
  database_connections INTEGER,
  api_response_time DECIMAL,
  error_rate DECIMAL,
  throughput DECIMAL,
  uptime_percentage DECIMAL,
  active_users INTEGER,
  
  -- Indexes
  INDEX idx_system_health_timestamp (timestamp)
);

-- 8. User Behavior Analytics Table
CREATE TABLE IF NOT EXISTS user_behavior_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_url TEXT,
  element_id TEXT,
  element_type TEXT,
  duration_ms INTEGER,
  
  -- Indexes
  INDEX idx_user_behavior_user_id (user_id),
  INDEX idx_user_behavior_session_id (session_id),
  INDEX idx_user_behavior_action_type (action_type),
  INDEX idx_user_behavior_timestamp (timestamp)
);

-- Enable Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Analytics Events - Users can view their own events, admin can view all
CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Analytics Alert Rules - Admin only
CREATE POLICY "Admin can manage alert rules" ON analytics_alert_rules
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Analytics Alerts - Admin only
CREATE POLICY "Admin can manage alerts" ON analytics_alerts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Analytics Dashboards - Users can view public dashboards and manage their own
CREATE POLICY "Users can view public dashboards" ON analytics_dashboards
  FOR SELECT USING (is_public = true OR created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage their own dashboards" ON analytics_dashboards
  FOR ALL USING (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Analytics Sessions - Users can view their own sessions, admin can view all
CREATE POLICY "Users can view their own sessions" ON analytics_sessions
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Analytics Metrics - Admin can view all, authenticated users can view basic metrics
CREATE POLICY "Admin can view all metrics" ON analytics_metrics
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated users can view basic metrics" ON analytics_metrics
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    metric_name NOT LIKE '%sensitive%' AND 
    metric_name NOT LIKE '%private%'
  );

-- System Health Metrics - Admin only
CREATE POLICY "Admin can view system health metrics" ON system_health_metrics
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User Behavior Analytics - Users can view their own behavior, admin can view all
CREATE POLICY "Users can view their own behavior" ON user_behavior_analytics
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert user behavior data" ON user_behavior_analytics
  FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_analytics_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analytics_alert_rules_updated_at 
  BEFORE UPDATE ON analytics_alert_rules 
  FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at_column();

CREATE TRIGGER update_analytics_dashboards_updated_at 
  BEFORE UPDATE ON analytics_dashboards 
  FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at_column();

-- Create function to automatically end sessions
CREATE OR REPLACE FUNCTION end_analytics_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Update session when it ends (when a new session starts for the same user)
  UPDATE analytics_sessions 
  SET 
    ended_at = NOW(),
    duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER
  WHERE user_id = NEW.user_id 
    AND ended_at IS NULL 
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_analytics_session_start
  AFTER INSERT ON analytics_sessions
  FOR EACH ROW EXECUTE FUNCTION end_analytics_session();

-- Insert default alert rules
INSERT INTO analytics_alert_rules (
  name,
  description,
  metric,
  condition,
  threshold,
  timeframe,
  severity,
  notifications
) VALUES
  (
    'High Error Rate',
    'Alert when error rate exceeds 5%',
    'error_rate',
    'greater_than',
    5.0,
    '5m',
    'high',
    '["admin@loconomy.com"]'::jsonb
  ),
  (
    'Low System Uptime',
    'Alert when uptime falls below 99%',
    'uptime',
    'less_than',
    99.0,
    '1h',
    'critical',
    '["admin@loconomy.com", "ops@loconomy.com"]'::jsonb
  ),
  (
    'High Response Time',
    'Alert when average response time exceeds 2 seconds',
    'response_time',
    'greater_than',
    2000.0,
    '10m',
    'medium',
    '["admin@loconomy.com"]'::jsonb
  ),
  (
    'Low Conversion Rate',
    'Alert when conversion rate drops below 2%',
    'conversion_rate',
    'less_than',
    2.0,
    '1h',
    'medium',
    '["admin@loconomy.com", "marketing@loconomy.com"]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Create function to track user events
CREATE OR REPLACE FUNCTION track_user_event(
  event_type_param TEXT,
  event_name_param TEXT,
  user_id_param UUID DEFAULT NULL,
  properties_param JSONB DEFAULT '{}'::jsonb,
  session_id_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (
    event_type,
    event_name,
    user_id,
    properties,
    session_id,
    timestamp
  ) VALUES (
    event_type_param,
    event_name_param,
    user_id_param,
    properties_param,
    session_id_param,
    NOW()
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate metrics
CREATE OR REPLACE FUNCTION calculate_analytics_metrics()
RETURNS VOID AS $$
BEGIN
  -- Insert hourly metrics
  INSERT INTO analytics_metrics (metric_name, metric_value, timeframe, timestamp)
  VALUES
    (
      'active_users_1h',
      (SELECT COUNT(DISTINCT user_id) FROM analytics_events WHERE timestamp >= NOW() - INTERVAL '1 hour'),
      '1h',
      DATE_TRUNC('hour', NOW())
    ),
    (
      'page_views_1h',
      (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'page_view' AND timestamp >= NOW() - INTERVAL '1 hour'),
      '1h',
      DATE_TRUNC('hour', NOW())
    ),
    (
      'bookings_1h',
      (SELECT COUNT(*) FROM bookings WHERE created_at >= NOW() - INTERVAL '1 hour'),
      '1h',
      DATE_TRUNC('hour', NOW())
    )
  ON CONFLICT (metric_name, timeframe, timestamp, dimensions) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT ON analytics_events TO authenticated;
GRANT SELECT ON analytics_alert_rules TO authenticated;
GRANT SELECT ON analytics_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON analytics_dashboards TO authenticated;
GRANT SELECT ON analytics_sessions TO authenticated;
GRANT SELECT ON analytics_metrics TO authenticated;
GRANT SELECT ON system_health_metrics TO authenticated;
GRANT SELECT, INSERT ON user_behavior_analytics TO authenticated;

GRANT EXECUTE ON FUNCTION track_user_event(TEXT, TEXT, UUID, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_analytics_metrics() TO authenticated;

-- Comments for documentation
COMMENT ON TABLE analytics_events IS 'Tracks all user interactions and system events for analytics';
COMMENT ON TABLE analytics_alert_rules IS 'Configuration for automated alerts based on metrics';
COMMENT ON TABLE analytics_alerts IS 'Active and historical alerts triggered by the system';
COMMENT ON TABLE analytics_dashboards IS 'Custom dashboards created by users and admins';
COMMENT ON TABLE analytics_sessions IS 'User session tracking for behavior analysis';
COMMENT ON TABLE analytics_metrics IS 'Pre-calculated metrics for performance optimization';
COMMENT ON TABLE system_health_metrics IS 'System performance and health monitoring data';
COMMENT ON TABLE user_behavior_analytics IS 'Detailed user interaction tracking for UX analysis';
