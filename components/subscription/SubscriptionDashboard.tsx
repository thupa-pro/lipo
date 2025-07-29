import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, TrendingUp, AlertCircle, ExternalLink, Download, Crown, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import {
  SubscriptionDashboard as DashboardData,
  TrialInfo,
  UsageLimitCheck
} from "@/lib/subscription/types";
import {
  useSubscriptionClient,
  formatPlanPrice,
  formatUsagePercentage,
  getUsageStatus,
  formatLimitDisplay,
  getNextBillingDate,
  isSubscriptionActive,
  getPlanColor,
  getPlanDisplayName
} from "@/lib/subscription/utils";
import { useToast } from "@/hooks/use-toast";

export function SubscriptionDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const subscriptionClient = useSubscriptionClient();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null);
  const [usageLimits, setUsageLimits] = useState<
    Record<string, UsageLimitCheck>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPortal, setIsCreatingPortal] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashboard, trial, listingsLimit, bookingsLimit] =
        await Promise.all([
          subscriptionClient.getDashboardData(),
          subscriptionClient.getTrialInfo(),
          subscriptionClient.checkUsageLimit("max_listings"),
          subscriptionClient.checkUsageLimit("max_bookings_per_month"),
        ]);

      setDashboardData(dashboard);
      setTrialInfo(trial);
      setUsageLimits({
        max_listings: listingsLimit,
        max_bookings_per_month: bookingsLimit,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsCreatingPortal(true);
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create billing portal session",
        );
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error creating billing portal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to access billing portal.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPortal(false);
    }
  };

  const renderUsageCard = (
    title: string,
    icon: React.ReactNode,
    limitKey: string,
    unit: string = "",
  ) => {
    const usage = usageLimits[limitKey];
    if (!usage) return null;

    const percentage = formatUsagePercentage(
      usage.current_usage,
      usage.limit_value,
    );
    const status = getUsageStatus(usage.current_usage, usage.limit_value);

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usage.current_usage.toLocaleString()}
            {unit}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            of {formatLimitDisplay(usage.limit_value, unit)}
          </p>

          {usage.limit_value !== -1 && (
            <div className="space-y-1">
              <Progress
                value={percentage}
                className={`h-2 ${
                  status === "danger"
                    ? "bg-red-100"
                    : status === "warning"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                }`}
              />
              <p
                className={`text-xs ${
                  status === "danger"
                    ? "text-red-600"
                    : status === "warning"
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {usage.remaining === -1
                  ? "Unlimited remaining"
                  : `${usage.remaining} remaining`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No subscription data available.</p>
      </div>
    );
  }

  const {
    current_subscription,
    usage,
    recent_invoices,
    payment_methods,
    available_plans,
  } = dashboardData;
  const nextBillingDate = current_subscription
    ? getNextBillingDate(current_subscription)
    : null;
  const isActive = current_subscription
    ? isSubscriptionActive(current_subscription)
    : false;

  return (
    <div className="space-y-8">
      {/* Trial Warning */}
      {trialInfo?.is_trial && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Trial Period Active
                </h3>
                <p className="text-sm text-yellow-700">
                  {trialInfo.trial_days_remaining} days remaining in your trial.
                  {trialInfo.trial_end_date && (
                    <>
                      {" "}
                      Trial ends on{" "}
                      {format(
                        new Date(trialInfo.trial_end_date),
                        "MMM, d, yyyy",
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {current_subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Plan
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-lg font-semibold">
                    {getPlanDisplayName(current_subscription.plan_id)}
                  </h3>
                  <Badge className={getPlanColor(current_subscription.plan_id)}>
                    {current_subscription.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Billing
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {formatPlanPrice(
                    current_subscription.billing_cycle === "yearly"
                      ? current_subscription.plan.price_yearly
                      : current_subscription.plan.price_monthly,
                    current_subscription.billing_cycle,
                  )}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Next Billing
                </Label>
                <p className="text-lg font-semibold mt-1">
                  {nextBillingDate
                    ? format(nextBillingDate, "MMM, d, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active subscription</p>
              <Button
                onClick={() => (window.location.href = "/subscription/plans")}
              >
                View Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderUsageCard(
          "Listings Created",
          <BarChart3 className="h-4 w-4 text-muted-foreground" />,
          "max_listings",
        )}

        {renderUsageCard(
          "Monthly Bookings",
          <BusinessIcons.Calendar className="h-4 w-4 text-muted-foreground" />,
          "max_bookings_per_month",
        )}

        {usage && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue Generated
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${usage.revenue_generated.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Bookings
                </CardTitle>
                <UIIcons.CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usage.bookings_completed}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="billing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="usage">Usage Details</TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payment_methods.length > 0 ? (
                <div className="space-y-3">
                  {payment_methods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {method.card_brand?.toUpperCase()} ••••{" "}
                            {method.card_last4}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires{" "}
                            {method.card_exp_month?.toString().padStart(2, "0")}
                            /{method.card_exp_year}
                          </p>
                        </div>
                      </div>
                      {method.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No payment methods on file
                </p>
              )}

              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={handleManageBilling}
                  disabled={isCreatingPortal}
                  className="w-full"
                >
                  {isCreatingPortal ? (
                    <>
                      <NavigationIcons.Settings className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <NavigationIcons.Settings className="w-4 h-4 mr-2" />
                      Manage Billing
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {recent_invoices.length > 0 ? (
                <div className="space-y-3">
                  {recent_invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          ${invoice.amount_due.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {invoice.invoice_date &&
                            format(
                              new Date(invoice.invoice_date),
                              "MMM, d, yyyy",
                            )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            invoice.status === "paid" ? "default" : "secondary"
                          }
                          className={
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {invoice.status}
                        </Badge>
                        {invoice.invoice_pdf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(invoice.invoice_pdf, "_blank")
                            }
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No invoices available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Details</CardTitle>
            </CardHeader>
            <CardContent>
              {usage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Service Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Listings Created:</span>
                        <span className="font-medium">
                          {usage.listings_created}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Listings:</span>
                        <span className="font-medium">
                          {usage.listings_active}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bookings Received:</span>
                        <span className="font-medium">
                          {usage.bookings_received}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bookings Completed:</span>
                        <span className="font-medium">
                          {usage.bookings_completed}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Revenue Generated:</span>
                        <span className="font-medium">
                          ${usage.revenue_generated.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Credits Used:</span>
                        <span className="font-medium">
                          {usage.ai_credits_used}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage Used:</span>
                        <span className="font-medium">
                          {usage.storage_used_mb} MB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No usage data available for this period
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
