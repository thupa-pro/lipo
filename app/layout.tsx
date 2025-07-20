import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { RoleAwareNavigation } from "@/components/navigation/RoleAwareNavigation";
import { getCurrentUser } from "@/lib/auth/session";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Loconomy - AI-First Local Economy Platform",
  description: "Empowering local communities through AI-first service connections. Find trusted providers and grow your business with intelligent matching.",
  keywords: ["local services", "AI marketplace", "trusted providers", "community platform", "service booking"],
  authors: [{ name: "Loconomy Team" }],
  creator: "Loconomy",
  metadataBase: new URL("https://loconomy.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://loconomy.com",
    title: "Loconomy - AI-First Local Economy Platform",
    description: "Empowering local communities through AI-first service connections",
    siteName: "Loconomy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loconomy - AI-First Local Economy Platform",
    description: "Empowering local communities through AI-first service connections",
    creator: "@loconomy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get server session for role-aware rendering
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.variable} font-sans antialiased theme-transition min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="loconomy-theme"
        >
          <AuthProvider>
            {/* Role-aware navigation */}
            <RoleAwareNavigation user={user} />
            
            {/* Main content */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Cookie consent banner */}
            <CookieConsent 
              user={user}
              onConsentChange={(settings) => {
                console.log('Consent updated:', settings);
              }}
            />
            
            {/* Toast notifications */}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
