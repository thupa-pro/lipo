"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EliteLoadingScreenProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  variant?: "launch" | "page" | "inline" | "minimal";
  onComplete?: () => void;
  duration?: number;
}

export function EliteLoadingScreen({
  isVisible,
  message = "Loading your experience...",
  progress,
  variant = "launch",
  onComplete,
  duration = 2000
}: EliteLoadingScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the image for instant display
  useEffect(() => {
    const img = new window.Image();
    img.src = "https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=800";
    img.onload = () => setImageLoaded(true);
  }, []);

  // Animate progress
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 300);
          return 100;
        }
        return prev + (progress !== undefined ? 0 : Math.random() * 3 + 1);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, onComplete, progress]);

  // Use provided progress if available
  const displayProgress = progress !== undefined ? progress : loadingProgress;

  const getVariantStyles = () => {
    switch (variant) {
      case "launch":
        return {
          container: "fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
          content: "flex flex-col items-center justify-center min-h-screen p-8",
          image: "w-64 h-64 md:w-80 md:h-80",
          text: "text-xl md:text-2xl font-light text-white/90 mt-8",
          progress: "w-80 md:w-96 mt-8"
        };
      case "page":
        return {
          container: "fixed inset-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm",
          content: "flex flex-col items-center justify-center min-h-screen p-6",
          image: "w-48 h-48 md:w-56 md:h-56",
          text: "text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300 mt-6",
          progress: "w-64 md:w-80 mt-6"
        };
      case "inline":
        return {
          container: "flex items-center justify-center py-12 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-blue-900 rounded-xl",
          content: "flex flex-col items-center justify-center",
          image: "w-32 h-32 md:w-40 md:h-40",
          text: "text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 mt-4",
          progress: "w-48 md:w-64 mt-4"
        };
      case "minimal":
        return {
          container: "flex items-center justify-center py-8",
          content: "flex flex-col items-center justify-center",
          image: "w-24 h-24",
          text: "text-sm font-medium text-slate-600 dark:text-slate-400 mt-3",
          progress: "w-32 mt-3"
        };
      default:
        return getVariantStyles();
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(styles.container)}
        >
          <div className={styles.content}>
            {/* Loading Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? 1 : 0.8, 
                opacity: imageLoaded ? 1 : 0.7,
                rotateY: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className={cn("relative", styles.image)}
            >
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=800"
                alt="Loconomy Loading"
                fill
                className="object-contain"
                priority={variant === "launch"}
                quality={90}
                sizes="(max-width: 768px) 256px, 320px"
              />
              
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 rounded-full animate-pulse" />
            </motion.div>

            {/* Loading Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={cn(styles.text, "text-center")}
            >
              {message}
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={cn("relative", styles.progress)}
            >
              {/* Progress Track */}
              <div className="w-full h-1 bg-white/20 dark:bg-slate-700/50 rounded-full overflow-hidden">
                {/* Progress Fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              
              {/* Progress Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="flex justify-between items-center mt-2 text-xs text-white/70 dark:text-slate-400"
              >
                <span>Loading...</span>
                <span>{Math.round(displayProgress)}%</span>
              </motion.div>
            </motion.div>

            {/* Pulse Dots Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex space-x-2 mt-6"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Background Pattern */}
          {variant === "launch" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Animated gradient orbs */}
              <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
                animate={{ 
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
                animate={{ 
                  x: [0, -30, 0],
                  y: [0, 40, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick loading component for inline use
export function QuickLoader({ 
  size = "md",
  message = "Loading...",
  className 
}: {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}) {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <div className={cn("relative", sizeMap[size])}>
        <Image
          src="https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=800"
          alt="Loading"
          fill
          className="object-contain animate-pulse"
          sizes="(max-width: 768px) 64px, 96px"
        />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{message}</p>
    </div>
  );
}

export default EliteLoadingScreen;
