import type React from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MockAuthProvider } from "@/lib/mock/auth";
import EnhancedErrorBoundary from "@/components/enhanced-error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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

// This layout handles non-locale routes and root redirects
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${jakarta.variable}`}
        suppressHydrationWarning
      >
        <EnhancedErrorBoundary>
          <MockAuthProvider>
            <ClerkProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                suppressHydrationWarning
              >
                <div className="relative flex min-h-screen flex-col bg-background text-foreground">
                  {children}
                </div>
                <Toaster />
              </ThemeProvider>
            </ClerkProvider>
          </MockAuthProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
