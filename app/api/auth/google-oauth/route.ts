import { NextRequest, NextResponse } from 'next/server';
import { SimpleWorkingAuth } from '@/lib/auth/simple-working-auth';

export async function GET() {
  try {
    const result = SimpleWorkingAuth.getGoogleOAuthUrl('/auth/oauth-callback');
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        url: result.url 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to generate OAuth URL' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Google OAuth API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
