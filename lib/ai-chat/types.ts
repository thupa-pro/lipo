// AI Chat Assistant Types

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
  type: "text" | "suggestion" | "action" | "onboarding";
  metadata?: {
    isWelcome?: boolean;
    suggestions?: ChatSuggestion[];
    onboardingStep?: string;
    actionRequired?: string;
    confidence?: number;
    sources?: string[];
    [key: string]: any;
  };
  reactions?: {
    helpful?: number;
    not_helpful?: number;
    user_reaction?: "helpful" | "not_helpful";
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  type: "onboarding" | "support" | "general" | "booking_help";
  userId: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  messageCount: number;
  context: {
    step?: string;
    userType?: "consumer" | "provider";
    onboardingStage?: string;
    completedSteps?: string[];
    userProfile?: {
      name?: string;
      location?: string;
      interests?: string[];
      experience_level?: "beginner" | "intermediate" | "advanced";
    };
    [key: string]: any;
  };
  tags?: string[];
  priority?: "low" | "medium" | "high";
}

export interface ChatSuggestion {
  id: string;
  text: string;
  type: "quick_reply" | "action" | "onboarding" | "help";
  category?: string;
  metadata?: {
    actionType?: "navigate" | "open_modal" | "start_flow";
    targetUrl?: string;
    stepId?: string;
    priority?: number;
    icon?: string;
    [key: string]: any;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  category:
    | "profile"
    | "preferences"
    | "verification"
    | "first_booking"
    | "platform_tour";
  order: number;
  completed: boolean;
  completedAt?: string;
  required: boolean;
  estimatedMinutes: number;
  actionUrl?: string;
  helpText?: string;
  checklistItems?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

export interface AIResponse {
  content: string;
  confidence: number;
  intent: string;
  entities?: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  suggestions?: ChatSuggestion[];
  onboardingUpdate?: {
    stepCompleted?: string;
    nextStep?: string;
    progress: number;
  };
  conversationUpdate?: {
    title?: string;
    context?: Record<string, any>;
    tags?: string[];
  };
  metadata?: {
    sources?: string[];
    processingTime?: number;
    model?: string;
    [key: string]: any;
  };
}

export interface ChatAnalytics {
  conversationId: string;
  metrics: {
    totalMessages: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
    completionRate: number;
    bounceRate: number;
    popularTopics: Array<{
      topic: string;
      count: number;
      percentage: number;
    }>;
    commonQuestions: Array<{
      question: string;
      frequency: number;
      averageResolutionTime: number;
    }>;
  };
  timeline: Array<{
    date: string;
    messageCount: number;
    satisfactionScore: number;
  }>;
}

export interface ChatSession {
  id: string;
  userId: string;
  conversationId: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  messageCount: number;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  exitType?: "natural" | "timeout" | "closed" | "error";
}

export interface AIKnowledgeBase {
  id: string;
  title: string;
  content: string;
  category: "onboarding" | "features" | "troubleshooting" | "policies" | "faq";
  tags: string[];
  priority: number;
  lastUpdated: string;
  usage_count: number;
  effectiveness_score: number;
  related_articles?: string[];
}

export interface ChatIntent {
  name: string;
  confidence: number;
  entities: Array<{
    entity: string;
    value: string;
    confidence: number;
  }>;
  context?: Record<string, any>;
}

export interface ChatContext {
  userId: string;
  conversationId: string;
  userProfile?: {
    name?: string;
    userType?: "consumer" | "provider";
    location?: string;
    joinedDate?: string;
    completedBookings?: number;
    preferredCategories?: string[];
  };
  sessionContext?: {
    currentPage?: string;
    previousPages?: string[];
    timeOnSite?: number;
    deviceType?: string;
    browser?: string;
  };
  conversationHistory?: {
    previousTopics?: string[];
    resolvedIssues?: string[];
    pendingActions?: string[];
    lastInteraction?: string;
  };
  onboardingContext?: {
    currentStep?: string;
    completedSteps?: string[];
    skippedSteps?: string[];
    stuckSteps?: string[];
    progressPercentage?: number;
  };
}

export interface AIPersonality {
  name: string;
  description: string;
  traits: Array<{
    trait: string;
    level: number; // 1-10
    description: string;
  }>;
  responseStyle: {
    formality: "casual" | "professional" | "friendly";
    verbosity: "concise" | "detailed" | "adaptive";
    empathy: "high" | "medium" | "low";
    humor: boolean;
    proactive: boolean;
  };
  specializations: string[];
}

export interface ChatTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
  usage_count: number;
  effectiveness_score: number;
  last_used: string;
}

// API Response Types
export interface ChatApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    requestId?: string;
    processingTime?: number;
    model?: string;
    tokens?: number;
  };
}

export interface PaginatedChatResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface SendMessageForm {
  content: string;
  type?: "text" | "suggestion" | "action";
  attachments?: File[];
  metadata?: Record<string, any>;
}

export interface CreateConversationForm {
  title: string;
  type: "onboarding" | "support" | "general" | "booking_help";
  context?: Record<string, any>;
  priority?: "low" | "medium" | "high";
}

export interface UpdateConversationForm {
  title?: string;
  status?: "active" | "completed" | "archived";
  context?: Record<string, any>;
  tags?: string[];
  lastMessageAt?: string;
  messageCount?: number;
}

// Constants
export const CONVERSATION_TYPES = [
  { value: "onboarding", label: "Onboarding Help" },
  { value: "support", label: "Customer Support" },
  { value: "general", label: "General Questions" },
  { value: "booking_help", label: "Booking Assistance" },
] as const;

export const MESSAGE_TYPES = [
  { value: "text", label: "Text Message" },
  { value: "suggestion", label: "Suggestion Click" },
  { value: "action", label: "Action Trigger" },
  { value: "onboarding", label: "Onboarding Step" },
] as const;

export const ONBOARDING_CATEGORIES = [
  { value: "profile", label: "Profile Setup", icon: "👤" },
  { value: "preferences", label: "Preferences", icon: "⚙️" },
  { value: "verification", label: "Verification", icon: "✅" },
  { value: "first_booking", label: "First Booking", icon: "📅" },
  { value: "platform_tour", label: "Platform Tour", icon: "🗺️" },
] as const;

export const SUGGESTION_TYPES = [
  { value: "quick_reply", label: "Quick Reply" },
  { value: "action", label: "Action Button" },
  { value: "onboarding", label: "Onboarding Step" },
  { value: "help", label: "Help Topic" },
] as const;

export const AI_CONFIDENCE_LEVELS = {
  very_high: { min: 0.9, label: "Very High", color: "green" },
  high: { min: 0.7, label: "High", color: "blue" },
  medium: { min: 0.5, label: "Medium", color: "yellow" },
  low: { min: 0.3, label: "Low", color: "orange" },
  very_low: { min: 0, label: "Very Low", color: "red" },
} as const;

export const DEFAULT_SUGGESTIONS = {
  welcome: [
    {
      id: "setup-profile",
      text: "Help me set up my profile",
      type: "onboarding" as const,
    },
    {
      id: "how-it-works",
      text: "How does Loconomy work?",
      type: "help" as const,
    },
    {
      id: "first-booking",
      text: "Guide me through my first booking",
      type: "action" as const,
    },
    {
      id: "browse-services",
      text: "Show me available services",
      type: "action" as const,
    },
  ],
  general: [
    {
      id: "pricing-info",
      text: "How much does it cost?",
      type: "help" as const,
    },
    {
      id: "service-areas",
      text: "What areas do you serve?",
      type: "help" as const,
    },
    {
      id: "safety-measures",
      text: "What safety measures are in place?",
      type: "help" as const,
    },
    {
      id: "payment-methods",
      text: "What payment methods do you accept?",
      type: "help" as const,
    },
  ],
  booking: [
    {
      id: "cancel-booking",
      text: "How do I cancel a booking?",
      type: "help" as const,
    },
    {
      id: "reschedule-booking",
      text: "Can I reschedule my appointment?",
      type: "help" as const,
    },
    {
      id: "contact-provider",
      text: "How do I contact my service provider?",
      type: "help" as const,
    },
    {
      id: "payment-issues",
      text: "I have a payment issue",
      type: "help" as const,
    },
  ],
} as const;

export type ConversationType = (typeof CONVERSATION_TYPES)[number]["value"];
export type MessageType = (typeof MESSAGE_TYPES)[number]["value"];
export type OnboardingCategory =
  (typeof ONBOARDING_CATEGORIES)[number]["value"];
export type SuggestionType = (typeof SUGGESTION_TYPES)[number]["value"];
