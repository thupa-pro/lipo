import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card";
import { PremiumSection } from "@/components/ui/premium-section";
import Image from "next/image";
import { Wrench, Car, GraduationCap, Heart, Camera, Scissors, Paintbrush, Sparkles } from "lucide-react";

const categories = [
  {
    icon: Home,
    name: "Home Services",
    count: "2,400+ providers",
    gradient: "from-ai to-trust",
    description: "Cleaning, maintenance, repairs",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fb2459d5036794deb84d52bf82ca745cd?alt=media&token=4fdbb222-3123-42c6-841c-0c811ce9f2d7&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    icon: Wrench,
    name: "Professional Work",
    count: "1,800+ providers",
    gradient: "from-trust to-success",
    description: "Handyman, electrical, plumbing",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fc84ae154ac94479691e1046893001a2d?alt=media&token=c7099c88-9280-4da7-b35c-b5f58763194c&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    icon: Car,
    name: "Auto & Transport",
    count: "1,200+ providers",
    gradient: "from-destructive to-warning",
    description: "Car wash, repairs, delivery",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F6a812cf3fada40e8a56166bfb07c5a39?alt=media&token=d77ca34f-c367-436a-90ed-34fa2898ae6f&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    icon: GraduationCap,
    name: "Education",
    count: "900+ providers",
    gradient: "from-primary to-ai",
    description: "Tutoring, coaching, training",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F2d1b9717651f4661982da5e0f4f11d8c?alt=media&token=018784fd-f15a-4fd5-b3d0-39354815b3cb&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    icon: Heart,
    name: "Health & Wellness",
    count: "750+ providers",
    gradient: "from-premium to-destructive",
    description: "Fitness, therapy, nutrition",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Faa64b10a73474c169cc7fb3fc239e3db?alt=media&token=f032bf2e-d00d-4795-9e44-7fd13eee8daa&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    icon: Camera,
    name: "Creative Services",
    count: "650+ providers",
    gradient: "from-ai to-primary",
    description: "Photography, design, events",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F6933a12df7534198b49b37c4cae71b5c?alt=media&token=13404641-8e22-40b1-9db5-c9e80c311472&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    icon: Scissors,
    name: "Beauty & Personal",
    count: "550+ providers",
    gradient: "from-premium to-warning",
    description: "Hair, makeup, spa services",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2Fee83a8904a0d4a6d97fa663f79580e9d?alt=media&token=ce032fe6-8214-4b5b-8b63-c2ccf20d9501&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
  {
    icon: Paintbrush,
    name: "Art & Design",
    count: "450+ providers",
    gradient: "from-trust to-ai",
    description: "Interior design, art, crafts",
    image: "https://cdn.builder.io/o/assets%2Fefd5169b47d04c9886e111b6074edfba%2F44e95d003c2e440d8442038d194fd292?alt=media&token=7d8f7b65-9156-4b58-92e4-be0233254eba&apiKey=efd5169b47d04c9886e111b6074edfba"
  },
];

export function CategoriesSection() {
  return (
    <PremiumSection
      variant="default"
      pattern="dots"
      badge={{ icon: Sparkles, text: "Premium Services" }}
      title="Elite Service Categories"
      description="Discover world-class service providers across diverse categories, all verified and vetted for excellence."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <PremiumCard
            key={index}
            variant="default"
            className="cursor-pointer border-0 shadow-lg hover:shadow-2xl group overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PremiumCardContent className="p-0">
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Icon Badge */}
                <div
                  className={`absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>

                {/* Provider Count */}
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {category.count}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Explore Category
                  </span>
                  <UIIcons.ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" / />
                </div>
              </div>
            </PremiumCardContent>
          </PremiumCard>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link href="/browse">
            Explore All Categories
            <UIIcons.ArrowRight className="w-5 h-5 ml-2" / />
          </Link>
        </Button>
      </div>
    </PremiumSection>
  );
}
