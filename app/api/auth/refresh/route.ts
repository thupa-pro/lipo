import { NextRequest, NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface RefreshToken {
  userId: string;
  sessionId: string;
  tokenId: string;
  iat: number;
  exp: number;
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      console.error('JWT_REFRESH_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let decoded: RefreshToken;
    try {
      decoded = verify(refreshToken, refreshSecret) as RefreshToken;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      console.error('JWT_ACCESS_SECRET not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const newAccessToken = sign(
      {
        userId: decoded.userId,
        role: 'user', // In a real app, fetch from database
        sessionId: decoded.sessionId
      },
      accessSecret,
      {
        expiresIn: '15m',
        issuer: 'loconomy',
        audience: 'loconomy-api'
      }
    );

    // Generate new refresh token
    const newRefreshToken = sign(
      {
        userId: decoded.userId,
        sessionId: decoded.sessionId,
        tokenId: decoded.tokenId // Keep same token ID for session tracking
      },
      refreshSecret,
      {
        expiresIn: '7d',
        issuer: 'loconomy',
        audience: 'loconomy-refresh'
      }
    );

    // Set new cookies
    const response = NextResponse.json({ success: true, message: 'Tokens refreshed' });
    const isProduction = process.env.NODE_ENV === 'production';

    // Access token cookie
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    // Refresh token cookie
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/api/auth/refresh'
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}