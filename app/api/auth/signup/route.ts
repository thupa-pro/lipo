import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, role = 'consumer' } = body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { 
          success: false,
          error: 'All fields are required' 
        },
        { status: 400 }
      );
    }

    // For now, simulate successful registration
    // TODO: Implement actual Clerk authentication
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      userId: 'test-user-id',
      needsVerification: false,
      redirectTo: role === 'provider' ? '/onboarding/provider' : '/onboarding'
    });

  } catch (error) {
    console.error('Sign up API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Registration service temporarily unavailable' 
      },
      { status: 503 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
