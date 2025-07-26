"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Import all enhanced section components
import { HeroSection } from "@/app/components/hero-section";
import { CategoriesSection } from "@/app/components/categories-section";
import ProvidersSection from "@/app/components/providers-section";
import { StatsSection } from "@/app/components/stats-section";
import TestimonialsSection from "@/app/components/testimonials-section";
import { MediaShowcase } from "@/app/components/media-showcase";
import { EnhancedFeatureGallery } from "@/app/components/enhanced-feature-gallery";
import { EnhancedProviderShowcase } from "@/app/components/enhanced-provider-showcase";
import CTASection from "@/app/components/cta-section";

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading state with enhanced design
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center backdrop-ai" suppressHydrationWarning>
        <div className="card-glass-ai text-center p-8 max-w-sm mx-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-6 shadow-lg animate-ai-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-ai-gradient">Loading Loconomy...</h2>
            <p className="text-muted-foreground">Preparing your elite service experience</p>
            <div className="flex items-center justify-center gap-1 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce stagger-1"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce stagger-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <main className="relative z-10">
        {/* Enhanced Hero Section with Media Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection />
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="container mx-auto px-4 py-16"
        >
          <StatsSection />
        </motion.div>

        {/* Enhanced Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CategoriesSection />
        </motion.div>

        {/* Enhanced Providers Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="py-16"
        >
          <ProvidersSection />
        </motion.div>

        {/* Revolutionary Feature Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="py-16"
        >
          <EnhancedFeatureGallery />
        </motion.div>

        {/* Enhanced Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="py-16"
        >
          <TestimonialsSection />
        </motion.div>

        {/* Elite Provider Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="py-16"
        >
          <EnhancedProviderShowcase />
        </motion.div>

        {/* Comprehensive Media Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="py-16"
        >
          <MediaShowcase />
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <CTASection />
        </motion.div>
      </main>

      {/* Scroll-triggered animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out forwards;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .text-hero-premium {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass-strong {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .glass-ultra {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .glass-subtle {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .glass-strong {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark .glass-ultra {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .dark .glass-subtle {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.15) 1px, transparent 0);
          background-size: 20px 20px;
        }

        .badge-premium {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-secondary {
          background: rgba(107, 114, 128, 0.1);
          color: rgb(107, 114, 128);
          border: 1px solid rgba(107, 114, 128, 0.2);
        }
      `}</style>
    </div>
  );
}
