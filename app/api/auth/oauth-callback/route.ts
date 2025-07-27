import { NextRequest, NextResponse } from 'next/server';
import { SimpleWorkingAuth } from '@/lib/auth/simple-working-auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { code, state } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const result = await SimpleWorkingAuth.handleGoogleOAuth(code, state);

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
        message: 'OAuth sign in successful',
        user: result.user,
        redirectTo: result.redirectTo
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('OAuth callback API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for OAuth callback page
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      // Redirect to sign in page with error
      return NextResponse.redirect(
        new URL(`/auth/signin?error=oauth_error&details=${encodeURIComponent(error)}`, req.url)
      );
    }

    if (code && state) {
      // Handle OAuth success
      const result = await SimpleWorkingAuth.handleGoogleOAuth(code, state);

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

        // Redirect to success page
        return NextResponse.redirect(
          new URL(result.redirectTo || '/dashboard', req.url)
        );
      } else {
        // Redirect to sign in page with error
        return NextResponse.redirect(
          new URL(`/auth/signin?error=oauth_failed&details=${encodeURIComponent(result.error || 'OAuth failed')}`, req.url)
        );
      }
    }

    // Missing required parameters
    return NextResponse.redirect(
      new URL('/auth/signin?error=oauth_invalid', req.url)
    );
  } catch (error) {
    console.error('OAuth callback GET error:', error);
    return NextResponse.redirect(
      new URL('/auth/signin?error=oauth_error', req.url)
    );
  }
}
