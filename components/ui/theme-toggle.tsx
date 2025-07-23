"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor, Palette, Zap } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return <ThemeToggleContent />;
}

function ThemeToggleContent() {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();

  const themes = [
    {
      key: "light",
      label: "Light",
      icon: Sun,
      description: "Clean and bright interface",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      key: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      key: "system",
      label: "System",
      icon: Monitor,
      description: "Follows your device setting",
      gradient: "from-slate-500 to-slate-700",
    },
  ];

  const currentTheme = themes.find(t => t.key === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <CurrentIcon className="h-4 w-4 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            
            {/* Subtle glow effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentTheme.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`} />
          </motion.div>
          
          {/* Active theme indicator */}
          <motion.div
            className="absolute -bottom-0.5 left-1/2 w-1 h-1 bg-blue-500 rounded-full"
            initial={{ scale: 0, x: "-50%" }}
            animate={{ scale: 1, x: "-50%" }}
            transition={{ delay: 0.1 }}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl"
      >
        <div className="px-2 py-2 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Theme
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your interface style
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-200/50 dark:bg-slate-700/50" />

        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          const isActive = theme === themeOption.key;
          
          return (
            <DropdownMenuItem
              key={themeOption.key}
              onClick={() => setTheme(themeOption.key as any)}
              className={`
                relative p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isActive 
                    ? `bg-gradient-to-r ${themeOption.gradient} shadow-lg` 
                    : 'bg-slate-100 dark:bg-slate-800'
                  }
                `}>
                  <IconComponent className={`
                    w-5 h-5 transition-colors duration-200
                    ${isActive 
                      ? 'text-white' 
                      : 'text-slate-600 dark:text-slate-400'
                    }
                  `} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`
                      text-sm font-medium transition-colors duration-200
                      ${isActive 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-slate-700 dark:text-slate-300'
                      }
                    `}>
                      {themeOption.label}
                    </p>
                    
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {themeOption.description}
                  </p>
                </div>

                {/* Active theme indicator */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
                  />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="my-2 bg-slate-200/50 dark:bg-slate-700/50" />

        {/* Quick toggle button */}
        <DropdownMenuItem
          onClick={toggleTheme}
          className="p-3 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Quick Toggle
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between light and dark
              </p>
            </div>
          </div>
        </DropdownMenuItem>

        {/* Current resolved theme info */}
        <div className="px-3 py-2 mt-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Currently using <span className="font-medium text-slate-700 dark:text-slate-300">{resolvedTheme}</span> theme
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
