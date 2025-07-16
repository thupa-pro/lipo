-- Billing System Database Functions
-- These functions handle billing operations and Stripe integration

-- Function to get current subscription for a user
CREATE OR REPLACE FUNCTION get_current_subscription(user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT row_to_json(subscription_data) INTO result
  FROM (
    SELECT 
      s.id,
      s.stripe_subscription_id,
      s.status,
      s.current_period_start,
      s.current_period_end,
      s.trial_start,
      s.trial_end,
      s.cancel_at_period_end,
      s.canceled_at,
      s.quantity,
      s.metadata,
      json_build_object(
        'id', sp.id,
        'name', sp.name,
        'description', sp.description,
        'amount', sp.amount,
        'currency', sp.currency,
        'interval', sp.interval,
        'features', sp.features,
        'limits', sp.limits
      ) as plan
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.user_id = get_current_subscription.user_id
    AND s.status IN ('active', 'trialing', 'past_due')
    ORDER BY s.created_at DESC
    LIMIT 1
  ) subscription_data;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get billing overview
CREATE OR REPLACE FUNCTION get_billing_overview(user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
  result JSON;
  monthly_spend DECIMAL;
  yearly_spend DECIMAL;
  next_payment_amount INTEGER;
  next_payment_date TIMESTAMP;
  total_invoices INTEGER;
  total_paid DECIMAL;
BEGIN
  -- Calculate monthly spend (last 30 days)
  SELECT COALESCE(SUM(total), 0) INTO monthly_spend
  FROM invoices
  WHERE user_id = get_billing_overview.user_id
  AND status = 'paid'
  AND created_at >= NOW() - INTERVAL '30 days';

  -- Calculate yearly spend
  SELECT COALESCE(SUM(total), 0) INTO yearly_spend
  FROM invoices
  WHERE user_id = get_billing_overview.user_id
  AND status = 'paid'
  AND created_at >= NOW() - INTERVAL '1 year';

  -- Get next payment info from active subscription
  SELECT 
    sp.amount * s.quantity,
    s.current_period_end
  INTO next_payment_amount, next_payment_date
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = get_billing_overview.user_id
  AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- Get total invoices count
  SELECT COUNT(*) INTO total_invoices
  FROM invoices
  WHERE user_id = get_billing_overview.user_id;

  -- Get total paid amount
  SELECT COALESCE(SUM(total), 0) INTO total_paid
  FROM invoices
  WHERE user_id = get_billing_overview.user_id
  AND status = 'paid';

  -- Build result
  result := json_build_object(
    'monthlySpend', monthly_spend,
    'yearlySpend', yearly_spend,
    'nextPaymentAmount', COALESCE(next_payment_amount, 0),
    'nextPaymentDate', EXTRACT(EPOCH FROM next_payment_date),
    'totalInvoices', total_invoices,
    'totalPaid', total_paid,
    'credits', 0,
    'currency', 'USD'
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get usage data
CREATE OR REPLACE FUNCTION get_usage_data(user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
  result JSON;
  current_period_start TIMESTAMP;
  current_period_end TIMESTAMP;
  plan_limits JSONB;
  listings_used INTEGER;
  bookings_used INTEGER;
  api_calls_used INTEGER;
  storage_used INTEGER;
  team_members_used INTEGER;
  current_usage_percent DECIMAL;
BEGIN
  -- Get current billing period from active subscription
  SELECT s.current_period_start, s.current_period_end, sp.limits
  INTO current_period_start, current_period_end, plan_limits
  FROM subscriptions s
  JOIN subscription_plans sp ON s.plan_id = sp.id
  WHERE s.user_id = get_usage_data.user_id
  AND s.status IN ('active', 'trialing')
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- If no subscription, use current month
  IF current_period_start IS NULL THEN
    current_period_start := DATE_TRUNC('month', NOW());
    current_period_end := DATE_TRUNC('month', NOW()) + INTERVAL '1 month';
    plan_limits := '{"listings": 3, "bookings": 10, "apiCalls": 100, "storage": 1, "teamMembers": 1}'::jsonb;
  END IF;

  -- Get actual usage (simplified - in real implementation would query actual usage tables)
  SELECT COUNT(*) INTO listings_used FROM listings WHERE user_id = get_usage_data.user_id AND created_at >= current_period_start;
  SELECT COUNT(*) INTO bookings_used FROM bookings WHERE provider_id = get_usage_data.user_id AND created_at >= current_period_start;
  
  -- Mock other usage data
  api_calls_used := FLOOR(RANDOM() * 500 + 100);
  storage_used := FLOOR(RANDOM() * 3 + 1);
  team_members_used := 1;

  -- Calculate overall usage percentage (simplified)
  current_usage_percent := LEAST(
    CASE 
      WHEN (plan_limits->>'listings')::integer = -1 THEN 0
      ELSE (listings_used::DECIMAL / GREATEST((plan_limits->>'listings')::integer, 1)) * 100
    END +
    CASE 
      WHEN (plan_limits->>'bookings')::integer = -1 THEN 0
      ELSE (bookings_used::DECIMAL / GREATEST((plan_limits->>'bookings')::integer, 1)) * 100
    END
  ) / 2;

  -- Build result
  result := json_build_object(
    'currentUsage', current_usage_percent,
    'monthlyQuota', 100,
    'usedThisMonth', current_usage_percent,
    'breakdown', json_build_object(
      'listings', json_build_object(
        'used', listings_used,
        'limit', (plan_limits->>'listings')::integer
      ),
      'bookings', json_build_object(
        'used', bookings_used,
        'limit', (plan_limits->>'bookings')::integer
      ),
      'apiCalls', json_build_object(
        'used', api_calls_used,
        'limit', (plan_limits->>'apiCalls')::integer
      ),
      'storage', json_build_object(
        'used', storage_used,
        'limit', (plan_limits->>'storage')::integer
      ),
      'teamMembers', json_build_object(
        'used', team_members_used,
        'limit', (plan_limits->>'teamMembers')::integer
      )
    ),
    'usageHistory', json_build_array(),
    'overage', json_build_object(
      'enabled', true,
      'costs', json_build_object(
        'listings', 2.00,
        'bookings', 0.50,
        'apiCalls', 0.01,
        'storage', 5.00
      )
    )
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available plans
CREATE OR REPLACE FUNCTION get_available_plans()
RETURNS SETOF subscription_plans AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM subscription_plans
  WHERE is_active = true
  ORDER BY amount ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get invoices for a user
CREATE OR REPLACE FUNCTION get_invoices(
  user_id UUID DEFAULT auth.uid(),
  limit_count INTEGER DEFAULT 10,
  starting_after TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(invoice_data ORDER BY created_at DESC) INTO result
  FROM (
    SELECT 
      i.id,
      i.stripe_invoice_id,
      i.invoice_number,
      i.status,
      i.currency,
      i.amount_due,
      i.amount_paid,
      i.amount_remaining,
      i.subtotal,
      i.total,
      i.tax,
      i.period_start,
      i.period_end,
      i.due_date,
      i.paid_at,
      i.hosted_invoice_url,
      i.invoice_pdf_url,
      i.description,
      EXTRACT(EPOCH FROM i.created_at)::bigint as created,
      EXTRACT(EPOCH FROM i.updated_at)::bigint as updated,
      json_build_object(
        'object', 'list',
        'data', COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', ili.id,
                'description', ili.description,
                'amount', ili.amount,
                'currency', ili.currency,
                'quantity', ili.quantity,
                'unit_amount', ili.unit_amount,
                'period', json_build_object(
                  'start', EXTRACT(EPOCH FROM ili.period_start)::bigint,
                  'end', EXTRACT(EPOCH FROM ili.period_end)::bigint
                )
              )
            )
            FROM invoice_line_items ili
            WHERE ili.invoice_id = i.id
          ),
          '[]'::json
        ),
        'has_more', false,
        'total_count', (
          SELECT COUNT(*)
          FROM invoice_line_items ili
          WHERE ili.invoice_id = i.id
        )
      ) as lines
    FROM invoices i
    WHERE i.user_id = get_invoices.user_id
    ORDER BY i.created_at DESC
    LIMIT limit_count
  ) invoice_data;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get payment methods
CREATE OR REPLACE FUNCTION get_payment_methods(user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', pm.id,
      'stripe_payment_method_id', pm.stripe_payment_method_id,
      'type', pm.type,
      'card', CASE 
        WHEN pm.type = 'card' THEN json_build_object(
          'brand', pm.card_brand,
          'last4', pm.card_last4,
          'exp_month', pm.card_exp_month,
          'exp_year', pm.card_exp_year
        )
        ELSE NULL
      END,
      'billing_details', pm.billing_details,
      'is_default', pm.is_default,
      'created', EXTRACT(EPOCH FROM pm.created_at)::bigint
    )
    ORDER BY pm.is_default DESC, pm.created_at DESC
  ) INTO result
  FROM payment_methods pm
  WHERE pm.user_id = get_payment_methods.user_id;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or update customer
CREATE OR REPLACE FUNCTION upsert_customer(
  user_id UUID,
  stripe_customer_id TEXT,
  email TEXT DEFAULT NULL,
  name TEXT DEFAULT NULL
)
RETURNS customers AS $$
DECLARE
  customer_record customers;
BEGIN
  INSERT INTO customers (user_id, stripe_customer_id, email, name)
  VALUES (user_id, stripe_customer_id, email, name)
  ON CONFLICT (stripe_customer_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW()
  RETURNING * INTO customer_record;

  RETURN customer_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync subscription from Stripe
CREATE OR REPLACE FUNCTION sync_subscription(
  stripe_subscription_id TEXT,
  user_id UUID,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  status TEXT,
  current_period_start BIGINT,
  current_period_end BIGINT,
  trial_start BIGINT DEFAULT NULL,
  trial_end BIGINT DEFAULT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at BIGINT DEFAULT NULL,
  quantity INTEGER DEFAULT 1
)
RETURNS subscriptions AS $$
DECLARE
  customer_record customers;
  plan_record subscription_plans;
  subscription_record subscriptions;
BEGIN
  -- Get or create customer
  SELECT * INTO customer_record
  FROM customers
  WHERE stripe_customer_id = sync_subscription.stripe_customer_id;

  IF customer_record IS NULL THEN
    INSERT INTO customers (user_id, stripe_customer_id)
    VALUES (sync_subscription.user_id, sync_subscription.stripe_customer_id)
    RETURNING * INTO customer_record;
  END IF;

  -- Get plan
  SELECT * INTO plan_record
  FROM subscription_plans
  WHERE stripe_price_id = sync_subscription.stripe_price_id;

  IF plan_record IS NULL THEN
    RAISE EXCEPTION 'Plan not found for price_id: %', stripe_price_id;
  END IF;

  -- Upsert subscription
  INSERT INTO subscriptions (
    user_id,
    customer_id,
    stripe_subscription_id,
    plan_id,
    status,
    current_period_start,
    current_period_end,
    trial_start,
    trial_end,
    cancel_at_period_end,
    canceled_at,
    quantity
  ) VALUES (
    sync_subscription.user_id,
    customer_record.id,
    sync_subscription.stripe_subscription_id,
    plan_record.id,
    sync_subscription.status,
    TO_TIMESTAMP(sync_subscription.current_period_start),
    TO_TIMESTAMP(sync_subscription.current_period_end),
    CASE WHEN sync_subscription.trial_start IS NOT NULL THEN TO_TIMESTAMP(sync_subscription.trial_start) END,
    CASE WHEN sync_subscription.trial_end IS NOT NULL THEN TO_TIMESTAMP(sync_subscription.trial_end) END,
    sync_subscription.cancel_at_period_end,
    CASE WHEN sync_subscription.canceled_at IS NOT NULL THEN TO_TIMESTAMP(sync_subscription.canceled_at) END,
    sync_subscription.quantity
  )
  ON CONFLICT (stripe_subscription_id)
  DO UPDATE SET
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    trial_start = EXCLUDED.trial_start,
    trial_end = EXCLUDED.trial_end,
    cancel_at_period_end = EXCLUDED.cancel_at_period_end,
    canceled_at = EXCLUDED.canceled_at,
    quantity = EXCLUDED.quantity,
    updated_at = NOW()
  RETURNING * INTO subscription_record;

  RETURN subscription_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync invoice from Stripe
CREATE OR REPLACE FUNCTION sync_invoice(
  stripe_invoice_id TEXT,
  user_id UUID,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT DEFAULT NULL,
  invoice_number TEXT DEFAULT NULL,
  status TEXT DEFAULT 'draft',
  currency TEXT DEFAULT 'usd',
  amount_due INTEGER DEFAULT 0,
  amount_paid INTEGER DEFAULT 0,
  amount_remaining INTEGER DEFAULT 0,
  subtotal INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  period_start BIGINT DEFAULT NULL,
  period_end BIGINT DEFAULT NULL,
  due_date BIGINT DEFAULT NULL,
  paid_at BIGINT DEFAULT NULL,
  hosted_invoice_url TEXT DEFAULT NULL,
  invoice_pdf_url TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL
)
RETURNS invoices AS $$
DECLARE
  customer_record customers;
  subscription_record subscriptions;
  invoice_record invoices;
BEGIN
  -- Get customer
  SELECT * INTO customer_record
  FROM customers
  WHERE stripe_customer_id = sync_invoice.stripe_customer_id;

  -- Get subscription if provided
  IF stripe_subscription_id IS NOT NULL THEN
    SELECT * INTO subscription_record
    FROM subscriptions
    WHERE stripe_subscription_id = sync_invoice.stripe_subscription_id;
  END IF;

  -- Upsert invoice
  INSERT INTO invoices (
    user_id,
    customer_id,
    subscription_id,
    stripe_invoice_id,
    invoice_number,
    status,
    currency,
    amount_due,
    amount_paid,
    amount_remaining,
    subtotal,
    total,
    tax,
    period_start,
    period_end,
    due_date,
    paid_at,
    hosted_invoice_url,
    invoice_pdf_url,
    description
  ) VALUES (
    sync_invoice.user_id,
    customer_record.id,
    subscription_record.id,
    sync_invoice.stripe_invoice_id,
    sync_invoice.invoice_number,
    sync_invoice.status,
    sync_invoice.currency,
    sync_invoice.amount_due,
    sync_invoice.amount_paid,
    sync_invoice.amount_remaining,
    sync_invoice.subtotal,
    sync_invoice.total,
    sync_invoice.tax,
    CASE WHEN sync_invoice.period_start IS NOT NULL THEN TO_TIMESTAMP(sync_invoice.period_start) END,
    CASE WHEN sync_invoice.period_end IS NOT NULL THEN TO_TIMESTAMP(sync_invoice.period_end) END,
    CASE WHEN sync_invoice.due_date IS NOT NULL THEN TO_TIMESTAMP(sync_invoice.due_date) END,
    CASE WHEN sync_invoice.paid_at IS NOT NULL THEN TO_TIMESTAMP(sync_invoice.paid_at) END,
    sync_invoice.hosted_invoice_url,
    sync_invoice.invoice_pdf_url,
    sync_invoice.description
  )
  ON CONFLICT (stripe_invoice_id)
  DO UPDATE SET
    invoice_number = EXCLUDED.invoice_number,
    status = EXCLUDED.status,
    amount_due = EXCLUDED.amount_due,
    amount_paid = EXCLUDED.amount_paid,
    amount_remaining = EXCLUDED.amount_remaining,
    subtotal = EXCLUDED.subtotal,
    total = EXCLUDED.total,
    tax = EXCLUDED.tax,
    period_start = EXCLUDED.period_start,
    period_end = EXCLUDED.period_end,
    due_date = EXCLUDED.due_date,
    paid_at = EXCLUDED.paid_at,
    hosted_invoice_url = EXCLUDED.hosted_invoice_url,
    invoice_pdf_url = EXCLUDED.invoice_pdf_url,
    description = EXCLUDED.description,
    updated_at = NOW()
  RETURNING * INTO invoice_record;

  RETURN invoice_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
  user_id UUID,
  metric_name TEXT,
  metric_value INTEGER,
  period_start TIMESTAMP DEFAULT NULL,
  period_end TIMESTAMP DEFAULT NULL
)
RETURNS usage_tracking AS $$
DECLARE
  usage_record usage_tracking;
  calc_period_start TIMESTAMP;
  calc_period_end TIMESTAMP;
BEGIN
  -- Calculate period if not provided (use current billing period or month)
  IF period_start IS NULL OR period_end IS NULL THEN
    SELECT s.current_period_start, s.current_period_end
    INTO calc_period_start, calc_period_end
    FROM subscriptions s
    WHERE s.user_id = track_usage.user_id
    AND s.status IN ('active', 'trialing')
    ORDER BY s.created_at DESC
    LIMIT 1;

    -- Fall back to current month if no subscription
    IF calc_period_start IS NULL THEN
      calc_period_start := DATE_TRUNC('month', NOW());
      calc_period_end := calc_period_start + INTERVAL '1 month';
    END IF;
  ELSE
    calc_period_start := period_start;
    calc_period_end := period_end;
  END IF;

  -- Insert or update usage record
  INSERT INTO usage_tracking (
    user_id,
    metric_name,
    metric_value,
    period_start,
    period_end
  ) VALUES (
    track_usage.user_id,
    track_usage.metric_name,
    track_usage.metric_value,
    calc_period_start,
    calc_period_end
  )
  ON CONFLICT (user_id, metric_name, period_start, period_end)
  DO UPDATE SET
    metric_value = EXCLUDED.metric_value
  RETURNING * INTO usage_record;

  RETURN usage_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_current_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_billing_overview(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_usage_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_plans() TO authenticated;
GRANT EXECUTE ON FUNCTION get_invoices(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_methods(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_customer(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sync_subscription(TEXT, UUID, TEXT, TEXT, TEXT, BIGINT, BIGINT, BIGINT, BIGINT, BOOLEAN, BIGINT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION sync_invoice(TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, BIGINT, BIGINT, BIGINT, BIGINT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION track_usage(UUID, TEXT, INTEGER, TIMESTAMP, TIMESTAMP) TO authenticated;
