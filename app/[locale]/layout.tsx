import type React from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { IntlProvider } from "@/components/providers/intl-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { ConsentProvider } from "@/components/consent/ConsentContext";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n/config";

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1A2A44" },
  ],
};

export const metadata: Metadata = {
  title: "Loconomy - Elite Local Services Platform",
  description:
    "Connect with verified, elite local professionals for premium home and personal services. Enterprise-grade security, real-time tracking, and exceptional quality.",
  keywords:
    "elite local services, premium home services, verified professionals, enterprise security, real-time tracking",
  authors: [{ name: "Loconomy Elite Team" }],
  creator: "Loconomy",
  publisher: "Loconomy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://loconomy.vercel.app"),
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Loconomy Elite",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Loconomy - Find Local Services You Can Trust",
    description:
      "Connect with verified local professionals for all your service needs.",
    url: "https://loconomy.vercel.app",
    siteName: "Loconomy",
    images: [
      {
        url: "/placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Loconomy - Local Services Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loconomy - Find Local Services You Can Trust",
    description:
      "Connect with verified local professionals for all your service needs.",
    images: ["/placeholder.svg"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className={jakarta.variable}>
      <body
        className={`${inter.className} ${jakarta.variable}`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <IntlProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              suppressHydrationWarning
            >
              <ConsentProvider>
                <div className="relative flex min-h-screen flex-col bg-background">
                  <Navigation />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <CookieConsent />
                <Toaster />
              </ConsentProvider>
            </ThemeProvider>
          </IntlProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
