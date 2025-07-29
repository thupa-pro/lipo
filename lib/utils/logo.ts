/**
 * Logo Utility Functions
 * Handles dynamic logo variant selection based on context, theme, and use case
 */

import { 
  LogoVariant, 
  ThemeMode, 
  UIContext, 
  LOGO_VARIANT_CONFIG,
  LogoProps 
} from '@/lib/types/logo';

/**
 * Determines the optimal logo variant based on theme and context
 */
export function getLogoVariant(
  theme: ThemeMode | string | undefined,
  context?: UIContext,
  explicitVariant?: LogoVariant
): LogoVariant {
  // If explicit variant is provided, use it
  if (explicitVariant) {
    return explicitVariant;
  }

  // Context-based variant selection
  switch (context) {
    case UIContext.MARKETING:
      return LogoVariant.COLORED;
    
    case UIContext.MOBILE:
    case UIContext.BUTTON:
    case UIContext.FAVICON:
      return LogoVariant.ICON;
    
    case UIContext.WATERMARK:
      return LogoVariant.OUTLINE;
    
    case UIContext.SIDEBAR:
    case UIContext.FOOTER:
      // For sidebar/footer, use light logo on dark backgrounds
      return theme === ThemeMode.DARK || theme === 'dark' 
        ? LogoVariant.LIGHT 
        : LogoVariant.DARK;
    
    case UIContext.NAVIGATION:
    case UIContext.AUTH:
    default:
      // For navigation/auth, use appropriate contrast
      return theme === ThemeMode.DARK || theme === 'dark'
        ? LogoVariant.LIGHT
        : LogoVariant.DARK;
  }
}

/**
 * Gets the full path to a logo asset
 */
export function getLogoPath(variant: LogoVariant): string {
  const config = LOGO_VARIANT_CONFIG[variant];
  // If filename is already a full URL, return as-is
  if (config.filename.startsWith('http')) {
    return config.filename;
  }
  // Otherwise, treat as local asset
  return `/branded/${config.filename}`;
}

/**
 * Gets default dimensions for a logo variant
 */
export function getLogoDimensions(
  variant: LogoVariant,
  customWidth?: number,
  customHeight?: number
): { width: number; height: number } {
  const config = LOGO_VARIANT_CONFIG[variant];
  
  if (customWidth && customHeight) {
    return { width: customWidth, height: customHeight };
  }
  
  if (customWidth) {
    return { 
      width: customWidth, 
      height: Math.round(customWidth / config.aspectRatio) 
    };
  }
  
  if (customHeight) {
    return { 
      width: Math.round(customHeight * config.aspectRatio), 
      height: customHeight 
    };
  }
  
  return { 
    width: config.defaultWidth, 
    height: config.defaultHeight 
  };
}

/**
 * Validates if a variant is appropriate for a given context
 */
export function isVariantAppropriate(
  variant: LogoVariant,
  context: UIContext
): boolean {
  const config = LOGO_VARIANT_CONFIG[variant];
  return config.useCases.includes(context);
}

/**
 * Gets recommended variants for a specific context
 */
export function getRecommendedVariants(context: UIContext): LogoVariant[] {
  return Object.entries(LOGO_VARIANT_CONFIG)
    .filter(([_, config]) => config.useCases.includes(context))
    .map(([variant]) => variant as LogoVariant);
}

/**
 * Generates appropriate alt text based on variant and context
 */
export function getLogoAltText(
  variant: LogoVariant,
  context?: UIContext,
  customAlt?: string
): string {
  if (customAlt) {
    return customAlt;
  }

  const baseText = "Loconomy";
  
  switch (variant) {
    case LogoVariant.ICON:
      return `${baseText} Logo Icon`;
    case LogoVariant.COLORED:
      return `${baseText} - Your Local Economy Platform`;
    default:
      return `${baseText} Logo`;
  }
}

/**
 * Determines if image should be loaded with priority
 */
export function shouldUsePriority(context?: UIContext): boolean {
  // Priority loading for above-the-fold contexts
  return context === UIContext.NAVIGATION || 
         context === UIContext.MARKETING ||
         context === UIContext.AUTH;
}
