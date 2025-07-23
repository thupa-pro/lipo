"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { LogoVariant, UIContext } from "@/lib/types/logo";

export default function SimpleFooter() {
  const params = useParams();
  const currentLocale = params?.locale as string || 'en';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo
              variant={LogoVariant.LIGHT}
              context={UIContext.FOOTER}
              className="h-8 w-auto"
              alt="Loconomy - Elite AI Platform"
            />
          </div>
          <p className="text-slate-400">Elite AI-Powered Local Services Platform</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href={`/${currentLocale}/how-it-works`} className="hover:text-white">How it Works</Link></li>
              <li><Link href={`/${currentLocale}/browse`} className="hover:text-white">Browse Services</Link></li>
              <li><Link href={`/${currentLocale}/become-provider`} className="hover:text-white">Become Provider</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href={`/${currentLocale}/help`} className="hover:text-white">Help Center</Link></li>
              <li><Link href={`/${currentLocale}/contact`} className="hover:text-white">Contact</Link></li>
              <li><Link href={`/${currentLocale}/feedback`} className="hover:text-white">Feedback</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href={`/${currentLocale}/about`} className="hover:text-white">About</Link></li>
              <li><Link href={`/${currentLocale}/careers`} className="hover:text-white">Careers</Link></li>
              <li><Link href={`/${currentLocale}/blog`} className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href={`/${currentLocale}/privacy`} className="hover:text-white">Privacy</Link></li>
              <li><Link href={`/${currentLocale}/terms`} className="hover:text-white">Terms</Link></li>
              <li><Link href={`/${currentLocale}/cookies`} className="hover:text-white">Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>© {currentYear} Loconomy, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
