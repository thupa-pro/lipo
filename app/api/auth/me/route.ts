import { NextRequest, NextResponse } from 'next/server';
import { IntegratedAuthService } from '@/lib/auth/integrated-auth';
import { logSecurityEvent } from '@/lib/security/audit-logger';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Get client IP for logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';

    // Get current integrated user (Clerk + Supabase data)
    const user = await IntegratedAuthService.getCurrentUser();
    
    if (user) {
      // Log successful user data access
      await logSecurityEvent({
        type: 'USER_DATA_ACCESS',
        userId: user.clerkUserId,
        email: user.email,
        ip: clientIP,
        severity: 'info',
      });

      // Return safe user data (exclude sensitive information)
      return NextResponse.json({
        id: user.id,
        clerkUserId: user.clerkUserId,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
        lastSignIn: user.lastSignIn,
        // Only include non-sensitive metadata
        preferences: user.metadata?.preferences,
        onboardingCompleted: user.metadata?.onboardingCompleted,
      });
    } else {
      // Log unauthorized access attempt
      await logSecurityEvent({
        type: 'UNAUTHORIZED_USER_ACCESS',
        ip: clientIP,
        severity: 'low',
      });

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
    
    // Log system error
    await logSecurityEvent({
      type: 'USER_DATA_ACCESS_ERROR',
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'medium',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
    
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
