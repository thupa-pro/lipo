import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Handshake, Building, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Handshake className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Partnerships
              </h1>
              <p className="text-muted-foreground">
                Build strategic partnerships with Loconomy
              </p>
            </div>
          </div>
        </div>

        {/* Partnership Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Enterprise Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Partner with us to provide services to your employees and
                customers.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• White-label solutions</li>
                <li>• API integrations</li>
                <li>• Custom enterprise features</li>
                <li>• Dedicated account management</li>
              </ul>
              <Button className="w-full">Learn More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Service Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Join our network of professional service providers and
                contractors.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Referral programs</li>
                <li>• Training and certification</li>
                <li>• Marketing support</li>
                <li>• Technology integration</li>
              </ul>
              <Button variant="outline" className="w-full">
                Apply Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Technology Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Integrate your technology solutions with our platform.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• API partnerships</li>
                <li>• Plugin development</li>
                <li>• Data integrations</li>
                <li>• Joint solutions</li>
              </ul>
              <Button variant="outline" className="w-full">
                Explore APIs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                Strategic Alliances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Create long-term strategic partnerships for mutual growth.</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Co-marketing opportunities</li>
                <li>• Joint ventures</li>
                <li>• Market expansion</li>
                <li>• Innovation partnerships</li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Partner Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Partner Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Access to Network</h3>
                <p className="text-sm text-muted-foreground">
                  Reach our 2.1M+ users and 50K+ service providers
                </p>
              </div>
              <div className="text-center">
                <Building className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Revenue Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Increase revenue through our platform and partnerships
                </p>
              </div>
              <div className="text-center">
                <Globe className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Expand into 180+ countries with our platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Partner?</h2>
            <p className="text-muted-foreground mb-6">
              Let's explore how we can work together to create value for both
              our businesses.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Start Partnership Discussion</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">Learn About Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
