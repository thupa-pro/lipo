"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Workspace,
  WorkspaceMember,
  WorkspaceInvitation,
  WorkspaceActivity,
  UserWorkspace,
  WorkspaceDetails,
  WorkspaceDashboard,
  WorkspaceStats,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  InviteMemberRequest,
  UpdateMemberRequest,
  MemberRole,
  WorkspacePermission,
  UserWorkspacePreferences,
  WorkspaceType,
  ROLE_PERMISSIONS,
  WORKSPACE_TYPE_CONFIG,
} from "./types";

export class WorkspaceClient {
  private supabase = createClient();

  // Workspace CRUD operations
  async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const { data: workspace, error } = await this.supabase.rpc(
      "create_workspace",
      {
        p_user_id: userId,
        p_name: data.name,
        p_slug: data.slug,
        p_type: data.type,
        p_description: data.description,
      },
    );

    if (error) throw error;

    // Get the created workspace details
    const { data: workspaceData, error: fetchError } = await this.supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspace)
      .single();

    if (fetchError) throw fetchError;
    return workspaceData;
  }

  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    const { data, error } = await this.supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .single();

    if (error) return null;
    return data;
  }

  async updateWorkspace(
    workspaceId: string,
    data: UpdateWorkspaceRequest,
  ): Promise<Workspace> {
    const { data: workspace, error } = await this.supabase
      .from("workspaces")
      .update(data)
      .eq("id", workspaceId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await this.logActivity(
      workspaceId,
      "workspace_updated",
      "Workspace settings updated",
    );

    return workspace;
  }

  async deleteWorkspace(workspaceId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("workspaces")
      .update({ is_active: false })
      .eq("id", workspaceId);

    if (error) throw error;
    return true;
  }

  // User workspaces
  async getUserWorkspaces(userId?: string): Promise<UserWorkspace[]> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return [];

    const { data, error } = await this.supabase.rpc("get_user_workspaces", {
      p_user_id: targetUserId,
    });

    if (error) throw error;
    return data || [];
  }

  async switchToWorkspace(workspaceId: string): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    const { error } = await this.supabase
      .from("user_workspace_preferences")
      .upsert({
        user_id: userId,
        last_workspace_id: workspaceId,
      });

    if (error) throw error;
    return true;
  }

  async setDefaultWorkspace(workspaceId: string): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    const { error } = await this.supabase
      .from("user_workspace_preferences")
      .upsert({
        user_id: userId,
        default_workspace_id: workspaceId,
        last_workspace_id: workspaceId,
      });

    if (error) throw error;
    return true;
  }

  // Workspace members
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const { data, error } = await this.supabase
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("is_active", true)
      .order("role")
      .order("joined_at");

    if (error) throw error;
    return data || [];
  }

  async inviteMember(
    workspaceId: string,
    invitation: InviteMemberRequest,
  ): Promise<string> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const { data: invitationId, error } = await this.supabase.rpc(
      "invite_to_workspace",
      {
        p_workspace_id: workspaceId,
        p_email: invitation.email,
        p_role: invitation.role,
        p_invited_by: userId,
        p_message: invitation.message,
      },
    );

    if (error) throw error;
    return invitationId;
  }

  async updateMember(
    workspaceId: string,
    memberId: string,
    updates: UpdateMemberRequest,
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from("workspace_members")
      .update(updates)
      .eq("id", memberId)
      .eq("workspace_id", workspaceId);

    if (error) throw error;

    // Log activity
    await this.logActivity(
      workspaceId,
      "member_role_changed",
      "Member role updated",
      "member",
      memberId,
      updates,
    );

    return true;
  }

  async removeMember(workspaceId: string, memberId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("workspace_members")
      .update({ is_active: false })
      .eq("id", memberId)
      .eq("workspace_id", workspaceId);

    if (error) throw error;

    // Log activity
    await this.logActivity(
      workspaceId,
      "member_removed",
      "Member removed from workspace",
      "member",
      memberId,
    );

    return true;
  }

  // Invitations
  async getWorkspaceInvitations(
    workspaceId: string,
  ): Promise<WorkspaceInvitation[]> {
    const { data, error } = await this.supabase
      .from("workspace_invitations")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async acceptInvitation(token: string): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const { data: success, error } = await this.supabase.rpc(
      "accept_workspace_invitation",
      {
        p_token: token,
        p_user_id: userId,
      },
    );

    if (error) throw error;
    return success;
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("workspace_invitations")
      .update({ status: "expired" })
      .eq("id", invitationId);

    if (error) throw error;
    return true;
  }

  async resendInvitation(invitationId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("workspace_invitations")
      .update({
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 7 days from now
      })
      .eq("id", invitationId);

    if (error) throw error;
    return true;
  }

  // Permissions
  async checkPermission(
    workspaceId: string,
    permission: WorkspacePermission,
    userId?: string,
  ): Promise<boolean> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return false;

    const { data, error } = await this.supabase.rpc(
      "check_workspace_permission",
      {
        p_user_id: targetUserId,
        p_workspace_id: workspaceId,
        p_permission: permission,
      },
    );

    if (error) return false;
    return data;
  }

  async getUserRole(
    workspaceId: string,
    userId?: string,
  ): Promise<MemberRole | null> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return null;

    const { data, error } = await this.supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", targetUserId)
      .eq("is_active", true)
      .single();

    if (error) return null;
    return data.role;
  }

  // Activity logging
  async logActivity(
    workspaceId: string,
    action: string,
    description?: string,
    entityType?: string,
    entityId?: string,
    metadata?: Record<string, any>,
  ): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    const { data, error } = await this.supabase.rpc("log_workspace_activity", {
      p_workspace_id: workspaceId,
      p_user_id: userId,
      p_action: action,
      p_description: description,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_metadata: metadata || {},
    });

    if (error) return false;
    return data;
  }

  async getWorkspaceActivity(
    workspaceId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<WorkspaceActivity[]> {
    const { data, error } = await this.supabase
      .from("workspace_activity")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  }

  // Dashboard data
  async getWorkspaceDashboard(
    workspaceId: string,
  ): Promise<WorkspaceDashboard> {
    const [workspace, members, invitations, activity, stats] =
      await Promise.all([
        this.getWorkspace(workspaceId),
        this.getWorkspaceMembers(workspaceId),
        this.getWorkspaceInvitations(workspaceId),
        this.getWorkspaceActivity(workspaceId, 10),
        this.getWorkspaceStats(workspaceId),
      ]);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return {
      workspace,
      stats,
      recent_activity: activity,
      members: await this.getWorkspaceMembers(workspace.id), // Include user data
      pending_invitations: invitations,
    };
  }

  async getWorkspaceStats(workspaceId: string): Promise<WorkspaceStats> {
    // Get basic counts
    const [membersCount, listingsCount, bookingsCount] = await Promise.all([
      this.supabase
        .from("workspace_members")
        .select("id", { count: "exact" })
        .eq("workspace_id", workspaceId)
        .eq("is_active", true),
      this.supabase
        .from("listings")
        .select("id", { count: "exact" })
        .eq("workspace_id", workspaceId),
      this.supabase
        .from("bookings")
        .select("id", { count: "exact" })
        .eq("workspace_id", workspaceId),
    ]);

    // Calculate revenue and growth metrics
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: monthlyBookings } = await this.supabase
      .from("bookings")
      .select("total_amount")
      .eq("workspace_id", workspaceId)
      .gte("booking_date", currentMonth + "-01")
      .eq("status", "completed");

    const monthlyRevenue =
      monthlyBookings?.reduce(
        (sum, booking) => sum + booking.total_amount,
        0,
      ) || 0;

    return {
      total_members: membersCount.count || 0,
      active_members: membersCount.count || 0, // Simplified
      total_listings: listingsCount.count || 0,
      active_listings: listingsCount.count || 0, // Simplified
      total_bookings: bookingsCount.count || 0,
      monthly_revenue: monthlyRevenue,
      growth_metrics: {
        member_growth: await this.calculateMemberGrowth(workspace.id),
        listing_growth: 0,
        booking_growth: 0,
      },
    };
  }

  // User preferences
  async getUserPreferences(
    userId?: string,
  ): Promise<UserWorkspacePreferences | null> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return null;

    const { data, error } = await this.supabase
      .from("user_workspace_preferences")
      .select("*")
      .eq("user_id", targetUserId)
      .single();

    if (error) return null;
    return data;
  }

  async updateUserPreferences(
    preferences: Partial<UserWorkspacePreferences>,
  ): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    const { error } = await this.supabase
      .from("user_workspace_preferences")
      .upsert({
        user_id: userId,
        ...preferences,
      });

    if (error) throw error;
    return true;
  }
}

// Export singleton instance
export const workspaceClient = new WorkspaceClient();

// Utility hook for client components
export function useWorkspaceClient() {
  return workspaceClient;
}

// Utility functions
export function hasPermission(
  role: MemberRole,
  permission: WorkspacePermission,
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

export function canManageMembers(role: MemberRole): boolean {
  return hasPermission(role, "manage_members");
}

export function canManageWorkspace(role: MemberRole): boolean {
  return hasPermission(role, "manage_workspace");
}

export function isWorkspaceOwner(role: MemberRole): boolean {
  return role === "owner";
}

export function getRoleDisplayName(role: MemberRole): string {
  const names = {
    owner: "Owner",
    admin: "Admin",
    manager: "Manager",
    member: "Member",
    viewer: "Viewer",
  };
  return names[role];
}

export function getRoleColor(role: MemberRole): string {
  const colors = {
    owner: "bg-yellow-100 text-yellow-800",
    admin: "bg-red-100 text-red-800",
    manager: "bg-purple-100 text-purple-800",
    member: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
  };
  return colors[role];
}

export function getWorkspaceTypeConfig(type: WorkspaceType) {
  return WORKSPACE_TYPE_CONFIG[type];
}

export function generateWorkspaceSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63);
}

export function validateWorkspaceSlug(slug: string): boolean {
  const pattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return pattern.test(slug) && slug.length >= 2 && slug.length <= 63;
}

export function formatMemberCount(count: number): string {
  if (count === 1) return "1 member";
  return `${count.toLocaleString()} members`;
}

export function getInvitationExpirationStatus(expiresAt: string): {
  isExpired: boolean;
  expiresIn: string;
  urgency: "low" | "medium" | "high";
} {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const isExpired = expiration <= now;

  if (isExpired) {
    return {
      isExpired: true,
      expiresIn: "Expired",
      urgency: "high",
    };
  }

  const hoursRemaining = Math.ceil(
    (expiration.getTime() - now.getTime()) / (1000 * 60 * 60),
  );

  if (hoursRemaining <= 24) {
    return {
      isExpired: false,
      expiresIn: `${hoursRemaining}h remaining`,
      urgency: "high",
    };
  } else if (hoursRemaining <= 72) {
    return {
      isExpired: false,
      expiresIn: `${Math.ceil(hoursRemaining / 24)}d remaining`,
      urgency: "medium",
    };
  } else {
    return {
      isExpired: false,
      expiresIn: `${Math.ceil(hoursRemaining / 24)}d remaining`,
      urgency: "low",
    };
  }
}

export function createInvitationUrl(token: string, baseUrl?: string): string {
  const base = baseUrl || window.location.origin;
  return `${base}/invite/${token}`;
}

export function formatActivityDescription(activity: WorkspaceActivity): string {
  // Format activity descriptions based on action type
  const { action, metadata, description } = activity;

  if (description) return description;

  switch (action) {
    case "workspace_created":
      return "Created the workspace";
    case "member_invited":
      return `Invited ${metadata.email} as ${metadata.role}`;
    case "member_joined":
      return "Joined the workspace";
    case "member_removed":
      return "Removed a member";
    case "listing_created":
      return "Created a new listing";
    case "booking_created":
      return "Created a new booking";
    default:
      return action.replace(/_/g, " ");
  }
}

export function getActivityIcon(action: string): string {
  switch (action) {
    case "workspace_created":
      return "🏢";
    case "member_invited":
      return "✉️";
    case "member_joined":
      return "👋";
    case "member_removed":
      return "👤";
    case "listing_created":
      return "📝";
    case "booking_created":
      return "📅";
    default:
      return "📋";
  }
}

export function canPerformAction(
  userRole: MemberRole,
  targetRole: MemberRole,
  action: "invite" | "remove" | "change_role",
): boolean {
  // Role hierarchy: owner > admin > manager > member > viewer
  const roleHierarchy = ["viewer", "member", "manager", "admin", "owner"];
  const userLevel = roleHierarchy.indexOf(userRole);
  const targetLevel = roleHierarchy.indexOf(targetRole);

  switch (action) {
    case "invite":
      return userLevel >= 2; // manager or above
    case "remove":
      return userLevel > targetLevel; // Can only remove users with lower roles
    case "change_role":
      return userLevel > targetLevel; // Can only change roles of users with lower roles
    default:
      return false;
  }
}
