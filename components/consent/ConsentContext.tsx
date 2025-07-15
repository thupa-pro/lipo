"use client";

/**
 * Cookie Consent Context
 * Provides consent state and actions throughout the application
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";
import {
  ConsentContextValue,
  ConsentPreferences,
  DEFAULT_CONSENT,
} from "@/lib/consent/types";
import {
  getStoredConsent,
  storeConsent,
  createConsentPreferences,
  shouldShowConsentBanner,
  loadThirdPartyScripts,
  clearThirdPartyData,
} from "@/lib/consent/utils";

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}

interface ConsentProviderProps {
  children: React.ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const { user, isLoaded } = useUser();
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  // Load stored consent preferences
  useEffect(() => {
    if (!isLoaded) return;

    const loadConsent = async () => {
      try {
        const stored = await getStoredConsent(user?.id);
        setPreferences(stored);
        setShowBanner(shouldShowConsentBanner(stored));

        // Load third-party scripts if consent exists
        if (stored) {
          loadThirdPartyScripts(stored);
        }
      } catch (error) {
        console.error("Error loading consent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsent();
  }, [user?.id, isLoaded]);

  const updateConsent = useCallback(
    async (updates: Partial<ConsentPreferences>) => {
      try {
        const newPreferences = createConsentPreferences({
          ...preferences,
          ...updates,
        });

        await storeConsent(newPreferences, user?.id);
        setPreferences(newPreferences);
        setShowBanner(false);

        // Load or clear third-party scripts based on new preferences
        loadThirdPartyScripts(newPreferences);

        // If user revoked consent, clear existing data
        const hadConsent =
          preferences?.analytics ||
          preferences?.marketing ||
          preferences?.preferences;
        const hasConsent =
          newPreferences.analytics ||
          newPreferences.marketing ||
          newPreferences.preferences;

        if (hadConsent && !hasConsent) {
          clearThirdPartyData();
        }
      } catch (error) {
        console.error("Error updating consent:", error);
        throw error;
      }
    },
    [preferences, user?.id],
  );

  const acceptAll = useCallback(async () => {
    await updateConsent({
      analytics: true,
      marketing: true,
      preferences: true,
    });
  }, [updateConsent]);

  const rejectNonEssential = useCallback(async () => {
    await updateConsent({
      analytics: false,
      marketing: false,
      preferences: false,
    });
  }, [updateConsent]);

  const resetConsent = useCallback(async () => {
    try {
      if (user?.id) {
        // Clear from Supabase
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase.from("user_preferences").delete().eq("user_id", user.id);
      } else {
        // Clear from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("loconomy_consent_preferences");
        }
      }

      setPreferences(null);
      setShowBanner(true);
      clearThirdPartyData();
    } catch (error) {
      console.error("Error resetting consent:", error);
      throw error;
    }
  }, [user?.id]);

  const value: ConsentContextValue = {
    preferences,
    isLoading,
    updateConsent,
    hasConsented: preferences !== null,
    showBanner,
    acceptAll,
    rejectNonEssential,
    resetConsent,
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}
