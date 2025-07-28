import React, { Suspense } from 'react';
import { LazyComponents } from '@/lib/utils/code-splitting';

// Loading component
const BillingSettingsLoading = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-32 flex items-center justify-center">
    <div className="text-gray-500">Loading BillingSettings...</div>
  </div>
);

// Optimized BillingSettings with lazy loading
export function OptimizedBillingSettings(props: any) {
  return (
    <Suspense fallback={<BillingSettingsLoading />}>
      <LazyComponents.BillingSettings {...props} />
    </Suspense>
  );
}

export default OptimizedBillingSettings;
