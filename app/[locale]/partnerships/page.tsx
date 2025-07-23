"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Building2, Users, Lightbulb, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function PartnershipsPage() {
  const { toast } = useToast()
  const router = useRouter()

  const partnershipTypes = [
    {
      icon: Building2,
      title: "Corporate Partnerships",
      description: "Collaborate with Loconomy to offer exclusive services to your employees or customers.",
      benefits: ["Employee benefits programs", "Customer loyalty initiatives", "Co-marketing opportunities"],
    },
    {
      icon: Users,
      title: "Community & Non-Profit",
      description: "Partner with us to support local initiatives and provide essential services to those in need.",
      benefits: ["Volunteer matching", "Discounted services for beneficiaries", "Local impact reporting"],
    },
    {
      icon: Lightbulb,
      title: "Technology Integrations",
      description: "Integrate your services or platforms with Loconomy to create seamless user experiences.",
      benefits: ["API access for service providers", "Data sharing agreements", "Joint product development"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto max-w-4xl">
          <Handshake className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Partnerships
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Collaborate with Loconomy to expand your reach, enhance your offerings, and make a greater impact.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Start Partnership", description: "Sending partnership inquiry...", variant: "default" })}>
            Propose a Partnership
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Types of Partnerships</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're open to various forms of collaboration that align with our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <type.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{type.description}</CardDescription>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Benefits:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {type.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Collaborate?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're excited to explore how we can work together to create mutual value.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email Partnerships", description: "Opening your email client to partnerships@loconomy.com...", variant: "default" })}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Our Partnerships Team
          </Button>
        </div>
      </section>
    </div>
  )
}