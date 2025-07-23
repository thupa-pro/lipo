import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "transition-all duration-normal ease-smooth relative overflow-hidden",
  {
    variants: {
      variant: {
        // Standard surface variants
        default:
          "bg-surface border border-border shadow-sm hover:shadow-md hover:animate-hover-lift rounded-card",
        
        elevated:
          "bg-surface-elevated border border-border shadow-md hover:shadow-lg hover:animate-hover-lift rounded-card",
        
        outline:
          "border border-border bg-transparent hover:bg-surface/50 hover:shadow-sm hover:animate-hover-lift rounded-card",
        
        // Glass morphism variants
        glass:
          "glass-subtle hover:glass-medium hover:shadow-glass hover:animate-hover-lift rounded-card",
        
        "glass-strong":
          "glass-strong hover:shadow-glass hover:animate-hover-lift rounded-card",
        
        // Neural/Soft UI variants
        neural:
          "neural-raised hover:neural-subtle hover:animate-hover-lift rounded-card",
        
        "neural-inset":
          "neural-inset hover:neural-raised hover:animate-hover-lift rounded-card",
        
        // AI-native variants
        ai:
          "ai-container hover:ai-glow hover:animate-hover-lift rounded-card",
        
        "ai-thinking":
          "ai-thinking bg-ai-thinking/5 border border-ai-thinking/20 hover:bg-ai-thinking/10 rounded-card",
        
        // Context-aware variants
        success:
          "bg-success-subtle border border-success/20 hover:border-success/30 hover:shadow-sm hover:animate-hover-lift rounded-card",
        
        warning:
          "bg-warning-subtle border border-warning/20 hover:border-warning/30 hover:shadow-sm hover:animate-hover-lift rounded-card",
        
        destructive:
          "bg-destructive-subtle border border-destructive/20 hover:border-destructive/30 hover:shadow-sm hover:animate-hover-lift rounded-card",
        
        // Premium variants
        premium:
          "bg-gradient-to-br from-premium/5 to-premium-luxury/5 border border-premium/20 shadow-glow hover:shadow-glow-lg hover:animate-hover-lift rounded-card",
        
        gradient:
          "bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border border-primary/20 hover:shadow-glow hover:animate-hover-lift rounded-card",
        
        // Interactive states
        interactive:
          "bg-surface border border-border shadow-sm hover:shadow-md hover:bg-surface-elevated hover:border-primary/20 hover:animate-hover-lift active:animate-click-bounce cursor-pointer rounded-card",
        
        clickable:
          "bg-surface border border-border shadow-sm hover:shadow-md hover:bg-accent/50 hover:animate-hover-lift active:animate-click-bounce cursor-pointer rounded-card",
      },
      
      size: {
        xs: "p-3",
        sm: "p-4", 
        default: "p-card-padding",
        lg: "p-8",
        xl: "p-10",
        "2xl": "p-12",
      },
      
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-card",
        lg: "rounded-xl", 
        xl: "rounded-2xl",
        "2xl": "rounded-3xl",
        full: "rounded-full",
      },
      
      density: {
        compact: "p-3",
        comfortable: "",
        spacious: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default", 
      radius: "default",
      density: "comfortable",
    },
  }
);

const cardHeaderVariants = cva(
  "flex flex-col space-y-1.5",
  {
    variants: {
      size: {
        xs: "pb-2",
        sm: "pb-3",
        default: "pb-6",
        lg: "pb-8", 
        xl: "pb-10",
        "2xl": "pb-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const cardContentVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      default: "text-sm",
      lg: "text-base",
      xl: "text-lg",
      "2xl": "text-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const cardFooterVariants = cva(
  "flex items-center",
  {
    variants: {
      size: {
        xs: "pt-2",
        sm: "pt-3", 
        default: "pt-6",
        lg: "pt-8",
        xl: "pt-10",
        "2xl": "pt-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, radius, density, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, radius, density }), className)}
      {...props}
    />
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size }), className)}
      {...props}
    />
  )
);

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-balance",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground text-pretty", className)}
      {...props}
    />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size }), className)}
      {...props}
    />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size }), className)}
      {...props}
    />
  )
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardFooter.displayName = "CardFooter";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

// Specialized card variants
export const GlassCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Card ref={ref} variant={variant} {...props} />
  )
);

export const NeuralCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "neural", ...props }, ref) => (
    <Card ref={ref} variant={variant} {...props} />
  )
);

export const AICard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "ai", ...props }, ref) => (
    <Card ref={ref} variant={variant} {...props} />
  )
);

export const PremiumCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "premium", ...props }, ref) => (
    <Card ref={ref} variant={variant} {...props} />
  )
);

export const InteractiveCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "interactive", ...props }, ref) => (
    <Card ref={ref} variant={variant} {...props} />
  )
);

// Complex card compositions
export interface FeatureCardProps extends CardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, badge, action, className, ...props }, ref) => (
    <Card ref={ref} className={cn("group", className)} {...props}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {badge && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mt-1">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
      {action && (
        <CardFooter>
          {action}
        </CardFooter>
      )}
    </Card>
  )
);

export interface StatCardProps extends CardProps {
  label: string;
  value: string | number;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, change, icon, className, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      <CardContent size="sm" className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
                    change.trend === "up" && "bg-success/10 text-success",
                    change.trend === "down" && "bg-destructive/10 text-destructive", 
                    change.trend === "neutral" && "bg-muted/10 text-muted-foreground"
                  )}
                >
                  {change.trend === "up" && "↗"}
                  {change.trend === "down" && "↘"}
                  {change.trend === "neutral" && "→"}
                  {change.value}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className="flex-shrink-0 w-8 h-8 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
);

GlassCard.displayName = "GlassCard";
NeuralCard.displayName = "NeuralCard";
AICard.displayName = "AICard";
PremiumCard.displayName = "PremiumCard";
InteractiveCard.displayName = "InteractiveCard";
FeatureCard.displayName = "FeatureCard";
StatCard.displayName = "StatCard";
