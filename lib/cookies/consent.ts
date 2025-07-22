/**
 * 🍪 Cookie Consent Management System
 * Production-ready consent handling with localStorage persistence
 */

export type ConsentStatus = 'accepted' | 'rejected' | 'pending';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface ConsentData {
  status: ConsentStatus;
  timestamp: number;
  preferences: ConsentPreferences;
  version: string;
}

const CONSENT_KEY = 'loconomy_cookie_consent';
const CONSENT_VERSION = '1.0.0';

/**
 * Get current consent status from localStorage
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending';
  
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return 'pending';
    
    const data: ConsentData = JSON.parse(stored);
    
    // Check if consent is expired (90 days)
    const now = Date.now();
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    
    if (now - data.timestamp > ninetyDays) {
      localStorage.removeItem(CONSENT_KEY);
      return 'pending';
    }
    
    // Check version compatibility
    if (data.version !== CONSENT_VERSION) {
      return 'pending';
    }
    
    return data.status;
  } catch (error) {
    console.warn('Failed to read consent status:', error);
    return 'pending';
  }
}

/**
 * Get detailed consent preferences
 */
export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === 'undefined') {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
  }
  
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return getDefaultPreferences();
    
    const data: ConsentData = JSON.parse(stored);
    return data.preferences;
  } catch (error) {
    console.warn('Failed to read consent preferences:', error);
    return getDefaultPreferences();
  }
}

/**
 * Save consent decision
 */
export function setConsentStatus(status: ConsentStatus, preferences?: Partial<ConsentPreferences>): void {
  if (typeof window === 'undefined') return;
  
  const finalPreferences: ConsentPreferences = {
    necessary: true, // Always required
    analytics: status === 'accepted' ? (preferences?.analytics ?? true) : false,
    marketing: status === 'accepted' ? (preferences?.marketing ?? true) : false,
    functional: status === 'accepted' ? (preferences?.functional ?? true) : false,
  };
  
  const consentData: ConsentData = {
    status,
    timestamp: Date.now(),
    preferences: finalPreferences,
    version: CONSENT_VERSION,
  };
  
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    
    // Trigger custom event for other components to listen
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: { status, preferences: finalPreferences }
    }));
    
    // Load/unload scripts based on consent
    handleScriptLoading(finalPreferences);
  } catch (error) {
    console.error('Failed to save consent status:', error);
  }
}

/**
 * Clear all consent data
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: { status: 'pending', preferences: getDefaultPreferences() }
    }));
  } catch (error) {
    console.error('Failed to clear consent:', error);
  }
}

/**
 * Check if specific category is consented
 */
export function hasConsent(category: keyof ConsentPreferences): boolean {
  const preferences = getConsentPreferences();
  return preferences[category];
}

/**
 * Get default preferences
 */
function getDefaultPreferences(): ConsentPreferences {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  };
}

/**
 * Handle script loading/unloading based on consent
 */
function handleScriptLoading(preferences: ConsentPreferences): void {
  // Google Analytics
  if (preferences.analytics) {
    loadGoogleAnalytics();
  } else {
    unloadGoogleAnalytics();
  }
  
  // Google Tag Manager
  if (preferences.marketing) {
    loadGoogleTagManager();
  }
  
  // PostHog Analytics
  if (preferences.analytics) {
    loadPostHog();
  }
}

/**
 * Load Google Analytics
 */
function loadGoogleAnalytics(): void {
  const gtag = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gtag) return;
  
  // Check if already loaded
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gtag}"]`)) {
    return;
  }
  
  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gtag}`;
  script.async = true;
  document.head.appendChild(script);
  
  // Initialize GA
  script.onload = () => {
    window.gtag = window.gtag || function() {
      (window.gtag.q = window.gtag.q || []).push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gtag, {
      anonymize_ip: true,
      cookie_flags: 'secure;samesite=strict',
    });
  };
}

/**
 * Unload Google Analytics
 */
function unloadGoogleAnalytics(): void {
  // Remove GA cookies
  const gaCookies = document.cookie.split(';').filter(cookie => 
    cookie.trim().startsWith('_ga') || cookie.trim().startsWith('_gid')
  );
  
  gaCookies.forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/**
 * Load Google Tag Manager
 */
function loadGoogleTagManager(): void {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId || window.dataLayer) return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
  
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Load PostHog
 */
function loadPostHog(): void {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  
  if (!posthogKey || !posthogHost || window.posthog) return;
  
  // PostHog snippet
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  
  window.posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false,
    respect_dnt: true,
  });
}

// Global types for window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    posthog: any;
  }
}