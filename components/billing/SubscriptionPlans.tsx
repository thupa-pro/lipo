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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Star,
  Crown,
  Users,
  Database,
  Headphones,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { billingClient } from "@/lib/billing/utils";
import type { Subscription, SubscriptionPlan } from "@/lib/billing/types";

interface SubscriptionPlansProps {
  currentSubscription?: Subscription | null;
  onUpgrade: (planId: string) => void;
}

export function SubscriptionPlans({
  currentSubscription,
  onUpgrade,
}: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const response = await billingClient.getAvailablePlans();
      if (response.success) {
        setPlans(response.data || []);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setUpgradeLoading(planId);
    try {
      await onUpgrade(planId);
    } finally {
      setUpgradeLoading(null);
    }
  };

  const formatPrice = (amount: number, interval: string) => {
    const price = amount / 100;
    const yearlyPrice = interval === "month" ? price * 12 * 0.83 : price; // 17% discount for yearly
    const displayPrice = isYearly && interval === "month" ? yearlyPrice : price;
    const displayInterval =
      isYearly && interval === "month" ? "year" : interval;

    return {
      price: displayPrice,
      interval: displayInterval,
      savings: isYearly && interval === "month" ? price * 12 - yearlyPrice : 0,
    };
  };

  const getPlanIcon = (planId: string) => {
    switch (planId.toLowerCase()) {
      case "starter":
        return <Zap className="h-6 w-6" />;
      case "professional":
        return <Star className="h-6 w-6" />;
      case "enterprise":
        return <Crown className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId.toLowerCase()) {
      case "starter":
        return "border-blue-200 bg-blue-50";
      case "professional":
        return "border-purple-200 bg-purple-50";
      case "enterprise":
        return "border-amber-200 bg-amber-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan?.id === planId;
  };

  const canUpgrade = (planId: string) => {
    if (!currentSubscription) return true;
    if (currentSubscription.status !== "active") return true;
    return currentSubscription.plan?.id !== planId;
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("team") || feature.includes("members"))
      return <Users className="h-4 w-4" />;
    if (feature.includes("support")) return <Headphones className="h-4 w-4" />;
    if (feature.includes("storage")) return <Database className="h-4 w-4" />;
    if (feature.includes("analytics"))
      return <TrendingUp className="h-4 w-4" />;
    return <Check className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded" />
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
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={cn("text-sm", !isYearly && "font-medium")}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-green-500"
        />
        <span className={cn("text-sm", isYearly && "font-medium")}>
          Yearly
          <Badge
            variant="secondary"
            className="ml-2 bg-green-100 text-green-600"
          >
            Save 17%
          </Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const pricing = formatPrice(plan.amount, plan.interval);
          const isCurrentUserPlan = isCurrentPlan(plan.id);
          const canUserUpgrade = canUpgrade(plan.id);

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative transition-all duration-200 hover:shadow-lg",
                plan.popular && "ring-2 ring-purple-500 ring-offset-2",
                plan.recommended && "ring-2 ring-amber-500 ring-offset-2",
                isCurrentUserPlan && "ring-2 ring-green-500 ring-offset-2",
                getPlanColor(plan.id),
              )}
            >
              {/* Popular/Recommended Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}

              {isCurrentUserPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-white rounded-full shadow-sm">
                  {getPlanIcon(plan.id)}
                </div>

                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>

                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${pricing.price.toFixed(0)}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{pricing.interval}
                    </span>
                  </div>

                  {pricing.savings > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      Save ${pricing.savings.toFixed(0)} annually
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="mt-0.5 text-green-600">
                        {getFeatureIcon(feature)}
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Limits */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Plan Limits</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      Listings:{" "}
                      {plan.limits.listings === -1
                        ? "Unlimited"
                        : plan.limits.listings}
                    </div>
                    <div>
                      Bookings:{" "}
                      {plan.limits.bookings === -1
                        ? "Unlimited"
                        : `${plan.limits.bookings}/mo`}
                    </div>
                    <div>
                      Team:{" "}
                      {plan.limits.teamMembers === -1
                        ? "Unlimited"
                        : plan.limits.teamMembers}
                    </div>
                    <div>Storage: {plan.limits.storage}GB</div>
                  </div>
                </div>

                <Separator />

                {/* Action Button */}
                <div className="space-y-2">
                  {isCurrentUserPlan ? (
                    <Button disabled className="w-full">
                      <Check className="mr-2 h-4 w-4" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={!canUserUpgrade || upgradeLoading === plan.id}
                      className={cn(
                        "w-full",
                        plan.popular && "bg-purple-600 hover:bg-purple-700",
                        plan.recommended && "bg-amber-600 hover:bg-amber-700",
                      )}
                    >
                      {upgradeLoading === plan.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {currentSubscription ? "Upgrade" : "Get Started"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}

                  {plan.id === "enterprise" && (
                    <Button variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  )}
                </div>

                {/* Additional Info */}
                <div className="text-xs text-muted-foreground text-center">
                  {isYearly ? "Billed annually" : "Billed monthly"} • Cancel
                  anytime
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enterprise Custom Solution */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Crown className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Need a custom solution?
                </h3>
                <p className="text-muted-foreground">
                  Get in touch for enterprise, pricing, custom, features, and
                  dedicated support.
                </p>
              </div>
            </div>
            <Button variant="outline">
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison Link */}
      <div className="text-center">
        <Button variant="link" className="text-muted-foreground">
          Compare all features in detail
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
