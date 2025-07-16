import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription, supabase);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, supabase);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, supabase);
        break;
      }

      case "customer.created":
      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        await handleCustomerUpdate(customer, supabase);
        break;
      }

      case "payment_method.attached": {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodAttached(paymentMethod, supabase);
        break;
      }

      case "payment_method.detached": {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodDetached(paymentMethod, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Log the event
    await supabase.from("subscription_events").insert({
      user_id: null, // Will be updated when we can extract user_id
      event_type: event.type,
      stripe_event_id: event.id,
      event_data: event.data,
      processed: true,
      processed_at: new Date().toISOString(),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);

    // Log the failed event
    await supabase.from("subscription_events").insert({
      user_id: null,
      event_type: event.type,
      stripe_event_id: event.id,
      event_data: event.data,
      processed: false,
      error_message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: any,
) {
  const userId = subscription.metadata.user_id;
  const planId = subscription.metadata.plan_id;
  const billingCycle = subscription.metadata.billing_cycle || "monthly";

  if (!userId) {
    console.error("No user_id in subscription metadata");
    return;
  }

  const subscriptionData = {
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0]?.price.id,
    plan_id: planId,
    status: subscription.status,
    billing_cycle: billingCycle,
    current_period_start: new Date(
      subscription.current_period_start * 1000,
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000,
    ).toISOString(),
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    ended_at: subscription.ended_at
      ? new Date(subscription.ended_at * 1000).toISOString()
      : null,
  };

  // Upsert subscription
  const { error } = await supabase
    .from("user_subscriptions")
    .upsert(subscriptionData, {
      onConflict: "stripe_subscription_id",
      ignoreDuplicates: false,
    });

  if (error) {
    console.error("Error upserting subscription:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any,
) {
  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      status: "canceled",
      ended_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Error updating deleted subscription:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any,
) {
  // Get user_id from subscription
  let userId: string | null = null;

  if (invoice.subscription) {
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", invoice.subscription)
      .single();

    userId = subscription?.user_id;
  }

  if (!userId) {
    console.error("Could not find user for invoice");
    return;
  }

  // Get subscription record
  const { data: subscriptionRecord } = await supabase
    .from("user_subscriptions")
    .select("id")
    .eq("stripe_subscription_id", invoice.subscription)
    .single();

  const invoiceData = {
    user_id: userId,
    subscription_id: subscriptionRecord?.id,
    stripe_invoice_id: invoice.id,
    stripe_customer_id: invoice.customer as string,
    stripe_subscription_id: invoice.subscription as string,
    status: "paid",
    amount_due: invoice.amount_due / 100, // Convert from cents
    amount_paid: invoice.amount_paid / 100,
    currency: invoice.currency,
    invoice_date: new Date(invoice.created * 1000).toISOString(),
    due_date: invoice.due_date
      ? new Date(invoice.due_date * 1000).toISOString()
      : null,
    paid_at: new Date().toISOString(),
    line_items: invoice.lines.data,
    invoice_pdf: invoice.invoice_pdf,
    hosted_invoice_url: invoice.hosted_invoice_url,
  };

  const { error } = await supabase.from("stripe_invoices").upsert(invoiceData, {
    onConflict: "stripe_invoice_id",
    ignoreDuplicates: false,
  });

  if (error) {
    console.error("Error upserting invoice:", error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: any,
) {
  // Similar to payment succeeded but with failed status
  await handleInvoicePaymentSucceeded(invoice, supabase);

  // Update status to reflect failure
  await supabase
    .from("stripe_invoices")
    .update({ status: "open", paid_at: null })
    .eq("stripe_invoice_id", invoice.id);
}

async function handleCustomerUpdate(customer: Stripe.Customer, supabase: any) {
  // Update customer information if needed
  // This is mainly for keeping customer data in sync
  console.log(`Customer ${customer.id} updated`);
}

async function handlePaymentMethodAttached(
  paymentMethod: Stripe.PaymentMethod,
  supabase: any,
) {
  if (!paymentMethod.customer) return;

  // Get user_id from customer
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", paymentMethod.customer)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!subscription?.user_id) return;

  const paymentMethodData = {
    user_id: subscription.user_id,
    stripe_payment_method_id: paymentMethod.id,
    stripe_customer_id: paymentMethod.customer as string,
    type: paymentMethod.type,
    card_brand: paymentMethod.card?.brand,
    card_last4: paymentMethod.card?.last4,
    card_exp_month: paymentMethod.card?.exp_month,
    card_exp_year: paymentMethod.card?.exp_year,
    is_default: false, // Will be set separately
    is_active: true,
  };

  const { error } = await supabase
    .from("user_payment_methods")
    .upsert(paymentMethodData, {
      onConflict: "stripe_payment_method_id",
      ignoreDuplicates: false,
    });

  if (error) {
    console.error("Error upserting payment method:", error);
  }
}

async function handlePaymentMethodDetached(
  paymentMethod: Stripe.PaymentMethod,
  supabase: any,
) {
  const { error } = await supabase
    .from("user_payment_methods")
    .update({ is_active: false })
    .eq("stripe_payment_method_id", paymentMethod.id);

  if (error) {
    console.error("Error deactivating payment method:", error);
  }
}
