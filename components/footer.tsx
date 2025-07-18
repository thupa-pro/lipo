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
    { code: "zh", name: "中文 (简体)", flag: "🇨🇳" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇵🇰" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "th", name: "ไทย", flag: "🇹🇭" },
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "uk", name: "Українська", flag: "🇺🇦" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "he", name: "עברית", flag: "🇮🇱" },
    { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
    { code: "ro", name: "Română", flag: "🇷🇴" },
    { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
    { code: "cs", name: "Čeština", flag: "🇨🇿" },
    { code: "hu", name: "Magyar", flag: "🇭🇺" },
    { code: "fi", name: "Suomi", flag: "🇫🇮" },
    { code: "da", name: "Dansk", flag: "🇩🇰" },
    { code: "no", name: "Norsk", flag: "🇳🇴" },
    { code: "sv", name: "Svenska", flag: "🇸🇪" },
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
    { code: "tl", name: "Filipino", flag: "🇵🇭" },
    { code: "zh-TW", name: "中文 (繁體)", flag: "🇹🇼" },
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
    <footer className="bg-gray-900 dark:bg-gray-950 border-t border-gray-800 dark:border-gray-900">
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
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7db1aa9d72cc410a876ff9b626b97177%2F9572c145dca8439e88c28327615d849e?format=webp&width=800"
                alt="Loconomy Logo"
                className="w-8 h-8 rounded-lg object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
              <div
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center"
                style={{ display: "none" }}
              >
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Loconomy
              </span>
            </Link>
            <p className="text-gray-300 dark:text-gray-400 mb-6 max-w-sm">
              Connecting communities with trusted local service providers. From
              home cleaning to professional services, we make it easy to find
              help when you need it.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-white dark:text-gray-200">
                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span>hello@loconomy.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white dark:text-gray-200">
                <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span>Available in 500+ cities</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white dark:text-gray-200">
                <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500" />
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
                  className="rounded-full border-gray-600 dark:border-gray-700 text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white dark:hover:text-gray-200 hover:border-gray-500 dark:hover:border-gray-600 transition-colors"
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
              <h4 className="font-semibold text-white dark:text-gray-200 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-700 dark:bg-gray-800" />

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {trustIndicators.map((indicator, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400"
            >
              <indicator.icon className="w-4 h-4 text-blue-400 dark:text-blue-300" />
              <span>{indicator.text}</span>
            </div>
          ))}
        </div>

        <Separator className="mb-8 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300 dark:text-gray-400">
            <span>© {currentYear} Loconomy, Inc. All rights reserved.</span>
            <Link
              href="/privacy"
              className="hover:underline hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:underline hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:underline hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/gdpr"
              className="hover:underline hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              GDPR
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-300 dark:text-gray-400">
            {/* Language Selector in Footer */}
            <Select
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[180px] border-gray-600 dark:border-gray-700 bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
                <Globe className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 dark:bg-gray-900 border-gray-600 dark:border-gray-700 rounded-md shadow-lg">
                {availableLanguages.map((lang) => (
                  <SelectItem
                    key={lang.code}
                    value={lang.code}
                    className="text-white dark:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-800 focus:bg-gray-700 dark:focus:bg-gray-800 transition-colors"
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
