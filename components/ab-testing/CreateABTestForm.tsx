"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FlaskConical } from "lucide-react"

interface CreateABTestFormProps {
  onCreateTest: (testData: {
    name: string
    description: string
    primaryMetric: string
    duration: string
    trafficSplit: number
  }) => void
}

export default function CreateABTestForm({ onCreateTest }: CreateABTestFormProps) {
  const [newTest, setNewTest] = useState({
    name: "",
    description: "",
    primaryMetric: "",
    duration: "",
    trafficSplit: 50,
  })

  const handleSubmit = () => {
    onCreateTest(newTest)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New A/B Test</CardTitle>
        <CardDescription>Set up a custom experiment for your platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="test-name">Test Name</Label>
          <Input
            id="test-name"
            placeholder="e.g., Homepage Hero Button Color"
            value={newTest.name}
            onChange={(e) => setNewTest((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="test-description">Description</Label>
          <Textarea
            id="test-description"
            placeholder="Describe what you're testing and why..."
            value={newTest.description}
            onChange={(e) => setNewTest((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="primary-metric">Primary Metric</Label>
          <Select
            value={newTest.primaryMetric}
            onValueChange={(value) => setNewTest((prev) => ({ ...prev, primaryMetric: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conversion-rate">Conversion Rate</SelectItem>
              <SelectItem value="click-through-rate">Click-through Rate</SelectItem>
              <SelectItem value="signup-rate">Signup Rate</SelectItem>
              <SelectItem value="job-post-completion">Job Post Completion</SelectItem>
              <SelectItem value="provider-contact-rate">Provider Contact Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Test Duration</Label>
            <Select
              value={newTest.duration}
              onValueChange={(value) => setNewTest((prev) => ({ ...prev, duration: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-week">1 Week</SelectItem>
                <SelectItem value="2-weeks">2 Weeks</SelectItem>
                <SelectItem value="1-month">1 Month</SelectItem>
                <SelectItem value="until-significant">Until Significant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="traffic-split">Traffic Split (%)</Label>
            <Input
              id="traffic-split"
              type="number"
              min="10"
              max="90"
              value={newTest.trafficSplit}
              onChange={(e) => setNewTest((prev) => ({ ...prev, trafficSplit: Number.parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Test Configuration</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• Control: {100 - newTest.trafficSplit}% of traffic</div>
            <div>• Variant: {newTest.trafficSplit}% of traffic</div>
            <div>• Minimum sample size: 1,000 visitors per variant</div>
            <div>• Statistical significance threshold: 95%</div>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleSubmit}>
          <FlaskConical className="w-4 h-4 mr-2" />
          Create A/B Test
        </Button>
      </CardContent>
    </Card>
  )
}