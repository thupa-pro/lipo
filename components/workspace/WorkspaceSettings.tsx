"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Settings,
  Users,
  Plus,
  Mail,
  Save,
  Activity,
  Copy,
  ExternalLink,
  Trash2
} from "lucide-react";
import {
  Workspace,
  WorkspaceMember,
  WorkspaceInvitation,
  WorkspaceActivity,
  UpdateWorkspaceRequest,
  InviteMemberRequest
} from "@/lib/workspace/types";
import {
  useWorkspaceClient,
  getRoleColor,
  getRoleDisplayName,
  formatMemberCount,
  getInvitationExpirationStatus,
  createInvitationUrl,
  formatActivityDescription
} from "@/lib/workspace/utils";
import { useToast } from "@/components/ui/use-toast";
import { InviteMemberForm } from "./InviteMemberForm";

interface WorkspaceSettingsProps {
  workspaceSlug: string;
}

export function WorkspaceSettings({ workspaceSlug }: WorkspaceSettingsProps) {
  const { toast } = useToast();
  const workspaceClient = useWorkspaceClient();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [activity, setActivity] = useState<WorkspaceActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    primary_color: "#3B82F6",
  });

  useEffect(() => {
    loadWorkspaceData();
  }, [workspaceSlug]);

  const loadWorkspaceData = async () => {
    setIsLoading(true);
    try {
      // For, now, we'll get workspace by slug through a different approach
      // In a real, implementation, you might have a separate endpoint
      const userWorkspaces = await workspaceClient.getUserWorkspaces();
      const targetWorkspace = userWorkspaces.find(
        (w) => w.workspace_slug === workspaceSlug,
      );

      if (!targetWorkspace) {
        throw new Error("Workspace not found");
      }

      const [workspaceData, membersData, invitationsData, activityData] =
        await Promise.all([
          workspaceClient.getWorkspace(targetWorkspace.workspace_id),
          workspaceClient.getWorkspaceMembers(targetWorkspace.workspace_id),
          workspaceClient.getWorkspaceInvitations(targetWorkspace.workspace_id),
          workspaceClient.getWorkspaceActivity(
            targetWorkspace.workspace_id,
            20,
          ),
        ]);

      if (workspaceData) {
        setWorkspace(workspaceData);
        setFormData({
          name: workspaceData.name,
          description: workspaceData.description || "",
          website_url: workspaceData.website_url || "",
          primary_color: workspaceData.primary_color,
        });
      }

      setMembers(membersData);
      setInvitations(invitationsData);
      setActivity(activityData);
    } catch (error) {
      console.error("Error loading workspace data:", error);
      toast({
        title: "Error",
        description: "Failed to load workspace data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorkspace = async () => {
    if (!workspace) return;

    setIsSaving(true);
    try {
      const updateData: UpdateWorkspaceRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        website_url: formData.website_url.trim() || undefined,
        primary_color: formData.primary_color,
      };

      await workspaceClient.updateWorkspace(workspace.id, updateData);

      toast({
        title: "Settings Saved",
        description: "Workspace settings have been updated successfully.",
      });

      await loadWorkspaceData();
    } catch (error) {
      console.error("Error saving workspace:", error);
      toast({
        title: "Error",
        description: "Failed to save workspace settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInviteMember = async (invitation: InviteMemberRequest) => {
    if (!workspace) return;

    try {
      await workspaceClient.inviteMember(workspace.id, invitation);

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${invitation.email}`,
      });

      setShowInviteDialog(false);
      await loadWorkspaceData();
    } catch (error: any) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!workspace) return;

    try {
      await workspaceClient.removeMember(workspace.id, memberId);

      toast({
        title: "Member Removed",
        description: "Member has been removed from the workspace.",
      });

      await loadWorkspaceData();
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await workspaceClient.cancelInvitation(invitationId);

      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled.",
      });

      await loadWorkspaceData();
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyInvitationLink = (invitation: WorkspaceInvitation) => {
    const inviteUrl = createInvitationUrl(invitation.token);
    navigator.clipboard.writeText(inviteUrl);

    toast({
      title: "Link Copied",
      description: "Invitation link has been copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Workspace not found.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="My Workspace"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-url">Website URL</Label>
                <Input
                  id="workspace-url"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace-description">Description</Label>
              <Textarea
                id="workspace-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your workspace..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="primary-color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  className="w-16 h-10"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  placeholder="#3B82F6"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveWorkspace} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="members" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members ({formatMemberCount(members.length)})
              </CardTitle>
              <Dialog
                open={showInviteDialog}
                onOpenChange={setShowInviteDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <InviteMemberForm
                    onSubmit={handleInviteMember}
                    onCancel={() => setShowInviteDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {/* User avatar would go here */}
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{member.user_id}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(member.role)}>
                      {getRoleDisplayName(member.role)}
                    </Badge>
                    {member.role !== "owner" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this member from
                              the workspace? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveMember(member.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invitations" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Pending Invitations ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No pending invitations</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invitations.map((invitation) => {
                  const expirationStatus = getInvitationExpirationStatus(
                    invitation.expires_at,
                  );

                  return (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Badge
                            className={getRoleColor(invitation.role)}
                            size="sm"
                          >
                            {getRoleDisplayName(invitation.role)}
                          </Badge>
                          <span
                            className={`${
                              expirationStatus.urgency === "high"
                                ? "text-red-600"
                                : expirationStatus.urgency === "medium"
                                  ? "text-yellow-600"
                                  : "text-gray-500"
                            }`}
                          >
                            {expirationStatus.expiresIn}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyInvitationLink(invitation)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        {formatActivityDescription(item)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
