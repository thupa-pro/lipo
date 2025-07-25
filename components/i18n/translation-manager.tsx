"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  XCircle,
  Download,
  Upload,
  Search,
  BarChart3,
  Globe,
  Code,
  Eye,
  Edit,
  Save,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Clock
} from "lucide-react";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import {
  TranslationAnalytics,
  SmartTranslator
} from "@/lib/i18n/advanced-features";

interface TranslationKey {
  key: string;
  category: string;
  context?: string;
  translations: Record<
    Locale,
    {
      value: string;
      status: "complete" | "missing" | "outdated" | "needs-review";
      lastUpdated: Date;
      confidence?: number;
    }
  >;
}

export function TranslationManager() {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [translations, setTranslations] = useState<TranslationKey[]>([]);
  const [analytics] = useState(() => new TranslationAnalytics());
  const [isLoading, setIsLoading] = useState(false);

  // Mock translation data (in real, app, this would come from API)
  useEffect(() => {
    const mockTranslations: TranslationKey[] = [
      {
        key: "Home.hero.title_part1",
        category: "Homepage",
        context: "Main hero section",
        translations: {
          en: {
            value: "Find Local Services",
            status: "complete",
            lastUpdated: new Date(),
          },
          zh: {
            value: "寻找本地服务",
            status: "complete",
            lastUpdated: new Date(),
          },
          hi: {
            value: "स्थानीय सेवाएं खोजें",
            status: "complete",
            lastUpdated: new Date(),
          },
          es: {
            value: "Encuentra Servicios Locales",
            status: "complete",
            lastUpdated: new Date(),
          },
          ar: {
            value: "اعثر على الخدمات المحلية",
            status: "complete",
            lastUpdated: new Date(),
          },
        } as any,
      },
      {
        key: "Navigation.search_placeholder",
        category: "Navigation",
        context: "Search input placeholder",
        translations: {
          en: {
            value: "Search for services...",
            status: "complete",
            lastUpdated: new Date(),
          },
          zh: {
            value: "搜索服务...",
            status: "complete",
            lastUpdated: new Date(),
          },
          hi: {
            value: "सेवाएं खोजें...",
            status: "needs-review",
            lastUpdated: new Date(),
          },
          es: {
            value: "Buscar servicios...",
            status: "complete",
            lastUpdated: new Date(),
          },
          ar: { value: "", status: "missing", lastUpdated: new Date() },
        } as any,
      },
      {
        key: "Common.loading",
        category: "Common",
        context: "Loading indicator text",
        translations: {
          en: {
            value: "Loading...",
            status: "complete",
            lastUpdated: new Date(),
          },
          zh: {
            value: "加载中...",
            status: "complete",
            lastUpdated: new Date(),
          },
          hi: {
            value: "लोड हो रहा है...",
            status: "complete",
            lastUpdated: new Date(),
          },
          es: {
            value: "Cargando...",
            status: "complete",
            lastUpdated: new Date(),
          },
          ar: {
            value: "جاري التحميل...",
            status: "complete",
            lastUpdated: new Date(),
          },
        } as any,
      },
    ];
    setTranslations(mockTranslations);
  }, []);

  const filteredTranslations = useMemo(() => {
    return translations.filter((translation) => {
      const matchesSearch =
        translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translation.translations[activeLocale]?.value
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || translation.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [translations, searchTerm, selectedCategory, activeLocale]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(translations.map((t) => t.category)));
    return ["all", ...cats];
  }, [translations]);

  const getCompletionStats = () => {
    const total = translations.length;
    const completed = translations.filter(
      (t) => t.translations[activeLocale]?.status === "complete",
    ).length;
    const missing = translations.filter(
      (t) =>
        !t.translations[activeLocale] ||
        t.translations[activeLocale]?.status === "missing",
    ).length;
    const needsReview = translations.filter(
      (t) => t.translations[activeLocale]?.status === "needs-review",
    ).length;

    return {
      total,
      completed,
      missing,
      needsReview,
      percentage: (completed / total) * 100,
    };
  };

  const updateTranslation = (key: string, locale: Locale, value: string) => {
    setTranslations((prev) =>
      prev.map((translation) => {
        if (translation.key === key) {
          return {
            ...translation,
            translations: {
              ...translation.translations,
              [locale]: {
                ...translation.translations[locale],
                value,
                status: "complete" as const,
                lastUpdated: new Date(),
              },
            },
          };
        }
        return translation;
      }),
    );
  };

  const exportTranslations = () => {
    const data = translations.reduce((acc, translation) => {
      const keys = translation.key.split(".");
      let current = acc;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = translation.translations[activeLocale]?.value || "";
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });

      return acc;
    }, {} as any);

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeLocale}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateMissingTranslations = async () => {
    setIsLoading(true);
    // Simulate AI translation generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setTranslations((prev) =>
      prev.map((translation) => {
        const currentTranslation = translation.translations[activeLocale];
        if (!currentTranslation || currentTranslation.status === "missing") {
          // Generate based on English translation (mock)
          const englishValue = translation.translations.en?.value || "";
          const generatedValue = `[AI] ${englishValue}`; // Mock generation

          return {
            ...translation,
            translations: {
              ...translation.translations,
              [activeLocale]: {
                value: generatedValue,
                status: "needs-review" as const,
                lastUpdated: new Date(),
                confidence: 0.75,
              },
            },
          };
        }
        return translation;
      }),
    );

    setIsLoading(false);
  };

  const stats = getCompletionStats();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Translation Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage translations across {locales.length} languages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportTranslations}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={generateMissingTranslations} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            AI Generate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Keys
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missing
                </p>
                <p className="text-2xl font-bold">{stats.missing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Needs Review
                </p>
                <p className="text-2xl font-bold">{stats.needsReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {localeNames[activeLocale]} Completion
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(stats.percentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs defaultValue="translations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="quality">Quality Check</TabsTrigger>
        </TabsList>

        <TabsContent value="translations" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={activeLocale} onValueChange={setActiveLocale}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locales.map((locale) => (
                  <SelectItem key={locale} value={locale}>
                    {localeNames[locale]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation List */}
          <div className="space-y-4">
            {filteredTranslations.map((translation) => (
              <TranslationRow
                key={translation.key}
                translation={translation}
                locale={activeLocale}
                onUpdate={updateTranslation}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView analytics={analytics} />
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <QualityCheckView translations={translations} locale={activeLocale} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TranslationRow({
  translation,
  locale,
  onUpdate,
}: {
  translation: TranslationKey;
  locale: Locale;
  onUpdate: (key: string, locale: Locale, value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const currentTranslation = translation.translations[locale];
  const englishTranslation = translation.translations.en;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "missing":
        return "bg-red-100 text-red-800";
      case "outdated":
        return "bg-orange-100 text-orange-800";
      case "needs-review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = () => {
    setEditValue(currentTranslation?.value || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(translation.key, locale, editValue);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{translation.key}</h4>
              <p className="text-xs text-gray-500">{translation.category}</p>
              {translation.context && (
                <p className="text-xs text-gray-400 italic">
                  {translation.context}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={getStatusColor(
                  currentTranslation?.status || "missing",
                )}
              >
                {currentTranslation?.status || "missing"}
              </Badge>
              {currentTranslation?.confidence && (
                <Badge variant="outline">
                  {Math.round(currentTranslation.confidence * 100)}% AI
                </Badge>
              )}
            </div>
          </div>

          {/* English Reference */}
          {locale !== "en" && englishTranslation && (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
              <Label className="text-xs text-gray-500">English:</Label>
              <p>{englishTranslation.value}</p>
            </div>
          )}

          {/* Translation Content */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex-1 flex gap-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <div className="flex flex-col gap-1">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <p className="flex-1 text-sm">
                  {currentTranslation?.value || (
                    <span className="text-gray-400 italic">No translation</span>
                  )}
                </p>
                <Button size="sm" variant="ghost" onClick={handleEdit}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Metadata */}
          {currentTranslation && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  Updated {currentTranslation.lastUpdated.toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsView({ analytics }: { analytics: TranslationAnalytics }) {
  const metrics = analytics.getMetrics();
  const mostUsed = analytics.getMostUsedTranslations(10);
  const slowTranslations = analytics.getSlowTranslations(5);
  const errorProne = analytics.getErrorProneTranslations();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Most Used Translations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostUsed.map((item, index) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm truncate">{item.key}</span>
                <Badge variant="outline">{item.usage}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Performance Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {slowTranslations.map((item, index) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm truncate">{item.key}</span>
                <Badge variant="destructive">{item.avgTime.toFixed(2)}ms</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QualityCheckView({
  translations,
  locale,
}: {
  translations: TranslationKey[];
  locale: Locale;
}) {
  const issues = useMemo(() => {
    const problems: Array<{
      key: string;
      issue: string;
      severity: "high" | "medium" | "low";
    }> = [];

    translations.forEach((translation) => {
      const current = translation.translations[locale];
      const english = translation.translations.en;

      if (!current || !current.value) {
        problems.push({
          key: translation.key,
          issue: "Missing translation",
          severity: "high",
        });
      } else if (current.value === english?.value) {
        problems.push({
          key: translation.key,
          issue: "Same as English (possible untranslated)",
          severity: "medium",
        });
      } else if (current.value.length < 3) {
        problems.push({
          key: translation.key,
          issue: "Translation too short",
          severity: "low",
        });
      }
    });

    return problems;
  }, [translations, locale]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold">Quality Issues</h3>
        <Badge variant="outline">{issues.length} issues found</Badge>
      </div>

      <div className="space-y-3">
        {issues.map((issue, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{issue.key}</p>
                  <p className="text-sm text-gray-600">{issue.issue}</p>
                </div>
                <Badge
                  className={
                    issue.severity === "high"
                      ? "bg-red-100 text-red-800"
                      : issue.severity === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }
                >
                  {issue.severity}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {issues.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Issues Found!</h3>
              <p className="text-gray-600">
                All translations for {localeNames[locale]} look good.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
