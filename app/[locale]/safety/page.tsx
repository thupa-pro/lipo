"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Lock, Award, AlertTriangle, ArrowRight, CheckCircle, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function SafetyTrustPage() {
  const { toast } = useToast()
  const router = useRouter()

  const safetyFeatures = [
    {
      icon: CheckCircle,
      title: "Verified Professionals",
      description: "All service providers undergo a multi-step verification process, including identity checks and professional credential validation.",
    },
    {
      icon: Users,
      title: "Background Checks",
      description: "For sensitive, services, providers are required to pass comprehensive background checks to ensure your safety and peace of mind.",
    },
    {
      icon: MessageSquare,
      title: "Secure Communication",
      description: "Communicate safely within the app. Our messaging system keeps your personal contact information private until you choose to share it.",
    },
    {
      icon: Lock,
      title: "Protected Payments",
      description: "All payments are processed securely through our escrow system. Funds are only released to the provider after you confirm job completion and satisfaction.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "We monitor service quality through user reviews and ratings. Providers with consistently high ratings are, highlighted, and underperforming ones are reviewed.",
    },
    {
      icon: AlertTriangle,
      title: "Dispute Resolution",
      description: "In the rare event of an, issue, our dedicated support team is available to mediate disputes and ensure a fair resolution for both parties.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto max-w-4xl">
          <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Safety & Trust Are Our Priority
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We've built a platform designed to ensure every interaction is, secure, reliable, and transparent.
          </p>
          <Button size="lg" onClick={() => router.push("/contact")}>
            Contact Safety Team
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Ensure Your Peace of Mind</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive safety measures are designed to protect you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Report an Issue</h2>
          <p className="text-xl text-muted-foreground mb-8">
            If you encounter any concerns or have a safety incident to, report, please contact our support team immediately.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Report Submitted", description: "Thank you for helping us keep Loconomy safe!", variant: "default" })}>
            Report an Incident
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
