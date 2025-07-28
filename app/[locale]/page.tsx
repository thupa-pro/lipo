"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown, Mouse, Zap, Star, Users, Award, Shield, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Import enhanced sections
import { HeroSection } from "@/app/components/hero-section";
import { CategoriesSection } from "@/app/components/categories-section";
import ProvidersSection from "@/app/components/providers-section";
import { StatsSection } from "@/app/components/stats-section";
import TestimonialsSection from "@/app/components/testimonials-section";
import { MediaShowcase } from "@/app/components/media-showcase";
import { EnhancedFeatureGallery } from "@/app/components/enhanced-feature-gallery";
import { EnhancedProviderShowcase } from "@/app/components/enhanced-provider-showcase";
import CTASection from "@/app/components/cta-section";

// Floating elements component
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/8 to-cyan-400/8 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -80, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 10
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-violet-400/6 to-pink-400/6 rounded-full blur-3xl"
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${10 + (i * 4)}%`,
            top: `${20 + (i * 3)}%`,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced loading component
const ArtisticLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center backdrop-ai relative overflow-hidden" suppressHydrationWarning>
      <FloatingElements />
      
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-8 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Loading Loconomy...
          </h2>
          <p className="text-xl text-gray-300">Crafting your elite service experience</p>
          
          <div className="flex items-center justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Scroll indicator component
const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// Section transition component
const SectionTransition = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loading state with artistic design
  if (!mounted) {
    return <ArtisticLoader />;
  }

  return (
    <div className="min-h-screen theme-glass glass-subtle relative overflow-hidden">
      <ScrollIndicator />
      <FloatingElements />

      {/* Scroll hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <Mouse className="w-6 h-6" />
              <span className="text-sm font-medium">Scroll to explore</span>
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* Revolutionary Hero Section */}
        <SectionTransition>
          <HeroSection />
        </SectionTransition>

        {/* Elite Stats Section with enhanced design */}
        <SectionTransition delay={0.1}>
          <section className="py-24 relative">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge variant="secondary" className="mb-4 ai-badge glass-strong border border-ai-300 dark:border-ai-600 shadow-glow-ai">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trusted by Elite Network
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Numbers That
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Speak Excellence
                  </span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: Users, number: "50K+", label: "Happy Customers", color: "blue" },
                  { icon: Star, number: "4.9", label: "Average Rating", color: "yellow" },
                  { icon: Shield, number: "99.9%", label: "Success Rate", color: "green" },
                  { icon: Globe, number: "25+", label: "Cities Served", color: "purple" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl neural-raised bg-gradient-to-br from-${stat.color}-500/15 to-${stat.color}-600/15 border border-${stat.color}-500/30 mb-4 group-hover:shadow-glow transition-all duration-300`}>
                      <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionTransition>

        {/* Revolutionary Categories Section */}
        <SectionTransition delay={0.2}>
          <CategoriesSection />
        </SectionTransition>

        {/* Enhanced Providers Section */}
        <SectionTransition delay={0.3}>
          <div className="py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
            <div className="relative z-10">
              <ProvidersSection />
            </div>
          </div>
        </SectionTransition>

        {/* Revolutionary Feature Gallery */}
        <SectionTransition delay={0.4}>
          <div className="py-16">
            <EnhancedFeatureGallery />
          </div>
        </SectionTransition>

        {/* Artistic Testimonials Section */}
        <SectionTransition delay={0.5}>
          <div className="py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/40 dark:from-gray-950/80 dark:to-blue-950/40" />
            <div className="relative z-10">
              <TestimonialsSection />
            </div>
          </div>
        </SectionTransition>

        {/* Elite Provider Showcase */}
        <SectionTransition delay={0.6}>
          <div className="py-16">
            <EnhancedProviderShowcase />
          </div>
        </SectionTransition>

        {/* Comprehensive Media Showcase */}
        <SectionTransition delay={0.7}>
          <div className="py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-pink-50/20 to-orange-50/30 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-orange-950/20" />
            <div className="relative z-10">
              <MediaShowcase />
            </div>
          </div>
        </SectionTransition>

        {/* Final CTA Section with artistic flair */}
        <SectionTransition delay={0.8}>
          <div className="relative py-24 overflow-hidden theme-premium">
            {/* Enhanced Artistic background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
            <div className="absolute inset-0 bg-gradient-holographic opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.4),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.3),transparent)]" />
            
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Badge variant="secondary" className="mb-6 premium-badge glass-strong text-white border-premium-border shadow-glow-premium">
                  <Zap className="w-4 h-4 mr-2" />
                  Ready for Elite Transformation?
                </Badge>
                
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Start Your Elite
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Service Journey
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                  Join thousands of satisfied customers who have discovered the future of premium service delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    asChild 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/browse" className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Explore Services
                    </Link>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    asChild
                    className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Link href="/become-provider">
                      Become a Provider
                    </Link>
                  </Button>
                </div>

                <div className="mt-12 text-sm text-gray-400">
                  ✨ No setup fees • 🛡️ 100% satisfaction guarantee • ⚡ Instant matching
                </div>
              </motion.div>
            </div>
          </div>
        </SectionTransition>
      </main>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(168, 85, 247, 0.3);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .glass-effect {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .perspective-card {
          perspective: 1000px;
        }

        .perspective-card:hover .card-inner {
          transform: rotateY(5deg) rotateX(5deg);
        }

        .card-inner {
          transition: transform 0.3s ease;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
