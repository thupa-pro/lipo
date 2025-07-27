import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/auth/enterprise-auth';
import { logSecurityEvent, SecurityEventTypes } from '@/lib/security/enterprise-audit-logger';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Get client information for security logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown';

    // Log OAuth initiation
    await logSecurityEvent({
      type: SecurityEventTypes.OAUTH_INITIATED,
      ip: clientIP,
      severity: 'info',
      details: {
        provider: 'google',
        endpoint: '/api/auth/google-oauth',
      },
    });

    const result = await EnterpriseAuthService.getGoogleOAuthUrl('/auth/oauth-callback');
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        url: result.url 
      });
    } else {
      // Log OAuth URL generation failure
      await logSecurityEvent({
        type: SecurityEventTypes.OAUTH_ERROR,
        ip: clientIP,
        severity: 'medium',
        details: {
          provider: 'google',
          error: result.error || 'Failed to generate OAuth URL',
        },
      });

      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate OAuth URL' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Google OAuth API error:', error);
    
    // Log system error
    await logSecurityEvent({
      type: SecurityEventTypes.SYSTEM_ERROR,
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'high',
      details: {
        error: error instanceof Error ? error.message : 'Unknown OAuth error',
        endpoint: '/api/auth/google-oauth',
        provider: 'google',
      },
    });

    return NextResponse.json(
      { success: false, error: 'OAuth service temporarily unavailable' },
      { status: 500 }
    );
  }
}
