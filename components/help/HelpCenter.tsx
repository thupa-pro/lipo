"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  User,
  Tag,
  Filter,
  ArrowRight,
  Play,
  Download,
  Share2,
  Bookmark,
  Copy,
  AlertCircle,
  Info,
  Lightbulb,
  Code,
  Terminal,
  Globe,
  Shield,
  Settings,
  Users,
  CreditCard,
  Package,
  Truck,
  MapPin,
  Calendar,
  Bell,
  Eye,
  TrendingUp,
  Plus,
  Edit,
  Clock,
  MessageSquare,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date;
  views: number;
  rating: number;
  helpful: number;
  notHelpful: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  type: "article" | "tutorial" | "video" | "api";
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  responses: {
    id: string;
    message: string;
    author: string;
    timestamp: Date;
    isStaff: boolean;
  }[];
}

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState("knowledge-base");
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockArticles: HelpArticle[] = [
    {
      id: "1",
      title: "Getting Started with Loconomy",
      slug: "getting-started",
      category: "Getting Started",
      tags: ["basics", "setup", "onboarding"],
      content: "# Getting Started\n\nWelcome to Loconomy...",
      excerpt: "Learn how to set up your account and start using the platform",
      author: { name: "Sarah Johnson", avatar: "👩‍💼" },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 15420,
      rating: 4.8,
      helpful: 892,
      notHelpful: 23,
      difficulty: "beginner",
      estimatedTime: 5,
      type: "article",
    },
    {
      id: "2",
      title: "How to Book a Service",
      slug: "how-to-book-service",
      category: "Booking Services",
      tags: ["booking", "services", "customers"],
      content: "# Booking a Service\n\nStep-by-step guide...",
      excerpt: "Complete guide to booking services on the platform",
      author: { name: "Mike Chen", avatar: "👨‍💻" },
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      views: 12340,
      rating: 4.6,
      helpful: 734,
      notHelpful: 41,
      difficulty: "beginner",
      estimatedTime: 8,
      type: "tutorial",
    },
    {
      id: "3",
      title: "API Authentication",
      slug: "api-authentication",
      category: "API Documentation",
      tags: ["api", "authentication", "developers"],
      content: "# API Authentication\n\nImplement secure API access...",
      excerpt: "Learn how to authenticate with the Loconomy API",
      author: { name: "Emma Wilson", avatar: "👩‍🎨" },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      views: 8950,
      rating: 4.9,
      helpful: 456,
      notHelpful: 12,
      difficulty: "advanced",
      estimatedTime: 15,
      type: "api",
    },
    {
      id: "4",
      title: "Payment Processing Tutorial",
      slug: "payment-processing",
      category: "Payments",
      tags: ["payments", "stripe", "billing"],
      content: "# Payment Processing\n\nVideo tutorial...",
      excerpt: "Video walkthrough of payment processing features",
      author: { name: "David Brown", avatar: "👨‍🔧" },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 6780,
      rating: 4.7,
      helpful: 321,
      notHelpful: 18,
      difficulty: "intermediate",
      estimatedTime: 12,
      type: "video",
    },
  ];

  const mockFaqs: FAQ[] = [
    {
      id: "1",
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. Enter your email, address, and we'll send you a reset link.",
      category: "Account",
      helpful: 245,
      notHelpful: 8,
      tags: ["password", "account", "security"],
    },
    {
      id: "2",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Payment processing is handled securely through Stripe.",
      category: "Payments",
      helpful: 189,
      notHelpful: 12,
      tags: ["payments", "billing", "stripe"],
    },
    {
      id: "3",
      question: "How do I cancel a booking?",
      answer: "You can cancel a booking up to 24 hours before the scheduled time through your dashboard. Go to 'My Bookings' and click 'Cancel' next to the booking you want to cancel.",
      category: "Bookings",
      helpful: 167,
      notHelpful: 5,
      tags: ["booking", "cancel", "refund"],
    },
    {
      id: "4",
      question: "Is my personal information secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We comply with GDPR and other privacy regulations. We never share your personal information with third parties without your consent.",
      category: "Security",
      helpful: 298,
      notHelpful: 3,
      tags: ["security", "privacy", "gdpr"],
    },
  ];

  const mockTickets: SupportTicket[] = [
    {
      id: "TK-001",
      subject: "Payment not processing",
      description: "I'm trying to make a payment for a cleaning service but the payment keeps failing.",
      status: "in-progress",
      priority: "high",
      category: "Payments",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      assignedTo: "Support Team",
      responses: [
        {
          id: "1",
          message: "I'm having trouble completing my payment for booking #1234. The card keeps getting declined even though I have sufficient funds.",
          author: "John Smith",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isStaff: false,
        },
        {
          id: "2",
          message: "Hi, John, thanks for reaching out. I can see the issue in our system. It looks like there might be a temporary issue with your card provider. Can you try using a different card or payment method?",
          author: "Sarah (Support)",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isStaff: true,
        },
      ],
    },
    {
      id: "TK-002",
      subject: "Can't access my dashboard",
      description: "I'm getting an error when trying to log into my provider dashboard.",
      status: "resolved",
      priority: "medium",
      category: "Technical",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      assignedTo: "Tech Team",
      responses: [
        {
          id: "1",
          message: "When I try to access my provider, dashboard, I get a 500 error. This started happening yesterday.",
          author: "Maria Garcia",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isStaff: false,
        },
        {
          id: "2",
          message: "Hi, Maria, we've identified and fixed the issue. The dashboard should be working normally now. Please try logging in again and let us know if you have any further issues.",
          author: "Mike (Tech Support)",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isStaff: true,
        },
      ],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setArticles(mockArticles);
      setFaqs(mockFaqs);
      setTickets(mockTickets);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    "Getting Started",
    "Booking Services", 
    "Payments",
    "API Documentation",
    "Account Management",
    "Security",
    "Technical",
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-4 h-4" />;
      case "tutorial":
        return <BookOpen className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "api":
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-50 border-green-200";
      case "intermediate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "advanced":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "in-progress":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      case "closed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to your, questions, browse our, documentation, and get support when you need it
        </p>
        
        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help, articles, tutorials, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">Learn the basics and set up your account</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Video className="w-8 h-8 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground">Watch step-by-step video guides</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Code className="w-8 h-8 mx-auto text-purple-600 mb-3" />
            <h3 className="font-semibold mb-2">API Docs</h3>
            <p className="text-sm text-muted-foreground">Developer documentation and examples</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto text-orange-600 mb-3" />
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <p className="text-sm text-muted-foreground">Get help from our support team</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="api-docs">API Docs</TabsTrigger>
        </TabsList>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(article.type)}
                      <Badge variant="outline">{article.type}</Badge>
                    </div>
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {article.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.estimatedTime} min read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span>{article.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{article.author.name}</span>
                    </div>
                    <Button size="sm">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <Badge variant="outline">{faq.category}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{faq.answer}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Was this helpful?</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {faq.helpful}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          {faq.notHelpful}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Options */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-card hover:bg-accent cursor-pointer">
                    <MessageSquare className="w-5 h-5 text-ai-600" />
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-muted-foreground">Average response: 2 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-card hover:bg-accent cursor-pointer">
                    <Mail className="w-5 h-5 text-success-600" />
                    <div>
                      <h4 className="font-medium">Email Support</h4>
                      <p className="text-sm text-muted-foreground">support@loconomy.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-card hover:bg-accent cursor-pointer">
                    <Phone className="w-5 h-5 text-premium-600" />
                    <div>
                      <h4 className="font-medium">Phone Support</h4>
                      <p className="text-sm text-muted-foreground">1-800-LOCONOMY</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create New Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Input placeholder="Brief description of your issue" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Please provide detailed information about your issue..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Support Tickets */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-card p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground">#{ticket.id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{ticket.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                            <span>Updated: {ticket.updatedAt.toLocaleDateString()}</span>
                            {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* API Documentation Tab */}
        <TabsContent value="api-docs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* API Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">API Reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "Authentication", icon: Shield },
                    { name: "Services", icon: Package },
                    { name: "Bookings", icon: Calendar },
                    { name: "Payments", icon: CreditCard },
                    { name: "Users", icon: Users },
                    { name: "Webhooks", icon: Zap },
                    { name: "Analytics", icon: TrendingUp },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* API Content */}
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started with the API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The Loconomy API allows you to integrate our services into your applications. 
                    Our REST API uses JSON for requests and responses.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-card">
                    <h4 className="font-medium mb-2">Base URL</h4>
                    <code className="text-sm">https://api.loconomy.com/v1</code>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Quick Start</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Get your API key from the dashboard</li>
                      <li>Include the key in your request headers</li>
                      <li>Make your first API call</li>
                    </ol>
                  </div>

                  <Button>
                    <Code className="w-4 h-4 mr-2" />
                    View Full Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-card font-mono text-sm overflow-x-auto">
                    <div className="text-gray-400">// Get all services</div>
                    <div><span className="text-blue-400">curl</span> -X GET \</div>
                    <div className="ml-4">https://api.loconomy.com/v1/services \</div>
                    <div className="ml-4">-H <span className="text-yellow-400">"Authorization: Bearer YOUR_API_KEY"</span> \</div>
                    <div className="ml-4">-H <span className="text-yellow-400">"Content-Type: application/json"</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
