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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, Lightbulb, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feedback Submitted!",
      description:
        "Thank you for your valuable feedback. We appreciate your input!",
      variant: "default",
    });
    // Simulate form reset
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl">
          <Lightbulb className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Share Your Feedback
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your insights help us improve Loconomy for everyone. Tell us what
            you think!
          </p>
          <Button size="lg" onClick={() => router.push("/contact")}>
            Contact Support
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tell Us What You Think</h2>
            <p className="text-muted-foreground">
              Your honest feedback is crucial for our continuous improvement.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="feedback-type">
                    What kind of feedback is this?
                  </Label>
                  <RadioGroup
                    defaultValue="suggestion"
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="suggestion" id="suggestion" />
                      <Label htmlFor="suggestion" className="cursor-pointer">
                        Suggestion
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="bug" id="bug" />
                      <Label htmlFor="bug" className="cursor-pointer">
                        Bug Report
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="compliment" id="compliment" />
                      <Label htmlFor="compliment" className="cursor-pointer">
                        Compliment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="rating">
                    How would you rate your overall experience?
                  </Label>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-8 h-8 text-slate-700 dark:text-white fill-current cursor-pointer"
                        onClick={() =>
                          toast({
                            title: "Rating Submitted",
                            description: `You rated ${star} stars!`,
                            variant: "default",
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Your Feedback</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Describe your feedback in detail..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Your Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Your Voice Matters</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We actively review all feedback to make Loconomy better for our
            entire community.
          </p>
          <Button size="lg" onClick={() => router.push("/community")}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Join the Community Discussion
          </Button>
        </div>
      </section>
    </div>
  );
}
