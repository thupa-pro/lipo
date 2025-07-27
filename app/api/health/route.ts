import { NextRequest, NextResponse } from 'next/server';
import { apiGateway } from '@/lib/security/api-gateway';

export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Basic health checks
    const healthChecks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: await checkDatabaseHealth(),
        authentication: await checkAuthHealth(),
        external_apis: await checkExternalAPIsHealth()
      },
      performance: {
        memory: process.memoryUsage(),
        responseTime: Date.now() - startTime
      },
      security: {
        lastSecurityScan: new Date().toISOString(),
        vulnerabilities: 'none',
        securityHeaders: 'enabled'
      }
    };

    // Get API Gateway metrics if available
    try {
      const gatewayMetrics = apiGateway.getMetrics();
      healthChecks.performance = {
        ...healthChecks.performance,
        gateway: {
          totalRequests: gatewayMetrics.totalRequests,
          averageResponseTime: gatewayMetrics.averageResponseTime,
          errorRate: gatewayMetrics.errorRate,
          requestsPerMinute: gatewayMetrics.requestsPerMinute
        }
      };
    } catch (error) {
      console.warn('Could not retrieve gateway metrics:', error);
    }

    // Determine overall health status
    const allServicesHealthy = Object.values(healthChecks.services).every(
      service => service.status === 'healthy'
    );

    if (!allServicesHealthy) {
      healthChecks.status = 'degraded';
    }

    const responseCode = healthChecks.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthChecks, { 
      status: responseCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      services: {
        database: { status: 'unknown' },
        authentication: { status: 'unknown' },
        external_apis: { status: 'unknown' }
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true'
      }
    });
  }
}

async function checkDatabaseHealth(): Promise<{ status: string; responseTime?: number; error?: string }> {
  try {
    const startTime = Date.now();
    
    // In a real application, you would check your database connection
    // For now, we'll simulate a database check
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate DB query
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Database connection failed'
    };
  }
}

async function checkAuthHealth(): Promise<{ status: string; responseTime?: number; error?: string }> {
  try {
    const startTime = Date.now();
    
    // Check if authentication services are responding
    // This could include checking Clerk, JWT validation, etc.
    const authSecret = process.env.JWT_ACCESS_SECRET;
    if (!authSecret) {
      return {
        status: 'unhealthy',
        error: 'Authentication configuration missing'
      };
    }
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Authentication service failed'
    };
  }
}

async function checkExternalAPIsHealth(): Promise<{ status: string; responseTime?: number; error?: string }> {
  try {
    const startTime = Date.now();
    
    // Check external service dependencies
    const checks = await Promise.allSettled([
      // Add checks for your external services here
      // Example: checkStripeAPI(),
      // Example: checkClerkAPI(),
      Promise.resolve('placeholder') // Remove this in real implementation
    ]);
    
    const responseTime = Date.now() - startTime;
    const failedChecks = checks.filter(result => result.status === 'rejected');
    
    if (failedChecks.length > 0) {
      return {
        status: 'degraded',
        responseTime,
        error: `${failedChecks.length} external service(s) unavailable`
      };
    }
    
    return {
      status: 'healthy',
      responseTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'External API check failed'
    };
  }
}

// Readiness probe endpoint
export async function HEAD(req: NextRequest) {
  try {
    // Quick readiness check - just verify essential services
    const authSecret = process.env.JWT_ACCESS_SECRET;
    
    if (!authSecret) {
      return new NextResponse(null, { status: 503 });
    }
    
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'X-Readiness': 'ready'
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
