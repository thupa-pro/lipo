import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, DollarSign, Globe } from "lucide-react";
import Link from "next/link";

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Investor Relations
              </h1>
              <p className="text-muted-foreground">
                Financial information and company updates
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">2.1M+</p>
                  <p className="text-sm text-green-600">+847% YoY</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">$47M</p>
                  <p className="text-sm text-green-600">+312% YoY</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Markets</p>
                  <p className="text-2xl font-bold">180</p>
                  <p className="text-sm text-blue-600">Countries</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-2xl font-bold">847%</p>
                  <p className="text-sm text-green-600">Annual</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Market Opportunity</h3>
                <p className="text-muted-foreground">
                  The global local services market is valued at $1.5 trillion
                  and growing at 15% annually.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Competitive Advantage</h3>
                <p className="text-muted-foreground">
                  AI-powered matching, verified professionals, and
                  enterprise-grade security.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Revenue Model</h3>
                <p className="text-muted-foreground">
                  Commission-based with subscription tiers for premium features.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                Quarterly Earnings Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Annual Report 2024
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Investor Presentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                SEC Filings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Investor Contact</h2>
            <p className="text-muted-foreground mb-6">
              For more information about investment opportunities and financial
              reports.
            </p>
            <div className="flex gap-4 justify-center">
              <Button>Contact Investor Relations</Button>
              <Button variant="outline">Subscribe to Updates</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
