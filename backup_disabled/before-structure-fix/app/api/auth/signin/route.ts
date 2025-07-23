import { NextRequest, NextResponse } from 'next/server';
import { ClerkBackendAuth } from '@/lib/auth/clerk-backend';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await ClerkBackendAuth.signInWithCredentials(email, password);

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Signed in successfully' 
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Sign in API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}