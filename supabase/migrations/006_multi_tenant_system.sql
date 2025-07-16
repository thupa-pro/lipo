-- Multi-Tenant Workspace System
-- This migration creates tables for workspace/tenant management

-- Tenant/Workspace types
CREATE TYPE workspace_type AS ENUM (
  'personal',
  'team',
  'business',
  'enterprise'
);

-- Member role enum
CREATE TYPE member_role AS ENUM (
  'owner',
  'admin',
  'manager',
  'member',
  'viewer'
);

-- Invitation status enum
CREATE TYPE invitation_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'expired'
);

-- Workspaces table (tenants)
CREATE TABLE workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic information
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Workspace settings
  type workspace_type DEFAULT 'personal',
  is_active BOOLEAN DEFAULT true,
  
  -- Contact and branding
  website_url TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  
  -- Billing and subscription
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  billing_email TEXT,
  
  -- Location and timezone
  timezone TEXT DEFAULT 'UTC',
  country TEXT,
  address JSONB, -- {street, city, state, zip, country}
  
  -- Features and settings
  settings JSONB DEFAULT '{}', -- Workspace-specific settings
  features JSONB DEFAULT '{}', -- Enabled features
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'),
  CONSTRAINT slug_length CHECK (char_length(slug) >= 2 AND char_length(slug) <= 63)
);

-- Workspace members table
CREATE TABLE workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Member details
  role member_role NOT NULL DEFAULT 'member',
  title TEXT, -- Job title/position
  
  -- Permissions and access
  permissions JSONB DEFAULT '{}', -- Custom permissions override
  is_active BOOLEAN DEFAULT true,
  
  -- Member metadata
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_active_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(workspace_id, user_id)
);

-- Workspace invitations table
CREATE TABLE workspace_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Invitation details
  email TEXT NOT NULL,
  role member_role NOT NULL DEFAULT 'member',
  message TEXT,
  
  -- Invitation lifecycle
  status invitation_status DEFAULT 'pending',
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  
  -- Token for secure invitation links
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(workspace_id, email) -- One pending invitation per email per workspace
);

-- Workspace activity log
CREATE TABLE workspace_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Activity details
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- created_listing, invited_member, etc.
  entity_type TEXT, -- listing, member, booking, etc.
  entity_id UUID,
  
  -- Activity data
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- User context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User workspace preferences (which workspace they last used, etc.)
CREATE TABLE user_workspace_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Preferences
  default_workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  last_workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  
  -- UI preferences
  workspace_sidebar_collapsed BOOLEAN DEFAULT false,
  preferred_workspace_view TEXT DEFAULT 'grid', -- grid, list
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_type ON workspaces(type);
CREATE INDEX idx_workspaces_is_active ON workspaces(is_active);
CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_role ON workspace_members(role);
CREATE INDEX idx_workspace_invitations_workspace_id ON workspace_invitations(workspace_id);
CREATE INDEX idx_workspace_invitations_email ON workspace_invitations(email);
CREATE INDEX idx_workspace_invitations_token ON workspace_invitations(token);
CREATE INDEX idx_workspace_invitations_status ON workspace_invitations(status);
CREATE INDEX idx_workspace_activity_workspace_id ON workspace_activity(workspace_id);
CREATE INDEX idx_workspace_activity_user_id ON workspace_activity(user_id);
CREATE INDEX idx_workspace_activity_action ON workspace_activity(action);
CREATE INDEX idx_user_workspace_preferences_user_id ON user_workspace_preferences(user_id);

-- RLS Policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workspace_preferences ENABLE ROW LEVEL SECURITY;

-- Workspace policies
CREATE POLICY "Users can view workspaces they belong to" ON workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = id 
        AND wm.user_id = auth.uid() 
        AND wm.is_active = true
    )
  );

CREATE POLICY "Workspace owners and admins can update workspace" ON workspaces
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = id 
        AND wm.user_id = auth.uid() 
        AND wm.role IN ('owner', 'admin')
        AND wm.is_active = true
    )
  );

CREATE POLICY "Users can create workspaces" ON workspaces
  FOR INSERT WITH CHECK (true);

-- Workspace members policies
CREATE POLICY "Users can view members of their workspaces" ON workspace_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.is_active = true
    )
  );

CREATE POLICY "Workspace admins can manage members" ON workspace_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.role IN ('owner', 'admin')
        AND wm.is_active = true
    )
  );

-- Workspace invitations policies
CREATE POLICY "Users can view invitations for their workspaces" ON workspace_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_invitations.workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.role IN ('owner', 'admin', 'manager')
        AND wm.is_active = true
    )
    OR auth.uid() = invited_by
  );

CREATE POLICY "Workspace managers can create invitations" ON workspace_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_invitations.workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.role IN ('owner', 'admin', 'manager')
        AND wm.is_active = true
    )
    AND auth.uid() = invited_by
  );

-- Workspace activity policies
CREATE POLICY "Users can view activity for their workspaces" ON workspace_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_activity.workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.is_active = true
    )
  );

CREATE POLICY "Users can create activity in their workspaces" ON workspace_activity
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_activity.workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.is_active = true
    )
    AND auth.uid() = user_id
  );

-- User preferences policies
CREATE POLICY "Users can manage their own workspace preferences" ON user_workspace_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all workspaces" ON workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers
CREATE TRIGGER update_workspaces_updated_at 
  BEFORE UPDATE ON workspaces 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_members_updated_at 
  BEFORE UPDATE ON workspace_members 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_invitations_updated_at 
  BEFORE UPDATE ON workspace_invitations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_workspace_preferences_updated_at 
  BEFORE UPDATE ON user_workspace_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Functions for workspace management

-- Function to create a new workspace and add the creator as owner
CREATE OR REPLACE FUNCTION create_workspace(
  p_user_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_type workspace_type DEFAULT 'personal',
  p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  workspace_id UUID;
BEGIN
  -- Create the workspace
  INSERT INTO workspaces (name, slug, type, description)
  VALUES (p_name, p_slug, p_type, p_description)
  RETURNING id INTO workspace_id;
  
  -- Add creator as owner
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (workspace_id, p_user_id, 'owner');
  
  -- Set as user's default workspace if they don't have one
  INSERT INTO user_workspace_preferences (user_id, default_workspace_id, last_workspace_id)
  VALUES (p_user_id, workspace_id, workspace_id)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    default_workspace_id = COALESCE(user_workspace_preferences.default_workspace_id, workspace_id),
    last_workspace_id = workspace_id;
  
  -- Log activity
  INSERT INTO workspace_activity (workspace_id, user_id, action, description)
  VALUES (workspace_id, p_user_id, 'workspace_created', 'Created workspace');
  
  RETURN workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to invite a user to workspace
CREATE OR REPLACE FUNCTION invite_to_workspace(
  p_workspace_id UUID,
  p_email TEXT,
  p_role member_role,
  p_invited_by UUID,
  p_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  invitation_id UUID;
  existing_user UUID;
BEGIN
  -- Check if user is already a member
  SELECT user_id INTO existing_user
  FROM workspace_members wm
  JOIN auth.users u ON u.id = wm.user_id
  WHERE wm.workspace_id = p_workspace_id 
    AND u.email = p_email
    AND wm.is_active = true;
  
  IF existing_user IS NOT NULL THEN
    RAISE EXCEPTION 'User is already a member of this workspace';
  END IF;
  
  -- Create invitation
  INSERT INTO workspace_invitations (workspace_id, email, role, invited_by, message)
  VALUES (p_workspace_id, p_email, p_role, p_invited_by, p_message)
  RETURNING id INTO invitation_id;
  
  -- Log activity
  INSERT INTO workspace_activity (workspace_id, user_id, action, description, metadata)
  VALUES (
    p_workspace_id, 
    p_invited_by, 
    'member_invited', 
    'Invited user to workspace',
    json_build_object('email', p_email, 'role', p_role)
  );
  
  RETURN invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept workspace invitation
CREATE OR REPLACE FUNCTION accept_workspace_invitation(
  p_token TEXT,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record
  FROM workspace_invitations
  WHERE token = p_token 
    AND status = 'pending'
    AND expires_at > NOW();
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Verify email matches user
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = p_user_id AND email = invitation_record.email
  ) THEN
    RETURN false;
  END IF;
  
  -- Add user to workspace
  INSERT INTO workspace_members (workspace_id, user_id, role, invited_by)
  VALUES (
    invitation_record.workspace_id, 
    p_user_id, 
    invitation_record.role,
    invitation_record.invited_by
  );
  
  -- Update invitation status
  UPDATE workspace_invitations
  SET status = 'accepted', accepted_by = p_user_id
  WHERE id = invitation_record.id;
  
  -- Update user's last workspace
  INSERT INTO user_workspace_preferences (user_id, last_workspace_id)
  VALUES (p_user_id, invitation_record.workspace_id)
  ON CONFLICT (user_id) 
  DO UPDATE SET last_workspace_id = invitation_record.workspace_id;
  
  -- Log activity
  INSERT INTO workspace_activity (workspace_id, user_id, action, description)
  VALUES (
    invitation_record.workspace_id, 
    p_user_id, 
    'member_joined', 
    'Accepted workspace invitation'
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's workspaces
CREATE OR REPLACE FUNCTION get_user_workspaces(p_user_id UUID)
RETURNS TABLE (
  workspace_id UUID,
  workspace_name TEXT,
  workspace_slug TEXT,
  workspace_type workspace_type,
  member_role member_role,
  is_default BOOLEAN,
  member_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.name,
    w.slug,
    w.type,
    wm.role,
    (w.id = uwp.default_workspace_id) as is_default,
    (SELECT COUNT(*) FROM workspace_members wm2 
     WHERE wm2.workspace_id = w.id AND wm2.is_active = true) as member_count
  FROM workspaces w
  JOIN workspace_members wm ON w.id = wm.workspace_id
  LEFT JOIN user_workspace_preferences uwp ON uwp.user_id = p_user_id
  WHERE wm.user_id = p_user_id 
    AND wm.is_active = true
    AND w.is_active = true
  ORDER BY 
    (w.id = uwp.default_workspace_id) DESC,
    (w.id = uwp.last_workspace_id) DESC,
    w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check workspace permission
CREATE OR REPLACE FUNCTION check_workspace_permission(
  p_user_id UUID,
  p_workspace_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role member_role;
  has_permission BOOLEAN := false;
BEGIN
  -- Get user's role in workspace
  SELECT role INTO user_role
  FROM workspace_members
  WHERE user_id = p_user_id 
    AND workspace_id = p_workspace_id 
    AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check permission based on role and permission type
  CASE p_permission
    WHEN 'read' THEN
      has_permission := user_role IN ('owner', 'admin', 'manager', 'member', 'viewer');
    WHEN 'write' THEN
      has_permission := user_role IN ('owner', 'admin', 'manager', 'member');
    WHEN 'manage_members' THEN
      has_permission := user_role IN ('owner', 'admin', 'manager');
    WHEN 'manage_workspace' THEN
      has_permission := user_role IN ('owner', 'admin');
    WHEN 'delete_workspace' THEN
      has_permission := user_role = 'owner';
    ELSE
      has_permission := false;
  END CASE;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log workspace activity
CREATE OR REPLACE FUNCTION log_workspace_activity(
  p_workspace_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_description TEXT DEFAULT NULL,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO workspace_activity (
    workspace_id, 
    user_id, 
    action, 
    description, 
    entity_type, 
    entity_id, 
    metadata
  )
  VALUES (
    p_workspace_id, 
    p_user_id, 
    p_action, 
    p_description, 
    p_entity_type, 
    p_entity_id, 
    p_metadata
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing tables to support multi-tenancy

-- Add workspace_id to listings table
ALTER TABLE listings ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
CREATE INDEX idx_listings_workspace_id ON listings(workspace_id);

-- Add workspace_id to bookings table  
ALTER TABLE bookings ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
CREATE INDEX idx_bookings_workspace_id ON bookings(workspace_id);

-- Add workspace_id to user_subscriptions table
ALTER TABLE user_subscriptions ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
CREATE INDEX idx_user_subscriptions_workspace_id ON user_subscriptions(workspace_id);

-- Update RLS policies for multi-tenant access

-- Update listings policies to include workspace access
DROP POLICY IF EXISTS "Providers can manage own listings" ON listings;
CREATE POLICY "Workspace members can manage listings" ON listings
  FOR ALL USING (
    -- Own listings
    auth.uid() = provider_id OR
    -- Workspace access
    (workspace_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = listings.workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.is_active = true
        AND wm.role IN ('owner', 'admin', 'manager', 'member')
    )) OR
    -- Admin access
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Update bookings policies to include workspace access
DROP POLICY IF EXISTS "Users can view their bookings" ON bookings;
CREATE POLICY "Users can view their bookings or workspace bookings" ON bookings
  FOR SELECT USING (
    -- Own bookings
    auth.uid() = provider_id OR 
    auth.uid() = customer_id OR
    -- Workspace access
    (workspace_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = bookings.workspace_id 
        AND wm.user_id = auth.uid() 
        AND wm.is_active = true
        AND wm.role IN ('owner', 'admin', 'manager', 'member')
    )) OR
    -- Admin access
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
