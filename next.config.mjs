import createNextIntlPlugin from "next-intl/plugin";
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const withNextIntl = createNextIntlPlugin("./i18n.ts");

// Temporarily disable Sentry while fixing bundling issues
const withSentry = (config) => config;

// Security headers
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com https://connect.facebook.net https://www.googletagmanager.com https://static.hotjar.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.supabase.co https://clerk.*.lcl.dev https://*.clerk.accounts.dev https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net",
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "block-all-mixed-content",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development configuration
  allowedDevOrigins: [
    '4bf2c88cdb5c4868b2ecea7415d11498-394f8a2ff5b447859cfa1b94e.fly.dev',
    'localhost:3000',
    '127.0.0.1:3000'
  ],

  // Performance optimizations
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'framer-motion',
      'date-fns'
    ],
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Bundle analyzer for production builds
    bundlePagesExternals: false,
    esmExternals: true,
    // Optimize CSS
    optimizeCss: true,
    // Enable server component logs
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'sharp'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable image optimization
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Webpack configuration for better performance
  webpack: (config, { dev, isServer, webpack }) => {
    // Bundle analyzer for analyzing bundle size
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          generateStatsFile: true,
          statsFilename: 'bundle-stats.json',
        })
      );
    }

    // Optimize for production
    if (!dev) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
          icons: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'icons',
            chunks: 'all',
          },
        },
      };
    }

    // Prevent hydration issues with client-side only code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        path: false,
        os: false,
        crypto: false,
      };
    }

    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      // Reduce bundle size by aliasing to optimized versions
      'date-fns': 'date-fns/esm',
    };

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache API routes for 5 minutes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
    ];
  },

  // Compiler options for better performance
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    // Enable React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Output options for better performance
  output: 'standalone',
  
  // Enable SWC for better performance
  swcMinify: true,

  // Enable compression
  compress: true,

  // Ensure consistent rendering between server and client
  reactStrictMode: true,

  // Prevent hydration mismatches with proper page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Trailing slash consistency
  trailingSlash: false,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Generate source maps only in development
  productionBrowserSourceMaps: false,

  // Optimize fonts
  optimizeFonts: true,
};

export default withNextIntl(nextConfig);
