import { NextRequest, NextResponse } from 'next/server';
import { SimpleWorkingAuth } from '@/lib/auth/simple-working-auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get session token from cookie
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (sessionToken) {
      // Sign out user
      await SimpleWorkingAuth.signOut(sessionToken);
    }

    // Clear session cookie
    cookieStore.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    });
  } catch (error) {
    console.error('Sign out API error:', error);
    
    // Still clear the cookie even if there's an error
    const cookieStore = cookies();
    cookieStore.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Sign out service temporarily unavailable' 
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
