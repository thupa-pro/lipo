"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getUserLocationAndDetectCountry,
  detectCountryFromBrowser,
  formatCurrencyForCountry,
  formatPhoneNumber,
  validatePhoneNumber,
  type CountryDetectionResult,
} from "@/lib/i18n/international-detection";

interface UseInternationalDetectionOptions {
  enableGeolocation?: boolean;
  fallbackToIP?: boolean;
  cacheResults?: boolean;
  onDetectionComplete?: (result: CountryDetectionResult) => void;
  onDetectionError?: (error: Error) => void;
}

interface UseInternationalDetectionReturn {
  // Detection state
  isDetecting: boolean;
  isDetected: boolean;
  detectionError: Error | null;

  // Country information
  country: string | null;
  currency: string | null;
  phoneCode: string | null;
  locale: string | null;
  cityKey: string | null;
  confidence: number;

  // Utility functions
  formatCurrency: (
    amount: number,
    options?: Intl.NumberFormatOptions,
  ) => string;
  formatPhone: (phone: string) => string;
  validatePhone: (phone: string) => boolean;

  // Manual detection
  detectLocation: () => Promise<void>;
  setManualCountry: (country: string) => void;
  resetDetection: () => void;
}

const CACHE_KEY = "international_detection_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useInternationalDetection(
  options: UseInternationalDetectionOptions = {},
): UseInternationalDetectionReturn {
  const {
    enableGeolocation = true,
    fallbackToIP = true,
    cacheResults = true,
    onDetectionComplete,
    onDetectionError,
  } = options;

  const [isDetecting, setIsDetecting] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [detectionError, setDetectionError] = useState<Error | null>(null);
  const [detectionResult, setDetectionResult] =
    useState<CountryDetectionResult | null>(null);

  // Load cached results
  const loadCachedResult = useCallback((): CountryDetectionResult | null => {
    if (!cacheResults || typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }, [cacheResults]);

  // Save results to cache
  const saveCachedResult = useCallback(
    (result: CountryDetectionResult) => {
      if (!cacheResults || typeof window === "undefined") return;

      try {
        const cacheData = {
          data: result,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        console.warn("Failed to cache detection result:", error);
      }
    },
    [cacheResults],
  );

  // Main detection function
  const detectLocation = useCallback(async () => {
    if (isDetecting) return;

    setIsDetecting(true);
    setDetectionError(null);

    try {
      let result: CountryDetectionResult;

      if (enableGeolocation) {
        // Try geolocation first
        result = await getUserLocationAndDetectCountry();
      } else if (fallbackToIP) {
        // Fallback to browser detection
        result = await detectCountryFromBrowser();
      } else {
        throw new Error("No detection method enabled");
      }

      setDetectionResult(result);
      setIsDetected(true);
      saveCachedResult(result);
      onDetectionComplete?.(result);
    } catch (error) {
      const detectionError =
        error instanceof Error ? error : new Error("Detection failed");
      setDetectionError(detectionError);
      onDetectionError?.(detectionError);

      // Try fallback detection
      if (enableGeolocation && fallbackToIP) {
        try {
          const fallbackResult = await detectCountryFromBrowser();
          setDetectionResult(fallbackResult);
          setIsDetected(true);
          saveCachedResult(fallbackResult);
          onDetectionComplete?.(fallbackResult);
        } catch (fallbackError) {
          console.error("Fallback detection also failed:", fallbackError);
        }
      }
    } finally {
      setIsDetecting(false);
    }
  }, [
    isDetecting,
    enableGeolocation,
    fallbackToIP,
    saveCachedResult,
    onDetectionComplete,
    onDetectionError,
  ]);

  // Set manual country
  const setManualCountry = useCallback(
    (country: string) => {
      // This would typically trigger a new detection with the manual country
      // For now, we'll create a basic result
      const result: CountryDetectionResult = {
        country,
        currency: "USD", // You'd look this up from your mapping
        phoneCode: "+1", // You'd look this up from your mapping
        locale: "en",
        confidence: 1.0,
      };

      setDetectionResult(result);
      setIsDetected(true);
      saveCachedResult(result);
      onDetectionComplete?.(result);
    },
    [saveCachedResult, onDetectionComplete],
  );

  // Reset detection
  const resetDetection = useCallback(() => {
    setDetectionResult(null);
    setIsDetected(false);
    setDetectionError(null);
    if (cacheResults && typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEY);
    }
  }, [cacheResults]);

  // Utility functions
  const formatCurrency = useCallback(
    (amount: number, options?: Intl.NumberFormatOptions): string => {
      if (!detectionResult?.country) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          ...options,
        }).format(amount);
      }

      return formatCurrencyForCountry(detectionResult.country, amount, options);
    },
    [detectionResult],
  );

  const formatPhone = useCallback(
    (phone: string): string => {
      if (!detectionResult?.country) {
        return phone;
      }

      return formatPhoneNumber(phone, detectionResult.country);
    },
    [detectionResult],
  );

  const validatePhone = useCallback(
    (phone: string): boolean => {
      if (!detectionResult?.country) {
        // Basic validation
        const digits = phone.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      }

      return validatePhoneNumber(phone, detectionResult.country);
    },
    [detectionResult],
  );

  // Auto-detect on mount
  useEffect(() => {
    const cached = loadCachedResult();
    if (cached) {
      setDetectionResult(cached);
      setIsDetected(true);
      onDetectionComplete?.(cached);
    } else {
      detectLocation();
    }
  }, [loadCachedResult, detectLocation, onDetectionComplete]);

  return {
    // Detection state
    isDetecting,
    isDetected,
    detectionError,

    // Country information
    country: detectionResult?.country || null,
    currency: detectionResult?.currency || null,
    phoneCode: detectionResult?.phoneCode || null,
    locale: detectionResult?.locale || null,
    cityKey: detectionResult?.cityKey || null,
    confidence: detectionResult?.confidence || 0,

    // Utility functions
    formatCurrency,
    formatPhone,
    validatePhone,

    // Manual detection
    detectLocation,
    setManualCountry,
    resetDetection,
  };
}

// Standalone utilities for one-off usage
export const internationalUtils = {
  formatCurrency: formatCurrencyForCountry,
  formatPhone: formatPhoneNumber,
  validatePhone: validatePhoneNumber,
  detectCountry: getUserLocationAndDetectCountry,
};
