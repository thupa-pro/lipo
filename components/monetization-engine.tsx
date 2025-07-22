"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Crown, TrendingUp, Eye Target, Rocket Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VisibilityBoost {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
  multiplier: number
  popular?: boolean
}

interface PremiumPlan {
  id: string
  name: string
  price: number
  billing: "monthly" | "yearly"
  features: string[]
  limits: {
    jobPosts: number | "unlimited"
    applications: number | "unlimited"
    messaging: boolean
    analytics: boolean
    prioritySupport: boolean
  }
  popular?: boolean
}

export default function MonetizationEngine() {
  const [selectedBoost, setSelectedBoost] = useState<string>("")
  const [bidAmount, setBidAmount] = useState([25])
  const [boostDuration, setBoostDuration] = useState([24])
  const [autoRenew, setAutoRenew] = useState(false)

  const { toast } = useToast()

  const visibilityBoosts: VisibilityBoost[] = [
    {
      id: "featured",
      name: "Featured Listing",
      description: "Appear at the top of search results with a special badge",
      price: 15,
      duration: "24 hours",
      features: ["Top of search results", "Featured badge", "2x visibility"],
      multiplier: 2,
    },
    {
      id: "premium",
      name: "Premium Spotlight",
      description: "Maximum visibility with highlighted profile and priority matching",
      price: 35,
      duration: "48 hours",
      features: ["Premium badge", "Highlighted profile", "Priority matching", "5x visibility"],
      multiplier: 5,
      popular: true,
    },
    {
      id: "urgent",
      name: "Urgent Job Boost",
      description: "Perfect for time-sensitive jobs that need immediate attention",
      price: 25,
      duration: "12 hours",
      features: ["Urgent badge", "Push notifications", "3x visibility", "Instant alerts"],
      multiplier: 3,
    },
  ]

  const premiumPlans: PremiumPlan[] = [
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      billing: "monthly",
      features: ["Up to 5 job posts", "Basic messaging", "Standard support"],
      limits: {
        jobPosts: 5,
        applications: 20,
        messaging: true,
        analytics: false,
        prioritySupport: false,
      },
    },
    {
      id: "pro",
      name: "Professional",
      price: 24.99,
      billing: "monthly",
      features: [
        "Unlimited job posts",
        "Advanced messaging",
        "Analytics dashboard",
        "Priority matching",
        "Profile verification",
      ],
      limits: {
        jobPosts: "unlimited",
        applications: "unlimited",
        messaging: true,
        analytics: true,
        prioritySupport: false,
      },
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 49.99,
      billing: "monthly",
      features: ["Everything in Pro", "Priority support", "Custom branding", "API access", "Dedicated account manager"],
      limits: {
        jobPosts: "unlimited",
        applications: "unlimited",
        messaging: true,
        analytics: true,
        prioritySupport: true,
      },
    },
  ]

  const calculateBoostCost = () => {
    const baseCost = bidAmount[0]
    const durationMultiplier = boostDuration[0] / 24
    return Math.round(baseCost * durationMultiplier)
  }

  const getEstimatedViews = () => {
    const baseViews = 50
    const bidMultiplier = bidAmount[0] / 10
    const durationHours = boostDuration[0]
    return Math.round(baseViews * bidMultiplier * (durationHours / 24))
  }

  const handleActivateBoost = () => {
    const boost = visibilityBoosts.find((b) => b.id === selectedBoost)
    if (boost) {
      toast({
        title: "Boost Activated!",
        description: `${boost.name} activated for $${boost.price}. Your visibility will increase by ${boost.multiplier}x!`,
        variant: "default",
      })
    } else {
      toast({
        title: "No Boost Selected",
        description: "Please select a boost option to activate.",
        variant: "destructive",
      })
    }
  }

  const handleChoosePlan = (planName: string) => {
    toast({
      title: "Plan Selected!",
      description: `You have selected the ${planName} plan. Redirecting to checkout...`,
      variant: "default",
    })
    // Simulate redirect
    // router.push('/checkout');
  }

  const handleStartBiddingCampaign = () => {
    toast({
      title: "Bidding Campaign Started!",
      description: `Your bidding campaign for $${bidAmount[0]}/hr for ${boostDuration[0]} hours has started.`,
      variant: "default",
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <Crown className="w-8 h-8 mr-3 text-yellow-600" />
          Monetization Engine
        </h1>
        <p className="text-gray-600">Boost your visibility and unlock premium features</p>
      </div>

      <Tabs defaultValue="boosts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="boosts">Visibility Boosts</TabsTrigger>
          <TabsTrigger value="plans">Premium Plans</TabsTrigger>
          <TabsTrigger value="bidding">Smart Bidding</TabsTrigger>
        </TabsList>

        {/* Visibility Boosts */}
        <TabsContent value="boosts" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Visibility Boosts</h2>
            <p className="text-gray-600">Get more eyes on your job posts and profile</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {visibilityBoosts.map((boost) => (
              <Card
                key={boost.id}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedBoost === boost.id ? "ring-2 ring-blue-500" : ""
                } ${boost.popular ? "border-yellow-400" : ""}`}
                onClick={() => setSelectedBoost(boost.id)}
              >
                {boost.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {boost.id === "featured" && <Star className="w-6 h-6 text-white" />}
                    {boost.id === "premium" && <Crown className="w-6 h-6 text-white" />}
                    {boost.id === "urgent" && <Zap className="w-6 h-6 text-white" />}
                  </div>
                  <CardTitle className="text-xl">{boost.name}</CardTitle>
                  <CardDescription>{boost.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">${boost.price}</div>
                    <div className="text-sm text-gray-600">for {boost.duration}</div>
                  </div>

                  <div className="space-y-2">
                    {boost.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-blue-700">Expected boost</div>
                    <div className="text-lg font-bold text-blue-600">{boost.multiplier}x visibility</div>
                  </div>

                  <Button className="w-full" variant={selectedBoost === boost.id ? "default" : "outline"}>
                    {selectedBoost === boost.id ? "Selected" : "Select Boost"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedBoost && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">Boost Summary</h3>
                  <p className="text-gray-600">Your selected visibility boost</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${visibilityBoosts.find((b) => b.id === selectedBoost)?.price}
                    </div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {visibilityBoosts.find((b) => b.id === selectedBoost)?.duration}
                    </div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {visibilityBoosts.find((b) => b.id === selectedBoost)?.multiplier}x
                    </div>
                    <div className="text-sm text-gray-600">Visibility Boost</div>
                  </div>
                </div>
                <Button className="w-full mt-4" size="lg" onClick={handleActivateBoost}>
                  <Rocket className="w-4 h-4 mr-2" />
                  Activate Boost Now
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Premium Plans */}
        <TabsContent value="plans" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Premium Plans</h2>
            <p className="text-gray-600">Unlock advanced features and grow your business</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {premiumPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">${plan.price}</div>
                  <div className="text-sm text-gray-600">per month</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Job Posts:</span>
                      <span className="font-medium">{plan.limits.jobPosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applications:</span>
                      <span className="font-medium">{plan.limits.applications}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analytics:</span>
                      <span className="font-medium">{plan.limits.analytics ? "✓" : "✗"}</span>
                    </div>
                  </div>

                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} onClick={() => handleChoosePlan(plan.name)}>
                    {plan.popular ? "Get Started" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">🎉 Limited Time Offer</h3>
              <p className="text-gray-600 mb-4">Get 2 months free when you upgrade to Professional or Enterprise</p>
              <Badge className="bg-purple-500 text-white">Save up to $50</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Bidding */}
        <TabsContent value="bidding" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Smart Bidding System</h2>
            <p className="text-gray-600">Bid for premium placement and maximize your visibility</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Bid Configuration
                </CardTitle>
                <CardDescription>Set your bid amount and duration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bid-amount">Bid Amount: ${bidAmount[0]}</Label>
                  <Slider
                    id="bid-amount"
                    min={5}
                    max={100}
                    step={5}
                    value={bidAmount}
                    onValueChange={setBidAmount}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$5 (Low)</span>
                    <span>$100 (High)</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Duration: {boostDuration[0]} hours</Label>
                  <Slider
                    id="duration"
                    min={6}
                    max={168}
                    step={6}
                    value={boostDuration}
                    onValueChange={setBoostDuration}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>6h</span>
                    <span>1 week</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-renew">Auto-renew</Label>
                    <p className="text-sm text-gray-600">Automatically renew when boost expires</p>
                  </div>
                  <Switch id="auto-renew" checked={autoRenew} onCheckedChange={setAutoRenew} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Estimated Performance
                </CardTitle>
                <CardDescription>Projected results for your bid</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{getEstimatedViews()}</div>
                    <div className="text-sm text-gray-600">Estimated Views</div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${calculateBoostCost()}</div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{Math.round((bidAmount[0] / 10) * 100)}%</div>
                    <div className="text-sm text-gray-600">Win Rate Estimate</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Competition Level</span>
                    <span className="font-medium">Medium</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <Button className="w-full" size="lg" onClick={handleStartBiddingCampaign}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Start Bidding Campaign
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">Smart Bidding Tips</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Higher bids during peak hours (6-9 PM) get 3x more visibility</li>
                    <li>• Weekend boosts have 40% higher conversion rates</li>
                    <li>• Auto-renew saves 15% on total campaign costs</li>
                    <li>• Urgent jobs with $25+ bids get 90% faster responses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}