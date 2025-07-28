import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Globe, TrendingUp, Database, Cloud, Zap } from "lucide-react";
import RegionSelector from "@/components/region/region-selector"
import type { RegionConfig } from "@/lib/region-config"

export default function MultiRegionPage() {
  const [currentRegion, setCurrentRegion] = useState<RegionConfig | null>(null)

  const globalStats = [
    { label: "Active, Regions", value: "4", icon: Globe },
    { label: "Total, Users", value: "12.5K", icon: Users },
    { label: "Cross-Region, Jobs", value: "2.3K", icon: TrendingUp },
    { label: "Compliance Score", value: "98%", icon: Shield },
  ]

  const regionMetrics = [
    { region: "US", users: 6500, jobs: 1200, growth: "+15%" },
    { region: "EU", users: 3200, jobs: 680, growth: "+28%" },
    { region: "CA", users: 1800, jobs: 320, growth: "+12%" },
    { region: "AU", users: 1000, jobs: 180, growth: "+35%" },
  ]

  const scalingFeatures = [
    {
      title: "Multi-Tenant Region Isolation",
      description: "Data separation and region-based access control",
      icon: Database,
      status: "Active",
    },
    {
      title: "Edge Caching & CDN",
      description: "Global content delivery with regional optimization",
      icon: Cloud,
      status: "Active",
    },
    {
      title: "Localization Engine",
      description: "Auto-detection and language/currency adaptation",
      icon: Globe,
      status: "Active",
    },
    {
      title: "Compliance Framework",
      description: "GDPR, CCPA, and regional data protection",
      icon: Shield,
      status: "Active",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Multi-Region Scaling Engine
            </h1>
            <p className="text-xl text-gray-600 mb-6">Global expansion infrastructure with region-aware architecture</p>
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />4 Regions Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Global Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Global Performance Metrics
            </CardTitle>
            <CardDescription>Real-time statistics across all regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {globalStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="regions">Region Config</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>User activity and job completion rates by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionMetrics.map((region) => (
                    <div key={region.region} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                          <BusinessIcons.MapPin className="w-5 h-5 text-blue-600" / />
                        </div>
                        <div>
                          <div className="font-semibold">{region.region}</div>
                          <div className="text-sm text-gray-600">{region.users.toLocaleString()} users</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{region.jobs} jobs</div>
                        <Badge variant="outline" className="text-green-600">
                          {region.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scaling Features */}
            <Card>
              <CardHeader>
                <CardTitle>Scaling Infrastructure</CardTitle>
                <CardDescription>Core features enabling global expansion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {scalingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                        <feature.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{feature.title}</h4>
                          <Badge className="bg-green-500 text-white text-xs">{feature.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            <RegionSelector onRegionChange={setCurrentRegion} currentRegion={currentRegion?.code} />
          </TabsContent>

          <TabsContent value="localization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Localization Status
                </CardTitle>
                <CardDescription>Translation and cultural adaptation progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { language: "English (US)", progress: 100, status: "Complete" },
                    { language: "Spanish (ES)", progress: 85, status: "In Progress" },
                    { language: "French (FR)", progress: 72, status: "In Progress" },
                    { language: "German (DE)", progress: 45, status: "Planning" },
                    { language: "Portuguese (BR)", progress: 30, status: "Planning" },
                  ].map((lang, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{lang.language}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{lang.progress}%</span>
                          <Badge variant={lang.status === "Complete" ? "default" : "secondary"}>{lang.status}</Badge>
                        </div>
                      </div>
                      <Progress value={lang.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <OptimizedIcon name="Shield" className="w-5 h-5 mr-2" />
                  Compliance Dashboard
                </CardTitle>
                <CardDescription>Regional data protection and legal compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">GDPR Compliance (EU)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Data Processing Consent</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Right to be Forgotten</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Portability</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cookie Consent</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">CCPA Compliance (CA)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Do Not Sell</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Disclosure</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Opt-out Rights</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Privacy Policy</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="w-5 h-5 mr-2" />
                  Global Deployment Status
                </CardTitle>
                <CardDescription>Edge locations and infrastructure health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Edge Locations</h4>
                    <div className="space-y-3">
                      {[
                        { location: "US East (Virginia)", status: "Healthy", latency: "12ms" },
                        { location: "EU West (Ireland)", status: "Healthy", latency: "8ms" },
                        { location: "Canada Central", status: "Healthy", latency: "15ms" },
                        { location: "Australia East", status: "Healthy", latency: "22ms" },
                      ].map((edge, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-medium">{edge.location}</div>
                            <div className="text-sm text-gray-600">Latency: {edge.latency}</div>
                          </div>
                          <Badge className="bg-green-500 text-white">{edge.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Infrastructure Health</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">API Response Time</span>
                          <span className="font-medium">145ms avg</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Database Performance</span>
                          <span className="font-medium">98.5% uptime</span>
                        </div>
                        <Progress value={98.5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">CDN Cache Hit Rate</span>
                          <span className="font-medium">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Center */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
                  <NavigationIcons.Settings className="w-6 h-6 text-white" / />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">Multi-Region Engine</h3>
                  <p className="text-blue-700">Scaling globally with intelligent infrastructure</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">Operational</div>
                <div className="text-sm text-gray-600">4 regions, 12.5K users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}