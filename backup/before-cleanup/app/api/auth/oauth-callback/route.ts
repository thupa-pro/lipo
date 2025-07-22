import { NextRequest, NextResponse } from 'next/server';
import { ClerkBackendAuth } from '@/lib/auth/clerk-backend';

export async function POST(req: NextRequest) {
  try {
    const { code, state } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const result = await ClerkBackendAuth.handleOAuthCallback(code, state);

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'OAuth sign in successful' 
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('OAuth callback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}