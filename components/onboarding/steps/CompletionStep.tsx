import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gift, Target } from "lucide-react";
import { OnboardingStepProps } from "@/lib/onboarding/types";
import { useRouter } from "next/navigation";

interface CompletionStepProps extends OnboardingStepProps {
  role: "consumer" | "provider";
}

export function CompletionStep({
  onNext,
  role,
  initialData,
}: CompletionStepProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleComplete = async () => {
    setIsRedirecting(true);
    // Trigger completion
    onNext({ completed: true });

    // Redirect to appropriate dashboard
    setTimeout(() => {
      if (role === "provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/dashboard");
      }
    }, 2000);
  };

  const achievements =
    role === "provider"
      ? [
          {
            icon: <BusinessIcons.Briefcase className="w-5 h-5" />,
            title: "Business Profile Created",
            description:
              "Your professional profile is ready to attract customers",
          },
          {
            icon: <Target className="w-5 h-5" />,
            title: "Services Configured",
            description: "Your service categories and details are set up",
          },
          {
            icon: <BusinessIcons.DollarSign className="w-5 h-5" />,
            title: "Pricing Set",
            description: "Your rates and payment methods are configured",
          },
          {
            icon: <BusinessIcons.Calendar className="w-5 h-5" />,
            title: "Availability Configured",
            description: "Customers can now see when you're available",
          },
        ]
      : [
          {
            icon: <NavigationIcons.Users className="w-5 h-5" />,
            title: "Profile Created",
            description: "Your customer profile is complete",
          },
          {
            icon: <OptimizedIcon name="Star" className="w-5 h-5" />,
            title: "Preferences Set",
            description: "We'll show you the most relevant services",
          },
          {
            icon: <UIIcons.CheckCircle className="w-5 h-5" />,
            title: "Ready to Book",
            description: "You can now start booking services",
          },
        ];

  const nextSteps =
    role === "provider"
      ? [
          {
            icon: <BusinessIcons.Briefcase className="w-4 h-4" />,
            title: "Create Your First Listing",
            description: "Add detailed service listings to attract customers",
            action: "Create Listing",
            href: "/provider/listings/new",
          },
          {
            icon: <BusinessIcons.Calendar className="w-4 h-4" />,
            title: "Review Your Calendar",
            description: "Make sure your availability is accurate",
            action: "View Calendar",
            href: "/provider/calendar",
          },
          {
            icon: <NavigationIcons.Users className="w-4 h-4" />,
            title: "Complete Your Profile",
            description: "Add, photos, certifications, and more details",
            action: "Edit Profile",
            href: "/provider/profile",
          },
        ]
      : [
          {
            icon: <Target className="w-4 h-4" />,
            title: "Browse Services",
            description: "Discover local providers in your area",
            action: "Browse Now",
            href: "/browse",
          },
          {
            icon: <OptimizedIcon name="Star" className="w-4 h-4" />,
            title: "Book Your First Service",
            description: "Try our platform with a service you need",
            action: "Find Services",
            href: "/browse",
          },
          {
            icon: <NavigationIcons.Users className="w-4 h-4" />,
            title: "Refer Friends",
            description: "Earn credits by inviting friends to Loconomy",
            action: "Refer Now",
            href: "/referrals",
          },
        ];

  return (
    <div className="space-y-8 text-center">
      {/* Success Header */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <UIIcons.CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Welcome to Loconomy!
          </h1>
          <p className="text-lg text-gray-600">
            {role === "provider"
              ? "Your provider account is ready to start earning!"
              : "Your account is set up and ready to go!"}
          </p>
        </div>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Setup Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  {achievement.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-green-900">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-green-700">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Welcome Benefits */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center text-blue-900">
            <Gift className="w-5 h-5" />
            Welcome Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {role === "provider" ? (
              <>
                <div className="text-center">
                  <Badge className="mb-2 bg-blue-100 text-blue-800">
                    Featured
                  </Badge>
                  <h4 className="font-medium">Featured Placement</h4>
                  <p className="text-sm text-gray-600">
                    Your listings will be featured for 30 days
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="mb-2 bg-green-100 text-green-800">
                    0% Fees
                  </Badge>
                  <h4 className="font-medium">No Platform Fees</h4>
                  <p className="text-sm text-gray-600">
                    First month with no service fees
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="mb-2 bg-purple-100 text-purple-800">
                    Support
                  </Badge>
                  <h4 className="font-medium">Priority Support</h4>
                  <p className="text-sm text-gray-600">
                    Get help setting up your business
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <Badge className="mb-2 bg-blue-100 text-blue-800">
                    $10 Credit
                  </Badge>
                  <h4 className="font-medium">Welcome Credit</h4>
                  <p className="text-sm text-gray-600">
                    Use towards your first booking
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="mb-2 bg-green-100 text-green-800">
                    Premium
                  </Badge>
                  <h4 className="font-medium">Premium Features</h4>
                  <p className="text-sm text-gray-600">
                    Free access for the first month
                  </p>
                </div>
                <div className="text-center">
                  <Badge className="mb-2 bg-purple-100 text-purple-800">
                    Referrals
                  </Badge>
                  <h4 className="font-medium">Referral Bonus</h4>
                  <p className="text-sm text-gray-600">
                    Earn $5 for each friend you invite
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <p className="text-gray-600">
            Here are some things you can do to get the most out of Loconomy
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    {step.icon}
                  </div>
                  <h4 className="font-medium text-left">{step.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3 text-left">
                  {step.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(step.href)}
                >
                  {step.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {role === "consumer" && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">2,500+</div>
                <div className="text-sm text-gray-600">Local Providers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">50,000+</div>
                <div className="text-sm text-gray-600">Services Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Button */}
      <div className="pt-6">
        <Button
          onClick={handleComplete}
          size="lg"
          className="px-8 py-3 text-lg"
          disabled={isRedirecting}
        >
          {isRedirecting ? (
            "Taking you to your dashboard..."
          ) : (
            <>
              Go to Dashboard
              <UIIcons.ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {isRedirecting && (
          <div className="mt-4 text-sm text-gray-600">
            Setting up your personalized experience...
          </div>
        )}
      </div>
    </div>
  );
}
