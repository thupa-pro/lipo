"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Shield, 
  Star, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Brain,
  CheckCircle,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ServiceHub
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-slate-600 dark:text-gray-300 hover:text-blue-600"
              asChild
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl px-6"
              asChild
            >
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 -mt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Trusted by 2.1M+ Users Globally
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Loconomy
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Loconomy Local Economy
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with AI-matched, verified local professionals who deliver
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}exceptional quality service{" "}
            </span>
            right in your neighborhood.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-500"
              asChild
            >
              <Link href="/auth/signup">
                <Search className="w-5 h-5 mr-3" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10"
              asChild
            >
              <Link href="/auth/signin">
                Already a Member? Sign In
              </Link>
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Brain,
                title: "AI-Powered Matching",
                description: "Our intelligent system finds perfect service providers for your specific needs.",
              },
              {
                icon: Shield,
                title: "Verified Professionals",
                description: "All providers are thoroughly vetted and verified for quality and reliability.",
              },
              {
                icon: Zap,
                title: "Instant Booking",
                description: "Book services instantly with real-time availability and immediate confirmation.",
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 dark:opacity-60">
            {[
              { icon: Shield, text: "Bank-Level Security" },
              { icon: Star, text: "5-Star Quality" },
              { icon: Users, text: "Trusted Community" },
              { icon: CheckCircle, text: "Verified Reviews" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300"
              >
                <item.icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 border-none text-white">
            <CardContent className="p-12">
              <h2 className="text-4xl font-black mb-6">
                Ready to Transform Your Service Experience?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of satisfied customers and verified professionals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl px-8 py-4 font-bold"
                  asChild
                >
                  <Link href="/auth/signup">
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 rounded-2xl px-8 py-4 font-bold"
                  asChild
                >
                  <Link href="/auth/signin">
                    Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}