"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Sparkles,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Clock,
  Search,
  Calendar,
  Users,
  Star,
  Heart,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "pulse" | "dots" | "bars";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  if (variant === "gradient") {
    return (
      <motion.div
        className={cn("relative", sizeClasses[size], className)}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 animate-spin"></div>
        <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900"></div>
      </motion.div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn(
          "rounded-full bg-gradient-to-r from-blue-600 to-purple-600",
          sizeClasses[size],
          className,
        )}
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            animate={{ y: [-4, 4, -4] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-full"
            animate={{ height: [8, 20, 8] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <Loader2
      className={cn("animate-spin text-blue-600", sizeClasses[size], className)}
    />
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  progress?: number;
  steps?: string[];
  variant?: "simple" | "detailed" | "ai" | "search";
  className?: string;
}

export function LoadingCard({
  title = "Loading...",
  description,
  progress,
  steps = [],
  variant = "simple",
  className,
}: LoadingCardProps) {
  if (variant === "ai") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6",
          className,
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-6 h-6 text-blue-600" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {description}
              </p>
            )}
          </div>
        </div>

        {steps.length > 0 && (
          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.5 + 0.3 }}
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === "search") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg",
          className,
        )}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Search className="w-12 h-12 text-blue-600 mx-auto" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <LoadingSpinner variant="dots" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <LoadingSpinner size="md" variant="gradient" />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {progress}% complete
          </p>
        </div>
      )}
    </motion.div>
  );
}

interface SkeletonProps {
  variant?: "text" | "card" | "avatar" | "button" | "image";
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  count = 1,
}: SkeletonProps) {
  const getSkeletonClass = () => {
    const base = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

    switch (variant) {
      case "text":
        return `${base} h-4`;
      case "card":
        return `${base} h-32`;
      case "avatar":
        return `${base} w-10 h-10 rounded-full`;
      case "button":
        return `${base} h-10`;
      case "image":
        return `${base} h-48`;
      default:
        return base;
    }
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(getSkeletonClass(), className)}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(getSkeletonClass(), className)}
      style={{ width, height }}
    />
  );
}

interface StatusIndicatorProps {
  status: "loading" | "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function StatusIndicator({
  status,
  title,
  description,
  action,
  className,
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "loading":
        return {
          icon: Clock,
          color: "blue",
          bgColor: "bg-blue-50 dark:bg-blue-950/30",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-900 dark:text-blue-100",
        };
      case "success":
        return {
          icon: CheckCircle,
          color: "green",
          bgColor: "bg-green-50 dark:bg-green-950/30",
          borderColor: "border-green-200 dark:border-green-800",
          textColor: "text-green-900 dark:text-green-100",
        };
      case "error":
        return {
          icon: XCircle,
          color: "red",
          bgColor: "bg-red-50 dark:bg-red-950/30",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-900 dark:text-red-100",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "yellow",
          bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-900 dark:text-yellow-100",
        };
      case "info":
        return {
          icon: Info,
          color: "blue",
          bgColor: "bg-blue-50 dark:bg-blue-950/30",
          borderColor: "border-blue-200 dark:border-blue-800",
          textColor: "text-blue-900 dark:text-blue-100",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border rounded-lg p-4",
        config.bgColor,
        config.borderColor,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {status === "loading" ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Icon className={`w-5 h-5 text-${config.color}-600`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn("font-medium", config.textColor)}>{title}</h3>
          {description && (
            <p
              className={cn(
                "text-sm mt-1",
                config.textColor.replace("900", "700").replace("100", "200"),
              )}
            >
              {description}
            </p>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </motion.div>
  );
}

// Pre-built loading states for common use cases
export const LoadingStates = {
  AIThinking: () => (
    <LoadingCard
      variant="ai"
      title="AI Processing"
      description="Analyzing your request and finding the best matches..."
      steps={[
        "Understanding your needs",
        "Scanning available providers",
        "Calculating match scores",
        "Preparing recommendations",
      ]}
    />
  ),

  SearchResults: () => (
    <LoadingCard
      variant="search"
      title="Searching..."
      description="Finding the best services in your area"
    />
  ),

  BookingProcess: (step: number) => {
    const steps = [
      "Validating availability",
      "Processing payment",
      "Confirming booking",
      "Notifying provider",
    ];
    return (
      <LoadingCard
        title="Processing Booking"
        description={steps[step - 1] || "Please wait..."}
        progress={(step / steps.length) * 100}
      />
    );
  },

  DataLoading: () => (
    <div className="space-y-4">
      <Skeleton variant="card" count={3} />
    </div>
  ),
};
