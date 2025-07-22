/**
 * 🍪 Cookie Consent System
 * Production-ready GDPR/CCPA compliant cookie management
 */

// Main Components
export { CookieConsentBanner } from './CookieConsentBanner';
export { CookieSettingsModal } from './CookieSettingsModal';
export { CookieConsentProvider, useCookieConsent, useConditionalScript } from './CookieConsentProvider';
export { CookieSettingsLink } from './CookieSettingsLink';

// Demo Component (for testing/showcase)
export { CookieConsentDemo } from './CookieConsentDemo';

// Core Logic
export {
  getConsentStatus,
  setConsentStatus,
  getConsentPreferences,
  clearConsent,
  hasConsent,
  type ConsentStatus,
  type ConsentPreferences,
  type ConsentData,
} from '@/lib/cookies/consent';

// Hooks
export {
  useCookieSettings,
  useConsentGuard,
  useConsentAwareAnalytics,
} from '@/hooks/useCookieSettings';