// Loconomy-Specific Types - AI-Native Services Marketplace
// Multi-tenant, event-driven architecture for hyperlocal services

import { UserRole, SubscriptionTier } from './rbac';

// ============================================
// 1️⃣ MULTI-TENANCY & WORKSPACE SYSTEM
// ============================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: TenantType;
  status: TenantStatus;
  location: TenantLocation;
  settings: TenantSettings;
  branding: TenantBranding;
  createdAt: string;
  updatedAt: string;
}

export type TenantType = 'city' | 'region' | 'enterprise' | 'global';
export type TenantStatus = 'active' | 'suspended' | 'pending' | 'archived';

export interface TenantLocation {
  city: string;
  state: string;
  country: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  serviceRadius: number; // in kilometers
}

export interface TenantSettings {
  features: TenantFeatures;
  billing: TenantBilling;
  moderation: TenantModeration;
  ai: TenantAISettings;
}

export interface TenantFeatures {
  aiAssistant: boolean;
  smartRecommendations: boolean;
  voiceSearch: boolean;
  autoTranslation: boolean;
  advancedAnalytics: boolean;
  customBranding: boolean;
}

export interface TenantBilling {
  commissionRate: number; // percentage
  platformFee: number; // fixed fee per transaction
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  currency: string;
}

export interface TenantModeration {
  autoApproval: boolean;
  requireVerification: boolean;
  contentFiltering: boolean;
  aiModeration: boolean;
}

export interface TenantAISettings {
  model: 'gpt-4' | 'claude-3' | 'gemini-pro';
  personalityPrompt: string;
  knowledgeBase: string[];
  autoResponses: boolean;
}

export interface TenantBranding {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain?: string;
  favicon: string;
}

// ============================================
// 2️⃣ AI-NATIVE SERVICES & LISTINGS
// ============================================

export interface ServiceListing {
  id: string;
  tenantId: string;
  providerId: string;
  
  // Core listing data
  title: string;
  description: string;
  category: ServiceCategory;
  subcategory: string;
  tags: string[];
  
  // AI-generated content
  aiGenerated: {
    title: boolean;
    description: boolean;
    tags: boolean;
    pricing: boolean;
  };
  
  // Pricing & availability
  pricing: ServicePricing;
  availability: ServiceAvailability;
  location: ServiceLocation;
  
  // Media & verification
  media: ServiceMedia;
  verification: ServiceVerification;
  
  // Performance metrics
  metrics: ServiceMetrics;
  
  // Status & timestamps
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  aiKeywords: string[];
  tenantSpecific: boolean;
}

export interface ServicePricing {
  type: 'fixed' | 'hourly' | 'custom' | 'package';
  basePrice: number;
  currency: string;
  packages?: ServicePackage[];
  aiOptimized: boolean;
  dynamicPricing: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  features: string[];
}

export interface ServiceAvailability {
  type: 'immediate' | 'scheduled' | 'flexible';
  leadTime: number; // hours
  maxAdvanceBooking: number; // days
  bufferTime: number; // minutes between bookings
  workingHours: WorkingHours[];
  exceptions: AvailabilityException[];
}

export interface WorkingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

export interface AvailabilityException {
  date: string; // YYYY-MM-DD
  reason: string;
  isAvailable: boolean;
  customHours?: {
    startTime: string;
    endTime: string;
  };
}

export interface ServiceLocation {
  type: 'on_site' | 'remote' | 'both';
  serviceArea: ServiceArea;
  address?: ServiceAddress;
}

export interface ServiceArea {
  center: {
    lat: number;
    lng: number;
  };
  radius: number; // kilometers
  zipcodes?: string[];
  cities?: string[];
}

export interface ServiceAddress {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface ServiceMedia {
  images: ServiceImage[];
  videos: ServiceVideo[];
  documents: ServiceDocument[];
}

export interface ServiceImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  aiGenerated: boolean;
  order: number;
}

export interface ServiceVideo {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  title: string;
}

export interface ServiceDocument {
  id: string;
  name: string;
  url: string;
  type: 'license' | 'insurance' | 'certification' | 'portfolio';
  verificationStatus: VerificationStatus;
}

export interface ServiceVerification {
  isVerified: boolean;
  verificationLevel: 'basic' | 'standard' | 'premium';
  badges: ServiceBadge[];
  lastVerified?: string;
}

export interface ServiceBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface ServiceMetrics {
  views: number;
  inquiries: number;
  bookings: number;
  completions: number;
  cancellations: number;
  rating: number;
  reviewCount: number;
  responseTime: number; // minutes
  aiMatchScore: number; // 0-100
}

export type ListingStatus = 'draft' | 'pending' | 'active' | 'paused' | 'rejected' | 'archived';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

// ============================================
// 3️⃣ BOOKING & ORDER MANAGEMENT
// ============================================

export interface BookingOrder {
  id: string;
  tenantId: string;
  listingId: string;
  providerId: string;
  customerId: string;
  
  // Booking details
  serviceDate: string;
  serviceTime: string;
  duration: number; // minutes
  location: BookingLocation;
  notes: string;
  
  // Pricing breakdown
  pricing: BookingPricing;
  
  // Status & lifecycle
  status: BookingStatus;
  lifecycle: BookingLifecycle;
  
  // Communication
  messages: BookingMessage[];
  
  // AI insights
  aiInsights: BookingAIInsights;
  
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending' | 'confirmed' | 'in_progress' 
  | 'completed' | 'cancelled' | 'disputed' | 'refunded';

export interface BookingLocation {
  type: 'customer_address' | 'provider_location' | 'remote' | 'custom';
  address?: ServiceAddress;
  instructions?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BookingPricing {
  subtotal: number;
  platformFee: number;
  tenantCommission: number;
  taxes: number;
  total: number;
  currency: string;
  breakdown: PricingBreakdown[];
}

export interface PricingBreakdown {
  item: string;
  amount: number;
  type: 'service' | 'fee' | 'tax' | 'discount';
}

export interface BookingLifecycle {
  requestedAt: string;
  confirmedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  automatedActions: AutomatedAction[];
}

export interface AutomatedAction {
  action: string;
  triggeredAt: string;
  reason: string;
  aiGenerated: boolean;
}

export interface BookingMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'system' | 'ai';
  aiGenerated: boolean;
  sentAt: string;
  readAt?: string;
}

export interface BookingAIInsights {
  riskScore: number; // 0-100
  successProbability: number; // 0-100
  suggestedActions: AISuggestion[];
  sentimentAnalysis: SentimentAnalysis;
}

export interface AISuggestion {
  type: 'communication' | 'pricing' | 'scheduling' | 'follow_up';
  message: string;
  confidence: number;
  automated: boolean;
}

export interface SentimentAnalysis {
  customer: SentimentScore;
  provider: SentimentScore;
  overall: SentimentScore;
}

export interface SentimentScore {
  score: number; // -1 to 1
  label: 'negative' | 'neutral' | 'positive';
  confidence: number;
}

// ============================================
// 4️⃣ AI-FIRST UX COMPONENTS
// ============================================

export interface AIAgent {
  id: string;
  name: string;
  personality: AgentPersonality;
  capabilities: AgentCapability[];
  knowledgeBase: KnowledgeBase;
  context: AgentContext;
  status: AgentStatus;
}

export interface AgentPersonality {
  tone: 'professional' | 'friendly' | 'casual' | 'expert';
  style: 'concise' | 'detailed' | 'conversational';
  specialization: string[];
  language: string;
}

export type AgentCapability = 
  | 'listing_generation' | 'search_assistance' | 'booking_help'
  | 'price_optimization' | 'customer_support' | 'provider_coaching'
  | 'conflict_resolution' | 'market_analysis';

export interface KnowledgeBase {
  serviceCatalog: ServiceCategory[];
  localMarketData: MarketData;
  bestPractices: BestPractice[];
  policies: PolicyDocument[];
}

export interface MarketData {
  averagePrices: Record<string, number>;
  demandTrends: TrendData[];
  competitorAnalysis: CompetitorData[];
  seasonalPatterns: SeasonalPattern[];
}

export interface TrendData {
  category: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  timeframe: string;
}

export interface CompetitorData {
  name: string;
  pricing: number;
  rating: number;
  marketShare: number;
}

export interface SeasonalPattern {
  category: string;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  demandMultiplier: number;
}

export interface BestPractice {
  category: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PolicyDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  version: string;
  lastUpdated: string;
}

export interface AgentContext {
  userId?: string;
  tenantId: string;
  currentPage: string;
  userRole: UserRole;
  subscriptionTier: SubscriptionTier;
  conversationHistory: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type AgentStatus = 'active' | 'learning' | 'maintenance' | 'offline';

// ============================================
// 5️⃣ SEARCH & DISCOVERY ENGINE
// ============================================

export interface SearchQuery {
  query: string;
  filters: SearchFilters;
  location: SearchLocation;
  ai: AISearchParams;
  user: SearchUser;
}

export interface SearchFilters {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  availability: AvailabilityFilter;
  rating: number;
  verified: boolean;
  distance: number;
  urgency: 'immediate' | 'today' | 'this_week' | 'flexible';
}

export interface AvailabilityFilter {
  date?: string;
  time?: string;
  duration?: number;
  flexible: boolean;
}

export interface SearchLocation {
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  zipcode?: string;
  radius: number;
}

export interface AISearchParams {
  useSemanticSearch: boolean;
  personalizeResults: boolean;
  includeRecommendations: boolean;
  explainResults: boolean;
}

export interface SearchUser {
  id?: string;
  role: UserRole;
  preferences: UserPreferences;
  history: SearchHistory[];
}

export interface UserPreferences {
  favoriteCategories: string[];
  pricePreference: 'budget' | 'value' | 'premium';
  qualityPreference: 'speed' | 'quality' | 'price';
  communicationStyle: 'minimal' | 'regular' | 'detailed';
}

export interface SearchHistory {
  query: string;
  timestamp: string;
  resultClicked?: string;
  bookingMade?: string;
}

export interface SearchResult {
  listing: ServiceListing;
  relevanceScore: number;
  aiExplanation: string;
  matchReasons: MatchReason[];
  distanceKm: number;
  estimatedResponse: string;
  quickActions: QuickAction[];
}

export interface MatchReason {
  type: 'location' | 'price' | 'availability' | 'rating' | 'specialization';
  explanation: string;
  weight: number;
}

export interface QuickAction {
  type: 'book_now' | 'message' | 'call' | 'save' | 'share';
  label: string;
  available: boolean;
}

// ============================================
// 6️⃣ BILLING & MONETIZATION
// ============================================

export interface BillingAccount {
  id: string;
  userId: string;
  tenantId: string;
  type: 'customer' | 'provider' | 'tenant';
  stripeCustomerId: string;
  subscriptions: Subscription[];
  paymentMethods: PaymentMethod[];
  billingHistory: BillingTransaction[];
  settings: BillingSettings;
}

export interface Subscription {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriod: BillingPeriod;
  pricing: SubscriptionPricing;
  features: SubscriptionFeature[];
  usage: UsageMetrics;
  aiOptimizations: AIOptimization[];
}

export type SubscriptionStatus = 
  | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing';

export interface BillingPeriod {
  start: string;
  end: string;
  billingDate: string;
}

export interface SubscriptionPricing {
  baseAmount: number;
  usageAmount: number;
  commissionAmount: number;
  totalAmount: number;
  currency: string;
}

export interface SubscriptionFeature {
  name: string;
  limit?: number;
  unlimited: boolean;
  aiEnhanced: boolean;
}

export interface UsageMetrics {
  period: BillingPeriod;
  listings: number;
  bookings: number;
  aiRequests: number;
  storageUsed: number; // MB
  bandwidthUsed: number; // MB
}

export interface AIOptimization {
  type: 'pricing' | 'features' | 'usage';
  suggestion: string;
  potentialSavings: number;
  implemented: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  last4: string;
  brand: string;
  isDefault: boolean;
  expiryDate?: string;
}

export interface BillingTransaction {
  id: string;
  type: 'subscription' | 'commission' | 'refund' | 'payout';
  amount: number;
  currency: string;
  description: string;
  status: TransactionStatus;
  relatedBooking?: string;
  createdAt: string;
}

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface BillingSettings {
  autoRenewal: boolean;
  invoiceEmail: string;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  taxSettings: TaxSettings;
}

export interface TaxSettings {
  includeTax: boolean;
  taxRate: number;
  taxId?: string;
  businessType: string;
}

// ============================================
// 7️⃣ COMMUNICATION & NOTIFICATIONS
// ============================================

export interface NotificationSystem {
  id: string;
  userId: string;
  tenantId: string;
  channels: NotificationChannel[];
  preferences: NotificationPreferences;
  templates: NotificationTemplate[];
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in_app' | 'webhook';
  enabled: boolean;
  address: string;
  verified: boolean;
  aiPersonalized: boolean;
}

export interface NotificationPreferences {
  bookingUpdates: boolean;
  messageAlerts: boolean;
  marketingEmails: boolean;
  aiSuggestions: boolean;
  weeklyDigest: boolean;
  emergencyOnly: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject: string;
  content: string;
  aiGenerated: boolean;
  variables: TemplateVariable[];
}

export type NotificationType = 
  | 'booking_confirmation' | 'booking_reminder' | 'message_received'
  | 'payment_completed' | 'review_request' | 'ai_insight' | 'system_alert';

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  description: string;
}

// ============================================
// 8️⃣ ANALYTICS & INSIGHTS
// ============================================

export interface AnalyticsDashboard {
  tenantId: string;
  userId: string;
  role: UserRole;
  widgets: AnalyticsWidget[];
  aiInsights: AnalyticsInsight[];
  timeframe: AnalyticsTimeframe;
}

export interface AnalyticsWidget {
  id: string;
  type: WidgetType;
  title: string;
  data: WidgetData;
  config: WidgetConfig;
  aiEnhanced: boolean;
}

export type WidgetType = 
  | 'revenue' | 'bookings' | 'listings' | 'customers' | 'ratings'
  | 'conversion' | 'retention' | 'market_share' | 'ai_performance';

export interface WidgetData {
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  breakdown: DataBreakdown[];
}

export interface DataBreakdown {
  label: string;
  value: number;
  percentage: number;
}

export interface WidgetConfig {
  size: 'small' | 'medium' | 'large';
  refreshInterval: number; // seconds
  showTrends: boolean;
  compareToMarket: boolean;
}

export interface AnalyticsInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  aiGenerated: boolean;
  confidence: number;
  createdAt: string;
}

export type InsightType = 
  | 'opportunity' | 'warning' | 'trend' | 'optimization' | 'benchmark';

export interface AnalyticsTimeframe {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  start: string;
  end: string;
  compareToMarket: boolean;
}

// ============================================
// 9️⃣ EVENT-DRIVEN ARCHITECTURE
// ============================================

export interface LoconomyEvent {
  id: string;
  type: EventType;
  tenantId: string;
  userId?: string;
  data: EventData;
  metadata: EventMetadata;
  timestamp: string;
}

export type EventType = 
  | 'user.registered' | 'user.verified' | 'listing.created' | 'listing.published'
  | 'booking.requested' | 'booking.confirmed' | 'booking.completed'
  | 'payment.processed' | 'review.submitted' | 'ai.insight_generated'
  | 'tenant.created' | 'subscription.changed';

export interface EventData {
  [key: string]: any;
}

export interface EventMetadata {
  source: string;
  version: string;
  correlationId: string;
  causationId?: string;
  aiGenerated: boolean;
}

// ============================================
// 🎯 LOCONOMY-SPECIFIC AGGREGATES
// ============================================

export interface LoconomyMarketplace {
  tenant: Tenant;
  listings: ServiceListing[];
  providers: LoconomyProvider[];
  customers: LoconomyCustomer[];
  bookings: BookingOrder[];
  aiAgent: AIAgent;
  analytics: AnalyticsDashboard;
}

export interface LoconomyProvider {
  userId: string;
  tenantId: string;
  profile: ProviderProfile;
  listings: ServiceListing[];
  bookings: BookingOrder[];
  earnings: ProviderEarnings;
  aiCoach: AIProviderCoach;
}

export interface ProviderProfile {
  businessName: string;
  description: string;
  specialties: string[];
  experience: number; // years
  verification: ProviderVerification;
  availability: ProviderAvailability;
  serviceArea: ServiceArea;
}

export interface ProviderVerification {
  level: 'basic' | 'verified' | 'premium' | 'elite';
  badges: string[];
  documents: VerificationDocument[];
  lastVerified: string;
  aiTrustScore: number;
}

export interface VerificationDocument {
  type: 'license' | 'insurance' | 'certification';
  number: string;
  issuer: string;
  expiryDate: string;
  verified: boolean;
}

export interface ProviderEarnings {
  total: number;
  thisMonth: number;
  lastMonth: number;
  breakdown: EarningsBreakdown[];
  projections: EarningsProjection[];
}

export interface EarningsBreakdown {
  source: 'bookings' | 'tips' | 'bonuses';
  amount: number;
  count: number;
}

export interface EarningsProjection {
  period: string;
  projected: number;
  confidence: number;
  aiGenerated: boolean;
}

export interface AIProviderCoach {
  recommendations: CoachingRecommendation[];
  performanceInsights: PerformanceInsight[];
  optimizations: ProviderOptimization[];
}

export interface CoachingRecommendation {
  type: 'pricing' | 'availability' | 'communication' | 'marketing';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'easy' | 'moderate' | 'complex';
  aiGenerated: boolean;
}

export interface PerformanceInsight {
  metric: string;
  current: number;
  benchmark: number;
  trend: 'improving' | 'declining' | 'stable';
  explanation: string;
}

export interface ProviderOptimization {
  area: string;
  suggestion: string;
  potentialIncrease: number; // revenue %
  implemented: boolean;
}

export interface LoconomyCustomer {
  userId: string;
  tenantId: string;
  preferences: CustomerPreferences;
  bookingHistory: BookingOrder[];
  reviews: CustomerReview[];
  aiProfile: CustomerAIProfile;
}

export interface CustomerPreferences {
  serviceCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  preferredProviders: string[];
  communicationStyle: 'minimal' | 'regular' | 'detailed';
  loyaltyProgram: boolean;
}

export interface CustomerReview {
  id: string;
  bookingId: string;
  providerId: string;
  rating: number;
  comment: string;
  categories: ReviewCategory[];
  helpful: number;
  aiSentiment: SentimentScore;
  createdAt: string;
}

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface CustomerAIProfile {
  segments: CustomerSegment[];
  predictions: CustomerPrediction[];
  recommendations: CustomerRecommendation[];
  lifetime_value: number;
}

export interface CustomerSegment {
  name: string;
  confidence: number;
  characteristics: string[];
}

export interface CustomerPrediction {
  type: 'churn' | 'upsell' | 'referral' | 'repeat_booking';
  probability: number;
  timeframe: string;
  factors: string[];
}

export interface CustomerRecommendation {
  type: 'service' | 'provider' | 'time' | 'price';
  title: string;
  description: string;
  confidence: number;
  personalized: boolean;
}