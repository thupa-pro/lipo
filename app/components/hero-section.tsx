<<<<<<< HEAD
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Search,
  Star,
  Users,
  Zap,
  Shield,
  MapPin,
  Clock,
  Award,
  ChevronDown,
  Play,
  Rocket,
  Globe,
  Heart,
  TrendingUp,
  CheckCircle
} from "lucide-react";

const TrustedBadges = () => {
  const badges = [
    { icon: Star, text: "4.9/5 Rating", color: "yellow" },
    { icon: Users, text: "50K+ Users", color: "blue" },
    { icon: Shield, text: "Verified Safe", color: "green" },
    { icon: Award, text: "Award Winning", color: "purple" },
  ];
=======
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { OptimizedIcon, UIIcons, BusinessIcons } from "@/lib/icons/optimized-icons";
import { HeroSearchForm } from "./hero-search-form";
import { HeroStats } from "./hero-stats";

interface HeroSectionProps {
  locale?: string;
}

export function HeroSection({ locale = 'en' }: HeroSectionProps) {
  const heroContent = {
    en: {
      badge: "🏆 Elite AI-Powered Platform",
      title: "Find Elite Local Services",
      subtitle: "in Under 90 Seconds",
      description: "Experience the world's most advanced AI marketplace where elite professionals meet intelligent matching. Revolutionary service excellence through cutting-edge technology.",
      cta: "Find Services Now",
      secondary: "Become a Provider",
      testimonial: "Perfect matches every time!",
      testimonialAuthor: "Sarah Johnson"
    },
    es: {
      badge: "🏆 Plataforma Elite con IA",
      title: "Encuentra Servicios Locales Elite",
      subtitle: "en Menos de 90 Segundos",
      description: "Experimenta el marketplace de IA más avanzado del mundo donde profesionales elite se encuentran con emparejamiento inteligente.",
      cta: "Buscar Servicios",
      secondary: "Convertirse en Proveedor",
      testimonial: "¡Coincidencias perfectas siempre!",
      testimonialAuthor: "Sarah Johnson"
    }
  };
>>>>>>> origin/main

  const content = heroContent[locale as keyof typeof heroContent] || heroContent.en;

  return (
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="flex flex-wrap items-center justify-center gap-4 mt-12"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={badge.text}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full glass-strong trust-badge interactive-lift border border-trust-border shadow-glow-trust text-sm font-medium`}
        >
          <badge.icon className={`w-4 h-4 text-${badge.color}-400`} />
          <span className="text-gray-700 dark:text-gray-300">{badge.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-2xl mx-auto mt-12"
        >
          <div className="relative ai-component">
            <div className="absolute inset-0 bg-gradient-holographic rounded-2xl blur-xl opacity-30" />
            <div className="relative glass-ultra border border-glass-border-strong rounded-2xl p-2 shadow-glass-lg">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="What elite service do you need? (AI-powered matching in 90s...)"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg border-0 bg-transparent neural-input focus:shadow-glow-ai focus:outline-none placeholder:text-ai-500 dark:placeholder:text-ai-400"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="btn-ai-primary interactive-lift shadow-glow-ai hover:shadow-glow-lg px-8 py-4 rounded-xl focus-visible-ring"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    AI Search
                  </Button>
                </motion.div>
=======
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Premium Badge */}
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 text-sm font-semibold">
              {content.badge}
            </Badge>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {content.title}
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {content.subtitle}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                {content.description}
              </p>
            </div>

            {/* Search Form - Client Component */}
            <HeroSearchForm locale={locale} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 h-12 px-8">
                <OptimizedIcon name="Search" className="w-5 h-5 mr-2" />
                {content.cta}
              </Button>
              
              <Button variant="outline" size="lg" className="h-12 px-8 border-gray-200 hover:bg-gray-50">
                <OptimizedIcon name="Users" className="w-5 h-5 mr-2" />
                {content.secondary}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2">
                <OptimizedIcon name="Shield" className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <OptimizedIcon name="Clock" className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">90-Second Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <OptimizedIcon name="Star" className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">5-Star Service</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className="relative">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-dashboard.webp"
                alt="Loconomy Platform Dashboard"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJiv/Z"
              />
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <OptimizedIcon name="TrendingUp" className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">98% Success</div>
                    <div className="text-xs text-gray-500">Match Rate</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <OptimizedIcon name="Clock" className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">87 sec</div>
                    <div className="text-xs text-gray-500">Avg. Match Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <Card className="absolute -bottom-8 right-8 p-4 bg-white/95 backdrop-blur-sm border-0 shadow-xl max-w-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  SJ
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <OptimizedIcon key={i} name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">"{content.testimonial}"</p>
                  <p className="text-xs text-gray-500">{content.testimonialAuthor}</p>
                </div>
>>>>>>> origin/main
              </div>
            </Card>
          </div>

<<<<<<< HEAD
          {/* Popular searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex items-center justify-center gap-2 mt-6 flex-wrap"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">Popular:</span>
            {["House Cleaning", "Plumber", "Electrician", "Handyman", "Tutoring"].map((term, index) => (
              <motion.button
                key={term}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchValue(term)}
                className="px-3 py-1 text-sm glass-interactive neural-button hover:shadow-glow-ai rounded-full text-ai-700 dark:text-ai-300 transition-all duration-200 focus-visible-ring"
              >
                {term}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FloatingStats = () => {
  const stats = [
    { value: "90sec", label: "Avg. Response", position: "top-20 left-20", delay: 0.5 },
    { value: "24/7", label: "Available", position: "top-32 right-16", delay: 0.7 },
    { value: "99.9%", label: "Success Rate", position: "bottom-32 left-16", delay: 0.9 },
    { value: "50K+", label: "Happy Users", position: "bottom-20 right-20", delay: 1.1 },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1, 
            delay: stat.delay, 
            ease: [0.22, 1, 0.36, 1],
            rotate: { duration: 0.8 }
          }}
          whileHover={{ scale: 1.1, y: -5 }}
          className={`absolute ${stat.position} hidden lg:block`}
        >
          <div className="glass-ultra border border-glass-border-strong rounded-2xl p-4 shadow-glass-lg neural-card interactive-lift">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 0.8, 1],
          rotate: [360, 180, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"
      />

      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5
          }}
          className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + i * 8}%`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <AnimatedBackground />
      </motion.div>

      <FloatingStats />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Hero badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <Badge 
              variant="secondary" 
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20 dark:border-blue-400/30 text-blue-600 dark:text-blue-400 rounded-full backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Elite AI-Powered Service Platform</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
            </Badge>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ 
                backgroundSize: '200% 200%' 
              }}
            >
              Service Experience
            </motion.span>
          </motion.h1>

          {/* Subtitle with enhanced animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the world's most advanced AI marketplace where{" "}
              <motion.span 
                className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                elite professionals
              </motion.span>{" "}
              meet{" "}
              <motion.span 
                className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                intelligent matching
              </motion.span>{" "}
              in under 90 seconds.
            </p>

            {/* Key features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              {[
                { icon: Clock, text: "Instant Matching" },
                { icon: Shield, text: "Verified Quality" },
                { icon: Star, text: "Premium Experience" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <feature.icon className="w-4 h-4 text-green-500" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                asChild
                className="btn-ai-primary interactive-lift shadow-glow-ai hover:shadow-glow-lg px-8 py-4 text-lg rounded-2xl focus-visible-ring"
              >
                <Link href="/browse" className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Elite Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="glass-interactive neural-button border-2 border-glass-border-strong hover:border-ai-400 px-8 py-4 text-lg rounded-2xl focus-visible-ring"
              >
                <Link href="#demo" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  AI Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced search bar */}
          <SearchBar />

          {/* Trust indicators */}
          <TrustedBadges />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-400 dark:text-gray-500"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
=======
        {/* Bottom Stats */}
        <HeroStats />
>>>>>>> origin/main
      </div>

      {/* Additional artistic elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient overlays */}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-purple-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 bg-gradient-to-r from-pink-500/5 to-transparent rounded-full blur-3xl" />
      </div>
    </section>
  );
}
