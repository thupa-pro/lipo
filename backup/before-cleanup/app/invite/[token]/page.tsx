"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  useWorkspaceClient,
  getRoleDisplayName,
  getRoleColor,
} from "@/lib/workspace/utils";
import { useToast } from "@/hooks/use-toast";

interface PageProps {
  params: {
    token: string;
  };
}

export default function InviteAcceptPage({ params }: PageProps) {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const workspaceClient = useWorkspaceClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      validateInvitation();
    }
  }, [isLoaded, params.token]);

  const validateInvitation = async () => {
    setIsLoading(true);
    try {
      // Since we don't have a direct endpoint to validate, invitations,
      // we'll simulate the validation process

      if (!user) {
        setError("Please sign in to accept this invitation.");
        return;
      }

      // In a real, implementation, you would validate the token here
      // For, now, we'll simulate invitation data
      setInvitationData({
        workspace_name: "Example Workspace",
        role: "member",
        invited_by_email: "admin@example.com",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (error: any) {
      console.error("Error validating invitation:", error);
      setError(error.message || "Invalid or expired invitation link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!user) {
      window.location.href =
        "/auth/signin?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsAccepting(true);
    try {
      const success = await workspaceClient.acceptInvitation(params.token);

      if (success) {
        setSuccess(true);
        toast({
          title: "Invitation Accepted",
          description: `Welcome to ${invitationData?.workspace_name}!`,
        });

        // Redirect to workspace after a delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        throw new Error("Failed to accept invitation");
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      setError(
        error.message || "Failed to accept invitation. Please try again.",
      );
      toast({
        title: "Error",
        description:
          error.message || "Failed to accept invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold mb-2">
            Validating invitation...
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your invitation.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to the team!
              </h1>

              <p className="text-gray-600 mb-6">
                You've successfully joined{" "}
                <strong>{invitationData?.workspace_name}</strong>. You'll be
                redirected to your dashboard shortly.
              </p>

              <Button onClick={() => (window.location.href = "/dashboard")}>
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Invitation Invalid
              </h1>

              <p className="text-gray-600 mb-6">{error}</p>

              <div className="space-y-3">
                {!user ? (
                  <Button
                    onClick={() => (window.location.href = "/auth/signin")}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                ) : (
                  <Button
                    onClick={() => (window.location.href = "/dashboard")}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Join {invitationData?.workspace_name}
              </h1>

              <p className="text-gray-600 mb-6">
                You've been invited to join{" "}
                <strong>{invitationData?.workspace_name}</strong> as a{" "}
                <Badge className={getRoleColor(invitationData?.role)}>
                  {getRoleDisplayName(invitationData?.role)}
                </Badge>
              </p>

              <p className="text-sm text-gray-500 mb-6">
                Please sign in to accept this invitation.
              </p>

              <Button
                onClick={() =>
                  (window.location.href =
                    "/auth/signin?redirect=" +
                    encodeURIComponent(window.location.pathname))
                }
                className="w-full"
              >
                Sign In to Accept
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Join {invitationData?.workspace_name}
              </h1>

              <p className="text-gray-600">
                You've been invited by{" "}
                <strong>{invitationData?.invited_by_email}</strong>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Role:</span>
                <Badge className={getRoleColor(invitationData?.role)}>
                  {getRoleDisplayName(invitationData?.role)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Your email:
                </span>
                <span className="text-sm text-gray-600">
                  {user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAcceptInvitation}
                disabled={isAccepting}
                className="w-full"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  "Accept Invitation"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard")}
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By, accepting, you agree to join this workspace and follow its
              guidelines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
