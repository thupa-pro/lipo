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
    filename: 'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F08ea77eef6ee46b4923532989e12242c?format=webp&width=800',
    defaultWidth: 200,
    defaultHeight: 200,
    aspectRatio: 1,
    useCases: [UIContext.SIDEBAR, UIContext.FOOTER, UIContext.NAVIGATION],
    themeRecommendation: [ThemeMode.DARK]
  },
  [LogoVariant.DARK]: {
    filename: 'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F479f9e85785e4a5f87016e60b181802e?format=webp&width=800',
    defaultWidth: 200,
    defaultHeight: 200,
    aspectRatio: 1,
    useCases: [UIContext.NAVIGATION, UIContext.AUTH],
    themeRecommendation: [ThemeMode.LIGHT]
  },
  [LogoVariant.COLORED]: {
    filename: 'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F08ea77eef6ee46b4923532989e12242c?format=webp&width=800',
    defaultWidth: 200,
    defaultHeight: 200,
    aspectRatio: 1,
    useCases: [UIContext.MARKETING, UIContext.AUTH],
    themeRecommendation: [ThemeMode.LIGHT, ThemeMode.DARK]
  },
  [LogoVariant.ICON]: {
    filename: 'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F08ea77eef6ee46b4923532989e12242c?format=webp&width=800',
    defaultWidth: 40,
    defaultHeight: 40,
    aspectRatio: 1,
    useCases: [UIContext.MOBILE, UIContext.BUTTON, UIContext.FAVICON],
    themeRecommendation: [ThemeMode.LIGHT, ThemeMode.DARK]
  },
  [LogoVariant.OUTLINE]: {
    filename: 'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F479f9e85785e4a5f87016e60b181802e?format=webp&width=800',
    defaultWidth: 200,
    defaultHeight: 200,
    aspectRatio: 1,
    useCases: [UIContext.WATERMARK],
    themeRecommendation: [ThemeMode.LIGHT, ThemeMode.DARK]
  }
};
