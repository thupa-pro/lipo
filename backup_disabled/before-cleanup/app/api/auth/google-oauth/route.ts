import { NextRequest, NextResponse } from 'next/server';
import { ClerkBackendAuth } from '@/lib/auth/clerk-backend';

export async function GET() {
  try {
    const result = await ClerkBackendAuth.getGoogleOAuthUrl('/auth/oauth-callback');
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        url: result.url 
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Google OAuth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}