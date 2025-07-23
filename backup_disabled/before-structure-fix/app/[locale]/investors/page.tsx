"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, BarChart3, FileText, Mail, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function InvestorsPage() {
  const { toast } = useToast()
  const router = useRouter()

  const metrics = [
    {
      icon: DollarSign,
      title: "Total Funding",
      value: "$15M+",
      description: "Across Seed and Series A rounds",
    },
    {
      icon: TrendingUp,
      title: "Annual Growth",
      value: "150%",
      description: "Year-over-year user and revenue growth",
    },
    {
      icon: BarChart3,
      title: "Market Share",
      value: "12%",
      description: "In key hyperlocal service markets",
    },
  ]

  const reports = [
    {
      title: "Q4 2023 Investor Report",
      description: "Detailed financial performance and strategic outlook for the last quarter.",
      type: "PDF",
      action: { label: "Download Report", onClick: () => toast({ title: "Downloading Report", description: "Q4 2023 Investor Report is downloading...", variant: "default" }) },
    },
    {
      title: "Annual Shareholder Letter 2023",
      description: "A message from our CEO on company achievements and future plans.",
      type: "PDF",
      action: { label: "Read Letter", onClick: () => toast({ title: "Reading Letter", description: "Annual Shareholder Letter 2023 is opening...", variant: "default" }) },
    },
    {
      title: "Loconomy Pitch Deck (Series A)",
      description: "Our investor presentation from the successful Series A funding round.",
      type: "PDF",
      action: { label: "View Deck", onClick: () => toast({ title: "Viewing Pitch Deck", description: "Loconomy Pitch Deck is opening...", variant: "default" }) },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto max-w-4xl">
          <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Investor Relations
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Committed to transparency and long-term value creation for our investors.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Request Investor Access", description: "Sending request for investor portal access...", variant: "default" })}>
            Request Investor Access
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Performance Indicators</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Highlights of our strong growth and market position.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <metric.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{metric.title}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                  <p className="text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Financial Reports & Presentations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access our latest financial documents and investor presentations.
            </p>
          </div>

          <div className="space-y-6">
            {reports.map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold">{report.title}</h3>
                      <p className="text-muted-foreground text-sm">{report.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={report.action.onClick}>
                    {report.action.label} ({report.type})
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Investor Inquiries</h2>
          <p className="text-xl text-muted-foreground mb-8">
            For investor-related, questions, please contact our investor relations team.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email Investor Relations", description: "Opening your email client to investors@loconomy.com...", variant: "default" })}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Investor Relations
          </Button>
        </div>
      </section>
    </div>
  )
}