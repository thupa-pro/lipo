"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { initializePerformanceMonitoring } from '@/lib/performance/monitor';
import { useCommonIcons } from '@/lib/icons/optimized-icons';

interface PerformanceContextType {
  isMonitoring: boolean;
  performanceScore: number | null;
  recommendations: string[];
}

const PerformanceContext = createContext<PerformanceContextType>({
  isMonitoring: false,
  performanceScore: null,
  recommendations: [],
});

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [isMonitoring, setIsMonitoring] = React.useState(false);
  const [performanceScore, setPerformanceScore] = React.useState<number | null>(null);
  const [recommendations, setRecommendations] = React.useState<string[]>([]);

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const monitor = initializePerformanceMonitoring();
      setIsMonitoring(true);

      // Get initial performance data after a short delay
      const timer = setTimeout(() => {
        if (monitor) {
          const summary = monitor.getPerformanceSummary();
          const recs = monitor.getRecommendations();
          
          // Calculate a simple performance score
          const totalMetrics = Object.values(summary).reduce((acc, metric) => acc + metric.total, 0);
          const goodMetrics = Object.values(summary).reduce((acc, metric) => acc + metric.good, 0);
          const score = totalMetrics > 0 ? Math.round((goodMetrics / totalMetrics) * 100) : null;
          
          setPerformanceScore(score);
          setRecommendations(recs);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Preload common icons for better performance
  useCommonIcons();

  // Preload critical resources
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload critical images
      const criticalImages = [
        '/images/hero-bg.webp',
        '/images/logo.svg',
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Preload critical fonts
      const criticalFonts = [
        '/fonts/inter-regular.woff2',
        '/fonts/inter-medium.woff2',
        '/fonts/inter-semibold.woff2',
      ];

      criticalFonts.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = '';
        link.href = src;
        document.head.appendChild(link);
      });
    }
  }, []);

  // Performance budget monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor long tasks (> 50ms)
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
            // In production, you might want to report this to analytics
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // longtask not supported in this browser
      }

      // Monitor layout shifts
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.value > 0.1) {
            console.warn(`Layout shift detected: ${entry.value}`);
          }
        });
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // layout-shift not supported in this browser
      }

      return () => {
        longTaskObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  const contextValue: PerformanceContextType = {
    isMonitoring,
    performanceScore,
    recommendations,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}