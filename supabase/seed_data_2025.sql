-- =====================================================
-- LOCONOMY 2025 - NEXT-GENERATION SEED DATA SCRIPT
-- =====================================================
-- This script populates the database with 2025-ready sample data
-- Includes AI-native features, trust systems, premium UI, and more
-- 
-- Features:
-- ✅ AI-Enhanced Service Categories
-- ✅ Premium Subscription Tiers with AI Features
-- ✅ Trust System Sample Data
-- ✅ Glassmorphism & Neural UI Themes
-- ✅ AI Performance Metrics
-- ✅ Community Trust Networks
-- ✅ Sample AI Interactions
-- 
-- WARNING: This is for development/testing only!
-- Do NOT run this in production environments
-- =====================================================

-- =====================================================
-- AI-ENHANCED SERVICE CATEGORIES
-- =====================================================

-- Insert enhanced categories with AI keywords and trust requirements
INSERT INTO categories (
    name, slug, description, icon_url, image_url, color_code,
    ai_keywords, market_demand_score, trust_level_required, verification_required,
    glassmorphism_config, neural_ui_config, premium_category, display_order
) VALUES
(
    'AI-Powered Home Cleaning',
    'ai-home-cleaning',
    'Next-generation cleaning services with AI-optimized scheduling and eco-smart solutions',
    '/icons/home-ai.svg',
    '/images/categories/cleaning-ai.jpg',
    '#10B981',
    ARRAY['cleaning', 'home', 'eco-friendly', 'smart-scheduling', 'ai-optimized'],
    0.92,
    0.4,
    false,
    '{"blur_intensity": "medium", "opacity": 0.85, "gradient": "emerald"}',
    '{"shadow_depth": "medium", "surface_elevation": "raised"}',
    false,
    1
),
(
    'Smart Plumbing Solutions',
    'smart-plumbing',
    'AI-assisted plumbing with predictive maintenance and IoT leak detection',
    '/icons/plumbing-smart.svg',
    '/images/categories/plumbing-smart.jpg',
    '#3B82F6',
    ARRAY['plumbing', 'smart', 'iot', 'predictive', 'emergency', 'ai-assisted'],
    0.88,
    0.7,
    true,
    '{"blur_intensity": "strong", "opacity": 0.9, "gradient": "blue"}',
    '{"shadow_depth": "deep", "surface_elevation": "floating"}',
    true,
    2
),
(
    'Neural Network Electrical',
    'neural-electrical',
    'AI-enhanced electrical services with smart home integration and energy optimization',
    '/icons/electrical-neural.svg',
    '/images/categories/electrical-neural.jpg',
    '#F59E0B',
    ARRAY['electrical', 'smart-home', 'energy-efficient', 'neural', 'optimization'],
    0.85,
    0.8,
    true,
    '{"blur_intensity": "medium", "opacity": 0.8, "gradient": "amber"}',
    '{"shadow_depth": "medium", "surface_elevation": "standard"}',
    true,
    3
),
(
    'AI Handyman Services',
    'ai-handyman',
    'Intelligent handyman services with AR-guided repairs and smart tool integration',
    '/icons/handyman-ai.svg',
    '/images/categories/handyman-ai.jpg',
    '#8B5CF6',
    ARRAY['handyman', 'repair', 'ar-guided', 'smart-tools', 'maintenance'],
    0.78,
    0.5,
    false,
    '{"blur_intensity": "subtle", "opacity": 0.75, "gradient": "violet"}',
    '{"shadow_depth": "subtle", "surface_elevation": "standard"}',
    false,
    4
),
(
    'Autonomous Moving & Delivery',
    'autonomous-moving',
    'Next-gen moving services with AI route optimization and smart logistics',
    '/icons/moving-autonomous.svg',
    '/images/categories/moving-autonomous.jpg',
    '#EF4444',
    ARRAY['moving', 'delivery', 'autonomous', 'logistics', 'route-optimization'],
    0.82,
    0.6,
    true,
    '{"blur_intensity": "medium", "opacity": 0.85, "gradient": "red"}',
    '{"shadow_depth": "medium", "surface_elevation": "raised"}',
    false,
    5
),
(
    'Smart Landscaping & IoT Gardens',
    'smart-landscaping',
    'AI-powered landscaping with IoT sensors, smart irrigation, and predictive plant care',
    '/icons/landscaping-smart.svg',
    '/images/categories/landscaping-smart.jpg',
    '#22C55E',
    ARRAY['landscaping', 'iot', 'smart-irrigation', 'predictive', 'garden'],
    0.75,
    0.4,
    false,
    '{"blur_intensity": "medium", "opacity": 0.8, "gradient": "green"}',
    '{"shadow_depth": "medium", "surface_elevation": "standard"}',
    false,
    6
),
(
    'AI Automotive Intelligence',
    'ai-automotive',
    'Intelligent automotive services with AI diagnostics and predictive maintenance',
    '/icons/automotive-ai.svg',
    '/images/categories/automotive-ai.jpg',
    '#6B7280',
    ARRAY['automotive', 'ai-diagnostics', 'predictive-maintenance', 'smart-repair'],
    0.89,
    0.7,
    true,
    '{"blur_intensity": "strong", "opacity": 0.9, "gradient": "gray"}',
    '{"shadow_depth": "deep", "surface_elevation": "floating"}',
    true,
    7
),
(
    'Neural Tech Solutions',
    'neural-tech',
    'Advanced technology services with AI troubleshooting and neural network optimization',
    '/icons/tech-neural.svg',
    '/images/categories/tech-neural.jpg',
    '#06B6D4',
    ARRAY['technology', 'neural', 'ai-troubleshooting', 'optimization', 'smart-systems'],
    0.95,
    0.6,
    false,
    '{"blur_intensity": "medium", "opacity": 0.85, "gradient": "cyan"}',
    '{"shadow_depth": "medium", "surface_elevation": "raised"}',
    true,
    8
),
(
    'AI-Enhanced Tutoring',
    'ai-tutoring',
    'Personalized education with AI-adaptive learning and neural pedagogical approaches',
    '/icons/tutoring-ai.svg',
    '/images/categories/tutoring-ai.jpg',
    '#EC4899',
    ARRAY['tutoring', 'ai-adaptive', 'personalized', 'neural-pedagogy', 'education'],
    0.91,
    0.5,
    false,
    '{"blur_intensity": "subtle", "opacity": 0.8, "gradient": "pink"}',
    '{"shadow_depth": "subtle", "surface_elevation": "standard"}',
    false,
    9
),
(
    'Smart Fitness & Wellness',
    'smart-fitness',
    'AI-powered fitness with biometric monitoring and personalized wellness programs',
    '/icons/fitness-smart.svg',
    '/images/categories/fitness-smart.jpg',
    '#F97316',
    ARRAY['fitness', 'wellness', 'biometric', 'ai-powered', 'personalized'],
    0.87,
    0.4,
    false,
    '{"blur_intensity": "medium", "opacity": 0.8, "gradient": "orange"}',
    '{"shadow_depth": "medium", "surface_elevation": "standard"}',
    false,
    10
),
(
    'Neural Beauty & Wellness',
    'neural-beauty',
    'Advanced beauty services with AI skin analysis and personalized treatment protocols',
    '/icons/beauty-neural.svg',
    '/images/categories/beauty-neural.jpg',
    '#A855F7',
    ARRAY['beauty', 'wellness', 'ai-analysis', 'personalized', 'neural-treatment'],
    0.83,
    0.6,
    true,
    '{"blur_intensity": "strong", "opacity": 0.9, "gradient": "purple"}',
    '{"shadow_depth": "deep", "surface_elevation": "floating"}',
    true,
    11
),
(
    'AI Pet Care Intelligence',
    'ai-pet-care',
    'Smart pet care with AI behavior analysis and predictive health monitoring',
    '/icons/pet-care-ai.svg',
    '/images/categories/pet-care-ai.jpg',
    '#14B8A6',
    ARRAY['pet-care', 'ai-behavior', 'health-monitoring', 'predictive', 'smart-care'],
    0.79,
    0.5,
    false,
    '{"blur_intensity": "medium", "opacity": 0.85, "gradient": "teal"}',
    '{"shadow_depth": "medium", "surface_elevation": "raised"}',
    false,
    12
),
(
    'Neural Event Orchestration',
    'neural-events',
    'AI-powered event planning with predictive logistics and smart venue optimization',
    '/icons/events-neural.svg',
    '/images/categories/events-neural.jpg',
    '#84CC16',
    ARRAY['events', 'planning', 'ai-powered', 'logistics', 'optimization'],
    0.86,
    0.7,
    true,
    '{"blur_intensity": "medium", "opacity": 0.8, "gradient": "lime"}',
    '{"shadow_depth": "medium", "surface_elevation": "standard"}',
    true,
    13
),
(
    'AI Photography & Visual Intelligence',
    'ai-photography',
    'Advanced photography with AI composition analysis and neural enhancement',
    '/icons/photography-ai.svg',
    '/images/categories/photography-ai.jpg',
    '#F43F5E',
    ARRAY['photography', 'ai-composition', 'neural-enhancement', 'visual-intelligence'],
    0.90,
    0.6,
    false,
    '{"blur_intensity": "strong", "opacity": 0.9, "gradient": "rose"}',
    '{"shadow_depth": "deep", "surface_elevation": "floating"}',
    true,
    14
),
(
    'Quantum Services Hub',
    'quantum-services',
    'Next-generation miscellaneous services with quantum computing optimization',
    '/icons/quantum-services.svg',
    '/images/categories/quantum-services.jpg',
    '#64748B',
    ARRAY['quantum', 'miscellaneous', 'next-generation', 'optimization', 'advanced'],
    0.72,
    0.3,
    false,
    '{"blur_intensity": "subtle", "opacity": 0.75, "gradient": "slate"}',
    '{"shadow_depth": "subtle", "surface_elevation": "standard"}',
    false,
    15
);

-- =====================================================
-- PREMIUM SUBSCRIPTION PLANS WITH AI FEATURES
-- =====================================================

INSERT INTO subscription_plans (
    plan_id, name, description, price_monthly, price_yearly,
    features, limits, ai_features_enabled, premium_ui_features, trust_features,
    stripe_product_id, is_active
) VALUES
(
    'free',
    'Community Starter',
    'Perfect for getting started with basic AI assistance and community features',
    0.00,
    0.00,
    '{
        "basic_listings": true,
        "community_support": true,
        "mobile_app": true,
        "basic_ai_suggestions": true,
        "trust_score_visible": true
    }',
    '{
        "max_listings": 3,
        "max_bookings_per_month": 10,
        "max_images_per_listing": 3,
        "ai_interactions_per_month": 50
    }',
    '{
        "smart_matching": false,
        "predictive_pricing": false,
        "ai_assistant": false,
        "performance_insights": false,
        "automated_optimization": false
    }',
    '{
        "glassmorphism": false,
        "neural_ui": false,
        "premium_animations": false,
        "custom_themes": false,
        "advanced_interactions": false
    }',
    '{
        "priority_verification": false,
        "trust_score_boost": false,
        "community_champion": false,
        "dispute_priority": false
    }',
    'prod_free_2025',
    true
),
(
    'basic',
    'AI Assistant',
    'Enhanced AI features with smart matching and basic premium UI',
    39.99,
    399.99,
    '{
        "unlimited_listings": true,
        "priority_support": true,
        "advanced_analytics": true,
        "ai_assistant": true,
        "smart_matching": true,
        "glassmorphism_ui": true
    }',
    '{
        "max_listings": 25,
        "max_bookings_per_month": 100,
        "max_images_per_listing": 10,
        "ai_interactions_per_month": 500
    }',
    '{
        "smart_matching": true,
        "predictive_pricing": false,
        "ai_assistant": true,
        "performance_insights": true,
        "automated_optimization": false
    }',
    '{
        "glassmorphism": true,
        "neural_ui": false,
        "premium_animations": true,
        "custom_themes": false,
        "advanced_interactions": false
    }',
    '{
        "priority_verification": true,
        "trust_score_boost": false,
        "community_champion": false,
        "dispute_priority": false
    }',
    'prod_basic_2025',
    true
),
(
    'professional',
    'Neural Intelligence Pro',
    'Advanced AI with neural UI, predictive analytics, and premium features',
    99.99,
    999.99,
    '{
        "unlimited_everything": true,
        "priority_support": true,
        "advanced_ai": true,
        "neural_ui": true,
        "predictive_analytics": true,
        "api_access": true,
        "custom_branding": true
    }',
    '{
        "max_listings": 100,
        "max_bookings_per_month": 500,
        "max_images_per_listing": 25,
        "ai_interactions_per_month": 2000
    }',
    '{
        "smart_matching": true,
        "predictive_pricing": true,
        "ai_assistant": true,
        "performance_insights": true,
        "automated_optimization": true
    }',
    '{
        "glassmorphism": true,
        "neural_ui": true,
        "premium_animations": true,
        "custom_themes": true,
        "advanced_interactions": true
    }',
    '{
        "priority_verification": true,
        "trust_score_boost": true,
        "community_champion": false,
        "dispute_priority": true
    }',
    'prod_professional_2025',
    true
),
(
    'ai_premium',
    'AI Premium Elite',
    'Ultimate AI experience with quantum optimization and elite features',
    199.99,
    1999.99,
    '{
        "unlimited_everything": true,
        "dedicated_support": true,
        "ai_premium": true,
        "quantum_optimization": true,
        "neural_ui_pro": true,
        "white_label": true,
        "advanced_reporting": true,
        "api_unlimited": true
    }',
    '{
        "max_listings": -1,
        "max_bookings_per_month": -1,
        "max_images_per_listing": -1,
        "ai_interactions_per_month": -1
    }',
    '{
        "smart_matching": true,
        "predictive_pricing": true,
        "ai_assistant": true,
        "performance_insights": true,
        "automated_optimization": true
    }',
    '{
        "glassmorphism": true,
        "neural_ui": true,
        "premium_animations": true,
        "custom_themes": true,
        "advanced_interactions": true
    }',
    '{
        "priority_verification": true,
        "trust_score_boost": true,
        "community_champion": true,
        "dispute_priority": true
    }',
    'prod_ai_premium_2025',
    true
),
(
    'enterprise',
    'Quantum Enterprise',
    'Enterprise-grade platform with quantum computing and unlimited AI',
    499.99,
    4999.99,
    '{
        "unlimited_everything": true,
        "dedicated_support": true,
        "quantum_computing": true,
        "ai_unlimited": true,
        "neural_ui_enterprise": true,
        "white_label_pro": true,
        "advanced_reporting": true,
        "api_unlimited": true,
        "custom_integrations": true,
        "sla_guarantee": true
    }',
    '{
        "max_listings": -1,
        "max_bookings_per_month": -1,
        "max_images_per_listing": -1,
        "ai_interactions_per_month": -1
    }',
    '{
        "smart_matching": true,
        "predictive_pricing": true,
        "ai_assistant": true,
        "performance_insights": true,
        "automated_optimization": true
    }',
    '{
        "glassmorphism": true,
        "neural_ui": true,
        "premium_animations": true,
        "custom_themes": true,
        "advanced_interactions": true
    }',
    '{
        "priority_verification": true,
        "trust_score_boost": true,
        "community_champion": true,
        "dispute_priority": true
    }',
    'prod_enterprise_2025',
    true
);

-- =====================================================
-- PREMIUM UI THEMES (GLASSMORPHISM & NEURAL UI)
-- =====================================================

-- Sample UI themes for different user preferences
INSERT INTO ui_themes (
    user_id, theme_name, theme_type, color_scheme, glassmorphism_config,
    neural_ui_config, animation_config, ai_adaptive_config, is_default
) VALUES
(
    'sample-user-1', -- Replace with actual user ID
    'Glassmorphism Elegance',
    'glassmorphism',
    '{
        "primary": "oklch(65% 0.2 270)",
        "secondary": "oklch(70% 0.15 240)",
        "accent": "oklch(85% 0.12 45)",
        "background": "oklch(98% 0 0)",
        "surface": "oklch(96% 0 0)",
        "glass_primary": "oklch(65% 0.2 270 / 0.8)",
        "glass_secondary": "oklch(70% 0.15 240 / 0.6)"
    }',
    '{
        "enabled": true,
        "blur_intensity": "strong",
        "opacity": 0.85,
        "border_opacity": 0.3,
        "gradient_overlay": true,
        "frost_effect": true
    }',
    '{
        "enabled": false,
        "shadow_intensity": "medium",
        "surface_elevation": "standard",
        "tactile_feedback": false
    }',
    '{
        "level": "premium",
        "spring_physics": true,
        "micro_interactions": true,
        "reduced_motion_respected": true,
        "glass_transitions": true
    }',
    '{
        "enabled": true,
        "learn_preferences": true,
        "auto_adjust_contrast": true,
        "context_aware_colors": true,
        "ai_color_harmony": true
    }',
    true
),
(
    'sample-user-2', -- Replace with actual user ID
    'Neural Depth',
    'neural',
    '{
        "primary": "oklch(60% 0.15 280)",
        "secondary": "oklch(65% 0.12 260)",
        "accent": "oklch(80% 0.18 50)",
        "background": "oklch(95% 0.02 280)",
        "surface": "oklch(92% 0.03 280)",
        "neural_light": "oklch(98% 0.01 280)",
        "neural_dark": "oklch(85% 0.05 280)"
    }',
    '{
        "enabled": false,
        "blur_intensity": "medium",
        "opacity": 0.8,
        "border_opacity": 0.3
    }',
    '{
        "enabled": true,
        "shadow_intensity": "deep",
        "surface_elevation": "floating",
        "tactile_feedback": true,
        "soft_shadows": true,
        "raised_elements": true
    }',
    '{
        "level": "premium",
        "spring_physics": true,
        "micro_interactions": true,
        "reduced_motion_respected": true,
        "neural_transitions": true,
        "depth_animations": true
    }',
    '{
        "enabled": true,
        "learn_preferences": true,
        "auto_adjust_contrast": true,
        "context_aware_colors": true,
        "neural_adaptation": true
    }',
    false
),
(
    'sample-user-3', -- Replace with actual user ID
    'AI Adaptive Gold',
    'ai_adaptive',
    '{
        "primary": "oklch(75% 0.15 65)",
        "secondary": "oklch(70% 0.12 45)",
        "accent": "oklch(85% 0.20 25)",
        "background": "oklch(97% 0.02 65)",
        "surface": "oklch(94% 0.03 65)",
        "ai_primary": "oklch(75% 0.15 65)",
        "ai_glow": "oklch(85% 0.25 65 / 0.4)"
    }',
    '{
        "enabled": true,
        "blur_intensity": "medium",
        "opacity": 0.9,
        "border_opacity": 0.4,
        "premium_frost": true
    }',
    '{
        "enabled": true,
        "shadow_intensity": "medium",
        "surface_elevation": "raised",
        "tactile_feedback": true,
        "premium_depth": true
    }',
    '{
        "level": "premium",
        "spring_physics": true,
        "micro_interactions": true,
        "reduced_motion_respected": true,
        "ai_driven_animations": true,
        "contextual_transitions": true
    }',
    '{
        "enabled": true,
        "learn_preferences": true,
        "auto_adjust_contrast": true,
        "context_aware_colors": true,
        "ai_color_harmony": true,
        "mood_adaptation": true,
        "time_based_shifts": true
    }',
    false
);

-- =====================================================
-- INTERACTION PREFERENCES
-- =====================================================

-- Sample interaction preferences for different user types
INSERT INTO interaction_preferences (
    user_id, preference_type, preferences, accessibility_config, ai_learned_preferences
) VALUES
(
    'sample-user-1', -- Replace with actual user ID
    'premium',
    '{
        "hover_effects": true,
        "click_feedback": true,
        "gesture_support": true,
        "voice_commands": false,
        "ai_suggestions_visible": true,
        "trust_indicators_visible": true,
        "premium_animations": true,
        "glassmorphism_interactions": true,
        "micro_feedback": true
    }',
    '{
        "high_contrast": false,
        "large_text": false,
        "reduced_motion": false,
        "screen_reader_optimized": false,
        "keyboard_navigation": true,
        "focus_indicators": true
    }',
    '{
        "preferred_animation_speed": "standard",
        "color_temperature_preference": "warm",
        "interaction_density": "comfortable",
        "ai_assistance_frequency": "moderate"
    }'
),
(
    'sample-user-2', -- Replace with actual user ID
    'ai_enhanced',
    '{
        "hover_effects": true,
        "click_feedback": true,
        "gesture_support": true,
        "voice_commands": true,
        "ai_suggestions_visible": true,
        "trust_indicators_visible": true,
        "premium_animations": true,
        "neural_interactions": true,
        "ai_predictive_ui": true,
        "contextual_menus": true
    }',
    '{
        "high_contrast": false,
        "large_text": false,
        "reduced_motion": false,
        "screen_reader_optimized": false,
        "keyboard_navigation": true,
        "ai_accessibility_assist": true
    }',
    '{
        "preferred_ai_personality": "professional",
        "interaction_learning_enabled": true,
        "predictive_suggestions": true,
        "adaptive_ui_enabled": true
    }'
);

-- =====================================================
-- TRUST SYSTEM SAMPLE DATA
-- =====================================================

-- Sample trust verifications
INSERT INTO trust_verifications (
    user_id, verification_type, status, verification_data, ai_verification_score,
    community_votes_positive, community_votes_negative, trust_score_impact
) VALUES
(
    'sample-provider-1', -- Replace with actual user ID
    'identity',
    'ai_verified',
    '{
        "document_type": "drivers_license",
        "document_number": "DL123456789",
        "verification_method": "ai_ocr_analysis",
        "confidence_score": 0.95,
        "biometric_match": true
    }',
    0.95,
    12,
    0,
    0.15
),
(
    'sample-provider-1',
    'business',
    'human_verified',
    '{
        "business_license": "BL987654321",
        "tax_id": "TAX123456789",
        "insurance_policy": "INS456789123",
        "verification_method": "human_review",
        "documents_verified": true
    }',
    0.88,
    8,
    1,
    0.20
),
(
    'sample-provider-2', -- Replace with actual user ID
    'ai_behavioral',
    'ai_verified',
    '{
        "behavioral_analysis": {
            "response_time_avg": "2.3_minutes",
            "completion_rate": 0.96,
            "customer_satisfaction": 0.92,
            "communication_quality": 0.89
        },
        "risk_assessment": "low",
        "trust_signals": ["consistent_quality", "reliable_communication", "timely_completion"]
    }',
    0.91,
    15,
    2,
    0.25
);

-- Sample community trust network
INSERT INTO trust_network (
    trustor_id, trustee_id, trust_level, relationship_type,
    endorsement_text, skills_endorsed, verified
) VALUES
(
    'sample-customer-1', -- Replace with actual user ID
    'sample-provider-1',
    0.92,
    'client',
    'Excellent service provider with outstanding attention to detail and professional communication.',
    ARRAY['cleaning', 'organization', 'reliability', 'communication'],
    true
),
(
    'sample-customer-2',
    'sample-provider-1',
    0.88,
    'client',
    'Very reliable and trustworthy. Always delivers on promises and maintains high quality standards.',
    ARRAY['reliability', 'quality', 'professionalism'],
    true
),
(
    'sample-provider-2',
    'sample-provider-1',
    0.85,
    'colleague',
    'Fellow service provider I can recommend. We have collaborated on several projects successfully.',
    ARRAY['collaboration', 'professionalism', 'expertise'],
    true
);

-- =====================================================
-- AI PERFORMANCE METRICS SAMPLE DATA
-- =====================================================

-- Sample AI performance metrics for the last 30 days
INSERT INTO ai_performance_metrics (
    metric_name, metric_category, metric_value, baseline_value, target_value,
    model_version, data_period_start, data_period_end, sample_size,
    trend_direction, confidence_interval, statistical_significance
) VALUES
(
    'Service Matching Accuracy',
    'matching',
    0.8945,
    0.8200,
    0.9000,
    'matching_v2.1.0',
    NOW() - INTERVAL '30 days',
    NOW(),
    15420,
    'improving',
    '{"lower": 0.8892, "upper": 0.8998}',
    0.9876
),
(
    'Price Prediction RMSE',
    'pricing',
    12.34,
    18.50,
    10.00,
    'pricing_v1.8.2',
    NOW() - INTERVAL '30 days',
    NOW(),
    8930,
    'improving',
    '{"lower": 11.89, "upper": 12.79}',
    0.9234
),
(
    'Content Moderation Precision',
    'moderation',
    0.9567,
    0.9200,
    0.9600,
    'moderation_v3.0.1',
    NOW() - INTERVAL '30 days',
    NOW(),
    23450,
    'stable',
    '{"lower": 0.9534, "upper": 0.9600}',
    0.8956
),
(
    'Booking Success Prediction',
    'prediction',
    0.8723,
    0.8100,
    0.8800,
    'prediction_v1.5.3',
    NOW() - INTERVAL '30 days',
    NOW(),
    12680,
    'improving',
    '{"lower": 0.8678, "upper": 0.8768}',
    0.9445
),
(
    'Trust Score Calculation Accuracy',
    'trust',
    0.9123,
    0.8800,
    0.9200,
    'trust_v2.0.0',
    NOW() - INTERVAL '30 days',
    NOW(),
    5670,
    'improving',
    '{"lower": 0.9067, "upper": 0.9179}',
    0.9123
);

-- =====================================================
-- SAMPLE AI INTERACTIONS
-- =====================================================

-- Sample AI interactions for different scenarios
INSERT INTO ai_interactions (
    user_id, session_id, interaction_type, context, context_id,
    input_data, ai_response, confidence_score, processing_time_ms,
    user_accepted, feedback_rating, ai_model_version, ai_model_type
) VALUES
(
    'sample-customer-1', -- Replace with actual user ID
    'session_abc123',
    'recommendation',
    'booking',
    'booking_xyz789',
    '{
        "service_needed": "house cleaning",
        "location": {"lat": 37.7749, "lng": -122.4194},
        "budget_range": {"min": 80, "max": 150},
        "preferred_time": "weekend_morning",
        "special_requirements": ["eco_friendly", "pet_safe"]
    }',
    '{
        "recommended_providers": [
            {
                "provider_id": "sample-provider-1",
                "match_score": 0.94,
                "reasons": ["eco_friendly_certified", "pet_experience", "excellent_reviews", "location_match"],
                "estimated_price": 125,
                "availability": "this_weekend"
            }
        ],
        "confidence": 0.94,
        "reasoning": "High match based on eco-friendly certification, pet experience, and location proximity"
    }',
    0.94,
    245,
    true,
    5,
    'recommendation_v2.1.0',
    'recommendation'
),
(
    'sample-provider-1',
    'session_def456',
    'optimization',
    'listing',
    'listing_abc123',
    '{
        "current_listing": {
            "title": "Professional House Cleaning",
            "price": 35.00,
            "description": "I clean houses professionally",
            "category": "cleaning"
        },
        "performance_metrics": {
            "view_count": 45,
            "booking_rate": 0.12,
            "avg_rating": 4.2
        }
    }',
    '{
        "optimized_title": "Eco-Friendly Professional House Cleaning with Pet-Safe Products",
        "suggested_price": 42.00,
        "optimized_description": "Transform your home with our eco-conscious cleaning service. Using only pet-safe, environmentally friendly products, we deliver spotless results while protecting your family and furry friends.",
        "optimization_reasons": [
            "eco_friendly_keywords_boost_visibility",
            "pet_safe_differentiator",
            "price_optimization_based_on_market_analysis"
        ],
        "expected_improvements": {
            "view_increase": "35%",
            "booking_rate_increase": "28%"
        }
    }',
    0.87,
    1230,
    true,
    4,
    'optimization_v1.9.1',
    'optimization'
),
(
    'sample-customer-2',
    'session_ghi789',
    'assistance',
    'general',
    null,
    '{
        "query": "How do I know if a service provider is trustworthy?",
        "context": "first_time_user",
        "user_concerns": ["safety", "quality", "reliability"]
    }',
    '{
        "response": "Great question! Here are the key trust indicators to look for:\\n\\n1. **Trust Score**: Look for providers with silver tier or higher\\n2. **Verifications**: Check for identity, background, and business verification badges\\n3. **Community Reviews**: Read recent reviews from verified customers\\n4. **Response Time**: Providers who respond quickly show professionalism\\n5. **Completion Rate**: High completion rates indicate reliability\\n\\nOur AI also provides a trust assessment for each provider based on behavioral patterns and community feedback.",
        "trust_tips": [
            "start_with_smaller_jobs",
            "communicate_clearly_upfront",
            "use_platform_messaging",
            "check_insurance_coverage"
        ],
        "recommended_actions": [
            "view_provider_trust_profile",
            "read_recent_reviews",
            "start_conversation_before_booking"
        ]
    }',
    0.91,
    567,
    true,
    5,
    'assistance_v3.2.0',
    'generation'
);

-- =====================================================
-- SAMPLE ANALYTICS EVENTS FOR 2025 FEATURES
-- =====================================================

-- Generate sample analytics events for AI and premium features
DO $$
DECLARE
    i INTEGER;
    event_date TIMESTAMPTZ;
    sample_user_id UUID;
    event_names TEXT[] := ARRAY[
        'ai_suggestion_viewed', 'ai_suggestion_accepted', 'trust_score_viewed', 
        'glassmorphism_enabled', 'neural_ui_activated', 'premium_feature_used',
        'ai_optimization_applied', 'community_verification_requested', 'smart_matching_used',
        'predictive_pricing_viewed', 'ai_assistant_interaction', 'trust_network_expanded'
    ];
    premium_tiers TEXT[] := ARRAY['free', 'basic', 'professional', 'ai_premium', 'enterprise'];
    trust_tiers TEXT[] := ARRAY['new', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];
BEGIN
    FOR i IN 1..2000 LOOP
        event_date := NOW() - (RANDOM() * INTERVAL '30 days');
        sample_user_id := gen_random_uuid();
        
        INSERT INTO events (
            user_id, session_id, event_name, event_category, event_action,
            ai_generated, ai_confidence, trust_score_at_event, trust_tier_at_event,
            premium_tier_at_event, premium_features_used, properties, created_at
        ) VALUES (
            sample_user_id,
            'session_' || substr(md5(random()::text), 1, 8),
            event_names[1 + floor(random() * array_length(event_names, 1))],
            'ai_premium_interaction',
            'user_engagement',
            (random() > 0.7),
            (0.5 + random() * 0.5)::DECIMAL(3,2),
            (0.3 + random() * 0.7)::DECIMAL(3,2),
            trust_tiers[1 + floor(random() * array_length(trust_tiers, 1))]::trust_score_tier,
            premium_tiers[1 + floor(random() * array_length(premium_tiers, 1))]::subscription_tier,
            CASE 
                WHEN random() > 0.5 THEN '["glassmorphism", "ai_assistant"]'::JSONB
                ELSE '["neural_ui", "smart_matching"]'::JSONB
            END,
            json_build_object(
                'page', '/dashboard',
                'source', 'ai_recommendation',
                'device_type', CASE WHEN random() > 0.6 THEN 'mobile' ELSE 'desktop' END,
                'ui_theme', CASE 
                    WHEN random() > 0.7 THEN 'glassmorphism'
                    WHEN random() > 0.4 THEN 'neural'
                    ELSE 'standard'
                END
            )::JSONB,
            event_date
        );
    END LOOP;
END $$;

-- =====================================================
-- SAMPLE COMMUNITY BOARDS
-- =====================================================

-- Create sample community boards for different regions
INSERT INTO community_boards (
    region_id, name, description, moderators, trust_threshold,
    verification_requirements, member_count, active_providers, monthly_bookings
) VALUES
(
    gen_random_uuid(),
    'San Francisco Bay Area Services',
    'Premium service providers serving the San Francisco Bay Area with AI-enhanced matching and community verification',
    ARRAY[gen_random_uuid(), gen_random_uuid()],
    0.75,
    '{
        "identity_verification": true,
        "business_license": true,
        "background_check": false,
        "community_endorsement": true,
        "ai_behavioral_score": 0.7
    }',
    1247,
    342,
    2890
),
(
    gen_random_uuid(),
    'Los Angeles Metro Marketplace',
    'AI-powered hyperlocal services for the Greater Los Angeles metropolitan area',
    ARRAY[gen_random_uuid(), gen_random_uuid(), gen_random_uuid()],
    0.70,
    '{
        "identity_verification": true,
        "business_license": false,
        "background_check": true,
        "community_endorsement": false,
        "ai_behavioral_score": 0.65
    }',
    2156,
    578,
    4320
),
(
    gen_random_uuid(),
    'Seattle Tech Hub Services',
    'Technology-forward service marketplace for the Seattle metropolitan area with neural UI and quantum optimization',
    ARRAY[gen_random_uuid()],
    0.80,
    '{
        "identity_verification": true,
        "business_license": true,
        "background_check": true,
        "community_endorsement": true,
        "ai_behavioral_score": 0.75,
        "tech_certification": true
    }',
    892,
    234,
    1567
);

-- =====================================================
-- DEVELOPMENT UTILITIES FOR 2025
-- =====================================================

-- Enhanced function to create sample users with 2025 features
CREATE OR REPLACE FUNCTION create_sample_user_2025(
    user_email TEXT,
    user_name TEXT,
    user_role user_role DEFAULT 'customer',
    premium_tier subscription_tier DEFAULT 'free',
    trust_score DECIMAL(3,2) DEFAULT 0.50,
    enable_ai_features BOOLEAN DEFAULT true
)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
    profile_id UUID;
    message TEXT;
BEGIN
    user_id := gen_random_uuid();
    
    -- Create enhanced user with AI and trust features
    INSERT INTO users (
        id, clerk_id, email, role, trust_score, trust_tier,
        ai_profile, trust_profile, premium_settings, notification_settings
    ) VALUES (
        user_id,
        user_id::TEXT,
        user_email,
        user_role,
        trust_score,
        CASE
            WHEN trust_score >= 0.95 THEN 'community_champion'
            WHEN trust_score >= 0.85 THEN 'diamond'
            WHEN trust_score >= 0.75 THEN 'platinum'
            WHEN trust_score >= 0.65 THEN 'gold'
            WHEN trust_score >= 0.50 THEN 'silver'
            WHEN trust_score >= 0.35 THEN 'bronze'
            ELSE 'new'
        END,
        json_build_object(
            'preferences_learned', json_build_object(),
            'interaction_style', 'standard',
            'ai_assistance_level', CASE WHEN enable_ai_features THEN 'high' ELSE 'low' END,
            'personalization_consent', enable_ai_features
        )::JSONB,
        json_build_object(
            'score', trust_score,
            'tier', CASE
                WHEN trust_score >= 0.95 THEN 'community_champion'
                WHEN trust_score >= 0.85 THEN 'diamond'
                WHEN trust_score >= 0.75 THEN 'platinum'
                WHEN trust_score >= 0.65 THEN 'gold'
                WHEN trust_score >= 0.50 THEN 'silver'
                WHEN trust_score >= 0.35 THEN 'bronze'
                ELSE 'new'
            END,
            'verifications', '[]'::JSON,
            'community_endorsements', floor(random() * 20),
            'trust_milestones', '[]'::JSON
        )::JSONB,
        json_build_object(
            'ui_theme', CASE 
                WHEN premium_tier IN ('professional', 'ai_premium', 'enterprise') THEN 'glassmorphism'
                WHEN premium_tier = 'basic' THEN 'neural'
                ELSE 'auto'
            END,
            'interaction_preference', CASE
                WHEN premium_tier IN ('ai_premium', 'enterprise') THEN 'ai_enhanced'
                WHEN premium_tier = 'professional' THEN 'premium'
                ELSE 'standard'
            END,
            'glassmorphism_enabled', premium_tier IN ('basic', 'professional', 'ai_premium', 'enterprise'),
            'neural_ui_enabled', premium_tier IN ('professional', 'ai_premium', 'enterprise')
        )::JSONB,
        json_build_object(
            'ai_suggestions', enable_ai_features,
            'trust_updates', true,
            'community_updates', true,
            'premium_features', premium_tier != 'free'
        )::JSONB
    );
    
    -- Create enhanced user profile
    INSERT INTO user_profiles (
        user_id, premium_tier, ai_skill_analysis, trust_score_breakdown, ai_insights
    ) VALUES (
        user_id,
        premium_tier,
        json_build_object(
            'verified_skills', '[]'::JSON,
            'suggested_skills', '[]'::JSON,
            'skill_confidence', '{}'::JSON,
            'market_demand', '{}'::JSON,
            'improvement_suggestions', '[]'::JSON
        )::JSONB,
        json_build_object(
            'identity', CASE WHEN random() > 0.5 THEN 0.8 ELSE 0.3 END,
            'address', CASE WHEN random() > 0.6 THEN 0.7 ELSE 0.2 END,
            'background', CASE WHEN random() > 0.7 THEN 0.9 ELSE 0.1 END,
            'business', CASE WHEN user_role = 'provider' AND random() > 0.4 THEN 0.8 ELSE 0.0 END,
            'behavioral', trust_score * 0.8 + random() * 0.2,
            'community', CASE WHEN random() > 0.6 THEN 0.6 ELSE 0.1 END,
            'ai_assessment', trust_score * 0.9 + random() * 0.1
        )::JSONB,
        json_build_object(
            'performance_trends', '[]'::JSON,
            'market_opportunities', '[]'::JSON,
            'pricing_suggestions', '[]'::JSON,
            'service_recommendations', '[]'::JSON
        )::JSONB
    );
    
    -- Create premium subscription if applicable
    IF premium_tier != 'free' THEN
        INSERT INTO subscriptions (
            user_id, tier, status, ai_features_enabled, premium_ui_features, trust_features
        ) VALUES (
            user_id,
            premium_tier,
            'active',
            json_build_object(
                'smart_matching', premium_tier IN ('basic', 'professional', 'ai_premium', 'enterprise'),
                'predictive_pricing', premium_tier IN ('professional', 'ai_premium', 'enterprise'),
                'ai_assistant', premium_tier IN ('basic', 'professional', 'ai_premium', 'enterprise'),
                'performance_insights', premium_tier IN ('professional', 'ai_premium', 'enterprise'),
                'automated_optimization', premium_tier IN ('ai_premium', 'enterprise')
            )::JSONB,
            json_build_object(
                'glassmorphism', premium_tier IN ('basic', 'professional', 'ai_premium', 'enterprise'),
                'neural_ui', premium_tier IN ('professional', 'ai_premium', 'enterprise'),
                'premium_animations', premium_tier IN ('basic', 'professional', 'ai_premium', 'enterprise'),
                'custom_themes', premium_tier IN ('professional', 'ai_premium', 'enterprise'),
                'advanced_interactions', premium_tier IN ('ai_premium', 'enterprise')
            )::JSONB,
            json_build_object(
                'priority_verification', premium_tier IN ('basic', 'professional', 'ai_premium', 'enterprise'),
                'trust_score_boost', premium_tier IN ('professional', 'ai_premium', 'enterprise'),
                'community_champion', premium_tier IN ('ai_premium', 'enterprise'),
                'dispute_priority', premium_tier IN ('professional', 'ai_premium', 'enterprise')
            )::JSONB
        );
    END IF;
    
    message := 'Enhanced 2025 ' || user_role || ' user created with ID: ' || user_id::TEXT || 
               ', Premium Tier: ' || premium_tier || ', Trust Score: ' || trust_score;
    
    -- Log the creation
    INSERT INTO system_logs (level, message, component)
    VALUES ('info', message, 'seed_data_2025');
    
    RETURN message;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Log completion
INSERT INTO system_logs (level, message, component) 
VALUES ('info', 'Loconomy 2025 seed data script completed successfully', 'seed_data_2025');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🚀 Loconomy 2025 Seed Data Completed Successfully! 🚀';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Enhanced Features Created:';
    RAISE NOTICE '   • 15 AI-enhanced service categories with glassmorphism/neural UI configs';
    RAISE NOTICE '   • 5 premium subscription tiers with AI and trust features';
    RAISE NOTICE '   • 3 sample premium UI themes (Glassmorphism, Neural, AI Adaptive)';
    RAISE NOTICE '   • 2 interaction preference profiles';
    RAISE NOTICE '   • Trust verification and community network samples';
    RAISE NOTICE '   • AI performance metrics and sample interactions';
    RAISE NOTICE '   • 2000 enhanced analytics events with AI/premium context';
    RAISE NOTICE '   • 3 community boards with trust requirements';
    RAISE NOTICE '';
    RAISE NOTICE '🎨 UI/UX Features:';
    RAISE NOTICE '   • Glassmorphism theme configurations';
    RAISE NOTICE '   • Neural UI depth and shadow settings';
    RAISE NOTICE '   • AI-adaptive color schemes with OKLCH values';
    RAISE NOTICE '   • Premium animation and interaction preferences';
    RAISE NOTICE '';
    RAISE NOTICE '🤖 AI Features:';
    RAISE NOTICE '   • Smart matching and predictive pricing configs';
    RAISE NOTICE '   • AI assistant and performance insights';
    RAISE NOTICE '   • Behavioral analysis and trust scoring';
    RAISE NOTICE '   • Sample AI interactions and training data';
    RAISE NOTICE '';
    RAISE NOTICE '🛡️  Trust System:';
    RAISE NOTICE '   • Multi-layered verification system';
    RAISE NOTICE '   • Community trust network';
    RAISE NOTICE '   • Trust score calculation and history';
    RAISE NOTICE '   • Community boards with moderation';
    RAISE NOTICE '';
    RAISE NOTICE '💎 Premium Features:';
    RAISE NOTICE '   • 5-tier subscription system (Free → Quantum Enterprise)';
    RAISE NOTICE '   • Premium UI customization options';
    RAISE NOTICE '   • Advanced AI features per tier';
    RAISE NOTICE '   • Trust system enhancements';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Development Tools:';
    RAISE NOTICE '   • Enhanced create_sample_user_2025() function';
    RAISE NOTICE '   • Comprehensive analytics and metrics';
    RAISE NOTICE '   • Performance monitoring setup';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for 2025! The future of hyperlocal services is here.';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Run the enhanced schema: supabase/schema_2025.sql';
    RAISE NOTICE '2. Apply RLS policies and functions';
    RAISE NOTICE '3. Test premium UI themes and AI features';
    RAISE NOTICE '4. Configure AI model integrations';
    RAISE NOTICE '5. Set up trust verification workflows';
END $$;