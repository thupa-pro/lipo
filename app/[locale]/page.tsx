import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SmartRecommendations from "@/components/ai/smart-recommendations";
import {
  Star,
  MapPin,
  Zap,
  Shield,
  Users,
  Sparkles,
  Search,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  Home,
  Briefcase,
  Car,
  PiggyBank,
  Target,
  Smartphone,
  Play,
  ChevronRight,
  Globe,
  Layers,
  Database,
  Cpu,
  MessageCircle,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const stats = [
    {
      label: "Active Users",
      value: "2.1M",
      icon: Users,
      trend: "+847%",
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "AI Matches",
      value: "50M+",
      icon: Brain,
      trend: "+312%",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Trust Score",
      value: "99.7%",
      icon: Shield,
      trend: "Industry Leading",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Global Reach",
      value: "180",
      icon: Globe,
      trend: "Countries",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  const services = [
    {
      title: "Smart Matching",
      subtitle: "AI-Powered Service Discovery",
      description:
        "Our intelligent AI analyzes your needs, location, and preferences to connect you with the perfect local professionals instantly.",
      icon: Brain,
      gradient: "from-blue-600 via-purple-600 to-emerald-600",
      stats: { accuracy: "96.8%", matches: "2.1M+", satisfaction: "4.9★" },
    },
    {
      title: "Verified Professionals",
      subtitle: "Trusted & Background-Checked",
      description:
        "Every service provider undergoes thorough verification, background checks, and continuous quality monitoring.",
      icon: Shield,
      gradient: "from-emerald-600 via-green-600 to-cyan-600",
      stats: { verified: "100%", checks: "15+", quality: "A+" },
    },
    {
      title: "Fair Pricing",
      subtitle: "Transparent & Competitive",
      description:
        "Advanced algorithms ensure fair, competitive pricing while helping providers earn sustainable income.",
      icon: Target,
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      stats: { savings: "25%", transparent: "100%", fair: "A+" },
    },
  ];

  const categories = [
    {
      name: "Home & Living",
      icon: Home,
      count: "12.4K",
      color: "from-blue-500 to-purple-600",
      popular: true,
    },
    {
      name: "Professional",
      icon: Briefcase,
      count: "8.7K",
      color: "from-purple-500 to-pink-600",
      popular: false,
    },
    {
      name: "Wellness",
      icon: Heart,
      count: "6.2K",
      color: "from-pink-500 to-rose-600",
      popular: true,
    },
    {
      name: "Technology",
      icon: Cpu,
      count: "4.8K",
      color: "from-green-500 to-emerald-600",
      popular: false,
    },
    {
      name: "Transportation",
      icon: Car,
      count: "3.1K",
      color: "from-blue-500 to-teal-600",
      popular: false,
    },
    {
      name: "Education",
      icon: Database,
      count: "9.3K",
      color: "from-cyan-500 to-blue-600",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
      {/* Animated Background */}
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
      <section
        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6"
        role="main"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-6 sm:mb-8 group hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-500">
            <div
              className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
              aria-hidden="true"
            />
            <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Trusted by 2.1M+ Users Globally
            </span>
            <Sparkles
              className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-500 dark:text-emerald-400"
              aria-hidden="true"
            />
          </div>

          {/* Main Headline */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 sm:mb-8 leading-none"
          >
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Local Services
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Redefined
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            Connect with AI-matched, verified local professionals who deliver
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              exceptional quality service{" "}
            </span>
            right in your neighborhood.
          </p>

          {/* Search Interface */}
          <div className="max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0">
            <div className="relative group">
              <div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000"
                aria-hidden="true"
              />
              <div className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-2 border border-blue-200/50 dark:border-white/20 shadow-xl">
                <form role="search" aria-label="Search for local services">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Search
                        className="w-4 h-4 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Find trusted local help near you..."
                      className="flex-1 w-full sm:w-auto bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-400 text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-transparent rounded-lg py-2 sm:py-0"
                      aria-label="Search for services"
                    />
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-6 sm:px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
                      type="submit"
                      aria-label="Search for services"
                    >
                      <span className="hidden sm:inline">Find Services</span>
                      <span className="sm:hidden">Search</span>
                      <MapPin className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
            <Button
              size="lg"
              className="relative w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-8 sm:px-12 py-4 font-bold text-base sm:text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
              asChild
            >
              <Link href="/browse" aria-label="Browse and find local services">
                <Search
                  className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                />
                Find Services Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-2xl px-8 sm:px-12 py-4 font-bold text-base sm:text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
              asChild
            >
              <Link
                href="/become-provider"
                aria-label="Join as a service provider"
              >
                Become a Provider
                <ChevronRight className="w-5 h-5 ml-3" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-70 dark:opacity-60 px-4 sm:px-0">
            {[
              { icon: Shield, text: "Verified Professionals" },
              { icon: Award, text: "5-Star Quality" },
              { icon: Zap, text: "Instant Booking" },
              { icon: Users, text: "Trusted Community" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-gray-300"
              >
                <item.icon
                  className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-center sm:text-left">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6"
        aria-labelledby="stats-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2
              id="stats-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            >
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Redefining Excellence
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4 sm:px-0">
              Real-time metrics from our revolutionary platform that's changing
              how the world connects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="relative bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8 group hover:bg-white/10 transition-all duration-500 hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`,
                  }}
                />
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 mb-3 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-sm text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Why Choose Loconomy
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the next generation of local services with AI-powered
              matching and verified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl p-8 group hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-5 transition-opacity duration-700`}
                />
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <service.icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="text-sm text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-2">
                    {service.subtitle}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(service.stats).map(([key, value], i) => (
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
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Service Categories
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find trusted professionals across all the services you need in
              your local area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl p-6 group hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                />
                <CardContent className="p-0 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    {category.popular && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-gray-400 text-sm">
                      {category.count} professionals
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SmartRecommendations
            location="Global"
            context="elite-homepage"
            maxRecommendations={3}
            showAIInsights={true}
          />
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
                  Ready to Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Perfect Match?
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
                    <Search className="w-5 h-5 mr-3" />
                    Find Services Now
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
                    Join as Provider
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
