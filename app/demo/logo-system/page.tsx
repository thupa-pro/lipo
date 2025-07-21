"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Logo, 
  LogoVariant, 
  LogoSize, 
  LogoContext,
  HeaderLogo,
  SidebarLogo,
  FooterLogo,
  HeroLogo,
  MobileNavLogo,
  ButtonLogo,
  WatermarkLogo,
  OnboardingLogo,
  SplashLogo,
  useLogoVariant,
  getLogoUrl
} from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';
import { 
  Palette, 
  Monitor, 
  Smartphone, 
  Layout, 
  Sparkles,
  Sun,
  Moon,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function LogoSystemDemo() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(label);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `${label} code copied successfully`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const variants = [
    {
      name: 'Auto',
      variant: LogoVariant.AUTO,
      description: 'Automatically adapts to theme',
      background: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950',
      code: '<Logo variant={LogoVariant.AUTO} />'
    },
    {
      name: 'Dark',
      variant: LogoVariant.DARK,
      description: 'For light backgrounds',
      background: 'bg-white',
      code: '<Logo variant={LogoVariant.DARK} />'
    },
    {
      name: 'Light',
      variant: LogoVariant.LIGHT,
      description: 'For dark backgrounds',
      background: 'bg-gray-900',
      code: '<Logo variant={LogoVariant.LIGHT} />'
    },
    {
      name: 'Colored',
      variant: LogoVariant.COLORED,
      description: 'For marketing & splash screens',
      background: 'bg-gradient-to-r from-gray-50 to-gray-100',
      code: '<Logo variant={LogoVariant.COLORED} />'
    },
    {
      name: 'Icon',
      variant: LogoVariant.ICON,
      description: 'For constrained spaces',
      background: 'bg-gradient-to-r from-blue-50 to-purple-50',
      code: '<Logo variant={LogoVariant.ICON} />'
    },
    {
      name: 'Outline',
      variant: LogoVariant.OUTLINE,
      description: 'For watermarks & minimal UI',
      background: 'bg-gray-50',
      code: '<Logo variant={LogoVariant.OUTLINE} />'
    }
  ];

  const sizes = [
    { name: 'XS', size: LogoSize.XS, description: '16px - Favicons, buttons' },
    { name: 'SM', size: LogoSize.SM, description: '24px - Mobile nav' },
    { name: 'MD', size: LogoSize.MD, description: '32px - Standard header' },
    { name: 'LG', size: LogoSize.LG, description: '48px - Hero sections' },
    { name: 'XL', size: LogoSize.XL, description: '64px - Splash screens' },
    { name: 'XXL', size: LogoSize.XXL, description: '96px - Marketing pages' }
  ];

  const contexts = [
    { name: 'Header', component: HeaderLogo, code: '<HeaderLogo />' },
    { name: 'Sidebar', component: SidebarLogo, code: '<SidebarLogo />' },
    { name: 'Footer', component: FooterLogo, code: '<FooterLogo />' },
    { name: 'Hero', component: HeroLogo, code: '<HeroLogo />' },
    { name: 'Mobile Nav', component: MobileNavLogo, code: '<MobileNavLogo />' },
    { name: 'Button', component: ButtonLogo, code: '<ButtonLogo />' },
    { name: 'Watermark', component: WatermarkLogo, code: '<WatermarkLogo />' },
    { name: 'Onboarding', component: OnboardingLogo, code: '<OnboardingLogo />' },
    { name: 'Splash', component: SplashLogo, code: '<SplashLogo />' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Palette className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loconomy Logo System
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Intelligent logo variant selection with automatic theme adaptation, optimized performance, and accessibility features.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Theme Aware
          </Badge>
          <Badge variant="secondary" className="gap-2">
            <Monitor className="w-4 h-4" />
            Responsive
          </Badge>
          <Badge variant="secondary" className="gap-2">
            <Layout className="w-4 h-4" />
            Context Based
          </Badge>
          <ThemeToggle />
        </div>
      </div>

      <Tabs defaultValue="variants" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="contexts">Contexts</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
        </TabsList>

        {/* Logo Variants */}
        <TabsContent value="variants" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Logo Variants</h2>
            <p className="text-muted-foreground">
              Different logo variants optimized for specific use cases and backgrounds
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <Card key={variant.name} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{variant.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(variant.code, variant.name)}
                    >
                      {copiedCode === variant.name ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>{variant.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`${variant.background} rounded-lg p-8 flex items-center justify-center min-h-[120px]`}>
                    <Logo variant={variant.variant} />
                  </div>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <code className="text-sm">{variant.code}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Logo Sizes */}
        <TabsContent value="sizes" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Logo Sizes</h2>
            <p className="text-muted-foreground">
              Predefined size presets for consistent scaling across different contexts
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Size Comparison</CardTitle>
              <CardDescription>All sizes shown with the Auto variant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sizes.map((size) => (
                  <div key={size.name} className="flex items-center gap-6 p-4 border rounded-lg">
                    <div className="w-24 text-sm font-medium">
                      {size.name}
                    </div>
                    <div className="flex items-center justify-center min-w-[200px] p-4 bg-muted rounded">
                      <Logo variant={LogoVariant.AUTO} size={size.size} />
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      {size.description}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`<Logo size={LogoSize.${size.name}} />`, `Size ${size.name}`)}
                    >
                      {copiedCode === `Size ${size.name}` ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Context Components */}
        <TabsContent value="contexts" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Context Components</h2>
            <p className="text-muted-foreground">
              Pre-configured components for specific UI contexts with intelligent variant selection
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contexts.map((context) => {
              const LogoComponent = context.component;
              return (
                <Card key={context.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{context.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(context.code, context.name)}
                      >
                        {copiedCode === context.name ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 flex items-center justify-center min-h-[120px]">
                      <LogoComponent />
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <code className="text-sm">{context.code}</code>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Real Examples */}
        <TabsContent value="examples" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Real-World Examples</h2>
            <p className="text-muted-foreground">
              See how the logo system works in actual UI components
            </p>
          </div>

          <div className="space-y-8">
            {/* Navigation Example */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation Header</CardTitle>
                <CardDescription>Responsive header with theme-aware logo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <HeaderLogo interactive />
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">Services</Badge>
                      <Badge variant="outline">Providers</Badge>
                      <Badge variant="outline">Pricing</Badge>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <code className="text-sm">
                    {`<HeaderLogo interactive onClick={() => router.push('/')} />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Hero Section Example */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Marketing hero with colored logo variant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 rounded-lg p-12 text-center">
                  <HeroLogo className="mx-auto mb-6" />
                  <h1 className="text-3xl font-bold mb-4">Welcome to Loconomy</h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    Premium local services platform with AI-powered matching
                  </p>
                  <Button size="lg" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Get Started
                  </Button>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <code className="text-sm">
                    {`<HeroLogo className="mx-auto mb-6" />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Navigation Example */}
            <Card>
              <CardHeader>
                <CardTitle>Mobile Navigation</CardTitle>
                <CardDescription>Compact mobile header with icon logo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm mx-auto border rounded-lg p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <MobileNavLogo interactive />
                    <Button variant="ghost" size="sm">
                      <div className="flex flex-col gap-1">
                        <div className="w-4 h-0.5 bg-current"></div>
                        <div className="w-4 h-0.5 bg-current"></div>
                        <div className="w-4 h-0.5 bg-current"></div>
                      </div>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <code className="text-sm">
                    {`<MobileNavLogo interactive />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Footer Example */}
            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
                <CardDescription>Footer with adaptive logo and branding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <FooterLogo className="mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Premium local services platform with AI-powered matching.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Platform</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Browse Services</li>
                        <li>Find Providers</li>
                        <li>How It Works</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Company</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Contact</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <code className="text-sm">
                    {`<FooterLogo className="mb-4" />`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Utilities */}
        <TabsContent value="utilities" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Utility Functions</h2>
            <p className="text-muted-foreground">
              Programmatic access to logo variants and URLs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>useLogoVariant Hook</CardTitle>
                <CardDescription>Get the optimal logo variant for a context</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">Current variants:</div>
                    <div className="space-y-1 text-sm">
                      <div>Header: <Badge variant="outline">{useLogoVariant(LogoContext.HEADER)}</Badge></div>
                      <div>Sidebar: <Badge variant="outline">{useLogoVariant(LogoContext.SIDEBAR)}</Badge></div>
                      <div>Hero: <Badge variant="outline">{useLogoVariant(LogoContext.HERO)}</Badge></div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      {`const variant = useLogoVariant(LogoContext.HEADER);`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>getLogoUrl Function</CardTitle>
                <CardDescription>Get direct URL to logo asset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">Logo URLs:</div>
                    <div className="space-y-1 text-xs">
                      <div className="truncate">Dark: {getLogoUrl(LogoVariant.DARK)}</div>
                      <div className="truncate">Light: {getLogoUrl(LogoVariant.LIGHT)}</div>
                      <div className="truncate">Colored: {getLogoUrl(LogoVariant.COLORED)}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      {`const url = getLogoUrl(LogoVariant.COLORED);`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Examples</CardTitle>
              <CardDescription>Test different configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Button
                    variant="outline"
                    onClick={() => setTheme('light')}
                    className="gap-2"
                  >
                    <Sun className="w-4 h-4" />
                    Light Theme
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setTheme('dark')}
                    className="gap-2"
                  >
                    <Moon className="w-4 h-4" />
                    Dark Theme
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setTheme('system')}
                    className="gap-2"
                  >
                    <Monitor className="w-4 h-4" />
                    System
                  </Button>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-sm">
                      Current theme: {theme || 'system'}
                    </Badge>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8">
                    <Logo variant={LogoVariant.AUTO} size={LogoSize.LG} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Logo automatically adapts to theme changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}