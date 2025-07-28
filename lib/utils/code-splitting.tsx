import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component for lazy-loaded components
const LoadingSpinner = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <span className="ml-2 text-sm text-gray-600">Loading...</span>
  </div>
);

// Error boundary for lazy-loaded components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ComponentType },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || (() => (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600">Failed to load component</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      ));
      return <Fallback />;
    }

    return this.props.children;
  }
}

// Higher-order component for lazy loading with better error handling
export function withLazyLoading<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    fallback?: ComponentType;
    errorFallback?: ComponentType;
    loadingComponent?: ComponentType;
  } = {}
) {
  const LazyComponent = lazy(importFn);
  const LoadingComponent = options.loadingComponent || LoadingSpinner;

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <LazyErrorBoundary fallback={options.errorFallback}>
        <Suspense fallback={<LoadingComponent />}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    );
  };
}

// Pre-configured lazy components for large components
export const LazyComponents = {
  // Booking components (large)
  AvailabilitySettings: withLazyLoading(
    () => import('@/components/booking/AvailabilitySettings'),
    { fallback: () => <div>Loading availability settings...</div> }
  ),
  
  BookingDetailsModal: withLazyLoading(
    () => import('@/components/booking/BookingDetailsModal'),
    { fallback: () => <div>Loading booking details...</div> }
  ),
  
  BookingDashboard: withLazyLoading(
    () => import('@/components/booking/BookingDashboard'),
    { fallback: () => <div>Loading dashboard...</div> }
  ),

  // Billing components (large)
  BillingSettings: withLazyLoading(
    () => import('@/components/billing/BillingSettings'),
    { fallback: () => <div>Loading billing settings...</div> }
  ),
  
  UsageMetrics: withLazyLoading(
    () => import('@/components/billing/UsageMetrics'),
    { fallback: () => <div>Loading usage metrics...</div> }
  ),

  // Navigation components (large)
  EnhancedNavigation: withLazyLoading(
    () => import('@/components/navigation/EnhancedNavigation'),
    { fallback: () => <div>Loading navigation...</div> }
  ),

  // Notification components
  NotificationDropdown: withLazyLoading(
    () => import('@/components/notifications/NotificationDropdown'),
    { fallback: () => <div>Loading notifications...</div> }
  ),
  
  NotificationCenter: withLazyLoading(
    () => import('@/components/notifications/NotificationCenter'),
    { fallback: () => <div>Loading notification center...</div> }
  ),
};

// Route-based code splitting helper
export function createRouteComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  routeName: string
) {
  return withLazyLoading(importFn, {
    fallback: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-gray-600">Loading {routeName}...</p>
        </div>
      </div>
    ),
    errorFallback: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Failed to load {routeName}
          </h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    ),
  });
}

// Utility to preload components
export function preloadComponent(importFn: () => Promise<any>) {
  // Preload the component
  importFn().catch(err => {
    console.warn('Failed to preload component:', err);
  });
}

// Hook for preloading components based on user interaction
export function useComponentPreloader() {
  const preloadOnHover = (importFn: () => Promise<any>) => {
    return {
      onMouseEnter: () => preloadComponent(importFn),
      onFocus: () => preloadComponent(importFn),
    };
  };

  const preloadOnViewport = (importFn: () => Promise<any>) => {
    // Use Intersection Observer to preload when component enters viewport
    return (ref: HTMLElement | null) => {
      if (ref && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                preloadComponent(importFn);
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin: '50px' }
        );
        observer.observe(ref);
      }
    };
  };

  return {
    preloadOnHover,
    preloadOnViewport,
    preloadComponent,
  };
}

// Optimized dynamic imports for specific use cases
export const DynamicImports = {
  // Admin components (only load when needed)
  AdminDashboard: () => import('@/app/[locale]/admin/page').then(mod => ({ default: mod.default })),
  
  // Provider components
  ProviderDashboard: () => import('@/app/[locale]/provider/page').then(mod => ({ default: mod.default })),
  
  // Analytics components (heavy charts)
  AnalyticsDashboard: () => import('@/app/[locale]/analytics/page').then(mod => ({ default: mod.default })),
  
  // Complex forms
  BookingForm: () => import('@/components/booking/BookingForm').then(mod => ({ default: mod.default })),
  
  // Rich text editor (if any)
  RichTextEditor: () => import('@/components/ui/rich-text-editor').catch(() => ({ default: () => null })),
  
  // Maps components (if any)
  MapComponent: () => import('@/components/ui/map').catch(() => ({ default: () => null })),
};

// Performance monitoring for lazy loading
let lazyLoadMetrics = {
  componentsLoaded: 0,
  totalLoadTime: 0,
  errors: 0,
};

export function trackLazyLoadPerformance(componentName: string, loadTime: number, hasError = false) {
  lazyLoadMetrics.componentsLoaded++;
  lazyLoadMetrics.totalLoadTime += loadTime;
  if (hasError) lazyLoadMetrics.errors++;
  
  console.log(`Lazy load: ${componentName} - ${loadTime}ms`, {
    ...lazyLoadMetrics,
    averageLoadTime: lazyLoadMetrics.totalLoadTime / lazyLoadMetrics.componentsLoaded,
  });
}

export { lazyLoadMetrics };