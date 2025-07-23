"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ThemeToggle,
  ThemeToggleIcon,
  ThemeToggleButton,
  ThemeToggleFloating,
  ThemeToggleMinimal 
} from "@/components/ui/theme-toggle";
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Stars,
  Crown,
  Gem
} from "lucide-react";

export default function ThemeShowcasePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Hero Header */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Elite UI Components • Theme System
            </span>
            <Palette className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Futuristic
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Theme Toggle
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the most advanced dark/light mode toggle with
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              premium animations{" "}
            </span>
            and futuristic design.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Icon Variant */}
          <Card className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Icon Toggle</CardTitle>
                    <CardDescription className="text-lg">Compact and elegant</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 relative z-10">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center gap-4">
                  <ThemeToggleIcon size="sm" />
                  <ThemeToggleIcon size="md" />
                  <ThemeToggleIcon size="lg" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Hover and click to see beautiful animations with glow effects, sparkles, and smooth transitions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Button Variant */}
          <Card className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Dropdown Button</CardTitle>
                    <CardDescription className="text-lg">Full control with options</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  <Gem className="w-3 h-3 mr-1" />
                  Elite
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 relative z-10">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center gap-4">
                  <ThemeToggleButton size="sm" />
                  <ThemeToggleButton size="md" />
                  <ThemeToggleButton size="lg" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Advanced dropdown with light, dark, and system options. Features beautiful gradients and micro-animations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minimal Variant */}
          <Card className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Stars className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Minimal</CardTitle>
                    <CardDescription className="text-lg">Clean and simple</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                  Clean
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 relative z-10">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center gap-4">
                  <ThemeToggleMinimal size="sm" />
                  <ThemeToggleMinimal size="md" />
                  <ThemeToggleMinimal size="lg" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Simplified version for minimalist designs while maintaining smooth icon transitions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Features</CardTitle>
                  <CardDescription className="text-lg">What makes it special</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <span className="text-sm">Smooth 500ms animations with easing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  <span className="text-sm">Sparkle and glow effects on hover</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse" />
                  <span className="text-sm">Accessible with tooltips and ARIA labels</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm">Integrates with existing theme system</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse" />
                  <span className="text-sm">Multiple variants for different use cases</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse" />
                  <span className="text-sm">Premium visual feedback and micro-interactions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                Usage Examples
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-300">
              See how easy it is to implement in your components
            </p>
          </div>

          <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl">Implementation</CardTitle>
              <CardDescription className="text-lg">Simple imports and usage</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Quick Start</h3>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 text-sm font-mono">
                    <div className="text-blue-600 dark:text-blue-400">import</div>
                    <div className="ml-2">{"{ ThemeToggleIcon }"}</div>
                    <div className="text-blue-600 dark:text-blue-400 ml-2">from</div>
                    <div className="ml-2 text-green-600 dark:text-green-400">"@/components/ui/theme-toggle"</div>
                    <br />
                    <div className="text-purple-600 dark:text-purple-400">{"<ThemeToggleIcon />"}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Advanced Usage</h3>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 text-sm font-mono">
                    <div className="text-purple-600 dark:text-purple-400">{"<ThemeToggleButton"}</div>
                    <div className="ml-2 text-amber-600 dark:text-amber-400">size="lg"</div>
                    <div className="ml-2 text-amber-600 dark:text-amber-400">showLabel</div>
                    <div className="ml-2 text-amber-600 dark:text-amber-400">className="my-class"</div>
                    <div className="text-purple-600 dark:text-purple-400">{"/>"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Performance Note */}
        <Card className="bg-gradient-to-br from-violet-50 via-purple-50/30 to-indigo-50 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-indigo-950/20 border-violet-200/50 dark:border-violet-800/30 rounded-3xl shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-violet-900 dark:text-violet-100">
                  Performance Optimized
                </h3>
                <p className="text-violet-700 dark:text-violet-300">
                  Built with performance and accessibility in mind
                </p>
              </div>
            </div>
            
            <Separator className="my-6 bg-violet-200 dark:bg-violet-800" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">0ms</div>
                <div className="text-sm text-violet-700 dark:text-violet-300">Initial render delay</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">500ms</div>
                <div className="text-sm text-violet-700 dark:text-violet-300">Smooth animations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">100%</div>
                <div className="text-sm text-violet-700 dark:text-violet-300">Accessibility compliant</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Theme Toggle Demo */}
      <ThemeToggleFloating />
    </div>
  );
}
