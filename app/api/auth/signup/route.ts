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

    // Attempt secure sign up
    const result = await SecureClerkAuth.signUpWithCredentials(
      { email, password, firstName, lastName, role },
      clientIP
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        userId: result.userId,
        needsVerification: result.needsVerification,
        redirectTo: result.redirectTo
      });
    } else {
      // Return appropriate error status
      const status = result.error?.includes('rate limit') ? 429 : 400;
      
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
