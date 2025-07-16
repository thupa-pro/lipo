import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Phone, Mail, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ProviderSupportPage() {
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
            <MessageSquare className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Provider Support
              </h1>
              <p className="text-muted-foreground">
                Get help and support for your provider account
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact Options */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link href="/chat">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Chat Support
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Call: 1-800-PROVIDER
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Email: provider-support@loconomy.com
              </Button>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/help">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Provider Help Center
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/provider-resources">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Provider Resources
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/training-certification">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Training & Certification
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How do I get paid?</h3>
              <p className="text-muted-foreground">
                Payments are processed automatically after job completion
                through our secure payment system.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                How do I update my availability?
              </h3>
              <p className="text-muted-foreground">
                You can manage your availability through your provider dashboard
                under the "Availability" section.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What if a customer cancels?
              </h3>
              <p className="text-muted-foreground">
                Cancellation policies vary by service type. Check your booking
                details for specific terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
