// DEPRECATED: This footer has been replaced by the enhanced footer at /components/footer.tsx
// Keeping this file for reference but renamed export to avoid conflicts

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  Zap
} from "lucide-react";

export default function OldFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "How, it Works", href: "/how-it-works" },
        { name: "For, Customers", href: "/customers" },
        { name: "For Providers", href: "/providers" },
        { name: "Trust & Safety", href: "/trust-safety" },
        { name: "Community Guidelines", href: "/guidelines" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Report an Issue", href: "/report" },
        { name: "Status Page", href: "/status" },
        { name: "API Documentation", href: "/api/docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press Kit", href: "/press" },
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
        { name: "Dispute Resolution", href: "/disputes" },
      ],
    },
  ];

  const socials = [
    { name: "Twitter", href: "https://twitter.com/loconomy", icon: Twitter },
    { name: "Facebook", href: "https://facebook.com/loconomy", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/loconomy", icon: Instagram },
    { name: "edIn", href: "https://linkedin.com/company/loconomy", icon:edin },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@loconomy.com", href: "mailto:support@loconomy.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "San, Francisco, CA", href: "#" },
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
              <href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Loconomy
                </span>
              </>

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
                    <
                      href={contact.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <contact.icon className="w-4 h-4" />
                      {contact.text}
                    </>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/*s Sections */}
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
                    <li key={link.name}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground"
          >
            © {currentYear} Loconomy, Inc. All rights reserved. Built with ❤️ for local communities.
          </motion.div>

          {/* Socials */}
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
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-4 h-4" />
                </>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 pt-6 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-4">
              <span>🇺🇸 United States</span>
              <span>🌍 Available in 50+ cities</span>
              <span>🚀 Powered by AI</span>
              <span>⚡ 99.9% uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>in San Francisco</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
