"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  DollarSign,
  Users,
  Percent,
  TrendingUp,
  ArrowRight,
  Crown,
  Zap,
  Shield,
  Star,
  Sparkles,
  Globe,
  MessageCircle,
  Award,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { toast } = useToast();
  const router = useRouter();

  const customerPricing = [
    {
      title: "Essential",
      description: "Perfect for occasional service needs",
      price: "Free",
      period: "forever",
      features: [
        "Unlimited service browsing",
        "Direct provider messaging",
        "Secure payment processing",
        "Basic customer support",
        "Service history tracking",
      ],
      action: { label: "Get Started Free", href: "/auth/signup" },
      gradient: "from-gray-500 to-gray-600",
      popular: false,
    },
    {
      title: "Premium",
      description: "Enhanced features for frequent users",
      price: "$9.99",
      period: "month",
      originalPrice: "$19.99",
      features: [
        "Everything in Essential",
        "Priority customer support",
        "Access to exclusive providers",
        "Advanced booking preferences",
        "No service fees on first 5 jobs/month",
        "Premium concierge service",
        "24/7 emergency support",
      ],
      popular: true,
      action: {
        label: "Start Premium Trial",
        onClick: () =>
          toast({
            title: "Premium Trial",
            description: "Starting your 14-day free trial...",
            variant: "default",
          }),
      },
      gradient: "from-blue-500 to-purple-600",
      badge: "Most Popular",
    },
    {
      title: "Executive",
      description: "White-glove service for discerning clients",
      price: "$24.99",
      period: "month",
      features: [
        "Everything in Premium",
        "Dedicated account manager",
        "Same-day service guarantee",
        "Exclusive elite provider network",
        "No service fees on unlimited jobs",
        "Premium insurance coverage",
        "Luxury service categories",
        "VIP customer portal",
      ],
      action: {
        label: "Contact Sales",
        onClick: () => router.push("/contact"),
      },
      gradient: "from-purple-600 to-pink-600",
      badge: "Executive",
    },
  ];

  const providerPricing = [
    {
      title: "Starter",
      description: "Perfect for new service providers",
      commission: "15% commission per job",
      features: [
        "Create professional profile",
        "Receive job matches",
        "In-app messaging",
        "Secure payment processing",
        "Basic performance analytics",
        "Mobile app access",
      ],
      action: { label: "Join as Provider", href: "/become-provider" },
      gradient: "from-green-500 to-emerald-600",
      popular: false,
    },
    {
      title: "Professional",
      description: "Boost visibility and grow your business",
      commission: "10% commission per job",
      price: "$29.99",
      period: "month",
      features: [
        "Everything in Starter",
        "Featured listing opportunities",
        "Priority job matching",
        "Advanced analytics dashboard",
        "Dedicated provider support",
        "Professional verification badge",
        "Marketing boost credits",
        "Custom business profile",
      ],
      popular: true,
      action: {
        label: "Upgrade to Pro",
        onClick: () =>
          toast({
            title: "Professional Upgrade",
            description: "Upgrading to Professional plan...",
            variant: "default",
          }),
      },
      gradient: "from-blue-500 to-cyan-500",
      badge: "Best Value",
    },
    {
      title: "Elite",
      description: "Premium tier for established professionals",
      commission: "5% commission per job",
      price: "$79.99",
      period: "month",
      features: [
        "Everything in Professional",
        "Guaranteed job leads",
        "Exclusive high-value clients",
        "White-label business tools",
        "Revenue optimization insights",
        "Elite provider badge",
        "Personal business consultant",
        "Premium customer access",
      ],
      action: {
        label: "Apply for Elite",
        onClick: () => router.push("/contact"),
      },
      gradient: "from-purple-600 to-pink-600",
      badge: "Elite Network",
    },
  ];

  const enterpriseFeatures = [
    {
      icon: Users,
      title: "Team Management",
      description: "Advanced team collaboration and management tools",
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Enterprise-grade security and compliance features",
    },
    {
      icon: Globe,
      title: "Global Deployment",
      description: "Multi-region support with local provider networks",
    },
    {
      icon: MessageCircle,
      title: "Dedicated Support",
      description: "24/7 dedicated account management and support",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
      {/* Animated Background - Same as Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float" />
            <div
              className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-float"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="container mx-auto max-w-6xl text-center relative">
            <Badge className="badge-premium mb-8 animate-fade-in-down">
              <DollarSign className="w-4 h-4 mr-1" />
              Transparent Pricing
            </Badge>

            <h1 className="text-display-2xl font-black mb-8 animate-fade-in-up">
              <span className="gradient-text">Simple, Transparent</span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Premium Pricing
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Choose the perfect plan for your needs. Whether you're seeking
              premium services or offering elite expertise, we have transparent
              pricing that scales with your success.
            </p>

            <div
              className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                size="lg"
                onClick={() => router.push("/contact")}
                className="btn-premium"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Sales
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass hover:glass-strong transition-all duration-300"
              >
                <Star className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Customer Pricing */}
        <section className="py-24 relative">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <Badge className="badge-premium mb-6">
                <Users className="w-4 h-4 mr-1" />
                For Customers
              </Badge>
              <h2 className="text-display-lg mb-6 gradient-text">
                Premium Service Plans
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experience seamless service booking with transparent costs and
                premium features.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {customerPricing.map((plan, index) => (
                <Card
                  key={index}
                  className={`card-premium relative overflow-hidden border-0 ${plan.popular ? "scale-105 shadow-2xl" : "shadow-xl"}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                  )}

                  {plan.badge && (
                    <div className="absolute top-6 right-6">
                      <Badge
                        className={`${plan.popular ? "badge-premium" : "badge-secondary"}`}
                      >
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-8 pt-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-6 shadow-lg`}
                    >
                      <Crown className="w-8 h-8 text-white" />
                    </div>

                    <CardTitle className="text-2xl mb-2">
                      {plan.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </CardDescription>

                    <div className="flex items-baseline gap-2 mt-6">
                      <span className="text-5xl font-black gradient-text">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-lg text-gray-500">
                          /{plan.period}
                        </span>
                      )}
                    </div>

                    {plan.originalPrice && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg line-through text-gray-400">
                          {plan.originalPrice}
                        </span>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          50% OFF
                        </Badge>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0 space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${plan.popular ? "btn-premium" : "bg-gradient-to-r " + plan.gradient + " text-white hover:opacity-90"} transition-all duration-300`}
                      size="lg"
                      onClick={
                        plan.action.onClick ||
                        (() => router.push(plan.action.href || "/"))
                      }
                    >
                      {plan.action.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Money Back Guarantee */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 glass-strong rounded-2xl px-8 py-4">
                <Shield className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    30-Day Money-Back Guarantee
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Not satisfied? Get a full refund, no questions asked.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Provider Pricing */}
        <section className="py-24 bg-white dark:bg-gray-950 relative">
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="container mx-auto max-w-7xl px-4 relative">
            <div className="text-center mb-16">
              <Badge className="badge-premium mb-6">
                <Award className="w-4 h-4 mr-1" />
                For Providers
              </Badge>
              <h2 className="text-display-lg mb-6 gradient-text">
                Professional Growth Plans
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Scale your business with transparent fees and powerful tools
                designed for service professionals.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {providerPricing.map((plan, index) => (
                <Card
                  key={index}
                  className={`card-premium relative overflow-hidden border-0 ${plan.popular ? "scale-105 shadow-2xl" : "shadow-xl"}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  )}

                  {plan.badge && (
                    <div className="absolute top-6 right-6">
                      <Badge
                        className={`${plan.popular ? "badge-premium" : "badge-secondary"}`}
                      >
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-8 pt-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-6 shadow-lg`}
                    >
                      <Zap className="w-8 h-8 text-white" />
                    </div>

                    <CardTitle className="text-2xl mb-2">
                      {plan.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </CardDescription>

                    <div className="space-y-3 mt-6">
                      {plan.commission && (
                        <div className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          <Percent className="w-5 h-5 text-blue-500" />
                          <span className="font-bold text-lg">
                            {plan.commission}
                          </span>
                        </div>
                      )}

                      {plan.price && (
                        <div className="text-center">
                          <div className="text-4xl font-black gradient-text">
                            ${plan.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            per {plan.period}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${plan.popular ? "btn-premium" : "bg-gradient-to-r " + plan.gradient + " text-white hover:opacity-90"} transition-all duration-300`}
                      size="lg"
                      onClick={
                        plan.action.onClick ||
                        (() => router.push(plan.action.href || "/"))
                      }
                    >
                      {plan.action.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <Badge className="badge-premium mb-6">
                <Globe className="w-4 h-4 mr-1" />
                Enterprise Solutions
              </Badge>
              <h2 className="text-display-lg mb-6">Custom Enterprise Plans</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Tailored solutions for large organizations with custom
                requirements and dedicated support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Custom pricing and terms
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Dedicated implementation team
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      SLA guarantees and compliance
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      White-label options available
                    </span>
                  </div>
                </div>
              </div>

              <Card className="card-premium border-0 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
                    <Crown className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Enterprise
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Custom solutions designed for your organization's unique
                    needs and scale.
                  </p>

                  <div className="text-4xl font-black gradient-text mb-6">
                    Custom
                  </div>

                  <Button
                    size="lg"
                    className="w-full btn-premium"
                    onClick={() => router.push("/contact")}
                  >
                    Contact Sales Team
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-xs text-gray-500 mt-4">
                    Speak with our enterprise team to discuss your requirements
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-24 bg-white dark:bg-gray-950">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-display-md mb-6 gradient-text">
              Questions About Pricing?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Our pricing experts are here to help you find the perfect plan for
              your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="btn-premium"
                onClick={() => router.push("/contact")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Sales
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover-lift"
                onClick={() => router.push("/help")}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View FAQ
              </Button>
            </div>

            <div className="mt-12 glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Secure Payments
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  No Hidden Fees
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Cancel Anytime
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
