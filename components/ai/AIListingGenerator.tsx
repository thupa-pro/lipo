"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Wand2,
  Copy,
  RefreshCw,
  Save,
  Download,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Tag,
  Edit,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GeneratedListing {
  title: string;
  description: string;
  keywords: string[];
  pricing: {
    suggested: number;
    range: { min: number; max: number };
  };
  highlights: string[];
  seoScore: number;
  marketInsights: {
    demand: "low" | "medium" | "high";
    competition: "low" | "medium" | "high";
    trends: string[];
  };
}

const SERVICE_CATEGORIES = [
  "House Cleaning",
  "Handyman Services",
  "Pet Care",
  "Tutoring",
  "Moving Help",
  "Gardening",
  "Tech Support",
  "Personal Training",
  "Photography",
  "Event Planning",
  "Cooking Services",
  "Beauty Services",
  "Transportation",
  "Business Services",
  "Creative Services",
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "energetic", label: "Energetic" },
  { value: "trustworthy", label: "Trustworthy" },
  { value: "premium", label: "Premium" },
];

const TARGET_AUDIENCE = [
  { value: "families", label: "Families" },
  { value: "professionals", label: "Working Professionals" },
  { value: "seniors", label: "Seniors" },
  { value: "students", label: "Students" },
  { value: "businesses", label: "Businesses" },
  { value: "general", label: "General Public" },
];

export default function AIListingGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    keywords: "",
    experience: "",
    location: "",
    tone: "professional",
    targetAudience: "general",
    specialties: "",
    availability: "",
    pricing: "",
  });
  const [generatedListing, setGeneratedListing] = useState<GeneratedListing | null>(null);
  const [activeTab, setActiveTab] = useState("input");

  // Mock AI generation function (replace with actual OpenAI API call)
  const generateWithAI = async (): Promise<GeneratedListing> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockListing: GeneratedListing = {
      title: `Professional ${formData.category} Services in ${formData.location || "Your Area"}`,
      description: `Transform your space with our expert ${formData.category.toLowerCase()} services. With years of experience and a commitment to excellence, we deliver results that exceed expectations. Our ${formData.tone} approach ensures every detail is perfect, whether it's a one-time service or ongoing maintenance. We understand the unique needs of ${formData.targetAudience} and tailor our services accordingly.\n\nWhat sets us apart:\n• Fully licensed and insured professionals\n• Eco-friendly products and sustainable practices\n• Flexible scheduling to fit your busy lifestyle\n• 100% satisfaction guarantee\n• Competitive pricing with transparent quotes\n\nBook today and discover why hundreds of customers trust us for their ${formData.category.toLowerCase()} needs!`,
      keywords: [
        ...formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
        formData.category.toLowerCase(),
        "professional",
        "reliable",
        "insured",
        "local",
      ],
      pricing: {
        suggested: 85,
        range: { min: 65, max: 120 },
      },
      highlights: [
        "Licensed & Insured",
        "Same-Day Availability",
        "100% Satisfaction Guarantee",
        "Eco-Friendly Products",
        "Competitive Pricing",
        "Local Expertise",
      ],
      seoScore: 87,
      marketInsights: {
        demand: "high",
        competition: "medium",
        trends: [
          "Eco-friendly services increasing 25%",
          "Weekend bookings up 40%",
          "Premium packages in high demand",
        ],
      },
    };

    return mockListing;
  };

  const handleGenerate = async () => {
    if (!formData.category || !formData.keywords) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsGenerating(true);
    setActiveTab("preview");
    
    try {
      const result = await generateWithAI();
      setGeneratedListing(result);
      toast.success("Listing generated successfully!");
    } catch (error) {
      toast.error("Failed to generate listing");
      setActiveTab("input");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const handleSave = () => {
    if (!generatedListing) return;
    
    // Mock save functionality
    toast.success("Listing saved to drafts!");
  };

  const handlePublish = () => {
    if (!generatedListing) return;
    
    // Mock publish functionality
    toast.success("Listing published successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">AI Listing Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Let AI create compelling, SEO-optimized listings that attract more customers. 
          Just provide a few details and watch the magic happen!
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Input Details
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedListing && !isGenerating}>
            <Sparkles className="h-4 w-4" />
            AI Preview
          </TabsTrigger>
          <TabsTrigger value="insights" disabled={!generatedListing}>
            <TrendingUp className="h-4 w-4" />
            Market Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords *</Label>
                  <Input
                    id="keywords"
                    placeholder="e.g., residential, deep cleaning, eco-friendly"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                  <p className="text-sm text-gray-500">Separate keywords with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 5+ years"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone & Style</Label>
                  <Select value={formData.tone} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, tone: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, targetAudience: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCE.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties & Unique Selling Points</Label>
                <Textarea
                  id="specialties"
                  placeholder="e.g., specialized equipment, certifications, unique techniques..."
                  value={formData.specialties}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    placeholder="e.g., weekends, evenings, 24/7"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing">Starting Price Range</Label>
                  <Input
                    id="pricing"
                    placeholder="e.g., $50-100/hour"
                    value={formData.pricing}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !formData.category || !formData.keywords}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Listing with AI
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {isGenerating ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <RefreshCw className="h-12 w-12 mx-auto animate-spin text-blue-600" />
                  <h3 className="text-xl font-semibold">AI is crafting your listing...</h3>
                  <p className="text-gray-600">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          ) : generatedListing ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Generated Listing
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      SEO Score: {generatedListing.seoScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Title</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(generatedListing.title, "Title")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">{generatedListing.title}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Description</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(generatedListing.description, "Description")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="whitespace-pre-line">{generatedListing.description}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Keywords
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {generatedListing.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Key Highlights
                      </Label>
                      <div className="space-y-2">
                        {generatedListing.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      AI Pricing Recommendations
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Suggested Price</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${generatedListing.pricing.suggested}
                          </p>
                          <p className="text-xs text-gray-500">per hour</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Market Range</p>
                          <p className="text-lg font-semibold">
                            ${generatedListing.pricing.range.min} - ${generatedListing.pricing.range.max}
                          </p>
                          <p className="text-xs text-gray-500">competitive range</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Position</p>
                          <p className="text-lg font-semibold text-green-600">Competitive</p>
                          <p className="text-xs text-gray-500">market positioning</p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setActiveTab("input")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish Listing
                </Button>
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {generatedListing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Market Demand</span>
                      <Badge 
                        variant={generatedListing.marketInsights.demand === "high" ? "default" : 
                                generatedListing.marketInsights.demand === "medium" ? "secondary" : "outline"}
                      >
                        {generatedListing.marketInsights.demand}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Competition Level</span>
                      <Badge 
                        variant={generatedListing.marketInsights.competition === "high" ? "destructive" : 
                                generatedListing.marketInsights.competition === "medium" ? "secondary" : "default"}
                      >
                        {generatedListing.marketInsights.competition}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedListing.marketInsights.trends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{trend}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}