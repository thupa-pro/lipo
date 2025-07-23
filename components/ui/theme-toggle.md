# Elite Theme Toggle Component

A beautiful, modern, futuristic dark/light mode toggle component with premium animations and multiple variants.

## Features

✨ **Premium Animations**: Smooth 500ms transitions with easing curves  
🎨 **Multiple Variants**: Icon, Button, Floating, and Minimal styles  
⚡ **Performance Optimized**: Zero layout shift with SSR support  
♿ **Accessible**: ARIA labels, tooltips, and keyboard navigation  
🎯 **TypeScript**: Fully typed with comprehensive prop definitions  
🌈 **Customizable**: Multiple sizes, variants, and styling options  

## Quick Start

```tsx
import { ThemeToggleIcon } from "@/components/ui/theme-toggle";

// Simple icon toggle
<ThemeToggleIcon />

// Button with dropdown
<ThemeToggleButton showLabel />

// Floating action button
<ThemeToggleFloating />

// Minimal version
<ThemeToggleMinimal />
```

## Variants

### Icon Toggle (`ThemeToggleIcon`)
- Compact circular button with animated icons
- Smooth icon transitions with sparkle effects
- Perfect for navigation bars and headers

### Button Toggle (`ThemeToggleButton`)
- Dropdown menu with all theme options (light/dark/system)
- Rich descriptions and animated icons
- Ideal for settings panels and preferences

### Floating Toggle (`ThemeToggleFloating`)
- Fixed position floating action button
- Orbital animation effects on hover
- Great for persistent theme switching

### Minimal Toggle (`ThemeToggleMinimal`)
- Clean, simple design
- Basic icon switching animation
- Perfect for minimalist layouts

## Props

```typescript
interface ThemeToggleProps {
  variant?: "icon" | "button" | "floating" | "minimal";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}
```

## Sizes

- **Small (sm)**: 32px × 32px with 16px icons
- **Medium (md)**: 40px × 40px with 20px icons  
- **Large (lg)**: 48px × 48px with 24px icons

## Advanced Usage

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Custom configuration
<ThemeToggle 
  variant="button"
  size="lg" 
  showLabel={true}
  className="custom-theme-toggle"
/>

// With custom styling
<ThemeToggle 
  variant="icon"
  className="bg-gradient-to-r from-blue-500 to-purple-500"
/>
```

## Integration

The component automatically integrates with your existing theme system:

- Uses `useTheme()` hook from ThemeProvider
- Persists theme selection to localStorage
- Respects system theme preferences
- Smooth transitions without flash

## Accessibility

- Full keyboard navigation support
- Screen reader friendly with ARIA labels
- High contrast mode support
- Focus indicators and tooltips

## Performance

- Zero layout shift during SSR
- Optimized animations using CSS transforms
- Lazy loading of theme state
- Minimal bundle impact

## Styling

Custom CSS classes are available for advanced theming:

```css
.theme-toggle-glow:hover {
  animation: theme-glow 2s infinite;
}

.theme-toggle-sparkle {
  animation: sparkle 1.5s ease-in-out infinite;
}
```

## Examples

See the theme showcase page at `/theme-showcase` for live examples and implementation details.

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

---

*Part of the Loconomy Elite UI Component Library*
