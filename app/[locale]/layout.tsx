import type React from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background text-foreground">
            {/* Premium Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/10 shadow-lg">
              <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <div>
                      <span className="font-black text-xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                        Loconomy
                      </span>
                      <div className="flex items-center gap-1 -mt-1">
                        <span className="text-xs text-blue-600 dark:text-violet-300 font-medium">
                          AI-Powered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="hidden md:flex items-center space-x-2">
                    <a href="/" className="px-4 py-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300">Home</a>
                    <a href="/browse" className="px-4 py-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300">Services</a>
                    <a href="/request-service" className="px-4 py-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300">Request</a>
                  </nav>

                  {/* Auth Actions */}
                  <div className="flex items-center space-x-3">
                    <a href="/auth/signin" className="px-4 py-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300">
                      Sign In
                    </a>
                    <a href="/auth/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 pt-16">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
