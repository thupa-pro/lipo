"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  systemTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "loconomy-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
      } catch {
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  useEffect(() => {
    if (!enableSystem) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(media.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [enableSystem]);

  // Calculate resolved theme
  const resolvedTheme: "light" | "dark" = theme === "system" ? systemTheme : theme;

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Disable transitions during theme change if requested
    if (disableTransitionOnChange) {
      const css = document.createElement("style");
      css.appendChild(
        document.createTextNode(
          "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
        )
      );
      document.head.appendChild(css);

      // Force a reflow
      (() => window.getComputedStyle(document.body))();

      // Clean up
      setTimeout(() => {
        document.head.removeChild(css);
      }, 1);
    }

    // Remove existing theme classes
    root.classList.remove("light", "dark");
    
    // Add current theme class
    root.classList.add(resolvedTheme);
    
    // Set color scheme for native elements
    root.style.colorScheme = resolvedTheme;

    // Update meta theme-color for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#000000" : "#ffffff"
      );
    }
  }, [resolvedTheme, disableTransitionOnChange]);

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // Handle localStorage errors gracefully
    }
    setThemeState(newTheme);
  };

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  // Set mounted flag to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch - return children with default theme
  if (!mounted) {
    return (
      <div suppressHydrationWarning>
        {children}
      </div>
    );
  }

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values instead of throwing error to prevent app crash
    console.warn("useTheme must be used within a ThemeProvider. Returning default values.");
    return {
      theme: "system" as Theme,
      setTheme: () => {},
      resolvedTheme: "light" as "light" | "dark",
      toggleTheme: () => {},
      systemTheme: "light" as "light" | "dark"
    };
  }
  return context;
}
