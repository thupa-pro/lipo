"use client";

import { useEffect, createContext, useContext } from 'react';
import { PostHog } from 'posthog-node';
import { useRouter, usePathname } from 'next/navigation';
import { sovereignEventBus, AIMarketplaceEvents } from '@/lib/events';

// PostHog Configuration for Sovereign Platform
interface SovereignAnalyticsConfig {
  userId?: string;
  userProperties?: Record<string, any>;
  sessionProperties?: Record<string, any>;
}

// Analytics Context
const AnalyticsContext = createContext<{
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, properties?: Record<string, any>) => void;
  capture: (event: string, properties?: Record<string, any>) => void;
  isReady: boolean;
} | null>(null);

// Initialize PostHog for Elite Platform
function initializePostHog(config: SovereignAnalyticsConfig) {
  if (typeof window === 'undefined') return null;

  // Dynamic import to avoid SSR issues
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      
      // Elite Platform Configuration
      person_profiles: 'identified_only',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
      
      // Advanced Features
      capture_pageview: false, // We'll manually handle this
      capture_pageleave: true,
      enable_recording_console_log: true,
      session_recording: {
        enabled: true,
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          email: false,
        },
      },
      
      // Performance Monitoring
      autocapture: {
        dom_event_allowlist: ['click', 'submit', 'input', 'change'],
        url_allowlist: ['/app', '/dashboard', '/onboarding'],
        element_allowlist: ['button', 'a', 'input[type="submit"]'],
      },
      
      // Privacy Settings
      opt_out_capturing_by_default: false,
      disable_session_recording: false,
      
      // Feature Flags
      bootstrap: {
        distinctID: config.userId,
      },
    });

    // Set user context if provided
    if (config.userId) {
      posthog.identify(config.userId, config.userProperties);
    }

    // Set session properties
    if (config.sessionProperties) {
      posthog.register(config.sessionProperties);
    }

    // Set up global context
    posthog.register({
      platform: 'loconomy_sovereign',
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION,
      deployment: 'elite_marketplace',
    });

    // Store posthog instance globally
    (window as any).posthog = posthog;
  });
}

// Analytics Hook for Components
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within SovereignAnalyticsProvider');
  }
  return context;
}

// Page View Tracking
export function usePageTracking() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      const posthog = (window as any).posthog;
      
      // Track page view
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: pathname,
        referrer: document.referrer,
        title: document.title,
      });

      // Track page performance
      const performanceData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (performanceData) {
        posthog.capture('page_performance', {
          path: pathname,
          load_time: performanceData.loadEventEnd - performanceData.loadEventStart,
          dom_ready_time: performanceData.domContentLoadedEventEnd - performanceData.domContentLoadedEventStart,
          first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        });
      }
    }
  }, [pathname]);
}

// Business Event Tracking
export function trackBusinessEvent(
  event: string,
  properties: Record<string, any> = {},
  userId?: string
) {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    const posthog = (window as any).posthog;
    
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      session_id: posthog.get_session_id(),
      distinct_id: posthog.get_distinct_id(),
    });
  }

  // Also emit to sovereign event bus for backend processing
  sovereignEventBus.emitSovereign(
    AIMarketplaceEvents.SYSTEM_HEALTH_CHECK,
    {
      analyticsEvent: event,
      properties,
      source: 'posthog',
    },
    {
      userId,
      aiContext: {
        model: 'analytics',
        confidence: 1.0,
        intent: 'user_behavior_tracking',
      },
    }
  );
}

// AI Interaction Tracking
export function trackAIInteraction(
  interactionType: string,
  model: string,
  input: string,
  output: string,
  duration: number,
  success: boolean,
  metadata?: Record<string, any>
) {
  trackBusinessEvent('ai_interaction', {
    interaction_type: interactionType,
    model,
    input_length: input.length,
    output_length: output.length,
    duration,
    success,
    ...metadata,
  });
}

// Provider Performance Tracking
export function trackProviderPerformance(
  providerId: string,
  metrics: {
    responseTime: number;
    qualityScore: number;
    customerSatisfaction: number;
    completionRate: number;
  }
) {
  trackBusinessEvent('provider_performance', {
    provider_id: providerId,
    response_time: metrics.responseTime,
    quality_score: metrics.qualityScore,
    customer_satisfaction: metrics.customerSatisfaction,
    completion_rate: metrics.completionRate,
  });
}

// Booking Funnel Tracking
export function trackBookingFunnel(
  step: string,
  serviceType: string,
  providerId?: string,
  additionalData?: Record<string, any>
) {
  trackBusinessEvent('booking_funnel', {
    funnel_step: step,
    service_type: serviceType,
    provider_id: providerId,
    ...additionalData,
  });
}

// Search and Discovery Tracking
export function trackSearch(
  query: string,
  resultsCount: number,
  filters: Record<string, any>,
  userLocation?: string
) {
  trackBusinessEvent('search_performed', {
    query,
    results_count: resultsCount,
    filters,
    user_location: userLocation,
    query_length: query.length,
  });
}

// Feature Flag Tracking
export function trackFeatureFlag(
  flagKey: string,
  flagValue: any,
  context?: Record<string, any>
) {
  trackBusinessEvent('feature_flag_evaluated', {
    flag_key: flagKey,
    flag_value: flagValue,
    context,
  });
}

// Error Tracking (complementary to Sentry)
export function trackError(
  error: Error,
  context?: Record<string, any>,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  trackBusinessEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    severity,
    context,
  });
}

// Conversion Tracking
export function trackConversion(
  conversionType: string,
  value?: number,
  currency?: string,
  metadata?: Record<string, any>
) {
  trackBusinessEvent('conversion', {
    conversion_type: conversionType,
    value,
    currency,
    ...metadata,
  });
}

// Sovereign Analytics Provider Component
export function SovereignAnalyticsProvider({
  children,
  userId,
  userProperties,
}: {
  children: React.ReactNode;
  userId?: string;
  userProperties?: Record<string, any>;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize PostHog
    initializePostHog({
      userId,
      userProperties,
      sessionProperties: {
        initial_path: pathname,
        signup_date: userProperties?.createdAt,
        user_segment: userProperties?.segment,
      },
    });

    // Set up A/B testing
    if (userId && typeof window !== 'undefined') {
      setTimeout(() => {
        if ((window as any).posthog) {
          const posthog = (window as any).posthog;
          
          // Load feature flags
          posthog.onFeatureFlags(() => {
            const flags = posthog.getAllFlags();
            
            // Store flags in session storage for SSR
            sessionStorage.setItem('feature_flags', JSON.stringify(flags));
            
            // Track flag evaluations
            Object.entries(flags).forEach(([key, value]) => {
              trackFeatureFlag(key, value, { user_id: userId });
            });
          });
        }
      }, 1000);
    }
  }, [userId, userProperties, pathname]);

  // Page tracking hook
  usePageTracking();

  const analyticsAPI = {
    track: (event: string, properties?: Record<string, any>) => {
      trackBusinessEvent(event, properties, userId);
    },
    
    identify: (id: string, properties?: Record<string, any>) => {
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.identify(id, properties);
      }
    },
    
    capture: (event: string, properties?: Record<string, any>) => {
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture(event, properties);
      }
    },
    
    isReady: typeof window !== 'undefined' && !!(window as any).posthog,
  };

  return (
    <AnalyticsContext.Provider value={analyticsAPI}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// A/B Testing Hook
export function useFeatureFlag(flagKey: string, defaultValue: any = false) {
  const { isReady } = useAnalytics();

  useEffect(() => {
    if (isReady && typeof window !== 'undefined' && (window as any).posthog) {
      const posthog = (window as any).posthog;
      const flagValue = posthog.isFeatureEnabled(flagKey, defaultValue);
      
      trackFeatureFlag(flagKey, flagValue);
      
      return flagValue;
    }
    
    // Fallback to session storage for SSR
    if (typeof window !== 'undefined') {
      const flags = JSON.parse(sessionStorage.getItem('feature_flags') || '{}');
      return flags[flagKey] || defaultValue;
    }
    
    return defaultValue;
  }, [flagKey, defaultValue, isReady]);
}

// Cohort Analysis Hook
export function useCohortAnalysis(cohortType: string) {
  const { track } = useAnalytics();

  return {
    trackCohortEvent: (event: string, properties?: Record<string, any>) => {
      track(`cohort_${cohortType}_${event}`, {
        cohort_type: cohortType,
        ...properties,
      });
    },
  };
}

export default SovereignAnalyticsProvider;