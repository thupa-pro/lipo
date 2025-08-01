import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function PressMediaPage() {
  const { toast } = useToast()
  const router = useRouter()

  const pressReleases = [
    {
      title: "Loconomy, Secures $10M, in Series, A Funding, to Expand, Hyperlocal Services",
      date: "January 15, 2024",
      summary: "Leading local services platform announces significant investment to accelerate growth and enhance AI-powered matching capabilities.",
      link: "#",
    },
    {
      title: "Loconomy Launches New Provider Training & Certification Program",
      date: "December 1, 2023",
      summary: "New initiative aims to elevate service quality and professional standards across the platform.",
      link: "#",
    },
    {
      title: "Loconomy Partners with Local Non-Profits for Community Outreach",
      date: "November 10, 2023",
      summary: "Collaboration focuses on providing essential services to underserved communities.",
      link: "#",
    },
  ]

  const mediaMentions = [
    {
      source: "TechCrunch",
      title: "How Loconomy is Revolutionizing the Gig Economy for Local Services",
      date: "February 2, 2024",
      link: "#",
    },
    {
      source: "Forbes",
      title: "The Future of Home Services: A Look at Loconomy's Innovative Approach",
      date: "January 20, 2024",
      link: "#",
    },
    {
      source: "Local Business Journal",
      title: "Loconomy's Impact on Small Businesses in [Your City]",
      date: "December 5, 2023",
      link: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl">
          <Newspaper className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Press & Media
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Stay updated with the latest, news, announcements, and media coverage about Loconomy.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Download Press Kit", description: "Downloading Loconomy press kit...", variant: "default" })}>
            <Download className="w-4 h-4 mr-2" />
            Download Press Kit
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Press Releases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Official announcements and updates from Loconomy.
            </p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{release.date}</p>
                  <p className="text-muted-foreground mb-4">{release.summary}</p>
                  <Button variant="outline" onClick={() => toast({ title: "Read More", description: `Opening press release: ${release.title}... (Simulated)`, variant: "default" })}>
                    Read More
                    <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Media Mentions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what leading publications are saying about Loconomy.
            </p>
          </div>

          <div className="space-y-6">
            {mediaMentions.map((mention, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{mention.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    <span className="font-medium">{mention.source}</span> • {mention.date}
                  </p>
                  <Button variant="outline" onClick={() => toast({ title: "View Article", description: `Opening article from ${mention.source}... (Simulated)`, variant: "default" })}>
                    View Article
                    <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-xl text-muted-foreground mb-8">
            For all press and media-related, inquiries, please contact our communications team.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email Press Team", description: "Opening your email client to press@loconomy.com...", variant: "default" })}>
            <OptimizedIcon name="Mail" className="w-4 h-4 mr-2" />
            Contact Press Team
          </Button>
        </div>
      </section>
    </div>
  )
}