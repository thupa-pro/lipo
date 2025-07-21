import Stripe from 'stripe';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { eventBus } from '@/lib/events';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Billing schemas
export const BillingEventSchema = z.object({
  customer_id: z.string(),
  subscription_id: z.string().optional(),
  usage_record_id: z.string().optional(),
  event_type: z.enum(['usage', 'subscription_created', 'subscription_updated', 'subscription_canceled', 'invoice_paid', 'invoice_failed']),
  quantity: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
});

export const UsageMetricSchema = z.object({
  customer_id: z.string(),
  metric_name: z.enum(['api_calls', 'ai_interactions', 'vector_searches', 'bookings_processed', 'providers_listed']),
  quantity: z.number().positive(),
  timestamp: z.string().datetime().optional(),
  metadata: z.record(z.string()).optional(),
});

export const SubscriptionTierSchema = z.object({
  tier: z.enum(['free', 'pro', 'enterprise']),
  price_id: z.string(),
  limits: z.object({
    api_calls: z.number(),
    ai_interactions: z.number(),
    vector_searches: z.number(),
    bookings_per_month: z.number(),
    providers_listed: z.number(),
  }),
});

type BillingEvent = z.infer<typeof BillingEventSchema>;
type UsageMetric = z.infer<typeof UsageMetricSchema>;
type SubscriptionTier = z.infer<typeof SubscriptionTierSchema>;

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  free: {
    tier: 'free',
    price_id: 'price_free',
    limits: {
      api_calls: 100,
      ai_interactions: 10,
      vector_searches: 50,
      bookings_per_month: 5,
      providers_listed: 1,
    },
  },
  pro: {
    tier: 'pro',
    price_id: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      api_calls: 10000,
      ai_interactions: 500,
      vector_searches: 5000,
      bookings_per_month: 100,
      providers_listed: 10,
    },
  },
  enterprise: {
    tier: 'enterprise',
    price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    limits: {
      api_calls: -1, // unlimited
      ai_interactions: -1,
      vector_searches: -1,
      bookings_per_month: -1,
      providers_listed: -1,
    },
  },
};

export class StripeMetering {
  private static instance: StripeMetering;

  public static getInstance(): StripeMetering {
    if (!StripeMetering.instance) {
      StripeMetering.instance = new StripeMetering();
    }
    return StripeMetering.instance;
  }

  // Track usage and report to Stripe
  async trackUsage(metric: UsageMetric): Promise<void> {
    try {
      const validated = UsageMetricSchema.parse(metric);
      
      // Get customer's subscription
      const { data: customer } = await supabase
        .from('customers')
        .select('stripe_customer_id, subscription_tier, subscription_id')
        .eq('id', validated.customer_id)
        .single();

      if (!customer?.stripe_customer_id) {
        throw new Error('Customer not found or missing Stripe ID');
      }

      // Record usage in database
      await supabase.from('usage_records').insert({
        customer_id: validated.customer_id,
        metric_name: validated.metric_name,
        quantity: validated.quantity,
        timestamp: validated.timestamp || new Date().toISOString(),
        metadata: validated.metadata,
      });

      // Report to Stripe for metered billing (Pro/Enterprise only)
      if (customer.subscription_tier !== 'free' && customer.subscription_id) {
        await this.reportUsageToStripe(
          customer.subscription_id,
          validated.metric_name,
          validated.quantity
        );
      }

      // Emit billing event
      await eventBus.emit({
        type: 'billing_usage_tracked',
        data: {
          customer_id: validated.customer_id,
          metric_name: validated.metric_name,
          quantity: validated.quantity,
        },
        context: { source: 'stripe_metering' },
      });

      // Check usage limits
      await this.checkUsageLimits(validated.customer_id);

    } catch (error) {
      console.error('Failed to track usage:', error);
      throw error;
    }
  }

  // Report usage to Stripe for metered billing
  private async reportUsageToStripe(
    subscriptionId: string,
    metricName: string,
    quantity: number
  ): Promise<void> {
    try {
      // Get subscription items
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items'],
      });

      // Find the appropriate subscription item for this metric
      const subscriptionItem = subscription.items.data.find(item => 
        item.price.metadata?.metric_name === metricName
      );

      if (subscriptionItem) {
        await stripe.subscriptionItems.createUsageRecord(subscriptionItem.id, {
          quantity,
          timestamp: Math.floor(Date.now() / 1000),
          action: 'increment',
        });
      }
    } catch (error) {
      console.error('Failed to report usage to Stripe:', error);
      // Don't throw - usage tracking should continue even if Stripe fails
    }
  }

  // Check if customer has exceeded usage limits
  async checkUsageLimits(customerId: string): Promise<boolean> {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('subscription_tier')
        .eq('id', customerId)
        .single();

      if (!customer) return false;

      const tier = SUBSCRIPTION_TIERS[customer.subscription_tier];
      if (!tier) return false;

      // Get current month usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usage } = await supabase
        .from('usage_records')
        .select('metric_name, quantity')
        .eq('customer_id', customerId)
        .gte('timestamp', startOfMonth.toISOString());

      if (!usage) return true;

      // Aggregate usage by metric
      const usageByMetric = usage.reduce((acc, record) => {
        acc[record.metric_name] = (acc[record.metric_name] || 0) + record.quantity;
        return acc;
      }, {} as Record<string, number>);

      // Check each limit
      for (const [metric, limit] of Object.entries(tier.limits)) {
        if (limit === -1) continue; // unlimited
        
        const currentUsage = usageByMetric[metric] || 0;
        if (currentUsage >= limit) {
          // Emit limit exceeded event
          await eventBus.emit({
            type: 'usage_limit_exceeded',
            data: {
              customer_id: customerId,
              metric_name: metric,
              current_usage: currentUsage,
              limit,
            },
            context: { source: 'usage_monitoring' },
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to check usage limits:', error);
      return true; // Default to allowing usage
    }
  }

  // Create Stripe customer and subscription
  async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId?: string
  ): Promise<string> {
    try {
      // Get customer data
      const { data: customer } = await supabase
        .from('customers')
        .select('email, name')
        .eq('id', customerId)
        .single();

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Create or retrieve Stripe customer
      let stripeCustomer;
      const existingCustomers = await stripe.customers.list({
        email: customer.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        stripeCustomer = existingCustomers.data[0];
      } else {
        stripeCustomer = await stripe.customers.create({
          email: customer.email,
          name: customer.name,
          metadata: { customer_id: customerId },
        });
      }

      // Attach payment method if provided
      if (paymentMethodId) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomer.id,
        });

        await stripe.customers.update(stripeCustomer.id, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Update customer in database
      await supabase
        .from('customers')
        .update({
          stripe_customer_id: stripeCustomer.id,
          subscription_id: subscription.id,
          subscription_tier: this.getTierFromPriceId(priceId),
          subscription_status: subscription.status,
        })
        .eq('id', customerId);

      return subscription.id;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  // Handle Stripe webhooks
  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook handler failed:', error);
      throw error;
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    const customerId = subscription.metadata?.customer_id;
    if (!customerId) return;

    const priceId = subscription.items.data[0]?.price.id;
    const tier = this.getTierFromPriceId(priceId);

    await supabase
      .from('customers')
      .update({
        subscription_id: subscription.id,
        subscription_tier: tier,
        subscription_status: subscription.status,
      })
      .eq('stripe_customer_id', subscription.customer);

    await eventBus.emit({
      type: 'subscription_updated',
      data: {
        customer_id: customerId,
        subscription_id: subscription.id,
        tier,
        status: subscription.status,
      },
      context: { source: 'stripe_webhook' },
    });
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
    await supabase
      .from('customers')
      .update({
        subscription_tier: 'free',
        subscription_status: 'canceled',
      })
      .eq('stripe_customer_id', subscription.customer);

    const customerId = subscription.metadata?.customer_id;
    if (customerId) {
      await eventBus.emit({
        type: 'subscription_canceled',
        data: {
          customer_id: customerId,
          subscription_id: subscription.id,
        },
        context: { source: 'stripe_webhook' },
      });
    }
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const customerId = invoice.subscription_details?.metadata?.customer_id;
    if (!customerId) return;

    await eventBus.emit({
      type: 'payment_succeeded',
      data: {
        customer_id: customerId,
        invoice_id: invoice.id,
        amount: invoice.amount_paid,
      },
      context: { source: 'stripe_webhook' },
    });
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const customerId = invoice.subscription_details?.metadata?.customer_id;
    if (!customerId) return;

    await eventBus.emit({
      type: 'payment_failed',
      data: {
        customer_id: customerId,
        invoice_id: invoice.id,
        amount: invoice.amount_due,
      },
      context: { source: 'stripe_webhook' },
    });
  }

  private getTierFromPriceId(priceId?: string): 'free' | 'pro' | 'enterprise' {
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
    if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) return 'enterprise';
    return 'free';
  }

  // Get customer usage summary
  async getUsageSummary(customerId: string): Promise<{
    tier: string;
    usage: Record<string, number>;
    limits: Record<string, number>;
    percentages: Record<string, number>;
  }> {
    const { data: customer } = await supabase
      .from('customers')
      .select('subscription_tier')
      .eq('id', customerId)
      .single();

    if (!customer) {
      throw new Error('Customer not found');
    }

    const tier = SUBSCRIPTION_TIERS[customer.subscription_tier];
    
    // Get current month usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: usage } = await supabase
      .from('usage_records')
      .select('metric_name, quantity')
      .eq('customer_id', customerId)
      .gte('timestamp', startOfMonth.toISOString());

    const usageByMetric = (usage || []).reduce((acc, record) => {
      acc[record.metric_name] = (acc[record.metric_name] || 0) + record.quantity;
      return acc;
    }, {} as Record<string, number>);

    const percentages = Object.entries(tier.limits).reduce((acc, [metric, limit]) => {
      const currentUsage = usageByMetric[metric] || 0;
      acc[metric] = limit === -1 ? 0 : (currentUsage / limit) * 100;
      return acc;
    }, {} as Record<string, number>);

    return {
      tier: customer.subscription_tier,
      usage: usageByMetric,
      limits: tier.limits,
      percentages,
    };
  }
}

export const stripeMetering = StripeMetering.getInstance();