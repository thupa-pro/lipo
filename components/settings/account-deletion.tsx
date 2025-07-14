"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  AlertTriangle,
  Download,
  Clock,
  Shield,
  RefreshCw,
} from "lucide-react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AccountDeletionProps {
  userProfile: UserProfile;
  isLoading: boolean;
}

export function AccountDeletion({
  userProfile,
  isLoading,
}: AccountDeletionProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [acknowledgements, setAcknowledgements] = useState({
    dataLoss: false,
    noRecovery: false,
    activeBookings: false,
    billingSettled: false,
  });
  const [deleteReason, setDeleteReason] = useState("");

  const canProceedWithDeletion =
    deleteConfirmation === "DELETE" &&
    Object.values(acknowledgements).every((ack) => ack) &&
    deleteReason.trim().length > 0;

  const handleAcknowledgement = (key: string, checked: boolean) => {
    setAcknowledgements((prev) => ({ ...prev, [key]: checked }));
  };

  const handleAccountDeletion = async () => {
    // Simulate account deletion process
    console.log("Account deletion initiated");
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Account Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Before deleting your account, you can download a copy of your data.
            This includes your profile information, booking history, messages,
            and more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Personal Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Booking History
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Data exports may take up to 24 hours to process. You'll receive an
              email when your download is ready.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Account Deactivation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Temporarily Deactivate Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you need a break but don't want to permanently delete your
            account, you can deactivate it temporarily. You can reactivate it
            anytime by logging back in.
          </p>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              What happens when you deactivate:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
              <li>Your profile will be hidden from other users</li>
              <li>You won't receive notifications</li>
              <li>Active bookings will remain active</li>
              <li>You can reactivate anytime</li>
            </ul>
          </div>

          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Deactivate Account
          </Button>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Account deletion is permanent and cannot
              be undone. All your data will be permanently removed from our
              servers.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <p className="text-sm font-medium">
              Before you delete your account:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                Complete or cancel all active bookings
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                Settle any outstanding payments or disputes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                Download any data you want to keep
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                Remove or update payment methods linked to subscriptions
              </li>
            </ul>
          </div>

          <Separator />

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please confirm you want to
              permanently delete your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Reason for deletion */}
            <div className="space-y-2">
              <Label htmlFor="deleteReason">
                Why are you deleting your account? (Required)
              </Label>
              <Input
                id="deleteReason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Help us understand..."
              />
            </div>

            {/* Acknowledgements */}
            <div className="space-y-3">
              <Label>Please confirm you understand:</Label>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="dataLoss"
                    checked={acknowledgements.dataLoss}
                    onCheckedChange={(checked) =>
                      handleAcknowledgement("dataLoss", checked as boolean)
                    }
                  />
                  <Label htmlFor="dataLoss" className="text-sm leading-5">
                    All my data will be permanently deleted and cannot be
                    recovered
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="noRecovery"
                    checked={acknowledgements.noRecovery}
                    onCheckedChange={(checked) =>
                      handleAcknowledgement("noRecovery", checked as boolean)
                    }
                  />
                  <Label htmlFor="noRecovery" className="text-sm leading-5">
                    I will not be able to recover my account after deletion
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="activeBookings"
                    checked={acknowledgements.activeBookings}
                    onCheckedChange={(checked) =>
                      handleAcknowledgement(
                        "activeBookings",
                        checked as boolean,
                      )
                    }
                  />
                  <Label htmlFor="activeBookings" className="text-sm leading-5">
                    I have completed or cancelled all active bookings
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="billingSettled"
                    checked={acknowledgements.billingSettled}
                    onCheckedChange={(checked) =>
                      handleAcknowledgement(
                        "billingSettled",
                        checked as boolean,
                      )
                    }
                  />
                  <Label htmlFor="billingSettled" className="text-sm leading-5">
                    All billing matters have been settled
                  </Label>
                </div>
              </div>
            </div>

            {/* Confirmation input */}
            <div className="space-y-2">
              <Label htmlFor="deleteConfirmation">
                Type <strong>DELETE</strong> to confirm:
              </Label>
              <Input
                id="deleteConfirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE here"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleAccountDeletion}
              disabled={!canProceedWithDeletion}
            >
              Delete Account Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
