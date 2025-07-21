# 🎨 Loconomy Logo System

## Intelligent Logo Variant Selection with Automatic Theme Adaptation

The Loconomy logo system provides intelligent logo variant selection with automatic theme adaptation, optimized performance, and accessibility features.

---

## 🎯 **Logo Variants**

### **Available Variants**

| Variant | Use Case | Background | Features |
|---------|----------|------------|----------|
| **Light** | Dark backgrounds, dark mode | Dark surfaces | White text, high contrast |
| **Dark** | Light backgrounds, light mode | Light surfaces | Dark text, professional |
| **Icon** | Space constrained areas | Any | Compact, scalable symbol only |
| **Colored** | Marketing, splash screens | Any | Vibrant gradients, premium feel |
| **Outline** | Watermarks, print, minimal UI | Any | Subtle, adaptable to context |
| **Auto** | Automatic selection | Any | Theme-aware switching |

---

## 🏗️ **Component Architecture**

### **Core Component**

```tsx
import { Logo, LogoVariant, LogoSize, LogoContext } from '@/components/ui/Logo';

// Basic usage with automatic theme detection
<Logo variant={LogoVariant.AUTO} />

// Specific variant
<Logo variant={LogoVariant.COLORED} size={LogoSize.LG} />

// Context-aware intelligent selection
<Logo context={LogoContext.HEADER} />

// Interactive logo with click handler
<Logo 
  context={LogoContext.HEADER}
  interactive
  onClick={() => router.push('/')}
/>
```

### **Convenience Components**

```tsx
import { 
  HeaderLogo,
  SidebarLogo, 
  FooterLogo,
  HeroLogo,
  MobileNavLogo,
  ButtonLogo,
  WatermarkLogo,
  OnboardingLogo,
  SplashLogo
} from '@/components/ui/Logo';

// Pre-configured for specific contexts
<HeaderLogo />
<SidebarLogo />
<FooterLogo />
<HeroLogo />
<MobileNavLogo />
```

---

## 🎛️ **Props Reference**

### **LogoProps Interface**

```tsx
interface LogoProps {
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
```

---

## 📏 **Size System**

### **Predefined Sizes**

| Size | Height | Use Case | Example |
|------|--------|----------|---------|
| **XS** | 16px | Favicons, buttons | `<ButtonLogo />` |
| **SM** | 24px | Mobile nav, compact areas | `<MobileNavLogo />` |
| **MD** | 32px | Standard header | `<HeaderLogo />` |
| **LG** | 48px | Hero sections | `<HeroLogo />` |
| **XL** | 64px | Splash screens | `<SplashLogo />` |
| **XXL** | 96px | Marketing pages | `<OnboardingLogo />` |

### **Custom Sizing**

```tsx
// Custom dimensions
<Logo width={200} height={50} />

// Responsive sizing with Tailwind
<Logo className="h-8 md:h-12 lg:h-16 w-auto" />
```

---

## 🎯 **Context-Based Selection**

### **Intelligent Context Rules**

The logo system automatically selects the optimal variant based on context:

```tsx
// Context mappings
const CONTEXT_VARIANT_MAP = {
  header: (theme) => theme === 'dark' ? LogoVariant.LIGHT : LogoVariant.DARK,
  sidebar: () => LogoVariant.LIGHT,        // Sidebars typically dark
  footer: (theme) => theme === 'dark' ? LogoVariant.LIGHT : LogoVariant.DARK,
  hero: () => LogoVariant.COLORED,         // Marketing emphasis
  mobile_nav: () => LogoVariant.ICON,      // Space constrained
  button: () => LogoVariant.ICON,          // Compact representation
  watermark: () => LogoVariant.OUTLINE,    // Subtle presence
  onboarding: () => LogoVariant.COLORED,   // Welcoming experience
  splash: () => LogoVariant.COLORED,       // Brand showcase
  print: () => LogoVariant.OUTLINE,        // Print-friendly
  email: () => LogoVariant.DARK            // Email compatibility
};
```

---

## 🌙 **Theme Integration**

### **Automatic Theme Detection**

```tsx
// Automatically adapts to theme
<Logo variant={LogoVariant.AUTO} />

// Force specific theme
<Logo theme="dark" />
<Logo theme="light" />

// With next-themes integration
import { useTheme } from 'next-themes';
const { theme } = useTheme();
```

### **Theme-Aware Examples**

```tsx
// Header that adapts to light/dark mode
<HeaderLogo />  // Uses theme detection

// Sidebar (always uses light variant for dark sidebar)
<SidebarLogo />

// Footer (adapts to theme)
<FooterLogo />
```

---

## 🚀 **Performance Optimization**

### **Asset Preloading**

```tsx
// In app/layout.tsx
<head>
  <link
    rel="preload"
    href="/assets/branding/logo-dark.svg"
    as="image"
    type="image/svg+xml"
  />
  <link
    rel="preload"
    href="/assets/branding/logo-light.svg"
    as="image"
    type="image/svg+xml"
  />
</head>
```

### **Priority Loading**

```tsx
// Critical logos get priority
<HeaderLogo priority />

// Non-critical logos use lazy loading
<FooterLogo />  // Loads when needed
```

### **Next.js Image Optimization**

```tsx
// Automatically uses Next.js Image for performance
<Logo />  // Uses Next.js Image component

// Fallback for SSR or special cases
<Logo useRasterFallback />  // Uses regular img tag
```

---

## ♿ **Accessibility Features**

### **Screen Reader Support**

```tsx
// Semantic alt text
<Logo alt="Loconomy - Premium Local Services Platform" />

// Interactive logos
<Logo 
  interactive
  onClick={handleClick}
  role="button"
  tabIndex={0}
/>
```

### **Keyboard Navigation**

```tsx
// Supports Enter and Space key activation
<Logo 
  interactive
  onClick={navigateHome}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigateHome();
    }
  }}
/>
```

---

## 📱 **Responsive Design**

### **Mobile-First Approach**

```tsx
// Desktop header
<div className="hidden lg:block">
  <HeaderLogo />
</div>

// Mobile navigation
<div className="lg:hidden">
  <MobileNavLogo />
</div>
```

### **Responsive Sizing**

```tsx
// Scales with screen size
<Logo 
  className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto"
  context={LogoContext.HEADER}
/>
```

---

## 🎨 **Implementation Examples**

### **1. Navigation Header**

```tsx
// components/navigation/Header.tsx
import { HeaderLogo } from '@/components/ui/Logo';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <HeaderLogo 
          interactive
          onClick={() => router.push('/')}
          className="hover:opacity-80 transition-opacity"
        />
        {/* Navigation items */}
      </div>
    </header>
  );
}
```

### **2. Hero Section**

```tsx
// components/marketing/Hero.tsx
import { HeroLogo } from '@/components/ui/Logo';

export function Hero() {
  return (
    <section className="py-20 text-center">
      <HeroLogo className="mx-auto mb-8" />
      <h1 className="text-4xl font-bold">
        Welcome to Loconomy
      </h1>
    </section>
  );
}
```

### **3. Mobile Navigation**

```tsx
// components/navigation/MobileNav.tsx
import { MobileNavLogo } from '@/components/ui/Logo';

export function MobileNav() {
  return (
    <nav className="lg:hidden">
      <div className="flex items-center justify-between p-4">
        <MobileNavLogo interactive onClick={() => router.push('/')} />
        <MenuButton />
      </div>
    </nav>
  );
}
```

### **4. Footer**

```tsx
// components/layout/Footer.tsx
import { FooterLogo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-8">
        <FooterLogo className="mb-4" />
        <p className="text-sm text-muted-foreground">
          © 2024 Loconomy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

### **5. Loading/Splash Screen**

```tsx
// components/ui/LoadingScreen.tsx
import { SplashLogo } from '@/components/ui/Logo';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        <SplashLogo className="animate-pulse" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

### **6. Print Styles**

```tsx
// components/print/PrintHeader.tsx
import { WatermarkLogo } from '@/components/ui/Logo';

export function PrintHeader() {
  return (
    <div className="print:block hidden">
      <WatermarkLogo className="opacity-20" />
    </div>
  );
}
```

---

## 🔧 **Utility Functions**

### **Programmatic Logo Access**

```tsx
import { useLogoVariant, getLogoUrl } from '@/components/ui/Logo';

// Hook for getting logo variant
function MyComponent() {
  const variant = useLogoVariant(LogoContext.HEADER);
  return <img src={getLogoUrl(variant)} alt="Loconomy" />;
}

// Direct URL access
const logoUrl = getLogoUrl(LogoVariant.COLORED);
const darkModeUrl = getLogoUrl(LogoVariant.AUTO, 'dark');
```

---

## 📁 **Asset Organization**

### **File Structure**

```
public/assets/branding/
├── logo-light.svg      # For dark backgrounds
├── logo-dark.svg       # For light backgrounds  
├── logo-icon.svg       # Space constrained
├── logo-colored.svg    # Marketing/splash
└── logo-outline.svg    # Watermarks/print
```

### **Asset Requirements**

- **Format**: SVG for scalability and performance
- **Optimization**: Compressed and optimized SVGs
- **Fallbacks**: PNG versions for older browsers
- **Dimensions**: Consistent aspect ratios across variants

---

## 🎯 **Best Practices**

### **DO ✅**

- Use context-aware components (`<HeaderLogo />` vs manual setup)
- Preload critical logo assets in layout
- Provide meaningful alt text for accessibility
- Use `interactive` prop for clickable logos
- Leverage automatic theme detection with `LogoVariant.AUTO`

### **DON'T ❌**

- Don't hardcode logo variants in theme-aware contexts
- Don't skip alt text for screen readers  
- Don't use raster formats when SVG is available
- Don't forget to handle keyboard interactions for interactive logos
- Don't use oversized logos in constrained spaces

---

## 🔄 **Migration Guide**

### **From Hardcoded Logos**

```tsx
// Before ❌
<img src="/logo.png" alt="Logo" className="h-8" />

// After ✅
<HeaderLogo />
```

### **From Manual Theme Handling**

```tsx
// Before ❌
<img 
  src={theme === 'dark' ? '/logo-light.png' : '/logo-dark.png'} 
  alt="Logo" 
/>

// After ✅
<Logo variant={LogoVariant.AUTO} />
```

---

## 🚀 **Performance Metrics**

- **Bundle Size**: Minimal impact with tree-shaking
- **Runtime**: O(1) variant selection with memoization
- **Loading**: Optimized with Next.js Image and preloading
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Proper semantic markup and meta tags

---

The Loconomy logo system provides a complete, production-ready solution for intelligent logo management with theme awareness, performance optimization, and accessibility built-in. 🎨✨