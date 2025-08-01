import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/auth/enterprise-auth';
import { logSecurityEvent, SecurityEventTypes } from '@/lib/security/enterprise-audit-logger';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Get client information for security logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';

    // Get current user for logging before sign out
    let currentUser = null;
    try {
      currentUser = await EnterpriseAuthService.getCurrentUser();
    } catch (error) {
      // User might not be authenticated, which is fine for signout
    }

    // Attempt enterprise sign out
    const result = await EnterpriseAuthService.signOut();

    if (result.success) {
      // Log successful sign out
      if (currentUser) {
        await logSecurityEvent({
          type: SecurityEventTypes.USER_SIGNOUT,
          userId: currentUser.clerkUserId,
          email: currentUser.email,
          ip: clientIP,
          severity: 'info',
          details: {
            signoutMethod: 'manual',
            sessionDuration: currentUser.lastSignIn ? 
              Math.floor((Date.now() - new Date(currentUser.lastSignIn).getTime()) / 1000) : 
              null,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Signed out successfully'
      });
    } else {
      // Log failed sign out attempt
      await logSecurityEvent({
        type: SecurityEventTypes.SIGNOUT_FAILURE,
        userId: currentUser?.clerkUserId,
        email: currentUser?.email,
        ip: clientIP,
        severity: 'medium',
        details: {
          error: result.error || 'Unknown signout error',
        },
      });

      return NextResponse.json(
        { 
          success: false,
          error: result.error || 'Sign out failed'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Sign out API error:', error);
    
    // Log system error
    await logSecurityEvent({
      type: SecurityEventTypes.SYSTEM_ERROR,
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'high',
      details: {
        error: error instanceof Error ? error.message : 'Unknown API error',
        endpoint: '/api/auth/signout',
      },
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
