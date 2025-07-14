import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const premiumButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-pink-700 hover:scale-105 active:scale-95",
        outline:
          "border-2 border-slate-200 bg-white/80 backdrop-blur-sm text-slate-900 shadow-md hover:bg-white hover:border-slate-300 hover:shadow-lg hover:scale-105 active:scale-95",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 shadow-md hover:from-slate-200 hover:to-slate-300 hover:shadow-lg hover:scale-105 active:scale-95",
        ghost:
          "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 backdrop-blur-sm hover:scale-105 active:scale-95",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 hover:scale-105 active:scale-95",
        premium:
          "bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:via-blue-700 hover:to-purple-700 hover:scale-110 active:scale-95 font-semibold",
        neon: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 hover:scale-105 active:scale-95",
        glass:
          "backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-xl hover:bg-white/20 hover:shadow-2xl hover:scale-105 active:scale-95",
        success:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 hover:scale-105 active:scale-95",
        gradient:
          "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:via-pink-600 hover:to-red-600 hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-13 px-8 py-3 text-base",
        xl: "h-15 px-10 py-4 text-lg",
        icon: "h-11 w-11",
      },
      glow: {
        none: "",
        subtle: "shadow-lg",
        medium: "shadow-xl shadow-current/25",
        strong: "shadow-2xl shadow-current/40",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        shimmer:
          "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        ripple:
          "relative overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-white/20 before:scale-0 hover:before:scale-100 before:transition-transform before:duration-500 before:ease-out",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
      animation: "none",
    },
  },
);

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      animation,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          premiumButtonVariants({ variant, size, glow, animation }),
          {
            "cursor-not-allowed opacity-50": loading || disabled,
            "pointer-events-none": loading,
          },
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-current/20 backdrop-blur-sm">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {/* Shimmer effect for premium variants */}
        {(variant === "premium" || variant === "gradient") && !loading && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        )}

        {/* Content */}
        <div
          className={cn(
            "relative z-10 flex items-center gap-2",
            loading && "opacity-0",
          )}
        >
          {leftIcon && (
            <span className="transition-transform duration-200 group-hover:scale-110">
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span className="transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Ripple effect overlay */}
        {animation === "ripple" && (
          <div className="absolute inset-0 rounded-xl bg-white/10 scale-0 group-active:scale-100 transition-transform duration-150 ease-out" />
        )}
      </Comp>
    );
  },
);
PremiumButton.displayName = "PremiumButton";

export { PremiumButton, premiumButtonVariants };
