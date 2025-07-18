"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Mic,
  MicOff,
  Volume2,
  Brain,
  Zap,
  BarChart3,
  Wifi,
  WifiOff,
  Palette,
  Calendar,
  DollarSign,
  MessageSquare,
  Users,
  Star,
  Clock,
  TrendingUp,
  Eye,
  Settings,
} from "lucide-react";
import {
  useAdvancedI18n,
  useVoiceCommands,
  useCulturalUI,
  useTranslationAnalytics,
  useOfflineTranslations,
} from "@/hooks/use-advanced-i18n";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { CitySelector } from "./city-selector";
import { TranslationManager } from "./translation-manager";

export function AdvancedI18nShowcase() {
  const [activeDemo, setActiveDemo] = useState("voice");
  const [userId] = useState("demo-user-123");

  const i18n = useAdvancedI18n();
  const voice = useVoiceCommands(i18n.locale);
  const cultural = useCulturalUI(i18n.locale);
  const analytics = useTranslationAnalytics();
  const offline = useOfflineTranslations();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Internationalization Showcase
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Experience cutting-edge i18n features including voice interfaces,
          cultural intelligence, offline support, A/B testing, and real-time
          analytics across 35+ languages and 50+ metropolitan cities.
        </p>

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>35+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            <span>50+ Cities</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            {offline.isOffline ? (
              <WifiOff className="w-4 h-4 text-red-600" />
            ) : (
              <Wifi className="w-4 h-4 text-green-600" />
            )}
            <span>{offline.isOffline ? "Offline" : "Online"}</span>
          </div>
        </div>
      </div>

      {/* Feature Demo Tabs */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="cultural" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Cultural
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="offline" className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Offline
          </TabsTrigger>
          <TabsTrigger value="abtest" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="translation" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Management
          </TabsTrigger>
        </TabsList>

        {/* Voice Interface Demo */}
        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Voice Interface Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Speech Recognition</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={voice.isListening ? "destructive" : "default"}
                        onClick={
                          voice.isListening
                            ? voice.stopVoiceCommand
                            : voice.startVoiceCommand
                        }
                        disabled={!voice.isSupported}
                      >
                        {voice.isListening ? (
                          <>
                            <MicOff className="w-4 h-4 mr-2" />
                            Stop Listening
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Start Listening
                          </>
                        )}
                      </Button>
                      <Badge
                        variant={voice.isSupported ? "default" : "destructive"}
                      >
                        {voice.isSupported ? "Supported" : "Not Supported"}
                      </Badge>
                    </div>

                    {voice.isListening && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          🎤 Listening for commands in{" "}
                          {localeNames[i18n.locale]}...
                        </p>
                      </div>
                    )}

                    {voice.lastCommand && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <p className="text-sm">
                          <strong>Last Command:</strong> {voice.lastCommand}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Text-to-Speech</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Test Speech</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={i18n.t("Common.search", {
                            fallback: "Enter text to speak...",
                          })}
                          id="speech-text"
                        />
                        <Button
                          onClick={() => {
                            const input = document.getElementById(
                              "speech-text",
                            ) as HTMLInputElement;
                            if (input.value) voice.speak(input.value);
                          }}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Quick Tests:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          i18n.t("Home.hero.title_part1", {
                            fallback: "Find Local Services",
                          }),
                          i18n.t("Navigation.welcome", {
                            fallback: "Welcome to Loconomy",
                          }),
                          i18n.t("Common.success", { fallback: "Success!" }),
                        ].map((text, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => voice.speak(text)}
                          >
                            {text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cultural Intelligence Demo */}
        <TabsContent value="cultural" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Cultural Adaptations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Communication Style</Label>
                    <Badge variant="outline">
                      {cultural.culturalProfile.communicationStyle}
                    </Badge>
                  </div>
                  <div>
                    <Label>Time Orientation</Label>
                    <Badge variant="outline">
                      {cultural.culturalProfile.timeOrientation}
                    </Badge>
                  </div>
                  <div>
                    <Label>Formality Level</Label>
                    <Badge variant="outline">
                      {cultural.adaptations.content.formality}
                    </Badge>
                  </div>
                  <div>
                    <Label>Response Time</Label>
                    <Badge variant="outline">
                      {cultural.adaptations.communication.responseTime}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Message Adaptation Demo</Label>
                  <div className="space-y-2">
                    {["error", "success", "warning", "info"].map((type) => (
                      <div key={type} className="p-2 border rounded">
                        <div className="text-xs text-gray-500 mb-1">
                          {type.toUpperCase()}:
                        </div>
                        <div className="text-sm">
                          {cultural.adaptMessage(
                            `This is a ${type} message`,
                            type as any,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Cultural Events & Holidays
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cultural.culturalEvents.length > 0 ? (
                  <div className="space-y-3">
                    {cultural.culturalEvents.map((event, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{event.name}</h4>
                          <Badge
                            className={
                              event.importance === "high"
                                ? "bg-red-100 text-red-800"
                                : event.importance === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {event.importance}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Date: {event.date}</p>
                          <p>Business Impact: {event.businessImpact}</p>
                          {event.greetings && (
                            <p>Greetings: {event.greetings.join(", ")}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No upcoming cultural events for this locale
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing and Scheduling Adaptations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing Adaptation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[50, 100, 250].map((price) => {
                    const adapted = cultural.adaptPricing(price);
                    return (
                      <div key={price} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">
                            {adapted.display}
                          </span>
                          <div className="flex gap-2">
                            {adapted.showTax && (
                              <Badge variant="outline">+Tax</Badge>
                            )}
                            {adapted.negotiable && (
                              <Badge variant="outline">Negotiable</Badge>
                            )}
                            {adapted.trustSignals && (
                              <Badge variant="outline">Trusted</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Scheduling Adaptation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(cultural.adaptScheduling()).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <Badge variant="outline">{String(value)}</Badge>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Demo */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {analytics.mostUsed.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Translation Keys Tracked
                    </div>
                  </div>
                  <div className="space-y-2">
                    {analytics.mostUsed.slice(0, 5).map((item, index) => (
                      <div
                        key={item.key}
                        className="flex justify-between text-sm"
                      >
                        <span className="truncate">{item.key}</span>
                        <Badge variant="outline">{item.usage}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.slowTranslations.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Slow Translations
                    </div>
                  </div>
                  {analytics.slowTranslations.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.slowTranslations
                        .slice(0, 3)
                        .map((item, index) => (
                          <div
                            key={item.key}
                            className="flex justify-between text-sm"
                          >
                            <span className="truncate">{item.key}</span>
                            <Badge variant="destructive">
                              {item.avgTime.toFixed(1)}ms
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      All translations performing well!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Quality Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {analytics.quality.errors.size}
                    </div>
                    <div className="text-sm text-gray-600">
                      Translation Errors
                    </div>
                  </div>
                  {analytics.quality.hasErrors ? (
                    <div className="space-y-2">
                      {Array.from(analytics.quality.errors.entries())
                        .slice(0, 3)
                        .map(([key, error]) => (
                          <div key={key} className="text-sm">
                            <div className="font-medium text-red-600">
                              {key}
                            </div>
                            <div className="text-gray-600 truncate">
                              {error.message}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      No errors detected!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offline Support Demo */}
        <TabsContent value="offline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {offline.isOffline ? (
                    <WifiOff className="w-5 h-5 text-red-600" />
                  ) : (
                    <Wifi className="w-5 h-5 text-green-600" />
                  )}
                  Network Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Connection Status</span>
                  <Badge
                    variant={offline.isOffline ? "destructive" : "default"}
                  >
                    {offline.isOffline ? "Offline" : "Online"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Available Languages Offline</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {locales.slice(0, 9).map((locale) => (
                      <div
                        key={locale}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">{locale.toUpperCase()}</span>
                        <Badge
                          variant={
                            offline.isLanguageLoaded(locale)
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {offline.isLanguageLoaded(locale) ? "✓" : "○"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => offline.ensureLanguageAvailable(i18n.locale)}
                  className="w-full"
                >
                  Ensure Current Language Available Offline
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progressive Loading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Load Additional Languages</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {locales.slice(0, 8).map((locale) => (
                      <Button
                        key={locale}
                        variant="outline"
                        size="sm"
                        onClick={() => i18n.loadLanguage(locale, "normal")}
                        disabled={offline.isLanguageLoaded(locale)}
                        className="flex items-center justify-between"
                      >
                        <span>{localeNames[locale]}</span>
                        {offline.isLanguageLoaded(locale) && (
                          <Badge variant="default" className="ml-2 text-xs">
                            ✓
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() =>
                    i18n.preloadLanguages(["en", "es", "fr", "de", "zh"])
                  }
                  className="w-full"
                  variant="outline"
                >
                  Preload Popular Languages
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* A/B Testing Demo */}
        <TabsContent value="abtest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Translation A/B Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Create A/B Test</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        i18n.abTesting.createTest("hero_cta", {
                          variant_a: "Get Started Now",
                          variant_b: "Start Your Journey",
                          variant_c: "Begin Today",
                        });
                      }}
                    >
                      Create Hero CTA Test
                    </Button>

                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        Current Variant for User {userId}:
                      </h4>
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                        <span className="font-semibold">
                          {i18n.abTesting.getVariant("hero_cta", userId) ||
                            "No variant assigned"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Test Results</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() =>
                        i18n.abTesting.trackConversion("hero_cta", userId)
                      }
                      variant="outline"
                    >
                      Track Conversion
                    </Button>

                    <div className="space-y-2">
                      {Object.entries(
                        i18n.abTesting.getResults("hero_cta") || {},
                      ).map(([variant, data]) => (
                        <div key={variant} className="p-2 border rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {variant}
                            </span>
                            <Badge variant="outline">
                              {(data.conversionRate * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            Confidence: {(data.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Translation Management */}
        <TabsContent value="translation" className="space-y-6">
          <TranslationManager />
        </TabsContent>
      </Tabs>

      {/* Global Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Global Localization Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Current Language</Label>
              <div className="mt-1">
                <Badge variant="default" className="text-sm">
                  {localeNames[i18n.locale]} ({i18n.locale})
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm">Selected City</Label>
              <div className="mt-1">
                <CitySelector />
              </div>
            </div>

            <div>
              <Label className="text-sm">Cultural Profile</Label>
              <div className="mt-1">
                <Badge variant="outline" className="text-sm">
                  {cultural.culturalProfile.communicationStyle} •{" "}
                  {cultural.culturalProfile.timeOrientation}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
