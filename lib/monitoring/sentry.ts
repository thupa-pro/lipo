import * as Sentry from '@sentry/nextjs';
import { CaptureConsole } from '@sentry/integrations';
import React from 'react';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  route?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceContext {
  route: string;
  component?: string;
  operation: string;
  duration?: number;
  metadata?: Record<string, any>;
}

class AdvancedSentryService {
  private initialized = false;
  private environment = process.env.NODE_ENV || 'development';
  private release = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown';

  constructor() {
    this.initializeSentry();
  }

  private initializeSentry() {
    if (this.initialized) return;

    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) {
      console.warn('Sentry DSN not found. Error tracking disabled.');
      return;
    }

    Sentry.init({
      dsn,
      environment: this.environment,
      release: this.release,
      
      // Performance monitoring
      tracesSampleRate: this.environment === 'production' ? 0.1 : 1.0,
      
      // Session tracking
      autoSessionTracking: true,
      
      // Enhanced integrations
      integrations: [
        // Capture console errors and warnings
        new CaptureConsole({
          levels: ['error', 'warn'],
        }),
      ],

      // Custom error filtering
      beforeSend: (event, hint) => {
        return this.filterError(event, hint);
      },

      // Custom performance event filtering
      beforeSendTransaction: (event) => {
        return this.filterPerformanceEvent(event);
      },

      // Enhanced error context
      initialScope: {
        tags: {
          component: 'loconomy-platform',
          version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        },
        contexts: {
          app: {
            name: 'Loconomy',
            version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
          },
          device: {
            family: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
          },
        },
      },

      // Debug mode in development
      debug: this.environment === 'development',
      
      // Capture unhandled promise rejections
      captureUnhandledRejections: true,
      
      // Maximum breadcrumbs
      maxBreadcrumbs: 100,
      
      // Attach stack traces to messages
      attachStacktrace: true,

      // Custom transport for additional processing
      transport: this.environment === 'production' 
        ? undefined 
        : this.createCustomTransport(),
    });

    this.initialized = true;
    this.setupGlobalErrorHandlers();
    this.setupPerformanceMonitoring();
  }

  private filterError(event: Sentry.Event, hint: Sentry.EventHint): Sentry.Event | null {
    // Filter out known non-critical errors
    const ignoredErrors = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'ChunkLoadError',
      'Loading chunk',
      'Network request failed',
    ];

    const errorMessage = event.exception?.values?.[0]?.value || '';
    if (ignoredErrors.some(ignored => errorMessage.includes(ignored))) {
      return null;
    }

    // Add custom context
    if (typeof window !== 'undefined') {
      event.contexts = {
        ...event.contexts,
        browser: {
          name: navigator.userAgent,
          version: navigator.appVersion,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        url: {
          full: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
        },
      };
    }

    return event;
  }

  private filterPerformanceEvent(event: Sentry.Event): Sentry.Event | null {
    // Filter out very fast transactions (likely not meaningful)
    if (event.start_timestamp && event.timestamp) {
      const duration = (event.timestamp - event.start_timestamp) * 1000;
      if (duration < 10) { // Less than 10ms
        return null;
      }
    }

    // Add custom performance context
    if (event.transaction) {
      event.tags = {
        ...event.tags,
        route_type: this.categorizeRoute(event.transaction),
      };
    }

    return event;
  }

  private categorizeRoute(route: string): string {
    if (route.includes('/api/')) return 'api';
    if (route.includes('/auth/')) return 'auth';
    if (route.includes('/dashboard/')) return 'dashboard';
    if (route.includes('/provider/')) return 'provider';
    if (route.includes('/customer/')) return 'customer';
    if (route.includes('/admin/')) return 'admin';
    return 'public';
  }

  private createCustomTransport() {
    return (options: any) => {
      // Custom transport for development - could log to console, file, etc.
      console.group('🔍 Sentry Event');
      console.log('Event:', options);
      console.groupEnd();
      
      // Still send to Sentry
      return Sentry.getDefaultIntegrations().find(i => i.name === 'HttpTransport')?.(options);
    };
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Enhanced unhandled error tracking
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        component: 'global-error-handler',
        action: 'unhandled-error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          message: event.message,
        },
      });
    });

    // Enhanced unhandled promise rejection tracking
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        component: 'global-error-handler',
        action: 'unhandled-promise-rejection',
        metadata: {
          promise: event.promise,
          reason: event.reason,
        },
      });
    });

    // Track resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        this.captureMessage(`Resource failed to load: ${target.tagName}`, 'warning', {
          component: 'resource-loader',
          action: 'resource-load-error',
          metadata: {
            tagName: target.tagName,
            src: (target as any).src || (target as any).href,
            outerHTML: target.outerHTML?.substring(0, 200),
          },
        });
      }
    }, true);
  }

  private setupPerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            this.capturePerformanceIssue('long-task', {
              route: window.location.pathname,
              operation: 'long-task',
              duration: entry.duration,
              metadata: {
                entryType: entry.entryType,
                startTime: entry.startTime,
              },
            });
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }

      // Monitor layout shifts
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if ((entry as any).value > 0.1) { // CLS threshold
            this.capturePerformanceIssue('layout-shift', {
              route: window.location.pathname,
              operation: 'layout-shift',
              metadata: {
                value: (entry as any).value,
                sources: (entry as any).sources,
              },
            });
          }
        });
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Layout shift API not supported
      }
    }

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usagePercent > 80) {
          this.capturePerformanceIssue('high-memory-usage', {
            route: window.location.pathname,
            operation: 'memory-check',
            metadata: {
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit,
              usagePercent,
            },
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Public API methods
  public captureError(error: Error, context?: ErrorContext): string {
    return Sentry.withScope((scope) => {
      if (context) {
        if (context.userId) scope.setUser({ id: context.userId });
        if (context.sessionId) scope.setTag('sessionId', context.sessionId);
        if (context.route) scope.setTag('route', context.route);
        if (context.component) scope.setTag('component', context.component);
        if (context.action) scope.setTag('action', context.action);
        if (context.metadata) {
          Object.entries(context.metadata).forEach(([key, value]) => {
            scope.setContext(key, value);
          });
        }
      }

      return Sentry.captureException(error);
    });
  }

  public captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: ErrorContext): string {
    return Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      if (context) {
        if (context.userId) scope.setUser({ id: context.userId });
        if (context.sessionId) scope.setTag('sessionId', context.sessionId);
        if (context.route) scope.setTag('route', context.route);
        if (context.component) scope.setTag('component', context.component);
        if (context.action) scope.setTag('action', context.action);
        if (context.metadata) {
          Object.entries(context.metadata).forEach(([key, value]) => {
            scope.setContext(key, value);
          });
        }
      }

      return Sentry.captureMessage(message);
    });
  }

  public capturePerformanceIssue(name: string, context: PerformanceContext): void {
    Sentry.withScope((scope) => {
      scope.setTag('performance_issue', name);
      scope.setTag('route', context.route);
      if (context.component) scope.setTag('component', context.component);
      if (context.operation) scope.setTag('operation', context.operation);
      if (context.duration) scope.setContext('timing', { duration: context.duration });
      if (context.metadata) {
        Object.entries(context.metadata).forEach(([key, value]) => {
          scope.setContext(key, value);
        });
      }

      Sentry.captureMessage(`Performance issue: ${name}`, 'warning');
    });
  }

  public startTransaction(name: string, operation: string = 'navigation'): Sentry.Transaction {
    return Sentry.startTransaction({ name, op: operation });
  }

  public setUserContext(user: { id: string; email?: string; role?: string }): void {
    Sentry.setUser(user);
  }

  public addBreadcrumb(message: string, category: string = 'custom', level: Sentry.SeverityLevel = 'info', data?: any): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
  }

  public setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  public setContext(key: string, context: any): void {
    Sentry.setContext(key, context);
  }

  // Business logic specific methods
  public captureAPIError(endpoint: string, method: string, status: number, error: Error, context?: any): string {
    return this.captureError(error, {
      component: 'api-client',
      action: 'api-request-failed',
      route: endpoint,
      metadata: {
        endpoint,
        method,
        status,
        ...context,
      },
    });
  }

  public captureAuthError(action: string, error: Error, context?: any): string {
    return this.captureError(error, {
      component: 'auth-system',
      action,
      metadata: context,
    });
  }

  public capturePaymentError(paymentId: string, error: Error, context?: any): string {
    return this.captureError(error, {
      component: 'payment-system',
      action: 'payment-failed',
      metadata: {
        paymentId,
        ...context,
      },
    });
  }

  public captureBookingError(bookingId: string, error: Error, context?: any): string {
    return this.captureError(error, {
      component: 'booking-system',
      action: 'booking-failed',
      metadata: {
        bookingId,
        ...context,
      },
    });
  }

  // Performance tracking for specific operations
  public trackPageLoad(route: string, loadTime: number): void {
    this.capturePerformanceIssue('page-load', {
      route,
      operation: 'page-load',
      duration: loadTime,
    });
  }

  public trackAPICall(endpoint: string, method: string, duration: number, status: number): void {
    if (duration > 5000) { // Slow API call threshold
      this.capturePerformanceIssue('slow-api-call', {
        route: endpoint,
        operation: 'api-call',
        duration,
        metadata: {
          method,
          status,
        },
      });
    }
  }

  public trackComponentRender(componentName: string, renderTime: number): void {
    if (renderTime > 100) { // Slow render threshold
      this.capturePerformanceIssue('slow-component-render', {
        route: typeof window !== 'undefined' ? window.location.pathname : '',
        component: componentName,
        operation: 'component-render',
        duration: renderTime,
      });
    }
  }

  // Health check and diagnostics
  public async healthCheck(): Promise<boolean> {
    try {
      // Test if Sentry is properly configured
      const eventId = this.captureMessage('Sentry health check', 'debug');
      return !!eventId;
    } catch (error) {
      console.error('Sentry health check failed:', error);
      return false;
    }
  }

  public getLastEventId(): string | undefined {
    return Sentry.lastEventId();
  }

  public showReportDialog(): void {
    Sentry.showReportDialog();
  }
}

// Singleton instance
let sentryService: AdvancedSentryService | null = null;

export function getSentryService(): AdvancedSentryService {
  if (!sentryService) {
    sentryService = new AdvancedSentryService();
  }
  return sentryService;
}

// React hook for Sentry integration
export function useSentry() {
  const sentry = getSentryService();
  
  return {
    captureError: sentry.captureError.bind(sentry),
    captureMessage: sentry.captureMessage.bind(sentry),
    captureAPIError: sentry.captureAPIError.bind(sentry),
    captureAuthError: sentry.captureAuthError.bind(sentry),
    capturePaymentError: sentry.capturePaymentError.bind(sentry),
    captureBookingError: sentry.captureBookingError.bind(sentry),
    trackPageLoad: sentry.trackPageLoad.bind(sentry),
    trackAPICall: sentry.trackAPICall.bind(sentry),
    trackComponentRender: sentry.trackComponentRender.bind(sentry),
    setUserContext: sentry.setUserContext.bind(sentry),
    addBreadcrumb: sentry.addBreadcrumb.bind(sentry),
    startTransaction: sentry.startTransaction.bind(sentry),
  };
}

// Utility functions
export function withSentryErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ComponentType<any>;
    beforeCapture?: (scope: Sentry.Scope) => void;
  }
) {
  return Sentry.withErrorBoundary(Component, {
    fallback: options?.fallback || DefaultErrorFallback,
    beforeCapture: options?.beforeCapture,
  });
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We've been notified about this issue and are working to fix it.
          </p>
          <button
            onClick={resetError}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
