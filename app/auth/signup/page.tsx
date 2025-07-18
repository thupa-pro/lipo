"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  Brain,
  Star,
  Zap,
  Gift,
  Heart,
  Target,
  Award,
} from "lucide-react";

export default function PremiumSignupPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Animated Background - Same as Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all group"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Branding & Benefits */}
            <div className="text-center lg:text-left">
              {/* Logo & Brand */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F7db1aa9d72cc410a876ff9b626b97177%2F9572c145dca8439e88c28327615d849e?format=webp&width=800"
                  alt="Loconomy Logo"
                  className="w-12 h-12 rounded-2xl object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ display: "none" }}
                >
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    Loconomy
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400">
                    <Brain className="w-3 h-3" />
                    AI-Powered Platform
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                  Join the Future of
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Local Services
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                Connect with verified professionals and unlock
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
                  {" "}
                  AI-powered matching{" "}
                </span>
                that finds your perfect service provider.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  {
                    icon: Brain,
                    title: "AI Matching",
                    desc: "Smart recommendations",
                  },
                  {
                    icon: Shield,
                    title: "Verified Pros",
                    desc: "100% background checked",
                  },
                  {
                    icon: Zap,
                    title: "Instant Booking",
                    desc: "Book in seconds",
                  },
                  {
                    icon: Heart,
                    title: "Love Guarantee",
                    desc: "100% satisfaction",
                  },
                  {
                    icon: Target,
                    title: "Best Prices",
                    desc: "AI-optimized rates",
                  },
                  {
                    icon: Award,
                    title: "5-Star Quality",
                    desc: "Exceptional service",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-white/10">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 border-2 border-white dark:border-gray-800"
                      />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span className="font-bold text-lg">4.9</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      From 2.1M+ users
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-300 italic">
                  "Loconomy changed how I find local services. The AI matching
                  is incredible!"
                </p>
              </div>
            </div>

            {/* Right Side - Clerk SignUp Form */}
            <div className="w-full max-w-lg mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30" />
                <div className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-blue-200/50 dark:border-white/20 shadow-2xl rounded-3xl p-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-6 mx-auto">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Free to Join • Premium Features
                    </span>
                    <Gift className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>

                  <SignUp
                    appearance={{
                      elements: {
                        rootBox: "mx-auto",
                        card: "bg-transparent shadow-none border-none",
                        headerTitle:
                          "text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent",
                        headerSubtitle: "text-slate-600 dark:text-gray-300",
                        socialButtonsBlockButton:
                          "h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all",
                        formButtonPrimary:
                          "h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25 transition-all duration-300",
                        formFieldInput:
                          "h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all",
                        footerActionLink:
                          "text-blue-600 dark:text-blue-400 hover:underline font-semibold",
                        dividerLine: "bg-slate-200 dark:bg-white/20",
                        dividerText:
                          "text-slate-500 dark:text-gray-400 font-medium",
                      },
                    }}
                    redirectUrl="/dashboard"
                    signInUrl="/auth/signin"
                  />
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-slate-500 dark:text-gray-400">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
