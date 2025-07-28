import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Bell, FileText, ExternalLink, Save, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { billingClient } from "@/lib/billing/utils";

interface BillingSettings {
  emailNotifications: {
    invoices: boolean;
    paymentFailed: boolean;
    subscriptionChanges: boolean;
    usageAlerts: boolean;
  };
  invoiceSettings: {
    companyName: string;
    taxId: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    memo: string;
  };
  paymentSettings: {
    autoRetry: boolean;
    retryAttempts: number;
    currency: string;
  };
  usageAlerts: {
    enabled: boolean;
    threshold: number;
    criticalThreshold: number;
  };
}

export function BillingSettings() {
  const [settings, setSettings] = useState<BillingSettings>({
    emailNotifications: {
      invoices: true,
      paymentFailed: true,
      subscriptionChanges: true,
      usageAlerts: true,
    },
    invoiceSettings: {
      companyName: "",
      taxId: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
      },
      memo: "",
    },
    paymentSettings: {
      autoRetry: true,
      retryAttempts: 3,
      currency: "USD",
    },
    usageAlerts: {
      enabled: true,
      threshold: 80,
      criticalThreshold: 95,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // In a real, implementation, this would load from the API
      // const response = await billingClient.getBillingSettings();
      // if (response.success) {
      //   setSettings(response.data);
      // }
    } catch (error) {
      console.error("Error loading billing settings:", error);
      toast.error("Failed to load billing settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real, implementation, this would save to the API
      // const response = await billingClient.updateBillingSettings(settings);
      // if (response.success) {
      //   toast.success('Billing settings saved successfully');
      //   setIsDirty(false);
      // } else {
      //   toast.error(response.error || 'Failed to save settings');
      // }

      // Mock success for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Billing settings saved successfully");
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving billing settings:", error);
      toast.error("Failed to save billing settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let current = newSettings as any;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      setIsDirty(true);
      return newSettings;
    });
  };

  const openCustomerPortal = async () => {
    try {
      const response = await billingClient.createPortalSession();
      if (response.success && response.data) {
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to open customer portal");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open customer portal");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Billing Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your billing preferences and invoice details
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isDirty && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={openCustomerPortal}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Customer Portal
          </Button>
        </div>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose which billing events you'd like to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Invoice Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new invoices are generated
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.invoices}
              onCheckedChange={(checked) =>
                updateSettings("emailNotifications.invoices", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Payment Failed Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when payments fail or are declined
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.paymentFailed}
              onCheckedChange={(checked) =>
                updateSettings("emailNotifications.paymentFailed", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Subscription Changes</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about plan, upgrades, downgrades, and cancellations
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.subscriptionChanges}
              onCheckedChange={(checked) =>
                updateSettings(
                  "emailNotifications.subscriptionChanges",
                  checked,
                )
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Usage Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you approach your usage limits
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.usageAlerts}
              onCheckedChange={(checked) =>
                updateSettings("emailNotifications.usageAlerts", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Settings
          </CardTitle>
          <CardDescription>
            Customize the information that appears on your invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.invoiceSettings.companyName}
                onChange={(e) =>
                  updateSettings("invoiceSettings.companyName", e.target.value)
                }
                placeholder="Acme Corporation"
              />
            </div>

            <div>
              <Label htmlFor="taxId">Tax ID / VAT Number</Label>
              <Input
                id="taxId"
                value={settings.invoiceSettings.taxId}
                onChange={(e) =>
                  updateSettings("invoiceSettings.taxId", e.target.value)
                }
                placeholder="123-45-6789"
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-medium">Billing Address</Label>
            <div className="grid gap-4 mt-2">
              <div>
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  value={settings.invoiceSettings.address.line1}
                  onChange={(e) =>
                    updateSettings(
                      "invoiceSettings.address.line1",
                      e.target.value,
                    )
                  }
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  value={settings.invoiceSettings.address.line2}
                  onChange={(e) =>
                    updateSettings(
                      "invoiceSettings.address.line2",
                      e.target.value,
                    )
                  }
                  placeholder="Suite 100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={settings.invoiceSettings.address.city}
                    onChange={(e) =>
                      updateSettings(
                        "invoiceSettings.address.city",
                        e.target.value,
                      )
                    }
                    placeholder="New York"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={settings.invoiceSettings.address.state}
                    onChange={(e) =>
                      updateSettings(
                        "invoiceSettings.address.state",
                        e.target.value,
                      )
                    }
                    placeholder="NY"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={settings.invoiceSettings.address.postalCode}
                    onChange={(e) =>
                      updateSettings(
                        "invoiceSettings.address.postalCode",
                        e.target.value,
                      )
                    }
                    placeholder="10001"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={settings.invoiceSettings.address.country}
                  onValueChange={(value) =>
                    updateSettings("invoiceSettings.address.country", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="memo">Invoice Memo</Label>
            <Textarea
              id="memo"
              value={settings.invoiceSettings.memo}
              onChange={(e) =>
                updateSettings("invoiceSettings.memo", e.target.value)
              }
              placeholder="Add a custom note that will appear on all invoices..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BusinessIcons.DollarSign className="h-5 w-5" />
            Payment Settings
          </CardTitle>
          <CardDescription>
            Configure how payments are processed and retried
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Automatic Payment Retry</Label>
              <p className="text-sm text-muted-foreground">
                Automatically retry failed payments
              </p>
            </div>
            <Switch
              checked={settings.paymentSettings.autoRetry}
              onCheckedChange={(checked) =>
                updateSettings("paymentSettings.autoRetry", checked)
              }
            />
          </div>

          {settings.paymentSettings.autoRetry && (
            <>
              <Separator />
              <div>
                <Label htmlFor="retryAttempts">Maximum Retry Attempts</Label>
                <Select
                  value={settings.paymentSettings.retryAttempts.toString()}
                  onValueChange={(value) =>
                    updateSettings(
                      "paymentSettings.retryAttempts",
                      parseInt(value),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 attempt</SelectItem>
                    <SelectItem value="2">2 attempts</SelectItem>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Separator />

          <div>
            <Label htmlFor="currency">Billing Currency</Label>
            <Select
              value={settings.paymentSettings.currency}
              onValueChange={(value) =>
                updateSettings("paymentSettings.currency", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Usage Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Usage Alerts
          </CardTitle>
          <CardDescription>
            Get notified when you approach your usage limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Usage Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about high usage
              </p>
            </div>
            <Switch
              checked={settings.usageAlerts.enabled}
              onCheckedChange={(checked) =>
                updateSettings("usageAlerts.enabled", checked)
              }
            />
          </div>

          {settings.usageAlerts.enabled && (
            <>
              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="threshold">Warning Threshold (%)</Label>
                  <Select
                    value={settings.usageAlerts.threshold.toString()}
                    onValueChange={(value) =>
                      updateSettings("usageAlerts.threshold", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get a warning when usage reaches this level
                  </p>
                </div>

                <div>
                  <Label htmlFor="criticalThreshold">
                    Critical Threshold (%)
                  </Label>
                  <Select
                    value={settings.usageAlerts.criticalThreshold.toString()}
                    onValueChange={(value) =>
                      updateSettings(
                        "usageAlerts.criticalThreshold",
                        parseInt(value),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="98">98%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get urgent alerts when usage reaches this level
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <OptimizedIcon name="Shield" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Data Security</h4>
              <p className="text-sm text-blue-700">
                All billing information is encrypted and securely stored. We
                comply with PCI DSS standards and never store sensitive payment
                information on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
