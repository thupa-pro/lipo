"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Wifi,
  Signal,
  Battery,
  Gauge,
  TrendingUp,
  AlertTriangle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceMetrics {
  fps: number;
  loadTime: number;
  memoryUsage: number;
  networkSpeed: number;
  coreWebVitals: {
    lcp: number; // Largest, Contentful Paint
    fid: number; // First, Input Delay
    cls: number; // Cumulative Layout Shift
  };
  score: number;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  className?: string;
}

export function PerformanceMonitor({
  showDetails = false,
  className,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    loadTime: 0,
    memoryUsage: 0,
    networkSpeed: 0,
    coreWebVitals: { lcp: 0, fid: 0, cls: 0 },
    score: 95,
  });
  const [isVisible, setIsVisible] = useState(showDetails);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const frameCount = useRef(0);
  const startTime = useRef(Date.now());
  const animationFrame = useRef<number>();

  useEffect(() => {
    measureInitialMetrics();
    startPerformanceMonitoring();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const measureInitialMetrics = () => {
    // Measure initial load performance
    if ("performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;

      setMetrics((prev) => ({
        ...prev,
        loadTime,
      }));
    }

    // Measure memory usage (if available)
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      const memoryUsage =
        (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;

      setMetrics((prev) => ({
        ...prev,
        memoryUsage,
      }));
    }

    // Measure Core Web Vitals
    measureCoreWebVitals();
  };

  const measureCoreWebVitals = () => {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      setMetrics((prev) => ({
        ...prev,
        coreWebVitals: {
          ...prev.coreWebVitals,
          lcp: lastEntry.startTime,
        },
      }));
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics((prev) => ({
          ...prev,
          coreWebVitals: {
            ...prev.coreWebVitals,
            fid: entry.processingStart - entry.startTime,
          },
        }));
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setMetrics((prev) => ({
            ...prev,
            coreWebVitals: {
              ...prev.coreWebVitals,
              cls: clsValue,
            },
          }));
        }
      }
    }).observe({ entryTypes: ["layout-shift"] });
  };

  const startPerformanceMonitoring = () => {
    setIsMonitoring(true);
    frameCount.current = 0;
    startTime.current = Date.now();

    const measureFPS = () => {
      frameCount.current++;

      const now = Date.now();
      const elapsed = now - startTime.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / elapsed);

        setMetrics((prev) => ({
          ...prev,
          fps,
        }));

        frameCount.current = 0;
        startTime.current = now;
      }

      animationFrame.current = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Simulate network speed measurement
    const measureNetworkSpeed = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setMetrics((prev) => ({
          ...prev,
          networkSpeed: connection.downlink || 0,
        }));
      }
    };

    measureNetworkSpeed();
    setInterval(measureNetworkSpeed, 5000);
  };

  const calculateScore = () => {
    let score = 100;

    // FPS scoring
    if (metrics.fps < 30) score -= 30;
    else if (metrics.fps < 50) score -= 15;
    else if (metrics.fps < 55) score -= 5;

    // Core Web Vitals scoring
    if (metrics.coreWebVitals.lcp > 4000) score -= 20;
    else if (metrics.coreWebVitals.lcp > 2500) score -= 10;

    if (metrics.coreWebVitals.fid > 300) score -= 20;
    else if (metrics.coreWebVitals.fid > 100) score -= 10;

    if (metrics.coreWebVitals.cls > 0.25) score -= 20;
    else if (metrics.coreWebVitals.cls > 0.1) score -= 10;

    // Memory usage scoring
    if (metrics.memoryUsage > 90) score -= 15;
    else if (metrics.memoryUsage > 75) score -= 8;

    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  const currentScore = calculateScore();

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 z-50 rounded-full w-12 h-12 p-0 bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Gauge className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-24 right-4 z-50 w-80 border-0 shadow-2xl",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Performance</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("px-2 py-1", getScoreColor(currentScore))}>
              {currentScore}/100
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="w-6 h-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-bold",
                  getScoreColor(currentScore),
                )}
              >
                {currentScore}
              </span>
              {currentScore >= 90 ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {getScoreBadge(currentScore)} performance
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium">FPS</span>
            </div>
            <span
              className={cn(
                "text-lg font-bold",
                metrics.fps >= 55
                  ? "text-emerald-600"
                  : metrics.fps >= 30
                    ? "text-yellow-600"
                    : "text-red-600",
              )}
            >
              {metrics.fps}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium">Load Time</span>
            </div>
            <span className="text-lg font-bold text-emerald-600">
              {(metrics.loadTime / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium">Memory</span>
            </div>
            <span
              className={cn(
                "text-lg font-bold",
                metrics.memoryUsage < 75
                  ? "text-emerald-600"
                  : metrics.memoryUsage < 90
                    ? "text-yellow-600"
                    : "text-red-600",
              )}
            >
              {metrics.memoryUsage.toFixed(0)}%
            </span>
          </div>

          <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <div className="flex items-center gap-2 mb-1">
              <Wifi className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium">Network</span>
            </div>
            <span className="text-lg font-bold text-orange-600">
              {metrics.networkSpeed.toFixed(1)} Mbps
            </span>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Core Web Vitals
          </h4>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
              <div className="font-medium">LCP</div>
              <div
                className={cn(
                  "font-bold",
                  metrics.coreWebVitals.lcp <= 2500
                    ? "text-emerald-600"
                    : metrics.coreWebVitals.lcp <= 4000
                      ? "text-yellow-600"
                      : "text-red-600",
                )}
              >
                {(metrics.coreWebVitals.lcp / 1000).toFixed(1)}s
              </div>
            </div>

            <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
              <div className="font-medium">FID</div>
              <div
                className={cn(
                  "font-bold",
                  metrics.coreWebVitals.fid <= 100
                    ? "text-emerald-600"
                    : metrics.coreWebVitals.fid <= 300
                      ? "text-yellow-600"
                      : "text-red-600",
                )}
              >
                {metrics.coreWebVitals.fid.toFixed(0)}ms
              </div>
            </div>

            <div className="text-center p-2 rounded bg-gray-50 dark:bg-gray-800">
              <div className="font-medium">CLS</div>
              <div
                className={cn(
                  "font-bold",
                  metrics.coreWebVitals.cls <= 0.1
                    ? "text-emerald-600"
                    : metrics.coreWebVitals.cls <= 0.25
                      ? "text-yellow-600"
                      : "text-red-600",
                )}
              >
                {metrics.coreWebVitals.cls.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Real-time monitoring active</span>
        </div>
      </CardContent>
    </Card>
  );
}
