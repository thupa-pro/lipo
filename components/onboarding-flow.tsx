import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Target, Lightbulb, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface OnboardingData {
  userType: "customer" | "provider" | ""
  location: string
  interests: string[]
  experience: string
  goals: string[]
  notifications: boolean
}

export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    userType: "",
    location: "",
    interests: [],
    experience: "",
    goals: [],
    notifications: true,
  })

  const router = useRouter()
  const { toast } = useToast()

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const serviceCategories = [
    "House Cleaning",
    "Handyman Services",
    "Pet Care",
    "Tutoring",
    "Moving Help",
    "Gardening",
    "Tech Support",
    "Personal Training",
    "Cooking/Catering",
    "Photography",
  ]

  const customerGoals = [
    "Find reliable local help",
    "Save time on household tasks",
    "Get professional quality work",
    "Build long-term relationships with providers",
    "Support local community",
  ]

  const providerGoals = [
    "Earn flexible income",
    "Build a client base",
    "Showcase my skills",
    "Work on my schedule",
    "Grow my business",
  ]

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleInterest = (interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const toggleGoal = (goal: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const handleFinishOnboarding = () => {
    toast({
      title: "Welcome to Loconomy!",
      description: "Your profile is set up. Get ready to connect!",
      variant: "default",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg shadow-md animate-fade-in">
          <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce-in" />
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Personalize Your Loconomy Journey</h1>
          <p className="text-gray-700 max-w-md mx-auto">
            A few quick steps to tailor your experience and connect you with the best local services or opportunities.
          </p>
        </div>

        {/* Progress Header */}
        <Card className="mb-8 shadow-lg animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <BusinessIcons.MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Loconomy
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Step {step} of {totalSteps}
              </div>
            </div>
            <Progress value={progress} className="h-2 bg-blue-200" />
          </CardContent>
        </Card>

        {/* Step 1: User Type Selection */}
        {step === 1 && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to Loconomy! 👋</CardTitle>
              <CardDescription>Let's personalize your experience. How do you want to use Loconomy?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={data.userType}
                onValueChange={(value: "customer" | "provider") => setData((prev) => ({ ...prev, userType: value }))}
              >
                <div className="grid gap-4">
                  <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${data.userType === "customer" ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300 hover:shadow-sm"}`}>
                    <RadioGroupItem value="customer" id="customer" />
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <NavigationIcons.Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <Label htmlFor="customer" className="text-lg font-medium cursor-pointer">
                          I need services
                        </Label>
                        <p className="text-sm text-gray-600">Find trusted local providers for your needs</p>
                        <div className="flex space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            House Cleaning
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Handyman
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Pet Care
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${data.userType === "provider" ? "border-green-500 bg-green-50 shadow-md" : "border-gray-200 hover:border-green-300 hover:shadow-sm"}`}>
                    <RadioGroupItem value="provider" id="provider" />
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BusinessIcons.Briefcase className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <Label htmlFor="provider" className="text-lg font-medium cursor-pointer">
                          I offer services
                        </Label>
                        <p className="text-sm text-gray-600">Start earning with your skills and expertise</p>
                        <div className="flex space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Flexible Schedule
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Secure Payments
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Build Reputation
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <Button onClick={handleNext} disabled={!data.userType} className="w-full" size="lg">
                Continue
                <UIIcons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center">
                <BusinessIcons.MapPin className="w-6 h-6 mr-2 text-primary" />
                Where are you located?
              </CardTitle>
              <CardDescription>
                We'll use this to connect you with{" "}
                {data.userType === "customer" ? "nearby providers" : "local customers"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="location">Your Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your, city, neighborhood, or ZIP code"
                  value={data.location}
                  onChange={(e) => setData((prev) => ({ ...prev, location: e.target.value }))}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">This helps us find the most relevant matches for you.</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <OptimizedIcon name="Shield" className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Privacy Protected</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      We only use your location to show relevant services. Your exact address is never shared until you
                      choose to share it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!data.location.trim()} className="flex-1">
                  Continue
                  <UIIcons.ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Interests/Services */}
        {step === 3 && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {data.userType === "customer" ? "What services interest you?" : "What services do you offer?"}
              </CardTitle>
              <CardDescription>
                {data.userType === "customer"
                  ? "Select the types of services you might need"
                  : "Choose the services you'd like to provide"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {serviceCategories.map((category) => (
                  <div
                    key={category}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      data.interests.includes(category)
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
                    }`}
                    onClick={() => toggleInterest(category)}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={data.interests.includes(category)} readOnly />
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-sm text-gray-600">
                Selected: {data.interests.length} {data.interests.length === 1 ? "service" : "services"}
              </div>

              <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Smart Matching Tip</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Selecting relevant categories helps our AI connect you with the best opportunities or providers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button onClick={handleNext} disabled={data.interests.length === 0} className="flex-1">
                  Continue
                  <UIIcons.ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Experience/Goals */}
        {step === 4 && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {data.userType === "customer" ? "What are your goals?" : "What's your experience level?"}
              </CardTitle>
              <CardDescription>
                {data.userType === "customer"
                  ? "Help us understand what you're looking for"
                  : "This helps us match you with the right opportunities"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.userType === "provider" && (
                <RadioGroup
                  value={data.experience}
                  onValueChange={(value) => setData((prev) => ({ ...prev, experience: value }))}
                >
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${data.experience === "beginner" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:shadow-xs"}`}>
                      <RadioGroupItem value="beginner" id="beginner" />
                      <div>
                        <Label htmlFor="beginner" className="font-medium">
                          Just getting started
                        </Label>
                        <p className="text-sm text-gray-600">New to providing services professionally</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${data.experience === "experienced" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:shadow-xs"}`}>
                      <RadioGroupItem value="experienced" id="experienced" />
                      <div>
                        <Label htmlFor="experienced" className="font-medium">
                          Some experience
                        </Label>
                        <p className="text-sm text-gray-600">I've done this work, before, looking to grow</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${data.experience === "professional" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:shadow-xs"}`}>
                      <RadioGroupItem value="professional" id="professional" />
                      <div>
                        <Label htmlFor="professional" className="font-medium">
                          Professional/Expert
                        </Label>
                        <p className="text-sm text-gray-600">This is my main business or expertise</p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              )}

              <div>
                <h4 className="font-medium mb-3">
                  {data.userType === "customer" ? "What are you hoping to achieve?" : "What are your goals?"}
                </h4>
                <div className="space-y-2">
                  {(data.userType === "customer" ? customerGoals : providerGoals).map((goal) => (
                    <div
                      key={goal}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        data.goals.includes(goal)
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
                      }`}
                      onClick={() => toggleGoal(goal)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={data.goals.includes(goal)} readOnly />
                        <span className="text-sm">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    data.userType === "provider" ? !data.experience || data.goals.length === 0 : data.goals.length === 0
                  }
                  className="flex-1"
                >
                  Continue
                  <UIIcons.ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Notifications & Completion */}
        {step === 5 && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center">
                <UIIcons.CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                You're all set!
              </CardTitle>
              <CardDescription>Just one more thing to help you stay connected</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4 text-green-800">Your Loconomy Profile Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium capitalize">{data.userType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{data.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interests:</span>
                    <span className="font-medium">{data.interests.length} services</span>
                  </div>
                  {data.userType === "provider" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium capitalize">{data.experience}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="notifications"
                    checked={data.notifications}
                    onCheckedChange={(checked) => setData((prev) => ({ ...prev, notifications: !!checked }))}
                  />
                  <div>
                    <Label htmlFor="notifications" className="font-medium">
                      Enable notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Get alerts for{" "}
                      {data.userType === "customer" ? "new matches and messages" : "job opportunities and messages"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">AI-Powered Matching</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Based on your, preferences, our AI will suggest the best{" "}
                      {data.userType === "customer" ? "providers for your needs" : "jobs that match your skills"}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button className="flex-1" size="lg" onClick={handleFinishOnboarding}>
                  <Target className="w-4 h-4 mr-2" />
                  Start Using Loconomy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}