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

    const { email, password, firstName, lastName, role = 'consumer' } = body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      await logSecurityEvent({
        type: SecurityEventTypes.FAILED_SIGNUP_ATTEMPT,
        email: email || 'unknown',
        ip: clientIP,
        severity: 'low',
        details: { error: 'Missing required fields' },
      });

      return NextResponse.json(
        { 
          success: false,
          error: 'All fields are required' 
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!['consumer', 'provider'].includes(role)) {
      await logSecurityEvent({
        type: SecurityEventTypes.FAILED_SIGNUP_ATTEMPT,
        email: email,
        ip: clientIP,
        severity: 'medium',
        details: { error: 'Invalid role specified', providedRole: role },
      });

      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid role specified' 
        },
        { status: 400 }
      );
    }

    // Attempt enterprise sign up
    const result = await EnterpriseAuthService.signUpWithCredentials(
      { email, password, firstName, lastName, role },
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
        message: 'Account created successfully',
        userId: result.userId,
        needsVerification: result.needsVerification || false,
        redirectTo: result.redirectTo
      }, {
        headers: responseHeaders
      });
    } else {
      // Determine appropriate error status
      let status = 400; // Default bad request
      
      if (result.error?.includes('rate limit')) {
        status = 429; // Too Many Requests
      } else if (result.error?.includes('exists')) {
        status = 409; // Conflict
      } else if (result.error?.includes('validation')) {
        status = 422; // Unprocessable Entity
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
    console.error('Sign up API error:', error);
    
    // Log system error
    await logSecurityEvent({
      type: SecurityEventTypes.SYSTEM_ERROR,
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'high',
      details: {
        error: error instanceof Error ? error.message : 'Unknown API error',
        endpoint: '/api/auth/signup',
      },
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Registration service temporarily unavailable' 
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
