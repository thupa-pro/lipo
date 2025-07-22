"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, Users, Lock, Cookie, FileText, Info, ArrowRight, Handshake } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function PrivacyPolicyPage() {
  const { toast } = useToast()
  const router = useRouter()

  const policySections = [
    {
      icon: Info,
      title: "1. Information We Collect",
      description: "Details about the types of personal and non-personal information we gather from you.",
      content: [
        "**Personal Information:** This includes data that can identify you, such as your name, email address, phone number, physical address, payment information, and profile picture. For service providers, it may also include business details, licenses, and background check information.",
        "**Usage Data:** We collect information about how you access and use our platform, including IP addresses, browser types, operating systems, pages viewed, and the time spent on our site.",
        "**Location Data:** With your consent, we may collect precise location data to facilitate service matching and delivery.",
        "**Communication Data:** Records of your communications with us and other users through our platform.",
      ],
    },
    {
      icon: Users,
      title: "2. How We Use Your Information",
      description: "Explaining the purposes for which your collected data is utilized.",
      content: [
        "**To Provide Services:** To operate, maintain, and improve our platform, process transactions, and connect customers with service providers.",
        "**Personalization:** To customize your experience, recommend relevant services or jobs, and display content tailored to your interests.",
        "**Communication:** To send you service-related notifications, updates, marketing communications (if opted-in), and respond to your inquiries.",
        "**Safety & Security:** To verify identities, conduct background checks (for providers), prevent fraud, and ensure the safety of our community.",
        "**Analytics & Improvement:** To understand user behavior, analyze trends, and improve the functionality and performance of our platform.",
      ],
    },
    {
      icon: Handshake,
      title: "3. How We Share Your Information",
      description: "Outlining the circumstances under which your data might be shared with third parties.",
      content: [
        "**With Service Providers/Customers:** Information necessary to facilitate a service request or booking (e.g., customer's job details with providers, provider's profile with customers).",
        "**Third-Party Service Providers:** We may share data with vendors who perform services on our behalf, such as payment processing, analytics, hosting, and customer support.",
        "**Legal Requirements:** When required by law, subpoena, or other legal process, or if we believe it's necessary to protect our rights, property, or safety.",
        "**Business Transfers:** In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.",
        "**With Your Consent:** We may share your information for any other purpose with your explicit consent.",
      ],
    },
    {
      icon: Lock,
      title: "4. Data Security",
      description: "Our measures to protect your personal information from unauthorized access.",
      content: [
        "We implement robust security measures, including encryption, firewalls, and secure socket layer (SSL) technology, to protect your personal information.",
        "Access to your data is restricted to authorized personnel only, who are bound by strict confidentiality obligations.",
        "While we strive to protect your data, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.",
      ],
    },
    {
      icon: Cookie,
      title: "5. Cookies and Tracking Technologies",
      description: "Explanation of how we use cookies and similar technologies.",
      content: [
        "We use cookies and similar tracking technologies (like web beacons and pixels) to track activity on our service and hold certain information.",
        "Cookies are used for various purposes, including authentication, remembering user preferences, analyzing site traffic, and delivering personalized advertisements.",
        "You have the option to accept or refuse cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.",
      ],
    },
    {
      icon: FileText,
      title: "6. Your Rights and Choices",
      description: "Information about your control over your personal data.",
      content: [
        "**Access and Correction:** You can access and update your personal information through your account settings.",
        "**Data Portability:** You may request a copy of your personal data in a structured, commonly used, machine-readable format.",
        "**Deletion:** You can request the deletion of your account and personal data, subject to legal and operational requirements.",
        "**Opt-Out of Marketing:** You can opt-out of receiving marketing communications from us by following the unsubscribe link in our emails or updating your notification settings.",
        "**Location Data:** You can disable location services through your device settings at any time.",
      ],
    },
    {
      icon: Shield,
      title: "7. Children's Privacy",
      description: "Our policy regarding the collection of information from minors.",
      content: [
        "Our service is not intended for individuals under the age of 18. We do not knowingly collect personally identifiable information from anyone under 18.",
        "If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.",
      ],
    },
    {
      icon: Info,
      title: "8. Changes to This Privacy Policy",
      description: "How we will notify you of updates to our privacy practices.",
      content: [
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date.",
        "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
      ],
    },
  ]

  // Helper function to render content with bolding
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by bolded text
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your privacy is paramount. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: October 26, 2023</p>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Commitment to Your Data Privacy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are dedicated to protecting your personal information and being transparent about our data practices.
            </p>
          </div>

          <div className="space-y-12">
            {policySections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <section.icon className="w-5 h-5 mr-2 text-primary" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-muted-foreground text-sm leading-relaxed">
                      {renderContent(paragraph)}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Questions or Concerns?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email Privacy Team", description: "Opening your email client to privacy@loconomy.com...", variant: "default" })}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Our Privacy Team
          </Button>
        </div>
      </section>
    </div>
  )
}