import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, Lock, Info, AlertCircle, Zap } from "lucide-react";
import { getConsentPreferences, type ConsentPreferences } from '@/lib/cookies/consent';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: Partial<ConsentPreferences>) => void;
}

interface CookieCategory {
  key: keyof ConsentPreferences;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
  examples: string[];
  purposes: string[];
}

const cookieCategories: CookieCategory[] = [
  {
    key: 'necessary',
    title: 'Essential Cookies',
    description: 'Required for the website to function properly. Cannot be disabled.',
    icon: Shield,
    required: true,
    examples: ['Authentication tokens', 'Session management', 'Security preferences'],
    purposes: ['Maintain user sessions', 'Remember login status', 'Prevent security threats'],
  },
  {
    key: 'functional',
    title: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization features.',
    icon: Zap,
    required: false,
    examples: ['Language preferences', 'Theme settings', 'Accessibility options'],
    purposes: ['Remember your preferences', 'Customize user experience', 'Enable accessibility features'],
  },
  {
    key: 'analytics',
    title: 'Analytics Cookies',
    description: 'Help us understand how you use our website to improve performance.',
    icon: BarChart3,
    required: false,
    examples: ['Google Analytics', 'PostHog', 'Performance monitoring'],
    purposes: ['Analyze website usage', 'Measure performance', 'Identify areas for improvement'],
  },
  {
    key: 'marketing',
    title: 'Marketing Cookies',
    description: 'Used to track visitors and display relevant advertisements.',
    icon: Target,
    required: false,
    examples: ['Google Ads', 'Facebook Pixel', 'Conversion tracking'],
    purposes: ['Show relevant ads', 'Measure ad effectiveness', 'Retargeting campaigns'],
  },
];

export function CookieSettingsModal({ isOpen, onClose, onSave }: CookieSettingsModalProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  // Load current preferences when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentPreferences = getConsentPreferences();
      setPreferences(currentPreferences);
    }
  }, [isOpen]);

  const handleToggle = (category: keyof ConsentPreferences, enabled: boolean) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: enabled,
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    onSave(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    onSave(onlyNecessary);
  };

  const handleSavePreferences = () => {
    onSave(preferences);
  };

  const enabledCount = Object.values(preferences).filter(Boolean).length;
  const totalOptional = cookieCategories.filter(cat => !cat.required).length;
  const optionalEnabled = Object.entries(preferences)
    .filter(([key, value]) => key !== 'necessary' && value)
    .length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-primary" />
            Cookie Settings
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Manage your cookie preferences. You can enable or disable different types of cookies below. 
            Note that disabling some cookies may affect your browsing experience.
          </DialogDescription>
          
          {/* Summary Stats */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <UIIcons.CheckCircle className="h-3 w-3 text-green-600" />
              {enabledCount} of {cookieCategories.length} categories enabled
            </Badge>
            {optionalEnabled < totalOptional && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-amber-600" />
                {totalOptional - optionalEnabled} optional disabled
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Cookie Categories */}
          <div className="grid gap-4">
            {cookieCategories.map((category) => {
              const Icon = category.icon;
              const isEnabled = preferences[category.key];
              
              return (
                <Card 
                  key={category.key} 
                  className={`transition-all duration-200 ${
                    isEnabled 
                      ? 'ring-2 ring-primary/20 border-primary/30 bg-primary/5' 
                      : 'hover:border-border/60'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isEnabled 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {category.title}
                            {category.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleToggle(category.key, checked)}
                        disabled={category.required}
                        aria-label={`${category.required ? 'Required' : 'Toggle'} ${category.title}`}
                      />
                    </div>
                  </CardHeader>
                  
                  <AnimatePresence>
                    {isEnabled && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              Purposes
                            </h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {category.purposes.map((purpose, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  {purpose}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Examples</h4>
                            <div className="flex flex-wrap gap-1">
                              {category.examples.map((example, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>

          {/* Information Notice */}
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    About Cookie Storage
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                    Your preferences are stored locally in your browser and will expire after 90 days. 
                    You can change these settings at any time by clicking the cookie settings link in our footer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto order-2 sm:order-1">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              className="w-full sm:w-auto"
              aria-label="Reject all optional cookies"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              onClick={handleAcceptAll}
              className="w-full sm:w-auto"
              aria-label="Accept all cookies"
            >
              Accept All
            </Button>
          </div>
          
          <Button
            onClick={handleSavePreferences}
            className="w-full sm:w-auto order-1 sm:order-2"
            aria-label="Save your cookie preferences"
          >
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
