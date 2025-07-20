import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AppShell>
              {children}
            </AppShell>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
