import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userId?: string;
  sessionId: string;
}

export interface PerformanceAlert {
  type: 'threshold' | 'anomaly' | 'error';
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  context: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  };
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeWebVitals();
    this.initializeCustomMetrics();
    this.startPerformanceObserver();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeWebVitals() {
    if (typeof window === 'undefined') return;

    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }

  private handleMetric(metric: any) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: this.getRating(metric.name, metric.value),
      timestamp: Date.now(),
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.recordMetric(performanceMetric);
    this.checkThresholds(performanceMetric);
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[name as keyof typeof this.thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private initializeCustomMetrics() {
    if (typeof window === 'undefined') return;

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.recordCustomMetric('page_load_time', loadTime);
    });

    // Track DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      this.recordCustomMetric('dom_content_loaded', domTime);
    });

    // Track resource loading
    this.trackResourceTiming();

    // Track user interactions
    this.trackUserInteractions();

    // Track memory usage
    this.trackMemoryUsage();
  }

  private startPerformanceObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          this.recordCustomMetric('dns_lookup', navEntry.domainLookupEnd - navEntry.domainLookupStart);
          this.recordCustomMetric('tcp_connection', navEntry.connectEnd - navEntry.connectStart);
          this.recordCustomMetric('ssl_negotiation', navEntry.connectEnd - navEntry.secureConnectionStart);
          this.recordCustomMetric('server_response', navEntry.responseEnd - navEntry.requestStart);
        }
      });
    });

    navObserver.observe({ entryTypes: ['navigation'] });

    // Observe paint timing
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordCustomMetric(entry.name.replace('-', '_'), entry.startTime);
      });
    });

    paintObserver.observe({ entryTypes: ['paint'] });

    // Observe long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          this.recordCustomMetric('long_task', entry.duration);
          this.createAlert('threshold', 'long_task', entry.duration, 50, 'medium');
        }
      });
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });
  }

  private trackResourceTiming() {
    if (typeof window === 'undefined') return;

    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        const loadTime = resource.responseEnd - resource.startTime;
        
        // Track different resource types
        const resourceType = this.getResourceType(resource.name);
        this.recordCustomMetric(`${resourceType}_load_time`, loadTime);

        // Alert on slow resources
        if (loadTime > 3000) {
          this.createAlert('threshold', `${resourceType}_load_time`, loadTime, 3000, 'low');
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  private trackUserInteractions() {
    if (typeof window === 'undefined') return;

    let interactionCount = 0;
    const startTime = Date.now();

    ['click', 'scroll', 'keypress'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        
        // Record interaction rate every minute
        if (interactionCount % 10 === 0) {
          const rate = interactionCount / ((Date.now() - startTime) / 1000);
          this.recordCustomMetric('interaction_rate', rate);
        }
      });
    });
  }

  private trackMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    setInterval(() => {
      const memory = (performance as any).memory;
      this.recordCustomMetric('memory_used', memory.usedJSHeapSize);
      this.recordCustomMetric('memory_total', memory.totalJSHeapSize);
      this.recordCustomMetric('memory_limit', memory.jsHeapSizeLimit);

      // Alert on high memory usage
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (usagePercent > 80) {
        this.createAlert('threshold', 'memory_usage', usagePercent, 80, 'high');
      }
    }, 30000); // Check every 30 seconds
  }

  private recordCustomMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: 'good', // Custom metrics don't have standard ratings
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.recordMetric(metric);
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Send to analytics service
    this.sendToAnalytics(metric);
    
    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private checkThresholds(metric: PerformanceMetric) {
    if (metric.rating === 'poor') {
      this.createAlert('threshold', metric.name, metric.value, 
        this.thresholds[metric.name as keyof typeof this.thresholds]?.poor || 0, 'high');
    }
  }

  private createAlert(type: PerformanceAlert['type'], metric: string, value: number, 
                     threshold: number, severity: PerformanceAlert['severity']) {
    const alert: PerformanceAlert = {
      type,
      metric,
      value,
      threshold,
      severity,
      timestamp: Date.now(),
      context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        sessionId: this.sessionId,
        userId: this.userId
      }
    };

    this.alerts.push(alert);
    this.sendAlert(alert);
  }

  private async sendToAnalytics(metric: PerformanceMetric) {
    try {
      // Send to your analytics service
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  private async sendAlert(alert: PerformanceAlert) {
    try {
      // Send to alerting service
      await fetch('/api/alerts/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Performance Alert [${alert.severity}]:`, alert);
      }
    } catch (error) {
      console.error('Failed to send performance alert:', error);
    }
  }

  // Public methods
  public setUserId(userId: string) {
    this.userId = userId;
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public getPerformanceScore(): number {
    const recentMetrics = this.metrics.filter(m => Date.now() - m.timestamp < 300000); // Last 5 minutes
    if (recentMetrics.length === 0) return 100;

    const goodMetrics = recentMetrics.filter(m => m.rating === 'good').length;
    return Math.round((goodMetrics / recentMetrics.length) * 100);
  }

  public generateReport() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      performanceScore: this.getPerformanceScore(),
      totalMetrics: this.metrics.length,
      totalAlerts: this.alerts.length,
      criticalAlerts: this.alerts.filter(a => a.severity === 'critical').length,
      averageLoadTime: this.getAverageMetric('page_load_time'),
      averageLCP: this.getAverageMetric('LCP'),
      averageFID: this.getAverageMetric('FID'),
      averageCLS: this.getAverageMetric('CLS'),
      timestamp: Date.now()
    };
  }

  private getAverageMetric(name: string): number {
    const metrics = this.metrics.filter(m => m.name === name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = getPerformanceMonitor();
  
  return {
    recordMetric: (name: string, value: number) => monitor['recordCustomMetric'](name, value),
    getScore: () => monitor.getPerformanceScore(),
    getMetrics: () => monitor.getMetrics(),
    getAlerts: () => monitor.getAlerts(),
    generateReport: () => monitor.generateReport(),
    setUserId: (userId: string) => monitor.setUserId(userId)
  };
}