"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, HelpCircle, BookOpen, Users, ArrowRight, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import AIChat from "@/components/ai/AIChat"

export default function CustomerSupportPage() {
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Support Request Sent!",
      description: "We've received your message and will get back to you shortly.",
      variant: "default",
    })
    // Simulate form reset
    e.currentTarget.reset();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto max-w-4xl">
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Customer Support
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're here to help! Find answers to your questions or contact our support team.
          </p>
          <Button size="lg" onClick={() => router.push("/help")}>
            Visit Help Center
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Can We Assist You?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the best way to get the help you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-4">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Help Center</h3>
                <p className="text-muted-foreground mb-4">Find instant answers to common questions.</p>
                <Button variant="outline" asChild>
                  <Link href="/help">Go to Help Center</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 mb-4">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">Chat with a support agent in real-time.</p>
                <Button variant="outline" onClick={() => toast({ title: "Live Chat", description: "Connecting you to a support agent...", variant: "default" })}>Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 mb-4">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Forum</h3>
                <p className="text-muted-foreground mb-4">Ask questions and get help from other users.</p>
                <Button variant="outline" asChild>
                  <Link href="/community">Visit Forum</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" required />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Issue with my booking" required />
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" rows={5} placeholder="Describe your issue in detail..." required />
                </div>
                <Button type="submit" className="w-full">
                  Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            For urgent matters, you can reach us directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="outline" onClick={() => toast({ title: "Calling Support", description: "Dialing 1-800-LOCONOMY...", variant: "default" })}>
              <Phone className="w-4 h-4 mr-2" />
              Call Us: 1-800-LOCONOMY
            </Button>
            <Button size="lg" variant="outline" onClick={() => toast({ title: "Email Support", description: "Opening your email client to support@loconomy.com...", variant: "default" })}>
              <Mail className="w-4 h-4 mr-2" />
              Email Us: support@loconomy.com
            </Button>
          </div>
        </div>
      </section>

      {/* AI Customer Success Champion */}
      <AIChat 
        agentId="zoe"
        context={{
          currentPage: 'customer-support',
          accountType: 'customer',
          supportLevel: 'standard'
        }}
        position="floating"
        theme="brand"
        proactiveMessage={true}
      />
    </div>
  )
}