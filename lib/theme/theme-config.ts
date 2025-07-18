interface RegionTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  branding: {
    logo: string;
    logoMark: string;
    favicon: string;
    socialImage: string;
  };
  features: {
    showLocalCulture: boolean;
    useLocalCurrency: boolean;
    enableRTL: boolean;
    customGreeting: string;
  };
  marketing: {
    heroImage: string;
    testimonialStyle: "cards" | "carousel" | "grid";
    ctaStyle: "primary" | "gradient" | "outline";
  };
}

interface ThemeConfig {
  regions: Record<string, RegionTheme>;
  fallback: RegionTheme;
}

export const themeConfig: ThemeConfig = {
  regions: {
    "us": {
      name: "United States",
      colors: {
        primary: "#2563eb", // Blue
        secondary: "#64748b",
        accent: "#f59e0b",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      branding: {
        logo: "/logos/loconomy-us.svg",
        logoMark: "/logos/mark-us.svg",
        favicon: "/favicons/us.ico",
        socialImage: "/og/us-social.jpg"
      },
      features: {
        showLocalCulture: true,
        useLocalCurrency: true,
        enableRTL: false,
        customGreeting: "Welcome to your local service marketplace!"
      },
      marketing: {
        heroImage: "/heroes/us-hero.jpg",
        testimonialStyle: "cards",
        ctaStyle: "primary"
      }
    },
    "uk": {
      name: "United Kingdom",
      colors: {
        primary: "#dc2626", // British Red
        secondary: "#64748b",
        accent: "#059669",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      branding: {
        logo: "/logos/loconomy-uk.svg",
        logoMark: "/logos/mark-uk.svg",
        favicon: "/favicons/uk.ico",
        socialImage: "/og/uk-social.jpg"
      },
      features: {
        showLocalCulture: true,
        useLocalCurrency: true,
        enableRTL: false,
        customGreeting: "Welcome to your local services hub!"
      },
      marketing: {
        heroImage: "/heroes/uk-hero.jpg",
        testimonialStyle: "carousel",
        ctaStyle: "primary"
      }
    },
    "de": {
      name: "Germany",
      colors: {
        primary: "#000000", // German Black
        secondary: "#dc2626", // German Red
        accent: "#fbbf24", // German Gold
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      branding: {
        logo: "/logos/loconomy-de.svg",
        logoMark: "/logos/mark-de.svg",
        favicon: "/favicons/de.ico",
        socialImage: "/og/de-social.jpg"
      },
      features: {
        showLocalCulture: true,
        useLocalCurrency: true,
        enableRTL: false,
        customGreeting: "Willkommen zu Ihrem lokalen Dienstleistungsmarktplatz!"
      },
      marketing: {
        heroImage: "/heroes/de-hero.jpg",
        testimonialStyle: "grid",
        ctaStyle: "outline"
      }
    },
    "ae": {
      name: "United Arab Emirates",
      colors: {
        primary: "#059669", // Islamic Green
        secondary: "#dc2626", // Red
        accent: "#fbbf24", // Gold
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      branding: {
        logo: "/logos/loconomy-ae.svg",
        logoMark: "/logos/mark-ae.svg",
        favicon: "/favicons/ae.ico",
        socialImage: "/og/ae-social.jpg"
      },
      features: {
        showLocalCulture: true,
        useLocalCurrency: true,
        enableRTL: true,
        customGreeting: "مرحباً بكم في السوق المحلي للخدمات!"
      },
      marketing: {
        heroImage: "/heroes/ae-hero.jpg",
        testimonialStyle: "cards",
        ctaStyle: "gradient"
      }
    },
    "jp": {
      name: "Japan",
      colors: {
        primary: "#dc2626", // Japanese Red
        secondary: "#64748b",
        accent: "#f59e0b",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      branding: {
        logo: "/logos/loconomy-jp.svg",
        logoMark: "/logos/mark-jp.svg",
        favicon: "/favicons/jp.ico",
        socialImage: "/og/jp-social.jpg"
      },
      features: {
        showLocalCulture: true,
        useLocalCurrency: true,
        enableRTL: false,
        customGreeting: "地域サービスマーケットプレイスへようこそ！"
      },
      marketing: {
        heroImage: "/heroes/jp-hero.jpg",
        testimonialStyle: "carousel",
        ctaStyle: "primary"
      }
    },
    "in": {
      name: "India",
      colors: {
        primary: "#f97316", // Saffron
        secondary: "#059669", // Green
        accent: "#3b82f6", // Blue
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      branding: {
        logo: "/logos/loconomy-in.svg",
        logoMark: "/logos/mark-in.svg",
        favicon: "/favicons/in.ico",
        socialImage: "/og/in-social.jpg"
      },
      features: {
        showLocalCulture: true,
        useLocalCurrency: true,
        enableRTL: false,
        customGreeting: "स्थानीय सेवा बाज़ार में आपका स्वागत है!"
      },
      marketing: {
        heroImage: "/heroes/in-hero.jpg",
        testimonialStyle: "grid",
        ctaStyle: "gradient"
      }
    }
  },
  fallback: {
    name: "Global",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#f59e0b",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      textSecondary: "#64748b"
    },
    fonts: {
      heading: "Inter",
      body: "Inter"
    },
    branding: {
      logo: "/logos/loconomy-global.svg",
      logoMark: "/logos/mark-global.svg",
      favicon: "/favicon.ico",
      socialImage: "/og-image.png"
    },
    features: {
      showLocalCulture: false,
      useLocalCurrency: false,
      enableRTL: false,
      customGreeting: "Welcome to Loconomy!"
    },
    marketing: {
      heroImage: "/heroes/global-hero.jpg",
      testimonialStyle: "cards",
      ctaStyle: "primary"
    }
  }
};

// Helper functions
export function getRegionTheme(region?: string): RegionTheme {
  if (!region) return themeConfig.fallback;
  return themeConfig.regions[region.toLowerCase()] || themeConfig.fallback;
}

export function detectRegionFromLocale(locale: string): string {
  // Extract country code from locale (e.g., "en-US" -> "us")
  if (locale.includes('-')) {
    return locale.split('-')[1].toLowerCase();
  }
  
  // Map language codes to probable regions
  const languageToRegion: Record<string, string> = {
    'ar': 'ae',
    'de': 'de',
    'ja': 'jp',
    'hi': 'in',
    'en': 'us'
  };
  
  return languageToRegion[locale] || 'us';
}

export function generateCSSVariables(theme: RegionTheme): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-secondary: ${theme.colors.textSecondary};
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};
    }
  `;
}

export function getThemeMetadata(theme: RegionTheme) {
  return {
    title: `Loconomy - ${theme.name}`,
    favicon: theme.branding.favicon,
    ogImage: theme.branding.socialImage,
    logo: theme.branding.logo,
    logoMark: theme.branding.logoMark
  };
}