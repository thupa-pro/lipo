"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    variant?: "default" | "glass" | "premium" | "ai";
  }
>(({ className, sideOffset = 4, variant = "default", ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-tooltip overflow-hidden px-3 py-1.5 text-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      variant === "default" && "rounded-md border bg-popover text-popover-foreground shadow-md",
      variant === "glass" && "rounded-lg bg-glass border border-glass-border backdrop-blur-glass text-foreground shadow-glass",
      variant === "premium" && "rounded-lg bg-glass border border-glass-border backdrop-blur-glass text-foreground shadow-glass-lg",
      variant === "ai" && "rounded-lg bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/40 dark:to-purple-950/40 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md text-foreground shadow-glow-primary",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
