export interface ReferralStats {
  total_referrals: number;
  successful_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  monthly_referrals: number;
  monthly_earnings: number;
  conversion_rate: number;
}

export interface ReferralHistory {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referred_email?: string;
  referral_code: string;
  referral_source: string;
  status: "pending" | "completed" | "cancelled";
  reward_amount: number;
  created_at: string;
  completed_at?: string;
  first_booking_id?: string;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  referrer_reward: number;
  referee_reward: number;
  minimum_spending?: number;
  expiry_days?: number;
  max_uses_per_user?: number;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  terms_and_conditions: string;
}

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  uses_count: number;
  max_uses?: number;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}

export interface ReferralReward {
  id: string;
  referral_id: string;
  user_id: string;
  reward_type: "credit" | "cash" | "discount";
  amount: number;
  status: "pending" | "credited" | "expired";
  created_at: string;
  credited_at?: string;
  expires_at?: string;
}

export interface ReferralLeaderboard {
  user_id: string;
  user_name: string;
  total_referrals: number;
  total_earnings: number;
  rank: number;
  period: "monthly" | "quarterly" | "yearly" | "all_time";
}

export interface ReferralTier {
  id: string;
  name: string;
  min_referrals: number;
  max_referrals?: number;
  bonus_multiplier: number;
  benefits: string[];
  badge_icon?: string;
  badge_color?: string;
}

export interface UserReferralTier {
  user_id: string;
  current_tier_id: string;
  total_referrals: number;
  total_earnings: number;
  next_tier_id?: string;
  next_tier_progress: number;
}

// Referral tracking events
export interface ReferralEvent {
  id: string;
  referral_id: string;
  event_type: "signup" | "first_booking" | "reward_credited" | "tier_upgraded";
  event_data: Record<string, any>;
  created_at: string;
}

// Campaign management
export interface ReferralCampaign {
  id: string;
  name: string;
  description: string;
  campaign_type:
    | "seasonal"
    | "promotional"
    | "tier_based"
    | "category_specific";
  target_audience?: string[];
  bonus_reward: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  conditions: Record<string, any>;
  created_by: string;
}

// Analytics and insights
export interface ReferralAnalytics {
  period: string;
  total_referrals: number;
  successful_referrals: number;
  conversion_rate: number;
  total_rewards_paid: number;
  average_time_to_conversion: number;
  top_referral_sources: Array<{
    source: string;
    count: number;
    conversion_rate: number;
  }>;
  geographic_distribution: Array<{
    location: string;
    referrals: number;
    conversion_rate: number;
  }>;
  referral_channels: Array<{
    channel: string;
    referrals: number;
    conversions: number;
  }>;
}

// Form types
export interface CreateReferralCodeForm {
  custom_code?: string;
  max_uses?: number;
  expires_at?: string;
}

export interface ReferralSignupForm {
  email: string;
  name: string;
  referral_code: string;
  agreed_to_terms: boolean;
}

// API response types
export interface ReferralApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedReferralResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Webhook payloads
export interface ReferralWebhookPayload {
  event: string;
  referral_id: string;
  referrer_id: string;
  referred_user_id: string;
  data: Record<string, any>;
  timestamp: string;
}

// Commission tracking
export interface AffiliateCommission {
  id: string;
  affiliate_id: string;
  booking_id: string;
  commission_rate: number;
  commission_amount: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  created_at: string;
  approved_at?: string;
  paid_at?: string;
}

export interface AffiliateStats {
  total_commissions: number;
  pending_commissions: number;
  paid_commissions: number;
  total_bookings_generated: number;
  conversion_rate: number;
  average_commission_amount: number;
}

// Social sharing
export interface SocialShareTemplate {
  platform: "email" | "twitter" | "facebook" | "linkedin" | "whatsapp" | "sms";
  template_name: string;
  subject?: string;
  message: string;
  call_to_action: string;
  variables: string[];
}

// Gamification
export interface ReferralBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement_type: "referral_count" | "earnings" | "streak" | "special";
  requirement_value: number;
  is_rare: boolean;
}

export interface UserReferralBadge {
  user_id: string;
  badge_id: string;
  earned_at: string;
  is_displayed: boolean;
}

// Constants
export const REFERRAL_SOURCES = [
  "email",
  "twitter",
  "facebook",
  "linkedin",
  "whatsapp",
  "sms",
  "direct_link",
  "qr_code",
  "other",
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export const REFERRAL_STATUS_COLORS = {
  pending: "text-yellow-600 bg-yellow-100",
  completed: "text-green-600 bg-green-100",
  cancelled: "text-red-600 bg-red-100",
} as const;

export const DEFAULT_REFERRAL_REWARDS = {
  referrer_amount: 10,
  referee_amount: 10,
  currency: "USD",
  reward_type: "credit" as const,
} as const;
