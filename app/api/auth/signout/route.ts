import { NextRequest, NextResponse } from 'next/server';
import { IntegratedAuthService } from '@/lib/auth/integrated-auth';
import { logSecurityEvent } from '@/lib/security/audit-logger';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get client IP for logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';

    // Get current user before sign out for logging
    const currentUser = await IntegratedAuthService.getCurrentUser();

    // Perform integrated sign out (Clerk + Supabase)
    const result = await IntegratedAuthService.signOut(currentUser?.clerkUserId);

    // Log sign out event
    await logSecurityEvent({
      type: 'USER_SIGNOUT',
      userId: currentUser?.clerkUserId,
      email: currentUser?.email,
      ip: clientIP,
      severity: 'info',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Signed out successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Sign out failed' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Sign out API error:', error);
    
    // Log sign out error
    await logSecurityEvent({
      type: 'SIGNOUT_ERROR',
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'low',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Sign out service temporarily unavailable' 
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
