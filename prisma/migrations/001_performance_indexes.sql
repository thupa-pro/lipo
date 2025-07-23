-- Performance Optimization Indexes for Loconomy Platform
-- This migration adds comprehensive indexes for optimal query performance

-- Users table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_status ON users(role, status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON users(last_login_at DESC) WHERE last_login_at IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_location ON users USING GIN(location) WHERE location IS NOT NULL;

-- Providers table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_providers_user_id ON providers(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_providers_status_verified ON providers(status, is_verified) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_providers_location_radius ON providers USING GIST(location);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_providers_rating ON providers(average_rating DESC) WHERE average_rating IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_providers_availability ON providers(is_available) WHERE is_available = true;

-- Services table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_category_status ON services(category, status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_location_active ON services USING GIST(location) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_price_range ON services(price_min, price_max) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_rating ON services(average_rating DESC) WHERE average_rating IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_created_at ON services(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_search_text ON services USING GIN(to_tsvector('english', title || ' ' || description));

-- Bookings table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_status_date ON bookings(status, scheduled_at) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_customer_status ON bookings(customer_id, status) WHERE status IN ('pending', 'confirmed', 'in_progress');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_provider_status ON bookings(provider_id, status) WHERE status IN ('pending', 'confirmed', 'in_progress');

-- Reviews table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_service_id ON reviews(service_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_verified ON reviews(is_verified) WHERE is_verified = true;

-- Messages table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

-- Conversations table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participant_ids);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_booking_id ON conversations(booking_id) WHERE booking_id IS NOT NULL;

-- Payments table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_provider_id ON payments(provider_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_status ON payments(status, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

-- Notifications table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type ON notifications(type, created_at DESC);

-- Analytics and performance tracking indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at) WHERE expires_at > NOW();
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);

-- Search optimization indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_full_text_search ON services 
  USING GIN(to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(category, '') || ' ' ||
    COALESCE(tags::text, '')
  )) WHERE status = 'active';

-- Location-based search optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_location_category ON services 
  USING GIST(location, category) WHERE status = 'active';

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_customer_date_status ON bookings(customer_id, scheduled_at DESC, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_provider_date_status ON bookings(provider_id, scheduled_at DESC, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_provider_category_status ON services(provider_id, category, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_service_rating_date ON reviews(service_id, rating DESC, created_at DESC);

-- Performance monitoring indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_metric_name ON performance_metrics(metric_name, timestamp DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_user_session ON performance_metrics(user_id, session_id);

-- Audit trail indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(created_at DESC);

-- Cache invalidation indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cache_keys_pattern ON cache_keys USING GIN(key_pattern gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cache_keys_tags ON cache_keys USING GIN(tags);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cache_keys_expires_at ON cache_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Partial indexes for active records only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_services_location ON services 
  USING GIST(location) WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_providers_location ON providers 
  USING GIST(location) WHERE status = 'active' AND deleted_at IS NULL AND is_verified = true;

-- Expression indexes for computed values
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_popularity_score ON services 
  ((booking_count * 0.4 + review_count * 0.3 + average_rating * 0.3)) 
  WHERE status = 'active';

-- Covering indexes for read-heavy queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_list_covering ON services 
  (category, status, created_at DESC) 
  INCLUDE (id, title, price_min, price_max, average_rating, provider_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_dashboard_covering ON bookings 
  (customer_id, status, scheduled_at DESC) 
  INCLUDE (id, service_id, provider_id, total_amount);

-- Time-series indexes for analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_daily_stats_date ON daily_stats(date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hourly_metrics_timestamp ON hourly_metrics(timestamp DESC);

-- Unique indexes for data integrity
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_unique ON users(email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_providers_user_unique ON providers(user_id) WHERE deleted_at IS NULL;

-- Functional indexes for case-insensitive searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_lower ON users(LOWER(email)) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_title_lower ON services(LOWER(title)) WHERE status = 'active';

-- BRIN indexes for time-series data (more efficient for large datasets)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_logs_created_at_brin ON system_logs USING BRIN(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_metrics_timestamp_brin ON performance_metrics USING BRIN(timestamp);

-- Hash indexes for exact equality lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_token_hash ON user_sessions USING HASH(session_token);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_hash ON api_keys USING HASH(key_hash);

-- Statistics update for query planner optimization
ANALYZE users;
ANALYZE providers;
ANALYZE services;
ANALYZE bookings;
ANALYZE reviews;
ANALYZE messages;
ANALYZE conversations;
ANALYZE payments;
ANALYZE notifications;

-- Create custom statistics for better query planning
CREATE STATISTICS IF NOT EXISTS stats_services_location_category ON location, category FROM services;
CREATE STATISTICS IF NOT EXISTS stats_bookings_customer_provider ON customer_id, provider_id FROM bookings;
CREATE STATISTICS IF NOT EXISTS stats_reviews_service_rating ON service_id, rating FROM reviews;

-- Vacuum and reindex for optimal performance
VACUUM ANALYZE;

-- Add comments for documentation
COMMENT ON INDEX idx_services_full_text_search IS 'Full-text search index for service titles, descriptions, and tags';
COMMENT ON INDEX idx_services_location_category IS 'Composite GiST index for location-based category searches';
COMMENT ON INDEX idx_bookings_customer_date_status IS 'Composite index for customer booking history queries';
COMMENT ON INDEX idx_services_popularity_score IS 'Expression index for service popularity ranking';

-- Performance monitoring queries
-- These can be used to monitor index usage and performance

-- View to monitor index usage
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    CASE 
        WHEN idx_scan > 0 THEN round((idx_tup_read::numeric / idx_scan), 2)
        ELSE 0 
    END as avg_tuples_per_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- View to monitor table statistics
CREATE OR REPLACE VIEW table_stats AS
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;