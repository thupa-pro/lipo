"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Sparkles,
  Zap,
  Stars,
  Sunrise,
  Sunset
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "button" | "floating" | "minimal";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ 
  variant = "icon", 
  size = "md", 
  showLabel = false,
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setIsAnimating(true);
    setTheme(newTheme);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!mounted) {
    return (
      <div className={cn(
        "rounded-lg animate-pulse bg-muted",
        size === "sm" && "w-8 h-8",
        size === "md" && "w-10 h-10", 
        size === "lg" && "w-12 h-12"
      )} />
    );
  }

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  // Futuristic Icon Toggle Variant
  if (variant === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className={cn(
                "relative group transition-all duration-500 hover:scale-105 active:scale-95",
                "border border-transparent hover:border-primary/20",
                "bg-gradient-to-br from-background via-background to-muted/30",
                "hover:bg-gradient-to-br hover:from-primary/10 hover:via-background hover:to-secondary/10",
                "dark:hover:from-primary/5 dark:hover:via-background dark:hover:to-secondary/5",
                "hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10",
                "backdrop-blur-sm rounded-xl",
                sizeClasses[size],
                className
              )}
            >
              {/* Background Glow Effect */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-br from-primary/20 via-transparent to-secondary/20",
                "blur-sm scale-110"
              )} />
              
              {/* Main Icon Container */}
              <div className={cn(
                "relative z-10 flex items-center justify-center transition-all duration-500",
                isAnimating && "animate-spin"
              )}>
                {/* Light Mode Icon */}
                <Sun className={cn(
                  iconSizes[size],
                  "absolute transition-all duration-500 text-amber-500",
                  "drop-shadow-sm",
                  resolvedTheme === "dark" 
                    ? "opacity-0 scale-0 rotate-90" 
                    : "opacity-100 scale-100 rotate-0",
                  isAnimating && "animate-pulse"
                )} />
                
                {/* Dark Mode Icon */}
                <Moon className={cn(
                  iconSizes[size],
                  "absolute transition-all duration-500 text-indigo-400",
                  "drop-shadow-sm",
                  resolvedTheme === "light" 
                    ? "opacity-0 scale-0 -rotate-90" 
                    : "opacity-100 scale-100 rotate-0",
                  isAnimating && "animate-pulse"
                )} />
              </div>

              {/* Sparkle Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className={cn(
                  "w-2 h-2 absolute top-1 right-1 text-primary/60 transition-all duration-700",
                  "opacity-0 group-hover:opacity-100 animate-pulse",
                  resolvedTheme === "light" ? "delay-100" : "delay-300"
                )} />
                <Stars className={cn(
                  "w-2 h-2 absolute bottom-1 left-1 text-secondary/60 transition-all duration-700",
                  "opacity-0 group-hover:opacity-100 animate-pulse",
                  resolvedTheme === "dark" ? "delay-200" : "delay-400"
                )} />
              </div>

              {/* Ripple Effect */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 transition-opacity duration-200",
                "bg-gradient-to-br from-primary to-secondary animate-ping"
              )} />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="bg-popover/95 backdrop-blur-sm border border-border/50"
          >
            <span className="flex items-center gap-2 font-medium">
              <Palette className="w-3 h-3" />
              Switch to {resolvedTheme === "light" ? "dark" : "light"} mode
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Advanced Dropdown Variant
  if (variant === "button") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "relative group transition-all duration-500 hover:scale-105",
              "border-2 border-dashed border-primary/20 hover:border-primary/40",
              "bg-gradient-to-br from-background via-background to-muted/20",
              "hover:bg-gradient-to-br hover:from-primary/5 hover:via-background hover:to-secondary/5",
              "hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10",
              "backdrop-blur-sm rounded-2xl px-4 py-2",
              showLabel ? "gap-3" : "gap-2",
              className
            )}
          >
            {/* Icon with Advanced Animation */}
            <div className={cn(
              "relative flex items-center justify-center transition-all duration-500",
              isAnimating && "animate-spin"
            )}>
              {theme === "system" ? (
                <Monitor className={cn(iconSizes[size], "text-violet-500")} />
              ) : resolvedTheme === "light" ? (
                <Sun className={cn(iconSizes[size], "text-amber-500")} />
              ) : (
                <Moon className={cn(iconSizes[size], "text-indigo-400")} />
              )}
            </div>

            {showLabel && (
              <span className="font-medium capitalize transition-colors">
                {theme === "system" ? "Auto" : theme}
              </span>
            )}

            {/* Animated Border */}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20",
              "animate-pulse"
            )} style={{ animationDuration: "3s" }} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className={cn(
            "w-48 bg-popover/95 backdrop-blur-xl border border-border/50",
            "shadow-2xl shadow-primary/10 rounded-xl p-2"
          )}
        >
          <DropdownMenuItem
            onClick={() => handleThemeChange("light")}
            className={cn(
              "cursor-pointer rounded-lg transition-all duration-300 p-3",
              "hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10",
              theme === "light" && "bg-amber-500/10 border border-amber-500/20"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Sunrise className="w-5 h-5 text-amber-500" />
                {theme === "light" && (
                  <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-amber-400 animate-pulse" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Light Mode</span>
                <span className="text-xs text-muted-foreground">Bright and clean</span>
              </div>
              {theme === "light" && (
                <Zap className="w-3 h-3 text-amber-500 ml-auto animate-pulse" />
              )}
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleThemeChange("dark")}
            className={cn(
              "cursor-pointer rounded-lg transition-all duration-300 p-3",
              "hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10",
              theme === "dark" && "bg-indigo-500/10 border border-indigo-500/20"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Sunset className="w-5 h-5 text-indigo-400" />
                {theme === "dark" && (
                  <Stars className="w-2 h-2 absolute -top-1 -right-1 text-indigo-300 animate-pulse" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Dark Mode</span>
                <span className="text-xs text-muted-foreground">Easy on the eyes</span>
              </div>
              {theme === "dark" && (
                <Zap className="w-3 h-3 text-indigo-400 ml-auto animate-pulse" />
              )}
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleThemeChange("system")}
            className={cn(
              "cursor-pointer rounded-lg transition-all duration-300 p-3",
              "hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10",
              theme === "system" && "bg-violet-500/10 border border-violet-500/20"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Monitor className="w-5 h-5 text-violet-500" />
                {theme === "system" && (
                  <Sparkles className="w-2 h-2 absolute -top-1 -right-1 text-violet-400 animate-pulse" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">System</span>
                <span className="text-xs text-muted-foreground">Follows device setting</span>
              </div>
              {theme === "system" && (
                <Zap className="w-3 h-3 text-violet-500 ml-auto animate-pulse" />
              )}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Floating Action Button Variant
  if (variant === "floating") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleToggle}
              className={cn(
                "fixed bottom-6 right-6 z-50 transition-all duration-500 hover:scale-110 active:scale-95",
                "w-14 h-14 rounded-full shadow-2xl shadow-primary/25",
                "bg-gradient-to-br from-primary via-primary/90 to-secondary",
                "hover:shadow-3xl hover:shadow-primary/40",
                "border-2 border-white/20 dark:border-white/10",
                "group overflow-hidden",
                className
              )}
            >
              {/* Animated Background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "from-secondary via-primary to-primary animate-pulse"
              )} />
              
              {/* Icon Container */}
              <div className={cn(
                "relative z-10 transition-all duration-500",
                isAnimating && "animate-spin"
              )}>
                <Sun className={cn(
                  "w-6 h-6 absolute transition-all duration-500 text-white drop-shadow-lg",
                  resolvedTheme === "dark" 
                    ? "opacity-0 scale-0 rotate-90" 
                    : "opacity-100 scale-100 rotate-0"
                )} />
                
                <Moon className={cn(
                  "w-6 h-6 absolute transition-all duration-500 text-white drop-shadow-lg",
                  resolvedTheme === "light" 
                    ? "opacity-0 scale-0 -rotate-90" 
                    : "opacity-100 scale-100 rotate-0"
                )} />
              </div>

              {/* Orbit Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                  "absolute inset-2 border border-white/30 rounded-full",
                  "animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                )} style={{ animationDuration: "8s" }}>
                  <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="left" 
            className="bg-popover/95 backdrop-blur-sm border border-border/50"
          >
            <span className="flex items-center gap-2 font-medium">
              <Palette className="w-3 h-3" />
              Toggle theme
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Minimal Variant
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "relative transition-all duration-300 hover:bg-primary/10 rounded-full",
        sizeClasses[size],
        className
      )}
    >
      <Sun className={cn(
        iconSizes[size],
        "transition-all duration-300",
        resolvedTheme === "dark" ? "opacity-0 scale-0" : "opacity-100 scale-100"
      )} />
      <Moon className={cn(
        iconSizes[size],
        "absolute transition-all duration-300",
        resolvedTheme === "light" ? "opacity-0 scale-0" : "opacity-100 scale-100"
      )} />
    </Button>
  );
}

// Export convenient preset components
export const ThemeToggleIcon = (props: Omit<ThemeToggleProps, "variant">) => (
  <ThemeToggle variant="icon" {...props} />
);

export const ThemeToggleButton = (props: Omit<ThemeToggleProps, "variant">) => (
  <ThemeToggle variant="button" showLabel {...props} />
);

export const ThemeToggleFloating = (props: Omit<ThemeToggleProps, "variant">) => (
  <ThemeToggle variant="floating" {...props} />
);

export const ThemeToggleMinimal = (props: Omit<ThemeToggleProps, "variant">) => (
  <ThemeToggle variant="minimal" {...props} />
);
