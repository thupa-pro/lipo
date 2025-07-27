import { NextRequest, NextResponse } from 'next/server';
import { SimpleWorkingAuth } from '@/lib/auth/simple-working-auth';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Get session token from cookie
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Not authenticated' 
        },
        { status: 401 }
      );
    }

    // Get current user
    const user = await SimpleWorkingAuth.getCurrentUser(sessionToken);
    
    if (user) {
      return NextResponse.json({
        // Core user data
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastSignIn: user.lastSignIn,
        
        // Computed properties
        isNewUser: !user.lastSignIn,
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Not authenticated' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get current user API error:', error);
    
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
