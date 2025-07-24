/**
 * 🧠 Loconomy Elite Content System
 * Centralized copy management with AI-aware, conversion-optimized messaging
 * Designed for sovereign systems, trust-building, and local context
 */

export const COPY = {
  // ============================================================================
  // BRAND VOICE & CORE MESSAGING
  // ============================================================================
  brand: {
    tagline: "Elite professionals meet intelligent matching in under 90 seconds",
    description: "The AI-native hyperlocal marketplace for premium services",
    valueProps: {
      speed: "90-second intelligent matching",
      quality: "Elite verified professionals",
      trust: "Community-powered verification",
      ai: "Sovereign AI automation"
    }
  },

  // ============================================================================
  // HOMEPAGE & LANDING
  // ============================================================================
  homepage: {
    hero: {
      headline: "Elite Local Services,\nIntelligently Matched",
      subheadline: "Connect with verified professionals in your neighborhood through our AI-powered marketplace. Quality guaranteed, community verified.",
      ctaPrimary: "Find Elite Services",
      ctaSecondary: "Join as Provider",
      trustSignal: "Trusted by 2.1M+ customers • 98% satisfaction rate"
    },
    features: [
      {
        title: "90-Second Matching",
        description: "Our AI analyzes your needs and connects you with the perfect professional instantly",
        icon: "⚡"
      },
      {
        title: "Elite Verification",
        description: "Every provider is thoroughly vetted through our community trust network",
        icon: "🛡️"
      },
      {
        title: "Sovereign Intelligence",
        description: "Advanced AI agents handle negotiations, scheduling, and quality assurance",
        icon: "🧠"
      }
    ]
  },

  // ============================================================================
  // AUTHENTICATION & ONBOARDING
  // ============================================================================
  auth: {
    signin: {
      title: "Welcome Back to Elite Services",
      subtitle: "Continue your journey with premium local professionals",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "Enter your secure password",
      submitButton: "Access Your Account",
      forgotPassword: "Recover Access",
      noAccount: "New to Loconomy?",
      signupLink: "Join the Elite Network",
      socialPrompt: "Or continue with:",
      trustSignal: "🔒 Bank-level security • SOC 2 compliant"
    },
    signup: {
      title: "Join the Elite Network",
      subtitle: "Experience premium local services with AI-powered matching",
      steps: {
        role: "Choose your path in the elite marketplace",
        details: "Let's personalize your premium experience",
        verification: "Secure your account with elite-grade protection"
      },
      benefits: [
        "⚡ 90-second intelligent matching",
        "🛡️ Community-verified professionals",
        "🤝 Concierge support included",
        "💎 Exclusive provider access"
      ]
    }
  },

  onboarding: {
    welcome: {
      customer: {
        title: "Welcome to Elite Local Services",
        subtitle: "Your AI assistant will help you discover premium professionals in minutes",
        description: "Our intelligent matching system learns your preferences to connect you with the perfect providers every time."
      },
      provider: {
        title: "Join the Elite Provider Network",
        subtitle: "Maximize your earnings with AI-powered customer matching",
        description: "Our platform connects you with pre-qualified customers who value premium service and fair pricing."
      }
    },
    steps: {
      profile: {
        title: "Create Your Elite Profile",
        subtitle: "Help us understand your needs for perfect matches",
        tips: "💡 Detailed profiles get 3x better matches"
      },
      preferences: {
        title: "Set Your Service Preferences", 
        subtitle: "Customize your experience for optimal results",
        tips: "🎯 Precise preferences = faster matches"
      },
      verification: {
        title: "Secure Your Elite Status",
        subtitle: "Quick verification unlocks premium features",
        tips: "✨ Verified users get priority matching"
      }
    }
  },

  // ============================================================================
  // AI & AGENT MESSAGING
  // ============================================================================
  ai: {
    agent: {
      welcome: "👋 I'm your AI concierge. I can help you book services, find providers, or answer questions. Try saying 'find me a cleaner' or use commands like /book or /search.",
      capabilities: "I can help you:",
      features: [
        "🔍 Find and compare elite providers",
        "📅 Schedule appointments instantly", 
        "💰 Negotiate fair pricing",
        "🤝 Handle service coordination",
        "❓ Answer service questions"
      ],
      commands: {
        book: "Book a service with AI assistance",
        search: "Find providers in your area",
        price: "Get pricing estimates",
        schedule: "Check availability",
        help: "Get assistance with anything"
      }
    },
    suggestions: {
      contextual: "Based on your location and history, you might need:",
      seasonal: "Popular in your area this season:",
      trending: "Trending services near you:",
      personalized: "Curated for your preferences:"
    }
  },

  // ============================================================================
  // BOOKING & TRANSACTIONS
  // ============================================================================
  booking: {
    flow: {
      search: {
        placeholder: "What service do you need? (e.g., house cleaning, plumbing, tutoring)",
        filters: "Refine your search for perfect matches",
        noResults: "No elite providers match your criteria yet. Our AI is onboarding new professionals daily. Try broadening your search or get notified when perfect matches arrive."
      },
      selection: {
        title: "Elite Providers Near You",
        subtitle: "AI-curated professionals ready to serve",
        viewProfile: "View Elite Profile",
        bookNow: "Book Instantly",
        getQuote: "Request Custom Quote"
      },
      details: {
        title: "Service Details",
        subtitle: "Tell us exactly what you need for optimal results",
        dateTimeLabel: "Preferred Date & Time",
        locationLabel: "Service Location",
        notesLabel: "Special Requirements",
        notesPlaceholder: "Any specific needs or preferences? Our providers excel at customization."
      },
      payment: {
        title: "Secure Payment",
        subtitle: "Protected by elite-grade escrow system",
        securityNote: "💳 Your payment is held securely until service completion",
        totalLabel: "Service Total",
        feeLabel: "Platform Fee",
        trustBadge: "🛡️ 100% Money-Back Guarantee"
      },
      confirmation: {
        title: "Booking Confirmed!",
        subtitle: "Your elite provider has been notified",
        nextSteps: "What happens next:",
        steps: [
          "Provider confirms within 30 minutes",
          "Receive preparation instructions", 
          "AI monitors service quality",
          "Automatic payment after completion"
        ]
      }
    }
  },

  // ============================================================================
  // TRUST & VERIFICATION
  // ============================================================================
  trust: {
    verification: {
      title: "Elite Trust Network",
      subtitle: "Community-powered verification for ultimate security",
      levels: {
        basic: "Identity Verified",
        community: "Neighbor Approved", 
        professional: "Skill Certified",
        elite: "Trust Network Validated"
      },
      badges: {
        emergency: "Emergency Response Certified",
        neighbor: "Community Verified",
        expert: "Skill Master (100+ services)",
        guardian: "Neighborhood Guardian",
        champion: "Response Champion (<15min)",
        hero: "Local Hero (Emergency Helper)"
      }
    },
    safety: {
      promise: "Your safety is our top priority",
      features: [
        "🔍 Background checks for all providers",
        "🏠 Address verification required",
        "📱 Real-time location sharing",
        "🚨 24/7 emergency support",
        "💰 Secure escrow protection"
      ]
    }
  },

  // ============================================================================
  // EMPTY STATES & ERRORS
  // ============================================================================
  emptyStates: {
    bookings: {
      title: "No bookings yet",
      description: "Start your elite service journey today",
      action: "Find Elite Services",
      benefits: [
        "⚡ 90-second AI matching",
        "🛡️ 100% verified providers", 
        "⭐ 5-star quality guarantee",
        "🚀 Instant booking"
      ]
    },
    providers: {
      title: "No providers in your network yet", 
      description: "Be the first elite provider in your area",
      action: "Join Elite Network",
      benefits: [
        "💎 Exclusive customer access",
        "🎯 AI-powered lead generation",
        "💰 Premium pricing support",
        "🤝 Concierge business support"
      ]
    },
    messages: {
      title: "No conversations yet",
      description: "Connect with elite providers and customers",
      action: "Start Networking",
      tip: "💬 Most elite connections start with a simple hello"
    },
    search: {
      title: "No results found",
      description: "Our AI couldn't find providers matching your exact criteria",
      suggestions: [
        "Try broader search terms",
        "Expand your radius", 
        "Check back later - we add providers daily",
        "Contact our concierge for custom matching"
      ],
      action: "Refine Search"
    }
  },

  errors: {
    generic: {
      title: "Something needs attention",
      description: "Our elite platform ensures quality, so we're being extra careful",
      actions: ["Try again", "Contact concierge support"],
      support: "Need help? Our team responds in under 5 minutes"
    },
    network: {
      title: "Connection interrupted",
      description: "We're working to restore your elite experience",
      retry: "Reconnecting...",
      offline: "You're offline - some features are limited"
    },
    payment: {
      title: "Payment needs verification",
      description: "For your security, we need to verify this transaction",
      support: "💳 Your payment is protected by bank-level security"
    },
    notFound: {
      title: "Page not found in our elite network",
      description: "This content may have moved or is being enhanced",
      action: "Return to Dashboard",
      help: "Need assistance? Our AI concierge is here to help"
    }
  },

  // ============================================================================
  // FORMS & INPUTS
  // ============================================================================
  forms: {
    validation: {
      required: "This field is required for optimal matching",
      email: "Please enter a valid email address",
      phone: "Valid phone number required for service coordination",
      password: "Password must be at least 8 characters for security",
      match: "Passwords must match for account protection"
    },
    placeholders: {
      name: "Your full name",
      email: "your@email.com",
      phone: "Your phone number",
      address: "Where do you need service?",
      company: "Your business name",
      website: "Your website (optional)",
      bio: "Tell potential customers about your expertise...",
      serviceDescription: "Describe what makes your service elite..."
    },
    help: {
      name: "Full name helps build trust with providers",
      phone: "Required for service coordination and emergencies",
      address: "Precise location ensures better provider matching",
      pricing: "Our AI analyzes market rates to suggest optimal pricing"
    }
  },

  // ============================================================================
  // NOTIFICATIONS & ALERTS
  // ============================================================================
  notifications: {
    success: {
      booking: "Elite provider matched! Confirmation sent to your email",
      payment: "Payment processed securely. Service details updated",
      profile: "Elite profile updated. Better matches incoming!",
      verification: "Verification complete! You now have elite status"
    },
    info: {
      matching: "Our AI is analyzing providers for your perfect match...",
      seasonal: "High demand detected. Consider booking soon for best availability",
      upgrade: "Unlock premium features with elite membership",
      reminder: "Your service is scheduled for tomorrow. Details attached"
    },
    warning: {
      payment: "Payment verification needed to complete booking",
      profile: "Complete your profile for 3x better matches",
      availability: "Limited providers available for your timeframe"
    }
  },

  // ============================================================================
  // LEGAL & PRIVACY
  // ============================================================================
  legal: {
    privacy: {
      title: "Your Privacy is Sacred",
      subtitle: "We protect your data with military-grade encryption",
      principles: [
        "🔐 Zero data selling - ever",
        "🎯 Only collect what improves your experience", 
        "🗑️ Easy data deletion anytime",
        "📍 Location data stays on your device",
        "🤝 Transparent AI decision-making"
      ]
    },
    cookies: {
      title: "Cookies for Elite Experience",
      description: "We use cookies to provide intelligent matching and personalized service discovery",
      essential: "Essential for platform functionality",
      analytics: "Help us improve your experience", 
      marketing: "Personalized service recommendations",
      accept: "Accept All",
      customize: "Customize Settings",
      learnMore: "Learn More"
    }
  },

  // ============================================================================
  // REVENUE & BUSINESS
  // ============================================================================
  revenue: {
    pricing: {
      dynamic: "AI-optimized pricing for maximum earnings",
      surge: "High demand detected - consider premium pricing",
      recommendation: "Based on market analysis, consider adjusting rates",
      competitive: "Your pricing is competitive in this market"
    },
    insights: {
      demand: "Service demand forecast for your area",
      earnings: "Maximize earnings with AI recommendations",
      performance: "Your elite performance metrics",
      growth: "Strategies to grow your business"
    }
  }
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get localized copy with fallback
 */
export function getCopy(key: string, locale: string = 'en'): string {
  // For now, return English copy. In future, implement i18n lookup
  const keys = key.split('.');
  let value: any = COPY;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || key;
}

/**
 * Format copy with dynamic values
 */
export function formatCopy(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] || match);
}

/**
 * Get contextual help text based on user state
 */
export function getContextualHelp(context: string, userType: 'customer' | 'provider'): string {
  const helps = {
    'booking.new': userType === 'customer' 
      ? "💡 Tip: Detailed requests get faster responses from elite providers"
      : "🎯 New booking request! Respond quickly to secure this customer",
    'profile.incomplete': userType === 'customer'
      ? "✨ Complete your profile for 3x better provider matches"
      : "🏆 Elite profiles get 5x more customer inquiries",
    'payment.pending': "🔒 Payment is securely held until service completion",
  };
  
  return helps[context as keyof typeof helps] || '';
}

/**
 * Get AI-appropriate response based on context
 */
export function getAIResponse(intent: string, context?: any): string {
  const responses = {
    'greeting': "👋 Hello! I'm your AI concierge. How can I help you find elite services today?",
    'booking.help': "I can help you book services instantly. What type of professional do you need?",
    'search.empty': "I couldn't find exact matches, but I'm learning your preferences. Try different terms or let me suggest alternatives.",
    'error.generic': "I encountered an issue, but our elite platform ensures reliability. Let me try a different approach.",
  };
  
  return responses[intent as keyof typeof responses] || "I'm here to help with your elite service needs.";
}

export default COPY;
