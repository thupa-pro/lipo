"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import {
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Shield,
  Zap,
  Globe,
  Heart,
  CheckCircle,
  Brain,
  Clock,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  MessageSquare
} from "lucide-react";
import { COPY } from "@/lib/content/copy";

export default function EnhancedHomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (isSignedIn && user) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}/auth/signup`);
    }
  };

  const handleSignIn = () => {
    router.push(`/${locale}/auth/signin`);
  };

  const handleBrowseServices = () => {
    router.push(`/${locale}/browse`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-950 dark:to-purple-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loconomy
          </span>
          <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0">
            Elite Network
          </Badge>
        </motion.div>

        <div className="flex items-center space-x-4">
          <ThemeToggleButton />
          {isSignedIn ? (
            <Button 
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-950/30 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/30 mb-8">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {COPY.homepage.hero.trustSignal}
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Elite Local Services,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Intelligently Matched
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {COPY.homepage.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              onClick={handleBrowseServices}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25"
            >
              <Zap className="w-5 h-5 mr-2" />
              {COPY.homepage.hero.ctaPrimary}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push(`/${locale}/become-provider`)}
              className="text-lg px-8 py-4 rounded-2xl font-semibold border-2 border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300"
            >
              <Users className="w-5 h-5 mr-2" />
              {COPY.homepage.hero.ctaSecondary}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Clock, label: "90-Second Matching", value: "Average" },
              { icon: Shield, label: "Verified Providers", value: "100%" },
              { icon: Star, label: "Satisfaction Rate", value: "98%" },
              { icon: Users, label: "Happy Customers", value: "2.1M+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-violet-200 bg-clip-text text-transparent">
              Why Elite Professionals Choose Loconomy
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the future of local services with AI-powered matching, community trust, and sovereign intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COPY.homepage.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2 }}
            >
              <Card className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border-white/20 dark:border-white/10 rounded-3xl p-8 group hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-0 relative z-10">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="relative bg-gradient-to-br from-blue-600 to-purple-600 dark:from-violet-600 dark:to-purple-600 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience Elite Services?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of customers who have discovered premium local professionals through our AI-powered marketplace
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Elite Journey
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => router.push(`/${locale}/how-it-works`)}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  See How It Works
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Loconomy
                </span>
              </div>
              <p className="text-slate-600 dark:text-gray-400 text-sm">
                The AI-native hyperlocal marketplace for premium services. Elite professionals, intelligent matching.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                <li><a href={`/${locale}/browse`} className="hover:text-blue-600 transition-colors">Browse Services</a></li>
                <li><a href={`/${locale}/become-provider`} className="hover:text-blue-600 transition-colors">Become a Provider</a></li>
                <li><a href={`/${locale}/how-it-works`} className="hover:text-blue-600 transition-colors">How It Works</a></li>
                <li><a href={`/${locale}/pricing`} className="hover:text-blue-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                <li><a href={`/${locale}/help`} className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href={`/${locale}/safety`} className="hover:text-blue-600 transition-colors">Safety</a></li>
                <li><a href={`/${locale}/contact`} className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                <li><a href={`/${locale}/community`} className="hover:text-blue-600 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                <li><a href={`/${locale}/privacy`} className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href={`/${locale}/terms`} className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href={`/${locale}/accessibility`} className="hover:text-blue-600 transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-600 dark:text-gray-400">
              © 2024 Loconomy Inc. All rights reserved. Elite service marketplace.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                SOC 2 Compliant
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
