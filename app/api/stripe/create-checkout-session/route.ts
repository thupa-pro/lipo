import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Zod schema for input validation
    const bodySchema = z.object({
      plan_id: z.string().min(1),
      billing_cycle: z.enum(["monthly", "yearly"]),
      success_url: z.string().url().optional(),
      cancel_url: z.string().url().optional(),
    });

    let json;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parseResult = bodySchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid input", details: parseResult.error.errors }, { status: 400 });
    }

    const { plan_id, billing_cycle, success_url, cancel_url } = parseResult.data;

    if (!plan_id || !billing_cycle) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Get the plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("plan_id", plan_id)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Skip checkout for free plan
    if (plan_id === "free") {
      return NextResponse.json({
        message: "Free plan activated",
        plan_id: "free",
      });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;

    // Check if user already has a Stripe customer ID
    const { data: existingSubscription } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingSubscription?.stripe_customer_id) {
      stripeCustomerId = existingSubscription.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        metadata: {
          user_id: userId,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Determine the price ID based on billing cycle
    const priceId =
      billing_cycle === "yearly"
        ? plan.stripe_price_id_yearly
        : plan.stripe_price_id_monthly;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID not configured for this plan" },
        { status: 400 },
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        success_url ||
        `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/plans`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: plan_id,
          billing_cycle: billing_cycle,
        },
        trial_period_days: plan_id === "starter" ? 14 : undefined, // 14-day trial for starter plan
      },
      metadata: {
        user_id: userId,
        plan_id: plan_id,
        billing_cycle: billing_cycle,
      },
    });

    return NextResponse.json({
      session_id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
