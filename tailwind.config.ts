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
  future: {
    hoverOnlyWhenSupported: true,
  },
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
      colors: {
        // Core System Colors (OKLCH)
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

        // Surface Colors
        surface: {
          DEFAULT: "oklch(var(--surface))",
          elevated: "oklch(var(--surface-elevated))",
          overlay: "oklch(var(--surface-overlay))",
          glass: "oklch(var(--surface-glass))",
        },

        // Legacy support (will be deprecated)
        popover: {
          DEFAULT: "oklch(var(--surface-elevated))",
          foreground: "oklch(var(--foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--surface))",
          foreground: "oklch(var(--foreground))",
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

        // Adaptive Neutral Scale
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
          "1": "oklch(var(--chart-1))",
          "2": "oklch(var(--chart-2))",
          "3": "oklch(var(--chart-3))",
          "4": "oklch(var(--chart-4))",
          "5": "oklch(var(--chart-5))",
        },
      },
      borderRadius: {
        none: "0",
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        full: "9999px",

        // Component-specific
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        modal: "var(--radius-modal)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-in": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
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
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        "4xl": "4rem",
        "5xl": "5rem",
        "6xl": "6rem",

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

        // Legacy (will be deprecated)
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "inner-lg": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        glow: "0 0 20px rgb(59 130 246 / 0.5)",
        "glow-lg": "0 0 40px rgb(59 130 246 / 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        premium: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      aspectRatio: {
        video: "16 / 9",
        square: "1 / 1",
        portrait: "3 / 4",
        landscape: "4 / 3",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities, addComponents, theme }: any) {
      // Glassmorphism Utilities
      addUtilities({
        // Enhanced Theme Transitions
        '.theme-transition': {
          'transition-property': 'background-color, border-color, color, fill, stroke, box-shadow, backdrop-filter, transform',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '300ms',
        },

        // Glassmorphism Effects
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
        },
        '.glass-subtle': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
        },
        '.glass-strong': {
          'background': 'rgba(255, 255, 255, 0.15)',
          'backdrop-filter': 'blur(32px)',
          'border': '1px solid rgba(255, 255, 255, 0.25)',
          'box-shadow': '0 16px 40px 0 rgba(31, 38, 135, 0.4)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
          'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        },

        // Neumorphism Effects
        '.neural': {
          'background': '#e6e6e6',
          'box-shadow': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
        },
        '.neural-inset': {
          'background': '#e6e6e6',
          'box-shadow': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
        },
        '.neural-raised': {
          'background': '#e6e6e6',
          'box-shadow': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        },

        // Premium Glow Effects
        '.glow-primary': {
          'box-shadow': '0 0 20px rgba(59, 130, 246, 0.4)',
        },
        '.glow-secondary': {
          'box-shadow': '0 0 20px rgba(147, 51, 234, 0.4)',
        },
        '.glow-success': {
          'box-shadow': '0 0 20px rgba(16, 185, 129, 0.4)',
        },
        '.glow-warning': {
          'box-shadow': '0 0 20px rgba(245, 158, 11, 0.4)',
        },
        '.glow-danger': {
          'box-shadow': '0 0 20px rgba(244, 63, 94, 0.4)',
        },

        // AI-Native Interaction States
        '.ai-thinking': {
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.ai-thinking::before': {
          'content': '""',
          'position': 'absolute',
          'inset': '0',
          'background': 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
          'animation': 'shimmer 2s linear infinite',
        },

        // Premium Gradients
        '.gradient-mesh': {
          'background': 'radial-gradient(at 40% 20%, rgba(120, 119, 198, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255, 119, 198, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255, 0, 255, 0.3) 0px, transparent 50%)',
        },
        '.gradient-ai': {
          'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        '.gradient-premium': {
          'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        },

        // Text Gradients
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
        },
        '.text-gradient-primary': {
          'background': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
        },
        '.text-gradient-rainbow': {
          'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          'color': 'transparent',
        },

        // Interactive States
        '.interactive': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.interactive:hover': {
          'transform': 'translateY(-2px)',
          'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        '.interactive:active': {
          'transform': 'translateY(0)',
        },

        // Bento Box Layout Utilities
        '.bento-grid': {
          'display': 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(300px, 1fr))',
          'gap': '1.5rem',
          'auto-rows': 'minmax(200px, auto)',
        },
        '.bento-item': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
          'border-radius': '1.5rem',
          'padding': '1.5rem',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.bento-item:hover': {
          'transform': 'translateY(-4px)',
          'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },

        // Loading Shimmer Effects
        '.shimmer': {
          'background': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          'background-size': '200% 100%',
          'animation': 'shimmer 2s linear infinite',
        },

        // Scroll Area Enhancements
        '.scroll-area': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(155, 155, 155, 0.5) transparent',
        },
        '.scroll-area::-webkit-scrollbar': {
          'width': '6px',
        },
        '.scroll-area::-webkit-scrollbar-track': {
          'background': 'transparent',
        },
        '.scroll-area::-webkit-scrollbar-thumb': {
          'background-color': 'rgba(155, 155, 155, 0.5)',
          'border-radius': '3px',
          'border': 'transparent',
        },
        '.scroll-area::-webkit-scrollbar-thumb:hover': {
          'background-color': 'rgba(155, 155, 155, 0.7)',
        },
      });

      // Premium Component Styles
      addComponents({
        '.btn-premium': {
          'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          'color': 'white',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.75rem',
          'font-weight': '600',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'border': 'none',
          'cursor': 'pointer',
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.btn-premium:hover': {
          'transform': 'translateY(-2px)',
          'box-shadow': '0 20px 25px -5px rgba(102, 126, 234, 0.4)',
        },
        '.btn-premium:active': {
          'transform': 'translateY(0)',
        },

        '.card-premium': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
          'border-radius': '1.5rem',
          'padding': '1.5rem',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.card-premium:hover': {
          'transform': 'translateY(-4px)',
          'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          'background': 'rgba(255, 255, 255, 0.15)',
        },

        '.input-premium': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
          'border-radius': '0.75rem',
          'padding': '0.75rem 1rem',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'color': 'inherit',
        },
        '.input-premium:focus': {
          'outline': 'none',
          'border-color': 'rgba(59, 130, 246, 0.5)',
          'box-shadow': '0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.2)',
        },
      });
    },
  ],
} satisfies Config;

export default config;
