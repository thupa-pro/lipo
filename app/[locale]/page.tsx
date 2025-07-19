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
import AIAssistantWidget from "@/components/ai/ai-assistant-widget";
import AIServiceDiscovery from "@/components/ai/ai-service-discovery";
import { EnhancedHeroSection } from "@/components/home/enhanced-hero-section";
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
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />


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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="relative bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-6 sm:p-8 group hover:bg-white/10 transition-all duration-500 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-black"
                role="article"
                aria-labelledby={`stat-${index}-label`}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`,
                  }}
                  aria-hidden="true"
                />
                <CardContent className="p-0 relative z-10">
                  <div
                    className={`w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500`}
                    aria-hidden="true"
                  >
                    <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 text-white">
                    {stat.value}
                  </div>
                  <div
                    id={`stat-${index}-label`}
                    className="text-gray-400 mb-3 font-medium text-sm sm:text-base"
                  >
                    {stat.label}
                  </div>
                  <div className="text-xs sm:text-sm text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp
                      className="w-3 h-3 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6"
        aria-labelledby="services-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Why Choose Loconomy
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto px-4 sm:px-0">
              Experience the next generation of local services with AI-powered
              matching and verified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl p-6 sm:p-8 group hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-black"
                role="article"
                aria-labelledby={`service-${index}-title`}
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

      {/* AI Service Discovery */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                AI-Powered Discovery
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of service discovery with intelligent
              matching and personalized recommendations
            </p>
          </div>
          <AIServiceDiscovery
            context={{ currentPage: "homepage", location: "Global" }}
            showAdvancedFeatures={true}
            onServiceSelect={(service) => {
              console.log("Selected service:", service);
              // Handle service selection
            }}
          />
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SmartRecommendations
            location="Global"
            context="homepage"
            maxRecommendations={3}
            showAIInsights={true}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative z-10 py-20 sm:py-24 lg:py-32 px-4 sm:px-6"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div
              className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur-2xl opacity-10 dark:opacity-20"
              aria-hidden="true"
            />
            <div className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-blue-200/50 dark:border-white/10 shadow-2xl">
              <h2
                id="cta-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              >
                <span className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Ready to Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Perfect Match?
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-blue-700 dark:text-white mb-8 sm:mb-12 max-w-2xl mx-auto px-4 sm:px-0 font-medium">
                Join over 2 million users who trust Loconomy to connect them
                with exceptional local professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button
                  size="lg"
                  className="relative w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-8 sm:px-12 py-4 font-bold text-base sm:text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
                  asChild
                >
                  <Link
                    href="/auth/signup"
                    aria-label="Sign up to find services"
                  >
                    <Search className="w-5 h-5 mr-3" aria-hidden="true" />
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
                    <Heart className="w-5 h-5 mr-3" aria-hidden="true" />
                    Join as Provider
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Widget */}
      <AIAssistantWidget
        position="floating"
        size="normal"
        context={{
          currentPage: "homepage",
          userType: "visitor",
          location: "Global",
        }}
        theme="auto"
        showAgentSelector={true}
        enableVoice={true}
        autoSuggest={true}
        persistConversation={true}
        onAction={(action, data) => {
          console.log("AI Assistant action:", action, data);
          // Handle AI assistant actions
        }}
      />
    </div>
  );
}
