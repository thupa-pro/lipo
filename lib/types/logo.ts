/**
 * Logo System Types
 * Defines the types and enums for the dynamic logo component system
 */

export enum LogoVariant {
  LIGHT = 'light',      // For dark backgrounds
  DARK = 'dark',        // For light backgrounds  
  COLORED = 'colored',  // For marketing/splash screens
  ICON = 'icon',        // For constrained spaces
  OUTLINE = 'outline'   // For watermarking/minimal UI
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum UIContext {
  NAVIGATION = 'navigation',
  FOOTER = 'footer',
  SIDEBAR = 'sidebar',
  AUTH = 'auth',
  MARKETING = 'marketing',
  MOBILE = 'mobile',
  BUTTON = 'button',
  WATERMARK = 'watermark',
  FAVICON = 'favicon'
}

export interface LogoProps {
  variant?: LogoVariant;
  theme?: ThemeMode;
  context?: UIContext;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

export interface LogoVariantConfig {
  filename: string;
  defaultWidth: number;
  defaultHeight: number;
  aspectRatio: number;
  useCases: UIContext[];
  themeRecommendation: ThemeMode[];
}

export const LOGO_VARIANT_CONFIG: Record<LogoVariant, LogoVariantConfig> = {
  [LogoVariant.LIGHT]: {
    filename: 'logo-light.svg',
    defaultWidth: 200,
    defaultHeight: 50,
    aspectRatio: 4,
    useCases: [UIContext.SIDEBAR, UIContext.FOOTER],
    themeRecommendation: [ThemeMode.DARK]
  },
  [LogoVariant.DARK]: {
    filename: 'logo-dark.svg',
    defaultWidth: 200,
    defaultHeight: 50,
    aspectRatio: 4,
    useCases: [UIContext.NAVIGATION, UIContext.AUTH],
    themeRecommendation: [ThemeMode.LIGHT]
  },
  [LogoVariant.COLORED]: {
    filename: 'logo-colored.svg',
    defaultWidth: 200,
    defaultHeight: 50,
    aspectRatio: 4,
    useCases: [UIContext.MARKETING, UIContext.AUTH],
    themeRecommendation: [ThemeMode.LIGHT, ThemeMode.DARK]
  },
  [LogoVariant.ICON]: {
    filename: 'logo-icon.svg',
    defaultWidth: 40,
    defaultHeight: 40,
    aspectRatio: 1,
    useCases: [UIContext.MOBILE, UIContext.BUTTON, UIContext.FAVICON],
    themeRecommendation: [ThemeMode.LIGHT, ThemeMode.DARK]
  },
  [LogoVariant.OUTLINE]: {
    filename: 'logo-outline.svg',
    defaultWidth: 200,
    defaultHeight: 50,
    aspectRatio: 4,
    useCases: [UIContext.WATERMARK],
    themeRecommendation: [ThemeMode.LIGHT, ThemeMode.DARK]
  }
};