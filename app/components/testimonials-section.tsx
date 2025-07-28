import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Jennifer Chen",
    role: "Homeowner & Entrepreneur",
    content:
      "Loconomy transformed how I manage my home services. The quality of providers is exceptional, and the booking process is seamless. I've saved hours of research time.",
    rating: 5,
    avatar: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fcbb96f0619a54f1e9dbbe573fee86619?alt=media&token=0c7e60fa-8d21-4d4a-a476-7c691f913d51&apiKey=efd5169b47d04c9886e111b6074edfba",
    company: "Tech Startup Founder",
    service: "Premium House Cleaning",
    backgroundImage: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5ff17a00508548d89854319d66ecd561?alt=media&token=5a5c7b4b-2de4-4854-a99f-a678d73fb3d9&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    name: "David Park",
    role: "Professional Service Provider",
    content:
      "Since joining Loconomy, my business has grown 300%. The platform connects me with quality clients and handles everything professionally. Best decision for my career.",
    rating: 5,
    avatar: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F793e26ec4ad84eb5bf7ed547d87c7cd1?alt=media&token=4d0d2f61-0be7-4c6b-981d-e35f2fc0552f&apiKey=efd5169b47d04c9886e111b6074edfba",
    company: "Elite Home Services",
    service: "Master Plumber",
    backgroundImage: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F5b3a1b8e65bd49ec9d335e62168cf265?alt=media&token=f0548918-c262-48c2-8246-0c91aa4876c6&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    name: "Maria Santos",
    role: "Busy Professional",
    content:
      "The peace of mind knowing all providers are verified and insured is invaluable. Customer support is white-glove level, and I trust them completely with my home.",
    rating: 5,
    avatar: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fcbb96f0619a54f1e9dbbe573fee86619?alt=media&token=0c7e60fa-8d21-4d4a-a476-7c691f913d51&apiKey=efd5169b47d04c9886e111b6074edfba",
    company: "Marketing Director",
    service: "Pet Care Specialist",
    backgroundImage: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F793e26ec4ad84eb5bf7ed547d87c7cd1?alt=media&token=4d0d2f61-0be7-4c6b-981d-e35f2fc0552f&apiKey=efd5169b47d04c9886e111b6074edfba"
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
                  <OptimizedIcon name="Star"
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
