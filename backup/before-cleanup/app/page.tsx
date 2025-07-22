"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Sparkles, Star, Globe, Users, Shield, Zap, 
  ArrowRight, Play, CheckCircle, TrendingUp,
  Heart, Award, MapPin, Clock, Brain, Crown,
  Rocket, Building2, CircuitBoard, Gem
} from "lucide-react";
import Link from "next/link";

// NoSSR wrapper component
function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

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
      icon: Brain,
      title: "Revolutionary AI Intelligence",
      description: "Our proprietary neural networks analyze 50+ data points to deliver perfect provider matches with 97.8% satisfaction rates.",
      gradient: "from-violet-600 to-purple-600",
      metric: "97.8% satisfaction"
    },
    {
      icon: Crown,
      title: "Elite Provider Network",
      description: "Hand-curated professionals undergo rigorous vetting. Only 1 in 12 applicants join our exclusive marketplace.",
      gradient: "from-amber-500 to-orange-500",
      metric: "Top 8% only"
    },
    {
      icon: Zap,
      title: "Instant Precision Matching",
      description: "Advanced ML algorithms connect you with verified experts in under 90 seconds. Zero waiting, maximum results.",
      gradient: "from-blue-600 to-cyan-500",
      metric: "<90 seconds"
    },
    {
      icon: Shield,
      title: "Fortress-Level Security",
      description: "Military-grade encryption, comprehensive insurance, and $1M+ liability coverage protect every interaction.",
      gradient: "from-emerald-600 to-green-500",
      metric: "$1M+ protected"
    },
    {
      icon: Globe,
      title: "Global Excellence Standard",
      description: "Operating across 127 cities worldwide, we maintain the highest quality standards in every market we serve.",
      gradient: "from-pink-600 to-rose-500",
      metric: "127 cities"
    },
    {
      icon: Rocket,
      title: "Future-Forward Platform",
      description: "Built on cutting-edge technology with AR integration, voice AI, and predictive analytics for tomorrow's needs today.",
      gradient: "from-indigo-600 to-blue-600",
      metric: "Next-gen tech"
    }
  ];

  const stats = [
    { label: "Global Users", value: "2.1M+", icon: Users, description: "Active professionals worldwide" },
    { label: "Elite Cities", value: "127", icon: MapPin, description: "Premium markets served" },
    { label: "Services Delivered", value: "12M+", icon: CheckCircle, description: "Successful connections made" },
    { label: "Response Time", value: "68sec", icon: Clock, description: "Average match time" },
    { label: "Satisfaction Rate", value: "97.8%", icon: Star, description: "Customer happiness score" },
    { label: "Provider Quality", value: "Top 8%", icon: Crown, description: "Elite acceptance rate" }
  ];

  const socialProof = [
    {
      company: "TechCrunch",
      quote: "Loconomy is revolutionizing how we connect with local services through AI innovation.",
      logo: "🚀"
    },
    {
      company: "Forbes",
      quote: "The future of hyperlocal commerce is here, and it's absolutely brilliant.",
      logo: "💎"
    },
    {
      company: "Wired",
      quote: "A masterclass in AI-powered marketplace design that sets the new industry standard.",
      logo: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/25 to-rose-400/25 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating premium particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-violet-400/40 to-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Premium Navigation */}
      <nav className="relative z-50 px-6 py-6 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 dark:from-white dark:via-violet-400 dark:to-white bg-clip-text text-transparent">
                Loconomy
              </span>
              <div className="flex items-center gap-2 -mt-1">
                <Crown className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold tracking-wider uppercase">
                  Elite AI Platform
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="font-semibold" asChild>
              <Link href="/browse">Browse Elite Services</Link>
            </Button>
            <Button variant="ghost" className="font-semibold" asChild>
              <Link href="/how-it-works">How It Works</Link>
            </Button>
            <Button variant="ghost" className="font-semibold" asChild>
              <Link href="/enterprise">Enterprise</Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <NoSSR>
              <ThemeToggle />
            </NoSSR>
            <Button variant="outline" className="hidden sm:flex font-semibold" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold shadow-lg shadow-violet-500/25" asChild>
              <Link href="/register">Join Elite Network</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section className="relative z-40 px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-100/80 to-purple-100/80 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200/50 dark:border-violet-700/50 backdrop-blur-sm"
            >
              <Gem className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                Revolutionary AI-Powered Marketplace
              </span>
              <CircuitBoard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none">
              <span className="bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 dark:from-white dark:via-violet-400 dark:to-white bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Loconomy
              </span>
              <br />
              <span className="bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 dark:from-white dark:via-violet-400 dark:to-white bg-clip-text text-transparent">
                is Here
              </span>
            </h1>

            {/* Premium Subheadline */}
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed">
              Experience the world's most advanced AI marketplace where{" "}
              <span className="text-violet-600 dark:text-violet-400 font-semibold">elite professionals</span>{" "}
              meet intelligent matching in under{" "}
              <span className="text-violet-600 dark:text-violet-400 font-semibold">90 seconds</span>.
            </p>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            >
              <Button
                size="lg"
                className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/request-service" className="flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
                  Start Elite Experience
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 text-lg font-semibold border-2 border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/demo" className="flex items-center gap-3">
                  <Play className="w-6 h-6" />
                  Watch 2-Min Demo
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-12"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider font-semibold">
                Featured In
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                {socialProof.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{item.logo}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {item.company}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Elite Stats Section */}
      <section className="relative z-40 px-6 py-20 bg-gradient-to-br from-slate-50/50 to-violet-50/30 dark:from-slate-900/50 dark:to-violet-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Elite Performance
              </span>{" "}
              <span className="text-slate-900 dark:text-white">
                Metrics
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Join the world's most successful professionals and customers who demand excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-violet-600 dark:text-violet-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-slate-900 dark:text-white">
                Why
              </span>{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Elite Professionals
              </span>{" "}
              <span className="text-slate-900 dark:text-white">
                Choose Us
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
              Revolutionary technology meets uncompromising quality standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.gradient} text-white text-sm font-semibold`}>
                    <Star className="w-4 h-4" />
                    {feature.metric}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
