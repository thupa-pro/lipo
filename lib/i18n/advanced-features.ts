import { type Locale } from "./config";

// Advanced pluralization rules for different languages
export interface PluralRules {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export interface TranslationOptions {
  count?: number;
  context?: string;
  fallback?: string;
  gender?: "male" | "female" | "neutral";
  formality?: "formal" | "informal";
  region?: string;
}

// Pluralization rules by language
const pluralRules: Record<Locale, (count: number) => keyof PluralRules> = {
  // English: one, other
  en: (n) => (n === 1 ? "one" : "other"),

  // Chinese: other (no pluralization)
  zh: () => "other",
  "zh-TW": () => "other",

  // Hindi: one, other
  hi: (n) => (n === 1 ? "one" : "other"),

  // Spanish: one, other
  es: (n) => (n === 1 ? "one" : "other"),

  // Arabic: zero, one, two, few, many, other
  ar: (n) => {
    if (n === 0) return "zero";
    if (n === 1) return "one";
    if (n === 2) return "two";
    if (n % 100 >= 3 && n % 100 <= 10) return "few";
    if (n % 100 >= 11 && n % 100 <= 99) return "many";
    return "other";
  },

  // Portuguese: one, other
  pt: (n) => (n === 1 ? "one" : "other"),

  // Bengali: one, other
  bn: (n) => (n === 1 ? "one" : "other"),

  // Russian: one, few, many, other
  ru: (n) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "other";
  },

  // Japanese: other (no pluralization)
  ja: () => "other",

  // Punjabi: one, other
  pa: (n) => (n === 1 ? "one" : "other"),

  // German: one, other
  de: (n) => (n === 1 ? "one" : "other"),

  // Urdu: one, other
  ur: (n) => (n === 1 ? "one" : "other"),

  // Korean: other (no pluralization)
  ko: () => "other",

  // French: one, other
  fr: (n) => (n <= 1 ? "one" : "other"),

  // Turkish: other (no pluralization)
  tr: () => "other",

  // Italian: one, other
  it: (n) => (n === 1 ? "one" : "other"),

  // Thai: other (no pluralization)
  th: () => "other",

  // Persian: other (no pluralization)
  fa: () => "other",

  // Polish: one, few, many, other
  pl: (n) => {
    if (n === 1) return "one";
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "other";
  },

  // Dutch: one, other
  nl: (n) => (n === 1 ? "one" : "other"),

  // Ukrainian: one, few, many, other (same as Russian)
  uk: (n) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "other";
  },

  // Vietnamese: other (no pluralization)
  vi: () => "other",

  // Hebrew: one, two, other
  he: (n) => {
    if (n === 1) return "one";
    if (n === 2) return "two";
    return "other";
  },

  // Swahili: one, other
  sw: (n) => (n === 1 ? "one" : "other"),

  // Romanian: one, few, other
  ro: (n) => {
    if (n === 1) return "one";
    if (n === 0 || (n % 100 >= 1 && n % 100 <= 19)) return "few";
    return "other";
  },

  // Greek: one, other
  el: (n) => (n === 1 ? "one" : "other"),

  // Czech: one, few, other
  cs: (n) => {
    if (n === 1) return "one";
    if (n >= 2 && n <= 4) return "few";
    return "other";
  },

  // Hungarian: one, other
  hu: (n) => (n === 1 ? "one" : "other"),

  // Finnish: one, other
  fi: (n) => (n === 1 ? "one" : "other"),

  // Danish: one, other
  da: (n) => (n === 1 ? "one" : "other"),

  // Norwegian: one, other
  no: (n) => (n === 1 ? "one" : "other"),

  // Swedish: one, other
  sv: (n) => (n === 1 ? "one" : "other"),

  // Indonesian: other (no pluralization)
  id: () => "other",

  // Malay: other (no pluralization)
  ms: () => "other",

  // Filipino: one, other
  tl: (n) => (n <= 1 ? "one" : "other"),
};

// Smart translation with advanced features
export class SmartTranslator {
  private translations: Record<string, any>;
  private locale: Locale;
  private fallbackLocale: Locale = "en";
  private analytics: TranslationAnalytics;

  constructor(translations: Record<string, any>, locale: Locale) {
    this.translations = translations;
    this.locale = locale;
    this.analytics = new TranslationAnalytics();
  }

  translate(key: string, options: TranslationOptions = {}): string {
    const startTime = performance.now();

    try {
      let translation = this.getTranslation(key, options);

      // Handle pluralization
      if (options.count !== undefined && typeof translation === "object") {
        translation = this.handlePluralization(translation, options.count);
      }

      // Handle gender and formality
      if (typeof translation === "object") {
        translation = this.handleContextualTranslation(translation, options);
      }

      // Variable interpolation
      translation = this.interpolateVariables(translation, options);

      // Track analytics
      this.analytics.trackTranslation(
        key,
        this.locale,
        performance.now() - startTime,
      );

      return translation;
    } catch (error) {
      this.analytics.trackError(key, this.locale, error as Error);
      return options.fallback || key;
    }
  }

  private getTranslation(key: string, options: TranslationOptions): any {
    const keys = key.split(".");
    let current = this.translations;

    // Try to get translation in current locale
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Try fallback locale
        return this.getFallbackTranslation(key, options);
      }
    }

    return current;
  }

  private getFallbackTranslation(
    key: string,
    options: TranslationOptions,
  ): any {
    // Try user-provided fallback
    if (options.fallback) {
      return options.fallback;
    }

    // Try fallback locale (English)
    if (this.locale !== this.fallbackLocale) {
      const keys = key.split(".");
      let current = this.translations; // Would need fallback translations loaded

      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          return key; // Return key if no fallback found
        }
      }

      return current;
    }

    return key;
  }

  private handlePluralization(translation: any, count: number): string {
    if (typeof translation !== "object") return translation;

    const pluralRule = pluralRules[this.locale];
    const rule = pluralRule(count);

    // Return the appropriate plural form
    return (
      translation[rule] ||
      translation.other ||
      translation.one ||
      String(translation)
    );
  }

  private handleContextualTranslation(
    translation: any,
    options: TranslationOptions,
  ): string {
    if (typeof translation !== "object") return translation;

    // Handle gender-specific translations
    if (options.gender && translation[options.gender]) {
      return translation[options.gender];
    }

    // Handle formality levels
    if (options.formality && translation[options.formality]) {
      return translation[options.formality];
    }

    // Handle context-specific translations
    if (options.context && translation[options.context]) {
      return translation[options.context];
    }

    // Return default or first available
    return (
      translation.default ||
      translation[Object.keys(translation)[0]] ||
      String(translation)
    );
  }

  private interpolateVariables(translation: string, options: any): string {
    if (typeof translation !== "string") return translation;

    return translation.replace(/\{(\w+)\}/g, (match, variable) => {
      return options[variable] !== undefined
        ? String(options[variable])
        : match;
    });
  }
}

// Translation analytics and monitoring
export class TranslationAnalytics {
  private metrics: Map<
    string,
    {
      usage: number;
      avgRenderTime: number;
      errors: number;
      lastUsed: Date;
    }
  > = new Map();

  trackTranslation(key: string, locale: Locale, renderTime: number): void {
    const metricKey = `${locale}:${key}`;
    const existing = this.metrics.get(metricKey);

    if (existing) {
      existing.usage++;
      existing.avgRenderTime = (existing.avgRenderTime + renderTime) / 2;
      existing.lastUsed = new Date();
    } else {
      this.metrics.set(metricKey, {
        usage: 1,
        avgRenderTime: renderTime,
        errors: 0,
        lastUsed: new Date(),
      });
    }
  }

  trackError(key: string, locale: Locale, error: Error): void {
    const metricKey = `${locale}:${key}`;
    const existing = this.metrics.get(metricKey);

    if (existing) {
      existing.errors++;
    } else {
      this.metrics.set(metricKey, {
        usage: 0,
        avgRenderTime: 0,
        errors: 1,
        lastUsed: new Date(),
      });
    }

    // Log error for debugging
    console.error(`Translation error for ${metricKey}:`, error);
  }

  getMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};

    this.metrics.forEach((value, key) => {
      metrics[key] = value;
    });

    return metrics;
  }

  getMostUsedTranslations(
    limit: number = 10,
  ): Array<{ key: string; usage: number }> {
    return Array.from(this.metrics.entries())
      .sort(([, a], [, b]) => b.usage - a.usage)
      .slice(0, limit)
      .map(([key, data]) => ({ key, usage: data.usage }));
  }

  getSlowTranslations(
    threshold: number = 10,
  ): Array<{ key: string; avgTime: number }> {
    return Array.from(this.metrics.entries())
      .filter(([, data]) => data.avgRenderTime > threshold)
      .sort(([, a], [, b]) => b.avgRenderTime - a.avgRenderTime)
      .map(([key, data]) => ({ key, avgTime: data.avgRenderTime }));
  }

  getErrorProneTranslations(): Array<{ key: string; errors: number }> {
    return Array.from(this.metrics.entries())
      .filter(([, data]) => data.errors > 0)
      .sort(([, a], [, b]) => b.errors - a.errors)
      .map(([key, data]) => ({ key, errors: data.errors }));
  }
}

// A/B Testing for translations
export class TranslationABTesting {
  private tests: Map<
    string,
    {
      variants: Record<string, string>;
      distribution: Record<string, number>;
      results: Record<string, { conversions: number; views: number }>;
    }
  > = new Map();

  createTest(
    key: string,
    variants: Record<string, string>,
    distribution?: Record<string, number>,
  ): void {
    const defaultDistribution = Object.keys(variants).reduce(
      (acc, variant) => {
        acc[variant] = 1 / Object.keys(variants).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    this.tests.set(key, {
      variants,
      distribution: distribution || defaultDistribution,
      results: Object.keys(variants).reduce(
        (acc, variant) => {
          acc[variant] = { conversions: 0, views: 0 };
          return acc;
        },
        {} as Record<string, { conversions: number; views: number }>,
      ),
    });
  }

  getVariant(key: string, userId: string): string | null {
    const test = this.tests.get(key);
    if (!test) return null;

    // Use consistent hashing based on userId to ensure same user gets same variant
    const hash = this.hashUserId(userId + key);
    const variants = Object.keys(test.variants);
    let cumulative = 0;

    for (const variant of variants) {
      cumulative += test.distribution[variant];
      if (hash < cumulative) {
        test.results[variant].views++;
        return test.variants[variant];
      }
    }

    // Fallback to first variant
    const fallbackVariant = variants[0];
    test.results[fallbackVariant].views++;
    return test.variants[fallbackVariant];
  }

  trackConversion(key: string, userId: string): void {
    const test = this.tests.get(key);
    if (!test) return;

    const hash = this.hashUserId(userId + key);
    const variants = Object.keys(test.variants);
    let cumulative = 0;

    for (const variant of variants) {
      cumulative += test.distribution[variant];
      if (hash < cumulative) {
        test.results[variant].conversions++;
        break;
      }
    }
  }

  getResults(
    key: string,
  ): Record<string, { conversionRate: number; confidence: number }> | null {
    const test = this.tests.get(key);
    if (!test) return null;

    const results: Record<
      string,
      { conversionRate: number; confidence: number }
    > = {};

    Object.keys(test.variants).forEach((variant) => {
      const data = test.results[variant];
      const conversionRate = data.views > 0 ? data.conversions / data.views : 0;
      const confidence = this.calculateConfidence(data.conversions, data.views);

      results[variant] = { conversionRate, confidence };
    });

    return results;
  }

  private hashUserId(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) / 2147483647; // Normalize to 0-1
  }

  private calculateConfidence(conversions: number, views: number): number {
    if (views === 0) return 0;

    const p = conversions / views;
    const margin = 1.96 * Math.sqrt((p * (1 - p)) / views); // 95% confidence interval

    return Math.max(0, Math.min(1, 1 - margin));
  }
}

// Number formatting with local digit systems
export function formatLocalNumber(
  number: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  // Special handling for languages with different numeral systems
  const numeralSystems: Record<Locale, string | undefined> = {
    ar: "arab",
    fa: "arabext",
    hi: "deva",
    bn: "beng",
    th: "thai",
    // Most others use 'latn' (default)
  } as any;

  const numberFormat = new Intl.NumberFormat(locale, {
    ...options,
    numberingSystem: numeralSystems[locale],
  });

  return numberFormat.format(number);
}

// Cultural color preferences
export const culturalColors: Record<
  Locale,
  {
    lucky: string[];
    unlucky: string[];
    festive: string[];
    business: string[];
  }
> = {
  zh: {
    lucky: ["#FF0000", "#FFD700"], // Red, Gold
    unlucky: ["#FFFFFF", "#000000"], // White, Black
    festive: ["#FF0000", "#FFD700", "#FF69B4"], // Red, Gold, Pink
    business: ["#8B0000", "#FFD700"], // Dark Red, Gold
  },
  ja: {
    lucky: ["#FF0000", "#FFFFFF"], // Red, White
    unlucky: ["#000000"], // Black
    festive: ["#FF69B4", "#FFFFFF", "#FF0000"], // Pink, White, Red
    business: ["#000080", "#FFFFFF"], // Navy, White
  },
  hi: {
    lucky: ["#FF8C00", "#FF0000", "#FFD700"], // Orange, Red, Gold
    unlucky: ["#000000", "#FFFFFF"], // Black, White
    festive: ["#FF8C00", "#FF0000", "#FFFF00"], // Orange, Red, Yellow
    business: ["#FF8C00", "#8B4513"], // Orange, Brown
  },
  ar: {
    lucky: ["#008000", "#FFFFFF"], // Green, White
    unlucky: ["#FFFF00"], // Yellow
    festive: ["#008000", "#FFD700"], // Green, Gold
    business: ["#000080", "#FFFFFF"], // Navy, White
  },
  // Default for other languages
} as any;

// Smart caching system
export class TranslationCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> =
    new Map();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export { pluralRules };
