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
  Search,
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Shield,
  DollarSign,
  Sparkles,
  Brain,
  Target,
  Zap,
  Heart,
  Award,
  TrendingUp,
  Globe,
  Clock,
  Star,
  ChevronRight,
  Play,
  Eye,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "1. AI-Powered Discovery",
      description:
        "Our intelligent system analyzes your needs, location, and preferences to instantly connect you with the perfect local professionals. No more endless scrolling through irrelevant results.",
      action: { label: "Browse Services", href: "/browse" },
      gradient: "from-blue-600 via-purple-600 to-emerald-600",
      stats: { accuracy: "96.8%", time: "< 30 seconds", matches: "2.1M+" },
      aiFeature: "Smart Matching",
    },
    {
      icon: Users,
      title: "2. Secure Connection & Booking",
      description:
        "Review AI-verified profiles, read authentic reviews from real customers, and chat directly with professionals. Book securely with our advanced encryption and escrow protection.",
      action: { label: "Request a Service", href: "/request-service" },
      gradient: "from-emerald-600 via-green-600 to-cyan-600",
      stats: { verified: "100%", security: "Bank-level", satisfaction: "4.9★" },
      aiFeature: "Trust Analytics",
    },
    {
      icon: CheckCircle,
      title: "3. Excellence Delivered",
      description:
        "Experience outstanding service quality with real-time tracking, secure payments, and AI-powered quality assurance. Rate your experience to help our community grow stronger.",
      action: { label: "View Dashboard", href: "/dashboard" },
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      stats: { completion: "99.2%", onTime: "97.8%", quality: "A+" },
      aiFeature: "Quality Monitoring",
    },
  ];

  const benefits = [
    {
      icon: Brain,
      title: "AI-Enhanced Matching",
      description:
        "Our advanced machine learning algorithms analyze thousands of data points to match you with the perfect service provider based on your unique needs, preferences, and location.",
      gradient: "from-blue-500 to-purple-600",
      stats: "96.8% accuracy rate",
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      description:
        "Every provider undergoes comprehensive background checks, license verification, and continuous monitoring. Your safety and privacy are our top priorities with bank-level encryption.",
      gradient: "from-emerald-500 to-teal-600",
      stats: "Zero security incidents",
    },
    {
      icon: Target,
      title: "Dynamic Pricing",
      description:
        "AI-optimized pricing ensures you get the best value while providers earn fair compensation. Transparent pricing with no hidden fees and real-time market adjustments.",
      gradient: "from-purple-500 to-pink-600",
      stats: "Save up to 25%",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description:
        "Book services in seconds with our streamlined process. Real-time availability, instant confirmations, and automated scheduling make service booking effortless.",
      gradient: "from-cyan-500 to-blue-600",
      stats: "< 2 minutes avg",
    },
    {
      icon: Heart,
      title: "Community First",
      description:
        "We're building more than a platform—we're creating a trusted community where service providers thrive and customers receive exceptional care every time.",
      gradient: "from-rose-500 to-pink-600",
      stats: "2.1M+ happy users",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Available in 180+ countries with local expertise everywhere. Our platform adapts to local regulations, currencies, and cultural preferences seamlessly.",
      gradient: "from-indigo-500 to-purple-600",
      stats: "180+ countries",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Homeowner",
      content:
        "Loconomy's AI found me the perfect cleaner in minutes. The quality has been consistently amazing!",
      rating: 5,
      service: "House Cleaning",
      avatar: "SC",
    },
    {
      name: "Mike Rodriguez",
      role: "Small Business Owner",
      content:
        "As a handyman, Loconomy has tripled my bookings. The AI matches me with clients who truly need my skills.",
      rating: 5,
      service: "Home Repairs",
      avatar: "MR",
    },
    {
      name: "Emma Thompson",
      role: "Pet Owner",
      content:
        "Finding a trustworthy pet groomer used to be so stressful. Now it's effortless with Loconomy's verification system.",
      rating: 5,
      service: "Pet Grooming",
      avatar: "ET",
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

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              How 2.1M+ Users Find Perfect Services
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              How Loconomy
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Works Magic
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover how our
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              AI-powered platform{" "}
            </span>
            revolutionizes the way you find and book local services.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
              asChild
            >
              <Link href="/request-service">
                <Zap className="w-5 h-5 mr-3" />
                Start Your Journey
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
              asChild
            >
              <Link href="#demo">
                <Play className="w-5 h-5 mr-3" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 dark:opacity-60">
            {[
              { icon: Brain, text: "AI-Powered Matching" },
              { icon: Shield, text: "Verified Professionals" },
              { icon: Zap, text: "Instant Booking" },
              { icon: Award, text: "5-Star Quality" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300"
              >
                <item.icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Your Journey to Perfect Services
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of local services with our revolutionary
              3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-5 transition-opacity duration-700`}
                />
                <CardContent className="p-8 relative z-10">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="mb-4">
                    <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 mb-3">
                      <Brain className="w-3 h-3 mr-1" />
                      {step.aiFeature}
                    </Badge>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(step.stats).map(([key, value], i) => (
                      <div key={i} className="text-center">
                        <div className="text-lg font-bold text-slate-800 dark:text-white">
                          {value}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-400 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300"
                    asChild
                  >
                    <Link href={step.action.href}>
                      {step.action.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Why Choose Loconomy
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the next generation of local services with cutting-edge
              technology and human care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardContent className="p-8 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {benefit.stats}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Real Stories, Real Results
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how Loconomy is transforming lives and businesses every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-emerald-400 text-emerald-400"
                      />
                    ))}
                  </div>

                  <p className="text-slate-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>

                  <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                    {testimonial.service}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur-2xl opacity-10 dark:opacity-20" />
            <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-blue-200/50 dark:border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                  Ready to Experience
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  The Future?
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                Join over 2 million users who trust Loconomy to connect them
                with exceptional local professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
                  asChild
                >
                  <Link href="/auth/signup">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Start Free Today
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
                  asChild
                >
                  <Link href="/become-provider">
                    <Heart className="w-5 h-5 mr-3" />
                    Become a Provider
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
