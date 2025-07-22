import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "./tsconfig.json",
  },
  // Fix cross-origin request warning
  allowedDevOrigins: [
    '5y98jf-3000.csb.app',
    'localhost',
    '127.0.0.1',
    '*.csb.app',
    '*.codesandbox.io'
  ],
  swcMinify: false,
  // headers: async () => [
  //   {
  //     source: "/(.*)",
  //     headers: securityHeaders,
  //   },
  // ],
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // optimizeCss: true, // Disabled to fix PostCSS issues
  },
  compress: true,
  swcMinify: true,
  webpack: (config, { isServer, dev }) => {
    // ✅ Enhanced OpenTelemetry warning suppression
    if (dev) {
      // Minimize infrastructure logging
      config.infrastructureLogging = {
        level: 'error',
        colors: false,
      };
      
      // Comprehensive warning suppression for development
      config.ignoreWarnings = [
        // OpenTelemetry related warnings
        /Critical dependency: the request of a dependency is an expression/,
        /require function is used in a way in which dependencies cannot be statically extracted/,
        /@opentelemetry/,
        /require-in-the-middle/,
        /import-in-the-middle/,
        /module-wrap/,
        
        // Sentry related warnings
        /@sentry/,
        /webpack.*Sentry/,
        
        // General webpack warnings in development
        /Critical dependency/,
        /the request of a dependency is an expression/,
        /Can't resolve.*in.*node_modules/,
        
        // Prisma related warnings
        /prisma.*client/,
        /\.prisma/,
      ];
      
      // Additional stats configuration to reduce noise
      config.stats = {
        ...config.stats,
        warnings: false,
        warningsFilter: [
          /@opentelemetry/,
          /require-in-the-middle/,
          /@sentry/,
          /Critical dependency/,
        ],
      };
    }

    // ✅ Enhanced resolve fallbacks for better compatibility
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
    };

    // ✅ Bundle analyzer for production builds
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: isServer
            ? "../analyze/server.html"
            : "./analyze/client.html",
        }),
      );
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);
