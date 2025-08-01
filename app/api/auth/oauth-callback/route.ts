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
    const userAgent = headersList.get('user-agent') || 'unknown';

    const { code, state } = await req.json();

    if (!code) {
      await logSecurityEvent({
        type: SecurityEventTypes.OAUTH_ERROR,
        ip: clientIP,
        severity: 'low',
        details: {
          provider: 'google',
          error: 'Missing authorization code',
        },
      });

      return NextResponse.json(
        { success: false, error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Log OAuth callback attempt
    await logSecurityEvent({
      type: SecurityEventTypes.OAUTH_CALLBACK_RECEIVED,
      ip: clientIP,
      severity: 'info',
      details: {
        provider: 'google',
        hasCode: !!code,
        hasState: !!state,
      },
    });

    const result = await EnterpriseAuthService.handleGoogleOAuth(code, state, clientIP, userAgent);

    if (result.success) {
      // Log successful OAuth authentication
      await logSecurityEvent({
        type: SecurityEventTypes.OAUTH_SUCCESS,
        userId: result.userId,
        email: result.user?.email,
        ip: clientIP,
        severity: 'info',
        details: {
          provider: 'google',
          isNewUser: result.isNewUser || false,
        },
      });

      const responseHeaders: Record<string, string> = {};
      
      // Add rate limit headers if available
      if (result.rateLimit) {
        responseHeaders['X-RateLimit-Remaining'] = result.rateLimit.remaining.toString();
        responseHeaders['X-RateLimit-Reset'] = result.rateLimit.reset.toString();
      }

      return NextResponse.json({ 
        success: true,
        message: 'OAuth sign in successful',
        user: result.user,
        redirectTo: result.redirectTo,
        isNewUser: result.isNewUser || false,
      }, {
        headers: responseHeaders
      });
    } else {
      // Log OAuth failure
      await logSecurityEvent({
        type: SecurityEventTypes.OAUTH_FAILURE,
        ip: clientIP,
        severity: 'medium',
        details: {
          provider: 'google',
          error: result.error || 'OAuth authentication failed',
        },
      });

      return NextResponse.json(
        { success: false, error: result.error || 'OAuth authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('OAuth callback API error:', error);
    
    // Log system error
    await logSecurityEvent({
      type: SecurityEventTypes.SYSTEM_ERROR,
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'high',
      details: {
        error: error instanceof Error ? error.message : 'Unknown OAuth callback error',
        endpoint: '/api/auth/oauth-callback',
        provider: 'google',
      },
    });

    return NextResponse.json(
      { success: false, error: 'OAuth service temporarily unavailable' },
      { status: 500 }
    );
  }
}

// Handle GET requests for OAuth callback page
export async function GET(req: NextRequest) {
  try {
    // Get client information for security logging
    const headersList = headers();
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    req.ip || 
                    'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      // Log OAuth error from provider
      await logSecurityEvent({
        type: SecurityEventTypes.OAUTH_ERROR,
        ip: clientIP,
        severity: 'medium',
        details: {
          provider: 'google',
          error: error,
          source: 'provider_callback',
        },
      });

      // Redirect to sign in page with error
      return NextResponse.redirect(
        new URL(`/auth/signin?error=oauth_error&details=${encodeURIComponent(error)}`, req.url)
      );
    }

    if (code && state) {
      // Handle OAuth success
      const result = await EnterpriseAuthService.handleGoogleOAuth(code, state, clientIP, userAgent);

      if (result.success) {
        // Log successful OAuth
        await logSecurityEvent({
          type: SecurityEventTypes.OAUTH_SUCCESS,
          userId: result.userId,
          email: result.user?.email,
          ip: clientIP,
          severity: 'info',
          details: {
            provider: 'google',
            isNewUser: result.isNewUser || false,
            redirectMethod: 'GET',
          },
        });

        // Redirect to success page
        return NextResponse.redirect(
          new URL(result.redirectTo || '/dashboard', req.url)
        );
      } else {
        // Log OAuth failure
        await logSecurityEvent({
          type: SecurityEventTypes.OAUTH_FAILURE,
          ip: clientIP,
          severity: 'medium',
          details: {
            provider: 'google',
            error: result.error || 'OAuth authentication failed',
            redirectMethod: 'GET',
          },
        });

        // Redirect to sign in page with error
        return NextResponse.redirect(
          new URL(`/auth/signin?error=oauth_failed&details=${encodeURIComponent(result.error || 'OAuth failed')}`, req.url)
        );
      }
    }

    // Missing required parameters
    await logSecurityEvent({
      type: SecurityEventTypes.OAUTH_ERROR,
      ip: clientIP,
      severity: 'low',
      details: {
        provider: 'google',
        error: 'Missing required OAuth parameters',
        hasCode: !!code,
        hasState: !!state,
      },
    });

    return NextResponse.redirect(
      new URL('/auth/signin?error=oauth_invalid', req.url)
    );
  } catch (error) {
    console.error('OAuth callback GET error:', error);
    
    // Log system error
    await logSecurityEvent({
      type: SecurityEventTypes.SYSTEM_ERROR,
      ip: headers().get('x-forwarded-for') || 'unknown',
      severity: 'high',
      details: {
        error: error instanceof Error ? error.message : 'Unknown OAuth GET error',
        endpoint: '/api/auth/oauth-callback',
        provider: 'google',
        method: 'GET',
      },
    });

    return NextResponse.redirect(
      new URL('/auth/signin?error=oauth_error', req.url)
    );
  }
}
