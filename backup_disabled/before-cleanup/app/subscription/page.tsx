import React from "react";
import { Metadata } from "next";
import { SubscriptionDashboard } from "@/components/subscription/SubscriptionDashboard";

export const metadata: Metadata = {
  title: "Subscription - Loconomy",
  description: "Manage your subscription and billing information",
};

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription & Billing
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your subscription, view usage, and access billing information
          </p>
        </div>

        <SubscriptionDashboard />
      </div>
    </div>
  );
}
