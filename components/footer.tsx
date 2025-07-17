"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
  Shield,
  Award,
  Users,
  Star,
  BookOpen,
  GraduationCap,
  Newspaper,
  Lightbulb,
  Handshake,
  MessageSquare,
  Accessibility,
  DollarSign,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English

  const footerSections = [
    {
      title: "For Customers",
      links: [
        { href: "/browse", label: "Browse Services" },
        { href: "/request-service", label: "Request Service" },
        { href: "/how-it-works", label: "How It Works" },
        { href: "/pricing", label: "Pricing" },
        { href: "/safety", label: "Safety & Trust" },
        { href: "/customer-support", label: "Customer Support" },
      ],
    },
    {
      title: "For Providers",
      links: [
        { href: "/become-provider", label: "Become a Provider" },
        { href: "/provider-resources", label: "Provider Resources" },
        { href: "/provider-app", label: "Provider App" },
        { href: "/provider-support", label: "Provider Support" },
        { href: "/success-stories", label: "Success Stories" },
        { href: "/training-certification", label: "Training & Certification" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/press", label: "Press & Media" },
        { href: "/blog", label: "Blog" },
        { href: "/investors", label: "Investors" },
        { href: "/partnerships", label: "Partnerships" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/help", label: "Help Center" },
        { href: "/contact", label: "Contact Us" },
        { href: "/community", label: "Community" },
        { href: "/feedback", label: "Feedback" },
        { href: "/accessibility", label: "Accessibility" },
        { href: "/sitemap", label: "Sitemap" },
      ],
    },
  ];

  const socialLinks = [
    {
      href: "https://facebook.com/loconomy",
      icon: Facebook,
      label: "Facebook",
    },
    { href: "https://twitter.com/loconomy", icon: Twitter, label: "Twitter" },
    {
      href: "https://instagram.com/loconomy",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "https://linkedin.com/company/loconomy",
      icon: Linkedin,
      label: "LinkedIn",
    },
    { href: "https://youtube.com/loconomy", icon: Youtube, label: "YouTube" },
  ];

  const trustIndicators = [
    { icon: Shield, text: "Secure & Safe" },
    { icon: Award, text: "Award Winning" },
    { icon: Users, text: "10K+ Users" },
    { icon: Star, text: "4.9 Rating" },
  ];

  const availableLanguages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    toast({
      title: "Language Changed",
      description: `Display language set to ${availableLanguages.find((l) => l.code === langCode)?.name}.`,
      variant: "default",
    });
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Connected with Loconomy
            </h3>
            <p className="text-lg text-white mb-6 opacity-90">
              Get the latest updates on new services, special offers, and tips
              for your home and business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 transition-colors"
              />
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
            <p className="text-sm mt-4 text-white opacity-75">
              Join 50,000+ subscribers. Unsubscribe anytime. Privacy policy
              applies.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center space-x-2 mb-4 transition-opacity hover:opacity-80"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Loconomy
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Connecting communities with trusted local service providers. From
              home cleaning to professional services, we make it easy to find
              help when you need it.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-white">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>hello@loconomy.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <Globe className="w-4 h-4 text-gray-400" />
                <span>Available in 500+ cities</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span>24/7 Online Support</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-4 h-4" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {trustIndicators.map((indicator, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-300"
            >
              <indicator.icon className="w-4 h-4 text-blue-400" />
              <span>{indicator.text}</span>
            </div>
          ))}
        </div>

        <Separator className="mb-8 bg-border" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>© {currentYear} Loconomy, Inc. All rights reserved.</span>
            <Link href="/privacy" className="hover:underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:underline transition-colors">
              Cookie Policy
            </Link>
            <Link href="/gdpr" className="hover:underline transition-colors">
              GDPR
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Language Selector in Footer */}
            <Select
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[180px] transition-colors">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg">
                {availableLanguages.map((lang) => (
                  <SelectItem
                    key={lang.code}
                    value={lang.code}
                    className="transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>Made with ❤️ for local communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
