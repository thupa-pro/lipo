-- Migration: 007_referral_system.sql
-- Description: Create comprehensive referral and affiliate tracking system
-- Date: 2024

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Referral Programs Table
CREATE TABLE IF NOT EXISTS referral_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  referrer_reward DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  referee_reward DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  minimum_spending DECIMAL(10,2),
  expiry_days INTEGER,
  max_uses_per_user INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  terms_and_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Referral Codes Table
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  uses_count INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes
  CONSTRAINT referral_codes_code_length CHECK (LENGTH(code) >= 3 AND LENGTH(code) <= 20),
  CONSTRAINT referral_codes_max_uses_positive CHECK (max_uses IS NULL OR max_uses > 0)
);

-- 3. Referral History Table
CREATE TABLE IF NOT EXISTS referral_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT,
  referral_code TEXT NOT NULL,
  referral_source TEXT NOT NULL DEFAULT 'direct_link',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reward_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  first_booking_id UUID,
  
  -- Constraints
  CONSTRAINT referral_history_no_self_referral CHECK (referrer_id != referred_user_id),
  CONSTRAINT referral_history_reward_positive CHECK (reward_amount >= 0)
);

-- 4. Referral Rewards Table
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id UUID NOT NULL REFERENCES referral_history(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL DEFAULT 'credit' CHECK (reward_type IN ('credit', 'cash', 'discount')),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'credited', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  credited_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT referral_rewards_amount_positive CHECK (amount > 0)
);

-- 5. Referral Tiers Table
CREATE TABLE IF NOT EXISTS referral_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  min_referrals INTEGER NOT NULL,
  max_referrals INTEGER,
  bonus_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  benefits TEXT[] DEFAULT '{}',
  badge_icon TEXT,
  badge_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT referral_tiers_min_referrals_positive CHECK (min_referrals >= 0),
  CONSTRAINT referral_tiers_max_referrals_valid CHECK (max_referrals IS NULL OR max_referrals >= min_referrals),
  CONSTRAINT referral_tiers_multiplier_positive CHECK (bonus_multiplier > 0)
);

-- 6. Referral Events Table (for tracking and analytics)
CREATE TABLE IF NOT EXISTS referral_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id UUID NOT NULL REFERENCES referral_history(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'first_booking', 'reward_credited', 'tier_upgraded')),
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Referral Campaigns Table
CREATE TABLE IF NOT EXISTS referral_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('seasonal', 'promotional', 'tier_based', 'category_specific')),
  target_audience TEXT[],
  bonus_reward DECIMAL(10,2) NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  conditions JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT referral_campaigns_date_valid CHECK (end_date > start_date),
  CONSTRAINT referral_campaigns_bonus_positive CHECK (bonus_reward >= 0)
);

-- 8. Affiliate Commissions Table
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT affiliate_commissions_rate_valid CHECK (commission_rate >= 0 AND commission_rate <= 1),
  CONSTRAINT affiliate_commissions_amount_positive CHECK (commission_amount >= 0)
);

-- 9. Social Share Templates Table
CREATE TABLE IF NOT EXISTS social_share_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL CHECK (platform IN ('email', 'twitter', 'facebook', 'linkedin', 'whatsapp', 'sms')),
  template_name TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  call_to_action TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Referral Badges Table (for gamification)
CREATE TABLE IF NOT EXISTS referral_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('referral_count', 'earnings', 'streak', 'special')),
  requirement_value INTEGER NOT NULL,
  is_rare BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. User Referral Badges Table
CREATE TABLE IF NOT EXISTS user_referral_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES referral_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_displayed BOOLEAN NOT NULL DEFAULT true,
  
  -- Unique constraint to prevent duplicate badges
  UNIQUE(user_id, badge_id)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_referral_history_referrer ON referral_history(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_history_referred ON referral_history(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_history_code ON referral_history(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_history_status ON referral_history(status);
CREATE INDEX IF NOT EXISTS idx_referral_history_created_at ON referral_history(created_at);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id ON referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);

CREATE INDEX IF NOT EXISTS idx_referral_events_referral_id ON referral_events(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_events_type ON referral_events(event_type);
CREATE INDEX IF NOT EXISTS idx_referral_events_created_at ON referral_events(created_at);

CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_booking ON affiliate_commissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status ON affiliate_commissions(status);

CREATE INDEX IF NOT EXISTS idx_user_referral_badges_user ON user_referral_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referral_badges_badge ON user_referral_badges(badge_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_share_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referral_badges ENABLE ROW LEVEL SECURITY;

-- Referral Programs - Public read access
CREATE POLICY "Anyone can view active referral programs" ON referral_programs
  FOR SELECT USING (is_active = true);

-- Referral Codes - Users can manage their own codes
CREATE POLICY "Users can view their own referral codes" ON referral_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referral codes" ON referral_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral codes" ON referral_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- Referral History - Users can view referrals they made or received
CREATE POLICY "Users can view referrals they made or received" ON referral_history
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

CREATE POLICY "System can insert referral history" ON referral_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update referral history" ON referral_history
  FOR UPDATE USING (true);

-- Referral Rewards - Users can view their own rewards
CREATE POLICY "Users can view their own rewards" ON referral_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage rewards" ON referral_rewards
  FOR ALL USING (true);

-- Referral Tiers - Public read access
CREATE POLICY "Anyone can view referral tiers" ON referral_tiers
  FOR SELECT USING (true);

-- Referral Events - Users can view events for their referrals
CREATE POLICY "Users can view events for their referrals" ON referral_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM referral_history rh 
      WHERE rh.id = referral_id 
      AND (rh.referrer_id = auth.uid() OR rh.referred_user_id = auth.uid())
    )
  );

-- Referral Campaigns - Public read access for active campaigns
CREATE POLICY "Anyone can view active campaigns" ON referral_campaigns
  FOR SELECT USING (is_active = true);

-- Affiliate Commissions - Users can view their own commissions
CREATE POLICY "Users can view their own commissions" ON affiliate_commissions
  FOR SELECT USING (auth.uid() = affiliate_id);

-- Social Share Templates - Public read access
CREATE POLICY "Anyone can view active share templates" ON social_share_templates
  FOR SELECT USING (is_active = true);

-- Referral Badges - Public read access
CREATE POLICY "Anyone can view referral badges" ON referral_badges
  FOR SELECT USING (true);

-- User Referral Badges - Users can view their own badges
CREATE POLICY "Users can view their own badges" ON user_referral_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Insert default data

-- Default referral program
INSERT INTO referral_programs (
  name,
  description,
  referrer_reward,
  referee_reward,
  terms_and_conditions
) VALUES (
  'Default Referral Program',
  'Refer friends and earn rewards when they make their first booking',
  10.00,
  10.00,
  'Referrer gets $10 credit when referred user makes their first booking. Referee gets $10 credit upon signup.'
) ON CONFLICT DO NOTHING;

-- Default referral tiers
INSERT INTO referral_tiers (name, min_referrals, max_referrals, bonus_multiplier, benefits) VALUES
  ('Bronze', 0, 4, 1.00, ARRAY['Basic referral rewards']),
  ('Silver', 5, 14, 1.25, ARRAY['25% bonus on rewards', 'Priority support']),
  ('Gold', 15, 29, 1.50, ARRAY['50% bonus on rewards', 'Exclusive campaigns', 'Monthly bonus']),
  ('Platinum', 30, NULL, 2.00, ARRAY['100% bonus on rewards', 'Personal account manager', 'Special events access'])
ON CONFLICT DO NOTHING;

-- Default social share templates
INSERT INTO social_share_templates (platform, template_name, subject, message, call_to_action, variables) VALUES
  ('email', 'Default Email Template', 'Join me on Loconomy!', 'Hey! I''ve been using Loconomy to find amazing local services and thought you''d love it too. Use my referral link and we''ll both get $10 credit!', 'Sign up now', ARRAY['referrer_name', 'referral_link']),
  ('twitter', 'Default Twitter Template', NULL, 'Just discovered @Loconomy - the best way to find local services! Join me and get $10 credit:', 'Sign up', ARRAY['referral_link']),
  ('facebook', 'Default Facebook Template', NULL, 'I''ve been loving Loconomy for finding local services. Join me and we''ll both get $10!', 'Get started', ARRAY['referrer_name', 'referral_link']),
  ('whatsapp', 'Default WhatsApp Template', NULL, 'Hey! Check out Loconomy - I''ve been using it to find great local services. Use my link and we both get $10!', 'Join now', ARRAY['referrer_name', 'referral_link'])
ON CONFLICT DO NOTHING;

-- Default referral badges
INSERT INTO referral_badges (name, description, icon, color, requirement_type, requirement_value) VALUES
  ('First Referral', 'Made your first successful referral', '🎯', '#3B82F6', 'referral_count', 1),
  ('Referral Champion', 'Successfully referred 5 users', '🏆', '#F59E0B', 'referral_count', 5),
  ('Super Referrer', 'Successfully referred 10 users', '⭐', '#10B981', 'referral_count', 10),
  ('Referral Master', 'Successfully referred 25 users', '👑', '#8B5CF6', 'referral_count', 25),
  ('Big Earner', 'Earned $100 in referral rewards', '💰', '#EF4444', 'earnings', 100),
  ('Top Performer', 'Earned $500 in referral rewards', '🚀', '#F97316', 'earnings', 500)
ON CONFLICT DO NOTHING;

-- Create triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_referral_programs_updated_at 
  BEFORE UPDATE ON referral_programs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_campaigns_updated_at 
  BEFORE UPDATE ON referral_campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_share_templates_updated_at 
  BEFORE UPDATE ON social_share_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add function to auto-create referral codes for new users
CREATE OR REPLACE FUNCTION auto_create_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO referral_codes (user_id, code)
  VALUES (
    NEW.id,
    UPPER(SUBSTR(MD5(NEW.id::TEXT || EXTRACT(EPOCH FROM NOW())::TEXT), 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-creating referral codes
CREATE TRIGGER on_auth_user_created_referral_code
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auto_create_referral_code();

-- Comments for documentation
COMMENT ON TABLE referral_programs IS 'Configuration and settings for referral programs';
COMMENT ON TABLE referral_codes IS 'User-specific referral codes for tracking';
COMMENT ON TABLE referral_history IS 'Complete history of all referral events';
COMMENT ON TABLE referral_rewards IS 'Reward transactions for successful referrals';
COMMENT ON TABLE referral_tiers IS 'Tier system for referral achievements';
COMMENT ON TABLE referral_events IS 'Event logging for referral analytics';
COMMENT ON TABLE referral_campaigns IS 'Marketing campaigns for referral programs';
COMMENT ON TABLE affiliate_commissions IS 'Commission tracking for affiliate partners';
COMMENT ON TABLE social_share_templates IS 'Templates for social media sharing';
COMMENT ON TABLE referral_badges IS 'Gamification badges for referral achievements';
COMMENT ON TABLE user_referral_badges IS 'User-earned badges tracking';
