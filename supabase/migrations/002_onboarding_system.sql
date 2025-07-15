-- Onboarding System Tables
-- This migration creates tables for tracking user onboarding progress

-- Onboarding steps enum
CREATE TYPE onboarding_step AS ENUM (
  'welcome',
  'profile_setup',
  'preferences',
  'service_categories',
  'service_details',
  'pricing_setup',
  'availability',
  'completion'
);

-- Onboarding status enum
CREATE TYPE onboarding_status AS ENUM (
  'not_started',
  'in_progress',
  'completed'
);

-- User onboarding progress table
CREATE TABLE user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('consumer', 'provider')),
  current_step onboarding_step DEFAULT 'welcome',
  completed_steps onboarding_step[] DEFAULT '{}',
  status onboarding_status DEFAULT 'not_started',
  data JSONB DEFAULT '{}', -- Store step-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consumer profile data (part of onboarding)
CREATE TABLE consumer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  phone TEXT,
  address JSONB, -- {street, city, state, zip, coordinates}
  preferences JSONB DEFAULT '{}', -- Service preferences, notification settings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider business profiles (part of onboarding)
CREATE TABLE provider_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT NOT NULL,
  business_type TEXT,
  description TEXT,
  phone TEXT,
  business_address JSONB, -- {street, city, state, zip, coordinates}
  service_areas JSONB DEFAULT '[]', -- Array of service area objects
  categories TEXT[] DEFAULT '{}', -- Service categories
  pricing_model TEXT DEFAULT 'hourly', -- hourly, fixed, custom
  base_rate DECIMAL(10,2),
  availability JSONB DEFAULT '{}', -- Weekly schedule
  certifications TEXT[] DEFAULT '{}',
  insurance_info JSONB DEFAULT '{}',
  payment_methods TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX idx_user_onboarding_status ON user_onboarding(status);
CREATE INDEX idx_consumer_profiles_user_id ON consumer_profiles(user_id);
CREATE INDEX idx_provider_profiles_user_id ON provider_profiles(user_id);

-- RLS Policies
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only access their own onboarding data
CREATE POLICY "Users can view own onboarding" ON user_onboarding
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding" ON user_onboarding
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding" ON user_onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Consumer profile policies
CREATE POLICY "Users can view own consumer profile" ON consumer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own consumer profile" ON consumer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consumer profile" ON consumer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Provider profile policies
CREATE POLICY "Users can view own provider profile" ON provider_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own provider profile" ON provider_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own provider profile" ON provider_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (can view all for moderation)
CREATE POLICY "Admins can view all onboarding" ON user_onboarding
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all consumer profiles" ON consumer_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all provider profiles" ON provider_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_onboarding_updated_at 
  BEFORE UPDATE ON user_onboarding 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consumer_profiles_updated_at 
  BEFORE UPDATE ON consumer_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at 
  BEFORE UPDATE ON provider_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize onboarding for new users
CREATE OR REPLACE FUNCTION initialize_onboarding(
  p_user_id UUID,
  p_role TEXT
)
RETURNS UUID AS $$
DECLARE
  onboarding_id UUID;
BEGIN
  INSERT INTO user_onboarding (user_id, role, status)
  VALUES (p_user_id, p_role, 'in_progress')
  RETURNING id INTO onboarding_id;
  
  RETURN onboarding_id;
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
  current_completed onboarding_step[];
BEGIN
  -- Get current completed steps
  SELECT completed_steps INTO current_completed
  FROM user_onboarding
  WHERE user_id = p_user_id;
  
  -- Add step to completed if not already there
  IF NOT (p_step = ANY(current_completed)) THEN
    current_completed := array_append(current_completed, p_step);
  END IF;
  
  -- Update onboarding record
  UPDATE user_onboarding
  SET 
    current_step = p_step,
    completed_steps = current_completed,
    data = data || p_data,
    status = CASE 
      WHEN p_step = 'completion' THEN 'completed'::onboarding_status
      ELSE 'in_progress'::onboarding_status
    END,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
