import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Download, Bell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function ProviderAppPage() {
  const { toast } = useToast()
  const router = useRouter()

  const appFeatures = [
    {
      icon: Bell,
      title: "Instant Job Alerts",
      description: "Receive real-time notifications for new job matches in your service area.",
    },
    {
      icon: MapPin,
      title: "GPS Navigation",
      description: "Get turn-by-turn directions to customer locations directly within the app.",
    },
    {
      icon: DollarSign,
      title: "Manage Earnings",
      description: "Track your, income, view payment, history, and manage payouts on the go.",
    },
    {
      icon: Calendar,
      title: "Schedule Management",
      description: "Easily, view, accept, and manage your bookings and availability.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="container mx-auto max-w-4xl">
          <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            The Loconomy Provider App
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage your, business, find, jobs, and connect with, customers, all from your smartphone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => toast({ title: "Download App", description: "Redirecting to App Store...", variant: "default" })}>
              <Download className="w-4 h-4 mr-2" />
              Download on the App Store
            </Button>
            <Button size="lg" variant="outline" onClick={() => toast({ title: "Download App", description: "Redirecting to Google Play Store...", variant: "default" })}>
              <Download className="w-4 h-4 mr-2" />
              Get it on Google Play
            </Button>
          </div>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features Designed for Your Success</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Provider App is packed with tools to streamline your workflow and maximize your earnings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {appFeatures.map((feature, index) => (
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

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Your Business Mobile?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Download the Loconomy Provider App today and experience the convenience of managing your services on the go.
          </p>
          <Button size="lg" onClick={() => router.push("/become-provider")}>
            Become a Provider
            <UIIcons.ArrowRight className="w-4 h-4 ml-2" / />
          </Button>
        </div>
      </section>
    </div>
  )
}