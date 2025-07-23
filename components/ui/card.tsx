import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "relative transition-all duration-300 text-card-foreground",
  {
    variants: {
      variant: {
        default: "rounded-card border bg-card shadow-sm hover:shadow-md",
        glass: "rounded-glass bg-glass border border-glass-border backdrop-blur-glass shadow-glass hover:bg-glass-strong hover:shadow-glass-lg hover:-translate-y-1",
        premium: "rounded-glass bg-glass border border-glass-border backdrop-blur-glass shadow-glass hover:bg-glass-strong hover:shadow-premium hover:-translate-y-2 before:absolute before:inset-0 before:rounded-glass before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        neural: "rounded-card bg-neutral-200 dark:bg-neutral-800 shadow-neural hover:animate-neural-glow",
        elevated: "rounded-card bg-card border shadow-lg hover:shadow-xl hover:-translate-y-1",
        floating: "rounded-glass bg-glass border border-glass-border backdrop-blur-glass shadow-glass-lg hover:shadow-premium hover:-translate-y-2 animate-float",
        bento: "rounded-glass bg-glass border border-glass-border backdrop-blur-glass shadow-glass transition-all duration-300 hover:bg-glass-strong hover:shadow-glass-lg hover:-translate-y-1",
        ai: "rounded-card bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-glow-primary hover:-translate-y-1",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
        compact: "p-3",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  interactive?: boolean;
  loading?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, loading, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size }),
        interactive && "cursor-pointer hover-lift",
        loading && "animate-pulse",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "compact" | "centered";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      variant === "default" && "p-6",
      variant === "compact" && "p-4 space-y-1",
      variant === "centered" && "p-6 text-center items-center",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "default" | "lg" | "xl";
    gradient?: boolean;
  }
>(({ className, size = "default", gradient, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight",
      size === "sm" && "text-lg",
      size === "default" && "text-2xl",
      size === "lg" && "text-3xl",
      size === "xl" && "text-4xl",
      gradient && "text-gradient",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "default" | "lg";
  }
>(({ className, size = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-muted-foreground",
      size === "sm" && "text-xs",
      size === "default" && "text-sm",
      size === "lg" && "text-base",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "padded" | "compact" | "none";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      variant === "default" && "p-6 pt-0",
      variant === "padded" && "p-8 pt-0",
      variant === "compact" && "p-4 pt-0",
      variant === "none" && "pt-0",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "compact" | "centered" | "spaced";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center pt-0",
      variant === "default" && "p-6 pt-0",
      variant === "compact" && "p-4 pt-0",
      variant === "centered" && "p-6 pt-0 justify-center",
      variant === "spaced" && "p-6 pt-0 justify-between",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Premium Card Variants
const GlassCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", ...props }, ref) => (
    <Card ref={ref} className={className} variant={variant} {...props} />
  )
)
GlassCard.displayName = "GlassCard"

const PremiumCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "premium", ...props }, ref) => (
    <Card ref={ref} className={className} variant={variant} {...props} />
  )
)
PremiumCard.displayName = "PremiumCard"

const BentoCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "bento", ...props }, ref) => (
    <Card ref={ref} className={className} variant={variant} {...props} />
  )
)
BentoCard.displayName = "BentoCard"

const AICard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "ai", ...props }, ref) => (
    <Card ref={ref} className={className} variant={variant} {...props} />
  )
)
AICard.displayName = "AICard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
  GlassCard,
  PremiumCard,
  BentoCard,
  AICard
}
