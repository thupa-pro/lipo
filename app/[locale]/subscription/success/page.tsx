import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useSubscriptionClient } from "@/lib/subscription/utils";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const subscriptionClient = useSubscriptionClient();

  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real, implementation, you might want to verify the session
      // and get subscription details from your backend
      setTimeout(() => {
        setIsLoading(false);
        setSubscriptionData({
          plan_name: "Professional Plan",
          status: "active",
        });
      }, 2000);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold mb-2">
            Processing your subscription...
          </h1>
          <p className="text-gray-600">
            Please wait while we set up your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIIcons.CheckCircle className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Loconomy!
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Your subscription has been successfully activated. You now have
              access to all
              {subscriptionData?.plan_name &&
                ` ${subscriptionData.plan_name}`}{" "}
              features.
            </p>

            <div className="bg-white p-6 rounded-lg border mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-semibold">
                  {subscriptionData?.plan_name || "Your Plan"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    Unlimited Listings
                  </div>
                  <div className="text-gray-600">
                    Create as many as you need
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    Priority Support
                  </div>
                  <div className="text-gray-600">Get help when you need it</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    Advanced Analytics
                  </div>
                  <div className="text-gray-600">Track your performance</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="w-full"
                >
                  Go to Dashboard
                  <UIIcons.ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/subscription")}
                  className="w-full"
                >
                  View Subscription Details
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t text-sm text-gray-600">
              <p>
                Need help getting started? Check out our{" "}
                <a href="/help" className="text-blue-600 hover:underline">
                  getting started guide
                </a>{" "}
                or{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  contact our support team
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
