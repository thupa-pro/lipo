import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function initializeSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    // Environment configuration
    environment: process.env.NODE_ENV || 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    
    // Performance monitoring
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    
    // Integrations for comprehensive monitoring
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration(),
      Sentry.requestDataIntegration(),
      Sentry.nodeContextIntegration(),
    ],
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out development noise
      if (process.env.NODE_ENV === 'development') {
        console.log('🐛 Sentry Event:', event);
      }
      
      // Filter out known non-critical errors
      const error = hint.originalException;
      if (error instanceof Error) {
        // Skip network errors that are user-related
        if (error.message.includes('fetch failed') || 
            error.message.includes('NetworkError')) {
          return null;
        }
        
        // Skip authentication errors (handled by UI)
        if (error.message.includes('UNAUTHORIZED') || 
            error.message.includes('JWT')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Performance event filtering
    beforeSendTransaction(event) {
      // Skip health check transactions
      if (event.transaction?.includes('/api/health')) {
        return null;
      }
      
      return event;
    },
    
    // Tags for better organization
    tags: {
      component: 'loconomy-platform',
      feature: 'ai-first-ux',
    },
    
    // Initial scope configuration
    initialScope: {
      tags: {
        platform: 'loconomy',
        version: '2.0.0',
      },
    },
  });
}

// Custom error reporting utilities
export class ErrorReporter {
  static reportUserError(error: Error, userId?: string, context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'user_action');
      scope.setLevel('error');
      
      if (userId) {
        scope.setUser({ id: userId });
      }
      
      if (context) {
        scope.setContext('user_action', context);
      }
      
      Sentry.captureException(error);
    });
  }
  
  static reportAPIError(error: Error, endpoint: string, method: string, statusCode?: number) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'api_error');
      scope.setTag('endpoint', endpoint);
      scope.setTag('method', method);
      scope.setLevel('error');
      
      if (statusCode) {
        scope.setTag('status_code', statusCode.toString());
      }
      
      scope.setContext('api_request', {
        endpoint,
        method,
        statusCode,
        timestamp: new Date().toISOString(),
      });
      
      Sentry.captureException(error);
    });
  }
  
  static reportAIError(error: Error, agentType: string, input?: string) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'ai_error');
      scope.setTag('agent_type', agentType);
      scope.setLevel('error');
      
      scope.setContext('ai_interaction', {
        agentType,
        input: input ? input.substring(0, 100) : undefined, // Truncate for privacy
        timestamp: new Date().toISOString(),
      });
      
      Sentry.captureException(error);
    });
  }
  
  static reportDatabaseError(error: Error, query?: string, table?: string) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'database_error');
      scope.setLevel('error');
      
      if (table) {
        scope.setTag('table', table);
      }
      
      scope.setContext('database_operation', {
        query: query ? query.substring(0, 200) : undefined, // Truncate for security
        table,
        timestamp: new Date().toISOString(),
      });
      
      Sentry.captureException(error);
    });
  }
  
  static reportPerformanceIssue(
    operation: string, 
    duration: number, 
    threshold: number,
    metadata?: Record<string, any>
  ) {
    if (duration > threshold) {
      Sentry.withScope((scope) => {
        scope.setTag('issue_type', 'performance');
        scope.setTag('operation', operation);
        scope.setLevel('warning');
        
        scope.setContext('performance_issue', {
          operation,
          duration,
          threshold,
          ratio: duration / threshold,
          ...metadata,
        });
        
        Sentry.captureMessage(`Slow operation: ${operation} took ${duration}ms`, 'warning');
      });
    }
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static transactions: Map<string, any> = new Map();
  
  static startTransaction(name: string, operation: string) {
    const transaction = Sentry.startTransaction({
      name,
      op: operation,
    });
    
    this.transactions.set(name, transaction);
    return transaction;
  }
  
  static finishTransaction(name: string) {
    const transaction = this.transactions.get(name);
    if (transaction) {
      transaction.finish();
      this.transactions.delete(name);
    }
  }
  
  static measureAsync<T>(
    name: string, 
    operation: () => Promise<T>,
    options?: { threshold?: number; metadata?: Record<string, any> }
  ): Promise<T> {
    const start = Date.now();
    const transaction = this.startTransaction(name, 'custom');
    
    return operation()
      .then((result) => {
        const duration = Date.now() - start;
        
        if (options?.threshold) {
          ErrorReporter.reportPerformanceIssue(
            name, 
            duration, 
            options.threshold, 
            options.metadata
          );
        }
        
        transaction?.setData('duration', duration);
        transaction?.setStatus('ok');
        return result;
      })
      .catch((error) => {
        transaction?.setStatus('internal_error');
        throw error;
      })
      .finally(() => {
        this.finishTransaction(name);
      });
  }
}

// Business metrics tracking
export class BusinessMetrics {
  static trackUserRegistration(userId: string, role: string, source?: string) {
    Sentry.addBreadcrumb({
      category: 'business',
      message: 'User registered',
      level: 'info',
      data: {
        userId,
        role,
        source,
        timestamp: new Date().toISOString(),
      },
    });
    
    Sentry.setTag('conversion_event', 'registration');
    Sentry.captureMessage('User registration completed', 'info');
  }
  
  static trackServiceCreated(serviceId: string, providerId: string, category: string) {
    Sentry.addBreadcrumb({
      category: 'business',
      message: 'Service created',
      level: 'info',
      data: {
        serviceId,
        providerId,
        category,
        timestamp: new Date().toISOString(),
      },
    });
  }
  
  static trackBookingCreated(
    bookingId: string, 
    serviceId: string, 
    customerId: string, 
    amount: number
  ) {
    Sentry.addBreadcrumb({
      category: 'business',
      message: 'Booking created',
      level: 'info',
      data: {
        bookingId,
        serviceId,
        customerId,
        amount,
        timestamp: new Date().toISOString(),
      },
    });
    
    Sentry.setTag('conversion_event', 'booking');
    Sentry.captureMessage(`Booking created: $${amount}`, 'info');
  }
  
  static trackAIInteraction(
    userId: string, 
    command: string, 
    responseType: string,
    success: boolean
  ) {
    Sentry.addBreadcrumb({
      category: 'ai_interaction',
      message: 'AI command processed',
      level: success ? 'info' : 'warning',
      data: {
        userId,
        command,
        responseType,
        success,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

// API middleware for automatic error tracking
export function withSentryAPI<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  options?: {
    name?: string;
    trackPerformance?: boolean;
    threshold?: number;
  }
): T {
  return (async (...args: Parameters<T>) => {
    const transaction = options?.trackPerformance 
      ? PerformanceMonitor.startTransaction(
          options.name || 'api_request', 
          'http.server'
        )
      : null;
    
    const start = Date.now();
    
    try {
      const result = await handler(...args);
      
      if (options?.trackPerformance && options?.threshold) {
        const duration = Date.now() - start;
        ErrorReporter.reportPerformanceIssue(
          options.name || 'api_request',
          duration,
          options.threshold
        );
      }
      
      transaction?.setStatus('ok');
      return result;
    } catch (error) {
      if (error instanceof Error) {
        const request = args[0] as Request;
        const method = request?.method || 'UNKNOWN';
        const url = request?.url || 'unknown';
        
        ErrorReporter.reportAPIError(error, url, method);
        transaction?.setStatus('internal_error');
      }
      
      throw error;
    } finally {
      if (transaction) {
        PerformanceMonitor.finishTransaction(options?.name || 'api_request');
      }
    }
  }) as T;
}

// Health check endpoint for monitoring
export async function getHealthStatus() {
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    services: {
      database: 'unknown',
      redis: 'unknown',
      ai: 'unknown',
    },
    performance: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
  };
  
  try {
    // Check database connectivity
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    status.services.database = 'healthy';
  } catch (error) {
    status.services.database = 'unhealthy';
    status.status = 'degraded';
  }
  
  // Add more service checks as needed
  
  return status;
}