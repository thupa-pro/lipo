/**
 * RBAC Utility Functions (Server-side)
 */

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server-client";
import { UserRole, UserSession } from "./types";

/**
 * Get the current user session with role information (Server-side)
 */
export async function getCurrentSession(): Promise<UserSession | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const supabase = createClient();

    // Get user role from Supabase
    const { data: userRole, error } = await supabase
      .from("user_roles")
      .select("role, tenant_id")
      .eq("user_id", userId)
      .single();

    if (error || !userRole) {
      // Default to consumer role for authenticated users without explicit role
      return {
        id: userId,
        email: "",
        role: "consumer" as UserRole,
      };
    }

    return {
      id: userId,
      email: "",
      role: userRole.role as UserRole,
      tenantId: userRole.tenant_id,
    };
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
}
