import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from "lucide-react";
import { CookieSettingsModal } from './CookieSettingsModal';
import { setConsentStatus, type ConsentPreferences } from '@/lib/cookies/consent';

interface CookieSettingsLinkProps {
  /**
   * Display, variant
   */
  variant?: 'link' | 'button' | 'icon';
  /**
   * Size, of the, component
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom text for the link
   */
  text?: string;
  /**
   * Custom CSS classes
   */
  className?: string;
  /**
   * Show icon alongside text
   */
  showIcon?: boolean;
}

export function CookieSettingsLink({
  variant = 'link',
  size = 'sm',
  text = 'Cookie Settings',
  className = '',
  showIcon = true,
}: CookieSettingsLinkProps) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenSettings = () => {
    setShowModal(true);
  };

  const handleSaveSettings = (preferences: Partial<ConsentPreferences>) => {
    setConsentStatus('accepted', preferences);
    setShowModal(false);
  };

  if (variant === 'icon') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenSettings}
          className={`h-8 w-8 p-0 ${className}`}
          aria-label="Open cookie settings"
          title="Cookie Settings"
        >
          <Cookie className="h-4 w-4" />
        </Button>
        
        <CookieSettingsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveSettings}
        />
      </>
    );
  }

  if (variant === 'button') {
    return (
      <>
        <Button
          variant="outline"
          size={size}
          onClick={handleOpenSettings}
          className={className}
          aria-label="Open cookie settings"
        >
          {showIcon && <NavigationIcons.Settings className="mr-2 h-4 w-4" / />}
          {text}
        </Button>
        
        <CookieSettingsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveSettings}
        />
      </>
    );
  }

  // Default: link variant
  return (
    <>
      <button
        onClick={handleOpenSettings}
        className={`inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm ${className}`}
        aria-label="Open cookie settings"
      >
        {showIcon && <Cookie className="h-3 w-3" />}
        {text}
      </button>
      
      <CookieSettingsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveSettings}
      />
    </>
  );
}