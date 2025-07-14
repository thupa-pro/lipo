"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"
import { TestTemplate } from "./types"

interface TestTemplateCardProps {
  template: TestTemplate
  getImpactColor: (impact: string) => string
  getDifficultyColor: (difficulty: string) => string
  onLaunchTest: (templateName: string) => void
}

export default function TestTemplateCard({
  template,
  getImpactColor,
  getDifficultyColor,
  onLaunchTest,
}: TestTemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          <Badge variant="outline">{template.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Impact</div>
            <div className={`font-medium capitalize ${getImpactColor(template.estimatedImpact)}`}>
              {template.estimatedImpact}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Difficulty</div>
            <div className={`font-medium capitalize ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Duration</div>
            <div className="font-medium">{template.duration}</div>
          </div>
        </div>

        <Button className="w-full" onClick={() => onLaunchTest(template.name)}>
          <Target className="w-4 h-4 mr-2" />
          Launch Test
        </Button>
      </CardContent>
    </Card>
  )
}