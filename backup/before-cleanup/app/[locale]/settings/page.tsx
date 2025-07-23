"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileEditor } from "@/components/settings/profile-editor";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { PaymentSettings } from "@/components/settings/payment-settings";
import { AccountDeletion } from "@/components/settings/account-deletion";
import { PrivacySettings } from "@/components/settings/privacy-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Eye,
  Key,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Save,
  RefreshCw,
  Camera,
  Upload,
  Download,
} from "lucide-react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences: {
    theme: string;
    language: string;
    timezone: string;
    currency: string;
  };
}

export default function EnhancedSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "user-123",
    firstName: "Alex",
    lastName: "Chen",
    email: "alex@loconomy.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Tech enthusiast who loves connecting with local service providers. Always looking for reliable help with home projects and professional services.",
    location: {
      address: "123 Tech Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
    },
    preferences: {
      theme: "system",
      language: "en",
      timezone: "America/Los_Angeles",
      currency: "USD",
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    setSaveStatus("saving");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveStatus("saved");
      setHasUnsavedChanges(false);

      // Reset to idle after showing saved status
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      setPendingTab(newTab);
      setShowUnsavedDialog(true);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false);
    setActiveTab(pendingTab);
    setShowUnsavedDialog(false);
    // Reset form data to original values here
  };

  const handleSaveAndContinue = async () => {
    await handleSave();
    setActiveTab(pendingTab);
    setShowUnsavedDialog(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const getSaveStatusInfo = () => {
    switch (saveStatus) {
      case "saving":
        return {
          icon: RefreshCw,
          text: "Saving...",
          className: "text-blue-600 animate-spin",
        };
      case "saved":
        return {
          icon: CheckCircle,
          text: "Saved",
          className: "text-green-600",
        };
      case "error":
        return {
          icon: AlertTriangle,
          text: "Error saving",
          className: "text-red-600",
        };
      default:
        return null;
    }
  };

  const statusInfo = getSaveStatusInfo();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Account Settings</h1>
              <p className="text-muted-foreground">
                Manage your, profile, preferences, and account settings
              </p>
            </div>

            {/* Save Status */}
            <div className="flex items-center gap-4">
              {statusInfo && (
                <div className="flex items-center gap-2 text-sm">
                  <statusInfo.icon
                    className={`w-4 h-4 ${statusInfo.className}`}
                  />
                  <span>{statusInfo.text}</span>
                </div>
              )}

              {hasUnsavedChanges && (
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileEditor
              profile={userProfile}
              onUpdate={updateProfile}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings
              onUpdate={() => setHasUnsavedChanges(true)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <PrivacySettings
              onUpdate={() => setHasUnsavedChanges(true)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings
              onUpdate={() => setHasUnsavedChanges(true)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentSettings
              onUpdate={() => setHasUnsavedChanges(true)}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <AccountDeletion userProfile={userProfile} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        {/* Auto-save indicator */}
        {hasUnsavedChanges && (
          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. They will be saved automatically in a
              few, seconds, or you can save manually.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes on this page. What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
            <Button onClick={handleSaveAndContinue}>Save & Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
