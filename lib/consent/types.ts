/**
 * Cookie Consent Types
 * Defines consent preferences and settings
 */

export interface ConsentPreferences {
  necessary: boolean; // Always true, required for basic functionality
  analytics: boolean; // Google Analytics, performance tracking
  marketing: boolean; // Marketing cookies, ad targeting
  preferences: boolean; // User preferences, personalization
  timestamp: number; // When consent was given
  version: string; // Consent version for compliance
}

export interface ConsentContextValue {
  preferences: ConsentPreferences | null;
  isLoading: boolean;
  updateConsent: (preferences: Partial<ConsentPreferences>) => Promise<void>;
  hasConsented: boolean;
  showBanner: boolean;
  acceptAll: () => Promise<void>;
  rejectNonEssential: () => Promise<void>;
  resetConsent: () => Promise<void>;
}

export const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: Date.now(),
  version: "1.0.0",
};

export const CONSENT_STORAGE_KEY = "loconomy_consent_preferences";
export const CONSENT_VERSION = "1.0.0";

export interface CookieCategory {
  id: keyof Omit<ConsentPreferences, "necessary" | "timestamp" | "version">;
  name: string;
  description: string;
  required: boolean;
  examples: string[];
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "analytics",
    name: "Analytics & Performance",
    description:
      "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    required: false,
    examples: ["Google Analytics", "Performance monitoring", "Error tracking"],
  },
  {
    id: "marketing",
    name: "Marketing & Advertising",
    description:
      "These cookies are used to make advertising messages more relevant to you and your interests.",
    required: false,
    examples: [
      "Ad targeting",
      "Social media tracking",
      "Marketing attribution",
    ],
  },
  {
    id: "preferences",
    name: "Preferences & Personalization",
    description:
      "These cookies allow the website to remember choices you make and provide enhanced, more personal features.",
    required: false,
    examples: [
      "Language preferences",
      "Theme settings",
      "Personalized content",
    ],
  },
];
