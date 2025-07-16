import { createClient } from "@/lib/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import type {
  Subscription,
  PaymentMethod,
  Invoice,
  Customer,
  UsageData,
  BillingOverview,
  SubscriptionPlan,
  BillingApiResponse,
  CreateSubscriptionForm,
  UpdateSubscriptionForm,
  CreatePaymentMethodForm,
  ApplyCouponForm,
  BillingPortalSession,
  DEFAULT_PLANS,
} from "./types";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export class BillingClient {
  private supabase = createClient();

  // Subscription Management
  async getCurrentSubscription(): Promise<
    BillingApiResponse<Subscription | null>
  > {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_current_subscription",
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch subscription",
      };
    }
  }

  async createSubscription(
    form: CreateSubscriptionForm,
  ): Promise<
    BillingApiResponse<{
      subscriptionId: string;
      clientSecret?: string;
      checkoutUrl?: string;
    }>
  > {
    try {
      const { data, error } = await this.supabase.rpc("create_subscription", {
        price_id: form.priceId,
        payment_method_id: form.paymentMethodId,
        quantity: form.quantity || 1,
        trial_period_days: form.trialPeriodDays,
        coupon_code: form.couponCode,
        metadata: form.metadata || {},
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error creating subscription:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create subscription",
      };
    }
  }

  async updateSubscription(
    subscriptionId: string,
    form: UpdateSubscriptionForm,
  ): Promise<BillingApiResponse<Subscription>> {
    try {
      const { data, error } = await this.supabase.rpc("update_subscription", {
        subscription_id: subscriptionId,
        price_id: form.priceId,
        quantity: form.quantity,
        proration_behavior: form.prorationBehavior || "create_prorations",
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error updating subscription:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update subscription",
      };
    }
  }

  async cancelSubscription(
    immediately = false,
  ): Promise<BillingApiResponse<Subscription>> {
    try {
      const { data, error } = await this.supabase.rpc("cancel_subscription", {
        cancel_immediately: immediately,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
      };
    }
  }

  async reactivateSubscription(): Promise<BillingApiResponse<Subscription>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "reactivate_subscription",
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to reactivate subscription",
      };
    }
  }

  async upgradePlan(
    planId: string,
  ): Promise<
    BillingApiResponse<{ subscriptionId?: string; checkoutUrl?: string }>
  > {
    try {
      const { data, error } = await this.supabase.rpc(
        "upgrade_subscription_plan",
        {
          new_plan_id: planId,
        },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error upgrading plan:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upgrade plan",
      };
    }
  }

  // Payment Methods
  async getPaymentMethods(): Promise<BillingApiResponse<PaymentMethod[]>> {
    try {
      const { data, error } = await this.supabase.rpc("get_payment_methods");

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch payment methods",
      };
    }
  }

  async addPaymentMethod(
    form: CreatePaymentMethodForm,
  ): Promise<BillingApiResponse<PaymentMethod>> {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe not loaded");

      // Create payment method with Stripe
      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: {
            number: form.card.number,
            exp_month: form.card.expMonth,
            exp_year: form.card.expYear,
            cvc: form.card.cvc,
          },
          billing_details: {
            name: form.billingDetails.name,
            email: form.billingDetails.email,
            address: form.billingDetails.address,
          },
        });

      if (stripeError) throw stripeError;

      // Attach to customer via backend
      const { data, error } = await this.supabase.rpc("add_payment_method", {
        payment_method_id: paymentMethod!.id,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error adding payment method:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add payment method",
      };
    }
  }

  async removePaymentMethod(
    paymentMethodId: string,
  ): Promise<BillingApiResponse<boolean>> {
    try {
      const { error } = await this.supabase.rpc("remove_payment_method", {
        payment_method_id: paymentMethodId,
      });

      if (error) throw error;

      return { success: true, data: true };
    } catch (error) {
      console.error("Error removing payment method:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove payment method",
      };
    }
  }

  async setDefaultPaymentMethod(
    paymentMethodId: string,
  ): Promise<BillingApiResponse<boolean>> {
    try {
      const { error } = await this.supabase.rpc("set_default_payment_method", {
        payment_method_id: paymentMethodId,
      });

      if (error) throw error;

      return { success: true, data: true };
    } catch (error) {
      console.error("Error setting default payment method:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to set default payment method",
      };
    }
  }

  // Invoices and Billing History
  async getInvoices(
    limit = 10,
    startingAfter?: string,
  ): Promise<BillingApiResponse<Invoice[]>> {
    try {
      const { data, error } = await this.supabase.rpc("get_invoices", {
        limit_count: limit,
        starting_after: startingAfter,
      });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch invoices",
      };
    }
  }

  async getInvoice(invoiceId: string): Promise<BillingApiResponse<Invoice>> {
    try {
      const { data, error } = await this.supabase.rpc("get_invoice", {
        invoice_id: invoiceId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch invoice",
      };
    }
  }

  async downloadInvoice(
    invoiceId: string,
  ): Promise<BillingApiResponse<string>> {
    try {
      const { data, error } = await this.supabase.rpc("get_invoice_pdf", {
        invoice_id: invoiceId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error downloading invoice:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to download invoice",
      };
    }
  }

  // Usage and Metrics
  async getUsageData(): Promise<BillingApiResponse<UsageData>> {
    try {
      const { data, error } = await this.supabase.rpc("get_usage_data");

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching usage data:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch usage data",
      };
    }
  }

  async getBillingOverview(): Promise<BillingApiResponse<BillingOverview>> {
    try {
      const { data, error } = await this.supabase.rpc("get_billing_overview");

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching billing overview:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch billing overview",
      };
    }
  }

  // Plans and Pricing
  async getAvailablePlans(): Promise<BillingApiResponse<SubscriptionPlan[]>> {
    try {
      const { data, error } = await this.supabase.rpc("get_available_plans");

      if (error) throw error;

      // Fallback to default plans if none found
      return { success: true, data: data || DEFAULT_PLANS };
    } catch (error) {
      console.error("Error fetching plans:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch plans",
      };
    }
  }

  async getUpgradeQuote(planId: string): Promise<BillingApiResponse<any>> {
    try {
      const { data, error } = await this.supabase.rpc("get_upgrade_quote", {
        new_plan_id: planId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error getting upgrade quote:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get upgrade quote",
      };
    }
  }

  // Coupons and Discounts
  async applyCoupon(
    form: ApplyCouponForm,
  ): Promise<BillingApiResponse<boolean>> {
    try {
      const { data, error } = await this.supabase.rpc("apply_coupon", {
        coupon_code: form.couponCode,
        subscription_id: form.subscriptionId,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error applying coupon:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to apply coupon",
      };
    }
  }

  async validateCoupon(
    couponCode: string,
  ): Promise<BillingApiResponse<{ valid: boolean; discount?: any }>> {
    try {
      const { data, error } = await this.supabase.rpc("validate_coupon", {
        coupon_code: couponCode,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error validating coupon:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to validate coupon",
      };
    }
  }

  // Customer Portal
  async createPortalSession(
    returnUrl?: string,
  ): Promise<BillingApiResponse<BillingPortalSession>> {
    try {
      const { data, error } = await this.supabase.rpc("create_portal_session", {
        return_url: returnUrl || window.location.origin + "/billing",
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error creating portal session:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create portal session",
      };
    }
  }

  // Checkout
  async createCheckoutSession(
    priceId: string,
    options?: {
      quantity?: number;
      couponCode?: string;
      trialPeriodDays?: number;
      successUrl?: string;
      cancelUrl?: string;
    },
  ): Promise<BillingApiResponse<{ sessionId: string; url: string }>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "create_checkout_session",
        {
          price_id: priceId,
          quantity: options?.quantity || 1,
          coupon_code: options?.couponCode,
          trial_period_days: options?.trialPeriodDays,
          success_url:
            options?.successUrl ||
            window.location.origin + "/billing?success=true",
          cancel_url:
            options?.cancelUrl ||
            window.location.origin + "/billing?canceled=true",
        },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      };
    }
  }

  // Utility Functions
  formatCurrency(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount / 100); // Stripe amounts are in cents
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatDateTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getCardBrandIcon(brand: string): string {
    const icons: Record<string, string> = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
      diners: "💳",
      jcb: "💳",
      unionpay: "💳",
      unknown: "💳",
    };
    return icons[brand] || icons.unknown;
  }

  calculateUsagePercentage(used: number, limit: number): number {
    if (limit === -1) return 0; // Unlimited
    if (limit === 0) return 100;
    return Math.min((used / limit) * 100, 100);
  }

  isUsageAtRisk(used: number, limit: number, threshold = 80): boolean {
    return this.calculateUsagePercentage(used, limit) >= threshold;
  }

  getNextBillingDate(subscription: Subscription): Date {
    return new Date(subscription.currentPeriodEnd * 1000);
  }

  getDaysUntilBilling(subscription: Subscription): number {
    const nextBilling = this.getNextBillingDate(subscription);
    const today = new Date();
    const diffTime = nextBilling.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe not loaded");

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  }

  async redirectToPortal(sessionUrl: string): Promise<void> {
    window.location.href = sessionUrl;
  }

  // Webhook verification (for backend use)
  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc("verify_stripe_webhook", {
        payload,
        signature,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error verifying webhook:", error);
      return false;
    }
  }

  // Analytics and Reports
  async getBillingAnalytics(
    timeframe = "30d",
  ): Promise<BillingApiResponse<any>> {
    try {
      const { data, error } = await this.supabase.rpc("get_billing_analytics", {
        timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching billing analytics:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch billing analytics",
      };
    }
  }

  async exportBillingData(
    format = "csv",
    dateRange?: { from: Date; to: Date },
  ): Promise<BillingApiResponse<string>> {
    try {
      const { data, error } = await this.supabase.rpc("export_billing_data", {
        export_format: format,
        date_range: dateRange
          ? {
              from: dateRange.from.toISOString(),
              to: dateRange.to.toISOString(),
            }
          : null,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error exporting billing data:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to export billing data",
      };
    }
  }
}

export const billingClient = new BillingClient();
