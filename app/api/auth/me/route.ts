import { NextRequest, NextResponse } from 'next/server';
import { ClerkBackendAuth } from '@/lib/auth/clerk-backend';

export async function GET() {
  try {
    const user = await ClerkBackendAuth.getCurrentUser();
    
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get current user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}