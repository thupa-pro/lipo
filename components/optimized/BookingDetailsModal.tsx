import React, { Suspense } from 'react';
import { LazyComponents } from '@/lib/utils/code-splitting';

// Loading component
const BookingDetailsModalLoading = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg h-32 flex items-center justify-center">
    <div className="text-gray-500">Loading BookingDetailsModal...</div>
  </div>
);

// Optimized BookingDetailsModal with lazy loading
export function OptimizedBookingDetailsModal(props: any) {
  return (
    <Suspense fallback={<BookingDetailsModalLoading />}>
      <LazyComponents.BookingDetailsModal {...props} />
    </Suspense>
  );
}

export default OptimizedBookingDetailsModal;
