import { NextRequest, NextResponse } from 'next/server';
import { ClerkBackendAuth } from '@/lib/auth/clerk-backend';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const result = await ClerkBackendAuth.signUpWithCredentials(
      email,
      password,
      firstName,
      lastName,
      role || 'CUSTOMER'
    );

    if (result.success) {
      if (result.needsVerification) {
        return NextResponse.json({ 
          success: true,
          needsVerification: true,
          signUpId: result.signUpId,
          message: 'Account created! Please check your email for verification.' 
        });
      } else {
        return NextResponse.json({ 
          success: true,
          message: 'Account created and signed in successfully!' 
        });
      }
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Sign up API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}