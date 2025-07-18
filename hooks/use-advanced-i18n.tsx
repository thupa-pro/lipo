"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useIntl } from "next-intl";
import { type Locale } from "@/lib/i18n/config";
import {
  SmartTranslator,
  TranslationAnalytics,
  TranslationABTesting,
  type TranslationOptions,
} from "@/lib/i18n/advanced-features";
import { VoiceInterface } from "@/lib/i18n/voice-interface";
import {
  CulturalAdaptationEngine,
  useCulturalAdaptation,
  getCurrentCulturalEvents,
} from "@/lib/i18n/cultural-intelligence";
import {
  ProgressiveLanguageLoader,
  NetworkAwareTranslationLoader,
  OfflineTranslationManager,
} from "@/lib/i18n/offline-support";
import { useCityLocalization } from "./use-city-localization";

// Enhanced translation hook with all advanced features
export function useAdvancedI18n() {
  const intl = useIntl();
  const { locale } = intl;
  const { selectedCity, cityConfig } = useCityLocalization();
  const culturalAdaptation = useCulturalAdaptation(locale as Locale);

  // Advanced feature instances
  const [smartTranslator] = useState(
    () => new SmartTranslator({}, locale as Locale),
  );
  const [analytics] = useState(() => new TranslationAnalytics());
  const [abTesting] = useState(() => new TranslationABTesting());
  const [voiceInterface] = useState(() => new VoiceInterface(locale as Locale));
  const [progressiveLoader] = useState(() => new ProgressiveLanguageLoader());
  const [networkLoader] = useState(() => new NetworkAwareTranslationLoader());
  const [offlineManager] = useState(() => new OfflineTranslationManager());

  // State management
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [loadedLanguages, setLoadedLanguages] = useState<Set<string>>(
    new Set(),
  );
  const [translationErrors, setTranslationErrors] = useState<
    Map<string, Error>
  >(new Map());

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Smart translation function with all advanced features
  const t = useCallback(
    (
      key: string,
      options: TranslationOptions & {
        abTest?: string;
        userId?: string;
        trackAnalytics?: boolean;
      } = {},
    ) => {
      const {
        abTest,
        userId,
        trackAnalytics = true,
        ...translationOptions
      } = options;

      try {
        let translation: string;

        // A/B testing
        if (abTest && userId) {
          const variant = abTesting.getVariant(abTest, userId);
          if (variant) {
            translation = variant;
          } else {
            translation = smartTranslator.translate(key, translationOptions);
          }
        } else {
          translation = smartTranslator.translate(key, translationOptions);
        }

        // Cultural adaptation
        if (options.context) {
          translation = culturalAdaptation.adaptMessage(
            translation,
            options.context as any,
          );
        }

        // Analytics tracking
        if (trackAnalytics) {
          analytics.trackTranslation(key, locale as Locale, 0);
        }

        return translation;
      } catch (error) {
        analytics.trackError(key, locale as Locale, error as Error);
        setTranslationErrors((prev) => new Map(prev.set(key, error as Error)));
        return intl.t(key) || key; // Fallback to next-intl
      }
    },
    [smartTranslator, analytics, abTesting, culturalAdaptation, intl, locale],
  );

  // Voice interface integration
  const speak = useCallback(
    (text: string) => {
      voiceInterface.speak(text);
    },
    [voiceInterface],
  );

  const startListening = useCallback(
    (callback?: (text: string) => void) => {
      voiceInterface.setCallbacks({
        onResult: (text, confidence) => {
          const command = voiceInterface.processCommand(text);
          if (command) {
            callback?.(text);
          }
        },
      });
      voiceInterface.startListening();
    },
    [voiceInterface],
  );

  // Progressive language loading
  const loadLanguage = useCallback(
    async (
      targetLocale: Locale,
      priority: "high" | "normal" | "low" = "normal",
    ) => {
      try {
        await progressiveLoader.loadLanguage(targetLocale, priority);
        setLoadedLanguages((prev) => new Set(prev.add(targetLocale)));
      } catch (error) {
        console.error(`Failed to load language ${targetLocale}:`, error);
        setTranslationErrors(
          (prev) => new Map(prev.set(`load_${targetLocale}`, error as Error)),
        );
      }
    },
    [progressiveLoader],
  );

  // Preload critical languages
  const preloadLanguages = useCallback(
    async (locales: Locale[]) => {
      if (networkLoader.shouldPreload()) {
        const batchSize = networkLoader.getOptimalBatchSize();
        const batches = [];

        for (let i = 0; i < locales.length; i += batchSize) {
          batches.push(locales.slice(i, i + batchSize));
        }

        for (const batch of batches) {
          await Promise.allSettled(
            batch.map((locale) => loadLanguage(locale, "low")),
          );
        }
      }
    },
    [networkLoader, loadLanguage],
  );

  // Cultural events for current locale
  const culturalEvents = useMemo(() => {
    return getCurrentCulturalEvents(locale as Locale);
  }, [locale]);

  // Formatting functions with cultural awareness
  const formatters = useMemo(
    () => ({
      currency: (amount: number, options?: Intl.NumberFormatOptions) =>
        culturalAdaptation.adaptPricing(amount, options),

      number: (number: number, options?: Intl.NumberFormatOptions) => {
        const culturalColors = culturalAdaptation.culturalProfile;
        return new Intl.NumberFormat(locale, {
          ...options,
          // Add cultural number formatting preferences
        }).format(number);
      },

      date: (date: Date, options?: Intl.DateTimeFormatOptions) => {
        const timeFormat = cityConfig?.timeFormat || "24h";
        return new Intl.DateTimeFormat(locale, {
          ...options,
          hour12: timeFormat === "12h",
        }).format(date);
      },

      relativeTime: (date: Date) => {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        const diff = date.getTime() - Date.now();
        const days = Math.round(diff / (1000 * 60 * 60 * 24));

        if (Math.abs(days) < 1) {
          const hours = Math.round(diff / (1000 * 60 * 60));
          return rtf.format(hours, "hour");
        }
        return rtf.format(days, "day");
      },
    }),
    [culturalAdaptation, locale, cityConfig],
  );

  // A/B testing functions
  const abTestingHelpers = useMemo(
    () => ({
      createTest: (key: string, variants: Record<string, string>) =>
        abTesting.createTest(key, variants),

      getVariant: (key: string, userId: string) =>
        abTesting.getVariant(key, userId),

      trackConversion: (key: string, userId: string) =>
        abTesting.trackConversion(key, userId),

      getResults: (key: string) => abTesting.getResults(key),
    }),
    [abTesting],
  );

  // Analytics helpers
  const analyticsHelpers = useMemo(
    () => ({
      getMetrics: () => analytics.getMetrics(),
      getMostUsed: (limit?: number) => analytics.getMostUsedTranslations(limit),
      getSlowTranslations: (threshold?: number) =>
        analytics.getSlowTranslations(threshold),
      getErrors: () => analytics.getErrorProneTranslations(),
    }),
    [analytics],
  );

  // Offline capabilities
  const offlineHelpers = useMemo(
    () => ({
      isOffline,
      isLanguageLoaded: (targetLocale: string) =>
        loadedLanguages.has(targetLocale),
      getAvailableLanguages: () => progressiveLoader.getAvailableLanguages(),
      syncTranslations: (targetLocale: string) =>
        offlineManager.syncWithServer(targetLocale),
    }),
    [isOffline, loadedLanguages, progressiveLoader, offlineManager],
  );

  // Quality helpers
  const qualityHelpers = useMemo(
    () => ({
      errors: translationErrors,
      clearError: (key: string) => {
        setTranslationErrors((prev) => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });
      },
      hasErrors: translationErrors.size > 0,
    }),
    [translationErrors],
  );

  // Initialize on mount
  useEffect(() => {
    // Initialize offline manager
    offlineManager.init();

    // Preload critical languages in background
    if (typeof window !== "undefined") {
      const criticalLanguages: Locale[] = ["en", locale as Locale];
      preloadLanguages(criticalLanguages);
    }
  }, [offlineManager, preloadLanguages, locale]);

  return {
    // Core translation
    t,
    locale: locale as Locale,

    // Voice interface
    speak,
    startListening,
    stopListening: () => voiceInterface.stopListening(),
    isVoiceSupported: voiceInterface.isSupported(),

    // Cultural adaptation
    culturalAdaptation,
    culturalEvents,
    adaptations: culturalAdaptation.adaptations,

    // Formatting
    formatters,

    // Language loading
    loadLanguage,
    preloadLanguages,

    // A/B testing
    abTesting: abTestingHelpers,

    // Analytics
    analytics: analyticsHelpers,

    // Offline support
    offline: offlineHelpers,

    // Quality monitoring
    quality: qualityHelpers,

    // City localization integration
    city: {
      selectedCity,
      config: cityConfig,
    },
  };
}

// Specialized hooks for specific use cases
export function useVoiceCommands(locale: Locale) {
  const { speak, startListening, stopListening, isVoiceSupported } =
    useAdvancedI18n();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const handleVoiceCommand = useCallback((command: string) => {
    setLastCommand(command);
    setIsListening(false);
  }, []);

  const startVoiceCommand = useCallback(() => {
    setIsListening(true);
    startListening(handleVoiceCommand);
  }, [startListening, handleVoiceCommand]);

  const stopVoiceCommand = useCallback(() => {
    setIsListening(false);
    stopListening();
  }, [stopListening]);

  return {
    speak,
    startVoiceCommand,
    stopVoiceCommand,
    isListening,
    lastCommand,
    isSupported: isVoiceSupported,
  };
}

export function useCulturalUI(locale: Locale) {
  const { culturalAdaptation, culturalEvents } = useAdvancedI18n();

  return {
    adaptations: culturalAdaptation.adaptations,
    adaptMessage: culturalAdaptation.adaptMessage,
    adaptPricing: culturalAdaptation.adaptPricing,
    adaptScheduling: culturalAdaptation.adaptScheduling,
    adaptFeedback: culturalAdaptation.adaptFeedback,
    culturalProfile: culturalAdaptation.culturalProfile,
    culturalEvents,
    isRTL: culturalAdaptation.adaptations.content.formality === "formal",
  };
}

export function useTranslationAnalytics() {
  const { analytics, quality } = useAdvancedI18n();

  return {
    metrics: analytics.getMetrics(),
    mostUsed: analytics.getMostUsed(),
    slowTranslations: analytics.getSlowTranslations(),
    errors: analytics.getErrors(),
    quality,
  };
}

export function useOfflineTranslations() {
  const { offline, loadLanguage } = useAdvancedI18n();

  return {
    ...offline,
    loadLanguage,
    ensureLanguageAvailable: async (locale: Locale) => {
      if (!offline.isLanguageLoaded(locale)) {
        await loadLanguage(locale, "high");
      }
    },
  };
}
