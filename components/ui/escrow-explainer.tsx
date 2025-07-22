"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {  CreditCard, CheckCircle, DollarSign, Lock, Users, HelpCircle, ArrowRight } from "lucide-react"

interface EscrowStep {
  id: number
  title: string
  description: string
  icon: React.ElementType
  status: "completed" | "active" | "pending"
  details: string[]
}

export default function EscrowExplainer() {
  const [currentStep, setCurrentStep] = useState(2)
  const [showFAQ, setShowFAQ] = useState(false)

  const escrowSteps: EscrowStep[] = [
    {
      id: 1,
      title: "Payment Secured",
      description: "Your payment is held safely in our escrow account",
      icon: Lock,
      status: "completed",
      details: [
        "Payment is immediately secured",
        "Funds are held by trusted third party",
        "Provider cannot access until job completion",
      ],
    },
    {
      id: 2,
      title: "Service in Progress",
      description: "Provider completes the work as agreed",
      icon: Clock,
      status: "active",
      details: [
        "Provider begins work with payment guaranteed",
        "You can track progress in real-time",
        "Communication tools keep everyone updated",
      ],
    },
    {
      id: 3,
      title: "Work Completed",
      description: "You review and approve the completed service",
      icon: CheckCircle,
      status: "pending",
      details: ["Review the completed work", "Request changes if needed", "Approve when satisfied"],
    },
    {
      id: 4,
      title: "Payment Released",
      description: "Funds are automatically released to the provider",
      icon: DollarSign,
      status: "pending",
      details: [
        "Payment released upon your approval",
        "Provider receives funds within 24 hours",
        "Transaction complete and secure",
      ],
    },
  ]

  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "256-bit SSL encryption protects all transactions",
    },
    {
      icon: Users,
      title: "Dispute Resolution",
      description: "24/7 support team handles any payment disputes",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "Credit cards, debit cards, and digital wallets accepted",
    },
    {
      icon: CheckCircle,
      title: "Satisfaction Guarantee",
      description: "Full refund if service doesn't meet expectations",
    },
  ]

  const faqs = [
    {
      question: "What happens if I'm not satisfied with the work?",
      answer:
        "You can request revisions or dispute the payment. Our support team will mediate and ensure a fair resolution. If the work is unsatisfactory, you may receive a full refund.",
    },
    {
      question: "When does the provider get paid?",
      answer:
        "The provider receives payment within 24 hours after you approve the completed work. This ensures you're satisfied before any money changes hands.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes, we use bank-level 256-bit SSL encryption and never store your full payment details. All transactions are processed through secure, PCI-compliant payment processors.",
    },
    {
      question: "Can I get a refund if the provider doesn't show up?",
      answer:
        "Absolutely. If a provider fails to show up or complete the agreed work, you'll receive a full refund. We also have backup providers to help complete your job.",
    },
  ]

  const getStepStatus = (step: EscrowStep) => {
    if (step.status === "completed") return "bg-green-500"
    if (step.status === "active") return "bg-blue-500"
    return "bg-gray-300"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            How Escrow Protection Works
          </CardTitle>
          <CardDescription>Your payment is protected every step of the way</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Transaction Progress</span>
              <span className="text-sm font-bold text-primary">Step {currentStep} of 4</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              Your payment is secure and will only be released when you're satisfied
            </p>
          </div>

          {/* Escrow Steps */}
          <div className="space-y-4">
            {escrowSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepStatus(step)}`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{step.title}</h4>
                    {step.status === "active" && (
                      <Badge className="bg-blue-500 text-white animate-pulse">Current</Badge>
                    )}
                    {step.status === "completed" && <Badge className="bg-green-500 text-white">✓</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Protection</CardTitle>
          <CardDescription>Multiple layers of security protect your payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about escrow payments</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFAQ(!showFAQ)}>
              {showFAQ ? "Hide" : "Show"} FAQ
            </Button>
          </div>
        </CardHeader>
        {showFAQ && (
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-semibold text-sm mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Trust Indicators */}
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-200">100% Payment Protection</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Over $2.5M in payments processed safely</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-xs text-green-600">Satisfaction Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
