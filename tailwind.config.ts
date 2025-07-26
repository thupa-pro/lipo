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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Enhanced Semantic Colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "oklch(96% 0.02 270)",
          100: "oklch(92% 0.05 270)",
          200: "oklch(86% 0.1 270)",
          300: "oklch(78% 0.15 270)",
          400: "oklch(70% 0.18 270)",
          500: "oklch(65% 0.2 270)",
          600: "oklch(58% 0.18 270)",
          700: "oklch(50% 0.15 270)",
          800: "oklch(40% 0.12 270)",
          900: "oklch(25% 0.08 270)",
          950: "oklch(15% 0.04 270)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // AI-Native Context Colors
        ai: {
          DEFAULT: "oklch(65% 0.2 270)",
          foreground: "oklch(98% 0 0)",
          50: "oklch(96% 0.02 270)",
          100: "oklch(92% 0.05 270)",
          200: "oklch(86% 0.1 270)",
          300: "oklch(78% 0.15 270)",
          400: "oklch(70% 0.18 270)",
          500: "oklch(65% 0.2 270)",
          600: "oklch(58% 0.18 270)",
          700: "oklch(50% 0.15 270)",
          800: "oklch(40% 0.12 270)",
          900: "oklch(25% 0.08 270)",
          950: "oklch(15% 0.04 270)",
        },
        
        // Trust & Local Context
        trust: {
          DEFAULT: "oklch(70% 0.15 240)",
          foreground: "oklch(98% 0 0)",
          50: "oklch(96% 0.02 240)",
          100: "oklch(92% 0.04 240)",
          200: "oklch(86% 0.08 240)",
          300: "oklch(78% 0.12 240)",
          400: "oklch(74% 0.14 240)",
          500: "oklch(70% 0.15 240)",
          600: "oklch(64% 0.14 240)",
          700: "oklch(56% 0.13 240)",
          800: "oklch(44% 0.12 240)",
          900: "oklch(30% 0.12 240)",
        },
        
        // Premium Context
        premium: {
          DEFAULT: "oklch(85% 0.12 45)",
          foreground: "oklch(20% 0 0)",
          50: "oklch(96% 0.02 45)",
          100: "oklch(92% 0.04 45)",
          200: "oklch(88% 0.06 45)",
          300: "oklch(84% 0.08 45)",
          400: "oklch(80% 0.10 45)",
          500: "oklch(75% 0.12 45)",
          600: "oklch(70% 0.14 45)",
          700: "oklch(60% 0.12 45)",
          800: "oklch(50% 0.10 45)",
          900: "oklch(35% 0.08 45)",
        },

        // Success Colors
        success: {
          DEFAULT: "oklch(70% 0.17 142)",
          foreground: "oklch(98% 0 0)",
          50: "oklch(96% 0.02 142)",
          100: "oklch(92% 0.04 142)",
          200: "oklch(88% 0.08 142)",
          300: "oklch(82% 0.12 142)",
          400: "oklch(76% 0.15 142)",
          500: "oklch(70% 0.17 142)",
          600: "oklch(64% 0.16 142)",
          700: "oklch(56% 0.15 142)",
          800: "oklch(44% 0.14 142)",
          900: "oklch(30% 0.14 142)",
        },

        // Warning Colors
        warning: {
          DEFAULT: "oklch(80% 0.15 70)",
          foreground: "oklch(20% 0 0)",
          50: "oklch(96% 0.02 70)",
          100: "oklch(92% 0.04 70)",
          500: "oklch(80% 0.15 70)",
          900: "oklch(35% 0.12 70)",
        },
        
        // Enhanced Neutral Scale
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
        
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
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
      },
      
      // Modern Border Radius Scale
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)",
        
        // Component-specific
        button: "0.75rem",
        input: "0.5rem",
        card: "1rem",
        modal: "1.5rem",
      },
      
      // Advanced Shadow System
      boxShadow: {
        // Glass morphism shadows
        glass: "0 8px 32px 0 oklch(20% 0 270 / 0.15)",
        "glass-lg": "0 16px 64px 0 oklch(20% 0 270 / 0.2)",
        
        // Neural/Soft UI shadows
        neural: "inset 2px 2px 4px oklch(85% 0 0), inset -2px -2px 4px oklch(100% 0 0)",
        "neural-raised": "4px 4px 8px oklch(85% 0 0 / 0.3), -4px -4px 8px oklch(100% 0 0 / 0.8)",
        "neural-inset": "inset 4px 4px 8px oklch(85% 0 0 / 0.3), inset -4px -4px 8px oklch(100% 0 0 / 0.8)",
        
        // Glow effects
        glow: "0 0 20px oklch(var(--primary) / 0.4)",
        "glow-lg": "0 0 40px oklch(var(--primary) / 0.3)",
        "glow-ai": "0 0 20px oklch(65% 0.2 270 / 0.4)",
        "glow-trust": "0 0 20px oklch(70% 0.15 240 / 0.4)",
        
        // Interactive states
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
        "ai-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
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
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "neural-glow": {
          "0%, 100%": {
            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)",
          },
          "50%": {
            boxShadow: "inset 3px 3px 6px rgba(0, 0, 0, 0.15), inset -3px -3px 6px rgba(255, 255, 255, 0.9)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
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
        "ai-shimmer": "ai-shimmer 2s linear infinite",
        
        // Micro-interactions
        "hover-lift": "hover-lift 0.2s ease-out",
        "click-bounce": "click-bounce 0.15s ease-out",
        
        // Loading States
        "skeleton": "skeleton-wave 2s linear infinite",
        
        // Progressive Disclosure
        "fade-up": "fade-up 0.3s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neural-glow": "neural-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
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
      
      // Modern Z-Index Scale
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

      // Additional Scale Utilities
      scale: {
        '98': '0.98',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    
    // Modern Utility Plugin for 2025
    function({ addUtilities, addComponents, addVariant }: any) {
      
      // 2025 Utility Classes
      addUtilities({
        // Glass Morphism System
        ".glass-subtle": {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px) saturate(1.2)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
        ".glass-medium": {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px) saturate(1.4)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        },
        ".glass-strong": {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(24px) saturate(1.6)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        },
        
        // Neural/Soft UI System
        ".neural-subtle": {
          boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)",
        },
        ".neural-raised": {
          boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)",
        },
        ".neural-inset": {
          boxShadow: "inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
        },
        
        // AI-Native States
        ".ai-thinking": {
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "0",
            background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)",
            animation: "ai-thinking 1.5s ease-in-out infinite",
          },
        },
        ".ai-active": {
          background: "rgba(139, 92, 246, 0.1)",
          borderColor: "rgba(139, 92, 246, 0.3)",
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
        },
        
        // Interaction States
        ".interactive": {
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
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
          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        },
        ".text-gradient-ai": {
          background: "linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        },
        
        // Loading States
        ".skeleton": {
          background: "linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1))",
          backgroundSize: "200px 100%",
          animation: "skeleton 2s ease-in-out infinite",
        },

        // Missing Component Utilities
        ".bg-glass": {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(16px) saturate(1.4)",
        },
        ".border-glass-border": {
          borderColor: "rgba(255, 255, 255, 0.3)",
        },
        ".backdrop-blur-glass": {
          backdropFilter: "blur(16px)",
        },
        ".shadow-glass": {
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.15)",
        },
        ".shadow-glass-lg": {
          boxShadow: "0 16px 64px 0 rgba(0, 0, 0, 0.2)",
        },
        ".bg-glass-strong": {
          background: "rgba(255, 255, 255, 0.95)",
        },
        ".rounded-glass": {
          borderRadius: "1rem",
        },
        ".bg-gradient-ai": {
          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
        },
        ".shadow-glow-primary": {
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
        },
        ".shadow-glow-lg": {
          boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
        },
        ".bg-size-200": {
          backgroundSize: "200% 100%",
        },
        ".bg-pos-100": {
          backgroundPosition: "100% 0",
        },
        ".bg-shimmer": {
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
        },
        ".bg-gradient-premium": {
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
        },
        ".shadow-neural": {
          boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)",
        },
        ".animate-neural-glow": {
          animation: "neural-glow 2s ease-in-out infinite",
        },
        ".shadow-neural-lg": {
          boxShadow: "inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.9)",
        },
        ".animate-shimmer": {
          animation: "shimmer 2s linear infinite",
        },
        ".bg-glass-black": {
          background: "rgba(0, 0, 0, 0.8)",
        },
        ".border-glass-border-dark": {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        ".bg-glass-black-md": {
          background: "rgba(0, 0, 0, 0.9)",
        },
        ".hover-lift": {
          transition: "transform 0.2s ease-out",
          "&:hover": {
            transform: "translateY(-2px) scale(1.02)",
          },
        },
        ".animate-float": {
          animation: "float 3s ease-in-out infinite",
        },
        ".shadow-premium": {
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
        ".text-gradient": {
          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        },
        ".shadow-glow": {
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
        },
        ".scale-98": {
          transform: "scale(0.98)",
        },
      });
      
      // Enhanced Component Styles
      addComponents({
        ".btn-ai": {
          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.75rem",
          fontSize: "0.875rem",
          fontWeight: "500",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "none",
          outline: "none",
          cursor: "pointer",
          
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          "&:focus": {
            outline: "2px solid rgba(139, 92, 246, 0.5)",
            outlineOffset: "2px",
          },
        },
        
        ".card-glass": {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px) saturate(1.4)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          borderRadius: "1rem",
          padding: "1.5rem",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          
          "&:hover": {
            background: "rgba(255, 255, 255, 0.95)",
            transform: "translateY(-1px)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
          },
        },
      });
      
      // Modern Variants
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("group-hocus", [".group:hover &", ".group:focus &"]);
      addVariant("peer-hocus", [".peer:hover ~ &", ".peer:focus ~ &"]);
      addVariant("reduced-motion", "@media (prefers-reduced-motion: reduce)");
      addVariant("high-contrast", "@media (prefers-contrast: high)");
    },
  ],
} satisfies Config;

export default config;
