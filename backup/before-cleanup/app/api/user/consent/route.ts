// API Route for User Consent Management
// Handles consent settings updates for authenticated users

import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedSession, updateUserConsent } from '@/lib/auth/session';
import { ConsentSettings } from '@/types/rbac';
import { validateConsentSettings } from '@/lib/rbac/utils';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getUnifiedSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, consentSettings } = body;

    // Validate user ID matches session
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: User ID mismatch' },
        { status: 403 }
      );
    }

    // Validate consent settings structure
    if (!validateConsentSettings(consentSettings)) {
      return NextResponse.json(
        { error: 'Invalid consent settings format' },
        { status: 400 }
      );
    }

    // Ensure essential cookies are always enabled
    if (consentSettings.essential !== true) {
      return NextResponse.json(
        { error: 'Essential cookies cannot be disabled' },
        { status: 400 }
      );
    }

    // Update consent settings
    await updateUserConsent(userId, consentSettings, session.source);

    // Log consent change for audit purposes
    console.log(`Consent updated for user ${userId}:`, {
      timestamp: consentSettings.timestamp,
      analytics: consentSettings.analytics,
      marketing: consentSettings.marketing,
      personalization: consentSettings.personalization,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      message: 'Consent settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating user consent:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getUnifiedSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Return current consent settings
    const consentSettings = session.user.metadata.consentSettings;
    
    return NextResponse.json({
      success: true,
      consentSettings
    });

  } catch (error) {
    console.error('Error fetching user consent:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}