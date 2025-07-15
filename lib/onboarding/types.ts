export type OnboardingStep =
  | "welcome"
  | "profile_setup"
  | "preferences"
  | "service_categories"
  | "service_details"
  | "pricing_setup"
  | "availability"
  | "completion";

export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export interface OnboardingProgress {
  id: string;
  user_id: string;
  role: "consumer" | "provider";
  current_step: OnboardingStep;
  completed_steps: OnboardingStep[];
  status: OnboardingStatus;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConsumerProfile {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  preferences?: {
    service_categories?: string[];
    notification_preferences?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    budget_range?: {
      min: number;
      max: number;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  description?: string;
  phone?: string;
  business_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  service_areas?: Array<{
    name: string;
    radius: number;
    coordinates: {
      lat: number;
      lng: number;
    };
  }>;
  categories: string[];
  pricing_model: "hourly" | "fixed" | "custom";
  base_rate?: number;
  availability?: {
    monday?: { start: string; end: string; available: boolean };
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  };
  certifications: string[];
  insurance_info?: {
    provider: string;
    policy_number: string;
    expiry_date: string;
  };
  payment_methods: string[];
  created_at: string;
  updated_at: string;
}

export interface OnboardingStepConfig {
  id: OnboardingStep;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  isOptional?: boolean;
  requiredFor?: ("consumer" | "provider")[];
}

export interface OnboardingStepProps {
  onNext: (data?: Record<string, any>) => void;
  onPrev: () => void;
  onSkip?: () => void;
  initialData?: Record<string, any>;
  isLastStep?: boolean;
  currentStep: OnboardingStep;
}

export interface OnboardingFlowProps {
  role: "consumer" | "provider";
  initialProgress?: OnboardingProgress;
  onComplete?: (data: Record<string, any>) => void;
}

// Service categories for providers
export const SERVICE_CATEGORIES = [
  "Home Maintenance",
  "Cleaning Services",
  "Landscaping",
  "Pet Care",
  "Personal Training",
  "Tutoring",
  "Photography",
  "Event Planning",
  "Auto Services",
  "Beauty & Wellness",
  "Tech Support",
  "Moving Services",
  "Childcare",
  "Elder Care",
  "Food Services",
  "Other",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

// Consumer preference categories
export const CONSUMER_INTERESTS = [
  "Home & Garden",
  "Health & Fitness",
  "Technology",
  "Automotive",
  "Food & Dining",
  "Entertainment",
  "Education",
  "Pet Services",
  "Beauty & Personal Care",
  "Professional Services",
] as const;

export type ConsumerInterest = (typeof CONSUMER_INTERESTS)[number];
