"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  Users, 
  Briefcase,
  Crown, Star, 
  Settings,
  CreditCard,
  BarChart3
  Plus,
  Search,
  Sparkles,
  Bot,
  Terminal,
  ArrowRight
  XCircle,
  AlertCircle,
  Info,
  Home,
  Calendar,
  Wallet,
  Bell,
  Menu,
  ChevronDown,
  Command as CommandIcon,
  Sparkles as SparklesIcon,
  Brain,
  Rocket
  TrendingUp,
  DollarSign
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Play,
  Pause,
  Stop,
  Volume2,
  Mic,
  MicOff,
  Send,
  Smile,
  Image,
  FileText
  Share,
  Download,
  Upload
  Edit,
  Copy,
  ExternalLink,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Columns,
  Rows,
  Layout,
  Sidebar,
  SidebarClose,
  SidebarOpen,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Split,
  Merge,
  Layers,
  Layer,
  Folder,
  FolderOpen,
  File,
  FilePlus,
  FileMinus,
  FileX,
  FileCheck,
  FileText as FileTextIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FilePresentation,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileAccess,
  FileDatabase,
  FileXml,
  FileJson,
  FileCsv,
  FileTxt,
  FileMd,
  FileHtml,
  FileCss,
  FileJs,
  FileTs,
  FileJsx,
  FileTsx,
  FileVue,
  FileReact,
  FileAngular,
  FileSvelte,
  FilePhp,
  FilePython,
  FileJava,
  FileC,
  FileCpp,
  FileCsharp,
  FileGo,
  FileRust,
  FileSwift,
  FileKotlin,
  FileScala,
  FileRuby,
  FilePerl,
  FileBash,
  FileDocker,
  FileKubernetes,
  FileTerraform,
  FileAnsible,
  FileJenkins,
  FileGit,
  FileGithub,
  FileGitlab,
  FileBitbucket,
  FileDocker as DockerIcon,
  FileKubernetes as K8sIcon,
  FileTerraform as TerraformIcon,
  FileAnsible as AnsibleIcon,
  FileJenkins as JenkinsIcon,
  FileGit as GitIcon,
  FileGithub as GithubIcon,
  FileGitlab as GitlabIcon,
  FileBitbucket as BitbucketIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: "guest" | "consumer" | "provider" | "admin";
  avatar?: string;
  subscription: {
    tier: "free" | "starter" | "professional" | "enterprise";
    status: "active" | "trial" | "expired" | "cancelled";
    features: string[];
    limits: Record<string, number>;
  };
  permissions: string[];
  stats: {
    bookings: number;
    earnings: number;
    rating: number;
    reviews: number;
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  location: string;
  availability: string[];
  images: string[];
  tags: string[];
  rating: number;
  reviews: number;
}

interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  providerId: string;
  providerName: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  amount: number;
  paymentStatus: "pending" | "paid" | "refunded";
}

interface AICommand {
  id: string;
  command: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

// Mock Data
const mockUsers: Record<string, User> = {
  guest: {
    id: "guest",
    name: "Guest User",
    email: "guest@loconomy.com",
    role: "guest",
    subscription: {
      tier: "free",
      status: "active",
      features: ["Browse services", "Basic search"],
      limits: { bookings: 0, listings: 0, ai_commands: 5 }
    },
    permissions: ["browse_services", "basic_search"],
    stats: { bookings: 0, earnings: 0, rating: 0, reviews: 0 }
  },
  consumer: {
    id: "consumer",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "consumer",
    avatar: "/avatars/sarah.jpg",
    subscription: {
      tier: "professional",
      status: "active",
      features: ["Unlimited bookings", "Priority support", "AI recommendations", "Advanced search"],
      limits: { bookings: -1, listings: 0, ai_commands: 50 }
    },
    permissions: ["browse_services", "book_services", "rate_providers", "ai_recommendations"],
    stats: { bookings: 12, earnings: 0, rating: 4.8, reviews: 8 }
  },
  provider: {
    id: "provider",
    name: "Mike Rodriguez",
    email: "mike@example.com",
    role: "provider",
    avatar: "/avatars/mike.jpg",
    subscription: {
      tier: "professional",
      status: "active",
      features: ["Unlimited listings", "Analytics dashboard", "AI marketing", "Priority support"],
      limits: { bookings: -1, listings: -1, ai_commands: 100 }
    },
    permissions: ["create_listings", "manage_bookings", "view_analytics", "ai_marketing"],
    stats: { bookings: 45, earnings: 2847.50, rating: 4.9, reviews: 127 }
  },
  admin: {
    id: "admin",
    name: "Admin User",
    email: "admin@loconomy.com",
    role: "admin",
    avatar: "/avatars/admin.jpg",
    subscription: {
      tier: "enterprise",
      status: "active",
      features: ["All features", "Admin panel", "Analytics", "User management"],
      limits: { bookings: -1, listings: -1, ai_commands: -1 }
    },
    permissions: ["all"],
    stats: { bookings: 0, earnings: 0, rating: 0, reviews: 0 }
  }
};

const mockServices: Service[] = [
  {
    id: "1",
    title: "Professional House Cleaning",
    description: "Deep cleaning service for homes and apartments",
    category: "Cleaning",
    price: 120,
    provider: {
      id: "provider",
      name: "Mike Rodriguez",
      avatar: "/avatars/mike.jpg",
      rating: 4.9
    },
    location: "San, Francisco, CA",
    availability: ["Mon", "Wed", "Fri"],
    images: ["/services/cleaning1.jpg", "/services/cleaning2.jpg"],
    tags: ["cleaning", "house", "professional"],
    rating: 4.9,
    reviews: 127
  },
  {
    id: "2",
    title: "Handyman Services",
    description: "Repairs, installations, and maintenance",
    category: "Home Improvement",
    price: 85,
    provider: {
      id: "provider",
      name: "Mike Rodriguez",
      avatar: "/avatars/mike.jpg",
      rating: 4.9
    },
    location: "San, Francisco, CA",
    availability: ["Tue", "Thu", "Sat"],
    images: ["/services/handyman1.jpg"],
    tags: ["repairs", "installation", "maintenance"],
    rating: 4.8,
    reviews: 89
  }
];

const mockBookings: Booking[] = [
  {
    id: "1",
    serviceId: "1",
    serviceTitle: "Professional House Cleaning",
    providerId: "provider",
    providerName: "Mike Rodriguez",
    customerId: "consumer",
    customerName: "Sarah Johnson",
    date: "2024-12-15",
    time: "10:00",
    status: "confirmed",
    amount: 120,
    paymentStatus: "paid"
  }
];

// AI Commands
const aiCommands: AICommand[] = [
  {
    id: "1",
    command: "/switch provider",
    description: "Switch to provider role",
    category: "Role Management",
    icon: Briefcase,
    action: () => {}
  },
  {
    id: "2",
    command: "/dashboard",
    description: "Open role-specific dashboard",
    category: "Navigation",
    icon: BarChart3,
    action: () => {}
  },
  {
    id: "3",
    command: "/billing",
    description: "Access billing and subscription",
    category: "Billing",
    icon: CreditCard,
    action: () => {}
  },
  {
    id: "4",
    command: "/listings.new",
    description: "Create new service listing",
    category: "Provider",
    icon: Plus,
    action: () => {}
  },
  {
    id: "5",
    command: "/support ai",
    description: "Get AI-powered support",
    category: "Support",
    icon: Bot,
    action: () => {}
  }
];

export function LoconomySimulator() {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.guest);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [aiChat, setAiChat] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showFeatureGate, setShowFeatureGate] = useState(false);
  const [featureGateMessage, setFeatureGateMessage] = useState("");
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus command input when palette opens
  useEffect(() => {
    if (showCommandPalette && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [showCommandPalette]);

  const switchUser = (role: string) => {
    if (mockUsers[role]) {
      setCurrentUser(mockUsers[role]);
      setActiveTab("dashboard");
    }
  };

  const executeCommand = (command: string) => {
    const cmd = aiCommands.find(c => c.command === command);
    if (cmd) {
      cmd.action();
      setShowCommandPalette(false);
      setCommandInput("");
    }
  };

  const sendAiMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = { type: 'user' as const message };
    setAiChat(prev => [...prev, userMessage]);
    setAiChatInput("");
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        type: 'ai' as const 
        message: `I understand you're asking about "${message}". As a ${currentUser.role} on, Loconomy, here's how I can help you...` 
      };
      setAiChat(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 1000);
  };

  const checkFeatureAccess = (feature: string): boolean => {
    return currentUser.permissions.includes(feature) || currentUser.permissions.includes("all");
  };

  const showFeatureGateMessage = (feature: string) => {
    setFeatureGateMessage(`This feature requires a ${feature} subscription. Upgrade to access.`);
    setShowFeatureGate(true);
    setTimeout(() => setShowFeatureGate(false), 3000);
  };

  const renderDashboard = () => {
    switch (currentUser.role) {
      case "guest":
        return <GuestDashboard />;
      case "consumer":
        return <ConsumerDashboard />;
      case "provider":
        return <ProviderDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <GuestDashboard />;
    }
  };

  const GuestDashboard = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Welcome to Loconomy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Discover trusted local services. Sign up to book appointments and access premium features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => switchUser("consumer")} className="w-full">
              Continue as Consumer
            </Button>
            <Button onClick={() => switchUser("provider")} variant="outline" className="w-full">
              Continue as Provider
            </Button>
            <Button onClick={() => switchUser("admin")} variant="outline" className="w-full">
              Continue as Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ConsumerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{currentUser.stats.bookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{currentUser.stats.rating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Reviews Given</p>
                <p className="text-2xl font-bold">{currentUser.stats.reviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Subscription</p>
                <p className="text-2xl font-bold capitalize">{currentUser.subscription.tier}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {mockBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                <div>
                  <p className="font-medium">{booking.serviceTitle}</p>
                  <p className="text-sm text-muted-foreground">{booking.date} at {booking.time}</p>
                </div>
                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                  {booking.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockServices.slice(0, 3).map(service => (
                <div key={service.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={service.provider.avatar} />
                    <AvatarFallback>{service.provider.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{service.title}</p>
                    <p className="text-sm text-muted-foreground">${service.price}</p>
                  </div>
                  <Button size="sm">Book Now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ProviderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{currentUser.stats.bookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${currentUser.stats.earnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{currentUser.stats.rating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{currentUser.stats.reviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {mockServices.map(service => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                <div>
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground">${service.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm">View Bookings</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {mockBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                <div>
                  <p className="font-medium">{booking.serviceTitle}</p>
                  <p className="text-sm text-muted-foreground">{booking.customerName} • {booking.date}</p>
                </div>
                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                  {booking.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground mb-3">Manage, users, roles, and permissions</p>
              <Button size="sm">Manage Users</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground mb-3">View platform analytics and insights</p>
              <Button size="sm">View Analytics</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">System Settings</h3>
              <p className="text-sm text-muted-foreground mb-3">Configure platform settings</p>
              <Button size="sm">Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl">Loconomy</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {currentUser.role}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommandPalette(true)}
                className="hidden md:flex"
              >
                <CommandIcon className="w-4 h-4 mr-2" />
                Quick Actions
                <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    {currentUser.name}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-2">
                    <div className="p-2">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <div className="border-t pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => switchUser("guest")}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Switch to Guest
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => switchUser("consumer")}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Switch to Consumer
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => switchUser("provider")}
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Switch to Provider
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => switchUser("admin")}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Switch to Admin
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockServices.map(service => (
                    <Card key={service.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={service.provider.avatar} />
                              <AvatarFallback>{service.provider.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{service.title}</h3>
                              <p className="text-sm text-muted-foreground">{service.provider.name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">${service.price}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{service.rating}</span>
                            </div>
                          </div>
                          <Button className="w-full">Book Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {mockBookings.length > 0 ? (
                  <div className="space-y-4">
                    {mockBookings.map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{booking.serviceTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.date} at {booking.time} • {booking.providerName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                          <span className="font-semibold">${booking.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No bookings found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-96 border rounded-lg p-4 overflow-y-auto">
                    {aiChat.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Ask me anything about Loconomy!</p>
                        <p className="text-sm">I can help with, bookings, services, and platform features.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {aiChat.map((message, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex gap-3",
                              message.type === "user" ? "justify-end" : "justify-start"
                            )}
                          >
                            {message.type === "ai" && (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  <Bot className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg p-3",
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}
                            >
                              {message.message}
                            </div>
                            {message.type === "user" && (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                        {isAiTyping && (
                          <div className="flex gap-3 justify-start">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask me anything..."
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendAiMessage(aiChatInput)}
                    />
                    <Button onClick={() => sendAiMessage(aiChatInput)}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Subscription</h3>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{currentUser.subscription.tier}</span>
                        <Badge variant={currentUser.subscription.status === "active" ? "default" : "secondary"}>
                          {currentUser.subscription.status}
                        </Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {currentUser.subscription.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
            onClick={() => setShowCommandPalette(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-background border rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Command>
                <CommandInput
                  ref={commandInputRef}
                  placeholder="Type a command or search..."
                  value={commandInput}
                  onValueChange={setCommandInput}
                />
                <CommandList>
                  <CommandEmpty>No commands found.</CommandEmpty>
                  <CommandGroup heading="AI Commands">
                    {aiCommands.map((command) => (
                      <CommandItem
                        key={command.id}
                        onSelect={() => executeCommand(command.command)}
                      >
                        <command.icon className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium">{command.command}</div>
                          <div className="text-sm text-muted-foreground">{command.description}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Gate Toast */}
      <AnimatePresence>
        {showFeatureGate && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="w-80">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Feature Restricted</h4>
                    <p className="text-sm text-muted-foreground">{featureGateMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}