"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import {
  Workspace,
  UserWorkspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceContextType,
} from "@/lib/workspace/types";
import { useWorkspaceClient } from "@/lib/workspace/utils";
import { useToast } from "@/components/ui/use-toast";

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

interface WorkspaceProviderProps {
  children: ReactNode;
  initialWorkspaceId?: string;
}

export function WorkspaceProvider({
  children,
  initialWorkspaceId,
}: WorkspaceProviderProps) {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const workspaceClient = useWorkspaceClient();

  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null,
  );
  const [userWorkspaces, setUserWorkspaces] = useState<UserWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      initializeWorkspaces();
    } else if (isLoaded && !user) {
      // User is not authenticated, reset state
      setCurrentWorkspace(null);
      setUserWorkspaces([]);
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const initializeWorkspaces = async () => {
    setIsLoading(true);
    try {
      // Load user's workspaces
      const workspaces = await workspaceClient.getUserWorkspaces();
      setUserWorkspaces(workspaces);

      if (workspaces.length === 0) {
        setIsLoading(false);
        return;
      }

      // Determine which workspace to set as current
      let targetWorkspace: UserWorkspace | null = null;

      if (initialWorkspaceId) {
        targetWorkspace =
          workspaces.find((w) => w.workspace_id === initialWorkspaceId) || null;
      }

      if (!targetWorkspace) {
        // Use default workspace or the first one
        targetWorkspace = workspaces.find((w) => w.is_default) || workspaces[0];
      }

      if (targetWorkspace) {
        await switchToWorkspace(targetWorkspace.workspace_id, false);
      }
    } catch (error) {
      console.error("Error initializing workspaces:", error);
      toast({
        title: "Error",
        description: "Failed to load workspaces. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchWorkspace = async (
    workspaceId: string,
    showToast: boolean = true,
  ) => {
    try {
      // Update user preferences
      await workspaceClient.switchToWorkspace(workspaceId);

      // Get full workspace details
      const workspace = await workspaceClient.getWorkspace(workspaceId);
      if (workspace) {
        setCurrentWorkspace(workspace);

        if (showToast) {
          toast({
            title: "Workspace Switched",
            description: `Switched to ${workspace.name}`,
          });
        }
      }
    } catch (error) {
      console.error("Error switching workspace:", error);
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to switch workspace. Please try again.",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const createWorkspace = async (
    data: CreateWorkspaceRequest,
  ): Promise<Workspace> => {
    try {
      const workspace = await workspaceClient.createWorkspace(data);

      // Refresh workspaces list
      await refreshWorkspaces();

      // Switch to the new workspace
      await switchWorkspace(workspace.id);

      toast({
        title: "Workspace Created",
        description: `${workspace.name} has been created and is now active.`,
      });

      return workspace;
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast({
        title: "Error",
        description: "Failed to create workspace. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateWorkspace = async (
    workspaceId: string,
    data: UpdateWorkspaceRequest,
  ): Promise<Workspace> => {
    try {
      const updatedWorkspace = await workspaceClient.updateWorkspace(
        workspaceId,
        data,
      );

      // Update current workspace if it's the one being updated
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(updatedWorkspace);
      }

      // Refresh workspaces list
      await refreshWorkspaces();

      toast({
        title: "Workspace Updated",
        description: "Workspace settings have been saved.",
      });

      return updatedWorkspace;
    } catch (error) {
      console.error("Error updating workspace:", error);
      toast({
        title: "Error",
        description: "Failed to update workspace. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshWorkspaces = async () => {
    try {
      const workspaces = await workspaceClient.getUserWorkspaces();
      setUserWorkspaces(workspaces);
    } catch (error) {
      console.error("Error refreshing workspaces:", error);
    }
  };

  const contextValue: WorkspaceContextType = {
    currentWorkspace,
    userWorkspaces,
    isLoading,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    refreshWorkspaces,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

// Helper hook for workspace-specific operations
export function useCurrentWorkspace() {
  const { currentWorkspace, isLoading } = useWorkspace();

  return {
    workspace: currentWorkspace,
    workspaceId: currentWorkspace?.id,
    isLoading,
    hasWorkspace: !!currentWorkspace,
  };
}

// Helper hook for workspace permissions
export function useWorkspacePermissions() {
  const { currentWorkspace, userWorkspaces } = useWorkspace();
  const workspaceClient = useWorkspaceClient();

  const getCurrentMemberRole = () => {
    if (!currentWorkspace) return null;

    const userWorkspace = userWorkspaces.find(
      (w) => w.workspace_id === currentWorkspace.id,
    );
    return userWorkspace?.member_role || null;
  };

  const checkPermission = async (permission: string) => {
    if (!currentWorkspace) return false;

    try {
      return await workspaceClient.checkPermission(
        currentWorkspace.id,
        permission as any,
      );
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  };

  return {
    memberRole: getCurrentMemberRole(),
    checkPermission,
    canManageMembers: getCurrentMemberRole()
      ? ["owner", "admin", "manager"].includes(getCurrentMemberRole()!)
      : false,
    canManageWorkspace: getCurrentMemberRole()
      ? ["owner", "admin"].includes(getCurrentMemberRole()!)
      : false,
    isOwner: getCurrentMemberRole() === "owner",
  };
}

// Helper hook for workspace navigation
export function useWorkspaceNavigation() {
  const { currentWorkspace } = useWorkspace();

  const getWorkspaceUrl = (path: string = "") => {
    if (!currentWorkspace) return "/";
    return `/workspace/${currentWorkspace.slug}${path}`;
  };

  const navigateToWorkspace = (path: string = "") => {
    window.location.href = getWorkspaceUrl(path);
  };

  return {
    getWorkspaceUrl,
    navigateToWorkspace,
    workspaceSlug: currentWorkspace?.slug,
  };
}
