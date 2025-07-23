import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 rounded-button",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 rounded-button",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 rounded-button",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 rounded-button",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0 rounded-button",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 text-white shadow-glow hover:bg-pos-100 hover:shadow-glow-lg hover:-translate-y-1 active:translate-y-0 rounded-button before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        glass:
          "bg-glass border border-glass-border backdrop-blur-glass text-foreground shadow-glass hover:bg-glass-strong hover:shadow-glass-lg hover:-translate-y-0.5 active:translate-y-0 rounded-glass",
        neural:
          "bg-neutral-200 dark:bg-neutral-800 text-foreground shadow-neural hover:animate-neural-glow active:shadow-neural-lg rounded-button",
        ai:
          "bg-gradient-ai text-white shadow-glow-primary hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0 rounded-button before:absolute before:inset-0 before:bg-shimmer before:bg-size-200 before:animate-shimmer before:opacity-0 hover:before:opacity-100",
        gradient:
          "bg-gradient-premium text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 rounded-button",
        "glass-dark":
          "bg-glass-black border border-glass-border-dark backdrop-blur-glass text-foreground shadow-glass hover:bg-glass-black-md hover:shadow-glass-lg hover:-translate-y-0.5 active:translate-y-0 rounded-glass",
      },
      size: {
        xs: "h-8 px-3 text-xs rounded-md",
        sm: "h-9 px-4 text-xs rounded-lg",
        default: "h-10 px-4 py-2 rounded-button",
        lg: "h-12 px-8 text-base font-semibold rounded-xl",
        xl: "h-14 px-10 text-lg font-semibold rounded-2xl",
        "2xl": "h-16 px-12 text-xl font-bold rounded-2xl",
        icon: "h-10 w-10 rounded-button",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// Additional button component variations
const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "premium", size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        <span className="absolute inset-0 rounded-button bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Comp>
    );
  },
);
PremiumButton.displayName = "PremiumButton";

const GlassButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "glass", size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
GlassButton.displayName = "GlassButton";

const AIButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "ai", size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
AIButton.displayName = "AIButton";

export { Button, buttonVariants, PremiumButton, GlassButton, AIButton };
