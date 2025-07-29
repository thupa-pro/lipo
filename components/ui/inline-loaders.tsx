"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Loconomy brand inline loader
export function LoconomyLoader({ 
  size = "md",
  message,
  className 
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  message?: string;
  className?: string;
}) {
  const sizeMap = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const textSizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <motion.div
        className={cn("relative", sizeMap[size])}
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0, -5, 0] 
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src="https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=400"
          alt="Loading"
          fill
          className="object-contain"
          priority={size === "lg" || size === "xl"}
          sizes="(max-width: 768px) 64px, 128px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 rounded-full animate-pulse" />
      </motion.div>
      
      {message && (
        <motion.p
          className={cn("text-slate-600 dark:text-slate-400 font-medium", textSizeMap[size])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

// Minimal brand loader for buttons and small spaces
export function MiniLoconomyLoader({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <motion.div
        className="w-5 h-5 relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=200"
          alt="Loading"
          fill
          className="object-contain opacity-70"
          sizes="20px"
        />
      </motion.div>
    </div>
  );
}

// Progress loader with brand image
export function ProgressLoader({ 
  progress,
  message = "Loading...",
  className 
}: {
  progress: number;
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 p-6", className)}>
      <motion.div
        className="w-20 h-20 relative"
        animate={{ 
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src="https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=400"
          alt="Loading"
          fill
          className="object-contain"
          sizes="80px"
        />
      </motion.div>
      
      <div className="w-full max-w-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{message}</span>
          <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

// Card loading skeleton with brand
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6", className)}>
      <div className="flex items-center justify-center mb-4">
        <LoconomyLoader size="sm" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
      </div>
    </div>
  );
}

// List loading skeleton
export function ListSkeleton({ 
  items = 3,
  className 
}: { 
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center py-6">
        <LoconomyLoader size="md" message="Loading items..." />
      </div>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse flex items-center space-x-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
          <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
  );
}

// Button loading state
export function ButtonLoader({ size = "sm" }: { size?: "xs" | "sm" | "md" }) {
  const sizeMap = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-5 h-5"
  };

  return (
    <motion.div
      className={cn("relative", sizeMap[size])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Image
        src="https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=200"
        alt="Loading"
        fill
        className="object-contain opacity-80"
        sizes="16px"
      />
    </motion.div>
  );
}

export default {
  LoconomyLoader,
  MiniLoconomyLoader,
  ProgressLoader,
  CardSkeleton,
  ListSkeleton,
  ButtonLoader,
};
