import React, { Suspense } from 'react';
import { LazyComponents } from '@/lib/utils/code-splitting';

// Loading component
const AvailabilitySettingsLoading = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-32 flex items-center justify-center">
    <div className="text-gray-500">Loading AvailabilitySettings...</div>
  </div>
);

// Optimized AvailabilitySettings with lazy loading
export function OptimizedAvailabilitySettings(props: any) {
  return (
    <Suspense fallback={<AvailabilitySettingsLoading />}>
      <LazyComponents.AvailabilitySettings {...props} />
    </Suspense>
  );
}

export default OptimizedAvailabilitySettings;
