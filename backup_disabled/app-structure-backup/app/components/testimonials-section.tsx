import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer, Chen",
    role: "Homeowner & Entrepreneur",
    content:
      "Loconomy, transformed how, I manage, my home, services. The, quality of, providers is, exceptional, and, the booking, process is, seamless.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    company: "Tech Startup Founder",
  },
  {
    name: "David Park",
    role: "Professional Service Provider",
    content:
      "Since joining, Loconomy, my business has grown 300%. The platform connects me with quality clients and handles everything professionally.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    company: "Elite Home Services",
  },
  {
    name: "Maria Santos",
    role: "Busy Professional",
    content:
      "The peace of mind knowing all providers are verified and insured is invaluable. Customer support is white-glove level.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    company: "Marketing Director",
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
            className="border-0 shadow-xl"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <PremiumCardContent className="p-8">
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-slate-700 text-slate-700 dark:fill-white dark:text-white"
                  />
                ))}
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed italic">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-blue-200">
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
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </PremiumCardContent>
          </PremiumCard>
        ))}
      </div>
    </PremiumSection>
  );
}
