import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Award, Infinity, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5813ae9f923e4ec2a07d2e1543fb6d54?alt=media&token=0ef56f97-041d-49cb-9f80-00350ad0d93b&apiKey=efd5169b47d04c9886e111b6074edfba"
          alt="Loconomy CTA Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-20 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <Badge className="bg-white/20 text-white border-white/30 mb-8 backdrop-blur-sm">
            <Infinity className="w-4 h-4 mr-1" />
            Join the Future of Local Services
          </Badge>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            Ready to Experience{" "}
            <span className="text-yellow-300 relative">
              Premium Service
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-300/50 rounded-full"></div>
            </span>?
          </h2>

          {/* Description */}
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join our elite network today and discover why thousands of
            professionals and customers choose Loconomy for exceptional service
            experiences that exceed expectations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link href="/request-service">
                <OptimizedIcon name="Clock" className="w-5 h-5 mr-2" />
                Book Premium Service
                <UIIcons.ArrowRight className="w-5 h-5 ml-2" / />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              asChild
            >
              <Link href="/become-provider">
                <Award className="w-5 h-5 mr-2" />
                Become Elite Provider
                <UIIcons.ArrowRight className="w-5 h-5 ml-2" / />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption"
              },
              {
                icon: CheckCircle,
                title: "Verified Network",
                description: "Background checked"
              },
              {
                icon: DollarSign,
                title: "Premium Pricing",
                description: "Transparent rates"
              },
              {
                icon: Users,
                title: "Elite Community",
                description: "Top 5% providers"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold text-sm mb-1">{feature.title}</div>
                <div className="text-xs opacity-75">{feature.description}</div>
              </div>
            ))}
          </div>

          {/* Statistics Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-black">50K+</div>
                <div className="text-sm opacity-75">Happy Customers</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-black">250K+</div>
                <div className="text-sm opacity-75">Jobs Completed</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-black">4.9★</div>
                <div className="text-sm opacity-75">Average Rating</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-black">1,200+</div>
                <div className="text-sm opacity-75">Cities Served</div>
              </div>
            </div>
          </div>

          {/* Final Encouragement */}
          <div className="mt-12">
            <p className="text-lg opacity-80 mb-4">
              🚀 Join the revolution in local services
            </p>
            <div className="flex items-center justify-center gap-4 text-sm opacity-60">
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
