import { NextRequest, NextResponse } from 'next/server';
import { ClerkBackendAuth } from '@/lib/auth/clerk-backend';

export async function POST() {
  try {
    await ClerkBackendAuth.signOut();
    
    return NextResponse.json({ 
      success: true,
      message: 'Signed out successfully' 
    });
  } catch (error) {
    console.error('Sign out API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}