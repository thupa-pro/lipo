import { NextRequest, NextResponse } from 'next/server';
import { IntegratedAuthService } from '@/lib/auth/integrated-auth';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/security/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    // Get client information
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Rate limiting check
    const rateLimitResult = await rateLimit.check(clientIP, 'auth_signup');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false,
          error: `Too many registration attempts. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now()) / 60000)} minutes.`,
          retryAfter: rateLimitResult.reset
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { email, password, firstName, lastName, role = 'consumer' } = body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
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
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid role specified' 
        },
        { status: 400 }
      );
    }

    // Attempt integrated sign up
    const result = await IntegratedAuthService.signUpWithCredentials(
      { email, password, firstName, lastName, role },
      clientIP,
      userAgent
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        userId: result.userId,
        needsVerification: result.needsVerification,
        redirectTo: result.redirectTo
      }, {
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        }
      });
    } else {
      // Return appropriate error status
      const status = result.error?.includes('rate limit') ? 429 : 
                    result.error?.includes('exists') ? 409 : 400;
      
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          details: result.details
        },
        { status }
      );
    }
  } catch (error) {
    console.error('Sign up API error:', error);
    
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
