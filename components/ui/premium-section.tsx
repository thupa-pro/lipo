import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const premiumSectionVariants = cva("py-24 relative overflow-hidden", {
  variants: {
    variant: {
      default: "bg-background",
      gradient:
        "bg-gradient-to-br from-background via-ai-50 to-primary-100 dark:from-background dark:via-ai-950 dark:to-primary-950",
      dark: "bg-gray-950 text-white",
      muted: "bg-muted/30",
      accent: "bg-gradient-to-r from-ai-600 to-primary-600 text-white",
    },
    pattern: {
      none: "",
      dots: "before:absolute before:inset-0 before:dot-pattern before:opacity-20",
      grid: "before:absolute before:inset-0 before:grid-pattern before:opacity-30",
      floating:
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-ai-400/20 before:to-primary-600/20 before:rounded-full before:blur-3xl before:animate-float",
    },
  },
  defaultVariants: {
    variant: "default",
    pattern: "none",
  },
});

export interface PremiumSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof premiumSectionVariants> {
  badge?: {
    icon?: React.ComponentType<{ className?: string }>;
    text: string;
  };
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const PremiumSection = React.forwardRef<HTMLElement, PremiumSectionProps>(
  (
    {
      className,
      variant,
      pattern,
      badge,
      title,
      description,
      titleClassName,
      descriptionClassName,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(premiumSectionVariants({ variant, pattern }), className)}
        {...props}
      >
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            {badge && (
              <Badge className="badge-premium mb-6">
                {badge.icon && <badge.icon className="w-4 h-4 mr-1" />}
                {badge.text}
              </Badge>
            )}
            <h2
              className={cn(
                "text-display-lg mb-6 gradient-text",
                titleClassName,
              )}
            >
              {title}
            </h2>
            {description && (
              <p
                className={cn(
                  "text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto",
                  descriptionClassName,
                )}
              >
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </section>
    );
  },
);
PremiumSection.displayName = "PremiumSection";

export { PremiumSection };
