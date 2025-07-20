"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "button" | "dropdown";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ 
  variant = "dropdown", 
  size = "md", 
  showLabel = false,
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }[size];

  const buttonSize = {
    sm: "sm",
    md: "default",
    lg: "lg"
  }[size] as "sm" | "default" | "lg";

  if (variant === "button") {
    return (
      <Button
        variant="ghost"
        size={buttonSize}
        onClick={toggleTheme}
        className={cn("relative overflow-hidden", className)}
        aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
      >
        <Sun className={cn(
          iconSize,
          "absolute transition-all duration-300 ease-in-out",
          resolvedTheme === "dark" 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100"
        )} />
        <Moon className={cn(
          iconSize,
          "absolute transition-all duration-300 ease-in-out",
          resolvedTheme === "dark" 
            ? "rotate-0 scale-100 opacity-100" 
            : "-rotate-90 scale-0 opacity-0"
        )} />
        {showLabel && (
          <span className="ml-2 hidden sm:inline-block">
            {resolvedTheme === "light" ? "Dark" : "Light"} Mode
          </span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={buttonSize}
          className={cn("relative overflow-hidden", className)}
          aria-label="Toggle theme"
        >
          <Sun className={cn(
            iconSize,
            "transition-all duration-300 ease-in-out",
            resolvedTheme === "dark" 
              ? "rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100"
          )} />
          <Moon className={cn(
            iconSize,
            "absolute transition-all duration-300 ease-in-out",
            resolvedTheme === "dark" 
              ? "rotate-0 scale-100 opacity-100" 
              : "-rotate-90 scale-0 opacity-0"
          )} />
          {showLabel && (
            <span className="ml-2 hidden sm:inline-block">
              Theme
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button component for quick switching
export function ThemeToggleButton({ className }: { className?: string }) {
  return (
    <ThemeToggle 
      variant="button" 
      size="md" 
      className={className}
    />
  );
}

// Compact dropdown for navigation bars
export function ThemeToggleCompact({ className }: { className?: string }) {
  return (
    <ThemeToggle 
      variant="dropdown" 
      size="sm" 
      className={className}
    />
  );
}

// Extended toggle with label for settings pages
export function ThemeToggleExtended({ className }: { className?: string }) {
  return (
    <ThemeToggle 
      variant="dropdown" 
      size="md" 
      showLabel 
      className={className}
    />
  );
}