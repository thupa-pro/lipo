import { NextRequest, NextResponse } from 'next/server';
import { SecureClerkAuth } from '@/lib/auth/clerk-secure';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting and logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';

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

    // Attempt secure sign in
    const result = await SecureClerkAuth.signInWithCredentials(
      email, 
      password, 
      clientIP
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Signed in successfully',
        redirectTo: result.redirectTo
      });
    } else {
      // Return appropriate error status
      const status = result.error?.includes('rate limit') ? 429 : 401;
      
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
