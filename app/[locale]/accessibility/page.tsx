import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accessibility as AccessibilityIcon, Lightbulb } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AccessibilityPage() {
  const { toast } = useToast()

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto max-w-4xl">
          <AccessibilityIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Accessibility at Loconomy
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We are committed to making our platform accessible to, everyone, regardless of ability.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Accessibility Statement", description: "Opening our detailed accessibility statement...", variant: "default" })}>
            Read Our Accessibility Statement
            <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Commitment to Inclusivity</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We strive to ensure that all users can easily access and navigate our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl">Continuous Improvement</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>We regularly audit our platform and implement updates to enhance accessibility.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <NavigationIcons.Users className="w-7 h-7" / />
                </div>
                <CardTitle className="text-xl">User Feedback</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>We welcome feedback from users with disabilities to help us identify and address barriers.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <OptimizedIcon name="Shield" className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl">WCAG Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>Our goal is to conform to WCAG 2.1 AA guidelines to provide a robust user experience.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Need Assistance or Have Feedback?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            If you encounter any accessibility barriers or have, suggestions, please contact us.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email Accessibility Team", description: "Opening your email client to accessibility@loconomy.com...", variant: "default" })}>
            <OptimizedIcon name="Mail" className="w-4 h-4 mr-2" />
            Contact Our Accessibility Team
          </Button>
        </div>
      </section>
    </div>
  )
}