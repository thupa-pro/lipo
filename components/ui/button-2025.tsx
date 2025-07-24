import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden will-change-transform",
  {
    variants: {
      variant: {
        // Core Variants
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        
        link: "text-primary underline-offset-4 hover:underline",

        // AI-Native Variants
        "ai-primary":
          "bg-gradient-to-r from-violet-500 via-purple-600 to-violet-500 bg-size-200 text-white shadow-lg hover:bg-pos-100 hover:shadow-violet-500/25 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        
        "ai-secondary":
          "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 hover:border-violet-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200",
        
        "ai-suggestion":
          "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200/50 hover:from-violet-100 hover:to-purple-100 hover:border-violet-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",

        // Trust & Local Variants
        "trust-primary":
          "bg-gradient-to-r from-teal-500 via-cyan-600 to-teal-500 bg-size-200 text-white shadow-lg hover:bg-pos-100 hover:shadow-teal-500/25 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]",
        
        "trust-secondary":
          "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 hover:border-teal-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",

        // Premium Variants
        "premium-primary":
          "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-size-200 text-white shadow-lg hover:bg-pos-100 hover:shadow-amber-500/25 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]",
        
        "premium-secondary":
          "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",

        // Glass Variants
        "glass-subtle":
          "backdrop-blur-md bg-white/60 border border-white/20 text-gray-900 hover:bg-white/80 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-glass",
        
        "glass-medium":
          "backdrop-blur-lg bg-white/80 border border-white/30 text-gray-900 hover:bg-white/90 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-glass",
        
        "glass-strong":
          "backdrop-blur-xl bg-white/90 border border-white/40 text-gray-900 hover:bg-white/95 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-glass-lg",

        // Neural/Soft UI Variants
        "neural-raised":
          "bg-gray-100 dark:bg-gray-800 text-foreground shadow-neural-raised hover:shadow-neural-subtle hover:-translate-y-0.5 active:shadow-neural-inset active:translate-y-0 active:scale-[0.98]",
        
        "neural-inset":
          "bg-gray-100 dark:bg-gray-800 text-foreground shadow-neural-inset hover:shadow-neural-subtle hover:-translate-y-0.5 active:shadow-neural-raised active:translate-y-0 active:scale-[0.98]",

        // Special Effect Variants
        "glow":
          "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]",
        
        "shimmer":
          "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-size-200 text-white shadow-lg hover:bg-pos-100 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
      },
      
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md gap-1",
        sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
        default: "h-9 px-4 py-2 rounded-xl gap-2",
        lg: "h-11 px-6 text-base font-semibold rounded-xl gap-2.5",
        xl: "h-12 px-8 text-lg font-semibold rounded-2xl gap-3",
        "2xl": "h-14 px-10 text-xl font-bold rounded-2xl gap-3",
        icon: "h-9 w-9 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-11 w-11 rounded-xl",
        "icon-xl": "h-12 w-12 rounded-2xl",
      },

      intent: {
        default: "",
        urgent: "animate-pulse",
        success: "animate-bounce",
        loading: "cursor-wait",
        thinking: "animate-ai-thinking",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      intent: "default",
    },
  }
);

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "size">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  success?: boolean;
  aiConfidence?: number;
  localContext?: "neighborhood" | "city" | "region";
  urgency?: "low" | "medium" | "high" | "critical";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    intent,
    asChild = false, 
    loading = false,
    success = false,
    aiConfidence,
    localContext,
    urgency,
    children,
    disabled,
    ...props 
  }, ref) => {
    
    // Determine intent based on props
    const computedIntent = React.useMemo(() => {
      if (loading) return "loading";
      if (success) return "success";
      if (urgency === "critical") return "urgent";
      if (variant?.includes("ai") && aiConfidence && aiConfidence < 0.7) return "thinking";
      return intent;
    }, [loading, success, urgency, variant, aiConfidence, intent]);

    // Motion variants for sophisticated animations
    const motionVariants = {
      initial: { scale: 1 },
      hover: { 
        scale: 1.02,
        y: -2,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      },
      tap: { 
        scale: 0.98,
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 600, 
          damping: 30 
        }
      },
    };

    const Comp = asChild ? Slot : motion.button;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, intent: computedIntent, className }))}
        ref={ref}
        disabled={disabled || loading}
        variants={motionVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {success && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 text-green-500">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        <span className={cn(
          "relative z-10 flex items-center gap-2",
          (loading || success) && "opacity-0"
        )}>
          {children}
        </span>

        {/* AI Confidence Indicator */}
        {aiConfidence && variant?.includes("ai") && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 transition-all duration-300"
              style={{ width: `${aiConfidence * 100}%` }}
            />
          </div>
        )}

        {/* Local Context Indicator */}
        {localContext && variant?.includes("trust") && (
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-current opacity-60" />
        )}

        {/* Urgency Indicator */}
        {urgency === "critical" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };