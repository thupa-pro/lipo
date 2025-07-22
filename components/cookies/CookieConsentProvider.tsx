'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getConsentStatus, 
  getConsentPreferences, 
  hasConsent,
  type ConsentStatus, 
  type ConsentPreferences 
} from '@/lib/cookies/consent';

interface CookieConsentContextType {
  consentStatus: ConsentStatus;
  preferences: ConsentPreferences;
  hasConsent: (category: keyof ConsentPreferences) => boolean;
  isLoading: boolean;
  refreshConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize consent state
  useEffect(() => {
    const initializeConsent = () => {
      const status = getConsentStatus();
      const prefs = getConsentPreferences();
      
      setConsentStatus(status);
      setPreferences(prefs);
      setIsLoading(false);
    };

    // Initialize on mount
    initializeConsent();

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const { status, preferences: newPrefs } = event.detail;
      setConsentStatus(status);
      setPreferences(newPrefs);
    };

    window.addEventListener('consentChanged', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('consentChanged', handleConsentChange as EventListener);
    };
  }, []);

  const refreshConsent = () => {
    const status = getConsentStatus();
    const prefs = getConsentPreferences();
    setConsentStatus(status);
    setPreferences(prefs);
  };

  const checkConsent = (category: keyof ConsentPreferences) => {
    return hasConsent(category);
  };

  const value: CookieConsentContextType = {
    consentStatus,
    preferences,
    hasConsent: checkConsent,
    isLoading,
    refreshConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

// Hook for conditional script loading
export function useConditionalScript(
  category: keyof ConsentPreferences,
  scriptLoader: () => void,
  cleanup?: () => void
) {
  const { hasConsent: checkConsent, isLoading } = useCookieConsent();

  useEffect(() => {
    if (isLoading) return;

    const hasConsentForCategory = checkConsent(category);

    if (hasConsentForCategory) {
      scriptLoader();
    } else if (cleanup) {
      cleanup();
    }

    // Listen for consent changes
    const handleConsentChange = () => {
      const newHasConsent = checkConsent(category);
      if (newHasConsent) {
        scriptLoader();
      } else if (cleanup) {
        cleanup();
      }
    };

    window.addEventListener('consentChanged', handleConsentChange);
    
    return () => {
      window.removeEventListener('consentChanged', handleConsentChange);
    };
  }, [category, scriptLoader, cleanup, checkConsent, isLoading]);
}