"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles, Users
  Send,
  MessageCircle,
  Heart,
  Globe,
  Headphones
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function ContactUsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description:
        "Thank you for contacting us. We'll get back to you shortly.",
      variant: "default",
    });
    // ✅ Fixed: Properly cast form element for reset
    (e.currentTarget as HTMLFormElement).reset();
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@loconomy.com",
      response: "Within 24 hours",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      response: "Mon-Fri 9AM-6PM EST",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with support",
      contact: "Available 24/7",
      response: "Instant response",
      color: "from-purple-500 to-violet-600",
    },
  ];

  const stats = [
    {
      value: "<5min",
      label: "Avg Response Time",
      icon: Clock,
      color: "from-blue-500 to-cyan-600",
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: Headphones,
      color: "from-emerald-500 to-teal-600",
    },
    {
      value: "99.9%",
      label: "Customer Satisfaction",
      icon: Heart,
      color: "from-pink-500 to-rose-600",
    },
    {
      value: "180+",
      label: "Countries Served",
      icon: Globe,
      color: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Animated Background - Same as Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                We're Here to Help • 24/7 Support
              </span>
              <MessageSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-none">
              <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                Get in
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you! Reach out with any questions,
              feedback, or inquiries. Our team is ready to provide
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
                {" "}
                exceptional support{" "}
              </span>
              whenever you need it.
            </p>

            <Button
              size="lg"
              onClick={() =>
                toast({
                  title: "Live Chat",
                  description: "Connecting you to a support agent...",
                  variant: "default",
                })
              }
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Live Chat
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="relative bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-6 group hover:bg-white/10 transition-all duration-500 hover:scale-105"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${stat.color.replace("from-", "").replace(" to-", ", ")})`,
                    }}
                  />
                  <CardContent className="p-0 relative z-10 text-center">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-black mb-1 text-white">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Choose Your Preferred Method
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-400">
                Multiple ways to reach our support team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl p-8 group hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                  />
                  <CardContent className="p-0 relative z-10 text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <method.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-slate-600 dark:text-gray-300 mb-4">
                      {method.description}
                    </p>
                    <div className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                      {method.contact}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-gray-400">
                      {method.response}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl">
              <CardHeader className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you as soon as
                  possible
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-lg font-semibold text-slate-700 dark:text-gray-300"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        required
                        className="mt-2 h-12 bg-white/70 dark:bg-white/5 border-blue-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-lg font-semibold text-slate-700 dark:text-gray-300"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="mt-2 h-12 bg-white/70 dark:bg-white/5 border-blue-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="subject"
                      className="text-lg font-semibold text-slate-700 dark:text-gray-300"
                    >
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      required
                      className="mt-2 h-12 bg-white/70 dark:bg-white/5 border-blue-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-lg font-semibold text-slate-700 dark:text-gray-300"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      className="mt-2 bg-white/70 dark:bg-white/5 border-blue-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl py-4 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
