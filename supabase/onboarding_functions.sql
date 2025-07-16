-- =====================================================
-- LOCONOMY PLATFORM - ONBOARDING FUNCTIONS
-- =====================================================
-- This script creates functions specific to user onboarding
-- Run this after the main database setup
-- =====================================================

-- Function to initialize onboarding for a user
CREATE OR REPLACE FUNCTION initialize_onboarding(
  p_user_id UUID,
  p_role user_role
)
RETURNS JSONB AS $$
DECLARE
  onboarding_record user_onboarding;
BEGIN
  -- Insert or update onboarding record
  INSERT INTO user_onboarding (user_id, role, current_step, status, data)
  VALUES (p_user_id, p_role, 'welcome', 'in_progress', '{}')
  ON CONFLICT (user_id) DO UPDATE SET
    role = p_role,
    current_step = 'welcome',
    status = 'in_progress',
    updated_at = NOW()
  RETURNING * INTO onboarding_record;

  -- Update user role if different
  UPDATE user_roles 
  SET role = p_role, updated_at = NOW()
  WHERE user_id = p_user_id::TEXT;

  -- Create appropriate profile
  IF p_role = 'provider' THEN
    INSERT INTO provider_profiles (user_id, business_name, phone)
    VALUES (p_user_id, 'New Business', '')
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF p_role = 'consumer' THEN
    INSERT INTO consumer_profiles (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- Log the initialization
  INSERT INTO system_logs (level, message, component, user_id)
  VALUES ('info', 'Onboarding initialized for role: ' || p_role::TEXT, 'onboarding', p_user_id);

  -- Return the onboarding record as JSON
  RETURN row_to_json(onboarding_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update onboarding progress
CREATE OR REPLACE FUNCTION update_onboarding_progress(
  p_user_id UUID,
  p_step onboarding_step,
  p_data JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_onboarding user_onboarding;
  step_order INTEGER;
  current_step_order INTEGER;
  new_completed_steps onboarding_step[];
BEGIN
  -- Get current onboarding state
  SELECT * INTO current_onboarding
  FROM user_onboarding
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Onboarding record not found for user %', p_user_id;
  END IF;

  -- Define step orders for validation
  CASE current_onboarding.role
    WHEN 'consumer' THEN
      CASE p_step
        WHEN 'welcome' THEN step_order := 1;
        WHEN 'profile_setup' THEN step_order := 2;
        WHEN 'preferences' THEN step_order := 3;
        WHEN 'completion' THEN step_order := 4;
        ELSE RAISE EXCEPTION 'Invalid step for consumer: %', p_step;
      END CASE;

      CASE current_onboarding.current_step
        WHEN 'welcome' THEN current_step_order := 1;
        WHEN 'profile_setup' THEN current_step_order := 2;
        WHEN 'preferences' THEN current_step_order := 3;
        WHEN 'completion' THEN current_step_order := 4;
      END CASE;

    WHEN 'provider' THEN
      CASE p_step
        WHEN 'welcome' THEN step_order := 1;
        WHEN 'profile_setup' THEN step_order := 2;
        WHEN 'service_categories' THEN step_order := 3;
        WHEN 'service_details' THEN step_order := 4;
        WHEN 'pricing_setup' THEN step_order := 5;
        WHEN 'availability' THEN step_order := 6;
        WHEN 'completion' THEN step_order := 7;
        ELSE RAISE EXCEPTION 'Invalid step for provider: %', p_step;
      END CASE;

      CASE current_onboarding.current_step
        WHEN 'welcome' THEN current_step_order := 1;
        WHEN 'profile_setup' THEN current_step_order := 2;
        WHEN 'service_categories' THEN current_step_order := 3;
        WHEN 'service_details' THEN current_step_order := 4;
        WHEN 'pricing_setup' THEN current_step_order := 5;
        WHEN 'availability' THEN current_step_order := 6;
        WHEN 'completion' THEN current_step_order := 7;
      END CASE;
  END CASE;

  -- Add current step to completed steps if not already there
  new_completed_steps := current_onboarding.completed_steps;
  IF NOT (current_onboarding.current_step = ANY(new_completed_steps)) THEN
    new_completed_steps := array_append(new_completed_steps, current_onboarding.current_step);
  END IF;

  -- Merge step data with existing data
  UPDATE user_onboarding SET
    current_step = p_step,
    completed_steps = new_completed_steps,
    status = CASE 
      WHEN p_step = 'completion' THEN 'completed'::onboarding_status
      ELSE 'in_progress'::onboarding_status
    END,
    data = current_onboarding.data || p_data,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Update profile data based on step
  CASE p_step
    WHEN 'profile_setup' THEN
      IF current_onboarding.role = 'consumer' THEN
        -- Update consumer profile
        UPDATE consumer_profiles SET
          full_name = COALESCE((p_data->>'full_name')::TEXT, full_name),
          phone = COALESCE((p_data->>'phone')::TEXT, phone),
          address = COALESCE(p_data->'address', address),
          updated_at = NOW()
        WHERE user_id = p_user_id;
      ELSIF current_onboarding.role = 'provider' THEN
        -- Update provider profile
        UPDATE provider_profiles SET
          business_name = COALESCE((p_data->>'business_name')::TEXT, business_name),
          full_name = COALESCE((p_data->>'full_name')::TEXT, full_name),
          phone = COALESCE((p_data->>'phone')::TEXT, phone),
          email = COALESCE((p_data->>'email')::TEXT, email),
          bio = COALESCE((p_data->>'bio')::TEXT, bio),
          business_address = COALESCE(p_data->'business_address', business_address),
          updated_at = NOW()
        WHERE user_id = p_user_id;
      END IF;

    WHEN 'preferences' THEN
      IF current_onboarding.role = 'consumer' THEN
        UPDATE consumer_profiles SET
          preferences = COALESCE(p_data, preferences),
          updated_at = NOW()
        WHERE user_id = p_user_id;
      END IF;

    WHEN 'service_categories' THEN
      IF current_onboarding.role = 'provider' THEN
        UPDATE provider_profiles SET
          categories = COALESCE(
            (SELECT array_agg(elem::TEXT) FROM jsonb_array_elements_text(p_data->'categories')),
            categories
          ),
          updated_at = NOW()
        WHERE user_id = p_user_id;
      END IF;

    WHEN 'pricing_setup' THEN
      IF current_onboarding.role = 'provider' THEN
        UPDATE provider_profiles SET
          pricing_model = COALESCE((p_data->>'pricing_model')::TEXT, pricing_model),
          base_rate = COALESCE((p_data->>'base_rate')::DECIMAL, base_rate),
          updated_at = NOW()
        WHERE user_id = p_user_id;
      END IF;

    WHEN 'availability' THEN
      IF current_onboarding.role = 'provider' THEN
        UPDATE provider_profiles SET
          availability = COALESCE(p_data->'availability', availability),
          updated_at = NOW()
        WHERE user_id = p_user_id;
      END IF;

    WHEN 'completion' THEN
      -- Mark onboarding as completed
      UPDATE user_onboarding SET
        status = 'completed',
        updated_at = NOW()
      WHERE user_id = p_user_id;

      -- Log completion
      INSERT INTO system_logs (level, message, component, user_id)
      VALUES ('info', 'Onboarding completed for role: ' || current_onboarding.role::TEXT, 'onboarding', p_user_id);

      -- Track analytics event
      PERFORM track_analytics_event(
        'onboarding_completed',
        'onboarding',
        p_user_id,
        jsonb_build_object('role', current_onboarding.role, 'steps_completed', array_length(new_completed_steps, 1))
      );
  END CASE;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error
    INSERT INTO system_logs (level, message, component, user_id, error_details)
    VALUES (
      'error', 
      'Error updating onboarding progress: ' || SQLERRM, 
      'onboarding', 
      p_user_id,
      jsonb_build_object('step', p_step, 'error', SQLERRM)
    );
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get onboarding progress with profile data
CREATE OR REPLACE FUNCTION get_onboarding_progress_with_profile(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  onboarding_data user_onboarding;
  profile_data JSONB;
  result JSONB;
BEGIN
  -- Get onboarding data
  SELECT * INTO onboarding_data
  FROM user_onboarding
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Get profile data based on role
  IF onboarding_data.role = 'consumer' THEN
    SELECT to_jsonb(cp.*) INTO profile_data
    FROM consumer_profiles cp
    WHERE cp.user_id = p_user_id;
  ELSIF onboarding_data.role = 'provider' THEN
    SELECT to_jsonb(pp.*) INTO profile_data
    FROM provider_profiles pp
    WHERE pp.user_id = p_user_id;
  END IF;

  -- Combine onboarding and profile data
  result := row_to_json(onboarding_data)::JSONB;
  IF profile_data IS NOT NULL THEN
    result := result || jsonb_build_object('profile', profile_data);
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if onboarding is required
CREATE OR REPLACE FUNCTION is_onboarding_required(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  onboarding_status onboarding_status;
BEGIN
  SELECT status INTO onboarding_status
  FROM user_onboarding
  WHERE user_id = p_user_id;

  -- If no onboarding record or not completed, onboarding is required
  RETURN (onboarding_status IS NULL OR onboarding_status != 'completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset onboarding (for admin/debugging)
CREATE OR REPLACE FUNCTION reset_onboarding(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_onboarding SET
    current_step = 'welcome',
    completed_steps = '{}',
    status = 'not_started',
    data = '{}',
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Log the reset
  INSERT INTO system_logs (level, message, component, user_id)
  VALUES ('info', 'Onboarding reset', 'onboarding', p_user_id);

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION initialize_onboarding(UUID, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION update_onboarding_progress(UUID, onboarding_step, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_onboarding_progress_with_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_onboarding_required(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_onboarding(UUID) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Onboarding functions created successfully!';
  RAISE NOTICE 'Available functions:';
  RAISE NOTICE '- initialize_onboarding(user_id, role)';
  RAISE NOTICE '- update_onboarding_progress(user_id, step, data)';
  RAISE NOTICE '- get_onboarding_progress_with_profile(user_id)';
  RAISE NOTICE '- is_onboarding_required(user_id)';
  RAISE NOTICE '- reset_onboarding(user_id)';
END $$;
