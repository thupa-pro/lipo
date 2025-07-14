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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  MapPin,
  Users,
  Lightbulb,
  Handshake,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Globe,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  Star,
  Crown,
  Brain,
  Rocket,
  Building,
  Calendar,
  CheckCircle,
  Eye,
  Play,
} from "lucide-react";

export default function AboutUsPage() {
  const values = [
    {
      icon: Users,
      title: "Community Excellence",
      description:
        "We believe in empowering local communities by connecting individuals with exceptional service providers who share our commitment to quality and care.",
      gradient: "from-blue-500 to-cyan-500",
      stats: "2.1M+ users",
    },
    {
      icon: Brain,
      title: "AI Innovation",
      description:
        "Pioneering the future of service discovery with advanced machine learning that creates perfect matches between customers and providers.",
      gradient: "from-purple-500 to-pink-500",
      stats: "96.8% accuracy",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Building a platform where safety, reliability, and transparent communication create lasting relationships between customers and providers.",
      gradient: "from-emerald-500 to-green-500",
      stats: "100% verified",
    },
    {
      icon: Rocket,
      title: "Growth & Success",
      description:
        "Enabling service providers to scale their businesses while helping customers access premium services at fair, transparent pricing.",
      gradient: "from-orange-500 to-red-500",
      stats: "40% avg growth",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      description:
        "Former VP of Product at Uber, Harvard MBA. Passionate about local economies.",
      avatar: "SC",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      name: "Mike Rodriguez",
      role: "CTO & Co-Founder",
      description:
        "Ex-Google AI engineer, MIT PhD. Building the future of service matching.",
      avatar: "MR",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Emma Thompson",
      role: "Head of Community",
      description:
        "Former Airbnb Community Lead. Creating trust and safety at scale.",
      avatar: "ET",
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      name: "David Park",
      role: "Head of AI",
      description:
        "Stanford AI researcher. Making intelligent matching a reality.",
      avatar: "DP",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "Started with a vision to revolutionize local services",
      icon: Lightbulb,
      color: "from-blue-500 to-cyan-500",
    },
    {
      year: "2021",
      title: "AI Launch",
      description: "Introduced AI-powered matching technology",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
    },
    {
      year: "2022",
      title: "1M Users",
      description: "Reached first million verified users milestone",
      icon: Users,
      color: "from-emerald-500 to-green-500",
    },
    {
      year: "2023",
      title: "Global Scale",
      description: "Expanded to 180+ countries worldwide",
      icon: Globe,
      color: "from-orange-500 to-red-500",
    },
    {
      year: "2024",
      title: "Market Leader",
      description: "Became the #1 platform for premium local services",
      icon: Crown,
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    { label: "Active Users", value: "2.1M+", icon: Users },
    { label: "Service Providers", value: "500K+", icon: Handshake },
    { label: "Countries", value: "180+", icon: Globe },
    { label: "Services Completed", value: "10M+", icon: CheckCircle },
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
              Revolutionizing Local Services Since 2020
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Empowering
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Communities
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            We're building the world's most
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              intelligent platform{" "}
            </span>
            for local services, connecting communities and enabling prosperity.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
              asChild
            >
              <Link href="/careers">
                <Rocket className="w-5 h-5 mr-3" />
                Join Our Mission
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
            >
              <Play className="w-5 h-5 mr-3" />
              Watch Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Our Core Values
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              The principles that guide every decision we make and every
              innovation we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-5 transition-opacity duration-700`}
                />
                <CardContent className="p-8 relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    {value.title}
                  </h3>

                  <p className="text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {value.description}
                  </p>

                  <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {value.stats}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Our Journey
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              From a simple idea to the world's leading local services platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {milestones.map((milestone, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-6 relative z-10 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${milestone.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <milestone.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-2">
                    {milestone.year}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {milestone.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
              Passionate innovators building the future of local services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-700 hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-8 relative z-10 text-center">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-r ${member.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <span className="text-white font-bold text-2xl">
                      {member.avatar}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {member.name}
                  </h3>

                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                    {member.description}
                  </p>
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
                  Join Our
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Revolution
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                Be part of the movement that's transforming how the world finds
                and delivers local services.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-500 hover:via-purple-500 hover:to-emerald-500 dark:from-violet-600 dark:via-purple-600 dark:to-pink-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white rounded-2xl px-12 py-4 font-bold text-lg shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 transition-all duration-500"
                  asChild
                >
                  <Link href="/careers">
                    <Building className="w-5 h-5 mr-3" />
                    Work With Us
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-12 py-4 font-bold text-lg border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-blue-400 dark:hover:border-white/40 transition-all duration-500"
                  asChild
                >
                  <Link href="/contact">
                    <Heart className="w-5 h-5 mr-3" />
                    Get In Touch
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
