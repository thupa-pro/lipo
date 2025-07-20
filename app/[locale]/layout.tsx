import type React from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col bg-background text-foreground">
          {/* Simple Header */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-6">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">Loconomy</span>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                  <a href="/browse" className="text-gray-600 hover:text-gray-900">Services</a>
                  <a href="/request-service" className="text-gray-600 hover:text-gray-900">Request</a>
                </nav>
                <div className="flex items-center space-x-3">
                  <a href="/auth/signin" className="px-4 py-2 text-gray-600 hover:text-gray-900">Sign In</a>
                  <a href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</a>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
