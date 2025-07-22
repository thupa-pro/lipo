"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Award, BookOpen, Video, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function TrainingCertificationPage() {
  const { toast } = useToast()
  const router = useRouter()

  const programs = [
    {
      icon: BookOpen,
      title: "Loconomy Service Excellence Course",
      description: "Learn best practices for customer communication, service delivery, and reputation management.",
      modules: ["Customer Service Fundamentals", "Effective Communication", "Handling Difficult Situations", "Building Repeat Business"],
      action: { label: "Start Course", onClick: () => toast({ title: "Course Enrollment", description: "Enrolling in Service Excellence Course...", variant: "default" }) },
    },
    {
      icon: Video,
      title: "Platform Mastery Workshop",
      description: "A comprehensive guide to using the Loconomy app and dashboard to its full potential.",
      modules: ["Profile Optimization", "Job Management", "Payment & Payouts", "Analytics & Insights"],
      action: { label: "Join Workshop", onClick: () => toast({ title: "Workshop Registration", description: "Registering for Platform Mastery Workshop...", variant: "default" }) },
    },
    {
      icon: Award,
      title: "Certified Loconomy Professional",
      description: "Achieve official certification by completing advanced training and passing a final assessment.",
      modules: ["Advanced Service Techniques", "Legal & Compliance", "Marketing Your Services", "Final Certification Exam"],
      action: { label: "Apply for Certification", onClick: () => toast({ title: "Certification Application", description: "Applying for Certified Loconomy Professional...", variant: "default" }) },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto max-w-4xl">
          <GraduationCap className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Training & Certification
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Enhance your skills, boost your reputation, and unlock new opportunities with our professional programs.
          </p>
          <Button size="lg" onClick={() => router.push("/provider-resources")}>
            Explore All Resources
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Professional Development Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Invest in yourself and your business with our tailored training and certification pathways.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <program.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{program.description}</CardDescription>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Modules:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {program.modules.map((module, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {module}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full" onClick={program.action.onClick || (() => router.push(program.action.href || "/"))}>
                    {program.action.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Boost Your Credibility</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Becoming a certified Loconomy professional signals trust and expertise to potential customers.
          </p>
          <Button size="lg" onClick={() => router.push("/become-provider")}>
            Join Our Network
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}