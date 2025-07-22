import * as React from "react";
import { cva, type, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassmorphismCardVariants = cva(
  "relative overflow-hidden rounded-2xl transition-all duration-500 group",
  {
    variants: {
      variant: {
        default:
          "backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15",
        frosted:
          "backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl hover:shadow-3xl hover:bg-white/10",
        premium:
          "backdrop-blur-3xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 shadow-2xl hover:shadow-3xl hover:from-white/25 hover:to-white/10",
        neon: "backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 shadow-xl hover:shadow-blue-500/25 hover:shadow-2xl",
        dark: "backdrop-blur-xl bg-black/20 border border-white/10 shadow-xl hover:shadow-2xl hover:bg-black/25",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      glow: {
        none: "",
        subtle:
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        medium:
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/10 before:via-purple-500/10 before:to-pink-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        strong:
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  },
);

export interface GlassmorphismCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassmorphismCardVariants> {
  hover?: boolean;
  animated?: boolean;
}

const GlassmorphismCard = React.forwardRef<
  HTMLDivElement,
  GlassmorphismCardProps
>(
  (
    {
      className,
      variant,
      size,
      glow,
      hover = true,
      animated = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassmorphismCardVariants({ variant, size, glow }),
          {
            "hover:scale-105 hover:-translate-y-2": hover && animated,
            "transform-gpu": animated,
          },
          className,
        )}
        {...props}
      >
        {/* Animated background gradient */}
        {animated && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);
GlassmorphismCard.displayName = "GlassmorphismCard";

const GlassmorphismCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-6", className)}
    {...props}
  />
));
GlassmorphismCardHeader.displayName = "GlassmorphismCardHeader";

const GlassmorphismCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-white drop-shadow-lg",
      className,
    )}
    {...props}
  />
));
GlassmorphismCardTitle.displayName = "GlassmorphismCardTitle";

const GlassmorphismCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-white/80 leading-relaxed drop-shadow-md",
      className,
    )}
    {...props}
  />
));
GlassmorphismCardDescription.displayName = "GlassmorphismCardDescription";

const GlassmorphismCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
GlassmorphismCardContent.displayName = "GlassmorphismCardContent";

const GlassmorphismCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
GlassmorphismCardFooter.displayName = "GlassmorphismCardFooter";

export {
  GlassmorphismCard,
  GlassmorphismCardHeader,
  GlassmorphismCardFooter,
  GlassmorphismCardTitle,
  GlassmorphismCardDescription,
  GlassmorphismCardContent,
};
