"use client";

/**
 * Dynamic Logo Component
 * Automatically selects the appropriate logo variant based on theme, context, and use case
 */

import { useTheme } from '@/components/providers/ThemeProvider';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { 
  LogoVariant, 
  ThemeMode, 
  UIContext, 
  LogoProps 
} from '@/lib/types/logo';
import {
  getLogoVariant,
  getLogoPath,
  getLogoDimensions,
  getLogoAltText,
  shouldUsePriority
} from '@/lib/utils/logo';
import { useEffect, useState } from 'react';

export function Logo({
  variant,
  theme,
  context = UIContext.NAVIGATION,
  className,
  alt,
  width,
  height,
  priority,
  loading = 'lazy',
  ...props
}: LogoProps) {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the effective theme
  const effectiveTheme = theme || resolvedTheme || systemTheme || ThemeMode.LIGHT;
  
  // Get the appropriate logo variant
  const logoVariant = getLogoVariant(effectiveTheme, context, variant);
  
  // Get logo path and dimensions
  const logoPath = getLogoPath(logoVariant);
  const dimensions = getLogoDimensions(logoVariant, width, height);
  
  // Generate alt text
  const altText = getLogoAltText(logoVariant, context, alt);
  
  // Determine priority loading
  const usePriority = priority !== undefined ? priority : shouldUsePriority(context);
  
  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div 
        className={cn("animate-pulse bg-muted rounded", className)}
        style={{ 
          width: dimensions.width, 
          height: dimensions.height 
        }}
      />
    );
  }

  return (
    <Image
      src={logoPath}
      alt={altText}
      width={dimensions.width}
      height={dimensions.height}
      priority={usePriority}
      loading={usePriority ? 'eager' : loading}
      className={cn(
        "object-contain transition-all duration-300",
        // Context-specific styling
        context === UIContext.NAVIGATION && "hover:scale-105",
        context === UIContext.MOBILE && "shrink-0",
        context === UIContext.WATERMARK && "opacity-20",
        className
      )}
      onError={(e) => {
        // Fallback to a simple text representation
        const target = e.target as HTMLImageElement;
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `
            <div class="flex items-center justify-center bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-lg" 
                 style="width: ${dimensions.width}px; height: ${dimensions.height}px; font-size: ${Math.min(dimensions.width, dimensions.height) * 0.4}px">
              ${logoVariant === LogoVariant.ICON ? 'L' : 'Loconomy'}
            </div>
          `;
        }
      }}
      {...props}
    />
  );
}

/**
 * Specialized Logo Components for common use cases
 */

export function NavigationLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.NAVIGATION}
      className={cn("h-8 w-auto", className)}
      priority
      {...props}
    />
  );
}

export function FooterLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.FOOTER}
      className={cn("h-6 w-auto", className)}
      {...props}
    />
  );
}

export function MobileLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.MOBILE}
      variant={LogoVariant.ICON}
      className={cn("h-10 w-10", className)}
      {...props}
    />
  );
}

export function MarketingLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.MARKETING}
      variant={LogoVariant.COLORED}
      className={cn("h-12 w-auto", className)}
      priority
      {...props}
    />
  );
}

export function AuthLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.AUTH}
      className={cn("h-10 w-auto", className)}
      priority
      {...props}
    />
  );
}

export function SidebarLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.SIDEBAR}
      className={cn("h-8 w-auto", className)}
      {...props}
    />
  );
}

export function ButtonLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.BUTTON}
      variant={LogoVariant.ICON}
      className={cn("h-6 w-6", className)}
      {...props}
    />
  );
}

export function WatermarkLogo({ className, ...props }: Omit<LogoProps, 'context'>) {
  return (
    <Logo 
      context={UIContext.WATERMARK}
      variant={LogoVariant.OUTLINE}
      className={cn("h-16 w-auto opacity-10", className)}
      {...props}
    />
  );
}
