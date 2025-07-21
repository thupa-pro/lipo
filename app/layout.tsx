import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { getUnifiedSession } from '@/lib/auth/session';
import { RoleAwareNavigation } from '@/components/navigation/RoleAwareNavigation';
import { CookieConsent } from '@/components/consent/CookieConsent';
import { getLogoUrl, LogoVariant, FooterLogo } from '@/components/ui/Logo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Loconomy - Premium Local Services Platform',
  description: 'Revolutionizing local service discovery with premium design and AI-powered matching. Connect with verified service providers across 1,200+ cities globally.',
  keywords: 'local services, marketplace, AI-powered, premium services, service providers, booking platform',
  authors: [{ name: 'Loconomy Team' }],
  creator: 'Loconomy',
  publisher: 'Loconomy',
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
    title: 'Loconomy - Premium Local Services Platform',
    description: 'Revolutionizing local service discovery with premium design and AI-powered matching.',
    url: '/',
    siteName: 'Loconomy',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: getLogoUrl(LogoVariant.COLORED),
        width: 220,
        height: 40,
        alt: 'Loconomy - Premium Local Services Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loconomy - Premium Local Services Platform',
    description: 'Revolutionizing local service discovery with premium design and AI-powered matching.',
    images: [getLogoUrl(LogoVariant.COLORED)],
    creator: '@loconomy',
  },
  icons: {
    icon: [
      { url: '/assets/branding/logo-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3B82F6' },
    ],
  },
  manifest: '/site.webmanifest',
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
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user session server-side for navigation
  const session = await getUnifiedSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical logo assets */}
        <link
          rel="preload"
          href="/assets/branding/logo-dark.svg"
          as="image"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          href="/assets/branding/logo-light.svg"
          as="image"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          href="/assets/branding/logo-icon.svg"
          as="image"
          type="image/svg+xml"
        />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={cn(inter.className, 'min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navigation with role-aware logo */}
          <RoleAwareNavigation user={session.user} />
          
          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer with logo */}
          <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-4 py-8">
              <div className="grid gap-8 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <FooterLogo className="mb-4" />
                  <p className="text-sm text-muted-foreground max-w-md">
                    Revolutionizing local service discovery with premium design and AI-powered matching. 
                    Connect with verified service providers across 1,200+ cities globally.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Platform</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/services" className="hover:text-foreground transition-colors">Browse Services</a></li>
                    <li><a href="/providers" className="hover:text-foreground transition-colors">Find Providers</a></li>
                    <li><a href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                    <li><a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Company</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/about" className="hover:text-foreground transition-colors">About Us</a></li>
                    <li><a href="/careers" className="hover:text-foreground transition-colors">Careers</a></li>
                    <li><a href="/press" className="hover:text-foreground transition-colors">Press</a></li>
                    <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  © 2024 Loconomy. All rights reserved.
                </p>
                <div className="flex space-x-4 mt-4 sm:mt-0 text-sm text-muted-foreground">
                  <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
                  <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
                  <a href="/cookies" className="hover:text-foreground transition-colors">Cookies</a>
                </div>
              </div>
            </div>
          </footer>
          
          {/* Cookie consent with tenant awareness */}
          <CookieConsent 
            tenantId={session.tenantId || 'global'}
            position="bottom"
          />
          
          {/* Toast notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
