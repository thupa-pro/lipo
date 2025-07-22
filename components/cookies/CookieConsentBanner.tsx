'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, ExternalLink } from 'lucide-react';
import { getConsentStatus, setConsentStatus, type ConsentStatus } from '@/lib/cookies/consent';
import { CookieSettingsModal } from './CookieSettingsModal';

interface CookieConsentBannerProps {
  /**
   * Privacy policy URL
   */
  privacyPolicyUrl?: string;
  /**
   * Custom banner text
   */
  customText?: string;
  /**
   * Position of the banner
   */
  position?: 'bottom' | 'top';
  /**
   * Animation type
   */
  animation?: 'slide' | 'fade';
  /**
   * Show settings button
   */
  showSettings?: boolean;
}

export function CookieConsentBanner({
  privacyPolicyUrl = '/privacy-policy',
  customText,
  position = 'bottom',
  animation = 'slide',
  showSettings = true,
}: CookieConsentBannerProps) {
  const [consentStatus, setConsentStatusState] = useState<ConsentStatus>('pending');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check consent status on mount
  useEffect(() => {
    const status = getConsentStatus();
    setConsentStatusState(status);
    setIsVisible(status === 'pending');
  }, []);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent) => {
      const { status } = event.detail;
      setConsentStatusState(status);
      setIsVisible(status === 'pending');
    };

    window.addEventListener('consentChanged', handleConsentChange as EventListener);
    return () => {
      window.removeEventListener('consentChanged', handleConsentChange as EventListener);
    };
  }, []);

  const handleAccept = () => {
    setConsentStatus('accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsentStatus('rejected');
    setIsVisible(false);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const bannerText = customText || 
    "This site uses cookies and similar tools to improve performance, personalize content, and analyze traffic. Learn more in our Privacy Policy.";

  // Animation variants
  const slideVariants = {
    initial: {
      y: position === 'bottom' ? 100 : -100,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
    exit: {
      y: position === 'bottom' ? 100 : -100,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const fadeVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  const variants = animation === 'slide' ? slideVariants : fadeVariants;

  return (
    <>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className={`fixed ${position === 'bottom' ? 'bottom-0' : 'top-0'} left-0 right-0 z-[9999] p-4`}
            role="banner"
            aria-label="Cookie consent banner"
          >
            <Card className="mx-auto max-w-6xl border-border/50 bg-background/95 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Content */}
                  <div className="flex items-start gap-3 sm:flex-1">
                    <Cookie 
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" 
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {bannerText}
                        {privacyPolicyUrl && (
                          <>
                            {' '}
                            <a
                              href={privacyPolicyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                              aria-label="Open privacy policy in new tab"
                            >
                              Privacy Policy
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    {showSettings && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSettings}
                        className="order-3 sm:order-1 min-w-fit"
                        aria-label="Customize cookie settings"
                      >
                        <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Settings</span>
                        <span className="sm:hidden">Customize</span>
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReject}
                      className="order-2 min-w-fit"
                      aria-label="Reject all cookies"
                    >
                      Reject
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={handleAccept}
                      className="order-1 sm:order-3 min-w-fit bg-primary hover:bg-primary/90"
                      aria-label="Accept all cookies"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <CookieSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={(preferences) => {
          setConsentStatus('accepted', preferences);
          setShowSettingsModal(false);
          setIsVisible(false);
        }}
      />
    </>
  );
}