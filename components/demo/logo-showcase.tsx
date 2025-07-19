"use client";

/**
 * Logo Showcase Component
 * Demonstrates all logo variants and their appropriate use cases
 */

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Logo,
  NavigationLogo,
  FooterLogo,
  MobileLogo,
  MarketingLogo,
  AuthLogo,
  SidebarLogo,
  ButtonLogo,
  WatermarkLogo
} from "@/components/ui/logo";
import { LogoVariant, UIContext } from "@/lib/types/logo";

export function LogoShowcase() {
  const { theme, setTheme } = useTheme();
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>(LogoVariant.DARK);

  const variantCards = [
    {
      variant: LogoVariant.DARK,
      title: "Dark Logo",
      description: "For light backgrounds",
      useCases: ["Navigation", "Auth pages", "Light mode"],
      background: "bg-white dark:bg-gray-100"
    },
    {
      variant: LogoVariant.LIGHT,
      title: "Light Logo", 
      description: "For dark backgrounds",
      useCases: ["Sidebar", "Footer", "Dark mode"],
      background: "bg-gray-900 dark:bg-gray-800"
    },
    {
      variant: LogoVariant.COLORED,
      title: "Colored Logo",
      description: "For marketing and splash screens",
      useCases: ["Marketing", "Hero sections", "Onboarding"],
      background: "bg-gray-50 dark:bg-gray-900"
    },
    {
      variant: LogoVariant.ICON,
      title: "Icon Only",
      description: "For constrained spaces",
      useCases: ["Mobile nav", "Buttons", "Favicons"],
      background: "bg-gray-50 dark:bg-gray-900"
    },
    {
      variant: LogoVariant.OUTLINE,
      title: "Outline Logo",
      description: "For watermarking and minimal UI",
      useCases: ["Watermarks", "Print exports", "Subtle branding"],
      background: "bg-gray-50 dark:bg-gray-900"
    }
  ];

  const contextComponents = [
    { name: "Navigation", component: <NavigationLogo />, context: UIContext.NAVIGATION },
    { name: "Footer", component: <FooterLogo />, context: UIContext.FOOTER },
    { name: "Mobile", component: <MobileLogo />, context: UIContext.MOBILE },
    { name: "Marketing", component: <MarketingLogo />, context: UIContext.MARKETING },
    { name: "Auth", component: <AuthLogo />, context: UIContext.AUTH },
    { name: "Sidebar", component: <SidebarLogo />, context: UIContext.SIDEBAR },
    { name: "Button", component: <ButtonLogo />, context: UIContext.BUTTON },
    { name: "Watermark", component: <WatermarkLogo />, context: UIContext.WATERMARK }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Loconomy Logo System</h1>
        <p className="text-lg text-muted-foreground">
          Dynamic logo variants that automatically adapt to context and theme
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Label htmlFor="theme-toggle">Theme</Label>
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <Badge variant="outline">{theme}</Badge>
        </div>
      </div>

      <Tabs defaultValue="variants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="variants">Logo Variants</TabsTrigger>
          <TabsTrigger value="contexts">Context Components</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
        </TabsList>

        <TabsContent value="variants" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variantCards.map((card) => (
              <Card key={card.variant} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {card.title}
                    <Badge variant="secondary">{card.variant}</Badge>
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`${card.background} p-6 rounded-lg flex items-center justify-center min-h-[120px]`}>
                    <Logo variant={card.variant} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Use Cases:</h4>
                    <div className="flex flex-wrap gap-1">
                      {card.useCases.map((useCase) => (
                        <Badge key={useCase} variant="outline" className="text-xs">
                          {useCase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contexts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contextComponents.map((item) => (
              <Card key={item.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>Context: {item.context}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg flex items-center justify-center min-h-[80px]">
                    {item.component}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playground" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Playground</CardTitle>
              <CardDescription>
                Test different logo variants and see how they adapt to themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {Object.values(LogoVariant).map((variant) => (
                  <Button
                    key={variant}
                    variant={selectedVariant === variant ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Light Background</h3>
                  <div className="bg-white border p-8 rounded-lg flex items-center justify-center min-h-[150px]">
                    <Logo variant={selectedVariant} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Dark Background</h3>
                  <div className="bg-gray-900 border p-8 rounded-lg flex items-center justify-center min-h-[150px]">
                    <Logo variant={selectedVariant} />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current Selection:</h4>
                <p className="text-sm text-muted-foreground">
                  Variant: <code className="bg-background px-2 py-1 rounded">{selectedVariant}</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}