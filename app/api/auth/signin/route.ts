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
    const rateLimitResult = await rateLimit.check(clientIP, 'auth_signin');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false,
          error: `Too many login attempts. Please try again in ${Math.ceil((rateLimitResult.reset - Date.now()) / 60000)} minutes.`,
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
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Attempt integrated sign in
    const result = await IntegratedAuthService.signInWithCredentials(
      { email, password }, 
      clientIP,
      userAgent
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Signed in successfully',
        redirectTo: result.redirectTo
      }, {
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        }
      });
    } else {
      // Return appropriate error status
      const status = result.error?.includes('rate limit') ? 429 : 
                    result.error?.includes('suspicious') ? 423 : 401;
      
      return NextResponse.json(
        { 
          success: false,
          error: result.error 
        },
        { status }
      );
    }
  } catch (error) {
    console.error('Sign in API error:', error);
    
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
