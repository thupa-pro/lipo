'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getConsentStatus, 
  setConsentStatus, 
  getConsentPreferences, 
  clearConsent,
  hasConsent,
  type ConsentStatus, 
  type ConsentPreferences 
} from '@/lib/cookies/consent';

interface UseCookieSettingsReturn {
  // Current state
  consentStatus: ConsentStatus;
  preferences: ConsentPreferences;
  isLoading: boolean;
  
  // Actions
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (newPreferences: Partial<ConsentPreferences>) => void;
  resetConsent: () => void;
  
  // Utilities
  hasConsentFor: (category: keyof ConsentPreferences) => boolean;
  isConsentPending: boolean;
  isConsentGiven: boolean;
  refreshConsent: () => void;
}

export function useCookieSettings(): UseCookieSettingsReturn {
  const [consentStatus, setConsentStatusState] = useState<ConsentStatus>('pending');
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  const initializeConsent = useCallback(() => {
    setIsLoading(true);
    const status = getConsentStatus();
    const prefs = getConsentPreferences();
    
    setConsentStatusState(status);
    setPreferences(prefs);
    setIsLoading(false);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeConsent();
  }, [initializeConsent]);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent) => {
      const { status, preferences: newPrefs } = event.detail;
      setConsentStatusState(status);
      setPreferences(newPrefs);
    };

    window.addEventListener('consentChanged', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('consentChanged', handleConsentChange as EventListener);
    };
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setConsentStatus('accepted', allAccepted);
  }, []);

  // Reject all optional cookies
  const rejectAll = useCallback(() => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setConsentStatus('rejected', onlyNecessary);
  }, []);

  // Update specific preferences
  const updatePreferences = useCallback((newPreferences: Partial<ConsentPreferences>) => {
    const finalPreferences: ConsentPreferences = {
      necessary: true, // Always required
      functional: newPreferences.functional ?? preferences.functional,
      analytics: newPreferences.analytics ?? preferences.analytics,
      marketing: newPreferences.marketing ?? preferences.marketing,
    };
    
    // Determine status based on preferences
    const hasOptionalConsent = finalPreferences.functional || 
                              finalPreferences.analytics || 
                              finalPreferences.marketing;
    
    const status: ConsentStatus = hasOptionalConsent ? 'accepted' : 'rejected';
    setConsentStatus(status, finalPreferences);
  }, [preferences]);

  // Reset all consent data
  const resetConsent = useCallback(() => {
    clearConsent();
    setConsentStatusState('pending');
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  }, []);

  // Check if consent is given for specific category
  const hasConsentFor = useCallback((category: keyof ConsentPreferences) => {
    return hasConsent(category);
  }, []);

  // Refresh consent from localStorage
  const refreshConsent = useCallback(() => {
    initializeConsent();
  }, [initializeConsent]);

  return {
    // Current state
    consentStatus,
    preferences,
    isLoading,
    
    // Actions
    acceptAll,
    rejectAll,
    updatePreferences,
    resetConsent,
    
    // Utilities
    hasConsentFor,
    isConsentPending: consentStatus === 'pending',
    isConsentGiven: consentStatus === 'accepted',
    refreshConsent,
  };
}

// Utility hook for components that need to conditionally render based on consent
export function useConsentGuard(category: keyof ConsentPreferences) {
  const { hasConsentFor, isLoading } = useCookieSettings();
  
  return {
    hasConsent: hasConsentFor(category),
    isLoading,
    canRender: !isLoading && hasConsentFor(category),
  };
}

// Hook for tracking analytics events with consent checking
export function useConsentAwareAnalytics() {
  const { hasConsentFor } = useCookieSettings();
  
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (!hasConsentFor('analytics')) {
      console.debug('Analytics tracking skipped - no consent');
      return;
    }
    
    // Track with PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(eventName, properties);
    }
    
    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }, [hasConsentFor]);
  
  const trackPageView = useCallback((pagePath?: string) => {
    if (!hasConsentFor('analytics')) {
      console.debug('Page view tracking skipped - no consent');
      return;
    }
    
    // Track with PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('$pageview', { 
        $current_url: pagePath || window.location.href 
      });
    }
    
    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_path: pagePath,
      });
    }
  }, [hasConsentFor]);
  
  return {
    trackEvent,
    trackPageView,
    canTrack: hasConsentFor('analytics'),
  };
}