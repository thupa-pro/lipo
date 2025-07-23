import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        glass:
          "border-glass-border bg-glass backdrop-blur-glass text-foreground hover:bg-glass-strong",
        premium:
          "border-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm hover:shadow-md",
        ai:
          "border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 text-blue-700 dark:text-blue-300",
        success:
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
        warning:
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        neural:
          "border-transparent bg-neutral-200 dark:bg-neutral-800 text-foreground shadow-neural",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
