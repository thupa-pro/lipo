"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Crown, Star, ArrowRight, Loader2, Zap } from "lucide-react";
import {
  SubscriptionPlanData,
  BillingCycle,
  UserSubscriptionWithPlan,
  SubscriptionPlan
} from "@/lib/subscription/types";
import {
  useSubscriptionClient,
  formatPlanPrice,
  getPlanSavings,
  getPlanColor,
  getPlanDisplayName
} from "@/lib/subscription/utils";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface SubscriptionPlansProps {
  currentPlan?: SubscriptionPlan;
  onUpgrade?: (planId: SubscriptionPlan) => void;
  showCurrentPlan?: boolean;
}

export function SubscriptionPlans({
  currentPlan,
  onUpgrade,
  showCurrentPlan = true,
}: SubscriptionPlansProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const subscriptionClient = useSubscriptionClient();

  const [plans, setPlans] = useState<SubscriptionPlanData[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<UserSubscriptionWithPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    loadPlansData();
  }, []);

  const loadPlansData = async () => {
    setIsLoading(true);
    try {
      const [plansData, subscriptionData] = await Promise.all([
        subscriptionClient.getPlans(),
        user ? subscriptionClient.getUserSubscription() : Promise.resolve(null),
      ]);

      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error("Error loading plans data:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (planId: SubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    if (planId === currentSubscription?.plan_id) {
      toast({
        title: "Already Subscribed",
        description: "You're already on this plan.",
      });
      return;
    }

    setProcessingPlan(planId);

    try {
      if (planId === "free") {
        // Handle free plan activation
        toast({
          title: "Free Plan Activated",
          description: "You're now on the free plan.",
        });

        if (onUpgrade) onUpgrade(planId);
        await loadPlansData();
        return;
      }

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: planId,
          billing_cycle: billingCycle,
          success_url: `${window.location.origin}/subscription/success`,
          cancel_url: `${window.location.origin}/subscription/plans`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.plan_id === "free") {
        // Free plan activated
        if (onUpgrade) onUpgrade(planId);
        await loadPlansData();
      }
    } catch (error: any) {
      console.error("Error selecting plan:", error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to start subscription process.",
        variant: "destructive",
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const getPlanIcon = (planId: SubscriptionPlan) => {
    switch (planId) {
      case "free":
        return null;
      case "starter":
        return <Zap className="w-5 h-5 text-blue-600" />;
      case "professional":
        return <Star className="w-5 h-5 text-purple-600" />;
      case "enterprise":
        return <Crown className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const renderFeature = (feature: string, value: boolean | string | number) => {
    if (typeof value === "boolean") {
      return (
        <div className="flex items-center gap-2">
          {value ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <div className="w-4 h-4" />
          )}
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {formatFeatureName(feature)}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-600" />
        <span className="text-gray-900">
          {formatFeatureName(feature)}: {value}
        </span>
      </div>
    );
  };

  const formatFeatureName = (feature: string): string => {
    return feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getButtonText = (planId: SubscriptionPlan) => {
    if (processingPlan === planId) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      );
    }

    if (currentSubscription?.plan_id === planId) {
      return "Current Plan";
    }

    if (planId === "free") {
      return "Get Started";
    }

    const currentPlanOrder = plans.findIndex(
      (p) => p.plan_id === currentSubscription?.plan_id,
    );
    const targetPlanOrder = plans.findIndex((p) => p.plan_id === planId);

    if (currentPlanOrder < targetPlanOrder) {
      return "Upgrade";
    } else if (currentPlanOrder > targetPlanOrder) {
      return "Downgrade";
    }

    return "Select Plan";
  };

  const isCurrentPlan = (planId: SubscriptionPlan) => {
    return currentSubscription?.plan_id === planId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label
          htmlFor="billing-cycle"
          className={billingCycle === "monthly" ? "font-semibold" : ""}
        >
          Monthly
        </Label>
        <Switch
          id="billing-cycle"
          checked={billingCycle === "yearly"}
          onCheckedChange={(checked) =>
            setBillingCycle(checked ? "yearly" : "monthly")
          }
        />
        <Label
          htmlFor="billing-cycle"
          className={billingCycle === "yearly" ? "font-semibold" : ""}
        >
          Yearly
        </Label>
        {billingCycle === "yearly" && (
          <Badge variant="secondary" className="ml-2">
            Save up to 20%
          </Badge>
        )}
      </div>

      {/* Current Plan Banner */}
      {showCurrentPlan && currentSubscription && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPlanIcon(currentSubscription.plan_id)}
                <div>
                  <h3 className="font-semibold">
                    Current Plan:{" "}
                    {getPlanDisplayName(currentSubscription.plan_id)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentSubscription.status === "trialing"
                      ? "Trial period"
                      : "Active subscription"}
                  </p>
                </div>
              </div>
              <Badge className={getPlanColor(currentSubscription.plan_id)}>
                {currentSubscription.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price =
            billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
          const savings = getPlanSavings(plan.price_monthly, plan.price_yearly);
          const isCurrent = isCurrentPlan(plan.plan_id as SubscriptionPlan);
          const isPopular = plan.is_featured;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                isCurrent
                  ? "border-blue-500 shadow-lg"
                  : isPopular
                    ? "border-purple-500 shadow-lg"
                    : "border-gray-200"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getPlanIcon(plan.plan_id as SubscriptionPlan)}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {formatPlanPrice(price, billingCycle)}
                  </div>
                  {billingCycle === "yearly" && price > 0 && (
                    <div className="text-sm text-green-600">
                      Save {savings}% annually
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  {Object.entries(plan.features).map(([feature, value]) => (
                    <div key={feature}>{renderFeature(feature, value)}</div>
                  ))}
                </div>

                {/* Limits */}
                <div className="space-y-2 pt-2 border-t">
                  {Object.entries(plan.limits).map(([limit, value]) => (
                    <div key={limit} className="text-sm text-gray-600">
                      <strong>{formatFeatureName(limit)}:</strong>{" "}
                      {value === -1 ? "Unlimited" : value.toLocaleString()}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() =>
                    handleSelectPlan(plan.plan_id as SubscriptionPlan)
                  }
                  disabled={isCurrent || processingPlan === plan.plan_id}
                  className={`w-full ${
                    isPopular && !isCurrent
                      ? "bg-purple-600 hover:bg-purple-700"
                      : isCurrent
                        ? "bg-gray-400"
                        : ""
                  }`}
                  variant={isCurrent ? "secondary" : "default"}
                >
                  {getButtonText(plan.plan_id as SubscriptionPlan)}
                  {!isCurrent && processingPlan !== plan.plan_id && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
