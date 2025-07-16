import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TrainingCertificationPage() {
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
            <Award className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Training & Certification
              </h1>
              <p className="text-muted-foreground">
                Enhance your skills and earn certifications
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Development */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Professional Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Access our comprehensive training modules to improve your
                service quality and customer satisfaction.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Customer Service Excellence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Safety and Compliance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Business Best Practices
                </li>
              </ul>
              <Button className="w-full">Start Learning</Button>
            </CardContent>
          </Card>

          {/* Certification Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certification Programs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Earn industry-recognized certifications to boost your
                credibility and attract more customers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Loconomy Verified Professional
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Safety and Insurance Certified
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Customer Excellence Badge
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View Certifications
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of providers who have enhanced their skills through
              our training programs.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
