import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm",
        glass:
          "h-10 rounded-button bg-glass border border-glass-border backdrop-blur-glass px-3 py-2 text-base shadow-glass focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-glass-strong focus-visible:shadow-glow md:text-sm",
        premium:
          "h-12 rounded-xl bg-glass border border-glass-border backdrop-blur-glass px-4 py-3 text-base shadow-glass focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-glass-strong focus-visible:shadow-glow",
        neural:
          "h-10 rounded-button bg-neutral-200 dark:bg-neutral-800 px-3 py-2 text-base shadow-neural focus-visible:animate-neural-glow md:text-sm",
        floating:
          "h-12 rounded-xl bg-glass border border-glass-border backdrop-blur-glass px-4 pt-4 pb-2 text-base shadow-glass focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-glass-strong focus-visible:shadow-glow",
        minimal:
          "h-10 border-0 border-b-2 border-input bg-transparent px-0 py-2 text-base rounded-none focus-visible:ring-0 focus-visible:border-primary",
        ai:
          "h-10 rounded-button bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/50 px-3 py-2 text-base shadow-lg focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:shadow-glow-primary md:text-sm",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
        xl: "h-14 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, label, error, icon, iconPosition = "left", loading, ...props }, ref) => {
    const hasIcon = icon || loading;

    return (
      <div className="relative w-full">
        {hasIcon && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10 text-muted-foreground",
              iconPosition === "left" ? "left-3" : "right-3",
              loading && "animate-spin"
            )}
          >
            {loading ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              icon
            )}
          </div>
        )}

        <input
          type={type}
          className={cn(
            inputVariants({ variant, size }),
            hasIcon && iconPosition === "left" && "pl-10",
            hasIcon && iconPosition === "right" && "pr-10",
            error && "border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />

        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Floating Label Input Component
interface FloatingInputProps extends InputProps {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, variant = "floating", ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    return (
      <div className="relative">
        <input
          className={cn(
            inputVariants({ variant }),
            className
          )}
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value !== '');
          }}
          onChange={(e) => {
            setHasValue(e.target.value !== '');
            props.onChange?.(e);
          }}
          placeholder=" "
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none text-muted-foreground",
            (focused || hasValue)
              ? "top-2 text-xs text-primary transform scale-85 origin-left"
              : "top-1/2 transform -translate-y-1/2 text-base"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

// Glass Input Variant
const GlassInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Input ref={ref} variant={variant} {...props} />
  )
);
GlassInput.displayName = "GlassInput";

// Premium Input Variant
const PremiumInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "premium", ...props }, ref) => (
    <Input ref={ref} variant={variant} {...props} />
  )
);
PremiumInput.displayName = "PremiumInput";

// AI Input Variant
const AIInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "ai", ...props }, ref) => (
    <Input ref={ref} variant={variant} {...props} />
  )
);
AIInput.displayName = "AIInput";

export {
  Input,
  inputVariants,
  FloatingInput,
  GlassInput,
  PremiumInput,
  AIInput
}
