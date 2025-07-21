import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Supported locales configuration
export const SUPPORTED_LOCALES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    country: 'US',
    flag: '🇺🇸',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    country: 'ES',
    flag: '🇪🇸',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    country: 'FR',
    flag: '🇫🇷',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    country: 'DE',
    flag: '🇩🇪',
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    country: 'IT',
    flag: '🇮🇹',
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    country: 'PT',
    flag: '🇵🇹',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    country: 'JP',
    flag: '🇯🇵',
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    country: 'KR',
    flag: '🇰🇷',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    country: 'CN',
    flag: '🇨🇳',
  },
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;
export const DEFAULT_LOCALE: SupportedLocale = 'en';

// Translation value types
export type TranslationValue = string | number | boolean | Date;
export type TranslationParams = Record<string, TranslationValue>;

// Pluralization rules
export type PluralRule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export type PluralFunction = (count: number) => PluralRule;

// Translation namespace schema
export const TranslationNamespaceSchema = z.object({
  locale: z.string(),
  namespace: z.string(),
  translations: z.record(z.string(), z.any()),
  version: z.string().optional(),
  updated_at: z.string().datetime(),
});

type TranslationNamespace = z.infer<typeof TranslationNamespaceSchema>;

// Format options for different data types
export interface FormatOptions {
  currency?: {
    currency: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  };
  number?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
  };
  date?: {
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    weekday?: 'long' | 'short' | 'narrow';
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
  };
  relative?: {
    numeric?: 'always' | 'auto';
    style?: 'long' | 'short' | 'narrow';
  };
}

// Pluralization rules for different languages
const PLURAL_RULES: Record<SupportedLocale, PluralFunction> = {
  en: (count) => count === 1 ? 'one' : 'other',
  es: (count) => count === 1 ? 'one' : 'other',
  fr: (count) => count === 0 || count === 1 ? 'one' : 'other',
  de: (count) => count === 1 ? 'one' : 'other',
  it: (count) => count === 1 ? 'one' : 'other',
  pt: (count) => count === 1 ? 'one' : 'other',
  ja: () => 'other', // Japanese doesn't have plural forms
  ko: () => 'other', // Korean doesn't have plural forms
  zh: () => 'other', // Chinese doesn't have plural forms
};

export class I18nManager {
  private static instance: I18nManager;
  private translations: Map<string, Record<string, any>> = new Map();
  private currentLocale: SupportedLocale = DEFAULT_LOCALE;
  private fallbackLocale: SupportedLocale = DEFAULT_LOCALE;
  private loadedNamespaces: Set<string> = new Set();

  public static getInstance(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  // Set current locale
  setLocale(locale: SupportedLocale): void {
    if (!(locale in SUPPORTED_LOCALES)) {
      console.warn(`Unsupported locale: ${locale}, falling back to ${this.fallbackLocale}`);
      this.currentLocale = this.fallbackLocale;
      return;
    }
    this.currentLocale = locale;
  }

  // Get current locale
  getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  // Get locale configuration
  getLocaleConfig(locale?: SupportedLocale) {
    return SUPPORTED_LOCALES[locale || this.currentLocale];
  }

  // Load translation namespace
  async loadNamespace(namespace: string, locale?: SupportedLocale): Promise<void> {
    const targetLocale = locale || this.currentLocale;
    const namespaceKey = `${targetLocale}:${namespace}`;

    if (this.loadedNamespaces.has(namespaceKey)) {
      return; // Already loaded
    }

    try {
      // Try to load from database first
      const dbTranslations = await this.loadFromDatabase(namespace, targetLocale);
      if (dbTranslations) {
        this.translations.set(namespaceKey, dbTranslations);
        this.loadedNamespaces.add(namespaceKey);
        return;
      }

      // Fallback to static files
      const staticTranslations = await this.loadFromStaticFiles(namespace, targetLocale);
      if (staticTranslations) {
        this.translations.set(namespaceKey, staticTranslations);
        this.loadedNamespaces.add(namespaceKey);
      }
    } catch (error) {
      console.error(`Failed to load namespace ${namespace} for locale ${targetLocale}:`, error);
      
      // Try fallback locale if not already using it
      if (targetLocale !== this.fallbackLocale) {
        await this.loadNamespace(namespace, this.fallbackLocale);
      }
    }
  }

  // Load translations from database
  private async loadFromDatabase(namespace: string, locale: SupportedLocale): Promise<Record<string, any> | null> {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('translations')
        .eq('locale', locale)
        .eq('namespace', namespace)
        .single();

      if (error || !data) {
        return null;
      }

      return data.translations;
    } catch (error) {
      console.error('Failed to load translations from database:', error);
      return null;
    }
  }

  // Load translations from static files
  private async loadFromStaticFiles(namespace: string, locale: SupportedLocale): Promise<Record<string, any> | null> {
    try {
      const response = await fetch(`/locales/${locale}/${namespace}.json`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load translations from static files:', error);
      return null;
    }
  }

  // Get translation with interpolation and pluralization
  t(key: string, params?: TranslationParams & { count?: number; context?: string }): string {
    const { count, context, ...interpolationParams } = params || {};
    
    // Try current locale first
    let translation = this.getTranslationValue(key, this.currentLocale, count, context);
    
    // Fallback to default locale if not found
    if (!translation && this.currentLocale !== this.fallbackLocale) {
      translation = this.getTranslationValue(key, this.fallbackLocale, count, context);
    }

    // Return key if no translation found
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }

    // Interpolate parameters
    return this.interpolate(translation, interpolationParams);
  }

  // Get translation value with pluralization support
  private getTranslationValue(
    key: string,
    locale: SupportedLocale,
    count?: number,
    context?: string
  ): string | null {
    const [namespace, ...keyParts] = key.split(':');
    const actualKey = keyParts.join(':');
    const namespaceKey = `${locale}:${namespace}`;
    
    const translations = this.translations.get(namespaceKey);
    if (!translations) {
      return null;
    }

    // Navigate nested object using dot notation
    const keys = actualKey.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    // Handle context-specific translations
    if (context && value && typeof value === 'object' && `${context}_context` in value) {
      value = value[`${context}_context`];
    }

    // Handle pluralization
    if (count !== undefined && value && typeof value === 'object') {
      const pluralRule = PLURAL_RULES[locale](count);
      if (pluralRule in value) {
        return value[pluralRule];
      }
      // Fallback to 'other' if specific rule not found
      if ('other' in value) {
        return value.other;
      }
    }

    return typeof value === 'string' ? value : null;
  }

  // Interpolate parameters in translation string
  private interpolate(template: string, params: TranslationParams): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = params[key];
      return value !== undefined ? String(value) : match;
    });
  }

  // Format currency
  formatCurrency(amount: number, options?: FormatOptions['currency']): string {
    const locale = this.getLocaleConfig();
    const formatter = new Intl.NumberFormat(`${locale.code}-${locale.country}`, {
      style: 'currency',
      currency: options?.currency || 'USD',
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    });
    return formatter.format(amount);
  }

  // Format number
  formatNumber(number: number, options?: FormatOptions['number']): string {
    const locale = this.getLocaleConfig();
    const formatter = new Intl.NumberFormat(`${locale.code}-${locale.country}`, {
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      useGrouping: options?.useGrouping,
    });
    return formatter.format(number);
  }

  // Format date
  formatDate(date: Date | string | number, options?: FormatOptions['date']): string {
    const locale = this.getLocaleConfig();
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    const formatter = new Intl.DateTimeFormat(`${locale.code}-${locale.country}`, {
      dateStyle: options?.dateStyle,
      timeStyle: options?.timeStyle,
      weekday: options?.weekday,
      year: options?.year,
      month: options?.month,
      day: options?.day,
    });
    
    return formatter.format(dateObj);
  }

  // Format relative time
  formatRelative(date: Date | string | number, options?: FormatOptions['relative']): string {
    const locale = this.getLocaleConfig();
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();
    
    const formatter = new Intl.RelativeTimeFormat(`${locale.code}-${locale.country}`, {
      numeric: options?.numeric || 'auto',
      style: options?.style || 'long',
    });

    const diffInSeconds = (dateObj.getTime() - now.getTime()) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (Math.abs(diffInDays) >= 1) {
      return formatter.format(Math.round(diffInDays), 'day');
    } else if (Math.abs(diffInHours) >= 1) {
      return formatter.format(Math.round(diffInHours), 'hour');
    } else if (Math.abs(diffInMinutes) >= 1) {
      return formatter.format(Math.round(diffInMinutes), 'minute');
    } else {
      return formatter.format(Math.round(diffInSeconds), 'second');
    }
  }

  // Get all available locales
  getAvailableLocales() {
    return Object.values(SUPPORTED_LOCALES);
  }

  // Detect user's preferred locale
  detectLocale(acceptLanguageHeader?: string): SupportedLocale {
    if (acceptLanguageHeader) {
      const preferredLocales = acceptLanguageHeader
        .split(',')
        .map(lang => {
          const [locale, quality = '1'] = lang.trim().split(';q=');
          return {
            locale: locale.split('-')[0].toLowerCase(),
            quality: parseFloat(quality),
          };
        })
        .sort((a, b) => b.quality - a.quality);

      for (const { locale } of preferredLocales) {
        if (locale in SUPPORTED_LOCALES) {
          return locale as SupportedLocale;
        }
      }
    }

    return DEFAULT_LOCALE;
  }

  // Save translations to database (for admin/editor use)
  async saveTranslations(
    namespace: string,
    locale: SupportedLocale,
    translations: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('translations')
        .upsert({
          locale,
          namespace,
          translations,
          version: Date.now().toString(),
          updated_at: new Date().toISOString(),
        });

      // Update local cache
      const namespaceKey = `${locale}:${namespace}`;
      this.translations.set(namespaceKey, translations);
      this.loadedNamespaces.add(namespaceKey);
    } catch (error) {
      console.error('Failed to save translations:', error);
      throw error;
    }
  }

  // Clear cache and reload translations
  async reloadTranslations(): Promise<void> {
    this.translations.clear();
    this.loadedNamespaces.clear();
    
    // Reload common namespaces
    await this.loadNamespace('common');
    await this.loadNamespace('navigation');
    await this.loadNamespace('forms');
  }
}

// Create singleton instance
export const i18n = I18nManager.getInstance();

// Utility functions for common use cases
export const t = (key: string, params?: TranslationParams & { count?: number; context?: string }): string => {
  return i18n.t(key, params);
};

export const formatCurrency = (amount: number, options?: FormatOptions['currency']): string => {
  return i18n.formatCurrency(amount, options);
};

export const formatNumber = (number: number, options?: FormatOptions['number']): string => {
  return i18n.formatNumber(number, options);
};

export const formatDate = (date: Date | string | number, options?: FormatOptions['date']): string => {
  return i18n.formatDate(date, options);
};

export const formatRelative = (date: Date | string | number, options?: FormatOptions['relative']): string => {
  return i18n.formatRelative(date, options);
};

// React hook for using i18n in components
export function useI18n() {
  return {
    t,
    formatCurrency,
    formatNumber,
    formatDate,
    formatRelative,
    locale: i18n.getLocale(),
    localeConfig: i18n.getLocaleConfig(),
    availableLocales: i18n.getAvailableLocales(),
    setLocale: i18n.setLocale.bind(i18n),
    loadNamespace: i18n.loadNamespace.bind(i18n),
  };
}