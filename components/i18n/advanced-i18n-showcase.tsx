import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAdvancedI18n } from "@/hooks/use-advanced-i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Globe, Mic, MicOff, Volume2, VolumeX, Brain, BarChart3, Wifi, WifiOff } from "lucide-react";

interface MetropolitanCityShowcaseProps {
  selectedCity?: string;
}

export default function AdvancedI18nShowcase({
  selectedCity = "new_york",
}: MetropolitanCityShowcaseProps) {
  const t = useTranslations("showcase");
  const {
    cityConfig,
    voiceInterface,
    culturalIntelligence,
    offlineSupport,
    analytics,
    abTesting,
    smartTranslation,
    pluralization,
    qualityMetrics,
    performanceStats,
  } = useAdvancedI18n();

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentVoiceCommand, setCurrentVoiceCommand] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translationQuality, setTranslationQuality] = useState(85);
  const [isOnline, setIsOnline] = useState(true);

  // Simulate network status
  useEffect(() => {
    const toggleNetwork = () => setIsOnline((prev) => !prev);
    const interval = setInterval(toggleNetwork, 10000); // Toggle every 10s for demo
    return () => clearInterval(interval);
  }, []);

  // Voice interface controls
  const handleVoiceToggle = async () => {
    if (isVoiceActive) {
      await voiceInterface.stopListening();
      setIsVoiceActive(false);
    } else {
      await voiceInterface.startListening({
        onResult: (text) => setCurrentVoiceCommand(text),
        onEnd: () => setIsVoiceActive(false),
      });
      setIsVoiceActive(true);
    }
  };

  const handleTextToSpeech = async (text: string) => {
    setIsSpeaking(true);
    await voiceInterface.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  // Cultural adaptation simulation
  const culturalAdaptations = culturalIntelligence.getAdaptations(selectedCity);
  const businessEtiquette =
    culturalIntelligence.getBusinessEtiquette(selectedCity);

  // Smart translation examples
  const smartTranslationExamples = [
    { context: "formal", text: "Welcome to our service" },
    { context: "casual", text: "Hey there!" },
    { context: "business", text: "Please review the contract" },
    { context: "emergency", text: "Call emergency services" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Internationalization Showcase
        </h1>
        <p className="text-xl text-muted-foreground">
          Supporting 50+ Metropolitan Cities Worldwide with AI-Powered
          Localization
        </p>
        <div className="flex justify-center items-center space-x-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Globe className="w-4 h-4 mr-2" />
            {cityConfig.name} ({cityConfig.locale.toUpperCase()})
          </Badge>
          <Badge
            variant={isOnline ? "default" : "destructive"}
            className="text-lg px-4 py-2"
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 mr-2" />
            ) : (
              <WifiOff className="w-4 h-4 mr-2" />
            )}
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="city-config" className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="city-config">City Config</TabsTrigger>
          <TabsTrigger value="voice">Voice Interface</TabsTrigger>
          <TabsTrigger value="cultural">Cultural AI</TabsTrigger>
          <TabsTrigger value="offline">Offline Support</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="smart-translation">Smart Translation</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        {/* City Configuration Tab */}
        <TabsContent value="city-config" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BusinessIcons.MapPin className="w-5 h-5 mr-2" / />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>City:</strong> {cityConfig.name}
                </div>
                <div>
                  <strong>Country:</strong> {cityConfig.country}
                </div>
                <div>
                  <strong>Timezone:</strong> {cityConfig.timezone}
                </div>
                <div>
                  <strong>Population:</strong>{" "}
                  {cityConfig.population?.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <strong>Direction:</strong>
                  <Badge
                    variant={cityConfig.rtl ? "destructive" : "default"}
                    className="ml-2"
                  >
                    {cityConfig.rtl ? "RTL" : "LTR"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Currency & Formats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BusinessIcons.DollarSign className="w-5 h-5 mr-2" / />
                  Currency & Formats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Currency:</strong> {cityConfig.currency}
                </div>
                <div>
                  <strong>Date Format:</strong> {cityConfig.dateFormat}
                </div>
                <div>
                  <strong>Time Format:</strong> {cityConfig.timeFormat}
                </div>
                <div>
                  <strong>Number Format:</strong> {cityConfig.numberFormat}
                </div>
                <div>
                  <strong>Tax Included:</strong>{" "}
                  {cityConfig.taxIncluded ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <OptimizedIcon name="Clock" className="w-5 h-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Business Hours:</strong>
                  <br />
                  {cityConfig.businessHours?.start} -{" "}
                  {cityConfig.businessHours?.end}
                </div>
                <div>
                  <strong>Working Days:</strong>
                  <br />
                  {cityConfig.businessHours?.days
                    .map((day) => {
                      const dayNames = [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                      ];
                      return dayNames[day];
                    })
                    .join(", ")}
                </div>
                <div>
                  <strong>Emergency:</strong> {cityConfig.emergencyNumber}
                </div>
                <div>
                  <strong>Phone Format:</strong> {cityConfig.phoneFormat}
                </div>
              </CardContent>
            </Card>

            {/* Local Holidays */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BusinessIcons.Calendar className="w-5 h-5 mr-2" / />
                  Local Holidays & Cultural Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cityConfig.localHolidays?.map((holiday, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-lg px-3 py-1"
                    >
                      {holiday}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Interface Tab */}
        <TabsContent value="voice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  Voice Recognition
                </CardTitle>
                <CardDescription>
                  AI-powered voice commands in {cityConfig.locale.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleVoiceToggle}
                    variant={isVoiceActive ? "destructive" : "default"}
                    className="flex items-center space-x-2"
                  >
                    {isVoiceActive ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                    <span>
                      {isVoiceActive ? "Stop Listening" : "Start Listening"}
                    </span>
                  </Button>
                  <Badge variant={isVoiceActive ? "default" : "secondary"}>
                    {isVoiceActive ? "Listening..." : "Inactive"}
                  </Badge>
                </div>

                {currentVoiceCommand && (
                  <Alert>
                    <AlertDescription>
                      <strong>Last Command:</strong> "{currentVoiceCommand}"
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <h4 className="font-semibold">Try saying:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>"Show me available services"</li>
                    <li>"Book an appointment"</li>
                    <li>"Change language to {cityConfig.locale}"</li>
                    <li>"What's the weather like?"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Text-to-Speech
                </CardTitle>
                <CardDescription>
                  Natural voice synthesis with local accent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Welcome to our platform!",
                    "Your booking has been confirmed.",
                    "Thank you for choosing our service.",
                    "Have a great day!",
                  ].map((text, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{text}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTextToSpeech(text)}
                        disabled={isSpeaking}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={isSpeaking ? "default" : "secondary"}>
                    {isSpeaking ? "Speaking..." : "Ready"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Voice: {cityConfig.locale} (Local Accent)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cultural Intelligence Tab */}
        <TabsContent value="cultural" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Cultural Dimensions
                </CardTitle>
                <CardDescription>
                  Hofstede's cultural dimensions analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(culturalAdaptations.dimensions || {}).map(
                  ([dimension, score]) => (
                    <div key={dimension} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize text-sm font-medium">
                          {dimension.replace("_", " ")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {score}/100
                        </span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UI Adaptations</CardTitle>
                <CardDescription>
                  Automatic interface adjustments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Color Scheme:</strong>{" "}
                  {culturalAdaptations.colorPreferences?.primary}
                </div>
                <div>
                  <strong>Communication Style:</strong>{" "}
                  {culturalAdaptations.communicationStyle}
                </div>
                <div>
                  <strong>Hierarchy Display:</strong>{" "}
                  {culturalAdaptations.hierarchyDisplay ? "Formal" : "Casual"}
                </div>
                <div>
                  <strong>Risk Indicators:</strong>{" "}
                  {culturalAdaptations.riskDisplay ? "Prominent" : "Subtle"}
                </div>
                <div>
                  <strong>Decision Support:</strong>{" "}
                  {culturalAdaptations.decisionSupport}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Business Etiquette</CardTitle>
                <CardDescription>
                  Local business customs and practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Greetings</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {businessEtiquette.greetings?.map((greeting, index) => (
                        <li key={index}>• {greeting}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Meeting Culture</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {businessEtiquette.meetingCulture?.map(
                        (practice, index) => (
                          <li key={index}>• {practice}</li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Gift Giving</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {businessEtiquette.giftGiving?.map((rule, index) => (
                        <li key={index}>• {rule}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Dress Code</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {businessEtiquette.dressCode?.map((guideline, index) => (
                        <li key={index}>• {guideline}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offline Support Tab */}
        <TabsContent value="offline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <OptimizedIcon name="Shield" className="w-5 h-5 mr-2" />
                  Offline Capabilities
                </CardTitle>
                <CardDescription>
                  Progressive loading and offline-first design
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Essential Translations</span>
                    <Badge
                      variant={
                        offlineSupport.isEssentialCached
                          ? "default"
                          : "secondary"
                      }
                    >
                      {offlineSupport.isEssentialCached
                        ? "Cached"
                        : "Loading..."}
                    </Badge>
                  </div>
                  <Progress
                    value={offlineSupport.essentialProgress || 0}
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Extended Translations</span>
                    <Badge
                      variant={
                        offlineSupport.isExtendedCached
                          ? "default"
                          : "secondary"
                      }
                    >
                      {offlineSupport.isExtendedCached
                        ? "Cached"
                        : "Loading..."}
                    </Badge>
                  </div>
                  <Progress
                    value={offlineSupport.extendedProgress || 0}
                    className="h-2"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Storage Usage</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>Cache Size: {offlineSupport.cacheSize || "0 MB"}</div>
                    <div>Last Sync: {offlineSupport.lastSync || "Never"}</div>
                    <div>
                      Auto-sync:{" "}
                      {offlineSupport.autoSync ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Optimization</CardTitle>
                <CardDescription>
                  Smart loading based on connection quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Connection Quality</span>
                    <Badge variant={isOnline ? "default" : "destructive"}>
                      {isOnline ? "Good" : "Offline"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Translation Priority</span>
                      <span>{isOnline ? "Full Quality" : "Cached Only"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Image Loading</span>
                      <span>{isOnline ? "High Resolution" : "Compressed"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Analytics</span>
                      <span>{isOnline ? "Real-time" : "Queued"}</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    {isOnline
                      ? "All features available with live translation updates"
                      : "Running in offline mode with cached translations"}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Translation Requests</span>
                  <span className="font-semibold">
                    {analytics.translationRequests || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit Rate</span>
                  <span className="font-semibold">
                    {analytics.cacheHitRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Voice Commands</span>
                  <span className="font-semibold">
                    {analytics.voiceCommands || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cultural Adaptations</span>
                  <span className="font-semibold">
                    {analytics.culturalAdaptations || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Avg Translation Time</span>
                  <span className="font-semibold">
                    {performanceStats.avgTranslationTime || 0}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage</span>
                  <span className="font-semibold">
                    {performanceStats.memoryUsage || 0}MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bundle Size</span>
                  <span className="font-semibold">
                    {performanceStats.bundleSize || 0}KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Load Time</span>
                  <span className="font-semibold">
                    {performanceStats.loadTime || 0}ms
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>A/B Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Tests</span>
                    <span className="font-semibold">
                      {abTesting.activeTests || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variant</span>
                    <Badge variant="outline">
                      {abTesting.currentVariant || "Control"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Current Tests</h4>
                  {abTesting.tests?.map((test, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{test.name}</span>
                      <Badge variant="secondary">{test.status}</Badge>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">
                      No active tests
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Smart Translation Tab */}
        <TabsContent value="smart-translation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Context-Aware Translation</CardTitle>
                <CardDescription>
                  AI-powered translations that adapt to context and tone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {smartTranslationExamples.map((example, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{example.context}</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTextToSpeech(example.text)}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm">
                      <div>
                        <strong>Original:</strong> {example.text}
                      </div>
                      <div>
                        <strong>Translated:</strong>{" "}
                        {smartTranslation.translate(
                          example.text,
                          example.context,
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pluralization Engine</CardTitle>
                <CardDescription>
                  Advanced plural forms for complex languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 5, 11, 101].map((count) => (
                  <div
                    key={count}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span className="font-mono">{count} item(s)</span>
                    <span>
                      {pluralization.pluralize(
                        "item",
                        count,
                        cityConfig.locale,
                      )}
                    </span>
                  </div>
                ))}

                <Alert>
                  <AlertDescription>
                    Using {cityConfig.locale} pluralization rules with{" "}
                    {pluralization.getRuleCount(cityConfig.locale)} forms
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality Metrics Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Translation Quality</CardTitle>
                <CardDescription>
                  Real-time quality monitoring and improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Overall Quality Score</span>
                    <span className="font-semibold">{translationQuality}%</span>
                  </div>
                  <Progress value={translationQuality} className="h-3" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{qualityMetrics.accuracy || 92}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fluency</span>
                    <span>{qualityMetrics.fluency || 88}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cultural Relevance</span>
                    <span>{qualityMetrics.culturalRelevance || 85}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Context Understanding</span>
                    <span>{qualityMetrics.contextUnderstanding || 90}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Assurance</CardTitle>
                <CardDescription>
                  Continuous improvement and validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Auto-validation</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Human Review</span>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Machine Learning</span>
                    <Badge variant="default">Training</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Recent Improvements</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>
                      • Enhanced {cityConfig.locale} context detection (+5%
                      accuracy)
                    </li>
                    <li>
                      • Improved cultural adaptation for {cityConfig.country}
                    </li>
                    <li>• Updated regional expressions and idioms</li>
                    <li>• Optimized voice synthesis for local accent</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Quality Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Quality Monitoring</CardTitle>
              <CardDescription>
                Live translation quality metrics and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Translations/min", value: "24", status: "good" },
                  { label: "Error Rate", value: "0.2%", status: "good" },
                  { label: "Avg Response Time", value: "45ms", status: "good" },
                  {
                    label: "User Satisfaction",
                    value: "4.8/5",
                    status: "excellent",
                  },
                ].map((metric, index) => (
                  <div
                    key={index}
                    className="text-center p-4 border rounded-lg"
                  >
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                    <Badge
                      variant={
                        metric.status === "excellent" ? "default" : "secondary"
                      }
                      className="mt-2"
                    >
                      {metric.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
