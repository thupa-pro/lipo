"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SimpleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/10 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-black text-xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Loconomy
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/browse">Services</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/request-service">Request</Link>
            </Button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
