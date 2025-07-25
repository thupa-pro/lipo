"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  MapPin,
  Users,
  Activity,
  Download,
  Shield,
  Trash2
} from "lucide-react";

interface PrivacySettingsProps {
  onUpdate: () => void;
  isLoading: boolean;
}

export function PrivacySettings({ onUpdate, isLoading }: PrivacySettingsProps) {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "providers",
    locationSharing: true,
    activityTracking: true,
    dataCollection: true,
    personalizedAds: false,
    thirdPartySharing: false,
    searchEngineIndexing: false,
    publicProfile: false,
  });

  const updateSetting = (key: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }));
    onUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Profile Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile visibility</Label>
              <p className="text-sm text-muted-foreground">
                Control who can see your profile information
              </p>
            </div>
            <Select
              value={privacySettings.profileVisibility}
              onValueChange={(value) =>
                updateSetting("profileVisibility", value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="providers">Providers only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public profile</Label>
              <p className="text-sm text-muted-foreground">
                Allow your profile to appear in search results
              </p>
            </div>
            <Switch
              checked={privacySettings.publicProfile}
              onCheckedChange={(checked) =>
                updateSetting("publicProfile", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Search engine indexing</Label>
              <p className="text-sm text-muted-foreground">
                Allow search engines to index your public profile
              </p>
            </div>
            <Switch
              checked={privacySettings.searchEngineIndexing}
              onCheckedChange={(checked) =>
                updateSetting("searchEngineIndexing", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Location & Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location & Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Location sharing</Label>
              <p className="text-sm text-muted-foreground">
                Share your location with service providers
              </p>
            </div>
            <Switch
              checked={privacySettings.locationSharing}
              onCheckedChange={(checked) =>
                updateSetting("locationSharing", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Activity tracking</Label>
              <p className="text-sm text-muted-foreground">
                Help us improve our service with usage analytics
              </p>
            </div>
            <Switch
              checked={privacySettings.activityTracking}
              onCheckedChange={(checked) =>
                updateSetting("activityTracking", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data collection</Label>
              <p className="text-sm text-muted-foreground">
                Allow collection of performance and usage data
              </p>
            </div>
            <Switch
              checked={privacySettings.dataCollection}
              onCheckedChange={(checked) =>
                updateSetting("dataCollection", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Advertising & Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Advertising & Marketing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Personalized ads</Label>
              <p className="text-sm text-muted-foreground">
                Show ads based on your interests and activity
              </p>
            </div>
            <Switch
              checked={privacySettings.personalizedAds}
              onCheckedChange={(checked) =>
                updateSetting("personalizedAds", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Third-party sharing</Label>
              <p className="text-sm text-muted-foreground">
                Share anonymized data with trusted partners
              </p>
            </div>
            <Switch
              checked={privacySettings.thirdPartySharing}
              onCheckedChange={(checked) =>
                updateSetting("thirdPartySharing", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download your data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Request data deletion
            </Button>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Your data rights:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to delete your data</li>
              <li>Right to data portability</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
