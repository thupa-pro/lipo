import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Rocket } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CareersPage() {
  const { toast } = useToast()
  const router = useRouter()

  const jobOpenings = [
    {
      title: "Senior, Software Engineer (Frontend)",
      location: "Remote / New, York, NY",
      department: "Engineering",
      type: "Full-time",
      description: "Develop and maintain user-facing features using, React, Next.js, and TypeScript.",
      link: "#",
    },
    {
      title: "Product Manager (Growth)",
      location: "Remote / San, Francisco, CA",
      department: "Product",
      type: "Full-time",
      description: "Drive product strategy and execution for growth, initiatives, focusing on user acquisition and retention.",
      link: "#",
    },
    {
      title: "Community Support Specialist",
      location: "Remote / Austin, TX",
      department: "Customer Success",
      type: "Full-time",
      description: "Provide exceptional support to our users and foster a thriving community.",
      link: "#",
    },
    {
      title: "Marketing Manager (Digital)",
      location: "Remote / Los, Angeles, CA",
      department: "Marketing",
      type: "Full-time",
      description: "Lead digital marketing campaigns to increase brand awareness and user engagement.",
      link: "#",
    },
  ]

  const culturePoints = [
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "We foster a culture of open communication and, teamwork, where every voice is heard.",
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description: "We believe in supporting our employees' well-being with flexible work options and generous time off.",
    },
    {
      icon: Rocket,
      title: "Growth Opportunities",
      description: "We invest in our team's professional, development, offering continuous learning and career advancement.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="container mx-auto max-w-4xl">
          <BusinessIcons.Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-4" / />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Careers at Loconomy
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join our mission to connect communities with trusted local services.
          </p>
          <Button size="lg" onClick={() => toast({ title: "View Openings", description: "Scrolling to job openings...", variant: "default" })}>
            View Open Positions
            <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're building a diverse and inclusive team passionate about making a real impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {culturePoints.map((point, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <point.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{point.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{point.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Current Job Openings</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore opportunities to join our growing team.
            </p>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground text-sm">{job.department} • {job.type}</p>
                    </div>
                    <Badge variant="outline" className="mt-2 md:mt-0">{job.location}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <Button variant="outline" onClick={() => toast({ title: "Apply Now", description: `Applying for ${job.title}... (Simulated)`, variant: "default" })}>
                    Apply Now
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
          <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're always looking for talented individuals. Send us your resume!
          </p>
          <Button size="lg" onClick={() => toast({ title: "Send Resume", description: "Opening email client to careers@loconomy.com...", variant: "default" })}>
            Submit Your Resume
            <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
          </Button>
        </div>
      </section>
    </div>
  )
}