import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const premiumCardVariants = cva(
  "rounded-xl border transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "card-glass bg-card text-card-foreground interactive-hover",
        glass: "card-glass-ai interactive-hover",
        gradient:
          "card-glass-premium interactive-hover",
        elevated:
          "card-glass shadow-xl hover:shadow-2xl border-border/50 interactive-hover",
        glow: "card-glass-ai border-primary/20 interactive-glow",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface PremiumCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumCardVariants> {
  hover?: boolean;
  glow?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (
    {
      className,
      variant,
      size,
      hover = true,
      glow = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          premiumCardVariants({ variant, size }),
          {
            "hover:scale-105": hover,
            "animate-morphic-glow": glow,
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
PremiumCard.displayName = "PremiumCard";

const PremiumCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-6", className)}
    {...props}
  />
));
PremiumCardHeader.displayName = "PremiumCardHeader";

const PremiumCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold leading-none tracking-tight", className)}
    {...props}
  />
));
PremiumCardTitle.displayName = "PremiumCardTitle";

const PremiumCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
PremiumCardDescription.displayName = "PremiumCardDescription";

const PremiumCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
PremiumCardContent.displayName = "PremiumCardContent";

const PremiumCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
PremiumCardFooter.displayName = "PremiumCardFooter";

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardFooter,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
};
