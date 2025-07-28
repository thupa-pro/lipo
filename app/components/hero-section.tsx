import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { OptimizedIcon, UIIcons, BusinessIcons } from "@/lib/icons/optimized-icons";
import { HeroSearchForm } from "./hero-search-form";
import { HeroStats } from "./hero-stats";

interface HeroSectionProps {
  locale?: string;
}

export function HeroSection({ locale = 'en' }: HeroSectionProps) {
  const heroContent = {
    en: {
      badge: "🏆 Elite AI-Powered Platform",
      title: "Find Elite Local Services",
      subtitle: "in Under 90 Seconds",
      description: "Experience the world's most advanced AI marketplace where elite professionals meet intelligent matching. Revolutionary service excellence through cutting-edge technology.",
      cta: "Find Services Now",
      secondary: "Become a Provider",
      testimonial: "Perfect matches every time!",
      testimonialAuthor: "Sarah Johnson"
    },
    es: {
      badge: "🏆 Plataforma Elite con IA",
      title: "Encuentra Servicios Locales Elite",
      subtitle: "en Menos de 90 Segundos",
      description: "Experimenta el marketplace de IA más avanzado del mundo donde profesionales elite se encuentran con emparejamiento inteligente.",
      cta: "Buscar Servicios",
      secondary: "Convertirse en Proveedor",
      testimonial: "¡Coincidencias perfectas siempre!",
      testimonialAuthor: "Sarah Johnson"
    }
  };

  const content = heroContent[locale as keyof typeof heroContent] || heroContent.en;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Premium Badge */}
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 text-sm font-semibold">
              {content.badge}
            </Badge>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {content.title}
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {content.subtitle}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                {content.description}
              </p>
            </div>

            {/* Search Form - Client Component */}
            <HeroSearchForm locale={locale} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 h-12 px-8">
                <OptimizedIcon name="Search" className="w-5 h-5 mr-2" />
                {content.cta}
              </Button>
              
              <Button variant="outline" size="lg" className="h-12 px-8 border-gray-200 hover:bg-gray-50">
                <OptimizedIcon name="Users" className="w-5 h-5 mr-2" />
                {content.secondary}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2">
                <OptimizedIcon name="Shield" className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <OptimizedIcon name="Clock" className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">90-Second Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <OptimizedIcon name="Star" className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">5-Star Service</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className="relative">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-dashboard.webp"
                alt="Loconomy Platform Dashboard"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJiv/Z"
              />
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <OptimizedIcon name="TrendingUp" className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">98% Success</div>
                    <div className="text-xs text-gray-500">Match Rate</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <OptimizedIcon name="Clock" className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">87 sec</div>
                    <div className="text-xs text-gray-500">Avg. Match Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <Card className="absolute -bottom-8 right-8 p-4 bg-white/95 backdrop-blur-sm border-0 shadow-xl max-w-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  SJ
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <OptimizedIcon key={i} name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">"{content.testimonial}"</p>
                  <p className="text-xs text-gray-500">{content.testimonialAuthor}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Stats */}
        <HeroStats />
      </div>
    </section>
  );
}
