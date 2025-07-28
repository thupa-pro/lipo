import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { LogoVariant, UIContext } from "@/lib/types/logo";
import { Sparkles, Twitter, Instagram, Linkedin, Youtube, Globe, Award, BookOpen, GraduationCap, Newspaper, Lightbulb, Handshake, Accessibility, Crown, Brain, Rocket, Gem, Building2, TrendingUp, Zap, Heart, ChevronUp, ChevronDown, MessageCircle, ExternalLink, Download, HelpCircle, FileText, Lock, Eye, Cookie, UserCheck, Scale, Target, BarChart3, Headphones, Monitor, Smartphone, Tablet, Cpu, Code, Database, Server, GitBranch, Wifi, Layers } from "lucide-react";

// Comprehensive language configuration with all supported locales
const languages = [
  { code: "en", name: "English", native: "English", flag: "🇺🇸", region: "Global" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳", region: "China" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳", region: "India" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸", region: "Global" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦", region: "MENA" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷", region: "Brazil" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩", region: "Bangladesh" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺", region: "Russia" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵", region: "Japan" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "Punjab" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪", region: "Germany" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰", region: "Pakistan" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷", region: "Korea" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷", region: "France" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷", region: "Turkey" },
  { code: "it", name: "Italian", native: "Italiano", flag: "��🇹", region: "Italy" },
  { code: "th", name: "Thai", native: "ไทย", flag: "🇹🇭", region: "Thailand" },
  { code: "fa", name: "Persian", native: "فارسی", flag: "🇮🇷", region: "Iran" },
  { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱", region: "Poland" },
  { code: "nl", name: "Dutch", native: "Nederlands", flag: "🇳🇱", region: "Netherlands" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const currentLocale = params?.locale as string || 'en';
  const { user, isSignedIn, role } = useAuth();
  
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    status: "operational",
    uptime: "99.97%",
    response: "125ms"
  });

  // Premium footer sections organized by category
  const footerSections = [
    {
      title: "For Elite Customers",
      icon: Crown,
      links: [
        { href: "/browse", label: "Browse Elite Services", icon: Crown },
        { href: "/ai-listing-generator", label: "AI Personal Concierge", icon: Brain },
        { href: "/booking", label: "Premium Booking", icon: Star },
        { href: "/customer-support", label: "VIP Support", icon: Headphones },
        { href: "/success-stories", label: "Success Stories", icon: TrendingUp },
        { href: "/customer/dashboard", label: "Customer Portal", icon: Monitor },
      ],
    },
    {
      title: "For Service Professionals",
      icon: Briefcase,
      links: [
        { href: "/become-provider", label: "Join Elite Network", icon: Crown },
        { href: "/provider/listings/new", label: "AI Business Tools", icon: Brain },
        { href: "/training-certification", label: "Growth Academy", icon: GraduationCap },
        { href: "/provider-support", label: "Success Center", icon: Award },
        { href: "/provider/reports", label: "Advanced Analytics", icon: BarChart3 },
        { href: "/provider-resources", label: "Resource Hub", icon: BookOpen },
      ],
    },
    {
      title: "Platform & Technology",
      icon: Cpu,
      links: [
        { href: "/revolutionary-features", label: "AI Technology", icon: Brain },
        { href: "/safety", label: "Security Fortress", icon: Shield },
        { href: "/how-it-works", label: "Platform Guide", icon: BookOpen },
        { href: "/api/docs", label: "Developer API", icon: Code },
        { href: "/system-status", label: "Platform Status", icon: CheckCircle },
        { href: "/revolutionary-design", label: "Innovation Lab", icon: Lightbulb },
      ],
    },
    {
      title: "Company & Community",
      icon: Building2,
      links: [
        { href: "/about", label: "Our Vision", icon: Rocket },
        { href: "/careers", label: "Elite Careers", icon: Gem },
        { href: "/blog", label: "Industry Blog", icon: Newspaper },
        { href: "/press", label: "Press & Media", icon: Newspaper },
        { href: "/investors", label: "Investor Relations", icon: DollarSign },
        { href: "/community", label: "Community Hub", icon: Users },
      ],
    },
    {
      title: "Support & Resources",
      icon: HelpCircle,
      links: [
        { href: "/help", label: "Help Center", icon: HelpCircle },
        { href: "/contact", label: "Contact Support", icon: MessageCircle },
        { href: "/feedback", label: "Send Feedback", icon: MessageCircle },
        { href: "/partnerships", label: "Partner Program", icon: Handshake },
        { href: "/referrals", label: "Referral Program", icon: Users },
        { href: "/sitemap", label: "Site Map", icon: Layers },
      ],
    },
    {
      title: "Legal & Compliance",
      icon: Scale,
      links: [
        { href: "/privacy", label: "Privacy Policy", icon: Lock },
        { href: "/terms", label: "Terms of Service", icon: FileText },
        { href: "/cookies", label: "Cookie Policy", icon: Cookie },
        { href: "/accessibility", label: "Accessibility", icon: Accessibility },
        { href: "/gdpr", label: "GDPR Compliance", icon: Shield },
        { href: "/disputes", label: "Dispute Resolution", icon: Scale },
      ],
    },
  ];

  // Helper function to check if a link should be shown based on authentication/role
  const shouldShowLink = (href: string): boolean => {
    // Links that require authentication (any authenticated user)
    const authRequiredLinks = [
      '/dashboard',
      '/notifications',
      '/settings',
      '/profile',
      '/billing',
      '/payments',
      '/messages',
      '/referrals-dashboard'
    ];

    // Links that require specific roles
    const providerOnlyLinks = [
      '/provider/listings/new',
      '/provider/reports',
      '/provider/availability',
      '/provider/calendar',
      '/training-certification',
      '/provider-resources',
      '/provider-support'
    ];

    const customerOnlyLinks = [
      '/customer/dashboard',
      '/my-bookings',
      '/bookings',
      '/booking',
      '/requests'
    ];

    const adminOnlyLinks = [
      '/admin',
      '/system-status'
    ];

    // Check if link requires authentication
    if (authRequiredLinks.includes(href)) {
      return isSignedIn;
    }

    // Check role-specific links
    if (providerOnlyLinks.includes(href)) {
      return isSignedIn && (role === 'provider' || role === 'admin');
    }

    if (customerOnlyLinks.includes(href)) {
      return isSignedIn && (role === 'consumer' || role === 'admin');
    }

    if (adminOnlyLinks.includes(href)) {
      return isSignedIn && role === 'admin';
    }

    // Show all other links to everyone (public pages)
    return true;
  };

  // Filter footer sections based on authentication and role
  const getFilteredFooterSections = () => {
    return footerSections.map(section => ({
      ...section,
      links: section.links.filter(link => shouldShowLink(link.href))
    })).filter(section => section.links.length > 0); // Remove sections with no visible links
  };

  // Trust signals and certifications
  const trustSignals = [
    { 
      icon: Shield, 
      label: "SOC 2 Type II",
      description: "Enterprise security"
    },
    { 
      icon: Award, 
      label: "ISO 27001",
      description: "Global standard"
    },
    { 
      icon: Users, 
      label: "2.5M+ Users",
      description: "Trusted globally"
    },
    { 
      icon: Star, 
      label: "98.2% Satisfaction",
      description: "Exceptional quality"
    },
  ];

  // Social media with follower counts
  const socialLinks = [
    { 
      icon: Twitter, 
      href: "https://twitter.com/loconomy", 
      label: "Twitter",
      followers: "145K",
      handle: "@loconomy"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/loconomy", 
      label: "LinkedIn",
      followers: "98K",
      handle: "loconomy"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/loconomy", 
      label: "Instagram",
      followers: "187K",
      handle: "@loconomy"
    },
    { 
      icon: Youtube, 
      href: "https://youtube.com/c/loconomy", 
      label: "YouTube",
      followers: "89K",
      handle: "Loconomy AI"
    },
  ];

  // Platform statistics
  const platformStats = [
    { label: "Active Markets", value: "125+", icon: Globe },
    { label: "Services Listed", value: "2.8M+", icon: Target },
    { label: "Transactions", value: "$2.1B+", icon: DollarSign },
    { label: "AI Matches", value: "15M+", icon: Brain },
  ];

  // Mobile app links
  const appLinks = [
    { 
      platform: "iOS", 
      url: "https://apps.apple.com/app/loconomy",
      icon: Smartphone,
      label: "Download for iOS"
    },
    { 
      platform: "Android", 
      url: "https://play.google.com/store/apps/details?id=com.loconomy",
      icon: Smartphone,
      label: "Download for Android"
    },
  ];

  const handleNewsletterSubscription = async (email: string) => {
    toast({
      title: "🎉 Welcome to the Elite Circle!",
      description: "You've subscribed to exclusive insights from industry leaders. Premium content incoming!",
      variant: "default",
    });
  };

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsLanguageOpen(false);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLocale) || languages[0];
  };

  // Simulate real-time system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["operational", "degraded", "maintenance"];
      const uptimes = ["99.97%", "99.95%", "99.98%"];
      const responses = ["125ms", "132ms", "118ms", "145ms"];
      
      setSystemStatus({
        status: statuses[Math.floor(Math.random() * statuses.length)],
        uptime: uptimes[Math.floor(Math.random() * uptimes.length)],
        response: responses[Math.floor(Math.random() * responses.length)]
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Premium Newsletter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative border-b border-slate-700/50 bg-gradient-to-r from-violet-900/30 to-purple-900/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-violet-300">
                Exclusive Elite Insights
              </span>
              <Crown className="w-4 h-4 text-violet-400" />
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {isSignedIn ? 'Stay Connected' : 'Join the'}
              </span>{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {isSignedIn ? 'Elite Updates' : 'Inner Circle'}
              </span>
            </h3>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              {isSignedIn
                ? `Welcome back${user?.name ? `, ${user.name}` : ''}! Stay updated with the latest features and exclusive insights tailored for ${role === 'provider' ? 'service professionals' : role === 'consumer' ? 'valued customers' : 'elite members'}.`
                : 'Get exclusive access to industry insights, AI innovations, and premium content from the world\'s leading service marketplace.'
              }
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your elite email address"
                className="flex-1 h-14 px-6 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-violet-400 focus:ring-violet-400/20"
              />
              <Button
                onClick={() => handleNewsletterSubscription("")}
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold shadow-lg shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Rocket className="w-5 h-5 mr-2" />
                {isSignedIn ? 'Subscribe' : 'Join Elite'}
              </Button>
            </div>
            
            <p className="text-xs text-slate-400 mt-3 text-center">
              🔒 Your privacy is fortress-protected. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Top Section - Brand & Platform Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <Logo
                  variant={LogoVariant.LIGHT}
                  context={UIContext.FOOTER}
                  className="h-12 w-auto"
                  alt="Loconomy - Elite AI Platform"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-violet-400 font-semibold tracking-wider uppercase">
                      Elite AI Platform
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                Revolutionizing how{" "}
                <span className="text-violet-400 font-semibold">elite professionals</span>{" "}
                and discerning customers connect through the world's most advanced{" "}
                <span className="text-violet-400 font-semibold">AI marketplace</span>.
              </p>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {trustSignals.map((signal, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-300"
                  >
                    <signal.icon className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-xs text-white">{signal.label}</div>
                      <div className="text-xs text-slate-400">{signal.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Language Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Global Language
                </label>
                <DropdownMenu open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50 hover:border-violet-400"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCurrentLanguage().flag}</span>
                        <span>{getCurrentLanguage().native}</span>
                        <span className="text-slate-400 text-xs">({getCurrentLanguage().region})</span>
                      </div>
                      {isLanguageOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto bg-slate-800 border-slate-600">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="text-white hover:bg-slate-700 cursor-pointer flex items-center gap-3"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium">{lang.native}</div>
                          <div className="text-xs text-slate-400">{lang.name} • {lang.region}</div>
                        </div>
                        {lang.code === currentLocale && <UIIcons.CheckCircle className="w-4 h-4 text-violet-400" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Platform Statistics */}
              <div className="grid grid-cols-2 gap-3">
                {platformStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center p-3 rounded-lg bg-slate-800/30 border border-slate-700/50"
                  >
                    <stat.icon className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFilteredFooterSections().map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <section.icon className="w-5 h-5 text-violet-400" />
                    <h4 className="font-bold text-white text-lg">
                      {section.title}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={`/${currentLocale}${link.href}`}
                          className="group flex items-center gap-3 text-slate-300 hover:text-violet-400 transition-all duration-300"
                        >
                          <link.icon className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors duration-300" />
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {link.label}
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700/50 mb-12" />

        {/* Social Media & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Social Media */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <NavigationIcons.Users className="w-5 h-5 text-violet-400" />
              Connect with Excellence
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:border-transparent transition-all duration-300 flex items-center gap-3"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white group-hover:text-white">{social.label}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-200">{social.followers}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <Headphones className="w-5 h-5 text-violet-400" />
              Elite Support
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <OptimizedIcon name="Mail" className="w-4 h-4 text-violet-400" />
                <div>
                  <div className="font-medium">elite@loconomy.com</div>
                  <div className="text-xs text-slate-400">24/7 Premium Support</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <OptimizedIcon name="Phone" className="w-4 h-4 text-violet-400" />
                <div>
                  <div className="font-medium">+1 (855) ELITE-AI</div>
                  <div className="text-xs text-slate-400">Priority Hotline</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <BusinessIcons.MapPin className="w-4 h-4 text-violet-400" />
                <div>
                  <div className="font-medium">San Francisco, CA</div>
                  <div className="text-xs text-slate-400">Global Operations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Apps */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-violet-400" />
              Mobile Experience
            </h4>
            <div className="space-y-3">
              {appLinks.map((app, index) => (
                <Link
                  key={index}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 hover:border-violet-400 transition-all duration-300 group"
                >
                  <app.icon className="w-5 h-5 text-violet-400" />
                  <div className="flex-1">
                    <div className="font-medium text-white group-hover:text-violet-300">{app.label}</div>
                    <div className="text-xs text-slate-400">Native {app.platform} App</div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-violet-400" />
                </Link>
              ))}
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-700/30">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <OptimizedIcon name="Star" className="w-4 h-4" />
                  <span className="font-semibold">4.8/5 Rating</span>
                </div>
                <div className="text-xs text-slate-400">50K+ Downloads This Month</div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700/50 mb-8" />

        {/* System Status & Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span>© {currentYear} Loconomy, Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href={`/${currentLocale}/privacy`} className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Privacy
              </Link>
              <Link href={`/${currentLocale}/terms`} className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Terms
              </Link>
              <Link href={`/${currentLocale}/cookies`} className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-1">
                <Cookie className="w-3 h-3" />
                Cookies
              </Link>
              <Link href={`/${currentLocale}/accessibility`} className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-1">
                <Accessibility className="w-3 h-3" />
                Accessibility
              </Link>
            </div>
          </div>

          {/* Real-time System Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <OptimizedIcon name="Shield" className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">System Status:</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  systemStatus.status === 'operational' ? 'bg-emerald-400' :
                  systemStatus.status === 'degraded' ? 'bg-yellow-400' : 'bg-orange-400'
                }`}></div>
                <span className={`font-semibold capitalize ${
                  systemStatus.status === 'operational' ? 'text-emerald-400' :
                  systemStatus.status === 'degraded' ? 'text-yellow-400' : 'text-orange-400'
                }`}>
                  {systemStatus.status}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <OptimizedIcon name="Clock" className="w-3 h-3" />
              {systemStatus.uptime} uptime • {systemStatus.response} avg
            </div>
          </div>
        </div>

        {/* Elite Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-400/30">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-violet-300">
              Powered by Revolutionary AI • Trusted by Elite Professionals Worldwide
            </span>
            <Gem className="w-4 h-4 text-violet-400" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
