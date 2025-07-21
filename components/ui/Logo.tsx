"use client";

// Loconomy Logo System
// Intelligent logo variant selection with automatic theme adaptation

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// Logo variant definitions
export enum LogoVariant {
  LIGHT = 'light',       // Dark backgrounds, dark mode
  DARK = 'dark',         // Light backgrounds, light mode
  ICON = 'icon',         // Space constrained areas
  COLORED = 'colored',   // Marketing/splash screens
  OUTLINE = 'outline',   // Watermarks, minimal UI
  AUTO = 'auto'          // Automatic theme-based selection
}

// Logo size presets
export enum LogoSize {
  XS = 'xs',     // 16px height - favicons, buttons
  SM = 'sm',     // 24px height - mobile nav, compact areas
  MD = 'md',     // 32px height - standard header
  LG = 'lg',     // 48px height - hero sections
  XL = 'xl',     // 64px height - splash screens
  XXL = 'xxl'    // 96px height - marketing pages
}

// Logo usage contexts for intelligent selection
export enum LogoContext {
  HEADER = 'header',
  SIDEBAR = 'sidebar',
  FOOTER = 'footer',
  HERO = 'hero',
  MOBILE_NAV = 'mobile-nav',
  BUTTON = 'button',
  FAVICON = 'favicon',
  WATERMARK = 'watermark',
  ONBOARDING = 'onboarding',
  SPLASH = 'splash',
  PRINT = 'print',
  EMAIL = 'email'
}

interface LogoConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

// Logo variant configurations
const LOGO_CONFIGS: Record<LogoVariant, LogoConfig> = {
  [LogoVariant.LIGHT]: {
    src: '/assets/branding/logo-light.svg',
    alt: 'Loconomy - Premium Local Services Platform (Light)',
    width: 180,
    height: 32,
    priority: true
  },
  [LogoVariant.DARK]: {
    src: '/assets/branding/logo-dark.svg', 
    alt: 'Loconomy - Premium Local Services Platform (Dark)',
    width: 180,
    height: 32,
    priority: true
  },
  [LogoVariant.ICON]: {
    src: '/assets/branding/logo-icon.svg',
    alt: 'Loconomy Icon',
    width: 32,
    height: 32
  },
  [LogoVariant.COLORED]: {
    src: '/assets/branding/logo-colored.svg',
    alt: 'Loconomy - Premium Local Services Platform (Colored)',
    width: 220,
    height: 40
  },
  [LogoVariant.OUTLINE]: {
    src: '/assets/branding/logo-outline.svg',
    alt: 'Loconomy - Premium Local Services Platform (Outline)',
    width: 180,
    height: 32
  },
  [LogoVariant.AUTO]: {
    src: '', // Will be determined dynamically
    alt: 'Loconomy - Premium Local Services Platform',
    width: 180,
    height: 32,
    priority: true
  }
};

// Size configurations
const SIZE_CONFIGS: Record<LogoSize, { width: number; height: number; className: string }> = {
  [LogoSize.XS]: {
    width: 90,
    height: 16,
    className: 'h-4 w-auto'
  },
  [LogoSize.SM]: {
    width: 135,
    height: 24,
    className: 'h-6 w-auto'
  },
  [LogoSize.MD]: {
    width: 180,
    height: 32,
    className: 'h-8 w-auto'
  },
  [LogoSize.LG]: {
    width: 270,
    height: 48,
    className: 'h-12 w-auto'
  },
  [LogoSize.XL]: {
    width: 360,
    height: 64,
    className: 'h-16 w-auto'
  },
  [LogoSize.XXL]: {
    width: 540,
    height: 96,
    className: 'h-24 w-auto'
  }
};

// Context-based variant selection rules
const CONTEXT_VARIANT_MAP: Record<LogoContext, (theme?: string) => LogoVariant> = {
  [LogoContext.HEADER]: (theme) => theme === 'dark' ? LogoVariant.LIGHT : LogoVariant.DARK,
  [LogoContext.SIDEBAR]: () => LogoVariant.LIGHT, // Sidebars typically dark
  [LogoContext.FOOTER]: (theme) => theme === 'dark' ? LogoVariant.LIGHT : LogoVariant.DARK,
  [LogoContext.HERO]: () => LogoVariant.COLORED,
  [LogoContext.MOBILE_NAV]: () => LogoVariant.ICON,
  [LogoContext.BUTTON]: () => LogoVariant.ICON,
  [LogoContext.FAVICON]: () => LogoVariant.ICON,
  [LogoContext.WATERMARK]: () => LogoVariant.OUTLINE,
  [LogoContext.ONBOARDING]: () => LogoVariant.COLORED,
  [LogoContext.SPLASH]: () => LogoVariant.COLORED,
  [LogoContext.PRINT]: () => LogoVariant.OUTLINE,
  [LogoContext.EMAIL]: () => LogoVariant.DARK
};

// Context-based size selection
const CONTEXT_SIZE_MAP: Record<LogoContext, LogoSize> = {
  [LogoContext.HEADER]: LogoSize.MD,
  [LogoContext.SIDEBAR]: LogoSize.SM,
  [LogoContext.FOOTER]: LogoSize.SM,
  [LogoContext.HERO]: LogoSize.XL,
  [LogoContext.MOBILE_NAV]: LogoSize.XS,
  [LogoContext.BUTTON]: LogoSize.XS,
  [LogoContext.FAVICON]: LogoSize.XS,
  [LogoContext.WATERMARK]: LogoSize.LG,
  [LogoContext.ONBOARDING]: LogoSize.XXL,
  [LogoContext.SPLASH]: LogoSize.XXL,
  [LogoContext.PRINT]: LogoSize.LG,
  [LogoContext.EMAIL]: LogoSize.MD
};

export interface LogoProps {
  /** Logo variant to display */
  variant?: LogoVariant;
  /** Logo size preset */
  size?: LogoSize;
  /** Usage context for intelligent selection */
  context?: LogoContext;
  /** Force specific theme (light/dark) */
  theme?: 'light' | 'dark';
  /** Custom alt text */
  alt?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether this logo should be prioritized for loading */
  priority?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether logo should be interactive */
  interactive?: boolean;
  /** Custom width override */
  width?: number;
  /** Custom height override */
  height?: number;
  /** Whether to use raster fallback */
  useRasterFallback?: boolean;
}

export function Logo({
  variant = LogoVariant.AUTO,
  size,
  context,
  theme: forcedTheme,
  alt,
  className,
  priority,
  onClick,
  interactive = false,
  width: customWidth,
  height: customHeight,
  useRasterFallback = false
}: LogoProps) {
  const { theme: systemTheme, resolvedTheme } = useTheme();
  
  // Determine effective theme
  const effectiveTheme = forcedTheme || resolvedTheme || systemTheme || 'light';
  
  // Intelligent variant selection
  const selectedVariant = useMemo(() => {
    if (variant !== LogoVariant.AUTO) {
      return variant;
    }
    
    if (context) {
      return CONTEXT_VARIANT_MAP[context](effectiveTheme);
    }
    
    // Default auto selection based on theme
    return effectiveTheme === 'dark' ? LogoVariant.LIGHT : LogoVariant.DARK;
  }, [variant, context, effectiveTheme]);
  
  // Intelligent size selection
  const selectedSize = useMemo(() => {
    if (size) {
      return size;
    }
    
    if (context) {
      return CONTEXT_SIZE_MAP[context];
    }
    
    return LogoSize.MD; // Default size
  }, [size, context]);
  
  // Get logo configuration
  const logoConfig = LOGO_CONFIGS[selectedVariant];
  const sizeConfig = SIZE_CONFIGS[selectedSize];
  
  // Calculate final dimensions
  const finalWidth = customWidth || sizeConfig.width;
  const finalHeight = customHeight || sizeConfig.height;
  
  // Generate alt text
  const finalAlt = alt || logoConfig.alt;
  
  // Determine if we should use Next.js Image or regular img
  const shouldUseNextImage = !useRasterFallback && typeof window !== 'undefined';
  
  // Build className
  const logoClassName = cn(
    'select-none',
    sizeConfig.className,
    interactive && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  );
  
  // Handle click
  const handleClick = () => {
    if (onClick && interactive) {
      onClick();
    }
  };
  
  // Render logo based on environment and preferences
  if (shouldUseNextImage) {
    return (
      <Image
        src={logoConfig.src}
        alt={finalAlt}
        width={finalWidth}
        height={finalHeight}
        priority={priority || logoConfig.priority}
        className={logoClassName}
        onClick={handleClick}
        role={interactive ? 'button' : 'img'}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={interactive ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        } : undefined}
      />
    );
  }
  
  // Fallback to regular img tag (for SSR or raster fallback)
  return (
    <img
      src={logoConfig.src}
      alt={finalAlt}
      width={finalWidth}
      height={finalHeight}
      className={logoClassName}
      loading="lazy"
      onClick={handleClick}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    />
  );
}

// Convenience components for common use cases
export function HeaderLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.HEADER} />;
}

export function SidebarLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.SIDEBAR} />;
}

export function FooterLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.FOOTER} />;
}

export function HeroLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.HERO} />;
}

export function MobileNavLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.MOBILE_NAV} />;
}

export function ButtonLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.BUTTON} />;
}

export function WatermarkLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.WATERMARK} />;
}

export function OnboardingLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.ONBOARDING} />;
}

export function SplashLogo(props: Omit<LogoProps, 'context'>) {
  return <Logo {...props} context={LogoContext.SPLASH} />;
}

// Hook for getting logo variant programmatically
export function useLogoVariant(context?: LogoContext, forcedTheme?: string) {
  const { resolvedTheme } = useTheme();
  const effectiveTheme = forcedTheme || resolvedTheme || 'light';
  
  return useMemo(() => {
    if (context) {
      return CONTEXT_VARIANT_MAP[context](effectiveTheme);
    }
    return effectiveTheme === 'dark' ? LogoVariant.LIGHT : LogoVariant.DARK;
  }, [context, effectiveTheme]);
}

// Utility function to get logo URL
export function getLogoUrl(variant: LogoVariant, theme?: string): string {
  if (variant === LogoVariant.AUTO) {
    const autoVariant = theme === 'dark' ? LogoVariant.LIGHT : LogoVariant.DARK;
    return LOGO_CONFIGS[autoVariant].src;
  }
  return LOGO_CONFIGS[variant].src;
}

// Export types and enums for external use
export type { LogoProps };
export { LogoVariant, LogoSize, LogoContext };

// Default export
export default Logo;