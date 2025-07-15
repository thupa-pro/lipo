-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('guest', 'consumer', 'provider', 'admin')) DEFAULT 'consumer',
  tenant_id UUID, -- For multi-tenant provider spaces
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create user preferences table for consent management
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_preferences JSONB DEFAULT '{}'::jsonb,
  notification_settings JSONB DEFAULT '{}'::jsonb,
  privacy_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenants table for multi-tenancy (provider workspaces)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  owner_id TEXT NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_tenant_id ON user_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_owner_id ON tenants(owner_id);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- RLS policies for user_roles
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid()::text 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert roles" ON user_roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid()::text 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can update roles" ON user_roles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid()::text 
      AND ur.role = 'admin'
    )
  );

-- RLS policies for user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid()::text = user_id);

-- RLS policies for tenants
CREATE POLICY "Users can view tenants they belong to" ON tenants
  FOR SELECT USING (
    owner_id = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid()::text 
      AND ur.tenant_id = tenants.id
    )
  );

CREATE POLICY "Providers can create tenants" ON tenants
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()::text AND
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid()::text 
      AND ur.role IN ('provider', 'admin')
    )
  );

CREATE POLICY "Owners can update their tenants" ON tenants
  FOR UPDATE USING (owner_id = auth.uid()::text);

-- Functions to automatically create user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'consumer');
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user role and preferences
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default admin user (replace with your admin user ID)
-- This should be run after your first admin user is created
-- INSERT INTO user_roles (user_id, role) VALUES ('your-admin-user-id', 'admin') ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
