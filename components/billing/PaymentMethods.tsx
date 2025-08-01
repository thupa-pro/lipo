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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CreditCard, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { billingClient } from "@/lib/billing/utils";
import type {
  PaymentMethod,
  CreatePaymentMethodForm,
} from "@/lib/billing/types";

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onUpdate: () => void;
}

export function PaymentMethods({
  paymentMethods,
  onUpdate,
}: PaymentMethodsProps) {
  const [loading, setLoading] = useState(false);
  const [addingMethod, setAddingMethod] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] =
    useState<CreatePaymentMethodForm>({
      type: "card",
      card: {
        number: "",
        expMonth: 1,
        expYear: new Date().getFullYear(),
        cvc: "",
      },
      billingDetails: {
        name: "",
        email: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "US",
        },
      },
    });

  const handleAddPaymentMethod = async () => {
    setAddingMethod(true);
    try {
      const response = await billingClient.addPaymentMethod(newPaymentMethod);
      if (response.success) {
        setShowAddDialog(false);
        onUpdate();
        toast.success("Payment method added successfully");
        // Reset form
        setNewPaymentMethod({
          type: "card",
          card: {
            number: "",
            expMonth: 1,
            expYear: new Date().getFullYear(),
            cvc: "",
          },
          billingDetails: {
            name: "",
            email: "",
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              postalCode: "",
              country: "US",
            },
          },
        });
      } else {
        toast.error(response.error || "Failed to add payment method");
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("Failed to add payment method");
    } finally {
      setAddingMethod(false);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    setLoading(true);
    try {
      const response = await billingClient.removePaymentMethod(paymentMethodId);
      if (response.success) {
        onUpdate();
        toast.success("Payment method removed");
      } else {
        toast.error(response.error || "Failed to remove payment method");
      }
    } catch (error) {
      console.error("Error removing payment method:", error);
      toast.error("Failed to remove payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    setLoading(true);
    try {
      const response =
        await billingClient.setDefaultPaymentMethod(paymentMethodId);
      if (response.success) {
        onUpdate();
        toast.success("Default payment method updated");
      } else {
        toast.error(response.error || "Failed to set default payment method");
      }
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error("Failed to set default payment method");
    } finally {
      setLoading(false);
    }
  };

  const getCardBrand = (brand: string) => {
    const brands: Record<string, { name: string; color: string }> = {
      visa: { name: "Visa", color: "bg-blue-600" },
      mastercard: { name: "Mastercard", color: "bg-red-600" },
      amex: { name: "American Express", color: "bg-green-600" },
      discover: { name: "Discover", color: "bg-orange-600" },
      diners: { name: "Diners Club", color: "bg-purple-600" },
      jcb: { name: "JCB", color: "bg-indigo-600" },
      unionpay: { name: "UnionPay", color: "bg-red-700" },
    };
    return brands[brand] || { name: brand.toUpperCase(), color: "bg-gray-600" };
  };

  const formatCardNumber = (number: string) => {
    return number
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const isCardExpired = (expMonth: number, expYear: number) => {
    const now = new Date();
    const expiry = new Date(expYear, expMonth - 1);
    return expiry < now;
  };

  const isCardExpiringSoon = (expMonth: number, expYear: number) => {
    const now = new Date();
    const expiry = new Date(expYear, expMonth - 1);
    const threeMonthsFromNow = new Date(
      now.getFullYear(),
      now.getMonth() + 3,
      now.getDate(),
    );
    return expiry <= threeMonthsFromNow && expiry >= now;
  };

  // Find default payment method (simplified - in real app would come from API)
  const defaultPaymentMethodId =
    paymentMethods.length > 0 ? paymentMethods[0].id : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <p className="text-sm text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new credit or debit card to your account
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Card Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(newPaymentMethod.card.number)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, "");
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        card: { ...prev.card, number: value },
                      }));
                    }}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expMonth">Month</Label>
                    <Select
                      value={newPaymentMethod.card.expMonth.toString()}
                      onValueChange={(value) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          card: { ...prev.card, expMonth: parseInt(value) },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expYear">Year</Label>
                    <Select
                      value={newPaymentMethod.card.expYear.toString()}
                      onValueChange={(value) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          card: { ...prev.card, expYear: parseInt(value) },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() + i,
                        ).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={newPaymentMethod.card.cvc}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          card: { ...prev.card, cvc: e.target.value },
                        }))
                      }
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              {/* Billing Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Billing Information</h4>

                <div>
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newPaymentMethod.billingDetails.name}
                    onChange={(e) =>
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        billingDetails: {
                          ...prev.billingDetails,
                          name: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={newPaymentMethod.billingDetails.email}
                    onChange={(e) =>
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        billingDetails: {
                          ...prev.billingDetails,
                          email: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={newPaymentMethod.billingDetails.address?.line1}
                    onChange={(e) =>
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        billingDetails: {
                          ...prev.billingDetails,
                          address: {
                            ...prev.billingDetails.address!,
                            line1: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={newPaymentMethod.billingDetails.address?.city}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          billingDetails: {
                            ...prev.billingDetails,
                            address: {
                              ...prev.billingDetails.address!,
                              city: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={newPaymentMethod.billingDetails.address?.state}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          billingDetails: {
                            ...prev.billingDetails,
                            address: {
                              ...prev.billingDetails.address!,
                              state: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="10001"
                    value={newPaymentMethod.billingDetails.address?.postalCode}
                    onChange={(e) =>
                      setNewPaymentMethod((prev) => ({
                        ...prev,
                        billingDetails: {
                          ...prev.billingDetails,
                          address: {
                            ...prev.billingDetails.address!,
                            postalCode: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPaymentMethod} disabled={addingMethod}>
                {addingMethod ? "Adding..." : "Add Payment Method"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No payment methods</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add a payment method to start managing your subscriptions
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          paymentMethods.map((method) => {
            const cardBrand = method.card
              ? getCardBrand(method.card.brand)
              : null;
            const isDefault = method.id === defaultPaymentMethodId;
            const isExpired = method.card
              ? isCardExpired(method.card.expMonth, method.card.expYear)
              : false;
            const isExpiringSoon = method.card
              ? isCardExpiringSoon(method.card.expMonth, method.card.expYear)
              : false;

            return (
              <Card
                key={method.id}
                className={cn(
                  "transition-all duration-200",
                  isDefault && "ring-2 ring-blue-500 ring-offset-2",
                  isExpired && "border-red-200 bg-red-50",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Card Icon */}
                      <div
                        className={cn(
                          "w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold",
                          cardBrand?.color || "bg-gray-600",
                        )}
                      >
                        {cardBrand?.name.slice(0, 4) || "CARD"}
                      </div>

                      {/* Card Details */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            •••• •••• •••• {method.card?.last4}
                          </span>
                          {isDefault && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-600"
                            >
                              <OptimizedIcon name="Star" className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>
                            {cardBrand?.name} ending in {method.card?.last4}
                          </span>
                          <span className="flex items-center space-x-1">
                            <BusinessIcons.Calendar className="w-3 h-3" / />
                            <span>
                              {method.card?.expMonth
                                .toString()
                                .padStart(2, "0")}
                              /{method.card?.expYear}
                            </span>
                            {isExpired && (
                              <Badge variant="destructive" className="ml-2">
                                Expired
                              </Badge>
                            )}
                            {isExpiringSoon && !isExpired && (
                              <Badge
                                variant="outline"
                                className="ml-2 border-orange-300 text-orange-600"
                              >
                                <UIIcons.AlertTriangle className="w-3 h-3 mr-1" / />
                                Expires Soon
                              </Badge>
                            )}
                          </span>
                        </div>

                        {method.billingDetails.name && (
                          <div className="text-sm text-muted-foreground">
                            {method.billingDetails.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                          disabled={loading}
                        >
                          <UIIcons.CheckCircle className="w-4 h-4 mr-2" / />
                          Set Default
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        disabled={loading || isDefault}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <OptimizedIcon name="Shield" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">
                Secure Payment Processing
              </h4>
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and securely processed by
                Stripe. We never store your full card details on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
