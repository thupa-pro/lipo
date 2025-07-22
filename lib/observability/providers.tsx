"use client";

import { useEffect } from 'react';
import * as Sentry from "@sentry/nextjs";
import { useRouter } from 'next/navigation';
import { sovereignEventBus, AIMarketplaceEvents } from '@/lib/events';

// Sovereign Observability Configuration
interface SovereignObservabilityConfig {
  environment: string;
  release: string;
  userId?: string;
  tenantId?: string;
}

// Initialize Sentry for Elite Platform
export function initializeSovereignSentry(config: SovereignObservabilityConfig) {
  if (typeof window === 'undefined') return;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: config.environment,
    release: config.release,
    
    // Performance Monitoring
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    
    // Session Replay for Premium Support
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    
    // Advanced Configuration
    beforeSend(event, hint) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message).toLowerCase();
          
          // Skip common browser errors
          if (message.includes('non-error promise rejection') ||
              message.includes('script error') ||
              message.includes('network error')) {
            return null;
          }
        }
      }
      
      return event;
    },
    
    beforeSendTransaction(event) {
      // Enrich transactions with business context
      if (config.userId) {
        event.user = { id: config.userId };
      }
      
      if (config.tenantId) {
        event.tags = { ...event.tags, tenantId: config.tenantId };
      }
      
      return event;
    },

    integrations: [
      // ✅ Fixed: Using correct Sentry integration for Next.js 14+
      Sentry.browserTracingIntegration({
        // ✅ Removed deprecated nextRouterInstrumentation
        tracePropagationTargets: [
          "localhost",
          /^https:\/\/.*\.loconomy\.com/,
          /^https:\/\/api\.loconomy\.com/,
        ],
      }),
      
      // Session Replay
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: true,
        maskAllInputs: true,
      }),
    ],
  });

  // Set user context
  if (config.userId) {
    Sentry.setUser({ id: config.userId });
  }

  // Set additional context
  Sentry.setContext('platform', {
    name: 'Loconomy Sovereign',
    version: config.release,
    environment: config.environment,
  });
}

// Performance Monitoring Hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          Sentry.addBreadcrumb({
            category: 'performance',
            message: `${entry.name}: ${entry.duration}ms`,
            level: 'info',
            data: {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            },
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.warn('Performance observer not supported');
    }

    // Monitor Memory Usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        
        Sentry.addBreadcrumb({
          category: 'performance',
          message: 'Memory usage snapshot',
          level: 'info',
          data: {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
          },
        });
      }
    };

    const memoryInterval = setInterval(monitorMemory, 30000); // Every 30 seconds

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, []);
}

// Error Boundary Integration
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('error_context', context);
    }
    
    scope.setTag('error_boundary', true);
    Sentry.captureException(error);
  });
}

// Business Logic Monitoring
export function trackBusinessEvent(
  eventName: string, 
  properties: Record<string, any> = {},
  userId?: string
) {
  Sentry.addBreadcrumb({
    category: 'business',
    message: eventName,
    level: 'info',
    data: properties,
  });

  // Also emit to sovereign event bus
  sovereignEventBus.emitSovereign(
    AIMarketplaceEvents.SYSTEM_HEALTH_CHECK,
    {
      eventName,
      properties,
      timestamp: new Date(),
    },
    {
      userId,
      aiContext: {
        model: 'monitoring',
        confidence: 1.0,
        intent: 'business_tracking',
      },
    }
  );
}

// API Error Tracking
export function trackAPIError(
  endpoint: string,
  method: string,
  statusCode: number,
  error: any,
  duration?: number
) {
  Sentry.withScope((scope) => {
    scope.setTag('api_error', true);
    scope.setContext('api_request', {
      endpoint,
      method,
      statusCode,
      duration,
    });
    
    scope.setLevel('error');
    Sentry.captureException(new Error(`API Error: ${endpoint}`));
  });
}

// AI Operation Monitoring
export function trackAIOperation(
  operation: string,
  model: string,
  duration: number,
  success: boolean,
  metadata?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    category: 'ai_operation',
    message: `${operation} with ${model}`,
    level: success ? 'info' : 'error',
    data: {
      operation,
      model,
      duration,
      success,
      ...metadata,
    },
  });

  // Track performance metrics
  if (typeof window !== 'undefined') {
    performance.mark(`ai_operation_${operation}_start`);
    setTimeout(() => {
      performance.mark(`ai_operation_${operation}_end`);
      performance.measure(
        `ai_operation_${operation}`,
        `ai_operation_${operation}_start`,
        `ai_operation_${operation}_end`
      );
    }, duration);
  }
}

// Sovereign Observability Provider Component
export function SovereignObservabilityProvider({ 
  children,
  userId,
  tenantId 
}: { 
  children: React.ReactNode;
  userId?: string;
  tenantId?: string;
}) {
  useEffect(() => {
    // Initialize Sentry on client side
    initializeSovereignSentry({
      environment: process.env.NODE_ENV || 'development',
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      userId,
      tenantId,
    });

    // Set up global error handlers
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      Sentry.captureException(event.reason);
    };

    const handleError = (event: ErrorEvent) => {
      Sentry.captureException(event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Monitor network connectivity
    const handleOnline = () => {
      Sentry.addBreadcrumb({
        category: 'connectivity',
        message: 'Network connection restored',
        level: 'info',
      });
    };

    const handleOffline = () => {
      Sentry.addBreadcrumb({
        category: 'connectivity',
        message: 'Network connection lost',
        level: 'warning',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [userId, tenantId]);

  usePerformanceMonitoring();

  return <>{children}</>;
}

// Health Check Function
export async function performHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: string;
}> {
  const checks = {
    database: false,
    ai_service: false,
    external_apis: false,
    cache: false,
  };

  try {
    // Check database connectivity
    const dbResponse = await fetch('/api/health/database');
    checks.database = dbResponse.ok;

    // Check AI service
    const aiResponse = await fetch('/api/health/ai');
    checks.ai_service = aiResponse.ok;

    // Check external APIs
    const externalResponse = await fetch('/api/health/external');
    checks.external_apis = externalResponse.ok;

    // Check cache
    const cacheResponse = await fetch('/api/health/cache');
    checks.cache = cacheResponse.ok;

  } catch (error) {
    Sentry.captureException(error);
  }

  const healthyCount = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  
  let status: 'healthy' | 'degraded' | 'unhealthy';
  if (healthyCount === totalChecks) {
    status = 'healthy';
  } else if (healthyCount >= totalChecks * 0.5) {
    status = 'degraded';
  } else {
    status = 'unhealthy';
  }

  const result = {
    status,
    checks,
    timestamp: new Date().toISOString(),
  };

  // Track health status
  trackBusinessEvent('health_check_performed', result);

  return result;
}

export default SovereignObservabilityProvider;