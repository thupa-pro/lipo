import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Jennifer Chen",
    role: "Homeowner & Entrepreneur",
    content:
      "Loconomy transformed how I manage my home services. The quality of providers is exceptional, and the booking process is seamless. I've saved hours of research time.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    company: "Tech Startup Founder",
    service: "Premium House Cleaning",
    backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
  },
  {
    name: "David Park",
    role: "Professional Service Provider",
    content:
      "Since joining Loconomy, my business has grown 300%. The platform connects me with quality clients and handles everything professionally. Best decision for my career.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    company: "Elite Home Services",
    service: "Master Plumber",
    backgroundImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop"
  },
  {
    name: "Maria Santos",
    role: "Busy Professional",
    content:
      "The peace of mind knowing all providers are verified and insured is invaluable. Customer support is white-glove level, and I trust them completely with my home.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    company: "Marketing Director",
    service: "Pet Care Specialist",
    backgroundImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop"
  },
];

export default function TestimonialsSection() {
  return (
    <PremiumSection
      variant="gradient"
      badge={{ icon: MessageCircle, text: "Success Stories" }}
      title="Trusted by Industry Leaders"
      description="See how professionals and customers are achieving exceptional results with our platform."
    >
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <PremiumCard
            key={index}
            variant="default"
            className="border-0 shadow-xl overflow-hidden group"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Background Header */}
            <div className="relative h-24 overflow-hidden">
              <Image
                src={testimonial.backgroundImage}
                alt={`${testimonial.name} background`}
                fill
                className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
              
              {/* Quote Icon */}
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Service Badge */}
              <div className="absolute bottom-4 right-4">
                <Badge className="bg-white/90 text-gray-800 text-xs">
                  {testimonial.service}
                </Badge>
              </div>
            </div>

            <PremiumCardContent className="p-6 -mt-4 relative z-10">
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 text-base leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-blue-200 dark:border-blue-800">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Trust Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Verified Review</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Trusted Customer</span>
                  </div>
                </div>
              </div>
            </PremiumCardContent>
          </PremiumCard>
        ))}
      </div>

      {/* Additional Trust Indicators */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
          </div>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Support Available</div>
          </div>
        </div>
      </div>
    </PremiumSection>
  );
}
