"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Sparkles, Star, Globe, Users, Shield, Zap, 
  ArrowRight, Play, CheckCircle, TrendingUp,
  Heart, Award, MapPin, Clock
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const features = [
    {
      icon: Shield,
      title: "Trusted & Secure",
      description: "AI-verified providers with comprehensive background checks and real customer reviews.",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant matching with available providers near you using advanced AI algorithms.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Supporting local businesses and building stronger communities worldwide.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Only the highest-rated providers make it to our elite marketplace.",
      gradient: "from-purple-500 to-violet-500"
    }
  ];

  const stats = [
    { label: "Active Users", value: "100K+", icon: Users },
    { label: "Global Cities", value: "100+", icon: MapPin },
    { label: "Services Booked", value: "1M+", icon: CheckCircle },
    { label: "Response Time", value: "<2min", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 dark:bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
                Loconomy
              </span>
              <div className="flex items-center gap-1 -mt-1">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  AI-Powered
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/browse">Browse Services</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/how-it-works">How it Works</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/pricing">Pricing</Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50 mb-8">
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Trusted by 100K+ users worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
                AI-First Local
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Economy Platform
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover trusted local services instantly with our{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
                AI-powered matching platform
              </span>
              . From home repairs to personal care, connect with verified professionals in your community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Link href="/auth/signup" className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 rounded-2xl border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              whileHover={{ y: -8 }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl p-12 border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to transform your local experience?
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-300 mb-8">
              Join thousands of satisfied customers and providers who trust Loconomy for their local service needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Link href="/auth/signup" className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Join Loconomy Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="px-8 py-4 rounded-2xl border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
              >
                <Link href="/browse" className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  Loconomy
                </span>
              </div>
              <p className="text-slate-600 dark:text-gray-400 mb-4">
                AI-powered platform connecting communities with trusted local services worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-600 dark:text-gray-400">
                <li><Link href="/browse" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Browse Services</Link></li>
                <li><Link href="/how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="/global-cities" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Global Cities</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-2 text-slate-600 dark:text-gray-400">
                <li><Link href="/help" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/safety" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Safety</Link></li>
                <li><Link href="/community" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-600 dark:text-gray-400">
                <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
                <li><Link href="/compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-600 dark:text-gray-400">
              © 2024 Loconomy. All rights reserved. Empowering local communities worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
