import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie } from "lucide-react";
import Link from "next/link";

export default function CookiesPage() {
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
            <Cookie className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Cookie Policy
              </h1>
              <p className="text-muted-foreground">
                How we use cookies on Loconomy
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-sm text-muted-foreground mb-6">
              Last updated: December 2024
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are stored on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function and
                    cannot be switched off. They include authentication,
                    security, and basic functionality cookies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Performance Cookies</h3>
                  <p>
                    These cookies help us understand how visitors interact with
                    our website by collecting anonymous information about page
                    visits and user behavior.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Functionality Cookies</h3>
                  <p>
                    These cookies remember your preferences and settings to
                    provide you with a more personalized experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Marketing Cookies</h3>
                  <p>
                    These cookies are used to deliver relevant advertisements
                    and measure the effectiveness of our marketing campaigns.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Managing Cookies</h2>
              <p className="mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Browser settings: Most browsers allow you to view, manage, and
                  delete cookies
                </li>
                <li>
                  Cookie consent banner: Use our cookie consent tool to manage
                  your preferences
                </li>
                <li>
                  Third-party tools: Some third-party services provide opt-out
                  mechanisms
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Third-Party Cookies
              </h2>
              <p className="mb-4">
                We may use third-party services that set their own cookies,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> For website analytics and
                  performance monitoring
                </li>
                <li>
                  <strong>Stripe:</strong> For secure payment processing
                </li>
                <li>
                  <strong>Clerk:</strong> For authentication and user management
                </li>
                <li>
                  <strong>Supabase:</strong> For database and backend services
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please
                contact us at{" "}
                <a
                  href="mailto:privacy@loconomy.com"
                  className="text-primary hover:underline"
                >
                  privacy@loconomy.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
