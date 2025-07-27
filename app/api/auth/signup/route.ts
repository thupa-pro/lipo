import { NextRequest, NextResponse } from 'next/server';
import { SimpleWorkingAuth } from '@/lib/auth/simple-working-auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
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

    // Attempt sign up
    const result = await SimpleWorkingAuth.signUp({
      email,
      password,
      firstName,
      lastName,
      role: role as 'consumer' | 'provider',
    });

    if (result.success) {
      // Set session cookie
      const cookieStore = cookies();
      cookieStore.set('session-token', result.sessionToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: result.user,
        userId: result.userId,
        needsVerification: false, // Auto-verified for development
        redirectTo: result.redirectTo
      });
    } else {
      // Determine appropriate error status
      let status = 400; // Default bad request
      
      if (result.error?.includes('already exists')) {
        status = 409; // Conflict
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: result.error
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
      { status: 500 }
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
