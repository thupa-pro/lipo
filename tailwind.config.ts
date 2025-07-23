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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        // Custom brand colors
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6", // Primary Blue: #2563EB (Tailwind's default blue-600)
          600: "#2563EB", // Primary Blue: #2563EB
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          950: "#042F2E",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      spacing: {
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
