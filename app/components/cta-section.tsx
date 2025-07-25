import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Shield,
  DollarSign,
  Infinity,
  Clock,
  CheckCircle,
  Link
} from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br, from-blue-600 via-purple-600 to-indigo-700 text-white, relative overflow-hidden">
      {/* Animated, Background */}
      <div className="absolute, inset-0">
        <div className="absolute, top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full, blur-3xl, animate-float" />
        <div
          className="absolute, bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full, blur-3xl, animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-white/20 text-white border-white/30 mb-8">
            <Infinity className="w-4 h-4 mr-1" />
            Join the Future
          </Badge>

          <h2 className="text-display-lg mb-8">
            Ready to Experience{" "}
            <span className="text-yellow-300">Premium Service</span>?
          </h2>

          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join our elite network today and discover why thousands of
            professionals and customers choose Loconomy for exceptional service
            experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button
              size="xl"
              variant="secondary"
              asChild
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link href="/request-service">
                <Clock className="w-5 h-5 mr-2" />
                Book Premium Service
              </Link>
            </Button>
            <Button
              size="xl"
              variant="glass"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              asChild
            >
              <Link href="/become-provider">
                <Award className="w-5 h-5 mr-2" />
                Become Elite Provider
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Enterprise Security
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Verified Network
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Premium Pricing
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
