"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Video, Users, TrendingUp, Lightbulb, Briefcase, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ProviderResourcesPage() {
  const { toast } = useToast()
  const router = useRouter()

  const resources = [
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Access articles, FAQs, and guides on managing your profile, jobs, and payments.",
      action: { label: "Visit Knowledge Base", href: "/help" },
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides to master the Loconomy platform and optimize your services.",
      action: { label: "Watch Tutorials", onClick: () => toast({ title: "Video Tutorials", description: "Opening video library...", variant: "default" }) },
    },
    {
      icon: Users,
      title: "Provider Community",
      description: "Connect with other professionals, share tips, and get advice in our exclusive provider forum.",
      action: { label: "Join Community", href: "/community" },
    },
    {
      icon: TrendingUp,
      title: "Growth & Marketing Tips",
      description: "Learn strategies to attract more customers, improve your ratings, and grow your business.",
      action: { label: "Explore Tips", onClick: () => toast({ title: "Growth Tips", description: "Loading marketing resources...", variant: "default" }) },
    },
    {
      icon: Lightbulb,
      title: "Best Practices Guide",
      description: "Discover proven methods for delivering exceptional service and building a strong reputation.",
      action: { label: "Read Guide", onClick: () => toast({ title: "Best Practices", description: "Opening best practices guide...", variant: "default" }) },
    },
    {
      icon: Briefcase,
      title: "Business Tools & Templates",
      description: "Download useful templates for invoicing, contracts, and business management.",
      action: { label: "Get Tools", onClick: () => toast({ title: "Business Tools", description: "Accessing business tools and templates...", variant: "default" }) },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto max-w-4xl">
          <Briefcase className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Provider Resources
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Everything you need to succeed on Loconomy and grow your service business.
          </p>
          <Button size="lg" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tools for Your Success</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive library of resources designed to help you thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <resource.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">{resource.description}</CardDescription>
                  <Button variant="outline" onClick={resource.action.onClick || (() => router.push(resource.action.href || "/"))}>
                    {resource.action.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Need Personalized Guidance?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our provider success team is here to offer tailored advice and support.
          </p>
          <Button size="lg" onClick={() => router.push("/provider-support")}>
            Contact Provider Support
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}