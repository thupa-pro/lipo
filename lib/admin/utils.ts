import { createClient } from "@/lib/supabase/client";

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_listings: number;
  active_listings: number;
  total_bookings: number;
  pending_moderation: number;
  flagged_content: number;
  revenue_today: number;
  revenue_month: number;
  system_health: "healthy" | "warning" | "critical";
}

export interface UserManagementData {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  status: "active" | "suspended" | "banned";
  created_at: string;
  last_active?: string;
  total_bookings: number;
  total_spent: number;
}

export interface ContentFlag {
  id: string;
  content_type: string;
  content_id: string;
  flag_type: string;
  reason: string;
  reported_by: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  user_email: string;
  changes: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface PlatformMetrics {
  daily_active_users: number[];
  monthly_active_users: number[];
  revenue_trends: number[];
  booking_trends: number[];
  user_growth: number[];
  listing_growth: number[];
  retention_rates: number[];
  conversion_rates: number[];
}

export class AdminClient {
  private supabase = createClient();

  async checkAdminAccess(userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error || !data) return false;
    return data.role === "admin";
  }

  async getAdminStats(): Promise<AdminStats> {
    const { data, error } = await this.supabase.rpc("get_admin_stats");

    if (error) throw error;
    return data as AdminStats;
  }

  async getUserManagementData(
    page: number = 1,
    limit: number = 50,
    search?: string,
    roleFilter?: string,
    statusFilter?: string,
  ): Promise<{ users: UserManagementData[]; total: number }> {
    let query = this.supabase
      .from("user_management_view")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    if (roleFilter && roleFilter !== "all") {
      query = query.eq("role", roleFilter);
    }

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { users: data || [], total: count || 0 };
  }

  async updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "banned",
    reason?: string,
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_update_user_status", {
      p_user_id: userId,
      p_status: status,
      p_reason: reason,
    });

    if (error) throw error;
    return true;
  }

  async updateUserRole(userId: string, newRole: string): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_update_user_role", {
      p_user_id: userId,
      p_new_role: newRole,
    });

    if (error) throw error;
    return true;
  }

  async getContentFlags(
    page: number = 1,
    limit: number = 50,
    statusFilter?: string,
    typeFilter?: string,
  ): Promise<{ flags: ContentFlag[]; total: number }> {
    let query = this.supabase
      .from("content_flags")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (typeFilter && typeFilter !== "all") {
      query = query.eq("content_type", typeFilter);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { flags: data || [], total: count || 0 };
  }

  async reviewContentFlag(
    flagId: string,
    action: "approve" | "reject" | "dismiss",
    notes?: string,
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_review_content_flag", {
      p_flag_id: flagId,
      p_action: action,
      p_notes: notes,
    });

    if (error) throw error;
    return true;
  }

  async bulkModerationAction(
    flagIds: string[],
    action: "approve" | "reject" | "dismiss",
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_bulk_moderation", {
      p_flag_ids: flagIds,
      p_action: action,
    });

    if (error) throw error;
    return true;
  }

  async getAuditLogs(
    page: number = 1,
    limit: number = 50,
    actionFilter?: string,
    userFilter?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<{ logs: AuditLogEntry[]; total: number }> {
    let query = this.supabase
      .from("audit_logs_view")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (actionFilter && actionFilter !== "all") {
      query = query.eq("action", actionFilter);
    }

    if (userFilter) {
      query = query.eq("user_id", userFilter);
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { logs: data || [], total: count || 0 };
  }

  async getPlatformMetrics(
    timeRange: "7d" | "30d" | "90d" | "1y" = "30d",
  ): Promise<PlatformMetrics> {
    const { data, error } = await this.supabase.rpc("get_platform_metrics", {
      p_time_range: timeRange,
    });

    if (error) throw error;
    return data as PlatformMetrics;
  }

  async getSystemHealth(): Promise<{
    status: "healthy" | "warning" | "critical";
    metrics: Record<string, any>;
  }> {
    const { data, error } = await this.supabase.rpc("get_system_health");

    if (error) throw error;
    return data;
  }

  async sendPlatformAnnouncement(
    title: string,
    message: string,
    targetRole?: string,
    targetUsers?: string[],
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_send_announcement", {
      p_title: title,
      p_message: message,
      p_target_role: targetRole,
      p_target_users: targetUsers,
    });

    if (error) throw error;
    return true;
  }

  async exportData(
    type: "users" | "listings" | "bookings" | "analytics",
  ): Promise<string> {
    const { data, error } = await this.supabase.rpc("admin_export_data", {
      p_export_type: type,
    });

    if (error) throw error;
    return data;
  }

  async getReportingMetrics(): Promise<{
    reports_today: number;
    reports_week: number;
    resolution_time_avg: number;
    satisfaction_score: number;
  }> {
    const { data, error } = await this.supabase.rpc("get_reporting_metrics");

    if (error) throw error;
    return data;
  }

  async banUser(
    userId: string,
    reason: string,
    duration?: number, // days, null for permanent
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_ban_user", {
      p_user_id: userId,
      p_reason: reason,
      p_duration_days: duration,
    });

    if (error) throw error;
    return true;
  }

  async unbanUser(userId: string, reason?: string): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_unban_user", {
      p_user_id: userId,
      p_reason: reason,
    });

    if (error) throw error;
    return true;
  }

  async deleteContent(
    contentType: string,
    contentId: string,
    reason: string,
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_delete_content", {
      p_content_type: contentType,
      p_content_id: contentId,
      p_reason: reason,
    });

    if (error) throw error;
    return true;
  }

  async getContentDetails(
    contentType: string,
    contentId: string,
  ): Promise<any> {
    const { data, error } = await this.supabase.rpc("get_content_details", {
      p_content_type: contentType,
      p_content_id: contentId,
    });

    if (error) throw error;
    return data;
  }

  async createSystemAlert(
    level: "info" | "warning" | "error",
    title: string,
    message: string,
    targetRoles?: string[],
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("admin_create_system_alert", {
      p_level: level,
      p_title: title,
      p_message: message,
      p_target_roles: targetRoles,
    });

    if (error) throw error;
    return true;
  }
}

// Export singleton instance
export const adminClient = new AdminClient();

// Utility hook for admin components
export function useAdminClient() {
  return adminClient;
}

// Permission checking utilities
export function hasAdminPermission(userRole: string): boolean {
  return userRole === "admin";
}

export function hasModerationPermission(userRole: string): boolean {
  return ["admin", "moderator"].includes(userRole);
}

export function hasUserManagementPermission(userRole: string): boolean {
  return ["admin", "moderator"].includes(userRole);
}

// Formatting utilities
export function formatUserStatus(status: string): {
  label: string;
  color: string;
} {
  switch (status) {
    case "active":
      return { label: "Active", color: "text-green-600 bg-green-100" };
    case "suspended":
      return { label: "Suspended", color: "text-yellow-600 bg-yellow-100" };
    case "banned":
      return { label: "Banned", color: "text-red-600 bg-red-100" };
    default:
      return { label: "Unknown", color: "text-gray-600 bg-gray-100" };
  }
}

export function formatFlagStatus(status: string): {
  label: string;
  color: string;
} {
  switch (status) {
    case "pending":
      return { label: "Pending", color: "text-yellow-600 bg-yellow-100" };
    case "reviewed":
      return { label: "Reviewed", color: "text-blue-600 bg-blue-100" };
    case "resolved":
      return { label: "Resolved", color: "text-green-600 bg-green-100" };
    case "dismissed":
      return { label: "Dismissed", color: "text-gray-600 bg-gray-100" };
    default:
      return { label: "Unknown", color: "text-gray-600 bg-gray-100" };
  }
}

export function formatSystemHealth(status: string): {
  label: string;
  color: string;
  icon: string;
} {
  switch (status) {
    case "healthy":
      return { label: "Healthy", color: "text-green-600", icon: "✓" };
    case "warning":
      return { label: "Warning", color: "text-yellow-600", icon: "⚠" };
    case "critical":
      return { label: "Critical", color: "text-red-600", icon: "✗" };
    default:
      return { label: "Unknown", color: "text-gray-600", icon: "?" };
  }
}
