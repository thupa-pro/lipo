"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  MessageSquare,
  CreditCard,
  Shield,
  Star,
  Calendar,
  Volume2,
  VolumeX,
  Settings,
} from "lucide-react";

interface NotificationSettingsProps {
  onUpdate: () => void;
  isLoading: boolean;
}

interface NotificationPreferences {
  email: {
    bookingConfirmations: boolean;
    serviceReminders: boolean;
    messageNotifications: boolean;
    paymentUpdates: boolean;
    securityAlerts: boolean;
    marketingEmails: boolean;
    weeklyDigest: boolean;
    promotionalOffers: boolean;
  };
  push: {
    enabled: boolean;
    bookingUpdates: boolean;
    messageNotifications: boolean;
    paymentAlerts: boolean;
    securityAlerts: boolean;
    serviceReminders: boolean;
    reviewRequests: boolean;
    promotionalOffers: boolean;
  };
  sms: {
    enabled: boolean;
    urgentOnly: boolean;
    bookingConfirmations: boolean;
    serviceReminders: boolean;
    securityAlerts: boolean;
  };
  frequency: {
    digestFrequency: string;
    reminderTiming: string;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  sound: {
    enabled: boolean;
    volume: number;
    notificationSound: string;
  };
}

export function NotificationSettings({
  onUpdate,
  isLoading,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      bookingConfirmations: true,
      serviceReminders: true,
      messageNotifications: true,
      paymentUpdates: true,
      securityAlerts: true,
      marketingEmails: false,
      weeklyDigest: true,
      promotionalOffers: false,
    },
    push: {
      enabled: true,
      bookingUpdates: true,
      messageNotifications: true,
      paymentAlerts: true,
      securityAlerts: true,
      serviceReminders: true,
      reviewRequests: true,
      promotionalOffers: false,
    },
    sms: {
      enabled: false,
      urgentOnly: true,
      bookingConfirmations: false,
      serviceReminders: false,
      securityAlerts: true,
    },
    frequency: {
      digestFrequency: "weekly",
      reminderTiming: "24h",
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "08:00",
      },
    },
    sound: {
      enabled: true,
      volume: 75,
      notificationSound: "default",
    },
  });

  const updatePreference = (
    category: keyof NotificationPreferences,
    key: string,
    value: any,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    onUpdate();
  };

  const updateNestedPreference = (
    category: keyof NotificationPreferences,
    subCategory: string,
    key: string,
    value: any,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...prev[category][
            subCategory as keyof (typeof prev)[typeof category]
          ],
          [key]: value,
        },
      },
    }));
    onUpdate();
  };

  const testNotification = async () => {
    // Simulate testing a push notification
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Test Notification", {
          body: "This is how your notifications will appear.",
          icon: "/logo.png",
        });
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("Test Notification", {
            body: "This is how your notifications will appear.",
            icon: "/logo.png",
          });
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Email</span>
              </div>
              <Badge
                variant={
                  Object.values(preferences.email).some((v) => v)
                    ? "default"
                    : "secondary"
                }
              >
                {Object.values(preferences.email).filter((v) => v).length}{" "}
                active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-500" />
                <span className="font-medium">Push</span>
              </div>
              <Badge
                variant={preferences.push.enabled ? "default" : "secondary"}
              >
                {preferences.push.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="font-medium">SMS</span>
              </div>
              <Badge
                variant={preferences.sms.enabled ? "default" : "secondary"}
              >
                {preferences.sms.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Service Updates</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking confirmations</Label>
                  <p className="text-sm text-muted-foreground">
                    When your bookings are confirmed or updated
                  </p>
                </div>
                <Switch
                  checked={preferences.email.bookingConfirmations}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "bookingConfirmations", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Service reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders before scheduled services
                  </p>
                </div>
                <Switch
                  checked={preferences.email.serviceReminders}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "serviceReminders", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    New messages from providers
                  </p>
                </div>
                <Switch
                  checked={preferences.email.messageNotifications}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "messageNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Payment confirmations and receipts
                  </p>
                </div>
                <Switch
                  checked={preferences.email.paymentUpdates}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "paymentUpdates", checked)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Account & Marketing</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Important security notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.email.securityAlerts}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "securityAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Summary of your activity and recommendations
                  </p>
                </div>
                <Switch
                  checked={preferences.email.weeklyDigest}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "weeklyDigest", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Product updates and special offers
                  </p>
                </div>
                <Switch
                  checked={preferences.email.marketingEmails}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "marketingEmails", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Promotional offers</Label>
                  <p className="text-sm text-muted-foreground">
                    Discounts and limited-time deals
                  </p>
                </div>
                <Switch
                  checked={preferences.email.promotionalOffers}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "promotionalOffers", checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label>Enable push notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={preferences.push.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("push", "enabled", checked)
                }
              />
              <Button size="sm" variant="outline" onClick={testNotification}>
                Test
              </Button>
            </div>
          </div>

          {preferences.push.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Booking updates</Label>
                  <Switch
                    checked={preferences.push.bookingUpdates}
                    onCheckedChange={(checked) =>
                      updatePreference("push", "bookingUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>New messages</Label>
                  <Switch
                    checked={preferences.push.messageNotifications}
                    onCheckedChange={(checked) =>
                      updatePreference("push", "messageNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Payment alerts</Label>
                  <Switch
                    checked={preferences.push.paymentAlerts}
                    onCheckedChange={(checked) =>
                      updatePreference("push", "paymentAlerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Security alerts</Label>
                  <Switch
                    checked={preferences.push.securityAlerts}
                    onCheckedChange={(checked) =>
                      updatePreference("push", "securityAlerts", checked)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Service reminders</Label>
                  <Switch
                    checked={preferences.push.serviceReminders}
                    onCheckedChange={(checked) =>
                      updatePreference("push", "serviceReminders", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Review requests</Label>
                  <Switch
                    checked={preferences.push.reviewRequests}
                    onCheckedChange={(checked) =>
                      updatePreference("push", "reviewRequests", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Promotional offers</Label>
                  <Switch
                    checked={preferences.push.promotionalOffers}
                    onCheckedChange={(checked) =>
                      updatePreference("push", "promotionalOffers", checked)
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label>Enable SMS notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive text messages for important updates
              </p>
            </div>
            <Switch
              checked={preferences.sms.enabled}
              onCheckedChange={(checked) =>
                updatePreference("sms", "enabled", checked)
              }
            />
          </div>

          {preferences.sms.enabled && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Urgent notifications only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only receive SMS for critical updates
                  </p>
                </div>
                <Switch
                  checked={preferences.sms.urgentOnly}
                  onCheckedChange={(checked) =>
                    updatePreference("sms", "urgentOnly", checked)
                  }
                />
              </div>

              {!preferences.sms.urgentOnly && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Booking confirmations</Label>
                    <Switch
                      checked={preferences.sms.bookingConfirmations}
                      onCheckedChange={(checked) =>
                        updatePreference("sms", "bookingConfirmations", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Service reminders</Label>
                    <Switch
                      checked={preferences.sms.serviceReminders}
                      onCheckedChange={(checked) =>
                        updatePreference("sms", "serviceReminders", checked)
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Security alerts</Label>
                <Switch
                  checked={preferences.sms.securityAlerts}
                  onCheckedChange={(checked) =>
                    updatePreference("sms", "securityAlerts", checked)
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frequency & Timing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Frequency & Timing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Digest frequency</Label>
              <Select
                value={preferences.frequency.digestFrequency}
                onValueChange={(value) =>
                  updatePreference("frequency", "digestFrequency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reminder timing</Label>
              <Select
                value={preferences.frequency.reminderTiming}
                onValueChange={(value) =>
                  updatePreference("frequency", "reminderTiming", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour before</SelectItem>
                  <SelectItem value="24h">24 hours before</SelectItem>
                  <SelectItem value="48h">48 hours before</SelectItem>
                  <SelectItem value="week">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Quiet hours</Label>
                <p className="text-sm text-muted-foreground">
                  Disable non-urgent notifications during these hours
                </p>
              </div>
              <Switch
                checked={preferences.frequency.quietHours.enabled}
                onCheckedChange={(checked) =>
                  updateNestedPreference(
                    "frequency",
                    "quietHours",
                    "enabled",
                    checked,
                  )
                }
              />
            </div>

            {preferences.frequency.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start time</Label>
                  <Select
                    value={preferences.frequency.quietHours.start}
                    onValueChange={(value) =>
                      updateNestedPreference(
                        "frequency",
                        "quietHours",
                        "start",
                        value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>End time</Label>
                  <Select
                    value={preferences.frequency.quietHours.end}
                    onValueChange={(value) =>
                      updateNestedPreference(
                        "frequency",
                        "quietHours",
                        "end",
                        value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable notification sounds</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for push notifications
              </p>
            </div>
            <Switch
              checked={preferences.sound.enabled}
              onCheckedChange={(checked) =>
                updatePreference("sound", "enabled", checked)
              }
            />
          </div>

          {preferences.sound.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Notification sound</Label>
                <Select
                  value={preferences.sound.notificationSound}
                  onValueChange={(value) =>
                    updatePreference("sound", "notificationSound", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="ping">Ping</SelectItem>
                    <SelectItem value="none">Silent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Volume: {preferences.sound.volume}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.sound.volume}
                  onChange={(e) =>
                    updatePreference(
                      "sound",
                      "volume",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
