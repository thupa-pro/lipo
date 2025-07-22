import { Metadata } from 'next';
import { CookieConsentDemo } from '@/components/cookies/CookieConsentDemo';

export const metadata: Metadata = {
  title: 'Cookie Consent Demo - Loconomy',
  description: 'Demonstration of the production-ready cookie consent system with GDPR compliance.',
  robots: { index: false, follow: false }, // Demo page - don't index
};

export default function CookieDemoPage() {
  return <CookieConsentDemo />;
}