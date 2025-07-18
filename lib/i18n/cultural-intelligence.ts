import { type Locale } from "./config";
import { getCityConfiguration } from "./city-localization";

// Cultural dimensions framework (based on Hofstede's model)
export interface CulturalDimensions {
  powerDistance: number; // 0-100 (hierarchy vs equality)
  individualismCollectivism: number; // 0-100 (individual vs group)
  masculinityFemininity: number; // 0-100 (competition vs cooperation)
  uncertaintyAvoidance: number; // 0-100 (risk tolerance)
  longTermOrientation: number; // 0-100 (tradition vs adaptation)
  indulgenceRestraint: number; // 0-100 (expression vs control)
}

// Cultural preferences for different locales
export const culturalProfiles: Record<
  Locale,
  CulturalDimensions & {
    communicationStyle: "direct" | "indirect" | "high-context";
    timeOrientation: "monochronic" | "polychronic";
    negotiationStyle: "competitive" | "collaborative" | "avoiding";
    trustBuilding: "task-first" | "relationship-first";
    decisionMaking: "individual" | "consensus" | "hierarchical";
    feedbackStyle: "direct" | "diplomatic" | "implicit";
    serviceExpectations: {
      responseTime: "immediate" | "same-day" | "flexible";
      personalTouch: "high" | "medium" | "low";
      formality: "formal" | "semi-formal" | "casual";
      hierarchy: "respected" | "moderate" | "flat";
    };
  }
> = {
  // Western cultures
  en: {
    powerDistance: 40,
    individualismCollectivism: 91,
    masculinityFemininity: 62,
    uncertaintyAvoidance: 46,
    longTermOrientation: 26,
    indulgenceRestraint: 68,
    communicationStyle: "direct",
    timeOrientation: "monochronic",
    negotiationStyle: "competitive",
    trustBuilding: "task-first",
    decisionMaking: "individual",
    feedbackStyle: "direct",
    serviceExpectations: {
      responseTime: "immediate",
      personalTouch: "medium",
      formality: "casual",
      hierarchy: "flat",
    },
  },

  // East Asian cultures
  zh: {
    powerDistance: 80,
    individualismCollectivism: 20,
    masculinityFemininity: 66,
    uncertaintyAvoidance: 30,
    longTermOrientation: 87,
    indulgenceRestraint: 24,
    communicationStyle: "indirect",
    timeOrientation: "polychronic",
    negotiationStyle: "collaborative",
    trustBuilding: "relationship-first",
    decisionMaking: "hierarchical",
    feedbackStyle: "implicit",
    serviceExpectations: {
      responseTime: "flexible",
      personalTouch: "high",
      formality: "formal",
      hierarchy: "respected",
    },
  },

  ja: {
    powerDistance: 54,
    individualismCollectivism: 46,
    masculinityFemininity: 95,
    uncertaintyAvoidance: 92,
    longTermOrientation: 88,
    indulgenceRestraint: 42,
    communicationStyle: "high-context",
    timeOrientation: "monochronic",
    negotiationStyle: "avoiding",
    trustBuilding: "relationship-first",
    decisionMaking: "consensus",
    feedbackStyle: "implicit",
    serviceExpectations: {
      responseTime: "same-day",
      personalTouch: "high",
      formality: "formal",
      hierarchy: "respected",
    },
  },

  ko: {
    powerDistance: 60,
    individualismCollectivism: 18,
    masculinityFemininity: 39,
    uncertaintyAvoidance: 85,
    longTermOrientation: 100,
    indulgenceRestraint: 29,
    communicationStyle: "indirect",
    timeOrientation: "monochronic",
    negotiationStyle: "collaborative",
    trustBuilding: "relationship-first",
    decisionMaking: "hierarchical",
    feedbackStyle: "diplomatic",
    serviceExpectations: {
      responseTime: "immediate",
      personalTouch: "high",
      formality: "formal",
      hierarchy: "respected",
    },
  },

  // South Asian cultures
  hi: {
    powerDistance: 77,
    individualismCollectivism: 48,
    masculinityFemininity: 56,
    uncertaintyAvoidance: 40,
    longTermOrientation: 51,
    indulgenceRestraint: 26,
    communicationStyle: "indirect",
    timeOrientation: "polychronic",
    negotiationStyle: "collaborative",
    trustBuilding: "relationship-first",
    decisionMaking: "hierarchical",
    feedbackStyle: "diplomatic",
    serviceExpectations: {
      responseTime: "flexible",
      personalTouch: "high",
      formality: "formal",
      hierarchy: "respected",
    },
  },

  // Middle Eastern cultures
  ar: {
    powerDistance: 80,
    individualismCollectivism: 25,
    masculinityFemininity: 60,
    uncertaintyAvoidance: 75,
    longTermOrientation: 14,
    indulgenceRestraint: 34,
    communicationStyle: "high-context",
    timeOrientation: "polychronic",
    negotiationStyle: "collaborative",
    trustBuilding: "relationship-first",
    decisionMaking: "hierarchical",
    feedbackStyle: "diplomatic",
    serviceExpectations: {
      responseTime: "flexible",
      personalTouch: "high",
      formality: "formal",
      hierarchy: "respected",
    },
  },

  // European cultures
  de: {
    powerDistance: 35,
    individualismCollectivism: 67,
    masculinityFemininity: 66,
    uncertaintyAvoidance: 65,
    longTermOrientation: 83,
    indulgenceRestraint: 40,
    communicationStyle: "direct",
    timeOrientation: "monochronic",
    negotiationStyle: "competitive",
    trustBuilding: "task-first",
    decisionMaking: "individual",
    feedbackStyle: "direct",
    serviceExpectations: {
      responseTime: "same-day",
      personalTouch: "low",
      formality: "semi-formal",
      hierarchy: "moderate",
    },
  },

  fr: {
    powerDistance: 68,
    individualismCollectivism: 71,
    masculinityFemininity: 43,
    uncertaintyAvoidance: 86,
    longTermOrientation: 63,
    indulgenceRestraint: 48,
    communicationStyle: "direct",
    timeOrientation: "monochronic",
    negotiationStyle: "competitive",
    trustBuilding: "relationship-first",
    decisionMaking: "individual",
    feedbackStyle: "direct",
    serviceExpectations: {
      responseTime: "same-day",
      personalTouch: "medium",
      formality: "formal",
      hierarchy: "moderate",
    },
  },

  // Add defaults for remaining locales
} as any;

// Fill in defaults for missing locales
const defaultProfile = culturalProfiles.en;
(
  [
    "es",
    "pt",
    "bn",
    "ru",
    "pa",
    "ur",
    "tr",
    "it",
    "th",
    "fa",
    "pl",
    "nl",
    "uk",
    "vi",
    "he",
    "sw",
    "ro",
    "el",
    "cs",
    "hu",
    "fi",
    "da",
    "no",
    "sv",
    "id",
    "ms",
    "tl",
    "zh-TW",
  ] as Locale[]
).forEach((locale) => {
  if (!culturalProfiles[locale]) {
    culturalProfiles[locale] = { ...defaultProfile };
  }
});

// Cultural adaptation engine
export class CulturalAdaptationEngine {
  private locale: Locale;
  private profile: (typeof culturalProfiles)[Locale];

  constructor(locale: Locale) {
    this.locale = locale;
    this.profile = culturalProfiles[locale] || culturalProfiles.en;
  }

  // Adapt UI based on cultural preferences
  getUIAdaptations() {
    return {
      // Layout adaptations
      layout: {
        density:
          this.profile.uncertaintyAvoidance > 70 ? "spacious" : "compact",
        navigation: this.profile.powerDistance > 60 ? "hierarchical" : "flat",
        colorScheme: this.getCulturalColorScheme(),
      },

      // Interaction adaptations
      interaction: {
        confirmationDialogs: this.profile.uncertaintyAvoidance > 70,
        progressIndicators: this.profile.uncertaintyAvoidance > 60,
        tooltips: this.profile.communicationStyle === "high-context",
        animations: this.profile.indulgenceRestraint > 50,
      },

      // Content adaptations
      content: {
        formality: this.profile.serviceExpectations.formality,
        personalPronouns: this.profile.powerDistance > 60 ? "formal" : "casual",
        explanationLevel:
          this.profile.uncertaintyAvoidance > 70 ? "detailed" : "concise",
        socialProof: this.profile.individualismCollectivism < 50,
      },

      // Communication adaptations
      communication: {
        directness: this.profile.communicationStyle === "direct",
        responseTime: this.profile.serviceExpectations.responseTime,
        personalTouch: this.profile.serviceExpectations.personalTouch,
        relationship: this.profile.trustBuilding === "relationship-first",
      },
    };
  }

  // Get culturally appropriate messaging
  adaptMessage(
    baseMessage: string,
    context: "error" | "success" | "warning" | "info",
  ): string {
    const adaptations = this.getUIAdaptations();

    if (adaptations.content.formality === "formal") {
      baseMessage = this.formalizeMessage(baseMessage);
    }

    if (adaptations.communication.relationship && context === "error") {
      baseMessage = this.softenErrorMessage(baseMessage);
    }

    if (this.profile.communicationStyle === "indirect" && context === "error") {
      baseMessage = this.makeIndirect(baseMessage);
    }

    return baseMessage;
  }

  // Adapt pricing display based on cultural expectations
  adaptPricing(
    price: number,
    options: {
      showComparison?: boolean;
      showTax?: boolean;
      emphasizeValue?: boolean;
    } = {},
  ) {
    const cityConfig = getCityConfiguration(this.getCityFromLocale());

    return {
      display: this.formatPrice(price),
      showTax: options.showTax ?? !cityConfig?.taxIncluded,
      showComparison:
        options.showComparison ?? this.profile.uncertaintyAvoidance > 60,
      emphasizeValue:
        options.emphasizeValue ?? this.profile.masculinityFemininity < 50,
      negotiable: this.profile.negotiationStyle === "collaborative",
      trustSignals: this.profile.trustBuilding === "relationship-first",
    };
  }

  // Adapt scheduling interface based on time orientation
  adaptScheduling() {
    return {
      timeSlots:
        this.profile.timeOrientation === "monochronic" ? "precise" : "flexible",
      bufferTime: this.profile.timeOrientation === "polychronic",
      rescheduling:
        this.profile.uncertaintyAvoidance < 50 ? "easy" : "controlled",
      advance: this.profile.longTermOrientation > 60 ? "long" : "short",
      reminders: this.profile.timeOrientation === "monochronic",
    };
  }

  // Adapt feedback and review systems
  adaptFeedback() {
    return {
      style: this.profile.feedbackStyle,
      public: this.profile.individualismCollectivism > 60,
      detailed: this.profile.uncertaintyAvoidance > 70,
      anonymous: this.profile.powerDistance > 70,
      frequency:
        this.profile.feedbackStyle === "direct" ? "regular" : "minimal",
    };
  }

  // Get cultural color preferences
  private getCulturalColorScheme() {
    const colorMappings: Record<
      Locale,
      { primary: string; accent: string; warning: string; success: string }
    > = {
      zh: {
        primary: "#DC2626",
        accent: "#F59E0B",
        warning: "#F59E0B",
        success: "#DC2626",
      }, // Red & Gold
      ja: {
        primary: "#DC2626",
        accent: "#EC4899",
        warning: "#F59E0B",
        success: "#DC2626",
      }, // Red & Pink
      hi: {
        primary: "#EA580C",
        accent: "#F59E0B",
        warning: "#DC2626",
        success: "#EA580C",
      }, // Orange & Saffron
      ar: {
        primary: "#059669",
        accent: "#F59E0B",
        warning: "#DC2626",
        success: "#059669",
      }, // Green & Gold
      // Default for others
    } as any;

    return (
      colorMappings[this.locale] || {
        primary: "#2563EB",
        accent: "#7C3AED",
        warning: "#F59E0B",
        success: "#059669",
      }
    );
  }

  private formalizeMessage(message: string): string {
    // Add formal language patterns
    return message
      .replace(/\bcan't\b/g, "cannot")
      .replace(/\bwon't\b/g, "will not")
      .replace(/\bdon't\b/g, "do not")
      .replace(/\byou\b/g, this.profile.powerDistance > 70 ? "you" : "you");
  }

  private softenErrorMessage(message: string): string {
    if (message.startsWith("Error:")) {
      return message.replace(
        "Error:",
        "We apologize, but there seems to be an issue:",
      );
    }
    return `We apologize for any inconvenience. ${message}`;
  }

  private makeIndirect(message: string): string {
    return `It appears that ${message.toLowerCase()}`;
  }

  private formatPrice(price: number): string {
    // Use cultural number formatting
    const formatter = new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency: this.getCurrencyFromLocale(),
    });
    return formatter.format(price);
  }

  private getCityFromLocale(): string {
    // Map locale to default city
    const cityMappings: Record<Locale, string> = {
      en: "new_york",
      zh: "beijing",
      hi: "delhi",
      ja: "tokyo",
      ko: "seoul",
      ar: "dubai",
      de: "berlin",
      fr: "paris",
      // Add more mappings
    } as any;

    return cityMappings[this.locale] || "new_york";
  }

  private getCurrencyFromLocale(): string {
    const currencyMappings: Record<Locale, string> = {
      en: "USD",
      zh: "CNY",
      hi: "INR",
      ja: "JPY",
      ko: "KRW",
      ar: "AED",
      de: "EUR",
      fr: "EUR",
      // Add more mappings
    } as any;

    return currencyMappings[this.locale] || "USD";
  }

  changeLocale(locale: Locale) {
    this.locale = locale;
    this.profile = culturalProfiles[locale] || culturalProfiles.en;
  }
}

// Cultural events and holidays system
export interface CulturalEvent {
  name: string;
  date: string; // ISO format or recurring pattern
  type: "holiday" | "festival" | "observance" | "business";
  importance: "high" | "medium" | "low";
  businessImpact: "closed" | "reduced" | "normal" | "busy";
  colors?: string[];
  greetings?: string[];
  serviceAdaptations?: {
    messaging?: string;
    promotions?: boolean;
    restrictions?: string[];
  };
}

export const culturalEvents: Record<Locale, CulturalEvent[]> = {
  en: [
    {
      name: "Christmas",
      date: "12-25",
      type: "holiday",
      importance: "high",
      businessImpact: "closed",
      colors: ["#DC2626", "#059669"],
      greetings: ["Merry Christmas", "Happy Holidays"],
      serviceAdaptations: {
        messaging: "Holiday booking available with advance notice",
        promotions: true,
      },
    },
    {
      name: "Thanksgiving",
      date: "11-24", // 4th Thursday of November (simplified)
      type: "holiday",
      importance: "high",
      businessImpact: "closed",
      greetings: ["Happy Thanksgiving"],
    },
  ],

  zh: [
    {
      name: "春节",
      date: "02-01", // Lunar calendar (simplified)
      type: "festival",
      importance: "high",
      businessImpact: "closed",
      colors: ["#DC2626", "#F59E0B"],
      greetings: ["新年快乐", "恭喜发财"],
      serviceAdaptations: {
        messaging: "春节期间服务可能有所调整",
        promotions: true,
        restrictions: ["no_renovation", "no_loud_services"],
      },
    },
    {
      name: "中秋节",
      date: "09-15", // Lunar calendar (simplified)
      type: "festival",
      importance: "high",
      businessImpact: "reduced",
      greetings: ["中秋节快乐"],
    },
  ],

  hi: [
    {
      name: "दिवाली",
      date: "11-01", // Lunar calendar (simplified)
      type: "festival",
      importance: "high",
      businessImpact: "closed",
      colors: ["#F59E0B", "#EA580C", "#DC2626"],
      greetings: ["दिवाली की शुभकामनाएं", "Happy Diwali"],
      serviceAdaptations: {
        messaging: "दिवाली के दौरान सेवा ��ें देरी हो सकती है",
        promotions: true,
      },
    },
    {
      name: "होली",
      date: "03-15", // Variable date (simplified)
      type: "festival",
      importance: "high",
      businessImpact: "reduced",
      colors: ["#EC4899", "#F59E0B", "#059669"],
      greetings: ["होली की शुभकामनाएं", "Happy Holi"],
    },
  ],

  ar: [
    {
      name: "عيد الفطر",
      date: "05-01", // Islamic calendar (simplified)
      type: "holiday",
      importance: "high",
      businessImpact: "closed",
      colors: ["#059669", "#F59E0B"],
      greetings: ["عيد مبارك", "Eid Mubarak"],
      serviceAdaptations: {
        messaging: "خدمات محدودة خلال فترة العيد",
        promotions: false,
        restrictions: ["no_food_services_during_fasting"],
      },
    },
    {
      name: "عيد الأضحى",
      date: "07-10", // Islamic calendar (simplified)
      type: "holiday",
      importance: "high",
      businessImpact: "closed",
      greetings: ["عيد أضحى مبارك"],
    },
  ],

  // Add more locales...
} as any;

// Cultural adaptation hook
export function useCulturalAdaptation(locale: Locale) {
  const [engine] = useState(() => new CulturalAdaptationEngine(locale));

  useEffect(() => {
    engine.changeLocale(locale);
  }, [locale, engine]);

  return {
    adaptations: engine.getUIAdaptations(),
    adaptMessage: (
      message: string,
      context: "error" | "success" | "warning" | "info",
    ) => engine.adaptMessage(message, context),
    adaptPricing: (price: number, options?: any) =>
      engine.adaptPricing(price, options),
    adaptScheduling: () => engine.adaptScheduling(),
    adaptFeedback: () => engine.adaptFeedback(),
    culturalProfile: culturalProfiles[locale],
    culturalEvents: culturalEvents[locale] || [],
  };
}

// Get current cultural events
export function getCurrentCulturalEvents(locale: Locale): CulturalEvent[] {
  const events = culturalEvents[locale] || [];
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  return events.filter((event) => {
    // Simple date matching (MM-DD format)
    const [month, day] = event.date.split("-").map(Number);
    const eventDate = new Date(today.getFullYear(), month - 1, day);
    const daysDiff = Math.abs(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Show events within 7 days
    return daysDiff <= 7;
  });
}
