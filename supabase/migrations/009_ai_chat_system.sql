-- Migration: 009_ai_chat_system.sql
-- Description: Create AI Chat Assistant system tables and functions
-- Date: 2024

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Chat Conversations Table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('onboarding', 'support', 'general', 'booking_help')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  context JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Indexes
  INDEX idx_chat_conversations_user_id (user_id),
  INDEX idx_chat_conversations_type (type),
  INDEX idx_chat_conversations_status (status),
  INDEX idx_chat_conversations_updated_at (updated_at)
);

-- 2. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'suggestion', 'action', 'onboarding')),
  metadata JSONB DEFAULT '{}',
  reactions JSONB DEFAULT '{}',
  
  -- Indexes
  INDEX idx_chat_messages_conversation_id (conversation_id),
  INDEX idx_chat_messages_sender (sender),
  INDEX idx_chat_messages_timestamp (timestamp),
  INDEX idx_chat_messages_type (type)
);

-- 3. Onboarding Steps Table
CREATE TABLE IF NOT EXISTS onboarding_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('profile', 'preferences', 'verification', 'first_booking', 'platform_tour')),
  order_index INTEGER NOT NULL,
  required BOOLEAN NOT NULL DEFAULT true,
  estimated_minutes INTEGER DEFAULT 5,
  action_url TEXT,
  help_text TEXT,
  checklist_items JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_onboarding_steps_category (category),
  INDEX idx_onboarding_steps_order (order_index),
  INDEX idx_onboarding_steps_active (is_active) WHERE is_active = true
);

-- 4. User Onboarding Progress Table
CREATE TABLE IF NOT EXISTS user_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES onboarding_steps(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_data JSONB DEFAULT '{}',
  
  -- Unique constraint to prevent duplicate progress entries
  UNIQUE(user_id, step_id),
  
  -- Indexes
  INDEX idx_user_onboarding_user_id (user_id),
  INDEX idx_user_onboarding_step_id (step_id),
  INDEX idx_user_onboarding_completed (completed)
);

-- 5. AI Knowledge Base Table
CREATE TABLE IF NOT EXISTS ai_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('onboarding', 'features', 'troubleshooting', 'policies', 'faq')),
  tags TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 5,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,
  effectiveness_score DECIMAL(3,2) DEFAULT 0.0,
  related_articles UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  
  -- Indexes
  INDEX idx_ai_knowledge_category (category),
  INDEX idx_ai_knowledge_tags (tags),
  INDEX idx_ai_knowledge_priority (priority),
  INDEX idx_ai_knowledge_active (is_active) WHERE is_active = true
);

-- 6. Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  message_count INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  exit_type TEXT CHECK (exit_type IN ('natural', 'timeout', 'closed', 'error')),
  
  -- Indexes
  INDEX idx_chat_sessions_user_id (user_id),
  INDEX idx_chat_sessions_conversation_id (conversation_id),
  INDEX idx_chat_sessions_started_at (started_at)
);

-- 7. Chat Suggestions Table
CREATE TABLE IF NOT EXISTS chat_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quick_reply', 'action', 'onboarding', 'help')),
  category TEXT,
  context_triggers TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  effectiveness_score DECIMAL(3,2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_chat_suggestions_type (type),
  INDEX idx_chat_suggestions_category (category),
  INDEX idx_chat_suggestions_active (is_active) WHERE is_active = true
);

-- 8. Chat Analytics Table
CREATE TABLE IF NOT EXISTS chat_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_chat_analytics_conversation_id (conversation_id),
  INDEX idx_chat_analytics_user_id (user_id),
  INDEX idx_chat_analytics_event_type (event_type),
  INDEX idx_chat_analytics_timestamp (timestamp)
);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Chat Conversations - Users can only access their own conversations
CREATE POLICY "Users can manage their own conversations" ON chat_conversations
  FOR ALL USING (auth.uid() = user_id);

-- Chat Messages - Users can only access messages from their conversations
CREATE POLICY "Users can access messages from their conversations" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chat_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- Onboarding Steps - Public read access
CREATE POLICY "Anyone can view onboarding steps" ON onboarding_steps
  FOR SELECT USING (is_active = true);

-- User Onboarding Progress - Users can access their own progress
CREATE POLICY "Users can manage their own onboarding progress" ON user_onboarding_progress
  FOR ALL USING (auth.uid() = user_id);

-- AI Knowledge Base - Public read access for active articles
CREATE POLICY "Anyone can view active knowledge base articles" ON ai_knowledge_base
  FOR SELECT USING (is_active = true);

-- Chat Sessions - Users can access their own sessions
CREATE POLICY "Users can access their own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat Suggestions - Public read access for active suggestions
CREATE POLICY "Anyone can view active chat suggestions" ON chat_suggestions
  FOR SELECT USING (is_active = true);

-- Chat Analytics - Users can access their own analytics
CREATE POLICY "Users can access their own chat analytics" ON chat_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert chat analytics" ON chat_analytics
  FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_chat_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_conversations_updated_at 
  BEFORE UPDATE ON chat_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_chat_updated_at_column();

-- Function to create a new chat conversation
CREATE OR REPLACE FUNCTION create_chat_conversation(
  title TEXT,
  conversation_type TEXT,
  context_data JSONB DEFAULT '{}',
  priority_level TEXT DEFAULT 'medium'
)
RETURNS chat_conversations AS $$
DECLARE
  new_conversation chat_conversations;
BEGIN
  INSERT INTO chat_conversations (
    title,
    type,
    user_id,
    context,
    priority,
    created_at,
    updated_at
  ) VALUES (
    title,
    conversation_type,
    auth.uid(),
    context_data,
    priority_level,
    NOW(),
    NOW()
  ) RETURNING * INTO new_conversation;

  RETURN new_conversation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add message reaction
CREATE OR REPLACE FUNCTION add_message_reaction(
  message_id UUID,
  reaction_type TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_messages 
  SET 
    reactions = COALESCE(reactions, '{}'::jsonb) || 
    jsonb_build_object(
      reaction_type, COALESCE((reactions->reaction_type)::integer, 0) + 1,
      'user_reaction', reaction_type
    )
  WHERE id = message_id
  AND EXISTS (
    SELECT 1 FROM chat_conversations 
    WHERE id = chat_messages.conversation_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get onboarding progress
CREATE OR REPLACE FUNCTION get_onboarding_progress(user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', os.id,
      'title', os.title,
      'description', os.description,
      'category', os.category,
      'order', os.order_index,
      'completed', COALESCE(uop.completed, false),
      'completedAt', uop.completed_at,
      'required', os.required,
      'estimatedMinutes', os.estimated_minutes,
      'actionUrl', os.action_url,
      'helpText', os.help_text,
      'checklistItems', os.checklist_items
    ) ORDER BY os.order_index
  ) INTO result
  FROM onboarding_steps os
  LEFT JOIN user_onboarding_progress uop ON os.id = uop.step_id AND uop.user_id = get_onboarding_progress.user_id
  WHERE os.is_active = true;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update onboarding progress
CREATE OR REPLACE FUNCTION update_onboarding_progress(
  user_id UUID,
  step_completed TEXT DEFAULT NULL,
  next_step TEXT DEFAULT NULL,
  progress_percentage DECIMAL DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  step_id UUID;
BEGIN
  -- Mark step as completed if provided
  IF step_completed IS NOT NULL THEN
    SELECT id INTO step_id FROM onboarding_steps WHERE title = step_completed OR id::text = step_completed;
    
    IF step_id IS NOT NULL THEN
      INSERT INTO user_onboarding_progress (user_id, step_id, completed, completed_at)
      VALUES (update_onboarding_progress.user_id, step_id, true, NOW())
      ON CONFLICT (user_id, step_id) 
      DO UPDATE SET completed = true, completed_at = NOW();
    END IF;
  END IF;

  -- Additional logic for tracking progress can be added here
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search knowledge base
CREATE OR REPLACE FUNCTION search_knowledge_base(search_query TEXT)
RETURNS SETOF ai_knowledge_base AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM ai_knowledge_base
  WHERE is_active = true
  AND (
    title ILIKE '%' || search_query || '%'
    OR content ILIKE '%' || search_query || '%'
    OR array_to_string(tags, ' ') ILIKE '%' || search_query || '%'
  )
  ORDER BY 
    priority DESC,
    effectiveness_score DESC,
    usage_count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get chat analytics
CREATE OR REPLACE FUNCTION get_chat_analytics(conversation_id UUID DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- This is a simplified analytics function
  -- In a real implementation, you'd have more complex analytics
  SELECT json_build_object(
    'conversationId', conversation_id,
    'metrics', json_build_object(
      'totalMessages', (
        SELECT COUNT(*) FROM chat_messages 
        WHERE (conversation_id IS NULL OR chat_messages.conversation_id = get_chat_analytics.conversation_id)
      ),
      'averageResponseTime', 2.5,
      'userSatisfactionScore', 4.2,
      'completionRate', 85.5,
      'bounceRate', 12.3
    ),
    'timeline', json_build_array()
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default onboarding steps
INSERT INTO onboarding_steps (
  title, description, category, order_index, required, estimated_minutes, action_url, help_text
) VALUES
  (
    'Welcome to Loconomy',
    'Get familiar with our platform and how it works',
    'platform_tour',
    1,
    true,
    3,
    '/onboarding/welcome',
    'Take a quick tour to understand the basics of Loconomy'
  ),
  (
    'Complete Your Profile',
    'Add your basic information to personalize your experience',
    'profile',
    2,
    true,
    5,
    '/profile/setup',
    'Your profile helps service providers better understand your needs'
  ),
  (
    'Set Your Location',
    'Add your location to find services near you',
    'profile',
    3,
    true,
    2,
    '/profile/location',
    'We use your location to show you relevant local services'
  ),
  (
    'Choose Your Interests',
    'Select service categories you\'re interested in',
    'preferences',
    4,
    false,
    3,
    '/preferences/interests',
    'This helps us recommend services tailored to your needs'
  ),
  (
    'Verify Your Account',
    'Verify your email and phone number for security',
    'verification',
    5,
    true,
    4,
    '/verify',
    'Verification helps keep your account secure and builds trust'
  ),
  (
    'Explore Services',
    'Browse available services in your area',
    'platform_tour',
    6,
    false,
    5,
    '/services',
    'Discover the variety of services available on our platform'
  ),
  (
    'Make Your First Booking',
    'Book your first service to complete onboarding',
    'first_booking',
    7,
    false,
    10,
    '/services',
    'Experience the full booking flow with a real service provider'
  )
ON CONFLICT DO NOTHING;

-- Insert default knowledge base articles
INSERT INTO ai_knowledge_base (
  title, content, category, tags, priority
) VALUES
  (
    'How to Create Your Profile',
    'Creating a complete profile helps service providers understand your needs better. Go to Profile Settings and fill in your basic information, location, and preferences.',
    'onboarding',
    ARRAY['profile', 'setup', 'getting started'],
    9
  ),
  (
    'How to Book a Service',
    'To book a service: 1) Browse or search for services, 2) Select a provider, 3) Choose date and time, 4) Confirm booking and payment.',
    'features',
    ARRAY['booking', 'services', 'how-to'],
    9
  ),
  (
    'Payment and Billing',
    'We accept all major credit cards and PayPal. Payments are processed securely through Stripe. You can manage your payment methods in Account Settings.',
    'features',
    ARRAY['payment', 'billing', 'stripe'],
    8
  ),
  (
    'Safety and Security',
    'All service providers are background-checked and verified. We have a rating system and insurance coverage for your peace of mind.',
    'policies',
    ARRAY['safety', 'security', 'verification'],
    8
  ),
  (
    'Cancellation Policy',
    'You can cancel bookings up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may incur a fee.',
    'policies',
    ARRAY['cancellation', 'refund', 'policy'],
    7
  )
ON CONFLICT DO NOTHING;

-- Insert default chat suggestions
INSERT INTO chat_suggestions (
  text, type, category, context_triggers, metadata
) VALUES
  (
    'Help me set up my profile',
    'onboarding',
    'profile',
    ARRAY['welcome', 'new_user', 'profile'],
    '{"actionType": "navigate", "targetUrl": "/profile/setup", "priority": 9}'
  ),
  (
    'How does Loconomy work?',
    'help',
    'general',
    ARRAY['welcome', 'general'],
    '{"priority": 8}'
  ),
  (
    'Show me available services',
    'action',
    'services',
    ARRAY['booking', 'services'],
    '{"actionType": "navigate", "targetUrl": "/services", "priority": 8}'
  ),
  (
    'I need help with booking',
    'help',
    'booking',
    ARRAY['booking', 'help'],
    '{"priority": 7}'
  ),
  (
    'What are your safety measures?',
    'help',
    'safety',
    ARRAY['general', 'safety'],
    '{"priority": 6}'
  ),
  (
    'Contact human support',
    'action',
    'support',
    ARRAY['escalation', 'help'],
    '{"actionType": "open_modal", "stepId": "contact_support", "priority": 5}'
  )
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON chat_conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON chat_messages TO authenticated;
GRANT SELECT ON onboarding_steps TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_onboarding_progress TO authenticated;
GRANT SELECT ON ai_knowledge_base TO authenticated;
GRANT SELECT, INSERT, UPDATE ON chat_sessions TO authenticated;
GRANT SELECT ON chat_suggestions TO authenticated;
GRANT SELECT, INSERT ON chat_analytics TO authenticated;

GRANT EXECUTE ON FUNCTION create_chat_conversation(TEXT, TEXT, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION add_message_reaction(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_onboarding_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_onboarding_progress(UUID, TEXT, TEXT, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION search_knowledge_base(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_chat_analytics(UUID) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE chat_conversations IS 'User conversations with the AI assistant';
COMMENT ON TABLE chat_messages IS 'Individual messages within conversations';
COMMENT ON TABLE onboarding_steps IS 'Defined onboarding steps for new users';
COMMENT ON TABLE user_onboarding_progress IS 'User progress through onboarding steps';
COMMENT ON TABLE ai_knowledge_base IS 'Knowledge base articles for AI responses';
COMMENT ON TABLE chat_sessions IS 'User session tracking for chat interactions';
COMMENT ON TABLE chat_suggestions IS 'Predefined suggestions for chat interactions';
COMMENT ON TABLE chat_analytics IS 'Analytics data for chat performance tracking';
