// Billing and Subscription Types

export interface Subscription {
  id: string;
  customer: string;
  status:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid";
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  canceledAt?: number;
  trialStart?: number;
  trialEnd?: number;
  plan: SubscriptionPlan;
  quantity: number;
  discount?: {
    id: string;
    coupon: {
      id: string;
      name?: string;
      percentOff?: number;
      amountOff?: number;
      currency?: string;
    };
  };
  defaultPaymentMethod?: string;
  latestInvoice?: string;
  nextPendingInvoiceItemInvoice?: number;
  pendingInvoiceItemInterval?: string;
}

export interface SubscriptionPlan {
  id: string;
  object: "plan" | "price";
  active: boolean;
  amount: number;
  currency: string;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  nickname?: string;
  product: string | SubscriptionProduct;
  trialPeriodDays?: number;
  usageType: "licensed" | "metered";
  metadata: Record<string, string>;
  // Custom fields for our plans
  name: string;
  description: string;
  features: string[];
  limits: {
    listings?: number;
    bookings?: number;
    teamMembers?: number;
    apiCalls?: number;
    storage?: number; // in GB
    support?: "basic" | "priority" | "dedicated";
  };
  popular?: boolean;
  recommended?: boolean;
}

export interface SubscriptionProduct {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  metadata: Record<string, string>;
  active: boolean;
  created: number;
  updated: number;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "bank_account" | "sepa_debit" | "ideal" | "sofort";
  card?: {
    brand: string;
    country?: string;
    expMonth: number;
    expYear: number;
    fingerprint: string;
    funding: string;
    last4: string;
    threeDSecureUsage?: {
      supported: boolean;
    };
    wallet?: any;
  };
  billingDetails: {
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postalCode?: string;
      state?: string;
    };
    email?: string;
    name?: string;
    phone?: string;
  };
  created: number;
  customer?: string;
  livemode: boolean;
  metadata: Record<string, string>;
}

export interface Invoice {
  id: string;
  object: "invoice";
  accountCountry?: string;
  accountName?: string;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  applicationFeeAmount?: number;
  attemptCount: number;
  attempted: boolean;
  billing: "charge_automatically" | "send_invoice";
  billingReason: string;
  chargeId?: string;
  currency: string;
  customer: string;
  customerAddress?: any;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerShipping?: any;
  customerTaxExempt?: string;
  defaultPaymentMethod?: string;
  description?: string;
  discount?: any;
  dueDate?: number;
  endingBalance?: number;
  footer?: string;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
  lines: {
    data: InvoiceLineItem[];
    hasMore: boolean;
    totalCount: number;
    url: string;
  };
  livemode: boolean;
  metadata: Record<string, string>;
  nextPaymentAttempt?: number;
  number?: string;
  paid: boolean;
  paymentIntent?: string;
  periodEnd: number;
  periodStart: number;
  postPaymentCreditNotesAmount: number;
  prePaymentCreditNotesAmount: number;
  receiptNumber?: string;
  startingBalance: number;
  statementDescriptor?: string;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  statusTransitions: {
    finalizedAt?: number;
    markedUncollectibleAt?: number;
    paidAt?: number;
    voidedAt?: number;
  };
  subscription?: string;
  subtotal: number;
  tax?: number;
  total: number;
  totalTaxAmounts: any[];
  transferData?: any;
  webhooksDeliveredAt?: number;
  created: number;
  updated: number;
}

export interface InvoiceLineItem {
  id: string;
  object: "line_item";
  amount: number;
  currency: string;
  description?: string;
  discountable: boolean;
  livemode: boolean;
  metadata: Record<string, string>;
  period: {
    end: number;
    start: number;
  };
  plan?: SubscriptionPlan;
  price?: SubscriptionPlan;
  proration: boolean;
  quantity: number;
  subscription?: string;
  subscriptionItem?: string;
  type: "invoiceitem" | "subscription";
}

export interface Customer {
  id: string;
  object: "customer";
  address?: any;
  balance: number;
  created: number;
  currency?: string;
  defaultSource?: string;
  delinquent: boolean;
  description?: string;
  discount?: any;
  email?: string;
  invoicePrefix?: string;
  invoiceSettings: {
    customFields?: any;
    defaultPaymentMethod?: string;
    footer?: string;
  };
  livemode: boolean;
  metadata: Record<string, string>;
  name?: string;
  nextInvoiceSequence?: number;
  phone?: string;
  preferredLocales?: string[];
  shipping?: any;
  sources: {
    object: "list";
    data: any[];
    hasMore: boolean;
    totalCount: number;
    url: string;
  };
  subscriptions: {
    object: "list";
    data: Subscription[];
    hasMore: boolean;
    totalCount: number;
    url: string;
  };
  taxExempt?: string;
  taxIds: {
    object: "list";
    data: any[];
    hasMore: boolean;
    totalCount: number;
    url: string;
  };
}

export interface UsageData {
  currentUsage: number; // percentage
  monthlyQuota: number;
  usedThisMonth: number;
  breakdown: {
    listings: { used: number; limit: number };
    bookings: { used: number; limit: number };
    apiCalls: { used: number; limit: number };
    storage: { used: number; limit: number }; // in GB
    teamMembers: { used: number; limit: number };
  };
  usageHistory: Array<{
    date: string;
    listings: number;
    bookings: number;
    apiCalls: number;
    storage: number;
  }>;
  overage: {
    enabled: boolean;
    costs: {
      listings: number; // per additional listing
      bookings: number; // per additional booking
      apiCalls: number; // per 1000 calls
      storage: number; // per GB
    };
  };
}

export interface BillingOverview {
  monthlySpend: number;
  yearlySpend: number;
  nextPaymentAmount: number;
  nextPaymentDate: number;
  totalInvoices: number;
  totalPaid: number;
  credits: number;
  currency: string;
}

export interface SubscriptionQuote {
  id: string;
  subscription: string;
  amountDue: number;
  amountTotal: number;
  currency: string;
  customer: string;
  description?: string;
  fromSubscription: {
    id: string;
    subscription: string;
  };
  lineItems: InvoiceLineItem[];
  subscriptionSchedule?: string;
  totalDetails: {
    amountDiscount: number;
    amountShipping: number;
    amountTax: number;
  };
}

export interface WebhookEvent {
  id: string;
  object: "event";
  apiVersion: string;
  created: number;
  data: {
    object: any;
    previousAttributes?: any;
  };
  livemode: boolean;
  pendingWebhooks: number;
  request: {
    id?: string;
    idempotencyKey?: string;
  };
  type: string;
}

export interface BillingPortalSession {
  id: string;
  object: "billing_portal.session";
  configuration: string;
  created: number;
  customer: string;
  livemode: boolean;
  locale?: string;
  onBehalfOf?: string;
  returnUrl?: string;
  url: string;
}

// API Response Types
export interface BillingApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  stripeError?: {
    type: string;
    code?: string;
    message: string;
    param?: string;
  };
}

export interface PaginatedBillingResponse<T> {
  data: T[];
  hasMore: boolean;
  url: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface CreateSubscriptionForm {
  priceId: string;
  paymentMethodId?: string;
  quantity?: number;
  trialPeriodDays?: number;
  couponCode?: string;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionForm {
  priceId?: string;
  quantity?: number;
  prorationBehavior?: "none" | "create_prorations" | "always_invoice";
  billingCycleAnchor?: "now" | "unchanged";
}

export interface CreatePaymentMethodForm {
  type: "card";
  card: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
  billingDetails: {
    name: string;
    email?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

export interface ApplyCouponForm {
  couponCode: string;
  subscriptionId?: string;
}

// Constants
export const SUBSCRIPTION_STATUSES = {
  incomplete: { label: "Incomplete", color: "gray" },
  incomplete_expired: { label: "Incomplete Expired", color: "red" },
  trialing: { label: "Trial", color: "blue" },
  active: { label: "Active", color: "green" },
  past_due: { label: "Past Due", color: "orange" },
  canceled: { label: "Canceled", color: "red" },
  unpaid: { label: "Unpaid", color: "red" },
} as const;

export const PAYMENT_METHOD_TYPES = {
  card: { label: "Card", icon: "💳" },
  bank_account: { label: "Bank Account", icon: "🏦" },
  sepa_debit: { label: "SEPA Debit", icon: "🏧" },
  ideal: { label: "iDEAL", icon: "💰" },
  sofort: { label: "Sofort", icon: "⚡" },
} as const;

export const INVOICE_STATUSES = {
  draft: { label: "Draft", color: "gray" },
  open: { label: "Open", color: "blue" },
  paid: { label: "Paid", color: "green" },
  uncollectible: { label: "Uncollectible", color: "red" },
  void: { label: "Void", color: "gray" },
} as const;

export const BILLING_INTERVALS = {
  day: { label: "Daily", short: "day" },
  week: { label: "Weekly", short: "week" },
  month: { label: "Monthly", short: "mo" },
  year: { label: "Yearly", short: "yr" },
} as const;

export const DEFAULT_PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses just getting started",
    amount: 2900, // $29.00
    currency: "USD",
    interval: "month" as const,
    features: [
      "Up to 10 active listings",
      "Basic booking management",
      "Email support",
      "1 team member",
      "5GB storage",
    ],
    limits: {
      listings: 10,
      bookings: 100,
      teamMembers: 1,
      apiCalls: 1000,
      storage: 5,
      support: "basic" as const,
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing businesses with more advanced needs",
    amount: 7900, // $79.00
    currency: "USD",
    interval: "month" as const,
    popular: true,
    features: [
      "Up to 50 active listings",
      "Advanced booking features",
      "Priority support",
      "5 team members",
      "50GB storage",
      "Analytics dashboard",
    ],
    limits: {
      listings: 50,
      bookings: 1000,
      teamMembers: 5,
      apiCalls: 10000,
      storage: 50,
      support: "priority" as const,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations requiring custom solutions",
    amount: 19900, // $199.00
    currency: "USD",
    interval: "month" as const,
    recommended: true,
    features: [
      "Unlimited listings",
      "White-label solution",
      "Dedicated support",
      "Unlimited team members",
      "500GB storage",
      "Custom integrations",
      "Advanced analytics",
    ],
    limits: {
      listings: -1, // Unlimited
      bookings: -1, // Unlimited
      teamMembers: -1, // Unlimited
      apiCalls: 100000,
      storage: 500,
      support: "dedicated" as const,
    },
  },
] as const;

export const USAGE_ALERTS = {
  warning: 80, // 80% usage
  critical: 95, // 95% usage
} as const;

export type SubscriptionStatus = keyof typeof SUBSCRIPTION_STATUSES;
export type PaymentMethodType = keyof typeof PAYMENT_METHOD_TYPES;
export type InvoiceStatus = keyof typeof INVOICE_STATUSES;
export type BillingInterval = keyof typeof BILLING_INTERVALS;
