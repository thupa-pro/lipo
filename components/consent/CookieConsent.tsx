"use client";

/**
 * Cookie Consent Banner
 * Shows consent banner and handles user interactions
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cookie,
  Settings,
  Shield,
  BarChart3,
  Target,
  User,
} from "lucide-react";
import { useConsent } from "./ConsentContext";
import { COOKIE_CATEGORIES } from "@/lib/consent/types";
import Link from "next/link";

export function CookieConsent() {
  const {
    showBanner,
    acceptAll,
    rejectNonEssential,
    preferences,
    updateConsent,
  } = useConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [tempPreferences, setTempPreferences] = useState({
    analytics: preferences?.analytics ?? false,
    marketing: preferences?.marketing ?? false,
    preferences: preferences?.preferences ?? false,
  });

  if (!showBanner) return null;

  const handleSaveSettings = async () => {
    try {
      await updateConsent(tempPreferences);
      setShowSettings(false);
    } catch (error) {
      console.error("Error saving consent settings:", error);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "analytics":
        return BarChart3;
      case "marketing":
        return Target;
      case "preferences":
        return User;
      default:
        return Shield;
    }
  };

  return (
    <>
      {/* Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/10 shadow-2xl">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      We use cookies to enhance your experience
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                      This site uses cookies and similar tools to improve
                      performance, personalize content, and analyze traffic.
                      <Link
                        href="/privacy"
                        className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                      >
                        Learn more in our Privacy Policy.
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 rounded-2xl border-slate-300 dark:border-white/20"
                >
                  <Settings className="w-4 h-4" />
                  Manage Preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={rejectNonEssential}
                  className="rounded-2xl border-slate-300 dark:border-white/20"
                >
                  Reject Non-Essential
                </Button>
                <Button
                  onClick={acceptAll}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/20 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Cookie Preferences
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-gray-300">
              Choose which cookies you allow us to use. You can change these
              settings at any time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Necessary Cookies - Always On */}
            <Card className="border-slate-200 dark:border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Necessary Cookies
                      </CardTitle>
                      <CardDescription>
                        Required for basic website functionality
                      </CardDescription>
                    </div>
                  </div>
                  <Switch checked={true} disabled />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-gray-300">
                  These cookies are essential for the website to function
                  properly. They enable core functionality such as security,
                  network management, and accessibility.
                </p>
              </CardContent>
            </Card>

            {/* Optional Cookie Categories */}
            {COOKIE_CATEGORIES.map((category) => {
              const Icon = getCategoryIcon(category.id);
              const isEnabled = tempPreferences[category.id];

              return (
                <Card
                  key={category.id}
                  className="border-slate-200 dark:border-white/20"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            isEnabled
                              ? "bg-gradient-to-r from-blue-500 to-emerald-500"
                              : "bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              isEnabled
                                ? "text-white"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {category.name}
                          </CardTitle>
                          <CardDescription>
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) =>
                          setTempPreferences((prev) => ({
                            ...prev,
                            [category.id]: checked,
                          }))
                        }
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600 dark:text-gray-300">
                        Examples:
                      </p>
                      <ul className="text-sm text-slate-500 dark:text-gray-400 space-y-1">
                        {category.examples.map((example, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-400 rounded-full" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="flex-1 rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTempPreferences({
                  analytics: false,
                  marketing: false,
                  preferences: false,
                });
              }}
              className="flex-1 rounded-2xl"
            >
              Reject All
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white"
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
