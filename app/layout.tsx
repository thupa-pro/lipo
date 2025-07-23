import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { getUnifiedSession } from '@/lib/auth/session';
import { RoleAwareNavigation } from '@/components/navigation/RoleAwareNavigation';
import { Logo } from '@/components/ui/logo';
import { UIContext, LogoVariant } from '@/lib/types/logo';
import { getLogoPath } from '@/lib/utils/logo';
import { SovereignObservabilityProvider } from '@/lib/observability/providers';
import { SovereignAnalyticsProvider } from '@/lib/analytics/providers';
import { ErrorBoundary } from '@/components/error-boundary';
import { ClerkProvider } from '@/components/providers/ClerkProvider';
import { CookieConsentProvider, CookieConsentBanner, CookieSettingsLink } from '@/components/cookies';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

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
    description: 'Experience the world\'s most advanced AI marketplace where elite professionals meet intelligent matching.',
    images: [getLogoPath(LogoVariant.COLORED)],
    creator: '@Loconomy',
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
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUnifiedSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical assets */}
        <link rel="preload" href={getLogoPath(LogoVariant.LIGHT)} as="image" />
        <link rel="preload" href={getLogoPath(LogoVariant.DARK)} as="image" />
        <link rel="preload" href={getLogoPath(LogoVariant.COLORED)} as="image" />
        
        {/* Critical CSS for logo system - moved to globals.css to prevent hydration issues */}

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Loconomy",
              "description": "Elite AI-Powered Local Services Platform",
              "url": "https://loconomy.com",
              "logo": getLogoPath(LogoVariant.COLORED),
              "sameAs": [
                "https://twitter.com/Loconomy",
                "https://linkedin.com/company/loconomy",
                "https://facebook.com/loconomy"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-855-ELITE-AI",
                "contactType": "customer service",
                "availableLanguage": ["English", "Spanish", "French"]
              }
            })
          }}
        />

        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content={`
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' 
            https://www.google-analytics.com 
            https://www.googletagmanager.com
            https://js.stripe.com
            https://checkout.stripe.com
            https://app.posthog.com;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          font-src 'self' https://fonts.gstatic.com;
          img-src 'self' data: blob: https: http:;
          connect-src 'self' 
            https://api.openai.com
            https://supabase.co
            https://app.posthog.com
            https://o4507659827478528.ingest.us.sentry.io;
          frame-src 'self' https://js.stripe.com https://checkout.stripe.com;
          object-src 'none';
          base-uri 'self';
          form-action 'self';
        `.replace(/\s+/g, ' ').trim()} />
      </head>
      <body className={cn(
        inter.className,
        "min-h-screen bg-background font-sans antialiased",
        "selection:bg-violet-200 dark:selection:bg-violet-800"
      )}>
        <ErrorBoundary>
          <ClerkProvider>
            <CookieConsentProvider>
              <SovereignObservabilityProvider>
                <SovereignAnalyticsProvider userId={session?.user?.id}>
                  <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
              >
                <div className="relative flex min-h-screen flex-col">
                  {/* Background Effects */}
                  <div className="fixed inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
                  </div>

                  {/* Skip to main content for accessibility */}
                  <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white px-4 py-2 rounded-md z-50 transition-all"
                  >
                    Skip to main content
                  </a>

                  {/* Navigation */}
                  <Suspense fallback={
                    <div className="h-16 bg-background/80 backdrop-blur-sm border-b animate-pulse" />
                  }>
                    <RoleAwareNavigation />
                  </Suspense>

                  {/* Main Content */}
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>

                  {/* Enhanced Premium Footer */}
                  <Footer />

                                      {/* Cookie Consent */}
                    <Suspense fallback={null}>
                      <CookieConsentBanner />
                    </Suspense>

                  {/* Toast Notifications */}
                  <Toaster />
                </div>
                  </ThemeProvider>
                </SovereignAnalyticsProvider>
              </SovereignObservabilityProvider>
            </CookieConsentProvider>
          </ClerkProvider>
        </ErrorBoundary>

        {/* Performance Monitoring Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && window.posthog) {
                      window.posthog.capture('page_performance', {
                        load_time: perfData.loadEventEnd - perfData.loadEventStart,
                        dom_ready: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        url: window.location.pathname
                      });
                    }
                  }, 0);
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
