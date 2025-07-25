"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  badgeIcon?: ReactNode;
  showPatternOverlay?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  title,
  subtitle,
  badgeText,
  badgeIcon,
  showPatternOverlay = true,
  className = ""
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden ${className}`}>
      {/* Global Background Effects - Consistent with Homepage */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      {showPatternOverlay && (
        <div className="absolute inset-0 grid-pattern opacity-30 z-10" />
      )}

      {/* Content */}
      <div className="relative z-20">
        {/* Hero Section */}
        {(title || badgeText) && (
          <section className="pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {badgeText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 glass-strong rounded-full px-6 py-3 mb-8 animate-fade-in-down"
                >
                  {badgeIcon || <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {badgeText}
                  </span>
                </motion.div>
              )}

              {title && (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                >
                  <span className="text-hero-premium">
                    {title}
                  </span>
                </motion.h1>
              )}

              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </section>
        )}

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

// Shared Card Component with consistent styling
interface PageCardProps {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "gradient";
  hover?: boolean;
}

export function PageCard({ 
  children, 
  className = "", 
  variant = "glass",
  hover = true 
}: PageCardProps) {
  const baseClasses = "rounded-2xl p-8 transition-all duration-300";
  const variantClasses = {
    glass: "glass-ultra",
    solid: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    gradient: "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20"
  };
  const hoverClasses = hover ? "hover:scale-105 hover:shadow-xl" : "";

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
