import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Download, Upload, AlertTriangle
  Bell, Smartphone, Globe, Database, FileText, UserCheck, Key, Fingerprint, Wifi, Monitor, HardDrive, Cloud, Activity, BarChart3, Camera, Mic, CreditCard, MessageSquare
  Bookmark, Filter, Sliders, Palette, Volume2
  RefreshCw, Power
  XCircle, Info, Plus, Minus, Edit, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PrivacySettings {
  profileVisibility: "public" | "verified" | "private";
  showLocation: boolean;
  showContactInfo: boolean;
  showRatings: boolean;
  showReviews: boolean;
  allowMessages: "everyone" | "verified" | "customers" | "none";
  allowBookings: "everyone" | "verified" | "none";
  dataSharing: boolean;
  analyticsTracking: boolean;
  marketingEmails: boolean;
  thirdPartyIntegrations: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricLogin: boolean;
  sessionTimeout: number; // minutes
  loginNotifications: boolean;
  deviceManagement: boolean;
  apiKeyAccess: boolean;
  passwordExpiry: number; // days
  requiredPasswordStrength: "low" | "medium" | "high";
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    payments: boolean;
    marketing: boolean;
    digest: "daily" | "weekly" | "monthly" | "none";
  };
  push: {
    enabled: boolean;
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    payments: boolean;
    location: boolean;
  };
  sms: {
    enabled: boolean;
    bookings: boolean;
    payments: boolean;
    security: boolean;
  };
}

interface DataSettings {
  exportFormat: "json" | "csv" | "pdf";
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  dataRetention: number; // days
  deleteInactiveData: boolean;
  shareAnalytics: boolean;
}

interface DisplaySettings {
  theme: "light" | "dark" | "system";
  compactMode: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  itemsPerPage: number;
  defaultView: "grid" | "list";
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: Date;
  expiresAt: Date;
  isActive: boolean;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: "mobile" | "desktop" | "tablet";
  browser: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

export default function AdvancedSettings() {
  const [activeTab, setActiveTab] = useState("privacy");
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showLocation: true,
    showContactInfo: false,
    showRatings: true,
    showReviews: true,
    allowMessages: "verified",
    allowBookings: "everyone",
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,
    thirdPartyIntegrations: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    biometricLogin: false,
    sessionTimeout: 30,
    loginNotifications: true,
    deviceManagement: true,
    apiKeyAccess: false,
    passwordExpiry: 90,
    requiredPasswordStrength: "medium",
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      bookings: true,
      messages: true,
      reviews: true,
      payments: true,
      marketing: false,
      digest: "weekly",
    },
    push: {
      enabled: true,
      bookings: true,
      messages: true,
      reviews: false,
      payments: true,
      location: false,
    },
    sms: {
      enabled: false,
      bookings: false,
      payments: true,
      security: true,
    },
  });

  const [dataSettings, setDataSettings] = useState<DataSettings>({
    exportFormat: "json",
    autoBackup: true,
    backupFrequency: "weekly",
    dataRetention: 365,
    deleteInactiveData: false,
    shareAnalytics: true,
  });

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: "system",
    compactMode: false,
    showTooltips: true,
    animationsEnabled: true,
    soundEnabled: true,
    autoRefresh: true,
    refreshInterval: 30,
    itemsPerPage: 20,
    defaultView: "grid",
  });

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Mobile App Integration",
      key: "ak_live_1234567890abcdef",
      permissions: ["read:profile", "write:bookings"],
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: "2", 
      name: "Analytics Dashboard",
      key: "ak_live_fedcba0987654321",
      permissions: ["read:analytics", "read:bookings"],
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: false,
    },
  ]);

  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([
    {
      id: "1",
      name: "iPhone 14 Pro",
      type: "mobile",
      browser: "Safari 17.0",
      location: "New, York, NY",
      lastActive: new Date(),
      isCurrent: true,
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "desktop", 
      browser: "Chrome 119.0",
      location: "New, York, NY",
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      isCurrent: false,
    },
    {
      id: "3",
      name: "iPad Air",
      type: "tablet",
      browser: "Safari 17.0",
      location: "Boston, MA",
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isCurrent: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExportData = async () => {
    setIsLoading(true);
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowExportDialog(false);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowDeleteDialog(false);
  };

  const generateApiKey = () => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: "New API Key",
      key: `ak_live_${Math.random().toString(36).substring(2, 18)}`,
      permissions: ["read:profile"],
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  const revokeApiKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  const disconnectDevice = (deviceId: string) => {
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Settings</h1>
          <p className="text-muted-foreground">
            Manage, privacy, security, notifications, and platform preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <UIIcons.CheckCircle className="w-4 h-4 mr-2" />}
            Save All Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <OptimizedIcon name="Shield" className="w-5 h-5" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Profile Visibility</Label>
                  <Select 
                    value={privacySettings.profileVisibility} 
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span>Public - Anyone can see</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="verified">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>Verified Users Only</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>Private - Hidden</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Message Permissions</Label>
                  <Select 
                    value={privacySettings.allowMessages} 
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, allowMessages: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="verified">Verified Users</SelectItem>
                      <SelectItem value="customers">Customers Only</SelectItem>
                      <SelectItem value="none">No One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Profile Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BusinessIcons.MapPin className="w-4 h-4" />
                      <Label>Show Location</Label>
                    </div>
                    <Switch
                      checked={privacySettings.showLocation}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showLocation: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <OptimizedIcon name="Mail" className="w-4 h-4" />
                      <Label>Show Contact Info</Label>
                    </div>
                    <Switch
                      checked={privacySettings.showContactInfo}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showContactInfo: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <OptimizedIcon name="Star" className="w-4 h-4" />
                      <Label>Show Ratings</Label>
                    </div>
                    <Switch
                      checked={privacySettings.showRatings}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showRatings: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <Label>Show Reviews</Label>
                    </div>
                    <Switch
                      checked={privacySettings.showReviews}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showReviews: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data & Analytics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Share Anonymous Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help improve the platform</p>
                    </div>
                    <Switch
                      checked={privacySettings.analyticsTracking}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, analyticsTracking: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Third-party Integrations</Label>
                      <p className="text-sm text-muted-foreground">Allow data sharing with partners</p>
                    </div>
                    <Switch
                      checked={privacySettings.thirdPartyIntegrations}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, thirdPartyIntegrations: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Extra security for your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Biometric Login</Label>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                  </div>
                  <Switch
                    checked={securitySettings.biometricLogin}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, biometricLogin: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Session Management</h4>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Session Timeout: {securitySettings.sessionTimeout} minutes
                  </Label>
                  <Slider
                    value={[securitySettings.sessionTimeout]}
                    onValueChange={([value]) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))}
                    min={15}
                    max={480}
                    step={15}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Connected Devices</h4>
                <div className="space-y-3">
                  {connectedDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {device.type === "mobile" && <Smartphone className="w-5 h-5" />}
                          {device.type === "desktop" && <Monitor className="w-5 h-5" />}
                          {device.type === "tablet" && <Smartphone className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{device.name}</h5>
                            {device.isCurrent && <Badge variant="default">Current</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {device.browser} • {device.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last active: {device.lastActive.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!device.isCurrent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => disconnectDevice(device.id)}
                        >
                          Disconnect
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Keys
                </CardTitle>
                <Button onClick={generateApiKey}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{apiKey.name}</h5>
                        <Badge className={apiKey.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {apiKey.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm font-mono text-muted-foreground mb-2">
                        {apiKey.key}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Last used: {apiKey.lastUsed.toLocaleDateString()}</span>
                        <span>Expires: {apiKey.expiresAt.toLocaleDateString()}</span>
                        <span>Permissions: {apiKey.permissions.join(", ")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => revokeApiKey(apiKey.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <OptimizedIcon name="Mail" className="w-4 h-4" />
                    Email Notifications
                  </h4>
                  <Switch
                    checked={notificationSettings.email.enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                {notificationSettings.email.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    {Object.entries(notificationSettings.email)
                      .filter(([key]) => key !== "enabled" && key !== "digest")
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="capitalize">{key}</Label>
                          <Switch
                            checked={value as boolean}
                            onCheckedChange={(checked) =>
                              setNotificationSettings(prev => ({
                                ...prev,
                                email: { ...prev.email, [key]: checked }
                              }))
                            }
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Push Notifications
                  </h4>
                  <Switch
                    checked={notificationSettings.push.enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev,
                        push: { ...prev.push, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                {notificationSettings.push.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    {Object.entries(notificationSettings.push)
                      .filter(([key]) => key !== "enabled")
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="capitalize">{key}</Label>
                          <Switch
                            checked={value as boolean}
                            onCheckedChange={(checked) =>
                              setNotificationSettings(prev => ({
                                ...prev,
                                push: { ...prev.push, [key]: checked }
                              }))
                            }
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* SMS Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    SMS Notifications
                  </h4>
                  <Switch
                    checked={notificationSettings.sms.enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({
                        ...prev,
                        sms: { ...prev.sms, enabled: checked }
                      }))
                    }
                  />
                </div>
                
                {notificationSettings.sms.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    {Object.entries(notificationSettings.sms)
                      .filter(([key]) => key !== "enabled")
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="capitalize">{key}</Label>
                          <Switch
                            checked={value as boolean}
                            onCheckedChange={(checked) =>
                              setNotificationSettings(prev => ({
                                ...prev,
                                sms: { ...prev.sms, [key]: checked }
                              }))
                            }
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Data Export</h4>
                <div className="flex items-center gap-4">
                  <Select 
                    value={dataSettings.exportFormat} 
                    onValueChange={(value) => setDataSettings(prev => ({ ...prev, exportFormat: value as any }))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Export My Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Your Data</DialogTitle>
                        <DialogDescription>
                          This will create a downloadable file containing all your personal data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleExportData} disabled={isLoading}>
                          {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                          Export
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Automatic Backup</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                  </div>
                  <Switch
                    checked={dataSettings.autoBackup}
                    onCheckedChange={(checked) => setDataSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>
                
                {dataSettings.autoBackup && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Backup Frequency</Label>
                    <Select 
                      value={dataSettings.backupFrequency} 
                      onValueChange={(value) => setDataSettings(prev => ({ ...prev, backupFrequency: value as any }))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These actions are irreversible. Please proceed with caution.
                  </AlertDescription>
                </Alert>
                
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
                        {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Theme</Label>
                  <Select 
                    value={displaySettings.theme} 
                    onValueChange={(value) => setDisplaySettings(prev => ({ ...prev, theme: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Default View</Label>
                  <Select 
                    value={displaySettings.defaultView} 
                    onValueChange={(value) => setDisplaySettings(prev => ({ ...prev, defaultView: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid View</SelectItem>
                      <SelectItem value="list">List View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Interface Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Compact Mode</Label>
                    <Switch
                      checked={displaySettings.compactMode}
                      onCheckedChange={(checked) => setDisplaySettings(prev => ({ ...prev, compactMode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Show Tooltips</Label>
                    <Switch
                      checked={displaySettings.showTooltips}
                      onCheckedChange={(checked) => setDisplaySettings(prev => ({ ...prev, showTooltips: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Animations</Label>
                    <Switch
                      checked={displaySettings.animationsEnabled}
                      onCheckedChange={(checked) => setDisplaySettings(prev => ({ ...prev, animationsEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Sound Effects</Label>
                    <Switch
                      checked={displaySettings.soundEnabled}
                      onCheckedChange={(checked) => setDisplaySettings(prev => ({ ...prev, soundEnabled: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Performance</h4>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Items per page: {displaySettings.itemsPerPage}
                  </Label>
                  <Slider
                    value={[displaySettings.itemsPerPage]}
                    onValueChange={([value]) => setDisplaySettings(prev => ({ ...prev, itemsPerPage: value }))}
                    min={10}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh data</p>
                  </div>
                  <Switch
                    checked={displaySettings.autoRefresh}
                    onCheckedChange={(checked) => setDisplaySettings(prev => ({ ...prev, autoRefresh: checked }))}
                  />
                </div>

                {displaySettings.autoRefresh && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Refresh interval: {displaySettings.refreshInterval}s
                    </Label>
                    <Slider
                      value={[displaySettings.refreshInterval]}
                      onValueChange={([value]) => setDisplaySettings(prev => ({ ...prev, refreshInterval: value }))}
                      min={10}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}