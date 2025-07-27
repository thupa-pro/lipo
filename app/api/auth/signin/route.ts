import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/auth/enterprise-auth';
import { headers } from 'next/headers';
import { logSecurityEvent, SecurityEventTypes } from '@/lib/security/enterprise-audit-logger';

export async function POST(req: NextRequest) {
  try {
    // Get client information for security logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      await logSecurityEvent({
        type: SecurityEventTypes.INVALID_SIGNIN_ATTEMPT,
        ip: clientIP,
        severity: 'low',
        details: { error: 'Invalid JSON in request body' },
      });

      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request format' 
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      await logSecurityEvent({
        type: SecurityEventTypes.INVALID_SIGNIN_ATTEMPT,
        email: email || 'unknown',
        ip: clientIP,
        severity: 'low',
        details: { error: 'Missing email or password' },
      });

      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Attempt enterprise sign in
    const result = await EnterpriseAuthService.signInWithCredentials(
      { email, password }, 
      clientIP,
      userAgent
    );

    if (result.success) {
      const responseHeaders: Record<string, string> = {};
      
      // Add rate limit headers
      if (result.rateLimit) {
        responseHeaders['X-RateLimit-Remaining'] = result.rateLimit.remaining.toString();
        responseHeaders['X-RateLimit-Reset'] = result.rateLimit.reset.toString();
      }

      return NextResponse.json({
        success: true,
        message: 'Signed in successfully',
        redirectTo: result.redirectTo,
        needsMFA: result.needsMFA || false,
      }, {
        headers: responseHeaders
      });
    } else {
      // Determine appropriate error status
      let status = 401; // Default unauthorized
      
      if (result.error?.includes('rate limit')) {
        status = 429; // Too Many Requests
      } else if (result.error?.includes('suspicious') || result.error?.includes('locked')) {
        status = 423; // Locked
      } else if (result.error?.includes('format') || result.error?.includes('validation')) {
        status = 400; // Bad Request
      }
      
      const responseHeaders: Record<string, string> = {};
      
      // Add rate limit headers even for failed requests
      if (result.rateLimit) {
        responseHeaders['X-RateLimit-Remaining'] = result.rateLimit.remaining.toString();
        responseHeaders['X-RateLimit-Reset'] = result.rateLimit.reset.toString();
        
        if (result.rateLimit.blocked) {
          responseHeaders['Retry-After'] = Math.ceil((result.rateLimit.reset - Date.now()) / 1000).toString();
        }
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          details: result.details
        },
        { 
          status,
          headers: responseHeaders
        }
      );
    }
  } catch (error) {
    console.error('Sign in API error:', error);
    
    // Log system error
    await logSecurityEvent({
      type: SecurityEventTypes.SYSTEM_ERROR,
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'high',
      details: {
        error: error instanceof Error ? error.message : 'Unknown API error',
        endpoint: '/api/auth/signin',
      },
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication service temporarily unavailable' 
      },
      { status: 503 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
