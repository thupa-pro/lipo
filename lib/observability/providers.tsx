"use client";

import { useEffect } from 'react';

// Simplified Observability Configuration
interface SovereignObservabilityConfig {
  environment: string;
  release: string;
  userId?: string;
  tenantId?: string;
}

// Lightweight observability provider to minimize conflicts
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
    // Skip all telemetry setup in development to reduce noise
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Observability disabled in development for cleaner logs');
      return;
    }

    // Only initialize in production with proper configuration
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && typeof window !== 'undefined') {
      // Minimal Sentry setup - only load if explicitly configured
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.init({
          dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
          environment: process.env.NODE_ENV || 'development',
          release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
          tracesSampleRate: 0.1, // Reduced sampling
          profilesSampleRate: 0.0, // Disabled profiling
          replaysSessionSampleRate: 0.0, // Disabled session replay
          beforeSend(event) {
            // Filter out OpenTelemetry and build-related errors
            if (event.exception) {
              const error = event.exception.values?.[0];
              if (error?.value?.toLowerCase().includes('opentelemetry') ||
                  error?.value?.toLowerCase().includes('require-in-the-middle') ||
                  error?.value?.toLowerCase().includes('critical dependency')) {
                return null;
              }
            }
            return event;
          },
        });

        if (userId) {
          Sentry.setUser({ id: userId });
        }
      }).catch(() => {
        // Silently fail if Sentry can't be loaded
      });
    }
  }, [userId, tenantId]);

  return <>{children}</>;
}

// Simplified tracking functions
export function trackBusinessEvent(
  eventName: string, 
  properties: Record<string, any> = {},
  userId?: string
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Business Event:', eventName, properties);
    return;
  }

  // Only track in production
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error captured:', error, context);
    return;
  }

  // Only capture in production with proper setup
  if (typeof window !== 'undefined') {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext('error_context', context);
        }
        Sentry.captureException(error);
      });
    }).catch(() => {
      // Silently fail
    });
  }
}

// Simplified performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' || typeof window === 'undefined') {
      return;
    }

    // Minimal performance monitoring for production only
    const handleLoad = () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData && window.gtag) {
        window.gtag('event', 'page_performance', {
          load_time: perfData.loadEventEnd - perfData.loadEventStart,
          dom_ready: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        });
      }
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);
}

// Health check function
export async function performHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: string;
}> {
  const checks = {
    client: true, // We're running if this function executes
    server: false,
  };

  try {
    // Simple health check
    const response = await fetch('/api/health', { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    checks.server = response.ok;
  } catch (error) {
    checks.server = false;
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

  return {
    status,
    checks,
    timestamp: new Date().toISOString(),
  };
}

export default SovereignObservabilityProvider;
