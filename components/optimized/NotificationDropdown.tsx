import React, { Suspense } from 'react';
import { LazyComponents } from '@/lib/utils/code-splitting';

// Loading component
const NotificationDropdownLoading = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-32 flex items-center justify-center">
    <div className="text-gray-500">Loading NotificationDropdown...</div>
  </div>
);

// Optimized NotificationDropdown with lazy loading
export function OptimizedNotificationDropdown(props: any) {
  return (
    <Suspense fallback={<NotificationDropdownLoading />}>
      <LazyComponents.NotificationDropdown {...props} />
    </Suspense>
  );
}

export default OptimizedNotificationDropdown;
