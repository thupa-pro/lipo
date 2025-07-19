"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  CreditCard,
  Plus,
  Trash2,
  Shield,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Wallet,
  Landmark,
  Smartphone,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type:
    | "credit_card"
    | "debit_card"
    | "bank_account"
    | "paypal"
    | "apple_pay"
    | "google_pay";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  nickname?: string;
  bankName?: string;
  accountType?: string;
}

interface PaymentSettingsProps {
  onUpdate: () => void;
  isLoading: boolean;
}

export function PaymentSettings({ onUpdate, isLoading }: PaymentSettingsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "credit_card",
      brand: "visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
      nickname: "Primary Card",
    },
    {
      id: "pm_2",
      type: "bank_account",
      last4: "1234",
      bankName: "Chase Bank",
      accountType: "checking",
      isDefault: false,
      nickname: "Main Checking",
    },
    {
      id: "pm_3",
      type: "paypal",
      last4: "john@example.com",
      isDefault: false,
    },
  ]);

  const [billingSettings, setBillingSettings] = useState({
    autoPayEnabled: true,
    spendingLimit: 500,
    spendingLimitEnabled: true,
    currency: "USD",
    taxCalculation: true,
    receiptsEmail: true,
    monthlyStatements: true,
    lowBalanceAlerts: true,
    lowBalanceThreshold: 50,
  });

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [showCardDetails, setShowCardDetails] = useState<
    Record<string, boolean>
  >({});

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="w-4 h-4" />;
      case "bank_account":
        return <Landmark className="w-4 h-4" />;
      case "paypal":
        return <Wallet className="w-4 h-4" />;
      case "apple_pay":
      case "google_pay":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    switch (method.type) {
      case "credit_card":
      case "debit_card":
        return `${method.brand?.toUpperCase()} •••• ${method.last4}`;
      case "bank_account":
        return `${method.bankName} •••• ${method.last4}`;
      case "paypal":
        return `PayPal (${method.last4})`;
      case "apple_pay":
        return "Apple Pay";
      case "google_pay":
        return "Google Pay";
      default:
        return `•••• ${method.last4}`;
    }
  };

  const setDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    );
    onUpdate();
  };

  const deletePaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.filter((method) => method.id !== methodId),
    );
    setShowDeleteDialog(false);
    setSelectedPaymentMethod(null);
    onUpdate();
  };

  const updateBillingSetting = (key: string, value: any) => {
    setBillingSettings((prev) => ({ ...prev, [key]: value }));
    onUpdate();
  };

  const toggleCardDetails = (methodId: string) => {
    setShowCardDetails((prev) => ({ ...prev, [methodId]: !prev[methodId] }));
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
            <Button
              onClick={() => setShowAddPayment(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  {getPaymentMethodIcon(method.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {getPaymentMethodDisplay(method)}
                    </p>
                    {method.isDefault && (
                      <Badge variant="default">Default</Badge>
                    )}
                  </div>
                  {method.nickname && (
                    <p className="text-sm text-muted-foreground">
                      {method.nickname}
                    </p>
                  )}
                  {(method.type === "credit_card" ||
                    method.type === "debit_card") && (
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(method.type === "credit_card" ||
                  method.type === "debit_card") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCardDetails(method.id)}
                  >
                    {showCardDetails[method.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                )}

                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDefaultPaymentMethod(method.id)}
                  >
                    Set Default
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPaymentMethod(method.id);
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {paymentMethods.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payment methods added yet</p>
              <Button onClick={() => setShowAddPayment(true)} className="mt-2">
                Add Your First Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-Pay Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Auto-Pay Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable auto-pay</Label>
              <p className="text-sm text-muted-foreground">
                Automatically pay for completed services using your default
                payment method
              </p>
            </div>
            <Switch
              checked={billingSettings.autoPayEnabled}
              onCheckedChange={(checked) =>
                updateBillingSetting("autoPayEnabled", checked)
              }
            />
          </div>

          {billingSettings.autoPayEnabled && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Auto-pay is enabled. Services will be automatically charged to
                your default payment method upon completion.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Spending Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Spending Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Monthly spending limit</Label>
              <p className="text-sm text-muted-foreground">
                Set a maximum amount you can spend per month
              </p>
            </div>
            <Switch
              checked={billingSettings.spendingLimitEnabled}
              onCheckedChange={(checked) =>
                updateBillingSetting("spendingLimitEnabled", checked)
              }
            />
          </div>

          {billingSettings.spendingLimitEnabled && (
            <div className="space-y-2">
              <Label htmlFor="spendingLimit">Spending limit amount</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="spendingLimit"
                  type="number"
                  value={billingSettings.spendingLimit}
                  onChange={(e) =>
                    updateBillingSetting(
                      "spendingLimit",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">per month</span>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low balance alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your account balance is low
              </p>
            </div>
            <Switch
              checked={billingSettings.lowBalanceAlerts}
              onCheckedChange={(checked) =>
                updateBillingSetting("lowBalanceAlerts", checked)
              }
            />
          </div>

          {billingSettings.lowBalanceAlerts && (
            <div className="space-y-2">
              <Label htmlFor="lowBalanceThreshold">Alert threshold</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="lowBalanceThreshold"
                  type="number"
                  value={billingSettings.lowBalanceThreshold}
                  onChange={(e) =>
                    updateBillingSetting(
                      "lowBalanceThreshold",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-32"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Billing Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={billingSettings.currency}
                onValueChange={(value) =>
                  updateBillingSetting("currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">🇪🇺 Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">🇬🇧 British Pound (GBP)</SelectItem>
                  <SelectItem value="CAD">🇨🇦 Canadian Dollar (CAD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email receipts</Label>
                <Switch
                  checked={billingSettings.receiptsEmail}
                  onCheckedChange={(checked) =>
                    updateBillingSetting("receiptsEmail", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Monthly statements</Label>
                <Switch
                  checked={billingSettings.monthlyStatements}
                  onCheckedChange={(checked) =>
                    updateBillingSetting("monthlyStatements", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Tax calculation</Label>
                <Switch
                  checked={billingSettings.taxCalculation}
                  onCheckedChange={(checked) =>
                    updateBillingSetting("taxCalculation", checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Payment Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">PCI DSS compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Two-factor authentication</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Fraud monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Secure tokenization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Regular security audits</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Choose a payment method to add to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="w-6 h-6 mb-2" />
              Credit/Debit Card
            </Button>
            <Button variant="outline" className="h-20 flex-col">
                                <Landmark className="w-6 h-6 mb-2" />
              Bank Account
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Wallet className="w-6 h-6 mb-2" />
              PayPal
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Smartphone className="w-6 h-6 mb-2" />
              Digital Wallet
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPayment(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Method Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedPaymentMethod &&
                deletePaymentMethod(selectedPaymentMethod)
              }
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
