import React from "react";
import { Metadata } from "next";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

export const metadata: Metadata = {
  title: "Subscription Plans - Loconomy",
  description: "Choose the perfect plan for your business needs",
};

export default function SubscriptionPlansPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core
            features with advanced capabilities available on higher tiers.
          </p>
        </div>

        <SubscriptionPlans />

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Questions about our plans?
            </h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help you find the perfect plan for your
              business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Sales
              </a>
              <a
                href="/help"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
