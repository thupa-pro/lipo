"use client";

// Cookie Consent Component for Loconomy Platform
// Handles GDPR-compliant consent management with third-party script loading

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConsentSettingsModal } from './ConsentSettingsModal';
import { 
  ConsentSettings, 
  ConsentAction,
  ConsentEvent,
  User 
} from '@/types/rbac';
import {
  getGuestConsent,
  setGuestConsent,
  getUserConsent,
  createAcceptAllConsent,
  createRejectNonEssentialConsent,
  canLoadAnalytics,
  canLoadMarketing,
  canLoadPersonalization
} from '@/lib/rbac/utils';

interface CookieConsentProps {
  user?: User | null;
  onConsentChange?: (settings: ConsentSettings) => void;
  className?: string;
}

export function CookieConsent({ 
  user, 
  onConsentChange,
  className 
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentConsent, setCurrentConsent] = useState<ConsentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if consent banner should be shown
  useEffect(() => {
    const consent = user ? getUserConsent(user) : getGuestConsent();
    setCurrentConsent(consent);
    
    // Show banner if no consent exists
    if (!consent) {
      setIsVisible(true);
    } else {
      // Load scripts based on existing consent
      loadThirdPartyScripts(consent);
    }
  }, [user]);

  // Handle consent action
  const handleConsentAction = useCallback(async (action: ConsentAction, customSettings?: ConsentSettings) => {
    setIsLoading(true);
    
    try {
      let newSettings: ConsentSettings;
      
      switch (action) {
        case 'accept_all':
          newSettings = createAcceptAllConsent();
          break;
        case 'reject_non_essential':
          newSettings = createRejectNonEssentialConsent();
          break;
        case 'manage_preferences':
          newSettings = customSettings || createRejectNonEssentialConsent();
          break;
        default:
          throw new Error('Invalid consent action');
      }

      // Store consent
      if (user) {
        // For authenticated users, you would update via API
        await updateUserConsentAPI(user.id, newSettings);
      } else {
        // For guests, store in localStorage
        setGuestConsent(newSettings);
      }

      setCurrentConsent(newSettings);
      setIsVisible(false);
      setShowSettings(false);

      // Load third-party scripts based on consent
      loadThirdPartyScripts(newSettings);

      // Fire consent change event
      const consentEvent: ConsentEvent = {
        action,
        settings: newSettings,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      
      // Dispatch custom event for tracking
      window.dispatchEvent(new CustomEvent('loconomyConsentChange', {
        detail: consentEvent
      }));

      onConsentChange?.(newSettings);
      
    } catch (error) {
      console.error('Failed to update consent:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, onConsentChange]);

  // Load third-party scripts based on consent
  const loadThirdPartyScripts = useCallback((consent: ConsentSettings) => {
    // Remove existing scripts first
    removeThirdPartyScripts();

    // Load analytics if consented
    if (canLoadAnalytics(consent)) {
      loadGoogleAnalytics();
      loadPostHogAnalytics();
    }

    // Load marketing scripts if consented  
    if (canLoadMarketing(consent)) {
      loadGoogleAds();
      loadFacebookPixel();
    }

    // Load personalization scripts if consented
    if (canLoadPersonalization(consent)) {
      loadHotjarPersonalization();
      loadIntercomChat();
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${className}`}
          >
            <Card className="max-w-4xl mx-auto bg-background/95 backdrop-blur-lg border shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Cookie Preferences</CardTitle>
                      <CardDescription>
                        This site uses cookies and similar tools to improve performance, personalize content, and analyze traffic.
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    aria-label="Close consent banner"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick description */}
                <div className="text-sm text-muted-foreground">
                  We use essential cookies to make our site work. We'd also like to set optional cookies for analytics and personalization. 
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1 ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Learn more 
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Expanded information */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-muted rounded-lg space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary">Essential</Badge>
                              <Shield className="w-3 h-3" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Required for basic site functionality, security, and user authentication.
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">Analytics</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Help us understand how visitors interact with our website.
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">Marketing</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Used to deliver relevant ads and measure ad campaign effectiveness.
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">Personalization</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Enable personalized content and enhanced user experience features.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => handleConsentAction('accept_all')}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Accept All Cookies
                  </Button>
                  
                  <Button
                    onClick={() => handleConsentAction('reject_non_essential')}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    Reject Non-Essential
                  </Button>
                  
                  <Button
                    onClick={() => setShowSettings(true)}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Preferences
                  </Button>
                </div>

                {/* Privacy policy link */}
                <p className="text-xs text-muted-foreground text-center">
                  Learn more in our{' '}
                  <a 
                    href="/privacy" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/cookies" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consent Settings Modal */}
      <ConsentSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentConsent={currentConsent}
        onSave={(settings) => handleConsentAction('manage_preferences', settings)}
        isLoading={isLoading}
      />
    </>
  );
}

// Helper function to update user consent via API
async function updateUserConsentAPI(userId: string, consent: ConsentSettings): Promise<void> {
  try {
    const response = await fetch('/api/user/consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        consentSettings: consent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update consent');
    }
  } catch (error) {
    console.error('Error updating user consent:', error);
    throw error;
  }
}

// Third-party script loading functions
function removeThirdPartyScripts(): void {
  // Remove existing analytics scripts
  const existingScripts = document.querySelectorAll('script[data-consent-type]');
  existingScripts.forEach(script => script.remove());
}

function loadGoogleAnalytics(): void {
  if (document.querySelector('script[data-consent-type="analytics-ga"]')) return;
  
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
  script.setAttribute('data-consent-type', 'analytics-ga');
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_GA_ID);
  };
}

function loadPostHogAnalytics(): void {
  if (document.querySelector('script[data-consent-type="analytics-posthog"]')) return;
  
  const script = document.createElement('script');
  script.setAttribute('data-consent-type', 'analytics-posthog');
  script.innerHTML = `
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);var n=t;n[e]=function(){n.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST}'});
  `;
  document.head.appendChild(script);
}

function loadGoogleAds(): void {
  if (document.querySelector('script[data-consent-type="marketing-google-ads"]')) return;
  
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`;
  script.setAttribute('data-consent-type', 'marketing-google-ads');
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

function loadFacebookPixel(): void {
  if (document.querySelector('script[data-consent-type="marketing-facebook"]')) return;
  
  const script = document.createElement('script');
  script.setAttribute('data-consent-type', 'marketing-facebook');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
}

function loadHotjarPersonalization(): void {
  if (document.querySelector('script[data-consent-type="personalization-hotjar"]')) return;
  
  const script = document.createElement('script');
  script.setAttribute('data-consent-type', 'personalization-hotjar');
  script.innerHTML = `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `;
  document.head.appendChild(script);
}

function loadIntercomChat(): void {
  if (document.querySelector('script[data-consent-type="personalization-intercom"]')) return;
  
  const script = document.createElement('script');
  script.setAttribute('data-consent-type', 'personalization-intercom');
  script.innerHTML = `
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${process.env.NEXT_PUBLIC_INTERCOM_APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
  `;
  document.head.appendChild(script);
}
