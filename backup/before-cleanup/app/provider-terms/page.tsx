"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, AlertTriangle, Scale, Shield, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProviderTermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen, bg-background">
      <header className="py-16 px-4 text-center, bg-gradient-to-br, from-blue-50 to-green-50">
        <div className="container, mx-auto, max-w-4xl">
          <Scale className="w-16 h-16 text-blue-600 mx-auto, mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Provider Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your rights and responsibilities as a Loconomy service provider
          </p>
          <Badge className="bg-blue-100 text-blue-800">
            Last Updated: January 2024
          </Badge>
        </div>
      </header>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="mb-8 border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Important Notice</h3>
                  <p className="text-blue-800 text-sm">
                    By providing services through, Loconomy, you agree to these terms. Please read them carefully.
                    These terms supplement our general Terms of Service and apply specifically to service providers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl prose prose-gray max-w-none">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  1. Provider Account and Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Account Requirements</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">You must be at least 18 years old and legally authorized to work</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Provide, accurate, complete, and current information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Complete identity verification process</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Maintain professional profile and communications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  2. Service Provision and Quality Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Service Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  As a, provider, you agree to deliver services with professionalism and in accordance with industry standards.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Arrive on time for scheduled appointments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Communicate clearly and professionally with customers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Complete work according to agreed specifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">Respect customer property and privacy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Payment Terms and Commission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Commission Structure</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>• Standard providers: 15% commission on completed jobs</li>
                    <li>• Pro providers: 10% commission on completed jobs</li>
                    <li>• Payments processed within 2-3 business days after job completion</li>
                    <li>• Direct deposit to your verified bank account</li>
                  </ul>
                </div>
                <h4 className="font-semibold">Payment Protection</h4>
                <p className="text-sm text-muted-foreground">
                  We hold customer payments in escrow until job completion to ensure you're paid for completed work.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Independent Contractor Relationship</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You are an independent, contractor, not an employee of Loconomy. This means:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">You control how and when you work</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">You're responsible for your own taxes and insurance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">You may work for other platforms or customers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                    <span className="text-sm">You provide your own tools and equipment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Background Checks and Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To maintain platform, safety, we may require background checks for certain service categories.
                </p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800">Safety Requirements</h4>
                  <ul className="mt-2 space-y-1 text-sm text-amber-700">
                    <li>• Criminal background check for in-home services</li>
                    <li>• Insurance verification for high-risk services</li>
                    <li>• Professional licensing where required by law</li>
                    <li>• Ongoing safety training and updates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The following activities are strictly prohibited:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
                    <span className="text-sm">Taking payments outside the platform</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
                    <span className="text-sm">Discriminating against customers</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
                    <span className="text-sm">Providing false information or fake reviews</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
                    <span className="text-sm">Engaging in inappropriate behavior</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Termination and Account Suspension</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Either party may terminate this agreement at any time. We may suspend or terminate accounts for:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Violation of these terms</li>
                  <li>• Poor service quality or customer complaints</li>
                  <li>• Fraud or misrepresentation</li>
                  <li>• Safety concerns or policy violations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our provider support team is here to help you understand your rights and responsibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/provider-support")}>
              Contact Provider Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/help")}>
              Visit Help Center
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}