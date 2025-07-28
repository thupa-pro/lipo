import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
};

interface PerformanceData {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
}

class PerformanceMonitor {
  private metrics: PerformanceData[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeCoreWebVitals();
    this.initializeResourceTiming();
    this.initializeNavigationTiming();
  }

  private initializeCoreWebVitals() {
    // Monitor Core Web Vitals
    getCLS(this.handleMetric.bind(this, 'CLS'));
    getFID(this.handleMetric.bind(this, 'FID'));
    getFCP(this.handleMetric.bind(this, 'FCP'));
    getLCP(this.handleMetric.bind(this, 'LCP'));
    getTTFB(this.handleMetric.bind(this, 'TTFB'));
  }

  private initializeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.analyzeResourceTiming(entry as PerformanceResourceTiming);
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private initializeNavigationTiming() {
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.analyzeNavigationTiming(entry as PerformanceNavigationTiming);
          }
        });
      });

      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    }
  }

  private handleMetric(metricName: string, metric: Metric) {
    const threshold = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

    if (threshold) {
      if (metric.value > threshold.poor) {
        rating = 'poor';
      } else if (metric.value > threshold.good) {
        rating = 'needs-improvement';
      }
    }

    const performanceData: PerformanceData = {
      metric: metricName,
      value: metric.value,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(performanceData);
    this.reportMetric(performanceData);
  }

  private analyzeResourceTiming(entry: PerformanceResourceTiming) {
    // Analyze slow resources
    const duration = entry.responseEnd - entry.requestStart;
    
    if (duration > 1000) { // Resources taking more than 1s
      console.warn(`Slow resource detected: ${entry.name} took ${duration}ms`);
      
      // Check for large JavaScript bundles
      if (entry.name.includes('.js') && entry.transferSize > 100000) { // 100KB
        console.warn(`Large JavaScript bundle: ${entry.name} (${entry.transferSize} bytes)`);
      }
      
      // Check for unoptimized images
      if (entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) && entry.transferSize > 500000) { // 500KB
        console.warn(`Large image: ${entry.name} (${entry.transferSize} bytes)`);
      }
    }
  }

  private analyzeNavigationTiming(entry: PerformanceNavigationTiming) {
    const metrics = {
      dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcpConnection: entry.connectEnd - entry.connectStart,
      tlsHandshake: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      ttfb: entry.responseStart - entry.requestStart,
      responseTime: entry.responseEnd - entry.responseStart,
      domProcessing: entry.domContentLoadedEventStart - entry.responseEnd,
      resourceLoading: entry.loadEventStart - entry.domContentLoadedEventStart,
    };

    // Log slow phases
    Object.entries(metrics).forEach(([phase, duration]) => {
      if (duration > 200) { // Phases taking more than 200ms
        console.warn(`Slow ${phase}: ${duration}ms`);
      }
    });
  }

  private reportMetric(data: PerformanceData) {
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to your analytics service
      // analytics.track('performance_metric', data);
    }

    // Log performance issues
    if (data.rating === 'poor') {
      console.error(`Poor ${data.metric} performance: ${data.value}ms`);
    } else if (data.rating === 'needs-improvement') {
      console.warn(`${data.metric} needs improvement: ${data.value}ms`);
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.metric]) {
        acc[metric.metric] = { good: 0, 'needs-improvement': 0, poor: 0, total: 0 };
      }
      acc[metric.metric][metric.rating]++;
      acc[metric.metric].total++;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return summary;
  }

  // Get recommendations based on performance data
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const summary = this.getPerformanceSummary();

    Object.entries(summary).forEach(([metric, data]) => {
      const poorPercentage = (data.poor / data.total) * 100;
      const needsImprovementPercentage = (data['needs-improvement'] / data.total) * 100;

      if (poorPercentage > 25) {
        switch (metric) {
          case 'LCP':
            recommendations.push('Optimize largest contentful paint by compressing images and preloading critical resources');
            break;
          case 'FID':
            recommendations.push('Reduce first input delay by minimizing JavaScript execution time');
            break;
          case 'CLS':
            recommendations.push('Improve cumulative layout shift by setting explicit dimensions for images and ads');
            break;
          case 'FCP':
            recommendations.push('Optimize first contentful paint by reducing server response time');
            break;
          case 'TTFB':
            recommendations.push('Improve time to first byte by using a CDN and optimizing server performance');
            break;
        }
      } else if (needsImprovementPercentage > 50) {
        recommendations.push(`Consider optimizing ${metric} performance`);
      }
    });

    return recommendations;
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Bundle analyzer for client-side bundle size tracking
class BundleAnalyzer {
  static analyzeChunks() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const jsChunks = entries.filter(entry => 
        entry.name.includes('.js') && 
        !entry.name.includes('node_modules')
      );

      const chunkSizes = jsChunks.map(chunk => ({
        name: chunk.name.split('/').pop() || 'unknown',
        size: chunk.transferSize,
        loadTime: chunk.responseEnd - chunk.requestStart,
      }));

      // Sort by size
      chunkSizes.sort((a, b) => b.size - a.size);

      console.table(chunkSizes);
      
      return chunkSizes;
    }
    return [];
  }

  static getUnusedCSS() {
    if ('CSS' in window && 'highlights' in CSS) {
      // Analyze unused CSS (requires browser support)
      console.log('CSS analysis not fully supported in this browser');
    }
  }
}

// Initialize performance monitoring
let performanceMonitor: PerformanceMonitor | null = null;

export const initializePerformanceMonitoring = () => {
  if (typeof window !== 'undefined' && !performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
    
    // Add window listener for unload to get final metrics
    window.addEventListener('beforeunload', () => {
      if (performanceMonitor) {
        const summary = performanceMonitor.getPerformanceSummary();
        const recommendations = performanceMonitor.getRecommendations();
        
        console.log('Performance Summary:', summary);
        console.log('Recommendations:', recommendations);
      }
    });
  }
  
  return performanceMonitor;
};

export const getPerformanceMonitor = () => performanceMonitor;

export { BundleAnalyzer };

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const monitor = initializePerformanceMonitoring();
  
  return {
    getPerformanceSummary: () => monitor?.getPerformanceSummary(),
    getRecommendations: () => monitor?.getRecommendations(),
    analyzeBundle: BundleAnalyzer.analyzeChunks,
  };
};