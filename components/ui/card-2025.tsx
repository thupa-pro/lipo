import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative transition-all duration-300 text-card-foreground will-change-transform",
  {
    variants: {
      variant: {
        // Core Variants
        default: 
          "rounded-xl border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5",
        
        elevated: 
          "rounded-xl bg-card border shadow-lg hover:shadow-xl hover:-translate-y-1",
        
        outline: 
          "rounded-xl border-2 border-border bg-transparent hover:bg-card/50 hover:-translate-y-0.5",

        // Glass Morphism Variants
        "glass-subtle": 
          "rounded-2xl backdrop-blur-md bg-white/60 dark:bg-black/60 border border-white/20 dark:border-white/10 shadow-glass hover:bg-white/80 dark:hover:bg-black/80 hover:shadow-glass-lg hover:-translate-y-1",
        
        "glass-medium": 
          "rounded-2xl backdrop-blur-lg bg-white/80 dark:bg-black/80 border border-white/30 dark:border-white/20 shadow-glass hover:bg-white/90 dark:hover:bg-black/90 hover:shadow-glass-lg hover:-translate-y-1",
        
        "glass-strong": 
          "rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-white/40 dark:border-white/30 shadow-glass-lg hover:bg-white/95 dark:hover:bg-black/95 hover:shadow-2xl hover:-translate-y-1",

        // AI-Native Variants
        "ai-primary": 
          "rounded-2xl bg-gradient-to-br from-violet-50/80 to-purple-50/60 dark:from-violet-950/40 dark:to-purple-950/20 border border-violet-200/30 dark:border-violet-800/30 shadow-xl hover:from-violet-50/90 hover:to-purple-50/80 dark:hover:from-violet-950/60 dark:hover:to-purple-950/40 hover:shadow-glow-ai hover:-translate-y-1",
        
        "ai-secondary": 
          "rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/50 dark:border-violet-800/30 shadow-sm hover:bg-violet-50/80 dark:hover:bg-violet-950/40 hover:shadow-md hover:-translate-y-0.5",
        
        "ai-suggestion": 
          "rounded-2xl bg-gradient-to-r from-violet-50/30 to-purple-50/30 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200/30 dark:border-violet-800/20 shadow-sm hover:from-violet-50/50 hover:to-purple-50/50 dark:hover:from-violet-950/30 dark:hover:to-purple-950/30 hover:shadow-md hover:-translate-y-0.5",

        // Trust & Local Variants
        "trust-primary": 
          "rounded-2xl bg-gradient-to-br from-teal-50/80 to-emerald-50/60 dark:from-teal-950/40 dark:to-emerald-950/20 border border-teal-200/30 dark:border-teal-800/30 shadow-xl hover:from-teal-50/90 hover:to-emerald-50/80 dark:hover:from-teal-950/60 dark:hover:to-emerald-950/40 hover:shadow-glow-trust hover:-translate-y-1",
        
        "trust-secondary": 
          "rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-800/30 shadow-sm hover:bg-teal-50/80 dark:hover:bg-teal-950/40 hover:shadow-md hover:-translate-y-0.5",

        // Premium Variants
        "premium-primary": 
          "rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200/30 dark:border-amber-800/30 shadow-xl hover:from-amber-50/90 hover:to-orange-50/80 dark:hover:from-amber-950/60 dark:hover:to-orange-950/40 hover:shadow-lg hover:-translate-y-1",
        
        "premium-secondary": 
          "rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 shadow-sm hover:bg-amber-50/80 dark:hover:bg-amber-950/40 hover:shadow-md hover:-translate-y-0.5",

        // Neural/Soft UI Variants
        "neural-raised": 
          "rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-neural-raised hover:shadow-neural-subtle hover:-translate-y-0.5",
        
        "neural-inset": 
          "rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-neural-inset hover:shadow-neural-subtle hover:-translate-y-0.5",
        
        "neural-floating": 
          "rounded-2xl bg-gray-50 dark:bg-gray-900 shadow-neural-raised hover:shadow-neural-raised hover:-translate-y-1 transition-all duration-300",

        // Special Effect Variants
        "glow": 
          "rounded-2xl bg-card border shadow-glow hover:shadow-glow-lg hover:-translate-y-1",
        
        "bento": 
          "rounded-2xl bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-950/90 dark:to-gray-900/80 border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm",
        
        "floating": 
          "rounded-2xl bg-card border shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-float",
      },
      
      size: {
        xs: "p-3",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
        "2xl": "p-12",
        compact: "p-2",
        none: "p-0",
      },

      interactive: {
        none: "",
        hover: "cursor-pointer",
        button: "cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      },

      loading: {
        false: "",
        true: "animate-pulse cursor-wait",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: "none",
      loading: false,
    },
  }
);

interface CardProps
  extends Omit<HTMLMotionProps<"div">, "size">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  aiThinking?: boolean;
  trustScore?: number;
  localVerified?: boolean;
  premiumTier?: "basic" | "pro" | "elite";
  urgency?: "low" | "medium" | "high" | "critical";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive,
    loading,
    asChild = false,
    aiThinking = false,
    trustScore,
    localVerified = false,
    premiumTier,
    urgency,
    children,
    ...props 
  }, ref) => {
    
    // Motion variants for sophisticated animations
    const motionVariants = {
      initial: { scale: 1, y: 0 },
      hover: { 
        scale: interactive !== "none" ? 1.02 : 1,
        y: interactive !== "none" ? -4 : 0,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }
      },
      tap: { 
        scale: interactive === "button" ? 0.98 : 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      },
    };

    const Comp = motion.div;

    return (
      <Comp
        className={cn(cardVariants({ variant, size, interactive, loading, className }))}
        ref={ref}
        variants={motionVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {/* AI Thinking State */}
        {aiThinking && (
          <div className="absolute top-3 right-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-ai-pulse" />
          </div>
        )}

        {/* Trust Score Indicator */}
        {trustScore && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              {Math.round(trustScore * 100)}%
            </span>
          </div>
        )}

        {/* Local Verification Badge */}
        {localVerified && (
          <div className="absolute top-3 left-3">
            <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Premium Tier Indicator */}
        {premiumTier && (
          <div className="absolute top-3 right-3">
            <div className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              premiumTier === "basic" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
              premiumTier === "pro" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              premiumTier === "elite" && "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300"
            )}>
              {premiumTier.toUpperCase()}
            </div>
          </div>
        )}

        {/* Urgency Indicator */}
        {urgency === "critical" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}

        {/* Loading State Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-inherit flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "relative z-10",
          loading && "opacity-50"
        )}>
          {children}
        </div>

        {/* AI Shimmer Effect for AI variants */}
        {variant?.includes("ai") && !loading && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-300/10 to-transparent animate-ai-shimmer rounded-inherit" />
          </div>
        )}

        {/* Trust Glow Effect for trust variants */}
        {variant?.includes("trust") && !loading && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-300/10 to-transparent animate-ai-shimmer rounded-inherit" />
          </div>
        )}
      </Comp>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  cardVariants,
  type CardProps 
};