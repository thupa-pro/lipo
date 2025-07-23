import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import {
  Home,
  Wrench,
  Car,
  GraduationCap,
  Heart,
  Camera,
  Scissors,
  Paintbrush,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    icon: Home,
    name: "Home, Services",
    count: "2,400+ providers",
    gradient: "from-blue-500 to-cyan-500",
    description: "Cleaning, maintenance, repairs",
  },
  {
    icon: Wrench,
    name: "Professional Work",
    count: "1,800+ providers",
    gradient: "from-green-500 to-emerald-500",
    description: "Handyman, electrical, plumbing",
  },
  {
    icon: Car,
    name: "Auto & Transport",
    count: "1,200+ providers",
    gradient: "from-red-500 to-rose-500",
    description: "Car, wash, repairs, delivery",
  },
  {
    icon: GraduationCap,
    name: "Education",
    count: "900+ providers",
    gradient: "from-purple-500 to-violet-500",
    description: "Tutoring, coaching, training",
  },
  {
    icon: Heart,
    name: "Health & Wellness",
    count: "750+ providers",
    gradient: "from-pink-500 to-rose-500",
    description: "Fitness, therapy, nutrition",
  },
  {
    icon: Camera,
    name: "Creative Services",
    count: "650+ providers",
    gradient: "from-indigo-500 to-purple-500",
    description: "Photography, design, events",
  },
  {
    icon: Scissors,
    name: "Beauty & Personal",
    count: "550+ providers",
    gradient: "from-yellow-500 to-orange-500",
    description: "Hair, makeup, spa services",
  },
  {
    icon: Paintbrush,
    name: "Art & Design",
    count: "450+ providers",
    gradient: "from-teal-500 to-cyan-500",
    description: "Interior, design, art, crafts",
  },
];

export function CategoriesSection() {
  return (
    <PremiumSection
      variant="default"
      pattern="dots"
      badge={{ icon: Sparkles, text: "Premium Services" }}
      title="Elite Service Categories"
      description="Discover world-class service providers across diverse, categories, all verified and vetted for excellence."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <PremiumCard
            key={index}
            variant="default"
            className="cursor-pointer border-0 shadow-lg hover:shadow-2xl group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PremiumCardContent className="p-8">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
              >
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {category.count}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </PremiumCardContent>
          </PremiumCard>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button size="lg" variant="premium" asChild>
          <Link href="/browse">
            Explore All Categories
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </PremiumSection>
  );
}
