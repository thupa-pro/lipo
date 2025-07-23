"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Lightbulb, Award, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import AIChat from "@/components/ai/AIChat"

export default function CommunityPage() {
  const { toast } = useToast()
  const router = useRouter()

  const communitySections = [
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Engage with other, users, ask, questions, and share your experiences.",
      action: { label: "Visit Forums", onClick: () => toast({ title: "Forums", description: "Opening community forums...", variant: "default" }) },
    },
    {
      icon: Lightbulb,
      title: "Tips & Best Practices",
      description: "Discover and share valuable advice for both customers and providers.",
      action: { label: "Explore Tips", onClick: () => toast({ title: "Tips & Tricks", description: "Loading tips and best practices...", variant: "default" }) },
    },
    {
      icon: Award,
      title: "Success Stories",
      description: "Read inspiring stories from users who have achieved great things with Loconomy.",
      action: { label: "Read Stories", href: "/success-stories" },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto max-w-4xl">
          <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loconomy Community
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect, share, and grow with fellow Loconomy users and service providers.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Join Community", description: "Joining the Loconomy Community...", variant: "default" })}>
            Join Our Community
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What You'll Find Here</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A vibrant space for, interaction, learning, and support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {communitySections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <section.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">{section.description}</CardDescription>
                  <Button variant="outline" onClick={section.action.onClick || (() => router.push(section.action.href || "/"))}>
                    {section.action.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Be a Part of Something Bigger</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Your contributions help shape the future of Loconomy and support fellow users.
          </p>
          <Button size="lg" onClick={() => router.push("/feedback")}>
            Share Your Feedback
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* AI Community Guardian */}
      <AIChat 
        agentId="sage"
        context={{
          currentPage: 'community',
          accountType: 'community_member',
          communityLevel: 'member'
        }}
        position="floating"
        theme="brand"
        proactiveMessage={true}
      />
    </div>
  )
}