import { lazy } from "react";

// Heavy analytics components - should be lazy loaded
export const BusinessIntelligence = lazy(() => 
  import("@/components/analytics/BusinessIntelligence").then(module => ({ 
    default: module.BusinessIntelligence 
  }))
);

export const AnalyticsOverview = lazy(() => 
  import("@/components/analytics/analytics-overview").then(module => ({ 
    default: module.AnalyticsOverview 
  }))
);

export const FunnelAnalyzer = lazy(() => 
  import("@/components/analytics/funnel-analyzer").then(module => ({ 
    default: module.FunnelAnalyzer 
  }))
);

// Heavy form components
export const DynamicPaymentSystem = lazy(() => 
  import("@/components/payment/dynamic-payment-system").then(module => ({ 
    default: module.DynamicPaymentSystem 
  }))
);

export const ListingForm = lazy(() => 
  import("@/components/listings/ListingForm").then(module => ({ 
    default: module.ListingForm 
  }))
);

export const KYCVerificationFlow = lazy(() => 
  import("@/components/verification/KYCVerificationFlow").then(module => ({ 
    default: module.KYCVerificationFlow 
  }))
);

// Admin components - only for admin users
export const UserManagement = lazy(() => 
  import("@/components/admin/UserManagement").then(module => ({ 
    default: module.UserManagement 
  }))
);

export const ContentModeration = lazy(() => 
  import("@/components/admin/ContentModeration").then(module => ({ 
    default: module.ContentModeration 
  }))
);

export const SystemMonitoring = lazy(() => 
  import("@/components/admin/SystemMonitoring").then(module => ({ 
    default: module.SystemMonitoring 
  }))
);

// Dashboard components - only when user is logged in
export const SubscriptionDashboard = lazy(() => 
  import("@/components/subscription/SubscriptionDashboard").then(module => ({ 
    default: module.SubscriptionDashboard 
  }))
);

export const BookingDashboard = lazy(() => 
  import("@/components/booking/BookingDashboard").then(module => ({ 
    default: module.BookingDashboard 
  }))
);

// Mobile-specific components
export const MobileDashboard = lazy(() => 
  import("@/components/mobile/mobile-dashboard").then(module => ({ 
    default: module.MobileDashboard 
  }))
);

export const MobilePaymentFlow = lazy(() => 
  import("@/components/payment/mobile-payment-flow").then(module => ({ 
    default: module.MobilePaymentFlow 
  }))
);

// Chart components for analytics
export const LineChart = lazy(() => 
  import("recharts").then(module => ({ default: module.LineChart }))
);

export const BarChart = lazy(() => 
  import("recharts").then(module => ({ default: module.BarChart }))
);

export const PieChart = lazy(() => 
  import("recharts").then(module => ({ default: module.PieChart }))
);

export const AreaChart = lazy(() => 
  import("recharts").then(module => ({ default: module.AreaChart }))
);

// Heavy third-party components
export const StripeElementsProvider = lazy(() => 
  import("@stripe/react-stripe-js").then(module => ({ 
    default: module.Elements 
  }))
);

export const MapComponent = lazy(() => 
  import("@/components/ui/map").then(module => ({ 
    default: module.MapComponent 
  })).catch(() => ({ default: () => null })) // Fallback if map component doesn't exist
);

// Calendar components
export const CalendarComponent = lazy(() => 
  import("@/components/ui/calendar").then(module => ({ 
    default: module.Calendar 
  }))
);

export const DateRangePicker = lazy(() => 
  import("@/components/ui/date-range-picker").then(module => ({ 
    default: module.DateRangePicker 
  }))
);

// Export all lazy components with proper loading fallbacks
export const LazyComponents = {
  BusinessIntelligence,
  AnalyticsOverview,
  FunnelAnalyzer,
  DynamicPaymentSystem,
  ListingForm,
  KYCVerificationFlow,
  UserManagement,
  ContentModeration,
  SystemMonitoring,
  SubscriptionDashboard,
  BookingDashboard,
  MobileDashboard,
  MobilePaymentFlow,
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  StripeElementsProvider,
  MapComponent,
  CalendarComponent,
  DateRangePicker,
} as const;

// Common loading component for lazy loaded components
export const ComponentLoader = ({ 
  children, 
  fallback = <div className="flex items-center justify-center p-8">Loading...</div> 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) => {
  return (
    <div className="min-h-0">
      <React.Suspense fallback={fallback}>
        {children}
      </React.Suspense>
    </div>
  );
};