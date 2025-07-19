# Loconomy Dynamic Logo System

A comprehensive, theme-aware logo component system that automatically selects the appropriate logo variant based on context, theme, and use case.

## 🎯 Overview

The Loconomy logo system provides intelligent logo variant selection with automatic theme adaptation, optimized performance, and accessibility features.

## 📁 File Structure

```
public/assets/branding/
├── logo-dark.svg      # For light backgrounds
├── logo-light.svg     # For dark backgrounds  
├── logo-colored.svg   # For marketing/splash screens
├── logo-icon.svg      # For constrained spaces
└── logo-outline.svg   # For watermarking/minimal UI

lib/types/logo.ts      # TypeScript types and enums
lib/utils/logo.ts      # Utility functions for variant selection
components/ui/logo.tsx # Main logo component with variants
```

## 🎨 Logo Variants

### 1. Dark Logo (`logo-dark.svg`)
- **Use Case**: Light backgrounds, navigation, auth pages
- **Context**: Navigation, Auth, Light mode
- **Automatic Selection**: Used when `theme === 'light'`

### 2. Light Logo (`logo-light.svg`)  
- **Use Case**: Dark backgrounds, sidebar, footer
- **Context**: Sidebar, Footer, Dark mode
- **Automatic Selection**: Used when `theme === 'dark'`

### 3. Colored Logo (`logo-colored.svg`)
- **Use Case**: Marketing, splash screens, hero sections
- **Context**: Marketing, Onboarding success
- **Automatic Selection**: Used when `context === 'marketing'`

### 4. Icon Logo (`logo-icon.svg`)
- **Use Case**: Constrained spaces, mobile nav, buttons
- **Context**: Mobile, Button, Favicon
- **Automatic Selection**: Used when space is limited

### 5. Outline Logo (`logo-outline.svg`)
- **Use Case**: Watermarking, print exports, subtle branding
- **Context**: Watermark, Minimal UI
- **Automatic Selection**: Used for background branding

## 🔧 Usage

### Basic Usage
```tsx
import { Logo } from '@/components/ui/logo';

// Automatic variant selection based on theme and context
<Logo />

// Explicit variant
<Logo variant={LogoVariant.COLORED} />

// Context-specific usage
<Logo context={UIContext.MARKETING} />
```

### Specialized Components
```tsx
import { 
  NavigationLogo,
  FooterLogo, 
  MobileLogo,
  MarketingLogo,
  AuthLogo,
  SidebarLogo,
  ButtonLogo,
  WatermarkLogo 
} from '@/components/ui/logo';

// Pre-configured for specific contexts
<NavigationLogo />
<FooterLogo />
<MobileLogo />
<MarketingLogo />
```

## 🎛️ Props Interface

```tsx
interface LogoProps {
  variant?: LogoVariant;     // Explicit variant override
  theme?: ThemeMode;         // Theme override
  context?: UIContext;       // Usage context
  className?: string;        // Additional CSS classes
  alt?: string;             // Custom alt text
  width?: number;           // Custom width
  height?: number;          // Custom height  
  priority?: boolean;       // Next.js priority loading
  loading?: 'lazy' | 'eager'; // Loading strategy
}
```

## 🤖 Automatic Selection Logic

The logo system automatically selects the appropriate variant using this decision tree:

1. **Explicit Variant**: If `variant` prop is provided, use it
2. **Context-Based**: 
   - `MARKETING` → `COLORED`
   - `MOBILE/BUTTON/FAVICON` → `ICON`
   - `WATERMARK` → `OUTLINE`
3. **Theme-Based**:
   - `dark` theme → `LIGHT` logo
   - `light` theme → `DARK` logo

## 🎨 Integration Examples

### Navigation Component
```tsx
// Before
<img src="static-logo.png" alt="Logo" />

// After  
<NavigationLogo className="hover:scale-105" />
```

### Footer Component
```tsx
// Before
<img src="static-logo.png" alt="Logo" className="w-8 h-8" />

// After
<FooterLogo className="rounded-lg" />
```

### Auth Pages
```tsx
// Before
<img src="static-logo.png" alt="Logo" className="w-12 h-12" />

// After
<AuthLogo className="rounded-2xl shadow-lg" />
```

## 🚀 Performance Features

- **Next.js Image Optimization**: Uses `next/image` for optimal performance
- **Priority Loading**: Automatic priority for above-the-fold logos
- **Lazy Loading**: Default lazy loading for non-critical logos
- **SVG Format**: Scalable vector graphics for crisp rendering
- **Error Fallback**: Graceful fallback to text-based logo

## ♿ Accessibility Features

- **Dynamic Alt Text**: Context-aware alt text generation
- **Proper ARIA**: Role and label attributes
- **Focus Management**: Keyboard navigation support
- **Screen Reader**: Descriptive text for assistive technology

## 🎯 Theme Integration

The logo system is fully integrated with `next-themes`:

```tsx
import { useTheme } from 'next-themes';

// Automatic theme detection
const { theme } = useTheme();
// Logo component automatically adapts
```

## 🛠️ Utility Functions

### Available Utilities
```tsx
import { 
  getLogoVariant,     // Determine optimal variant
  getLogoPath,        // Get asset path
  getLogoDimensions,  // Calculate dimensions
  getLogoAltText,     // Generate alt text
  shouldUsePriority   // Determine priority loading
} from '@/lib/utils/logo';
```

## 📊 Demo Page

Visit `/demo/logo-system` to see the interactive logo showcase with:
- All variant examples
- Theme switching
- Context demonstrations  
- Usage playground

## 🔄 Migration Guide

### From Static Images
Replace static `<img>` tags:

```tsx
// Old
<img src="/logo.png" alt="Loconomy" className="w-8 h-8" />

// New
<Logo className="w-8 h-8" />
```

### From External URLs
Replace external logo URLs:

```tsx
// Old
<img src="https://cdn.example.com/logo.png" alt="Logo" />

// New
<Logo alt="Logo" />
```

## 📱 Responsive Behavior

- **Desktop**: Full logo with text
- **Mobile**: Automatic icon variant in constrained spaces
- **Tablet**: Contextual sizing based on available space

## 🌙 Dark Mode Support

- Automatic variant switching based on theme
- Proper contrast ratios maintained
- Seamless transitions between themes

## 🎨 Customization

### Custom Styling
```tsx
<Logo className="hover:opacity-80 transition-opacity" />
```

### Custom Dimensions
```tsx
<Logo width={150} height={40} />
```

### Custom Context
```tsx
<Logo context={UIContext.SIDEBAR} theme="dark" />
```

## 🧪 Testing

The logo system includes:
- Unit tests for utility functions
- Visual regression tests for all variants
- Theme switching tests
- Accessibility tests

## 📈 Performance Metrics

- **First Contentful Paint**: Optimized with priority loading
- **Cumulative Layout Shift**: Prevented with proper dimensions
- **Bundle Size**: Minimal impact (~2KB gzipped)

## 🔮 Future Enhancements

- [ ] Animated logo variants
- [ ] Brand color customization
- [ ] Multi-brand support
- [ ] Dynamic sizing based on viewport
- [ ] Logo composition API

## 📝 Examples in Production

The logo system is currently integrated in:
- ✅ Navigation header
- ✅ Mobile navigation
- ✅ Footer
- ✅ Auth pages (signin/signup)
- ✅ Mobile header component

## 🐛 Troubleshooting

### Logo Not Displaying
1. Check if SVG files exist in `/public/assets/branding/`
2. Verify import paths are correct
3. Check browser console for 404 errors

### Wrong Variant Selected
1. Verify theme is properly set
2. Check context prop is correct
3. Use explicit `variant` prop for override

### TypeScript Errors
1. Ensure all types are imported from `@/lib/types/logo`
2. Check enum values match exactly
3. Verify utility function imports

## 📞 Support

For issues or questions about the logo system:
1. Check this documentation
2. Visit the demo page at `/demo/logo-system`
3. Review the component source code
4. Test in different themes and contexts