'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Info, Eye, Heart, Palette } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { gdprCompliance, COOKIE_CATEGORIES } from '@/lib/compliance/gdpr';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieBannerProps {
  showBanner?: boolean;
  onConsentChange?: (consent: CookieConsent) => void;
}

const CATEGORY_ICONS = {
  necessary: Shield,
  analytics: Eye,
  marketing: Heart,
  preferences: Palette,
} as const;

export function CookieBanner({ showBanner = true, onConsentChange }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user needs to see cookie banner
    const checkConsentStatus = async () => {
      try {
        // Get session ID (or generate one)
        const sessionId = getSessionId();
        
        // Check if consent already exists
        const existingConsent = await gdprCompliance.getCookieConsent(sessionId);
        
        if (!existingConsent && showBanner) {
          // Check if user is in GDPR region
          const requiresConsent = await checkGDPRRegion();
          setIsVisible(requiresConsent);
        } else if (existingConsent) {
          setConsent({
            necessary: existingConsent.necessary,
            analytics: existingConsent.analytics,
            marketing: existingConsent.marketing,
            preferences: existingConsent.preferences,
          });
          onConsentChange?.(consent);
        }
      } catch (error) {
        console.error('Failed to check consent status:', error);
        // Show banner on error to be safe
        setIsVisible(showBanner);
      }
    };

    checkConsentStatus();
  }, [showBanner, onConsentChange]);

  const handleAcceptAll = async () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    await saveConsent(newConsent);
  };

  const handleRejectAll = async () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    
    await saveConsent(newConsent);
  };

  const handleSavePreferences = async () => {
    await saveConsent(consent);
  };

  const saveConsent = async (newConsent: CookieConsent) => {
    setIsLoading(true);
    
    try {
      const sessionId = getSessionId();
      
      await gdprCompliance.recordCookieConsent({
        session_id: sessionId,
        necessary: newConsent.necessary,
        analytics: newConsent.analytics,
        marketing: newConsent.marketing,
        preferences: newConsent.preferences,
        timestamp: new Date().toISOString(),
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
      });

      setConsent(newConsent);
      setIsVisible(false);
      setShowDetails(false);
      onConsentChange?.(newConsent);

      // Apply consent immediately
      applyConsent(newConsent);
      
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentChange = (category: keyof CookieConsent, value: boolean) => {
    setConsent(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const getSessionId = (): string => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  };

  const checkGDPRRegion = async (): Promise<boolean> => {
    try {
      // Get country from multiple sources
      const response = await fetch('/api/geo-location');
      if (response.ok) {
        const { country } = await response.json();
        return gdprCompliance.constructor.requiresCookieConsent(country);
      }
    } catch (error) {
      console.error('Failed to get geo location:', error);
    }
    
    // Default to showing consent for safety
    return true;
  };

  const getClientIP = async (): Promise<string | undefined> => {
    try {
      const response = await fetch('/api/client-ip');
      if (response.ok) {
        const { ip } = await response.json();
        return ip;
      }
    } catch (error) {
      console.error('Failed to get client IP:', error);
    }
    return undefined;
  };

  const applyConsent = (consent: CookieConsent) => {
    // Enable/disable analytics based on consent
    if (consent.analytics && typeof window !== 'undefined') {
      // Initialize PostHog
      window.posthog?.opt_in_capturing();
    } else {
      window.posthog?.opt_out_capturing();
    }

    // Enable/disable marketing cookies
    if (consent.marketing) {
      // Initialize marketing tools (Facebook, Pixel, Google, Ads, etc.)
      enableMarketingTools();
    } else {
      disableMarketingTools();
    }

    // Apply preferences
    if (consent.preferences) {
      // Initialize preference-based features
      enablePreferenceFeatures();
    }
  };

  const enableMarketingTools = () => {
    // Placeholder for marketing tool initialization
    console.log('Marketing tools enabled');
  };

  const disableMarketingTools = () => {
    // Placeholder for marketing tool cleanup
    console.log('Marketing tools disabled');
  };

  const enablePreferenceFeatures = () => {
    // Placeholder for preference feature initialization
    console.log('Preference features enabled');
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border"
          >
            <div className="container mx-auto p-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">We value your privacy</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your, experience, analyze site, traffic, and provide
                    personalized content. You can customize your preferences or accept all cookies.
                  </p>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-sm text-primary hover:underline mt-1"
                  >
                    Learn more about our cookies
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    Reject All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(true)}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Choose which cookies you'd like to accept. You can change these settings at any time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => {
              const Icon = CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS];
              const isRequired = category.required;
              const isEnabled = consent[key as keyof CookieConsent];

              return (
                <Card key={key} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        {isRequired && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => 
                          !isRequired && handleConsentChange(key as keyof CookieConsent, checked)
                        }
                        disabled={isRequired || isLoading}
                      />
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Cookies used:
                      </h4>
                      <div className="space-y-1">
                        {category.cookies.map((cookie, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            <span className="font-mono bg-muted px-1 rounded">
                              {cookie.name}
                            </span>
                            {' - '}
                            {cookie.purpose}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              disabled={isLoading}
              className="flex-1"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="flex-1"
            >
              Save Preferences
            </Button>
            <Button
              onClick={handleAcceptAll}
              disabled={isLoading}
              className="flex-1"
            >
              Accept All
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              For more information about how we use cookies and your privacy, rights,
              please see our{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/cookies" className="text-primary hover:underline">
                Cookie Policy
              </a>
              .
            </p>
            <p>
              You can change your cookie preferences at any time by accessing the
              cookie settings in your account or by clicking the cookie icon in the
              bottom right corner of the page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Cookie preferences button for footer/settings
export function CookiePreferencesButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-4 w-4 mr-2" />
        Cookie Preferences
      </Button>

      {showDialog && (
        <CookieBanner
          showBanner={false}
          onConsentChange={() => setShowDialog(false)}
        />
      )}
    </>
  );
}

// Types for window object
declare global {
  interface Window {
    posthog?: {
      opt_in_capturing: () => void;
      opt_out_capturing: () => void;
    };
  }
}