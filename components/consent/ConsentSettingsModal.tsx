"use client";

// Consent Settings Modal for Loconomy Platform
// Provides granular control over cookie and privacy preferences

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Shield, 
  BarChart3, 
  Target, 
  User, 
  Info,
  Clock,
  Eye,
  Zap
} from 'lucide-react';
import { ConsentSettings } from '@/types/rbac';
import { createDefaultConsent, updateConsentSettings } from '@/lib/rbac/utils';

interface ConsentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConsent: ConsentSettings | null;
  onSave: (settings: ConsentSettings) => void;
  isLoading?: boolean;
}

interface CookieCategory {
  id: keyof Omit<ConsentSettings, 'timestamp' | 'version'>;
  name: string;
  description: string;
  icon: typeof Shield;
  required: boolean;
  examples: string[];
  purposes: string[];
  dataRetention: string;
  thirdParties?: string[];
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for basic website functionality and security',
    icon: Shield,
    required: true,
    examples: [
      'Authentication tokens',
      'Session management',
      'Security preferences',
      'Load balancing',
      'Form submission data'
    ],
    purposes: [
      'Enable core website functionality',
      'Maintain user authentication',
      'Ensure website security',
      'Remember form inputs during session'
    ],
    dataRetention: 'Session duration or up to 30 days'
  },
  {
    id: 'analytics',
    name: 'Analytics & Performance',
    description: 'Help us understand how you use our website to improve performance',
    icon: BarChart3,
    required: false,
    examples: [
      'Google Analytics',
      'PostHog analytics',
      'Page view tracking',
      'User interaction events',
      'Performance monitoring'
    ],
    purposes: [
      'Understand website usage patterns',
      'Improve website performance',
      'Identify popular content',
      'Debug technical issues'
    ],
    dataRetention: 'Up to 26 months',
    thirdParties: ['Google Analytics', 'PostHog']
  },
  {
    id: 'marketing',
    name: 'Marketing & Advertising',
    description: 'Used to deliver relevant ads and measure campaign effectiveness',
    icon: Target,
    required: false,
    examples: [
      'Google Ads conversion tracking',
      'Facebook Pixel',
      'Campaign attribution',
      'Retargeting pixels',
      'A/B testing for ads'
    ],
    purposes: [
      'Show relevant advertisements',
      'Measure ad campaign effectiveness',
      'Reduce repetitive ads',
      'Improve ad targeting'
    ],
    dataRetention: 'Up to 24 months',
    thirdParties: ['Google Ads', 'Facebook', 'LinkedIn']
  },
  {
    id: 'personalization',
    name: 'Personalization & Experience',
    description: 'Enhance your experience with personalized content and features',
    icon: User,
    required: false,
    examples: [
      'User preferences',
      'Content recommendations',
      'Interface customizations',
      'Chat widget settings',
      'Saved filters and searches'
    ],
    purposes: [
      'Remember your preferences',
      'Provide personalized content',
      'Customize user interface',
      'Enable interactive features'
    ],
    dataRetention: 'Up to 12 months',
    thirdParties: ['Intercom', 'Hotjar']
  }
];

export function ConsentSettingsModal({
  isOpen,
  onClose,
  currentConsent,
  onSave,
  isLoading = false
}: ConsentSettingsModalProps) {
  const [settings, setSettings] = useState<ConsentSettings>(
    currentConsent || createDefaultConsent()
  );
  const [activeTab, setActiveTab] = useState<'categories' | 'details'>('categories');

  useEffect(() => {
    if (currentConsent) {
      setSettings(currentConsent);
    }
  }, [currentConsent]);

  const handleToggle = (categoryId: keyof ConsentSettings, value: boolean) => {
    if (categoryId === 'essential') return; // Essential cookies cannot be disabled

    setSettings(prev => updateConsentSettings(prev, { [categoryId]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  const handleAcceptAll = () => {
    const allAccepted = updateConsentSettings(settings, {
      analytics: true,
      marketing: true,
      personalization: true
    });
    setSettings(allAccepted);
    onSave(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = updateConsentSettings(settings, {
      analytics: false,
      marketing: false,
      personalization: false
    });
    setSettings(allRejected);
    onSave(allRejected);
  };

  const enabledCount = COOKIE_CATEGORIES.filter(
    category => settings[category.id] === true
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Cookie Preferences</DialogTitle>
          <DialogDescription>
            Choose which cookies you allow us to use. You can change these settings at any time.
          </DialogDescription>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">{enabledCount}</span> of{' '}
              <span className="font-medium">{COOKIE_CATEGORIES.length}</span> categories enabled
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated: {new Date(settings.timestamp).toLocaleDateString()}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeTab === 'categories' ? 'default' : 'outline'}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'details' ? 'default' : 'outline'}
              onClick={() => setActiveTab('details')}
            >
              Details
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-[60vh]">
          {activeTab === 'categories' ? (
            <CategoriesView 
              categories={COOKIE_CATEGORIES}
              settings={settings}
              onToggle={handleToggle}
            />
          ) : (
            <DetailsView 
              categories={COOKIE_CATEGORIES}
              settings={settings}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              disabled={isLoading}
              className="flex-1"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              onClick={handleAcceptAll}
              disabled={isLoading}
              className="flex-1"
            >
              Accept All
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Categories view component
function CategoriesView({
  categories,
  settings,
  onToggle
}: {
  categories: CookieCategory[];
  settings: ConsentSettings;
  onToggle: (categoryId: keyof ConsentSettings, value: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isEnabled = settings[category.id];
        const Icon = category.icon;

        return (
          <Card key={category.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isEnabled
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-muted'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isEnabled
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => onToggle(category.id, checked)}
                    disabled={category.required}
                    aria-label={`Toggle ${category.name}`}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Examples */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Examples
                  </Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {category.examples.slice(0, 3).map((example, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                    {category.examples.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.examples.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Third parties */}
                {category.thirdParties && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Third Parties
                    </Label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {category.thirdParties.map((party, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {party}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data retention */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Data retention: {category.dataRetention}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Details view component
function DetailsView({
  categories,
  settings
}: {
  categories: CookieCategory[];
  settings: ConsentSettings;
}) {
  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const isEnabled = settings[category.id];
        const Icon = category.icon;

        return (
          <Card key={category.id} className={isEnabled ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isEnabled
                      ? 'bg-blue-100 dark:bg-blue-900/20'
                      : 'bg-muted'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isEnabled
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{category.name}</CardTitle>
                    <Badge variant={isEnabled ? 'default' : 'secondary'} className="text-xs">
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Purposes */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Purposes</Label>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {category.purposes.map((purpose, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {purpose}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Data retention and examples */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-medium">Data Retention</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.dataRetention}</p>
                </div>

                {category.thirdParties && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <Label className="font-medium">Third Party Services</Label>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {category.thirdParties.map((party, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {party}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* All examples */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">Cookie Examples</Label>
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.examples.map((example, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}