import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  Globe,
  Smartphone,
  Shield,
  MessageSquare,
  CreditCard,
  Users,
  Star,
  Zap,
} from "lucide-react";

export default function DemoPage() {
  const t = useTranslations();
  const mobileT = useTranslations("Mobile");
  const paymentT = useTranslations("Payment");
  const commonT = useTranslations("Common");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Internationalization Demo
              </h1>
              <p className="text-muted-foreground">
                Showcasing multilingual support across all components
              </p>
            </div>
          </div>

          {/* Language Switcher Variants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Premium Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <LanguageSwitcher variant="premium" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Default Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <LanguageSwitcher variant="default" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mobile Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <LanguageSwitcher variant="mobile" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Translation Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Navigation Translations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Navigation Translations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Badge variant="outline">{t("Navigation.home")}</Badge>
                <Badge variant="outline">{t("Navigation.dashboard")}</Badge>
                <Badge variant="outline">{t("Navigation.payments")}</Badge>
                <Badge variant="outline">{t("Navigation.settings")}</Badge>
                <Badge variant="outline">{t("Navigation.profile")}</Badge>
                <Badge variant="outline">{t("Navigation.help_center")}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Translations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Mobile Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Badge variant="outline">
                  {mobileT("dashboard.welcome_back")}
                </Badge>
                <Badge variant="outline">
                  {mobileT("navigation.dashboard")}
                </Badge>
                <Badge variant="outline">{mobileT("header.online")}</Badge>
                <Badge variant="outline">{mobileT("header.secure")}</Badge>
                <Badge variant="outline">
                  {mobileT("notifications.title")}
                </Badge>
                <Badge variant="outline">{mobileT("feedback.title")}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Translations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Badge variant="outline">{paymentT("wallet.title")}</Badge>
                <Badge variant="outline">{paymentT("wallet.balance")}</Badge>
                <Badge variant="outline">
                  {paymentT("methods.credit_card")}
                </Badge>
                <Badge variant="outline">
                  {paymentT("processing.completed")}
                </Badge>
                <Badge variant="outline">
                  {paymentT("analytics.success_rate")}
                </Badge>
                <Badge variant="outline">{paymentT("wallet.refresh")}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Common Translations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Common Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Badge variant="outline">{commonT("loading")}</Badge>
                <Badge variant="outline">{commonT("success")}</Badge>
                <Badge variant="outline">{commonT("save")}</Badge>
                <Badge variant="outline">{commonT("cancel")}</Badge>
                <Badge variant="outline">{commonT("search")}</Badge>
                <Badge variant="outline">{commonT("refresh")}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Component Demo Note */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Live Component Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Visit <strong>/dashboard</strong> to see localized mobile
              components in action, including: mobile headers, biometric
              authentication, feedback widgets, and payment systems.
            </p>
          </CardContent>
        </Card>

        {/* Features Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Internationalization Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Language Support</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• English (Default)</li>
                  <li>• Spanish</li>
                  <li>• French</li>
                  <li>• RTL Support Ready</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• URL-based routing</li>
                  <li>• Persistent preferences</li>
                  <li>• Server-side rendering</li>
                  <li>• Type-safe translations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Components</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Navigation menus</li>
                  <li>• Mobile interfaces</li>
                  <li>• Payment systems</li>
                  <li>• Form validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
