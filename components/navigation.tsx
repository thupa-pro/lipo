"use client";

/**
 * Main Navigation Component with RBAC Integration
 * Uses role-aware navigation and integrates with existing Clerk authentication
 */

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { RoleAwareNavigation } from "./navigation/RoleAwareNavigation";
import { UserRole } from "@/lib/rbac/types";
import { createClient } from "@/lib/supabase/client";

export default function Navigation() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchUserRole = async () => {
      if (!user?.id) {
        setUserRole("guest");
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          // Default to consumer for authenticated users without explicit role
          setUserRole("consumer");

          // Optionally create the role in the database
          await supabase
            .from("user_roles")
            .insert({ user_id: user.id, role: "consumer" })
            .select()
            .single();
        } else {
          setUserRole(data.role as UserRole);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("consumer"); // Default fallback
      }
    };

    fetchUserRole();
  }, [user?.id, isLoaded]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return <RoleAwareNavigation userRole={userRole} />;
}
