"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  ChevronDown,
  Plus,
  Settings,
  Users,
  Crown,
  Check,
} from "lucide-react";
import {
  UserWorkspace,
  WorkspaceType,
  WORKSPACE_TYPE_CONFIG,
} from "@/lib/workspace/types";
import {
  useWorkspaceClient,
  formatMemberCount,
  getRoleColor,
  getRoleDisplayName,
} from "@/lib/workspace/utils";
import { useToast } from "@/hooks/use-toast";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

interface WorkspaceSelectorProps {
  currentWorkspaceId?: string;
  onWorkspaceChange?: (workspace: UserWorkspace) => void;
  showCreateButton?: boolean;
  className?: string;
}

export function WorkspaceSelector({
  currentWorkspaceId,
  onWorkspaceChange,
  showCreateButton = true,
  className = "",
}: WorkspaceSelectorProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const workspaceClient = useWorkspaceClient();

  const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] =
    useState<UserWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadWorkspaces();
    }
  }, [user]);

  useEffect(() => {
    if (currentWorkspaceId && workspaces.length > 0) {
      const workspace = workspaces.find(
        (w) => w.workspace_id === currentWorkspaceId,
      );
      if (workspace) {
        setCurrentWorkspace(workspace);
      }
    } else if (workspaces.length > 0 && !currentWorkspace) {
      // Auto-select default or last workspace
      const defaultWorkspace =
        workspaces.find((w) => w.is_default) || workspaces[0];
      setCurrentWorkspace(defaultWorkspace);
      if (onWorkspaceChange) {
        onWorkspaceChange(defaultWorkspace);
      }
    }
  }, [currentWorkspaceId, workspaces, currentWorkspace, onWorkspaceChange]);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    try {
      const userWorkspaces = await workspaceClient.getUserWorkspaces();
      setWorkspaces(userWorkspaces);
    } catch (error) {
      console.error("Error loading workspaces:", error);
      toast({
        title: "Error",
        description: "Failed to load workspaces. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkspaceSwitch = async (workspace: UserWorkspace) => {
    try {
      await workspaceClient.switchToWorkspace(workspace.workspace_id);
      setCurrentWorkspace(workspace);

      if (onWorkspaceChange) {
        onWorkspaceChange(workspace);
      }

      toast({
        title: "Workspace Switched",
        description: `Switched to ${workspace.workspace_name}`,
      });
    } catch (error) {
      console.error("Error switching workspace:", error);
      toast({
        title: "Error",
        description: "Failed to switch workspace. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWorkspaceCreated = async (workspace: any) => {
    setShowCreateDialog(false);
    await loadWorkspaces();

    // Auto-switch to new workspace
    const newWorkspace = workspaces.find(
      (w) => w.workspace_id === workspace.id,
    );
    if (newWorkspace) {
      await handleWorkspaceSwitch(newWorkspace);
    }
  };

  const getWorkspaceIcon = (type: WorkspaceType) => {
    const config = WORKSPACE_TYPE_CONFIG[type];
    return (
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center ${config.color}`}
      >
        <Building2 className="w-4 h-4" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse" />
        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showCreateButton && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
              </DialogHeader>
              <CreateWorkspaceForm
                onSuccess={handleWorkspaceCreated}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[200px]">
            <div className="flex items-center gap-2">
              {currentWorkspace &&
                getWorkspaceIcon(currentWorkspace.workspace_type)}
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">
                  {currentWorkspace?.workspace_name || "Select Workspace"}
                </span>
                {currentWorkspace && (
                  <span className="text-xs text-gray-500">
                    {formatMemberCount(currentWorkspace.member_count)}
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {workspaces.map((workspace) => {
            const isSelected =
              currentWorkspace?.workspace_id === workspace.workspace_id;
            const config = WORKSPACE_TYPE_CONFIG[workspace.workspace_type];

            return (
              <DropdownMenuItem
                key={workspace.workspace_id}
                onClick={() => !isSelected && handleWorkspaceSwitch(workspace)}
                className="flex items-center justify-between p-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {getWorkspaceIcon(workspace.workspace_type)}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {workspace.workspace_name}
                      </span>
                      {workspace.is_default && (
                        <Crown className="w-3 h-3 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge
                        className={getRoleColor(workspace.member_role)}
                        size="sm"
                      >
                        {getRoleDisplayName(workspace.member_role)}
                      </Badge>
                      <span>{formatMemberCount(workspace.member_count)}</span>
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-green-600" />}
              </DropdownMenuItem>
            );
          })}

          {showCreateButton && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center gap-2 p-3 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Workspace</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (currentWorkspace) {
                window.location.href = `/workspace/${currentWorkspace.workspace_slug}/settings`;
              }
            }}
            className="flex items-center gap-2 p-3 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Workspace Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Workspace Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
          </DialogHeader>
          <CreateWorkspaceForm
            onSuccess={handleWorkspaceCreated}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
