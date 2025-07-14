export interface ABTest {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "completed" | "paused"
  startDate: string
  endDate?: string
  variants: {
    id: string
    name: string
    traffic: number
    conversions: number
    visitors: number
    conversionRate: number
    isControl: boolean
  }[]
  metrics: {
    primaryMetric: string
    secondaryMetrics: string[]
  }
  confidence: number
  winner?: string
}

export interface TestTemplate {
  id: string
  name: string
  description: string
  category: string
  estimatedImpact: "low" | "medium" | "high"
  difficulty: "easy" | "medium" | "hard"
  duration: string
}