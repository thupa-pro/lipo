"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Link as LinkIcon, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function SitemapPage() {
  const { toast } = useToast()
  const router = useRouter()

  const sitemapSections = [
    {
      title: "Customers",
      links: [
        { label: "Home", href: "/" },
        { label: "Browse Services", href: "/browse" },
        { label: "Request Service", href: "/request-service" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Pricing (Customers)", href: "/pricing" },
        { label: "Safety & Trust", href: "/safety" },
        { label: "Customer Support", href: "/customer-support" },
      ],
    },
    {
      title: "Providers",
      links: [
        { label: "Become a Provider", href: "/become-provider" },
        { label: "Provider Resources", href: "/provider-resources" },
        { label: "Provider App", href: "/provider-app" },
        { label: "Provider Support", href: "/provider-support" },
        { label: "Success Stories", href: "/success-stories" },
        { label: "Training & Certification", href: "/training-certification" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press & Media", href: "/press" },
        { label: "Blog", href: "/blog" },
        { label: "Investors", href: "/investors" },
        { label: "Partnerships", href: "/partnerships" },
      ],
    },
    {
      title: "Legal & Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "Community", href: "/community" },
        { label: "Feedback", href: "/feedback" },
        { label: "Accessibility", href: "/accessibility" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
      ],
    },
    {
      title: "Authentication",
      links: [
        { label: "Sign In", href: "/auth/signin" },
        { label: "Sign Up", href: "/auth/signup" },
        { label: "Forgot Password", href: "/auth/forgot-password" },
      ],
    },
    {
      title: "Dashboard & AI Demos",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "AI Demo", href: "/ai-demo" },
        { label: "Funnel Optimization", href: "/funnel-optimization" },
        { label: "Growth Engine", href: "/growth-engine" },
        { label: "Multi-Region", href: "/multi-region" },
        { label: "Post-Launch", href: "/post-launch" },
        { label: "UI Evolution", href: "/ui-evolution" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto max-w-4xl">
          <Map className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Loconomy Sitemap
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A comprehensive overview of all pages and sections on our website.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Back to Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Our Website</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Navigate through all the key areas of Loconomy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitemapSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <LinkIcon className="w-5 h-5 mr-2 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}