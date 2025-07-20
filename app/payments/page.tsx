"use client";

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const PaymentsDashboard = dynamic(() => import('@/components/payments/PaymentsDashboard'), { ssr: false, loading: () => <div>Loading payments dashboard...</div> });

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading payments dashboard...</div>}>
      <PaymentsDashboard />
    </Suspense>
  );
}
