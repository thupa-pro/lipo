// Subscription system types for Loconomy

export type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export type SubscriptionPlan =
  | "free"
  | "starter"
  | "professional"
  | "enterprise";

export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "uncollectible"
  | "void";

export type BillingCycle = "monthly" | "yearly";

export interface PlanFeatures {
  basic_listings?: boolean;
  unlimited_listings?: boolean;
  basic_analytics?: boolean;
  advanced_analytics?: boolean;
  customer_support?: boolean;
  priority_support?: boolean;
  ai_assistance?: boolean;
  custom_branding?: boolean;
  api_access?: boolean;
  white_label?: boolean;
  [key: string]: boolean | undefined;
}

export interface PlanLimits {
  max_listings: number; // -1 for unlimited
  max_bookings_per_month: number; // -1 for unlimited
  max_images_per_listing: number;
  ai_credits_per_month?: number;
  [key: string]: number | undefined;
}

export interface SubscriptionPlanData {
  id: string;
  plan_id: SubscriptionPlan;
  name: string;
  description: string;

  // Pricing
  price_monthly: number;
  price_yearly: number;

  // Stripe configuration
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  stripe_product_id?: string;

  // Plan configuration
  features: PlanFeatures;
  limits: PlanLimits;

  // Display
  is_active: boolean;
  display_order: number;
  is_featured: boolean;

  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;

  // Stripe data
  stripe_customer_id: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;

  // Subscription details
  plan_id: SubscriptionPlan;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;

  // Lifecycle
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  ended_at?: string;

  // Usage tracking
  usage_data: Record<string, any>;

  // Metadata
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StripeInvoice {
  id: string;
  user_id: string;
  subscription_id?: string;

  // Stripe data
  stripe_invoice_id: string;
  stripe_customer_id: string;
  stripe_subscription_id?: string;

  // Invoice details
  status: InvoiceStatus;
  amount_due: number;
  amount_paid: number;
  currency: string;

  // Dates
  invoice_date?: string;
  due_date?: string;
  paid_at?: string;

  // URLs and metadata
  line_items: any[];
  invoice_pdf?: string;
  hosted_invoice_url?: string;

  created_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;

  // Stripe data
  stripe_payment_method_id: string;
  stripe_customer_id: string;

  // Payment method details
  type: string; // card, bank_account, etc.
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;

  // Status
  is_default: boolean;
  is_active: boolean;

  created_at: string;
}

export interface SubscriptionUsage {
  id: string;
  user_id: string;
  subscription_id: string;

  // Period
  period_start: string; // Date
  period_end: string; // Date

  // Usage metrics
  listings_created: number;
  listings_active: number;
  bookings_received: number;
  bookings_completed: number;
  revenue_generated: number;

  // Feature usage
  ai_credits_used: number;
  api_calls_made: number;
  storage_used_mb: number;

  // Metadata
  usage_data: Record<string, any>;
  created_at: string;
}

export interface SubscriptionEvent {
  id: string;
  user_id: string;
  subscription_id?: string;

  // Event details
  event_type: string;
  stripe_event_id?: string;

  // Event data
  event_data: Record<string, any>;
  previous_attributes: Record<string, any>;

  // Processing
  processed: boolean;
  processed_at?: string;
  error_message?: string;

  created_at: string;
}

// Composite types for API responses
export interface UserSubscriptionWithPlan extends UserSubscription {
  plan: SubscriptionPlanData;
}

export interface UsageLimitCheck {
  allowed: boolean;
  limit_value: number;
  current_usage: number;
  remaining: number;
}

export interface SubscriptionStats {
  total_revenue: number;
  monthly_revenue: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  canceled_subscriptions: number;
  churn_rate: number;
  plan_distribution: Record<SubscriptionPlan, number>;
}

// Stripe-specific types
export interface StripeConfig {
  publishable_key: string;
  secret_key: string;
  webhook_secret: string;
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionData {
  session_id: string;
  customer_id: string;
  subscription_id?: string;
  plan_id: SubscriptionPlan;
  billing_cycle: BillingCycle;
  success_url: string;
  cancel_url: string;
}

export interface BillingPortalSessionData {
  url: string;
  return_url: string;
}

// Form types
export interface SubscriptionUpgradeRequest {
  plan_id: SubscriptionPlan;
  billing_cycle: BillingCycle;
  proration_behavior?: "create_prorations" | "none";
}

export interface PaymentMethodSetupRequest {
  return_url: string;
}

// Webhook event types
export type StripeWebhookEvent =
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed"
  | "customer.created"
  | "customer.updated"
  | "payment_method.attached"
  | "payment_method.detached";

export interface WebhookEventData {
  type: StripeWebhookEvent;
  data: {
    object: any;
    previous_attributes?: any;
  };
  created: number;
  id: string;
}

// Plan comparison types
export interface PlanComparison {
  feature: string;
  free: boolean | string | number;
  starter: boolean | string | number;
  professional: boolean | string | number;
  enterprise: boolean | string | number;
}

// Subscription dashboard types
export interface SubscriptionDashboard {
  current_subscription: UserSubscriptionWithPlan | null;
  usage: SubscriptionUsage | null;
  recent_invoices: StripeInvoice[];
  payment_methods: PaymentMethod[];
  available_plans: SubscriptionPlanData[];
  billing_portal_url?: string;
}

// Trial and promotional types
export interface TrialInfo {
  is_trial: boolean;
  trial_days_remaining: number;
  trial_end_date?: string;
  can_extend_trial: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percentage?: number;
  discount_amount?: number;
  valid_until?: string;
  max_uses?: number;
  used_count: number;
  applicable_plans: SubscriptionPlan[];
  is_active: boolean;
}

// Notification types
export type SubscriptionNotificationType =
  | "trial_ending"
  | "trial_ended"
  | "payment_failed"
  | "subscription_canceled"
  | "subscription_renewed"
  | "invoice_created"
  | "usage_limit_reached"
  | "plan_upgraded"
  | "plan_downgraded";

export interface SubscriptionNotification {
  id: string;
  user_id: string;
  type: SubscriptionNotificationType;
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  is_read: boolean;
  created_at: string;
}
