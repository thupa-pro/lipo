import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Facebook, Instagram, Linkedin, Heart, Zap, Shield, Mail, Phone, MapPin } from "lucide-react";
import { FooterLogo } from "@/components/ui/logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "How it Works", href: "/how-it-works" },
        { name: "For Customers", href: "/browse" },
        { name: "For Providers", href: "/become-provider" },
        { name: "Trust & Safety", href: "/safety" },
        { name: "Community", href: "/community" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Customer Support", href: "/customer-support" },
        { name: "Provider Support", href: "/provider-support" },
        { name: "API Documentation", href: "/api/docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
        { name: "Investors", href: "/investors" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Accessibility", href: "/accessibility" },
        { name: "GDPR", href: "/gdpr" },
      ],
    },
  ];

  const socials = [
    { name: "Twitter", href: "https://twitter.com/loconomy", icon: Twitter },
    { name: "Facebook", href: "https://facebook.com/loconomy", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/loconomy", icon: Instagram },
    { name: "LinkedIn", href: "https://linkedin.com/company/loconomy", icon: Linkedin },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@loconomy.com", href: "mailto:support@loconomy.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "San Francisco, CA", href: "#" },
  ];

  const features = [
    { icon: Zap, text: "AI-Powered Matching" },
    { icon: Shield, text: "Trust & Safety First" },
    { icon: Heart, text: "Community-Driven" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container max-w-screen-2xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
                <FooterLogo className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Loconomy
                </span>
              </Link>

              {/* Description */}
              <p className="text-muted-foreground mb-6 max-w-xs">
                Empowering local communities through AI-first service connections. 
                Find trusted providers and grow your business with intelligent matching.
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={contact.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <contact.icon className="w-4 h-4" />
                      {contact.text}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground"
            >
              © {currentYear} Loconomy Inc. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {socials.map((social, index) => (
                <motion.div
                  key={social.name}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={social.href}
                    className="w-8 h-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
