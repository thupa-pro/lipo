import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/auth/enterprise-auth';
import { logSecurityEvent, SecurityEventTypes } from '@/lib/security/enterprise-audit-logger';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    // Get client IP for logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';

    // Get current enterprise user (Clerk + Supabase data)
    const user = await EnterpriseAuthService.getCurrentUser();
    
    if (user) {
      // Log successful user data access
      await logSecurityEvent({
        type: SecurityEventTypes.USER_DATA_ACCESS,
        userId: user.clerkUserId,
        email: user.email,
        ip: clientIP,
        severity: 'info',
      });

      // Return safe user data (exclude sensitive information)
      return NextResponse.json({
        // Core user data
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
        
        // Security information (safe to expose)
        securityLevel: user.securityLevel,
        mfaEnabled: user.mfaEnabled,
        loginCount: user.loginCount,
        
        // Metadata (safe subset)
        onboardingCompleted: user.metadata?.onboardingCompleted || false,
        profileSetupCompleted: user.metadata?.profileSetupCompleted || false,
        
        // Computed properties
        isNewUser: user.loginCount <= 1,
        accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)), // days
      });
    } else {
      // Log unauthorized access attempt
      await logSecurityEvent({
        type: SecurityEventTypes.UNAUTHORIZED_USER_ACCESS,
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
      type: SecurityEventTypes.USER_DATA_ACCESS_ERROR,
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'medium',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/auth/me',
      },
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
