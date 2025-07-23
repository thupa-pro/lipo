import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full transition-all duration-normal ease-smooth file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-surface border border-border text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-border/80",
        
        filled:
          "bg-muted border-0 text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        
        outline:
          "bg-transparent border border-border text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-border/80",
        
        // Glass morphism variants
        glass:
          "glass-subtle text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:glass-medium",
        
        // Neural/Soft UI variants  
        neural:
          "neural-inset text-foreground rounded-input focus-visible:neural-subtle focus-visible:ring-0",
        
        // AI-native variants
        ai:
          "bg-ai/5 border border-ai/20 text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2 focus-visible:bg-ai/10",
        
        "ai-enhanced":
          "bg-surface border border-border text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2 hover:border-ai/30 relative ai-thinking",
        
        // Context variants
        success:
          "bg-surface border border-success/30 text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2",
        
        warning:
          "bg-surface border border-warning/30 text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2",
        
        destructive:
          "bg-surface border border-destructive/30 text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
        
        // Premium variants
        premium:
          "bg-gradient-to-r from-premium/5 to-premium-luxury/5 border border-premium/20 text-foreground rounded-input focus-visible:ring-2 focus-visible:ring-premium focus-visible:ring-offset-2 focus-visible:shadow-glow",
      },
      
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-input-x py-input-y text-sm",
        lg: "h-11 px-4 text-base",
        xl: "h-12 px-5 text-lg",
      },
      
      density: {
        compact: "h-8 px-3 text-xs",
        comfortable: "",
        spacious: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default", 
      density: "comfortable",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  aiSuggestions?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    density,
    type = "text",
    leftIcon,
    rightIcon,
    loading = false,
    aiSuggestions = false,
    error,
    success,
    helperText,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    
    // Auto-detect variant based on state
    const computedVariant = React.useMemo(() => {
      if (error) return "destructive";
      if (success) return "success";
      if (aiSuggestions) return "ai-enhanced";
      return variant;
    }, [variant, error, success, aiSuggestions]);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };
    
    return (
      <div className="space-y-2">
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          {/* Input field */}
          <input
            ref={ref}
            type={type}
            className={cn(
              inputVariants({ variant: computedVariant, size, density }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              (loading || aiSuggestions) && "pr-12",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          
          {/* Right icon or loading state */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-muted-foreground" />
            )}
            
            {aiSuggestions && !loading && (
              <div className="w-4 h-4 rounded-full bg-ai/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-ai animate-ai-pulse" />
              </div>
            )}
            
            {rightIcon && !loading && !aiSuggestions && (
              <div className="text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
          
          {/* Focus indicator for AI-enhanced inputs */}
          {computedVariant === "ai-enhanced" && isFocused && (
            <div className="absolute inset-0 rounded-input bg-gradient-to-r from-transparent via-ai/10 to-transparent animate-ai-thinking pointer-events-none" />
          )}
        </div>
        
        {/* Helper text, error, or success messages */}
        {(helperText || error || success) && (
          <div className="space-y-1">
            {error && (
              <p className="text-xs text-destructive font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                </span>
                {error}
              </p>
            )}
            
            {success && (
              <p className="text-xs text-success font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                </span>
                {success}
              </p>
            )}
            
            {helperText && !error && !success && (
              <p className="text-xs text-muted-foreground">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };

// Specialized input variants
export const GlassInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Input ref={ref} variant={variant} {...props} />
  )
);

export const NeuralInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "neural", ...props }, ref) => (
    <Input ref={ref} variant={variant} {...props} />
  )
);

export const AIInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "ai", aiSuggestions = true, ...props }, ref) => (
    <Input ref={ref} variant={variant} aiSuggestions={aiSuggestions} {...props} />
  )
);

export const PremiumInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "premium", ...props }, ref) => (
    <Input ref={ref} variant={variant} {...props} />
  )
);

// Input composition components
export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ label, required, children, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
    </div>
  )
);

export interface SearchInputProps extends Omit<InputProps, "type"> {
  onSearch?: (query: string) => void;
  suggestions?: string[];
  clearable?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, suggestions, clearable = true, ...props }, ref) => {
    const [value, setValue] = React.useState("");
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setShowSuggestions(newValue.length > 0 && suggestions && suggestions.length > 0);
      props.onChange?.(e);
    };
    
    const handleSearch = () => {
      onSearch?.(value);
      setShowSuggestions(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
      props.onKeyDown?.(e);
    };
    
    const handleClear = () => {
      setValue("");
      setShowSuggestions(false);
      if (ref && "current" in ref && ref.current) {
        ref.current.focus();
      }
    };
    
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          rightIcon={
            value && clearable ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : undefined
          }
          {...props}
        />
        
        {/* Search suggestions */}
        {showSuggestions && suggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setValue(suggestion);
                  setShowSuggestions(false);
                  onSearch?.(suggestion);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
NeuralInput.displayName = "NeuralInput"; 
AIInput.displayName = "AIInput";
PremiumInput.displayName = "PremiumInput";
InputGroup.displayName = "InputGroup";
SearchInput.displayName = "SearchInput";
