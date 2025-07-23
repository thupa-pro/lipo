import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Users,
  Shield,
  CreditCard,
  Settings,
} from "lucide-react";
import Link from "next/link";

const faqData = [
  {
    category: "Getting, Started",
    questions: [
      {
        question: "How, do I, book a, service?",
        answer:
          "You, can book, a service, by browsing, our, categories, selecting, a, provider, and, choosing your, preferred time, slot. Payment, is processed, securely after, the service, is completed.",
      },
      {
        question: "How do I become a service provider?",
        answer:
          "Click on 'Become a Provider' in the navigation, menu, complete the application, process, and submit your verification documents. We'll review your application within 24-48 hours.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we use bank-level encryption and secure payment processing. Your payment information is never stored on our servers and all transactions are PCI compliant.",
      },
    ],
  },
  {
    category: "Bookings",
    questions: [
      {
        question: "Can I cancel or reschedule a booking?",
        answer:
          "Yes, you can cancel or reschedule up to 24 hours before your appointment without any fees. Less than 24 hours may incur a cancellation fee.",
      },
      {
        question: "What if I'm not satisfied with the service?",
        answer:
          "We have a satisfaction guarantee. Contact our support team within 24 hours and we'll work with you to resolve any issues or provide a refund if necessary.",
      },
      {
        question: "How do I track my service provider?",
        answer:
          "Once your booking is, confirmed, you'll receive real-time updates and can track your provider's location through the app.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        question: "When am I charged for a service?",
        answer:
          "Payment is automatically processed after the service is marked as completed by the provider. You'll receive a receipt via email.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit, cards, debit, cards, digital wallets (Apple, Pay, Google Pay), and bank transfers.",
      },
      {
        question: "How do refunds work?",
        answer:
          "Refunds are processed within 3-5 business days to your original payment method. The timeline may vary depending on your bank or card issuer.",
      },
    ],
  },
];

const contactOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageSquare,
    action: "Start Chat",
    available: "24/7",
  },
  {
    title: "Phone Support",
    description: "Speak directly with a support representative",
    icon: Phone,
    action: "Call (555) 123-HELP",
    available: "Mon-Fri 9AM-6PM EST",
  },
  {
    title: "Email Support",
    description: "Send us a detailed message about your issue",
    icon: Mail,
    action: "Send Email",
    available: "Response within 4 hours",
  },
];

const quickLinks = [
  {
    title: "Account Settings",
    description: "Manage your profile and preferences",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Payment Methods",
    description: "Add or update payment information",
    icon: CreditCard,
    href: "/payments",
  },
  {
    title: "Safety Guidelines",
    description: "Learn about our safety and security measures",
    icon: Shield,
    href: "/safety",
  },
  {
    title: "Community Guidelines",
    description: "Understand our community standards",
    icon: Users,
    href: "/community",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to your questions and get the help you need
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for help, articles, guides, and FAQs..."
                className="pl-12 py-3 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => (
            <Card
              key={link.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <link.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{link.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {link.description}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={link.href}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="getting-started" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="getting-started">
                    Getting Started
                  </TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>

                {faqData.map((category) => (
                  <TabsContent
                    key={category.category}
                    value={category.category.toLowerCase().replace(" ", "-")}
                    className="mt-6"
                  >
                    <div className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">
                              {faq.question}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactOptions.map((option) => (
                <Card key={option.title}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <option.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{option.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {option.description}
                        </p>
                        <Badge variant="secondary" className="text-xs mb-3">
                          {option.available}
                        </Badge>
                        <Button size="sm" className="w-full">
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Popular Articles */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Popular Help Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "How to verify your identity",
                "Understanding service pricing",
                "Tips for a great service experience",
                "How to leave reviews and ratings",
                "Managing your notifications",
                "Setting up auto-payments",
              ].map((article, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="flex-1">{article}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>99.9% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Average response time: 2 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
