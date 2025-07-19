"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Receipt,
  Settings,
  Star,
  Zap,
  Shield,
  Calendar,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Import billing components
import { SubscriptionPlans } from "@/components/billing/SubscriptionPlans";
import { PaymentMethods } from "@/components/billing/PaymentMethods";
import { BillingHistory } from "@/components/billing/BillingHistory";
import { UsageMetrics } from "@/components/billing/UsageMetrics";
import { BillingSettings } from "@/components/billing/BillingSettings";

// Billing client
import { billingClient } from "@/lib/billing/utils";
import type {
  Subscription,
  PaymentMethod,
  Invoice,
  UsageData,
  BillingOverview,
} from "@/lib/billing/types";

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [billingOverview, setBillingOverview] =
    useState<BillingOverview | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const [overview, subscription, methods, invoices, usage] =
        await Promise.all([
          billingClient.getBillingOverview(),
          billingClient.getCurrentSubscription(),
          billingClient.getPaymentMethods(),
          billingClient.getInvoices(5), // Get recent 5 invoices
          billingClient.getUsageData(),
        ]);

      if (overview.success && overview.data) setBillingOverview(overview.data);
      if (subscription.success && subscription.data) setCurrentSubscription(subscription.data);
      if (methods.success) setPaymentMethods(methods.data || []);
      if (invoices.success) setRecentInvoices(invoices.data || []);
      if (usage.success && usage.data) setUsageData(usage.data);
    } catch (error) {
      console.error("Error loading billing data:", error);
      toast.error("Failed to load billing information");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBillingData();
    setTimeout(() => setRefreshing(false), 1000);
    toast.success("Billing data refreshed");
  };

  const handleUpgrade = async (planId: string) => {
    try {
      const response = await billingClient.upgradePlan(planId);
      if (response.success) {
        if (response.data?.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          await loadBillingData();
          toast.success("Plan upgraded successfully!");
        }
      } else {
        toast.error(response.error || "Failed to upgrade plan");
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      toast.error("Failed to upgrade plan");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await billingClient.cancelSubscription();
      if (response.success) {
        await loadBillingData();
        toast.success("Subscription cancelled successfully");
      } else {
        toast.error(response.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "trialing":
        return "text-blue-600 bg-blue-100";
      case "past_due":
        return "text-orange-600 bg-orange-100";
      case "cancelled":
      case "unpaid":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount / 100); // Stripe amounts are in cents
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscriptions
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSubscription?.plan?.name || "Free"}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Badge
                className={getSubscriptionStatusColor(
                  currentSubscription?.status || "inactive",
                )}
              >
                {currentSubscription?.status || "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billingOverview
                ? formatCurrency(billingOverview.monthlySpend)
                : "$0.00"}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSubscription?.currentPeriodEnd
                ? formatDate(currentSubscription.currentPeriodEnd)
                : "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentSubscription?.currentPeriodEnd &&
                `${Math.ceil((currentSubscription.currentPeriodEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days remaining`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usage This Month
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageData ? `${usageData.currentUsage}%` : "0%"}
            </div>
            <Progress
              value={usageData?.currentUsage || 0}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {currentSubscription.plan.name}
                  <Badge
                    className={getSubscriptionStatusColor(
                      currentSubscription.status,
                    )}
                  >
                    {currentSubscription.status}
                  </Badge>
                </h3>
                <p className="text-muted-foreground">
                  {formatCurrency(currentSubscription.plan.amount)} /{" "}
                  {currentSubscription.plan.interval}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Billing cycle:{" "}
                  {formatDate(currentSubscription.currentPeriodStart)} -{" "}
                  {formatDate(currentSubscription.currentPeriodEnd)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleUpgrade("upgrade")}
                >
                  Upgrade Plan
                </Button>
                {currentSubscription.status === "active" && (
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {currentSubscription?.status === "past_due" && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Your subscription payment is past due. Please update your payment
            method to avoid service interruption.
            <Button variant="link" className="ml-2 p-0 h-auto text-orange-600">
              Update Payment Method
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {usageData && usageData.currentUsage > 80 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Zap className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You've used {usageData.currentUsage}% of your monthly quota.
            Consider upgrading to avoid overage charges.
            <Button variant="link" className="ml-2 p-0 h-auto text-yellow-600">
              View Usage Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs for different billing sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Recent Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentInvoices.length > 0 ? (
                    recentInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {formatCurrency(invoice.total, invoice.currency)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(invoice.created)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              invoice.status === "paid"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-600"
                                : ""
                            }
                          >
                            {invoice.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No invoices found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Update Payment Method
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Receipt className="mr-2 h-4 w-4" />
                    View Billing History
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Star className="mr-2 h-4 w-4" />
                    Upgrade Plan
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <SubscriptionPlans
            currentSubscription={currentSubscription}
            onUpgrade={handleUpgrade}
          />
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <PaymentMethods
            paymentMethods={paymentMethods}
            onUpdate={loadBillingData}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <UsageMetrics
            usageData={usageData}
            subscription={currentSubscription}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <BillingHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
