"use client";

import { createClient } from "@/lib/supabase/client";
import {
  SubscriptionPlanData,
  UserSubscription,
  UserSubscriptionWithPlan,
  StripeInvoice,
  PaymentMethod,
  SubscriptionUsage,
  SubscriptionPlan,
  BillingCycle,
  UsageLimitCheck,
  SubscriptionUpgradeRequest,
  CheckoutSessionData,
  BillingPortalSessionData,
  SubscriptionDashboard,
  TrialInfo,
} from "./types";

export class SubscriptionClient {
  private supabase = createClient();

  // Plan management
  async getPlans(): Promise<SubscriptionPlanData[]> {
    const { data, error } = await this.supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (error) throw error;
    return data || [];
  }

  async getPlan(
    planId: SubscriptionPlan,
  ): Promise<SubscriptionPlanData | null> {
    const { data, error } = await this.supabase
      .from("subscription_plans")
      .select("*")
      .eq("plan_id", planId)
      .eq("is_active", true)
      .single();

    if (error) return null;
    return data;
  }

  // User subscription management
  async getUserSubscription(
    userId?: string,
  ): Promise<UserSubscriptionWithPlan | null> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return null;

    const { data, error } = await this.supabase.rpc("get_user_subscription", {
      p_user_id: targetUserId,
    });

    if (error || !data || data.length === 0) return null;

    const subscription = data[0];
    const plan = await this.getPlan(subscription.plan_id);

    return {
      ...subscription,
      plan: plan!,
    };
  }

  async createSubscription(
    userId: string,
    planId: SubscriptionPlan,
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripePriceId: string,
    billingCycle: BillingCycle,
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from("user_subscriptions")
      .insert({
        user_id: userId,
        plan_id: planId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_price_id: stripePriceId,
        billing_cycle: billingCycle,
        status: "incomplete",
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateSubscriptionStatus(
    subscriptionId: string,
    status: string,
    periodStart?: string,
    periodEnd?: string,
  ): Promise<boolean> {
    const updateData: any = { status };

    if (periodStart) updateData.current_period_start = periodStart;
    if (periodEnd) updateData.current_period_end = periodEnd;

    const { error } = await this.supabase
      .from("user_subscriptions")
      .update(updateData)
      .eq("stripe_subscription_id", subscriptionId);

    if (error) throw error;
    return true;
  }

  // Feature and limit checking
  async checkFeatureAccess(feature: string, userId?: string): Promise<boolean> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return false;

    const { data, error } = await this.supabase.rpc("check_feature_access", {
      p_user_id: targetUserId,
      p_feature: feature,
    });

    if (error) return false;
    return data;
  }

  async checkUsageLimit(
    limitType: string,
    currentUsage?: number,
    userId?: string,
  ): Promise<UsageLimitCheck> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) {
      return {
        allowed: false,
        limit_value: 0,
        current_usage: 0,
        remaining: 0,
      };
    }

    const { data, error } = await this.supabase.rpc("check_usage_limit", {
      p_user_id: targetUserId,
      p_limit_type: limitType,
      p_current_usage: currentUsage,
    });

    if (error || !data || data.length === 0) {
      return {
        allowed: false,
        limit_value: 0,
        current_usage: 0,
        remaining: 0,
      };
    }

    return data[0];
  }

  // Usage tracking
  async updateUsage(
    metric: string,
    increment: number = 1,
    userId?: string,
  ): Promise<boolean> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return false;

    const { data, error } = await this.supabase.rpc(
      "update_subscription_usage",
      {
        p_user_id: targetUserId,
        p_metric: metric,
        p_increment: increment,
      },
    );

    if (error) return false;
    return data;
  }

  async getUsage(userId?: string): Promise<SubscriptionUsage | null> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return null;

    const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endOfMonth = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      0,
    )
      .toISOString()
      .slice(0, 10);

    const { data, error } = await this.supabase
      .from("subscription_usage")
      .select("*")
      .eq("user_id", targetUserId)
      .eq("period_start", currentMonth)
      .single();

    if (error) return null;
    return data;
  }

  // Invoices
  async getInvoices(userId?: string): Promise<StripeInvoice[]> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return [];

    const { data, error } = await this.supabase
      .from("stripe_invoices")
      .select("*")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Payment methods
  async getPaymentMethods(userId?: string): Promise<PaymentMethod[]> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return [];

    const { data, error } = await this.supabase
      .from("user_payment_methods")
      .select("*")
      .eq("user_id", targetUserId)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    // First, unset all existing default payment methods
    await this.supabase
      .from("user_payment_methods")
      .update({ is_default: false })
      .eq("user_id", userId);

    // Then set the new default
    const { error } = await this.supabase
      .from("user_payment_methods")
      .update({ is_default: true })
      .eq("id", paymentMethodId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  }

  async removePaymentMethod(paymentMethodId: string): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    const { error } = await this.supabase
      .from("user_payment_methods")
      .update({ is_active: false })
      .eq("id", paymentMethodId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  }

  // Subscription dashboard data
  async getDashboardData(userId?: string): Promise<SubscriptionDashboard> {
    const targetUserId =
      userId || (await this.supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) {
      throw new Error("User not authenticated");
    }

    const [subscription, usage, invoices, paymentMethods, plans] =
      await Promise.all([
        this.getUserSubscription(targetUserId),
        this.getUsage(targetUserId),
        this.getInvoices(targetUserId),
        this.getPaymentMethods(targetUserId),
        this.getPlans(),
      ]);

    return {
      current_subscription: subscription,
      usage,
      recent_invoices: invoices.slice(0, 5),
      payment_methods: paymentMethods,
      available_plans: plans,
    };
  }

  // Trial information
  async getTrialInfo(userId?: string): Promise<TrialInfo> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription || !subscription.trial_end) {
      return {
        is_trial: false,
        trial_days_remaining: 0,
        can_extend_trial: false,
      };
    }

    const trialEnd = new Date(subscription.trial_end);
    const now = new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    return {
      is_trial: subscription.status === "trialing",
      trial_days_remaining: daysRemaining,
      trial_end_date: subscription.trial_end,
      can_extend_trial: daysRemaining <= 3 && daysRemaining > 0,
    };
  }
}

// Export singleton instance
export const subscriptionClient = new SubscriptionClient();

// Utility hook for client components
export function useSubscriptionClient() {
  return subscriptionClient;
}

// Utility functions
export function formatPlanPrice(
  price: number,
  billingCycle: BillingCycle,
): string {
  if (price === 0) return "Free";

  if (billingCycle === "yearly") {
    const monthlyPrice = price / 12;
    return `$${monthlyPrice.toFixed(0)}/mo (billed yearly)`;
  }

  return `$${price.toFixed(0)}/mo`;
}

export function getPlanSavings(
  monthlyPrice: number,
  yearlyPrice: number,
): number {
  const yearlyMonthly = yearlyPrice / 12;
  const savings = ((monthlyPrice - yearlyMonthly) / monthlyPrice) * 100;
  return Math.round(savings);
}

export function formatUsagePercentage(current: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited
  if (limit === 0) return 100;
  return Math.min(100, Math.round((current / limit) * 100));
}

export function getUsageStatus(
  current: number,
  limit: number,
): "safe" | "warning" | "danger" {
  const percentage = formatUsagePercentage(current, limit);

  if (percentage >= 90) return "danger";
  if (percentage >= 75) return "warning";
  return "safe";
}

export function getPlanUpgradeRecommendation(
  currentPlan: SubscriptionPlan,
  usage: SubscriptionUsage,
): SubscriptionPlan | null {
  // Simple logic - can be enhanced based on usage patterns
  if (currentPlan === "free" && usage.listings_created >= 2) {
    return "starter";
  }

  if (
    currentPlan === "starter" &&
    (usage.listings_created >= 20 || usage.bookings_received >= 80)
  ) {
    return "professional";
  }

  if (
    currentPlan === "professional" &&
    (usage.listings_created >= 80 || usage.bookings_received >= 400)
  ) {
    return "enterprise";
  }

  return null;
}

export function formatLimitDisplay(limit: number, unit: string = ""): string {
  if (limit === -1) return "Unlimited";
  return `${limit.toLocaleString()}${unit}`;
}

export function getNextBillingDate(
  subscription: UserSubscription,
): Date | null {
  if (!subscription.current_period_end) return null;
  return new Date(subscription.current_period_end);
}

export function isSubscriptionActive(subscription: UserSubscription): boolean {
  return ["trialing", "active"].includes(subscription.status);
}

export function canAccessFeature(features: any, feature: string): boolean {
  return features?.[feature] === true;
}

export function getPlanDisplayName(planId: SubscriptionPlan): string {
  const names = {
    free: "Free",
    starter: "Starter",
    professional: "Professional",
    enterprise: "Enterprise",
  };
  return names[planId];
}

export function getPlanColor(planId: SubscriptionPlan): string {
  const colors = {
    free: "bg-gray-100 text-gray-800",
    starter: "bg-blue-100 text-blue-800",
    professional: "bg-purple-100 text-purple-800",
    enterprise: "bg-yellow-100 text-yellow-800",
  };
  return colors[planId];
}
