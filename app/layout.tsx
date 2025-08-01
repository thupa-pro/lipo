import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import './globals.enhanced.css';
import './globals.enhanced.2025.css';
import './themes.2025.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { getUnifiedSession } from '@/lib/auth/session';
import { Logo } from '@/components/ui/logo';
import { UIContext, LogoVariant } from '@/lib/types/logo';
import { getLogoPath } from '@/lib/utils/logo';
import { SovereignObservabilityProvider } from '@/lib/observability/providers';
import { SovereignAnalyticsProvider } from '@/lib/analytics/providers';
import { ErrorBoundary } from '@/components/error-boundary';
import { ClerkProvider } from '@/components/providers/ClerkProvider';
import { CookieConsentProvider, CookieConsentBanner, CookieSettingsLink } from '@/components/cookies';
import Footer from '@/components/footer';
import { PerformanceProvider } from '@/components/providers/PerformanceProvider';

// Lazy load navigation and heavy components
import { LazyComponents } from '@/lib/utils/code-splitting';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Loconomy - Elite AI-Powered Local Services Platform',
  description: 'Experience the world\'s most advanced AI marketplace where elite professionals meet intelligent matching in under 90 seconds. Revolutionary service excellence through cutting-edge technology.',
  keywords: 'elite local services, AI marketplace, premium service providers, intelligent matching, revolutionary AI, sovereign platform, luxury services',
  authors: [{ name: 'Loconomy Elite Team' }],
  creator: 'Loconomy',
  publisher: 'Loconomy Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://loconomy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Loconomy - Elite AI-Powered Local Services Platform',
    description: 'Experience the world\'s most advanced AI marketplace where elite professionals meet intelligent matching in under 90 seconds.',
    url: '/',
    siteName: 'Loconomy',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: getLogoPath(LogoVariant.COLORED),
        width: 1200,
        height: 630,
        alt: 'Loconomy - Elite AI-Powered Local Services Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loconomy - Elite AI-Powered Local Services Platform',
    description: 'Experience the world\'s most advanced AI marketplace where elite professionals meet intelligent matching in under 90 seconds.',
    images: [getLogoPath(LogoVariant.COLORED)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// Loading component for navigation
const NavigationSkeleton = () => (
  <div className="h-16 bg-white border-b border-gray-200 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="w-32 h-8 bg-gray-200 rounded"></div>
        <div className="flex space-x-4">
          <div className="w-16 h-8 bg-gray-200 rounded"></div>
          <div className="w-16 h-8 bg-gray-200 rounded"></div>
          <div className="w-16 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session on server side for better performance
  const session = await getUnifiedSession();

  return (
    <html lang="en" suppressHydrationMismatch>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Performance optimization meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Critical CSS inline */}
        <style>{`
          /* Critical above-the-fold styles */
          .loading-skeleton { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        `}</style>
      </head>
<<<<<<< HEAD
      <body className={cn(
        inter.className,
        "min-h-screen bg-background font-sans antialiased theme-adaptive",
        "selection:bg-primary/20 selection:text-primary-foreground",
        "theme-glass" // Default to glass theme - can be changed dynamically
      )}>
=======
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
>>>>>>> origin/main
        <ErrorBoundary>
          <ClerkProvider>
            <PerformanceProvider>
              <SovereignObservabilityProvider>
                <SovereignAnalyticsProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                  >
<<<<<<< HEAD
                <div className="relative flex min-h-screen flex-col">
                  {/* Enhanced Background Effects */}
                  <div className="fixed inset-0 -z-10 overflow-hidden">
                    {/* Primary gradient orbs */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-ai-primary/10 to-ai-accent/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-trust-primary/10 to-trust-accent/10 rounded-full blur-3xl animate-float-gentle" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-premium-primary/8 to-premium-accent/8 rounded-full blur-3xl animate-pulse-glow" />

                    {/* Secondary ambient light */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}} />
                    <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-white/3 to-transparent rounded-full blur-2xl animate-float-gentle" style={{animationDelay: '4s'}} />

                    {/* Neural pattern overlay */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10"
                         style={{
                           backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.3) 1px, transparent 0)`,
                           backgroundSize: '50px 50px'
                         }} />
                  </div>

                  {/* Enhanced Skip to main content for accessibility */}
                  <a
                    href="#main-content"
                    className="skip-link focus-visible-ring btn-ai-primary z-maximum"
                  >
                    Skip to main content
                  </a>

                  {/* Enhanced Navigation */}
                  <Suspense fallback={
                    <div className="h-16 glass-nav animate-skeleton-pulse">
                      <div className="container mx-auto px-4 h-full flex items-center justify-between">
                        <div className="skeleton w-32 h-8 rounded-xl"></div>
                        <div className="hidden md:flex gap-4">
                          <div className="skeleton w-16 h-6 rounded-lg"></div>
                          <div className="skeleton w-20 h-6 rounded-lg"></div>
                          <div className="skeleton w-18 h-6 rounded-lg"></div>
                        </div>
                        <div className="skeleton w-24 h-8 rounded-xl"></div>
                      </div>
                    </div>
                  }>
                    <RoleAwareNavigation />
                  </Suspense>
=======
                    <CookieConsentProvider>
                      <div className="relative flex min-h-screen flex-col">
                        {/* Header with lazy-loaded navigation */}
                        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                          <Suspense fallback={<NavigationSkeleton />}>
                            <LazyComponents.EnhancedNavigation session={session} />
                          </Suspense>
                        </header>

                        {/* Main content */}
                        <main className="flex-1">
                          <Suspense fallback={
                            <div className="min-h-screen flex items-center justify-center">
                              <div className="text-center">
                                <div className="loading-skeleton w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading...</p>
                              </div>
                            </div>
                          }>
                            {children}
                          </Suspense>
                        </main>

                        {/* Footer - lazy loaded for performance */}
                        <Suspense fallback={<div className="h-20 bg-gray-50"></div>}>
                          <Footer />
                        </Suspense>
                      </div>
>>>>>>> origin/main

                      {/* Global components */}
                      <Toaster />
                      <CookieConsentBanner />
                      <CookieSettingsLink />
                    </CookieConsentProvider>
                  </ThemeProvider>
                </SovereignAnalyticsProvider>
              </SovereignObservabilityProvider>
            </PerformanceProvider>
          </ClerkProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
