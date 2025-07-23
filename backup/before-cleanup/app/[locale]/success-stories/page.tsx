"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, TrendingUp, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function SuccessStoriesPage() {
  const { toast } = useToast();
  const router = useRouter();

  const stories = [
    {
      name: "Maria, S.",
      role: "Professional Cleaner",
      avatar: "/placeholder.svg?height=60&width=60",
      quote:
        "Loconomy transformed my cleaning business. I went from struggling to find clients to having a full, schedule, all thanks to the platform's easy job matching and reliable payments.",
      impact: "Increased earnings by 200%",
      rating: 5,
    },
    {
      name: "John D.",
      role: "Handyman Extraordinaire",
      avatar: "/placeholder.svg?height=60&width=60",
      quote:
        "The flexibility Loconomy offers is unmatched. I can pick jobs that fit my, schedule, and the customer support is always there when I need it. It's truly helped me balance work and life.",
      impact: "Gained 50+ repeat customers",
      rating: 5,
    },
    {
      name: "Emily R.",
      role: "Certified Pet Sitter",
      avatar: "/placeholder.svg?height=60&width=60",
      quote:
        "I love connecting with pet owners through Loconomy. The app makes managing bookings and payments a, breeze, allowing me to focus on what I love most – caring for animals.",
      impact: "Expanded service area by 30%",
      rating: 5,
    },
    {
      name: "David K.",
      role: "Math Tutor",
      avatar: "/placeholder.svg?height=60&width=60",
      quote:
        "Finding students used to be a, challenge, but Loconomy changed that. I now have a steady stream of tutoring, requests, and the platform's tools help me track my sessions and progress.",
      impact: "Doubled monthly income",
      rating: 4.5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <div className="container mx-auto max-w-4xl">
          <TrendingUp className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Loconomy Success Stories
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Hear from the providers who are thriving and growing their
            businesses with Loconomy.
          </p>
          <Button size="lg" onClick={() => router.push("/become-provider")}>
            Share Your Story
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Real, Impact, Real Growth
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our providers are achieving their business goals and building
              lasting customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage src={story.avatar} alt={story.name} />
                      <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{story.name}</CardTitle>
                      <CardDescription className="mb-2">
                        {story.role}
                      </CardDescription>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < story.rating ? "fill-slate-700 text-slate-700 dark:fill-white dark:text-white" : "text-gray-300 dark:text-gray-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 italic flex items-start">
                    <Quote className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" />
                    {story.quote}
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">
                      Key Impact:
                    </div>
                    <div className="text-sm text-blue-700">{story.impact}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join Loconomy today and unlock your potential to grow your service
            business.
          </p>
          <Button size="lg" onClick={() => router.push("/become-provider")}>
            Become a Provider
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
