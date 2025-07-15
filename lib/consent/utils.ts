/**
 * Cookie Consent Utilities
 * Handles consent storage, retrieval, and third-party script loading
 */

import {
  ConsentPreferences,
  DEFAULT_CONSENT,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
} from "./types";
import { createClient } from "@/lib/supabase/client";

/**
 * Get consent preferences from localStorage (for guests) or Supabase (for authenticated users)
 */
export async function getStoredConsent(
  userId?: string,
): Promise<ConsentPreferences | null> {
  try {
    if (userId) {
      // Authenticated user - get from Supabase
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_preferences")
        .select("consent_preferences")
        .eq("user_id", userId)
        .single();

      if (error || !data?.consent_preferences) {
        return null;
      }

      const stored = data.consent_preferences as ConsentPreferences;

      // Check if consent is outdated
      if (stored.version !== CONSENT_VERSION) {
        return null;
      }

      return stored;
    } else {
      // Guest user - get from localStorage
      if (typeof window === "undefined") return null;

      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as ConsentPreferences;

      // Check if consent is outdated
      if (parsed.version !== CONSENT_VERSION) {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        return null;
      }

      return parsed;
    }
  } catch (error) {
    console.error("Error getting stored consent:", error);
    return null;
  }
}

/**
 * Store consent preferences
 */
export async function storeConsent(
  preferences: ConsentPreferences,
  userId?: string,
): Promise<void> {
  try {
    if (userId) {
      // Authenticated user - store in Supabase
      const supabase = createClient();
      await supabase.from("user_preferences").upsert({
        user_id: userId,
        consent_preferences: preferences,
        updated_at: new Date().toISOString(),
      });
    } else {
      // Guest user - store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
      }
    }
  } catch (error) {
    console.error("Error storing consent:", error);
    throw error;
  }
}

/**
 * Create consent preferences with timestamp and version
 */
export function createConsentPreferences(
  overrides: Partial<ConsentPreferences>,
): ConsentPreferences {
  return {
    ...DEFAULT_CONSENT,
    ...overrides,
    necessary: true, // Always required
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(
  preferences: ConsentPreferences | null,
): boolean {
  if (!preferences) return true;

  // Check if consent is outdated
  if (preferences.version !== CONSENT_VERSION) return true;

  // Check if consent was given recently (valid for 1 year)
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  if (Date.now() - preferences.timestamp > oneYear) return true;

  return false;
}

/**
 * Load third-party scripts based on consent
 */
export function loadThirdPartyScripts(preferences: ConsentPreferences): void {
  if (typeof window === "undefined") return;

  // Google Analytics
  if (preferences.analytics) {
    loadGoogleAnalytics();
  }

  // Marketing scripts
  if (preferences.marketing) {
    loadMarketingScripts();
  }

  // Preference scripts
  if (preferences.preferences) {
    loadPreferenceScripts();
  }
}

/**
 * Load Google Analytics
 */
function loadGoogleAnalytics(): void {
  if (typeof window === "undefined") return;

  // Check if already loaded
  if (window.gtag) return;

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!GA_MEASUREMENT_ID) return;

  // Load Google Analytics script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}

/**
 * Load marketing scripts
 */
function loadMarketingScripts(): void {
  if (typeof window === "undefined") return;

  // Facebook Pixel
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (FB_PIXEL_ID && !window.fbq) {
    const script = document.createElement("script");
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }
}

/**
 * Load preference scripts
 */
function loadPreferenceScripts(): void {
  if (typeof window === "undefined") return;

  // Hotjar for user behavior analysis
  const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
  if (HOTJAR_ID && !window.hj) {
    const script = document.createElement("script");
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);
  }
}

/**
 * Clear all third-party cookies and data
 */
export function clearThirdPartyData(): void {
  if (typeof window === "undefined") return;

  // Clear Google Analytics
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
    });
  }

  // Clear Facebook Pixel data
  if (window.fbq) {
    window.fbq("consent", "revoke");
  }

  // Clear Hotjar data
  if (window.hj) {
    window.hj("consent", false);
  }
}

// Extend Window interface for third-party scripts
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    hj?: (...args: any[]) => void;
  }
}
