import { NextRequest, NextResponse } from "next/server";
import { getHealthStatus } from "@/lib/observability/sentry";

export async function GET(request: NextRequest) {
  try {
    const status = await getHealthStatus();
    
    const httpStatus = status.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(status, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
