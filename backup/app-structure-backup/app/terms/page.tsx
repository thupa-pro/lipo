"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User, Briefcase, DollarSign, MessageSquare, Shield, Gavel, Info, Mail, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function TermsOfServicePage() {
  const { toast } = useToast()
  const router = useRouter()

  const termsSections = [
    {
      icon: Info,
      title: "1. Acceptance of Terms",
      description: "By accessing or using Loconomy, you agree to be bound by these Terms of Service.",
      content: [
        "These Terms of Service ('Terms') govern your access to and use of the Loconomy website, mobile applications, and services (collectively, the 'Service'). By accessing or using the Service, you agree to be bound by these Terms and by our Privacy Policy, which is incorporated herein by reference. If you do not agree to these Terms, you may not access or use the Service.",
        "We may modify these Terms at any time, in our sole discretion. If we do so, we will post the modified Terms on the Service and will provide notice of the modification. Your continued use of the Service after any such modification constitutes your acceptance of the modified Terms.",
      ],
    },
    {
      icon: User,
      title: "2. User Accounts",
      description: "Information regarding account creation, responsibilities, and termination.",
      content: [
        "To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
        "You are responsible for safeguarding your password and for any activities or actions under your account. You agree to notify Loconomy immediately of any unauthorized use of your account. Loconomy cannot and will not be liable for any loss or damage arising from your failure to comply with the above requirements.",
      ],
    },
    {
      icon: Briefcase,
      title: "3. Service Usage",
      description: "Guidelines for requesting and providing services through the platform.",
      content: [
        "Loconomy provides a platform for users seeking and providing local services ('Customers' and 'Providers'). Customers can post job requests, and Providers can offer their services. Loconomy acts solely as a marketplace and is not directly involved in the provision of services.",
        "Users agree to conduct all interactions professionally and respectfully. Any misuse of the platform, including but not limited to fraudulent activities, harassment, or illegal acts, will result in immediate account termination and potential legal action.",
      ],
    },
    {
      icon: DollarSign,
      title: "4. Payments and Fees",
      description: "Details on payment processing, service fees, and refunds.",
      content: [
        "Payments for services booked through Loconomy are processed securely via our third-party payment processor. Customers agree to pay all applicable fees and charges for services rendered. Providers agree to adhere to the agreed-upon pricing for their services.",
        "Loconomy may charge a service fee to either Customers or Providers, or both, for facilitating transactions on the platform. All fees will be clearly disclosed before a transaction is completed. Refund policies are outlined separately and are subject to the nature of the service and dispute resolution outcomes.",
      ],
    },
    {
      icon: MessageSquare,
      title: "5. Content and Conduct",
      description: "Rules regarding user-generated content and behavior on the platform.",
      content: [
        "Users are solely responsible for any content they post, including reviews, messages, and profile information. You agree not to post any content that is illegal, offensive, defamatory, infringing on intellectual property rights, or harmful to others.",
        "Loconomy reserves the right to remove any content that violates these Terms or is deemed inappropriate, in our sole discretion, without prior notice. Repeated violations may lead to account suspension or termination.",
      ],
    },
    {
      icon: Shield,
      title: "6. Disclaimers and Limitation of Liability",
      description: "Important legal disclaimers and limits on our liability.",
      content: [
        "THE SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. LOCONOMY DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.",
        "IN NO EVENT SHALL LOCONOMY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (ii) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (iii) ANY CONTENT OBTAINED FROM THE SERVICE; AND (iv) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.",
      ],
    },
    {
      icon: Gavel,
      title: "7. Governing Law",
      description: "The jurisdiction and laws that govern these terms.",
      content: [
        "These Terms shall be governed and construed in accordance with the laws of the State of [Your State/Country], without regard to its conflict of law provisions.",
        "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.",
      ],
    },
    {
      icon: FileText,
      title: "8. Changes to These Terms",
      description: "How we will notify you of updates to our Terms of Service.",
      content: [
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
        "By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.",
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
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto max-w-4xl">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Please read these terms carefully before using our platform.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: October 26, 2023</p>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Agreement with Loconomy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These terms outline your rights and responsibilities when using our services.
            </p>
          </div>

          <div className="space-y-12">
            {termsSections.map((section, index) => (
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

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Terms?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            If you have any questions regarding these Terms of Service, please contact us.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email Legal Team", description: "Opening your email client to legal@loconomy.com...", variant: "default" })}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Our Legal Team
          </Button>
        </div>
      </section>
    </div>
  )
}