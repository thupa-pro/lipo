-- 🛡️ Secure Multi-Tenant Supabase Schema with RLS
-- Production-grade security implementation for Loconomy platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =============================================
-- TENANT MANAGEMENT SCHEMA
-- =============================================

-- Tenants table for multi-tenant architecture
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant users mapping for RBAC
CREATE TABLE IF NOT EXISTS public.tenant_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk user ID
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'provider', 'customer')),
  permissions JSONB DEFAULT '[]',
  invited_by TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'invited')),
  UNIQUE(tenant_id, user_id)
);

-- =============================================
-- CORE BUSINESS TABLES
-- =============================================

-- Enhanced Users table (extends Clerk data)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table with tenant isolation
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  provider_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD',
  duration INTEGER NOT NULL CHECK (duration > 0), -- in minutes
  location TEXT,
  location_type TEXT DEFAULT 'on_site' CHECK (location_type IN ('on_site', 'remote', 'hybrid')),
  availability JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  requirements TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table with comprehensive tracking
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  provider_id TEXT REFERENCES public.users(id) ON DELETE RESTRICT,
  customer_id TEXT REFERENCES public.users(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  location TEXT,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  cancellation_reason TEXT,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_review TEXT,
  provider_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_booking_time CHECK (scheduled_at > created_at)
);

-- Reviews table for ratings and feedback
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  reviewer_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  reviewee_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  response TEXT, -- Provider response
  helpful_count INTEGER DEFAULT 0,
  flagged BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for security tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Get current user's tenant ID from JWT
CREATE OR REPLACE FUNCTION auth.get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() ->> 'app_metadata')::JSON ->> 'tenant_id',
    (auth.jwt() ->> 'metadata')::JSON ->> 'tenantId'
  )::UUID;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get current user's role from JWT
CREATE OR REPLACE FUNCTION auth.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() ->> 'app_metadata')::JSON ->> 'role',
    (auth.jwt() ->> 'metadata')::JSON ->> 'role',
    'guest'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Check if user has required role
CREATE OR REPLACE FUNCTION auth.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_hierarchy TEXT[][] := ARRAY[
    ARRAY['admin', 'moderator', 'provider', 'customer', 'guest'],
    ARRAY['moderator', 'provider', 'customer', 'guest'],
    ARRAY['provider', 'customer', 'guest'],
    ARRAY['customer', 'guest'],
    ARRAY['guest']
  ];
  user_roles TEXT[];
BEGIN
  user_role := auth.get_current_user_role();
  
  -- Admin can access everything
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Get roles accessible to current user
  CASE user_role
    WHEN 'moderator' THEN user_roles := role_hierarchy[2];
    WHEN 'provider' THEN user_roles := role_hierarchy[3];
    WHEN 'customer' THEN user_roles := role_hierarchy[4];
    ELSE user_roles := role_hierarchy[5];
  END CASE;
  
  RETURN required_role = ANY(user_roles);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- TENANTS POLICIES
CREATE POLICY "Tenants: Users can view their own tenant"
  ON public.tenants FOR SELECT
  USING (id = auth.get_current_tenant_id());

CREATE POLICY "Tenants: Admins can manage tenants"
  ON public.tenants FOR ALL
  USING (auth.has_role('admin'));

-- TENANT_USERS POLICIES
CREATE POLICY "Tenant Users: Users can view members of their tenant"
  ON public.tenant_users FOR SELECT
  USING (tenant_id = auth.get_current_tenant_id());

CREATE POLICY "Tenant Users: Admins can manage tenant memberships"
  ON public.tenant_users FOR ALL
  USING (auth.has_role('admin') OR (tenant_id = auth.get_current_tenant_id() AND auth.has_role('moderator')));

-- USERS POLICIES
CREATE POLICY "Users: Can view all users in their tenant"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users tu 
      WHERE tu.user_id = users.id 
      AND tu.tenant_id = auth.get_current_tenant_id()
    )
  );

CREATE POLICY "Users: Can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users: Admins can manage all users"
  ON public.users FOR ALL
  USING (auth.has_role('admin'));

-- SERVICES POLICIES
CREATE POLICY "Services: Public can view active services"
  ON public.services FOR SELECT
  USING (
    status = 'active' 
    AND (tenant_id = auth.get_current_tenant_id() OR auth.get_current_tenant_id() IS NULL)
  );

CREATE POLICY "Services: Providers can manage their own services"
  ON public.services FOR ALL
  USING (
    provider_id = auth.uid() 
    AND tenant_id = auth.get_current_tenant_id()
  );

CREATE POLICY "Services: Moderators can manage all services in their tenant"
  ON public.services FOR ALL
  USING (
    tenant_id = auth.get_current_tenant_id() 
    AND auth.has_role('moderator')
  );

-- BOOKINGS POLICIES
CREATE POLICY "Bookings: Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (
    (customer_id = auth.uid() OR provider_id = auth.uid())
    AND tenant_id = auth.get_current_tenant_id()
  );

CREATE POLICY "Bookings: Customers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    customer_id = auth.uid()
    AND tenant_id = auth.get_current_tenant_id()
    AND auth.has_role('customer')
  );

CREATE POLICY "Bookings: Participants can update their bookings"
  ON public.bookings FOR UPDATE
  USING (
    (customer_id = auth.uid() OR provider_id = auth.uid())
    AND tenant_id = auth.get_current_tenant_id()
  );

CREATE POLICY "Bookings: Moderators can manage all bookings"
  ON public.bookings FOR ALL
  USING (
    tenant_id = auth.get_current_tenant_id()
    AND auth.has_role('moderator')
  );

-- REVIEWS POLICIES
CREATE POLICY "Reviews: Public can view approved reviews"
  ON public.reviews FOR SELECT
  USING (
    NOT flagged
    AND tenant_id = auth.get_current_tenant_id()
  );

CREATE POLICY "Reviews: Users can manage their own reviews"
  ON public.reviews FOR ALL
  USING (
    reviewer_id = auth.uid()
    AND tenant_id = auth.get_current_tenant_id()
  );

CREATE POLICY "Reviews: Service providers can respond to reviews"
  ON public.reviews FOR UPDATE
  USING (
    reviewee_id = auth.uid()
    AND tenant_id = auth.get_current_tenant_id()
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Notifications: Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (
    user_id = auth.uid()
    AND tenant_id = auth.get_current_tenant_id()
  );

CREATE POLICY "Notifications: Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (
    user_id = auth.uid()
    AND tenant_id = auth.get_current_tenant_id()
  );

-- AUDIT_LOGS POLICIES
CREATE POLICY "Audit Logs: Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.has_role('admin'));

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Tenant isolation indexes
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON public.services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON public.bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_id ON public.reviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON public.notifications(tenant_id);

-- User relationship indexes
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON public.tenant_users(user_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_services_search ON public.services USING gin(to_tsvector('english', title || ' ' || description));

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

-- Audit log trigger
CREATE OR REPLACE FUNCTION trigger_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    tenant_id,
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    COALESCE(NEW.tenant_id, OLD.tenant_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_services
  AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW EXECUTE PROCEDURE trigger_audit_log();

CREATE TRIGGER audit_bookings
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE PROCEDURE trigger_audit_log();

-- =============================================
-- SECURITY VIEWS
-- =============================================

-- Secure user view (without sensitive data)
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.avatar_url,
  u.bio,
  u.location,
  u.verified,
  u.created_at,
  AVG(r.rating) as avg_rating,
  COUNT(r.id) as review_count
FROM public.users u
LEFT JOIN public.reviews r ON r.reviewee_id = u.id
WHERE EXISTS (
  SELECT 1 FROM public.tenant_users tu 
  WHERE tu.user_id = u.id 
  AND tu.tenant_id = auth.get_current_tenant_id()
)
GROUP BY u.id, u.first_name, u.last_name, u.avatar_url, u.bio, u.location, u.verified, u.created_at;

-- Service analytics view
CREATE OR REPLACE VIEW public.service_analytics AS
SELECT 
  s.*,
  COUNT(b.id) as total_bookings,
  COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
  AVG(CASE WHEN b.customer_rating IS NOT NULL THEN b.customer_rating END) as avg_rating,
  SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END) as total_revenue
FROM public.services s
LEFT JOIN public.bookings b ON b.service_id = s.id
WHERE s.tenant_id = auth.get_current_tenant_id()
GROUP BY s.id;

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Create default tenant for single-tenant installations
INSERT INTO public.tenants (id, slug, name, domain, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'default', 'Default Tenant', 'localhost', 'active')
ON CONFLICT (id) DO NOTHING;

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Security comment
COMMENT ON SCHEMA public IS 'Secure multi-tenant schema with comprehensive RLS policies for the Loconomy platform';

-- Performance optimization
ANALYZE;