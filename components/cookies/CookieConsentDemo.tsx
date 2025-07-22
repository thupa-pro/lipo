'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CookieSettingsLink } from './CookieSettingsLink';
import { useCookieSettings, useConsentAwareAnalytics } from '@/hooks/useCookieSettings';
import { 
  Cookie,
  BarChart3, 
  Target, 
  CheckCircle, 
  XCircle,
  RefreshCw
} from 'lucide-react';

export function CookieConsentDemo() {
  const {
    consentStatus,
    preferences,
    isLoading,
    acceptAll,
    rejectAll,
    updatePreferences,
    resetConsent,
    hasConsentFor,
    isConsentPending,
    isConsentGiven,
    refreshConsent,
  } = useCookieSettings();

  const { trackEvent, trackPageView, canTrack } = useConsentAwareAnalytics();

  const handleTestAnalytics = () => {
    trackEvent('demo_button_clicked', {
      button: 'Test Analytics',
      timestamp: new Date().toISOString(),
    });
  };

  const handleTestPageView = () => {
    trackPageView('/cookie-demo');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  const getConsentIcon = (hasConsent: boolean) => {
    return hasConsent ? (
      <CheckCircle className="h-3 w-3 text-green-600" />
    ) : (
      <XCircle className="h-3 w-3 text-red-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading cookie preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Cookie className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Cookie Consent System Demo</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Production-ready GDPR/CCPA compliant cookie management system with granular controls,
          automatic script loading, and persistent localStorage storage.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(consentStatus)}
            Current Consent Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={isConsentPending ? 'secondary' : isConsentGiven ? 'default' : 'destructive'}>
              {consentStatus.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isConsentPending && 'Awaiting user decision'}
              {isConsentGiven && 'User has accepted some or all cookies'}
              {consentStatus === 'rejected' && 'User has rejected optional cookies'}
            </span>
          </div>

          {/* Preferences Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm">Essential</span>
              {getConsentIcon(preferences.necessary)}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Functional</span>
              {getConsentIcon(preferences.functional)}
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Analytics</span>
              {getConsentIcon(preferences.analytics)}
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Marketing</span>
              {getConsentIcon(preferences.marketing)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={acceptAll} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept All Cookies
            </Button>
            <Button onClick={rejectAll} variant="outline" className="w-full">
              <XCircle className="mr-2 h-4 w-4" />
              Reject Optional Cookies
            </Button>
            <CookieSettingsLink 
              variant="button" 
              text="Customize Settings" 
              className="w-full"
            />
            <Button onClick={resetConsent} variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset All Consent
            </Button>
          </CardContent>
        </Card>

        {/* Analytics Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={canTrack ? 'default' : 'secondary'}>
                {canTrack ? 'Analytics Enabled' : 'Analytics Disabled'}
              </Badge>
            </div>
            <Button 
              onClick={handleTestAnalytics} 
              disabled={!canTrack}
              className="w-full"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Test Event Tracking
            </Button>
            <Button 
              onClick={handleTestPageView} 
              disabled={!canTrack}
              variant="outline" 
              className="w-full"
            >
              <Target className="mr-2 h-4 w-4" />
              Test Page View
            </Button>
            {!canTrack && (
              <p className="text-xs text-muted-foreground">
                Enable analytics cookies to test tracking functions
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Individual Category Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Category Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Functional Cookies
              </h4>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={preferences.functional ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ functional: true })}
                >
                  Enable
                </Button>
                <Button 
                  size="sm" 
                  variant={!preferences.functional ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ functional: false })}
                >
                  Disable
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Marketing Cookies
              </h4>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={preferences.marketing ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ marketing: true })}
                >
                  Enable
                </Button>
                <Button 
                  size="sm" 
                  variant={!preferences.marketing ? 'default' : 'outline'}
                  onClick={() => updatePreferences({ marketing: false })}
                >
                  Disable
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">✅ Core Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• GDPR/CCPA compliant</li>
                <li>• Granular category controls</li>
                <li>• Automatic script loading/unloading</li>
                <li>• 90-day consent expiry</li>
                <li>• Version-aware consent checking</li>
                <li>• localStorage persistence</li>
                <li>• TypeScript support</li>
                <li>• Server-side compatible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">🎨 UI/UX Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Framer Motion animations</li>
                <li>• Responsive design</li>
                <li>• Accessible (ARIA compliant)</li>
                <li>• Dark/light theme support</li>
                <li>• Mobile-optimized</li>
                <li>• Keyboard navigation</li>
                <li>• Focus management</li>
                <li>• Screen reader friendly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(
                {
                  consentStatus,
                  preferences,
                  isLoading,
                  isConsentPending,
                  isConsentGiven,
                  canTrack,
                  localStorage: typeof window !== 'undefined' ? 
                    localStorage.getItem('loconomy_cookie_consent') : 'N/A (SSR)',
                },
                null,
                2
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}