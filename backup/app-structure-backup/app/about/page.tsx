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
  Gem,
  CircuitBoard,
  Trophy,
  Infinity,
  BookOpen,
  GraduationCap,
  Landmark
} from "lucide-react";

export default function AboutUsPage() {
  const coreValues = [
    {
      icon: Brain,
      title: "Revolutionary, AI Innovation",
      description:
        "We're, pioneering the, future of, marketplace intelligence, with proprietary, neural networks, that understand, both human, needs and, service excellence, at an, unprecedented level.",
      gradient: "from-violet-600 to-purple-600",
      stats: "50+ AI, models",
    },
    {
      icon: Crown,
      title: "Elite Excellence Standard",
      description:
        "Our commitment to quality is unwavering. We maintain the highest standards in the, industry, ensuring only the top 8% of service providers join our exclusive network.",
      gradient: "from-amber-500 to-orange-500",
      stats: "Top 8% only",
    },
    {
      icon: Globe,
      title: "Global Impact Mission",
      description:
        "We're not just building a platform; we're creating a movement that empowers local communities worldwide while setting new standards for service excellence.",
      gradient: "from-emerald-600 to-green-500",
      stats: "127 cities",
    },
    {
      icon: Rocket,
      title: "Future-Forward Vision",
      description:
        "Every decision we make is guided by our vision of tomorrow's service economy—where AI and human expertise combine to create extraordinary experiences.",
      gradient: "from-blue-600 to-cyan-500",
      stats: "Next-gen tech",
    },
    {
      icon: Shield,
      title: "Fortress-Level Trust",
      description:
        "Security, privacy, and trust aren't features—they're the foundation. We protect every interaction with military-grade security and comprehensive coverage.",
      gradient: "from-red-600 to-pink-500",
      stats: "$1M+ protected",
    },
    {
      icon: Heart,
      title: "Community-Centric Purpose",
      description:
        "At our, core, we believe in strengthening local communities by connecting exceptional service providers with customers who value quality and craftsmanship.",
      gradient: "from-pink-600 to-rose-500",
      stats: "2.1M+ served",
    }
  ];

  const leadershipTeam = [
    {
      name: "Dr. Elena Rodriguez",
      role: "Chief Executive Officer & Co-Founder",
      image: "/api/placeholder/150/150",
      bio: "Former VP of AI at, Google, PhD in Machine Learning from Stanford. 15+ years building transformative AI products at scale.",
      linkedin: "#",
      achievements: ["Forbes 40 Under 40", "MIT Technology Review Innovator", "TechCrunch Disruptor Award"]
    },
    {
      name: "Marcus Chen",
      role: "Chief Technology Officer & Co-Founder",
      image: "/api/placeholder/150/150", 
      bio: "Ex-Principal Engineer at Tesla, Autopilot, former Apple Core ML team. Expert in real-time AI systems and scalable architectures.",
      linkedin: "#",
      achievements: ["ACM Distinguished Scientist", "Apple Innovation Award", "Y Combinator Alumni"]
    },
    {
      name: "Sarah Williams",
      role: "Chief Operating Officer",
      image: "/api/placeholder/150/150",
      bio: "Former Director of Operations at, Airbnb, MBA from Wharton. Scaled marketplace operations across 100+ countries.",
      linkedin: "#",
      achievements: ["Marketplace Excellence Award", "Operations Leader of the Year", "Harvard Business Review Case Study"]
    },
    {
      name: "Dr. David Kim",
      role: "Chief AI Officer",
      image: "/api/placeholder/150/150",
      bio: "Former Research Scientist at, DeepMind, PhD in Computer Vision from MIT. Pioneer in multimodal AI systems.",
      linkedin: "#",
      achievements: ["Nature AI Research Award", "NIPS Best Paper", "AI Ethics Leadership Recognition"]
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Foundation of Excellence",
      description: "Loconomy founded with $15M seed funding from tier-1 VCs. Initial AI models developed.",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2023", 
      title: "AI Breakthrough",
      description: "Proprietary neural matching algorithm achieved 97.8% satisfaction rate. Series A $50M raised.",
      icon: Brain,
      color: "from-violet-500 to-purple-500"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Launched in 127 cities worldwide. 2.1M+ users joined the platform. Industry leadership established.",
      icon: Globe,
      color: "from-emerald-500 to-green-500"
    },
    {
      year: "2025",
      title: "Next Frontier",
      description: "AR, integration, voice, AI, and predictive analytics. Setting the standard for tomorrow's marketplace.",
      icon: Gem,
      color: "from-amber-500 to-orange-500"
    }
  ];

  const achievements = [
    {
      title: "Industry Recognition",
      items: [
        "TechCrunch Disruptor Award 2024",
        "Forbes AI Company of the Year",
        "Wired Innovation Excellence",
        "CB Insights AI 100 List"
      ]
    },
    {
      title: "Market Leadership",
      items: [
        "97.8% customer satisfaction rate",
        "12M+ successful service connections",
        "Top 8% provider acceptance rate", 
        "68-second average matching time"
      ]
    },
    {
      title: "Technology Innovations",
      items: [
        "50+ proprietary AI models",
        "Real-time neural matching",
        "Military-grade security",
        "Multi-modal AI interface"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/50 py-24 md:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-100/80 to-purple-100/80 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200/50 dark:border-violet-700/50 backdrop-blur-sm mb-8">
            <Landmark className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              Established 2022 • Industry Pioneer
            </span>
            <Trophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8">
            <span className="bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 dark:from-white dark:via-violet-400 dark:to-white bg-clip-text text-transparent">
              Redefining
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Service Excellence
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 dark:from-white dark:via-violet-400 dark:to-white bg-clip-text text-transparent">
              Through AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed mb-12">
            We're not just building a marketplace—we're engineering the future of how{" "}
            <span className="text-violet-600 dark:text-violet-400 font-semibold">exceptional service providers</span>{" "}
            and discerning customers connect through{" "}
            <span className="text-violet-600 dark:text-violet-400 font-semibold">revolutionary AI technology</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/careers" className="flex items-center gap-3">
                <Rocket className="w-6 h-6" />
                Join Our Mission
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-12 text-lg font-semibold border-2 border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/vision" className="flex items-center gap-3">
                <Eye className="w-6 h-6" />
                Our Vision
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-slate-900 dark:text-white">
                Our
              </span>{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              The principles that drive every, decision, every, innovation, and every interaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="group relative overflow-hidden border-2 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 transform hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardHeader className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {value.description}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${value.gradient} text-white text-sm font-semibold`}>
                    <Star className="w-4 h-4" />
                    {value.stats}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50/50 to-violet-50/30 dark:from-slate-900/50 dark:to-violet-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Visionary Leadership
              </span>{" "}
              <span className="text-slate-900 dark:text-white">
                Team
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              World-class experts from the industry's most innovative companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {leadershipTeam.map((leader, index) => (
              <Card key={index} className="group overflow-hidden border-2 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24 border-4 border-violet-200 dark:border-violet-700">
                      <AvatarImage src={leader.image} alt={leader.name} />
                      <AvatarFallback className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-lg font-bold">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                        {leader.name}
                      </h3>
                      <p className="text-violet-600 dark:text-violet-400 font-semibold mb-4">
                        {leader.role}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {leader.bio}
                      </p>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Key Achievements:
                        </p>
                        {leader.achievements.map((achievement, i) => (
                          <Badge key={i} variant="secondary" className="mr-2 mb-2">
                            <Trophy className="w-3 h-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-slate-900 dark:text-white">
                Our Journey to
              </span>{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Milestones that define our commitment to revolutionary innovation
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1 px-8">
                    <Card className="border-2 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 transform hover:scale-105">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${milestone.color} flex items-center justify-center shadow-lg`}>
                            <milestone.icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="outline" className="text-lg px-4 py-2 font-bold">
                            {milestone.year}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full border-4 border-white dark:border-slate-950 shadow-lg"></div>
                  
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50/50 to-violet-50/30 dark:from-slate-900/50 dark:to-violet-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Recognition
              </span>{" "}
              <span className="text-slate-900 dark:text-white">
                & Impact
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Industry accolades that validate our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((category, index) => (
              <Card key={index} className="border-2 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center text-violet-600 dark:text-violet-400">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-3xl p-12 border-2 border-violet-200/50 dark:border-violet-700/50">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-slate-900 dark:text-white">
                Join the
              </span>{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Revolution
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Be part of the team that's redefining how the world connects with exceptional service providers through revolutionary AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/careers" className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  Explore Careers
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 text-lg font-semibold border-2 border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/contact" className="flex items-center gap-3">
                  <Handshake className="w-6 h-6" />
                  Partner With Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
