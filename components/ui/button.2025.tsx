import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden select-none",
  {
    variants: {
      variant: {
        // Primary variants using OKLCH colors
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-emphasis hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce active:shadow-active-press rounded-button",
        
        secondary:
          "bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-secondary-emphasis hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-emphasis hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        // Contextual variants
        success:
          "bg-success text-success-foreground shadow-sm hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        warning:
          "bg-warning text-warning-foreground shadow-sm hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        // Outline variants
        outline:
          "border border-border bg-surface text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        "outline-primary":
          "border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        // Transparent variants
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        "ghost-primary":
          "text-primary hover:bg-primary/10 hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary-emphasis transition-colors duration-fast",
        
        // Modern glass morphism
        glass:
          "glass-subtle text-foreground hover:glass-medium hover:shadow-glass hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        "glass-strong":
          "glass-strong text-foreground hover:shadow-glass hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        // Neural/Soft UI
        neural:
          "neural-raised text-foreground hover:neural-subtle hover:animate-hover-lift active:neural-inset active:animate-click-bounce rounded-button",
        
        // AI-native variants
        ai:
          "bg-ai text-ai-foreground shadow-glow hover:shadow-glow-lg hover:animate-hover-lift active:animate-click-bounce rounded-button before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-ai-thinking/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-slow",
        
        "ai-thinking":
          "ai-thinking bg-ai-thinking/10 border border-ai-thinking/30 text-ai hover:bg-ai-thinking/20 rounded-button",
        
        // Premium variants  
        premium:
          "bg-premium text-premium-foreground shadow-glow hover:bg-premium-luxury hover:shadow-glow-lg hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        gradient:
          "bg-gradient-to-r from-primary via-accent to-primary bg-size-200 text-primary-foreground shadow-glow hover:bg-pos-100 hover:shadow-glow-lg hover:animate-hover-lift active:animate-click-bounce rounded-button",
        
        // Local context
        local:
          "bg-local text-local-foreground shadow-sm hover:shadow-hover-lift hover:animate-hover-lift active:animate-click-bounce rounded-button",
      },
      
      size: {
        xs: "h-7 px-2.5 text-xs gap-1 rounded-md",
        sm: "h-8 px-3 text-xs gap-1.5 rounded-lg", 
        default: "h-10 px-4 py-2 text-sm gap-2 rounded-button",
        lg: "h-11 px-6 text-base gap-2 font-semibold rounded-xl",
        xl: "h-12 px-8 text-lg gap-3 font-semibold rounded-xl",
        "2xl": "h-14 px-10 text-xl gap-3 font-bold rounded-2xl",
        
        // Icon variants
        icon: "h-10 w-10 p-0 rounded-button",
        "icon-xs": "h-7 w-7 p-0 rounded-md",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
        "icon-lg": "h-11 w-11 p-0 rounded-xl",
        "icon-xl": "h-12 w-12 p-0 rounded-xl",
      },
      
      density: {
        comfortable: "",
        compact: "h-8 px-3 text-xs",
        spacious: "h-12 px-6 text-base",
      },
      
      width: {
        auto: "",
        full: "w-full",
        fit: "w-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      density: "comfortable",
      width: "auto",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    density,
    width,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, density, width, className }),
          isDisabled && "cursor-not-allowed",
          loading && "ai-thinking"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          "flex items-center gap-2",
          loading && "opacity-0"
        )}>
          {leftIcon && (
            <span className="flex-shrink-0">
              {leftIcon}
            </span>
          )}
          
          {children}
          
          {rightIcon && (
            <span className="flex-shrink-0">
              {rightIcon}
            </span>
          )}
        </div>
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

// Additional button composition components
export const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
    attached?: boolean;
  }
>(({ className, orientation = "horizontal", attached = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex",
      orientation === "horizontal" ? "flex-row" : "flex-col",
      attached && orientation === "horizontal" && "[&>*:not(:first-child)]:ml-[-1px] [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
      attached && orientation === "vertical" && "[&>*:not(:first-child)]:mt-[-1px] [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
      !attached && "gap-2",
      className
    )}
    {...props}
  />
));

ButtonGroup.displayName = "ButtonGroup";

// Specialized button variants
export const AIButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button ref={ref} variant="ai" {...props} />
  )
);

export const GlassButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button ref={ref} variant="glass" {...props} />
  )
);

export const NeuralButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button ref={ref} variant="neural" {...props} />
  )
);

export const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button ref={ref} variant="premium" {...props} />
  )
);

AIButton.displayName = "AIButton";
GlassButton.displayName = "GlassButton"; 
NeuralButton.displayName = "NeuralButton";
PremiumButton.displayName = "PremiumButton";
