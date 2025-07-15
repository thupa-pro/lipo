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
import {
  Phone,
  Mail,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import AIChat from "@/components/ai/AIChat";

export default function ProviderSupportPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Request Sent!",
      description:
        "We've received your message and will get back to you shortly.",
      variant: "default",
    })(
      // Simulate form reset
      e.currentTarget as HTMLFormElement,
    ).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto max-w-4xl">
          <Briefcase className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Provider Support
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Dedicated support to help you manage your business and maximize your
            earnings.
          </p>
          <Button size="lg" onClick={() => router.push("/provider-resources")}>
            Visit Provider Resources
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              How Can We Help You Today?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the best way to get the assistance you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 mb-4">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Knowledge Base</h3>
                <p className="text-muted-foreground mb-4">
                  Find answers to common provider questions.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/help">Go to Knowledge Base</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-4">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Chat with a provider support specialist in real-time.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      title: "Live Chat",
                      description:
                        "Connecting you to a provider support specialist...",
                      variant: "default",
                    })
                  }
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 mb-4">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Submit a Ticket</h3>
                <p className="text-muted-foreground mb-4">
                  For detailed issues, submit a support ticket.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      title: "Ticket Submitted",
                      description: "Your support ticket has been created.",
                      variant: "default",
                    })
                  }
                >
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Contact Our Provider Success Team
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Jane Doe" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane.doe@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Question about my payout"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Urgent Assistance?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            For time-sensitive issues, reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                toast({
                  title: "Calling Support",
                  description: "Dialing 1-800-LOCONOMY...",
                  variant: "default",
                })
              }
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Us: 1-800-LOCONOMY
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                toast({
                  title: "Email Support",
                  description:
                    "Opening your email client to providers@loconomy.com...",
                  variant: "default",
                })
              }
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Us: providers@loconomy.com
            </Button>
          </div>
        </div>
      </section>

      {/* AI Provider Success Advisor */}
      <AIChat
        agentId="kai"
        context={{
          currentPage: "provider-support",
          accountType: "provider",
          businessType: "service_provider",
        }}
        position="floating"
        theme="brand"
        proactiveMessage={true}
      />
    </div>
  );
}
