"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle
} from "lucide-react";

export default function InsightsSection() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
                      <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">+23.5%</div>
            <div className="text-sm, text-gray-600">Avg, Conversion Lift</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">12,450</div>
            <div className="text-sm text-gray-600">Total Test Participants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-gray-600">Tests Completed</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>What we've learned from your experiments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Action-oriented CTAs perform 27% better</div>
                <div className="text-sm text-gray-600">
                  "Find My Provider" outperformed "Post Job" by 27% in conversion rate
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium">Visual trust signals increase contact rates</div>
                <div className="text-sm text-gray-600">
                  Provider cards with verification badges get 34% more contacts
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium">Shorter forms reduce abandonment by 18%</div>
                <div className="text-sm text-gray-600">
                  3-step job posting process vs 5-step shows significant improvement
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}