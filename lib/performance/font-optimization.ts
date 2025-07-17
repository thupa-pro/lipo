// Font optimization utilities for better Core Web Vitals
export const fontPreloadLinks = [
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    as: "style",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
    as: "style",
    crossOrigin: "anonymous",
  },
];

// Local font fallbacks to reduce layout shift
export const fontFaceDeclarations = `
  @font-face {
    font-family: 'Inter-fallback';
    src: local('Arial'), local('Helvetica'), local('sans-serif');
    ascent-override: 90.20%;
    descent-override: 22.48%;
    line-gap-override: 0.00%;
    size-adjust: 107.40%;
  }

  @font-face {
    font-family: 'Plus Jakarta Sans-fallback';
    src: local('Arial'), local('Helvetica'), local('sans-serif');
    ascent-override: 92.85%;
    descent-override: 23.11%;
    line-gap-override: 0.00%;
    size-adjust: 105.10%;
  }
`;

// CSS for font optimization
export const optimizedFontCSS = `
  :root {
    --font-inter: 'Inter', 'Inter-fallback', system-ui, -apple-system, sans-serif;
    --font-jakarta: 'Plus Jakarta Sans', 'Plus Jakarta Sans-fallback', system-ui, -apple-system, sans-serif;
  }

  * {
    font-synthesis: none;
    font-feature-settings: 'kern' 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-inter);
    font-display: swap;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-jakarta);
    font-display: swap;
  }
`;

// Function to inject critical font CSS
export function injectCriticalFontCSS() {
  if (typeof document === "undefined") return;

  const style = document.createElement("style");
  style.textContent = fontFaceDeclarations + optimizedFontCSS;
  document.head.appendChild(style);
}

// Function to preload critical fonts
export function preloadCriticalFonts() {
  if (typeof document === "undefined") return;

  fontPreloadLinks.forEach((link) => {
    const linkElement = document.createElement("link");
    Object.assign(linkElement, link);
    document.head.appendChild(linkElement);
  });
}

// Font loading strategy for better performance
export const fontLoadingStrategy = {
  // Preload only critical fonts
  preload: [
    "Inter-400",
    "Inter-500",
    "Plus Jakarta Sans-500",
    "Plus Jakarta Sans-600",
  ],

  // Load other weights on demand
  loadOnDemand: [
    "Inter-300",
    "Inter-600",
    "Inter-700",
    "Inter-800",
    "Plus Jakarta Sans-400",
    "Plus Jakarta Sans-700",
    "Plus Jakarta Sans-800",
  ],

  // Fallback fonts
  fallbacks: {
    sans: "'Inter-fallback', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display:
      "'Plus Jakarta Sans-fallback', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
  },
};
