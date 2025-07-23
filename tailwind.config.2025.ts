import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        "sm": "640px",
        "md": "768px", 
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      // OKLCH-based Color System for 2025
      colors: {
        // Core System Colors (CSS Variables)
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        
        // Semantic Colors
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
          subtle: "oklch(var(--primary-subtle))",
          emphasis: "oklch(var(--primary-emphasis))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
          subtle: "oklch(var(--secondary-subtle))",
          emphasis: "oklch(var(--secondary-emphasis))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
          subtle: "oklch(var(--accent-subtle))",
          emphasis: "oklch(var(--accent-emphasis))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
          subtle: "oklch(var(--muted-subtle))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
          subtle: "oklch(var(--destructive-subtle))",
        },
        success: {
          DEFAULT: "oklch(var(--success))",
          foreground: "oklch(var(--success-foreground))",
          subtle: "oklch(var(--success-subtle))",
        },
        warning: {
          DEFAULT: "oklch(var(--warning))",
          foreground: "oklch(var(--warning-foreground))",
          subtle: "oklch(var(--warning-subtle))",
        },
        
        // Context-Aware Colors
        surface: {
          DEFAULT: "oklch(var(--surface))",
          elevated: "oklch(var(--surface-elevated))",
          overlay: "oklch(var(--surface-overlay))",
          glass: "oklch(var(--surface-glass))",
        },
        
        // AI-Native Context Colors
        ai: {
          DEFAULT: "oklch(var(--ai))",
          foreground: "oklch(var(--ai-foreground))",
          thinking: "oklch(var(--ai-thinking))",
          success: "oklch(var(--ai-success))",
        },
        
        // Brand Context Colors
        local: {
          DEFAULT: "oklch(var(--local))",
          foreground: "oklch(var(--local-foreground))",
          trust: "oklch(var(--local-trust))",
        },
        premium: {
          DEFAULT: "oklch(var(--premium))",
          foreground: "oklch(var(--premium-foreground))",
          luxury: "oklch(var(--premium-luxury))",
        },
        
        // Adaptive Neutral Scale (Perfect Contrast)
        neutral: {
          50: "oklch(98% 0 0)",
          100: "oklch(96% 0 0)",
          200: "oklch(90% 0 0)",
          300: "oklch(83% 0 0)",
          400: "oklch(64% 0 0)",
          500: "oklch(53% 0 0)",
          600: "oklch(45% 0 0)",
          700: "oklch(39% 0 0)",
          800: "oklch(28% 0 0)",
          900: "oklch(20% 0 0)",
          950: "oklch(15% 0 0)",
        },
        
        // Chart Colors (Accessible & Distinctive)
        chart: {
          "1": "oklch(var(--chart-1))",
          "2": "oklch(var(--chart-2))", 
          "3": "oklch(var(--chart-3))",
          "4": "oklch(var(--chart-4))",
          "5": "oklch(var(--chart-5))",
        },
      },
      
      // Fluid Typography Scale
      fontSize: {
        "2xs": ["clamp(0.625rem, 0.6rem + 0.125vw, 0.75rem)", { 
          lineHeight: "1.2",
          letterSpacing: "0.025em",
        }],
        xs: ["clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)", { 
          lineHeight: "1.3",
          letterSpacing: "0.02em",
        }],
        sm: ["clamp(0.875rem, 0.8rem + 0.375vw, 1rem)", { 
          lineHeight: "1.4",
          letterSpacing: "0.015em",
        }],
        base: ["clamp(1rem, 0.9rem + 0.5vw, 1.125rem)", { 
          lineHeight: "1.5",
          letterSpacing: "0.01em",
        }],
        lg: ["clamp(1.125rem, 1rem + 0.625vw, 1.25rem)", { 
          lineHeight: "1.4",
          letterSpacing: "0.005em",
        }],
        xl: ["clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)", { 
          lineHeight: "1.3",
          letterSpacing: "0",
        }],
        "2xl": ["clamp(1.5rem, 1.3rem + 1vw, 1.875rem)", { 
          lineHeight: "1.2",
          letterSpacing: "-0.005em",
        }],
        "3xl": ["clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)", { 
          lineHeight: "1.1",
          letterSpacing: "-0.01em",
        }],
        "4xl": ["clamp(2.25rem, 1.9rem + 1.75vw, 3rem)", { 
          lineHeight: "1.05",
          letterSpacing: "-0.015em",
        }],
        "5xl": ["clamp(3rem, 2.5rem + 2.5vw, 3.75rem)", { 
          lineHeight: "1",
          letterSpacing: "-0.02em",
        }],
        "6xl": ["clamp(3.75rem, 3rem + 3.75vw, 4.5rem)", { 
          lineHeight: "0.95",
          letterSpacing: "-0.025em",
        }],
      },
      
      // Modern Font Stacks
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "Inter Variable",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI Variable",
          "sans-serif"
        ],
        mono: [
          "var(--font-geist-mono)",
          "JetBrains Mono Variable", 
          "SF Mono",
          "Consolas",
          "Liberation Mono",
          "monospace"
        ],
        display: [
          "var(--font-cal-sans)",
          "Cal Sans",
          "Inter Variable",
          "system-ui",
          "sans-serif"
        ],
      },
      
      // Systematic Spacing Scale
      spacing: {
        xs: "0.25rem",    // 4px
        sm: "0.5rem",     // 8px
        md: "0.75rem",    // 12px
        lg: "1rem",       // 16px
        xl: "1.5rem",     // 24px
        "2xl": "2rem",    // 32px
        "3xl": "3rem",    // 48px
        "4xl": "4rem",    // 64px
        "5xl": "5rem",    // 80px
        "6xl": "6rem",    // 96px
        
        // Contextual Spacing
        gutter: "clamp(1rem, 4vw, 2rem)",
        section: "clamp(2rem, 8vw, 6rem)",
        prose: "clamp(1rem, 2vw, 1.5rem)",
        
        // Component Spacing
        "input-y": "0.625rem",
        "input-x": "0.875rem",
        "button-y": "0.5rem",
        "button-x": "1rem",
        "card-padding": "1.5rem",
      },
      
      // Modern Border Radius Scale
      borderRadius: {
        none: "0",
        xs: "0.125rem",   // 2px
        sm: "0.25rem",    // 4px
        md: "0.375rem",   // 6px  
        lg: "0.5rem",     // 8px
        xl: "0.75rem",    // 12px
        "2xl": "1rem",    // 16px
        "3xl": "1.5rem",  // 24px
        "4xl": "2rem",    // 32px
        full: "9999px",
        
        // Component-specific
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        modal: "var(--radius-modal)",
      },
      
      // Advanced Shadow System
      boxShadow: {
        xs: "0 1px 2px 0 oklch(0% 0 0 / 0.05)",
        sm: "0 1px 3px 0 oklch(0% 0 0 / 0.1), 0 1px 2px -1px oklch(0% 0 0 / 0.1)",
        md: "0 4px 6px -1px oklch(0% 0 0 / 0.1), 0 2px 4px -2px oklch(0% 0 0 / 0.1)",
        lg: "0 10px 15px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -4px oklch(0% 0 0 / 0.1)",
        xl: "0 20px 25px -5px oklch(0% 0 0 / 0.1), 0 8px 10px -6px oklch(0% 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px oklch(0% 0 0 / 0.25)",
        
        // Contextual Shadows
        glass: "0 8px 32px 0 oklch(20% 0 270 / 0.15)",
        neural: "inset 2px 2px 4px oklch(85% 0 0), inset -2px -2px 4px oklch(100% 0 0)",
        glow: "0 0 20px oklch(var(--primary) / 0.4)",
        "glow-lg": "0 0 40px oklch(var(--primary) / 0.3)",
        
        // Interactive States
        "hover-lift": "0 20px 25px -5px oklch(0% 0 0 / 0.15), 0 8px 10px -6px oklch(0% 0 0 / 0.1)",
        "active-press": "0 2px 4px 0 oklch(0% 0 0 / 0.15), inset 0 1px 2px 0 oklch(0% 0 0 / 0.1)",
      },
      
      // Spring-based Animation System
      keyframes: {
        // Natural Motion Keyframes
        "spring-in": {
          "0%": { 
            transform: "scale(0.8) translateY(20px)",
            opacity: "0"
          },
          "50%": { 
            transform: "scale(1.05) translateY(-5px)",
            opacity: "0.8"
          },
          "100%": { 
            transform: "scale(1) translateY(0)",
            opacity: "1"
          },
        },
        "spring-out": {
          "0%": { 
            transform: "scale(1)",
            opacity: "1"
          },
          "100%": { 
            transform: "scale(0.8) translateY(20px)",
            opacity: "0"
          },
        },
        
        // AI-Native Animations
        "ai-pulse": {
          "0%, 100%": { 
            opacity: "0.4",
            transform: "scale(1)"
          },
          "50%": { 
            opacity: "0.8",
            transform: "scale(1.02)"
          },
        },
        "ai-thinking": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        
        // Micro-interactions
        "hover-lift": {
          "0%": { transform: "translateY(0) scale(1)" },
          "100%": { transform: "translateY(-2px) scale(1.02)" },
        },
        "click-bounce": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.98)" },
          "100%": { transform: "scale(1)" },
        },
        
        // Loading States
        "skeleton-wave": {
          "0%": { 
            background: "linear-gradient(90deg, transparent, oklch(var(--muted) / 0.4), transparent)",
            backgroundPosition: "-200px 0"
          },
          "100%": { 
            backgroundPosition: "200px 0"
          },
        },
        
        // Progressive Disclosure
        "fade-up": {
          "0%": { 
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "slide-down": {
          "0%": { 
            height: "0",
            opacity: "0"
          },
          "100%": { 
            height: "var(--radix-accordion-content-height)",
            opacity: "1"
          },
        },
      },
      
      animation: {
        // Spring-based Animations
        "spring-in": "spring-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "spring-out": "spring-out 0.2s cubic-bezier(0.4, 0, 0.6, 1)",
        
        // AI-Native Animations
        "ai-pulse": "ai-pulse 2s ease-in-out infinite",
        "ai-thinking": "ai-thinking 1.5s ease-in-out infinite",
        
        // Micro-interactions
        "hover-lift": "hover-lift 0.2s ease-out",
        "click-bounce": "click-bounce 0.15s ease-out",
        
        // Loading States
        "skeleton": "skeleton-wave 2s linear infinite",
        
        // Progressive Disclosure
        "fade-up": "fade-up 0.3s ease-out",
        "slide-down": "slide-down 0.2s ease-out",
        "slide-up": "slide-down 0.2s ease-out reverse",
      },
      
      // Modern Transition System
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        swift: "cubic-bezier(0.4, 0, 0.6, 1)",
        snappy: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      
      transitionDuration: {
        instant: "0ms",
        fast: "150ms", 
        normal: "300ms",
        slow: "500ms",
        deliberate: "800ms",
      },
      
      // Backdrop Filters
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "40px",
      },
      
      // Modern Aspect Ratios
      aspectRatio: {
        "golden": "1.618 / 1",
        "video": "16 / 9",
        "cinema": "21 / 9",
        "photo": "4 / 3",
        "portrait": "3 / 4",
        "story": "9 / 16",
      },
      
      // Z-Index Scale
      zIndex: {
        hide: "-1",
        auto: "auto",
        base: "0",
        docked: "10",
        dropdown: "1000",
        sticky: "1100", 
        banner: "1200",
        overlay: "1300",
        modal: "1400",
        popover: "1500",
        skipLink: "1600",
        toast: "1700",
        tooltip: "1800",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    
    // Modern Utility Plugin
    function({ addUtilities, addComponents, addVariant, theme, e }: any) {
      
      // 2025 Utility Classes
      addUtilities({
        // Glass Morphism System
        ".glass-subtle": {
          background: "oklch(var(--surface-glass) / 0.8)",
          backdropFilter: "blur(12px) saturate(1.2)",
          border: "1px solid oklch(var(--border) / 0.3)",
        },
        ".glass-medium": {
          background: "oklch(var(--surface-glass) / 0.9)",
          backdropFilter: "blur(16px) saturate(1.4)",
          border: "1px solid oklch(var(--border) / 0.4)",
        },
        ".glass-strong": {
          background: "oklch(var(--surface-glass) / 0.95)",
          backdropFilter: "blur(24px) saturate(1.6)",
          border: "1px solid oklch(var(--border) / 0.5)",
        },
        
        // Neural/Soft UI System
        ".neural-subtle": {
          background: "oklch(var(--surface))",
          boxShadow: `
            inset 2px 2px 4px oklch(var(--neutral-300) / 0.3),
            inset -2px -2px 4px oklch(var(--neutral-50) / 0.8)
          `,
        },
        ".neural-raised": {
          background: "oklch(var(--surface))",
          boxShadow: `
            4px 4px 8px oklch(var(--neutral-300) / 0.3),
            -4px -4px 8px oklch(var(--neutral-50) / 0.8)
          `,
        },
        ".neural-inset": {
          background: "oklch(var(--surface))",
          boxShadow: `
            inset 4px 4px 8px oklch(var(--neutral-300) / 0.3),
            inset -4px -4px 8px oklch(var(--neutral-50) / 0.8)
          `,
        },
        
        // AI-Native States
        ".ai-thinking": {
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "0",
            background: "linear-gradient(90deg, transparent, oklch(var(--ai-thinking) / 0.3), transparent)",
            animation: "ai-thinking 1.5s ease-in-out infinite",
          },
        },
        ".ai-active": {
          background: "oklch(var(--ai) / 0.1)",
          borderColor: "oklch(var(--ai) / 0.3)",
          boxShadow: "0 0 20px oklch(var(--ai) / 0.2)",
        },
        
        // Interaction States
        ".interactive": {
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: theme("boxShadow.hover-lift"),
          },
          "&:active": {
            transform: "translateY(0) scale(0.98)",
            transition: "all 0.1s ease-out",
          },
        },
        ".interactive-lift": {
          transition: "transform 0.2s ease-out",
          "&:hover": {
            transform: "translateY(-2px) scale(1.02)",
          },
          "&:active": {
            transform: "translateY(0) scale(1)",
          },
        },
        
        // Text Effects
        ".text-gradient-primary": {
          background: "linear-gradient(135deg, oklch(var(--primary)), oklch(var(--primary-emphasis)))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        },
        ".text-gradient-rainbow": {
          background: "linear-gradient(135deg, oklch(var(--primary)), oklch(var(--accent)), oklch(var(--success)), oklch(var(--warning)))",
          backgroundClip: "text", 
          WebkitBackgroundClip: "text",
          color: "transparent",
        },
        
        // Layout Utilities
        ".bento-grid": {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: theme("spacing.xl"),
          alignItems: "start",
        },
        ".masonry": {
          columns: "var(--columns, 3)",
          columnGap: theme("spacing.lg"),
          columnFill: "balance",
        },
        
        // Scroll Enhancements
        ".scroll-smooth": {
          scrollBehavior: "smooth",
        },
        ".scroll-area": {
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(var(--muted)) transparent",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "oklch(var(--muted) / 0.5)",
            borderRadius: "3px",
            "&:hover": {
              background: "oklch(var(--muted) / 0.7)",
            },
          },
        },
        
        // Loading States
        ".skeleton": {
          background: "linear-gradient(90deg, oklch(var(--muted) / 0.1), oklch(var(--muted) / 0.4), oklch(var(--muted) / 0.1))",
          backgroundSize: "200px 100%",
          animation: "skeleton 2s ease-in-out infinite",
        },
      });
      
      // Modern Component Styles
      addComponents({
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: theme("spacing.sm"),
          padding: `${theme("spacing.button-y")} ${theme("spacing.button-x")}`,
          borderRadius: theme("borderRadius.button"),
          fontSize: theme("fontSize.sm"),
          fontWeight: "500",
          lineHeight: "1",
          textDecoration: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          border: "1px solid transparent",
          outline: "2px solid transparent",
          outlineOffset: "2px",
          
          "&:focus-visible": {
            outline: "2px solid oklch(var(--ring))",
            outlineOffset: "2px",
          },
          "&:disabled": {
            opacity: "0.5",
            pointerEvents: "none",
          },
        },
        
        ".btn-primary": {
          background: "oklch(var(--primary))",
          color: "oklch(var(--primary-foreground))",
          "&:hover": {
            background: "oklch(var(--primary-emphasis))",
            transform: "translateY(-1px)",
            boxShadow: theme("boxShadow.lg"),
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: theme("boxShadow.md"),
          },
        },
        
        ".btn-secondary": {
          background: "oklch(var(--secondary))",
          color: "oklch(var(--secondary-foreground))",
          border: "1px solid oklch(var(--border))",
          "&:hover": {
            background: "oklch(var(--secondary-emphasis))",
            borderColor: "oklch(var(--border) / 0.8)",
          },
        },
        
        ".btn-ghost": {
          background: "transparent",
          color: "oklch(var(--foreground))",
          "&:hover": {
            background: "oklch(var(--accent))",
            color: "oklch(var(--accent-foreground))",
          },
        },
        
        ".card": {
          background: "oklch(var(--surface))",
          border: "1px solid oklch(var(--border))",
          borderRadius: theme("borderRadius.card"),
          padding: theme("spacing.card-padding"),
          boxShadow: theme("boxShadow.sm"),
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          
          "&:hover": {
            boxShadow: theme("boxShadow.md"),
            transform: "translateY(-1px)",
          },
        },
        
        ".input": {
          display: "flex",
          width: "100%",
          padding: `${theme("spacing.input-y")} ${theme("spacing.input-x")}`,
          borderRadius: theme("borderRadius.input"),
          border: "1px solid oklch(var(--border))",
          background: "oklch(var(--surface))",
          color: "oklch(var(--foreground))",
          fontSize: theme("fontSize.sm"),
          lineHeight: "1.5",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          
          "&::placeholder": {
            color: "oklch(var(--muted-foreground))",
          },
          "&:focus": {
            outline: "none",
            borderColor: "oklch(var(--ring))",
            boxShadow: "0 0 0 3px oklch(var(--ring) / 0.1)",
          },
          "&:disabled": {
            opacity: "0.5",
            cursor: "not-allowed",
          },
        },
      });
      
      // Modern Variants
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("group-hocus", [".group:hover &", ".group:focus &"]);
      addVariant("peer-hocus", [".peer:hover ~ &", ".peer:focus ~ &"]);
      addVariant("reduced-motion", "@media (prefers-reduced-motion: reduce)");
      addVariant("high-contrast", "@media (prefers-contrast: high)");
      addVariant("dark-high-contrast", "@media (prefers-color-scheme: dark) and (prefers-contrast: high)");
    },
  ],
} satisfies Config;

export default config;
