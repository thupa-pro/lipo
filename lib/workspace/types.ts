// Multi-tenant workspace types for Loconomy

export type WorkspaceType = "personal" | "team" | "business" | "enterprise";

export type MemberRole = "owner" | "admin" | "manager" | "member" | "viewer";

export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: WorkspaceType;
  is_active: boolean;

  // Contact and branding
  website_url?: string;
  logo_url?: string;
  primary_color: string;

  // Billing
  subscription_id?: string;
  billing_email?: string;

  // Location
  timezone: string;
  country?: string;
  address?: WorkspaceAddress;

  // Configuration
  settings: Record<string, any>;
  features: Record<string, any>;
  metadata: Record<string, any>;

  created_at: string;
  updated_at: string;
}

export interface WorkspaceAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  title?: string;
  permissions: Record<string, any>;
  is_active: boolean;
  joined_at: string;
  invited_by?: string;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMemberWithUser extends WorkspaceMember {
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
  };
}

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  role: MemberRole;
  message?: string;
  status: InvitationStatus;
  invited_by: string;
  accepted_by?: string;
  expires_at: string;
  token: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceActivity {
  id: string;
  workspace_id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserWorkspacePreferences {
  id: string;
  user_id: string;
  default_workspace_id?: string;
  last_workspace_id?: string;
  workspace_sidebar_collapsed: boolean;
  preferred_workspace_view: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
  type: WorkspaceType;
  description?: string;
  website_url?: string;
  timezone?: string;
  country?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  primary_color?: string;
  timezone?: string;
  country?: string;
  address?: WorkspaceAddress;
  settings?: Record<string, any>;
}

export interface InviteMemberRequest {
  email: string;
  role: MemberRole;
  message?: string;
}

export interface UpdateMemberRequest {
  role?: MemberRole;
  title?: string;
  permissions?: Record<string, any>;
  is_active?: boolean;
}

// Composite types
export interface UserWorkspace {
  workspace_id: string;
  workspace_name: string;
  workspace_slug: string;
  workspace_type: WorkspaceType;
  member_role: MemberRole;
  is_default: boolean;
  member_count: number;
}

export interface WorkspaceWithRole extends Workspace {
  member_role: MemberRole;
  member_count: number;
  is_default: boolean;
}

export interface WorkspaceDetails extends Workspace {
  members: WorkspaceMemberWithUser[];
  invitations: WorkspaceInvitation[];
  recent_activity: WorkspaceActivity[];
  subscription?: any; // Subscription details if applicable
}

// Dashboard types
export interface WorkspaceDashboard {
  workspace: Workspace;
  stats: WorkspaceStats;
  recent_activity: WorkspaceActivity[];
  members: WorkspaceMemberWithUser[];
  pending_invitations: WorkspaceInvitation[];
}

export interface WorkspaceStats {
  total_members: number;
  active_members: number;
  total_listings: number;
  active_listings: number;
  total_bookings: number;
  monthly_revenue: number;
  growth_metrics: {
    member_growth: number;
    listing_growth: number;
    booking_growth: number;
  };
}

// Permission types
export type WorkspacePermission =
  | "read"
  | "write"
  | "manage_members"
  | "manage_workspace"
  | "delete_workspace";

export interface PermissionCheck {
  permission: WorkspacePermission;
  allowed: boolean;
  role_required: MemberRole[];
}

// Workspace selection types
export interface WorkspaceSelector {
  workspaces: UserWorkspace[];
  current_workspace?: UserWorkspace;
  default_workspace?: UserWorkspace;
}

// Activity log types
export type ActivityAction =
  | "workspace_created"
  | "workspace_updated"
  | "member_invited"
  | "member_joined"
  | "member_removed"
  | "member_role_changed"
  | "listing_created"
  | "listing_updated"
  | "booking_created"
  | "booking_confirmed"
  | "subscription_updated";

export interface ActivityLogEntry {
  id: string;
  action: ActivityAction;
  description: string;
  user: {
    id: string;
    name?: string;
    email: string;
    image_url?: string;
  } | null;
  entity?: {
    type: string;
    id: string;
    name?: string;
  };
  metadata: Record<string, any>;
  timestamp: string;
}

// Workspace settings types
export interface WorkspaceSettings {
  // General settings
  allow_member_invites: boolean;
  require_invitation_approval: boolean;
  default_member_role: MemberRole;

  // Notification settings
  notify_new_members: boolean;
  notify_member_activity: boolean;
  activity_digest_frequency: "never" | "daily" | "weekly";

  // Feature toggles
  enable_public_listings: boolean;
  enable_booking_notifications: boolean;
  enable_analytics: boolean;

  // Branding settings
  custom_domain?: string;
  hide_loconomy_branding: boolean;

  // Integration settings
  integrations: Record<string, any>;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<MemberRole, WorkspacePermission[]> = {
  owner: [
    "read",
    "write",
    "manage_members",
    "manage_workspace",
    "delete_workspace",
  ],
  admin: ["read", "write", "manage_members", "manage_workspace"],
  manager: ["read", "write", "manage_members"],
  member: ["read", "write"],
  viewer: ["read"],
};

// Workspace type configurations
export const WORKSPACE_TYPE_CONFIG: Record<
  WorkspaceType,
  {
    name: string;
    description: string;
    max_members: number;
    features: string[];
    color: string;
  }
> = {
  personal: {
    name: "Personal",
    description: "For individual use",
    max_members: 1,
    features: ["basic_listings", "personal_bookings"],
    color: "bg-blue-100 text-blue-800",
  },
  team: {
    name: "Team",
    description: "For small teams",
    max_members: 10,
    features: ["team_collaboration", "shared_listings", "member_management"],
    color: "bg-green-100 text-green-800",
  },
  business: {
    name: "Business",
    description: "For growing businesses",
    max_members: 50,
    features: ["advanced_analytics", "custom_branding", "priority_support"],
    color: "bg-purple-100 text-purple-800",
  },
  enterprise: {
    name: "Enterprise",
    description: "For large organizations",
    max_members: -1, // Unlimited
    features: [
      "enterprise_sso",
      "api_access",
      "custom_integrations",
      "dedicated_support",
    ],
    color: "bg-yellow-100 text-yellow-800",
  },
};

// Validation schemas (for use with form validation)
export interface WorkspaceValidation {
  name: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  slug: {
    required: boolean;
    pattern: RegExp;
    minLength: number;
    maxLength: number;
  };
  description: {
    maxLength: number;
  };
}

export const WORKSPACE_VALIDATION: WorkspaceValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  slug: {
    required: true,
    pattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    minLength: 2,
    maxLength: 63,
  },
  description: {
    maxLength: 200,
  },
};

// Context types for React providers
export interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  userWorkspaces: UserWorkspace[];
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (data: CreateWorkspaceRequest) => Promise<Workspace>;
  updateWorkspace: (
    id: string,
    data: UpdateWorkspaceRequest,
  ) => Promise<Workspace>;
  refreshWorkspaces: () => Promise<void>;
}

// Navigation types for workspace-aware routing
export interface WorkspaceRoute {
  path: string;
  title: string;
  icon?: React.ComponentType;
  requiredRole?: MemberRole[];
  requiredPermission?: WorkspacePermission;
  badge?: string | number;
}

// Notification types
export interface WorkspaceNotification {
  id: string;
  workspace_id: string;
  type: "invitation" | "member_joined" | "activity" | "system";
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  is_read: boolean;
  created_at: string;
}
