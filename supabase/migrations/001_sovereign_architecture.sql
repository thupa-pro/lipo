-- Sovereign Marketplace Architecture Migration
-- Enables PGVector, creates event system, and AI-native tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS sovereign_events CASCADE;
DROP TABLE IF EXISTS sovereign_providers CASCADE;
DROP TABLE IF EXISTS sovereign_listings CASCADE;
DROP TABLE IF EXISTS sovereign_customers CASCADE;
DROP TABLE IF EXISTS sovereign_bookings CASCADE;
DROP TABLE IF EXISTS ai_models CASCADE;
DROP TABLE IF EXISTS ai_training_data CASCADE;

-- Sovereign Events Table for AI-Native Event Bus
CREATE TABLE sovereign_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(255) NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source VARCHAR(255) NOT NULL DEFAULT 'loconomy-sovereign',
    data JSONB NOT NULL,
    metadata JSONB,
    tenant_id UUID,
    user_id UUID,
    correlation_id UUID,
    processed BOOLEAN DEFAULT FALSE,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sovereign events
CREATE INDEX idx_sovereign_events_type ON sovereign_events(type);
CREATE INDEX idx_sovereign_events_timestamp ON sovereign_events(timestamp);
CREATE INDEX idx_sovereign_events_tenant ON sovereign_events(tenant_id);
CREATE INDEX idx_sovereign_events_user ON sovereign_events(user_id);
CREATE INDEX idx_sovereign_events_correlation ON sovereign_events(correlation_id);
CREATE INDEX idx_sovereign_events_processed ON sovereign_events(processed);
CREATE INDEX idx_sovereign_events_data_gin ON sovereign_events USING gin(data);
CREATE INDEX idx_sovereign_events_metadata_gin ON sovereign_events USING gin(metadata);

-- Sovereign Providers Table with Vector Embeddings
CREATE TABLE sovereign_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- Concatenated content for embeddings
    embedding VECTOR(1536), -- OpenAI text-embedding-3-large dimensions
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Provider-specific fields
    service_categories TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    coordinates POINT,
    
    -- Quality metrics
    average_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    response_time_minutes INTEGER DEFAULT 0,
    
    -- AI scoring
    ai_score DECIMAL(5,2) DEFAULT 0,
    skill_score DECIMAL(5,2) DEFAULT 0,
    market_fit_score DECIMAL(5,2) DEFAULT 0,
    
    -- Status and flags
    is_premium BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    is_ai_optimized BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    onboarded_at TIMESTAMPTZ DEFAULT NOW(),
    last_ai_assessment TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sovereign providers
CREATE INDEX idx_sovereign_providers_embedding ON sovereign_providers USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_sovereign_providers_location ON sovereign_providers(location);
CREATE INDEX idx_sovereign_providers_coordinates ON sovereign_providers USING gist(coordinates);
CREATE INDEX idx_sovereign_providers_categories ON sovereign_providers USING gin(service_categories);
CREATE INDEX idx_sovereign_providers_rating ON sovereign_providers(average_rating DESC);
CREATE INDEX idx_sovereign_providers_premium ON sovereign_providers(is_premium) WHERE is_premium = TRUE;
CREATE INDEX idx_sovereign_providers_verified ON sovereign_providers(is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_sovereign_providers_available ON sovereign_providers(is_available) WHERE is_available = TRUE;
CREATE INDEX idx_sovereign_providers_metadata_gin ON sovereign_providers USING gin(metadata);
CREATE INDEX idx_sovereign_providers_search ON sovereign_providers USING gin(to_tsvector('english', name || ' ' || description || ' ' || content));

-- Sovereign Listings Table with Vector Embeddings
CREATE TABLE sovereign_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES sovereign_providers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- Concatenated content for embeddings
    embedding VECTOR(1536), -- OpenAI text-embedding-3-large dimensions
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Listing-specific fields
    service_type VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    
    -- Pricing
    price_type VARCHAR(50) DEFAULT 'fixed', -- fixed, hourly, project
    base_price DECIMAL(10,2),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    
    -- Availability
    available_from TIMESTAMPTZ DEFAULT NOW(),
    available_until TIMESTAMPTZ,
    booking_window_days INTEGER DEFAULT 30,
    
    -- AI metrics
    ai_relevance_score DECIMAL(5,2) DEFAULT 0,
    demand_score DECIMAL(5,2) DEFAULT 0,
    competition_score DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, paused, archived
    featured BOOLEAN DEFAULT FALSE,
    premium BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sovereign listings
CREATE INDEX idx_sovereign_listings_embedding ON sovereign_listings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_sovereign_listings_provider ON sovereign_listings(provider_id);
CREATE INDEX idx_sovereign_listings_service_type ON sovereign_listings(service_type);
CREATE INDEX idx_sovereign_listings_category ON sovereign_listings(category);
CREATE INDEX idx_sovereign_listings_tags ON sovereign_listings USING gin(tags);
CREATE INDEX idx_sovereign_listings_price ON sovereign_listings(base_price);
CREATE INDEX idx_sovereign_listings_status ON sovereign_listings(status) WHERE status = 'active';
CREATE INDEX idx_sovereign_listings_featured ON sovereign_listings(featured) WHERE featured = TRUE;
CREATE INDEX idx_sovereign_listings_premium ON sovereign_listings(premium) WHERE premium = TRUE;
CREATE INDEX idx_sovereign_listings_metadata_gin ON sovereign_listings USING gin(metadata);
CREATE INDEX idx_sovereign_listings_search ON sovereign_listings USING gin(to_tsvector('english', title || ' ' || description || ' ' || content));

-- Sovereign Customers Table with AI Profiling
CREATE TABLE sovereign_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    
    -- AI Profile
    behavioral_profile JSONB DEFAULT '{}',
    predicted_needs JSONB DEFAULT '{}',
    matching_criteria JSONB DEFAULT '{}',
    personalization_tags TEXT[] DEFAULT '{}',
    
    -- Preferences and History
    preferences JSONB DEFAULT '{}',
    search_history TEXT[] DEFAULT '{}',
    booking_history JSONB DEFAULT '{}',
    communication_log JSONB DEFAULT '{}',
    
    -- Quality metrics
    quality_expectations VARCHAR(50) DEFAULT 'standard', -- basic, standard, premium, luxury
    price_sensitivity VARCHAR(50) DEFAULT 'medium', -- very_low, low, medium, high, very_high
    communication_style VARCHAR(50) DEFAULT 'collaborative', -- direct, collaborative, detailed, minimal
    
    -- AI scoring
    ai_confidence DECIMAL(3,2) DEFAULT 0,
    profile_completeness DECIMAL(3,2) DEFAULT 0,
    
    -- Location
    location VARCHAR(255),
    coordinates POINT,
    
    -- Timestamps
    first_profiled_at TIMESTAMPTZ,
    last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sovereign customers
CREATE INDEX idx_sovereign_customers_email ON sovereign_customers(email);
CREATE INDEX idx_sovereign_customers_location ON sovereign_customers(location);
CREATE INDEX idx_sovereign_customers_coordinates ON sovereign_customers USING gist(coordinates);
CREATE INDEX idx_sovereign_customers_tags ON sovereign_customers USING gin(personalization_tags);
CREATE INDEX idx_sovereign_customers_preferences ON sovereign_customers USING gin(preferences);
CREATE INDEX idx_sovereign_customers_search_history ON sovereign_customers USING gin(search_history);

-- Sovereign Bookings Table for Transaction Management
CREATE TABLE sovereign_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES sovereign_customers(id),
    provider_id UUID NOT NULL REFERENCES sovereign_providers(id),
    listing_id UUID REFERENCES sovereign_listings(id),
    
    -- Booking details
    service_type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- AI matching info
    ai_match_score DECIMAL(3,2),
    ai_model_version VARCHAR(50),
    matching_factors JSONB DEFAULT '{}',
    
    -- Pricing
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Scheduling
    requested_date TIMESTAMPTZ,
    confirmed_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
    
    -- Quality tracking
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    provider_rating INTEGER CHECK (provider_rating >= 1 AND provider_rating <= 5),
    customer_feedback TEXT,
    provider_feedback TEXT,
    
    -- AI evaluation
    ai_satisfaction_score DECIMAL(3,2),
    ai_quality_score DECIMAL(3,2),
    ai_feedback_processed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sovereign bookings
CREATE INDEX idx_sovereign_bookings_customer ON sovereign_bookings(customer_id);
CREATE INDEX idx_sovereign_bookings_provider ON sovereign_bookings(provider_id);
CREATE INDEX idx_sovereign_bookings_listing ON sovereign_bookings(listing_id);
CREATE INDEX idx_sovereign_bookings_status ON sovereign_bookings(status);
CREATE INDEX idx_sovereign_bookings_payment_status ON sovereign_bookings(payment_status);
CREATE INDEX idx_sovereign_bookings_confirmed_date ON sovereign_bookings(confirmed_date);
CREATE INDEX idx_sovereign_bookings_completed_date ON sovereign_bookings(completed_date);

-- AI Models Table for Version Management
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- embedding, classification, recommendation, etc.
    parameters JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    training_data_id UUID,
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Training Data Table
CREATE TABLE ai_training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_name VARCHAR(255) NOT NULL,
    data_type VARCHAR(100) NOT NULL, -- provider_assessment, customer_profiling, matching, etc.
    records_count INTEGER DEFAULT 0,
    quality_score DECIMAL(3,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector Search Functions
CREATE OR REPLACE FUNCTION vector_search_providers(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    match_count int DEFAULT 20,
    filters jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    score float,
    metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name as title,
        p.description,
        (1 - (p.embedding <=> query_embedding)) as score,
        p.metadata
    FROM sovereign_providers p
    WHERE 
        (p.embedding <=> query_embedding) < (1 - similarity_threshold)
        AND p.is_available = TRUE
        AND (
            filters = '{}'::jsonb OR
            (
                (filters->>'location' IS NULL OR p.location ILIKE '%' || (filters->>'location') || '%') AND
                (filters->>'serviceCategory' IS NULL OR (filters->>'serviceCategory') = ANY(p.service_categories)) AND
                (filters->>'rating' IS NULL OR p.average_rating >= (filters->>'rating')::decimal) AND
                (filters->>'premiumOnly' IS NULL OR filters->>'premiumOnly' = 'false' OR p.is_premium = TRUE)
            )
        )
    ORDER BY score DESC
    LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION vector_search_listings(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    match_count int DEFAULT 20,
    filters jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    score float,
    metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.title,
        l.description,
        (1 - (l.embedding <=> query_embedding)) as score,
        l.metadata
    FROM sovereign_listings l
    JOIN sovereign_providers p ON l.provider_id = p.id
    WHERE 
        (l.embedding <=> query_embedding) < (1 - similarity_threshold)
        AND l.status = 'active'
        AND p.is_available = TRUE
        AND (
            filters = '{}'::jsonb OR
            (
                (filters->>'serviceCategory' IS NULL OR l.service_type = (filters->>'serviceCategory')) AND
                (filters->>'priceRange' IS NULL OR 
                    l.base_price <= COALESCE((filters->'priceRange'->>'max')::decimal, l.base_price))
            )
        )
    ORDER BY score DESC
    LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION find_similar_providers(
    provider_id uuid,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    similarity float,
    metadata jsonb
)
LANGUAGE plpgsql
AS $$
DECLARE
    source_embedding vector(1536);
BEGIN
    -- Get the embedding of the source provider
    SELECT embedding INTO source_embedding
    FROM sovereign_providers
    WHERE sovereign_providers.id = provider_id;
    
    IF source_embedding IS NULL THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.name as title,
        p.description,
        (1 - (p.embedding <=> source_embedding)) as similarity,
        p.metadata
    FROM sovereign_providers p
    WHERE 
        p.id != provider_id
        AND p.is_available = TRUE
        AND p.embedding IS NOT NULL
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;

-- Trigger Functions for Auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_sovereign_events_updated_at BEFORE UPDATE ON sovereign_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sovereign_providers_updated_at BEFORE UPDATE ON sovereign_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sovereign_listings_updated_at BEFORE UPDATE ON sovereign_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sovereign_customers_updated_at BEFORE UPDATE ON sovereign_customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sovereign_bookings_updated_at BEFORE UPDATE ON sovereign_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_training_data_updated_at BEFORE UPDATE ON ai_training_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE sovereign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sovereign_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sovereign_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sovereign_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sovereign_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for multi-tenancy
CREATE POLICY "Users can view their own events" ON sovereign_events FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view available providers" ON sovereign_providers FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Users can view active listings" ON sovereign_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own customer data" ON sovereign_customers FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "Users can view their own bookings" ON sovereign_bookings FOR ALL USING (auth.uid()::text = customer_id::text OR auth.uid()::text = provider_id::text);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sovereign_providers_composite ON sovereign_providers(is_available, is_verified, average_rating DESC) WHERE is_available = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sovereign_listings_composite ON sovereign_listings(status, featured, base_price) WHERE status = 'active';

-- Initial AI Model Records
INSERT INTO ai_models (name, version, model_type, parameters, is_active) VALUES
('gpt-4-turbo-preview', '2024-01', 'provider_assessment', '{"temperature": 0.2, "max_tokens": 4000}', TRUE),
('text-embedding-3-large', '2024-01', 'embedding', '{"dimensions": 1536}', TRUE),
('claude-3-sonnet', '2024-01', 'customer_profiling', '{"temperature": 0.3, "max_tokens": 3000}', FALSE);

-- Sample Data for Testing (Optional)
-- This can be removed in production
INSERT INTO sovereign_providers (name, description, content, service_categories, location, is_premium, is_verified, average_rating) VALUES
('Elite Cleaning Co', 'Premium residential and commercial cleaning services', 'Elite Cleaning Co provides premium residential and commercial cleaning services with eco-friendly products and certified staff', ARRAY['cleaning', 'residential', 'commercial'], 'San Francisco, CA', TRUE, TRUE, 4.9),
('Tech Repair Masters', 'Expert computer and device repair services', 'Tech Repair Masters offers expert computer and device repair services with same-day turnaround and warranty', ARRAY['technology', 'repair', 'computers'], 'New York, NY', TRUE, TRUE, 4.8),
('Garden Pros', 'Professional landscaping and garden maintenance', 'Garden Pros delivers professional landscaping and garden maintenance services for residential and commercial properties', ARRAY['landscaping', 'gardening', 'maintenance'], 'Los Angeles, CA', FALSE, TRUE, 4.7);

COMMENT ON TABLE sovereign_events IS 'Event bus for AI-native marketplace operations';
COMMENT ON TABLE sovereign_providers IS 'Service providers with AI scoring and vector embeddings';
COMMENT ON TABLE sovereign_listings IS 'Service listings with semantic search capabilities';
COMMENT ON TABLE sovereign_customers IS 'Customer profiles with AI behavioral analysis';
COMMENT ON TABLE sovereign_bookings IS 'Booking transactions with AI matching metrics';
COMMENT ON TABLE ai_models IS 'AI model version management and performance tracking';
COMMENT ON TABLE ai_training_data IS 'Training datasets for AI model optimization';