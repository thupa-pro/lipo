"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Sparkles, 
  Shield, 
  Crown, 
  Glasses, 
  Brain,
  ChevronDown,
  Check
} from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Badge } from "./badge";

export type ThemeVariant = 'glass' | 'ai' | 'trust' | 'premium' | 'neural';

interface ThemeConfig {
  id: ThemeVariant;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  colors: string[];
  isPremium?: boolean;
}

const themeConfigs: ThemeConfig[] = [
  {
    id: 'glass',
    name: 'Glass Morphism',
    description: 'Modern translucent interface',
    icon: Glasses,
    colors: ['#ffffff80', '#ffffff90', '#ffffff95'],
  },
  {
    id: 'ai',
    name: 'AI Neural',
    description: 'Sophisticated AI-driven design',
    icon: Sparkles,
    colors: ['#8b5cf6', '#a855f7', '#c084fc'],
    isPremium: true,
  },
  {
    id: 'trust',
    name: 'Trust & Local',
    description: 'Community-focused trustworthy',
    icon: Shield,
    colors: ['#14b8a6', '#0d9488', '#0f766e'],
  },
  {
    id: 'premium',
    name: 'Premium Luxury',
    description: 'High-end service excellence',
    icon: Crown,
    colors: ['#f59e0b', '#d97706', '#b45309'],
    isPremium: true,
  },
  {
    id: 'neural',
    name: 'Neural Soft UI',
    description: 'Subtle tactile interface',
    icon: Brain,
    colors: ['#f0f0f0', '#e8e8e8', '#d8d8d8'],
  },
];

interface ThemeSwitcherProps {
  currentTheme?: ThemeVariant;
  onThemeChange?: (theme: ThemeVariant) => void;
  className?: string;
  showLabel?: boolean;
}

export function ThemeSwitcher({ 
  currentTheme = 'glass', 
  onThemeChange,
  className = "",
  showLabel = false 
}: ThemeSwitcherProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeVariant>(currentTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('loconomy-theme') as ThemeVariant;
    if (savedTheme && themeConfigs.find(t => t.id === savedTheme)) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: ThemeVariant) => {
    if (typeof window === 'undefined') return;

    // Remove all theme classes
    const body = document.body;
    themeConfigs.forEach(config => {
      body.classList.remove(`theme-${config.id}`);
    });

    // Add the new theme class
    body.classList.add(`theme-${theme}`);
    
    // Store in localStorage
    localStorage.setItem('loconomy-theme', theme);
    
    // Trigger theme change callback
    onThemeChange?.(theme);
  };

  const handleThemeChange = (theme: ThemeVariant) => {
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  const currentConfig = themeConfigs.find(t => t.id === selectedTheme) || themeConfigs[0];

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 ${showLabel ? 'w-auto px-3' : 'w-9 p-0'} glass-interactive neural-button focus-visible-ring ${className}`}
        >
          <currentConfig.icon className="h-4 w-4" />
          {showLabel && (
            <>
              <span className="ml-2 hidden sm:inline">{currentConfig.name}</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 glass-ultra border border-glass-border-strong shadow-glass-lg animate-spring-in"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Design System Themes</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-2 space-y-1">
          {themeConfigs.map((theme) => (
            <DropdownMenuItem key={theme.id} asChild>
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange(theme.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 focus-visible-ring"
              >
                {/* Theme Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${theme.id === 'ai' ? 'bg-gradient-to-br from-purple-500 to-blue-500' :
                    theme.id === 'trust' ? 'bg-gradient-to-br from-teal-500 to-cyan-500' :
                    theme.id === 'premium' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                    theme.id === 'neural' ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                    'bg-gradient-to-br from-white to-gray-200'
                  } shadow-md
                `}>
                  <theme.icon className="h-5 w-5 text-white" />
                </div>

                {/* Theme Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{theme.name}</span>
                    {theme.isPremium && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {theme.description}
                  </p>
                </div>

                {/* Color Preview */}
                <div className="flex gap-1">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Selection Indicator */}
                <AnimatePresence>
                  {selectedTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        
        <div className="p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Theme changes apply instantly across the entire application
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook for using theme context
export function useThemeVariant() {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>('glass');

  useEffect(() => {
    const savedTheme = localStorage.getItem('loconomy-theme') as ThemeVariant;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  return {
    currentTheme,
    setTheme: setCurrentTheme,
    themeConfig: themeConfigs.find(t => t.id === currentTheme) || themeConfigs[0],
  };
}
