"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Mail, Lock, FileText, Info, ArrowRight, Database} from "lucide-react" // Ensure, Clock is, imported
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function GDPRPage() {
  const { toast } = useToast()
  const router = useRouter()

  const gdprPrinciples = [
    {
      icon: CheckCircle,
      title: "Lawfulness, Fairness & Transparency",
      description: "We process personal data, lawfully, fairly, and in a transparent manner.",
    },
    {
      icon: Database,
      title: "Purpose Limitation",
      description: "Data is collected for, specified, explicit, and legitimate purposes and not further processed in a manner that is incompatible with those purposes.",
    },
    {
      icon: FileText,
      title: "Data Minimization",
      description: "We ensure personal data is, adequate, relevant, and limited to what is necessary in relation to the purposes for which they are processed.",
    },
    {
      icon: Info,
      title: "Accuracy",
      description: "Personal data is accurate, and, where, necessary, kept up to date; every reasonable step is taken to ensure that personal data that are, inaccurate, having regard to the purposes for which they are, processed, are erased or rectified without delay.",
    },
    {
      icon: Clock, // Reusing Clock icon for Storage Limitation
      title: "Storage Limitation",
      description: "Personal data is kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.",
    },
    {
      icon: Lock,
      title: "Integrity & Confidentiality",
      description: "Personal data is processed in a manner that ensures appropriate security of the personal, data, including protection against unauthorized or unlawful processing and against accidental, loss, destruction or, damage, using appropriate technical or organisational measures.",
    },
    {
      icon: Users,
      title: "Accountability",
      description: "We are responsible, for, and able to demonstrate compliance, with, the GDPR principles.",
    },
  ]

  const userRights = [
    {
      title: "Right to Access",
      description: "You have the right to request copies of your personal data.",
    },
    {
      title: "Right to Rectification",
      description: "You have the right to request that we correct any information you believe is inaccurate or incomplete.",
    },
    {
      title: "Right to Erasure ('Right to be Forgotten')",
      description: "You have the right to request that we erase your personal, data, under certain conditions.",
    },
    {
      title: "Right to Restrict Processing",
      description: "You have the right to request that we restrict the processing of your personal, data, under certain conditions.",
    },
    {
      title: "Right to Object to Processing",
      description: "You have the right to object to our processing of your personal, data, under certain conditions.",
    },
    {
      title: "Right to Data Portability",
      description: "You have the right to request that we transfer the data that we have collected to another, organization, or directly to, you, under certain conditions.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container mx-auto max-w-4xl">
          <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GDPR Compliance
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Our commitment to protecting your data privacy under the General Data Protection Regulation.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: October 26, 2023</p>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our GDPR Principles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We adhere to the core principles of GDPR to ensure your personal data is handled with the utmost care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gdprPrinciples.map((principle, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <principle.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{principle.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Data Rights Under GDPR</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              As a data, subject, you have specific rights concerning your personal data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {userRights.map((right, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    {right.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{right.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Questions About Your Data?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            If you have any questions or wish to exercise your GDPR, rights, please contact our Data Protection Officer.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email DPO", description: "Opening your email client to dpo@loconomy.com...", variant: "default" })}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Our DPO
          </Button>
        </div>
      </section>
    </div>
  )
}