"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Activity,
  TrendingUp, AlertTriangle,
  X,
  Monitor,
  Smartphone,
  Wifi,
  Image,
  Code,
  Database,
  BarChart3,
  Gauge
} from "lucide-react";

interface PerformanceOptimizerProps {
  onComplete?: (score: number) => void;
}

interface PerformanceMetrics {
  fcp: number; // First, Contentful Paint
  lcp: number; // Largest, Contentful Paint
  fid: number; // First, Input Delay
  cls: number; // Cumulative, Layout Shift
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
}

interface OptimizationSuggestion {
  category: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "easy" | "moderate" | "hard";
  savings: string;
  status: "pending" | "applied" | "ignored";
}

export function PerformanceOptimizer({
  onComplete,
}: PerformanceOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lighthouseScore, setLighthouseScore] = useState(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);

  const runPerformanceAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate performance analysis
    const steps = [
      { progress: 15, delay: 800, message: "Analyzing Core Web Vitals..." },
      { progress: 30, delay: 1000, message: "Checking resource loading..." },
      {
        progress: 50,
        delay: 900,
        message: "Evaluating JavaScript performance...",
      },
      { progress: 70, delay: 700, message: "Analyzing network efficiency..." },
      {
        progress: 90,
        delay: 600,
        message: "Generating optimization suggestions...",
      },
      { progress: 100, delay: 500, message: "Analysis complete!" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setProgress(step.progress);
    }

    // Mock performance metrics
    const mockMetrics: PerformanceMetrics = {
      fcp: 1.2, // Good: < 1.8s
      lcp: 2.1, // Needs improvement: 2.5-4.0s
      fid: 85, // Good: < 100ms
      cls: 0.08, // Needs improvement: 0.1-0.25
      ttfb: 420, // Good: < 600ms
      tti: 3.2, // Needs improvement: 3.8-7.3s
    };

    const mockSuggestions: OptimizationSuggestion[] = [
      {
        category: "Images",
        title: "Optimize images",
        description:
          "Compress and convert images to modern formats (WebP, AVIF)",
        impact: "high",
        effort: "easy",
        savings: "1.2s faster load time",
        status: "pending",
      },
      {
        category: "JavaScript",
        title: "Remove unused JavaScript",
        description: "Eliminate unused code to reduce bundle size",
        impact: "medium",
        effort: "moderate",
        savings: "320KB bundle reduction",
        status: "pending",
      },
      {
        category: "CSS",
        title: "Inline critical CSS",
        description: "Inline above-the-fold CSS to eliminate render-blocking",
        impact: "medium",
        effort: "moderate",
        savings: "0.8s faster rendering",
        status: "pending",
      },
      {
        category: "Fonts",
        title: "Preload key fonts",
        description: "Use font-display: swap and preload critical fonts",
        impact: "low",
        effort: "easy",
        savings: "0.3s faster text display",
        status: "pending",
      },
      {
        category: "Caching",
        title: "Implement service worker",
        description: "Cache resources for faster repeat visits",
        impact: "high",
        effort: "hard",
        savings: "2.1s faster repeat loads",
        status: "pending",
      },
      {
        category: "Network",
        title: "Enable compression",
        description: "Use Gzip/Brotli compression for text resources",
        impact: "medium",
        effort: "easy",
        savings: "180KB transfer reduction",
        status: "pending",
      },
    ];

    setMetrics(mockMetrics);
    setSuggestions(mockSuggestions);

    // Calculate Lighthouse score based on metrics
    const score = calculateLighthouseScore(mockMetrics);
    setLighthouseScore(score);

    setIsAnalyzing(false);
    onComplete?.(score);
  };

  const calculateLighthouseScore = (metrics: PerformanceMetrics): number => {
    // Simplified Lighthouse scoring algorithm
    let score = 0;

    // FCP (10% weight)
    if (metrics.fcp <= 1.8) score += 10;
    else if (metrics.fcp <= 3.0) score += 5;

    // LCP (25% weight)
    if (metrics.lcp <= 2.5) score += 25;
    else if (metrics.lcp <= 4.0) score += 15;

    // FID (10% weight)
    if (metrics.fid <= 100) score += 10;
    else if (metrics.fid <= 300) score += 5;

    // CLS (25% weight)
    if (metrics.cls <= 0.1) score += 25;
    else if (metrics.cls <= 0.25) score += 15;

    // TTI (10% weight)
    if (metrics.tti <= 3.8) score += 10;
    else if (metrics.tti <= 7.3) score += 5;

    // TTFB (5% weight)
    if (metrics.ttfb <= 600) score += 5;
    else if (metrics.ttfb <= 1500) score += 2;

    // General optimizations (15% weight)
    score += 10; // Base score for having metrics

    return Math.min(100, score);
  };

  const getMetricStatus = (metric: string, value: number) => {
    const thresholds: Record<
      string,
      { good: number; poor: number; unit: string }
    > = {
      fcp: { good: 1.8, poor: 3.0, unit: "s" },
      lcp: { good: 2.5, poor: 4.0, unit: "s" },
      fid: { good: 100, poor: 300, unit: "ms" },
      cls: { good: 0.1, poor: 0.25, unit: "" },
      ttfb: { good: 600, poor: 1500, unit: "ms" },
      tti: { good: 3.8, poor: 7.3, unit: "s" },
    };

    const threshold = thresholds[metric];
    if (!threshold) return { status: "unknown", color: "gray" };

    if (value <= threshold.good) {
      return { status: "good", color: "green" };
    } else if (value <= threshold.poor) {
      return { status: "needs-improvement", color: "yellow" };
    } else {
      return { status: "poor", color: "red" };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const applySuggestion = (index: number) => {
    setSuggestions((prev) =>
      prev.map((suggestion, i) =>
        i === index ? { ...suggestion, status: "applied" } : suggestion,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Performance Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Performance Optimizer
            </CardTitle>
            <Button
              onClick={runPerformanceAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Analyzing performance...
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          ) : lighthouseScore > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-3xl font-bold ${getScoreColor(lighthouseScore)}`}
                  >
                    {lighthouseScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getScoreLabel(lighthouseScore)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Lighthouse Score</div>
                  <Badge
                    variant={lighthouseScore >= 90 ? "default" : "secondary"}
                  >
                    Target: 95+
                  </Badge>
                </div>
              </div>
              <Progress value={lighthouseScore} className="w-full" />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                Run performance analysis to identify optimization opportunities
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Core Web Vitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  key: "fcp",
                  label: "First Contentful Paint",
                  value: metrics.fcp,
                  unit: "s",
                },
                {
                  key: "lcp",
                  label: "Largest Contentful Paint",
                  value: metrics.lcp,
                  unit: "s",
                },
                {
                  key: "fid",
                  label: "First Input Delay",
                  value: metrics.fid,
                  unit: "ms",
                },
                {
                  key: "cls",
                  label: "Cumulative Layout Shift",
                  value: metrics.cls,
                  unit: "",
                },
                {
                  key: "ttfb",
                  label: "Time to First Byte",
                  value: metrics.ttfb,
                  unit: "ms",
                },
                {
                  key: "tti",
                  label: "Time to Interactive",
                  value: metrics.tti,
                  unit: "s",
                },
              ].map((metric) => {
                const status = getMetricStatus(metric.key, metric.value);
                return (
                  <div key={metric.key} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {metric.label}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full bg-${status.color}-500`}
                      />
                    </div>
                    <div className="text-2xl font-bold">
                      {metric.value}
                      {metric.unit}
                    </div>
                    <div
                      className={`text-xs text-${status.color}-600 capitalize`}
                    >
                      {status.status.replace("-", " ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <Badge
                          variant="outline"
                          className={getImpactColor(suggestion.impact)}
                        >
                          {suggestion.impact} impact
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getEffortColor(suggestion.effort)}
                        >
                          {suggestion.effort}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                      <div className="text-sm font-medium text-green-600">
                        Potential savings: {suggestion.savings}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {suggestion.status === "applied" ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Applied
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(index)}
                        >
                          Apply Fix
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <Monitor className="w-6 h-6 mb-2" />
                  Desktop Analysis
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Smartphone className="w-6 h-6 mb-2" />
                  Mobile Analysis
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Wifi className="w-6 h-6 mb-2" />
                  Network Analysis
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Real User Monitoring</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Track actual user performance metrics
                  </p>
                  <Button size="sm" variant="outline">
                    Enable RUM
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Synthetic Monitoring</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automated performance testing
                  </p>
                  <Button size="sm" variant="outline">
                    Setup Tests
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex-col">
                  <Image className="w-6 h-6 mb-2" />
                  Image Optimization
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Code className="w-6 h-6 mb-2" />
                  Code Splitting
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Database className="w-6 h-6 mb-2" />
                  Caching Strategy
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Loading Performance</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Optimize Critical Rendering Path</li>
                <li>• Minimize First Input Delay</li>
                <li>• Reduce Time to Interactive</li>
                <li>• Implement efficient caching</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Runtime Performance</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Minimize Cumulative Layout Shift</li>
                <li>• Optimize JavaScript execution</li>
                <li>• Reduce main thread blocking</li>
                <li>• Implement efficient animations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
