"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FooterLogo } from "@/components/ui/logo";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Users, BookOpen,
  GraduationCap,
  Newspaper,
  Lightbulb,
  Handshake
  Accessibility,
  DollarSign,
  Crown,
  Brain,
  Rocket,
  Gem
  Building2,
  Sparkles,
  ArrowRight
  TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const premiumFooterSections = [
    {
      title: "For Elite Customers",
      links: [
        { href: "/browse-elite", label: "Browse Elite Services", icon: Crown },
        { href: "/ai-concierge", label: "AI Personal Concierge", icon: Brain },
        { href: "/enterprise-solutions", label: "Enterprise Solutions", icon: Building2 },
        { href: "/vip-support", label: "VIP Support", icon: Star },
        { href: "/customer-success", label: "Success Stories", icon: TrendingUp },
      ],
    },
    {
      title: "For Service Professionals",
      links: [
        { href: "/provider-elite", label: "Join Elite Network", icon: Crown },
        { href: "/ai-tools", label: "AI Business Tools", icon: Brain },
        { href: "/growth-academy", label: "Growth Academy", icon: GraduationCap },
        { href: "/provider-success", label: "Success Center", icon: Award },
        { href: "/provider-analytics", label: "Advanced Analytics", icon: TrendingUp },
      ],
    },
    {
      title: "Platform Excellence",
      links: [
        { href: "/ai-technology", label: "AI Technology", icon: Brain },
        { href: "/security-fortress", label: "Security Fortress", icon: Shield },
        { href: "/quality-standards", label: "Quality Standards", icon: Award },
        { href: "/innovation-lab", label: "Innovation Lab", icon: Lightbulb },
        { href: "/platform-status", label: "Platform Status", icon: CheckCircle },
      ],
    },
    {
      title: "Company & Vision",
      links: [
        { href: "/about-vision", label: "Our Vision", icon: Rocket },
        { href: "/leadership", label: "Leadership Team", icon: Users },
        { href: "/careers-elite", label: "Elite Careers", icon: Gem },
        { href: "/press-media", label: "Press & Media", icon: Newspaper },
        { href: "/investor-relations", label: "Investor Relations", icon: DollarSign },
      ],
    },
  ];

  const trustSignals = [
    { 
      icon: Shield, 
      label: "SOC 2 Type II Certified",
      description: "Enterprise-grade security"
    },
    { 
      icon: Award, 
      label: "ISO 27001 Compliant",
      description: "Global security standard"
    },
    { 
      icon: Users, 
      label: "2.1M+ Global Users",
      description: "Trusted worldwide"
    },
    { 
      icon: Star, 
      label: "97.8% Satisfaction Rate",
      description: "Exceptional quality"
    },
  ];

  const socialLinks = [
    { 
      icon: Twitter, 
      href: "https://twitter.com/loconomy", 
      label: "Twitter",
      followers: "125K"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/loconomy", 
      label: "LinkedIn",
      followers: "89K"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/loconomy", 
      label: "Instagram",
      followers: "156K"
    },
    { 
      icon: Youtube, 
      href: "https://youtube.com/c/loconomy", 
      label: "YouTube",
      followers: "67K"
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  const handleNewsletterSubscription = () => {
    toast({
      title: "🎉 Welcome to the Elite Circle!",
      description: "You've subscribed to exclusive insights from industry leaders. Premium content incoming!",
      variant: "default",
    });
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Premium Newsletter Section */}
      <div className="relative border-b border-slate-700/50 bg-gradient-to-r from-violet-900/30 to-purple-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/30 mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-violet-300">
                Exclusive Elite Insights
              </span>
              <Crown className="w-4 h-4 text-violet-400" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Join the
              </span>{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Inner Circle
              </span>
            </h3>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Get exclusive access to industry, insights, AI, innovations, and premium content from the world's leading service marketplace.
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
                onClick={handleNewsletterSubscription}
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold shadow-lg shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Join Elite
              </Button>
            </div>
            
            <p className="text-xs text-slate-400 mt-3 text-center">
              🔒 Your privacy is fortress-protected. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Top Section - Logo & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Loconomy
                </span>
                <div className="flex items-center gap-2 -mt-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-violet-400 font-semibold tracking-wider uppercase">
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
            <div className="grid grid-cols-2 gap-4 mb-8">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <signal.icon className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-white">{signal.label}</div>
                    <div className="text-xs text-slate-400">{signal.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Language Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                <Globe className="w-4 h-4 inline mr-2" />
                Global Language
              </label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-slate-700">
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {premiumFooterSections.map((section, index) => (
                <div key={index}>
                  <h4 className="font-bold text-white mb-6 text-lg">
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-3 text-slate-300 hover:text-violet-400 transition-colors duration-300"
                        >
                          <link.icon className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors duration-300" />
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700/50 mb-12" />

        {/* Social Media & Contact */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">
              Connect with Excellence
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="group relative w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:border-transparent transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                  
                  {/* Follower count tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {social.followers} followers
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center lg:text-right">
            <h4 className="font-bold text-white mb-4 text-lg">
              Elite Support
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-end gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-violet-400" />
                <span>elite@loconomy.com</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-violet-400" />
                <span>+1 (855) ELITE-AI</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-violet-400" />
                <span>San, Francisco, CA • Global</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700/50 my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span>© {currentYear} Loconomy, Inc. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-violet-400 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-violet-400 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-violet-400 transition-colors duration-300">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
              <Accessibility className="w-4 h-4" />
              Accessibility
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Platform Status:</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 font-semibold">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elite Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-400/30">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-violet-300">
              Powered by Revolutionary AI • Trusted by Elite Professionals Worldwide
            </span>
            <Gem className="w-4 h-4 text-violet-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
