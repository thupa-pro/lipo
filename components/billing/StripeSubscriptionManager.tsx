import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

// Loconomy Stripe Subscription Manager
// Multi-tenant billing with role-aware pricing and AI optimization

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { CreditCard, Crown, TrendingUp, Sparkles, ArrowUpRight, Infinity, Target, Zap } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, SubscriptionTier } from '@/types/rbac';
import { BillingAccount, Subscription, AIOptimization } from '@/types/loconomy';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  role: UserRole;
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: PlanFeature[];
  limits: PlanLimit[];
  aiFeatures: AIFeature[];
  popular?: boolean;
  recommended?: boolean;
}

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PlanLimit {
  name: string;
  limit: number | 'unlimited';
  unit: string;
}

interface AIFeature {
  name: string;
  description: string;
  available: boolean;
}

interface StripeSubscriptionManagerProps {
  tenantId: string;
  userId: string;
  currentRole: UserRole;
  currentSubscription?: Subscription;
  billingAccount?: BillingAccount;
  onSubscriptionChange?: (subscription: Subscription) => void;
  className?: string;
}

const LOCONOMY_PLANS: SubscriptionPlan[] = [
  {
    id: 'consumer-free',
    name: 'Consumer Free',
    description: 'Perfect for occasional service bookings',
    tier: 'free',
    role: 'consumer',
    pricing: {
      monthly: 0,
      yearly: 0,
      currency: 'USD',
    },
    features: [
      { name: 'Browse & book services', included: true },
      { name: 'Basic customer support', included: true },
      { name: 'Service reviews', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Priority booking', included: false },
      { name: 'AI recommendations', included: false },
    ],
    limits: [
      { name: 'Monthly bookings', limit: 3, unit: 'bookings' },
      { name: 'Saved providers', limit: 5, unit: 'providers' },
    ],
    aiFeatures: [
      { name: 'Basic service matching', description: 'Simple algorithm matching', available: true },
      { name: 'AI recommendations', description: 'Personalized service suggestions', available: false },
      { name: 'Smart scheduling', description: 'AI-optimized booking times', available: false },
    ],
  },
  {
    id: 'consumer-premium',
    name: 'Consumer Premium',
    description: 'Enhanced experience for regular users',
    tier: 'premium',
    role: 'consumer',
    pricing: {
      monthly: 9.99,
      yearly: 99.99,
      currency: 'USD',
    },
    features: [
      { name: 'Everything in Free', included: true },
      { name: 'Priority booking', included: true },
      { name: 'AI recommendations', included: true },
      { name: 'Smart scheduling', included: true },
      { name: 'Premium support', included: true },
      { name: 'Booking concierge', included: true },
    ],
    limits: [
      { name: 'Monthly bookings', limit: 'unlimited', unit: 'bookings' },
      { name: 'Saved providers', limit: 'unlimited', unit: 'providers' },
    ],
    aiFeatures: [
      { name: 'AI recommendations', description: 'Personalized service suggestions', available: true },
      { name: 'Smart scheduling', description: 'AI-optimized booking times', available: true },
      { name: 'Predictive pricing', description: 'Best time to book for savings', available: true },
    ],
    popular: true,
  },
  {
    id: 'provider-starter',
    name: 'Provider Starter',
    description: 'Get started as a service provider',
    tier: 'free',
    role: 'provider',
    pricing: {
      monthly: 0,
      yearly: 0,
      currency: 'USD',
    },
    features: [
      { name: 'Basic listing creation', included: true },
      { name: 'Accept bookings', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Customer messaging', included: true },
      { name: 'AI listing optimization', included: false },
      { name: 'Advanced analytics', included: false },
    ],
    limits: [
      { name: 'Active listings', limit: 2, unit: 'listings' },
      { name: 'Monthly bookings', limit: 10, unit: 'bookings' },
      { name: 'Revenue limit', limit: 500, unit: 'USD/month' },
    ],
    aiFeatures: [
      { name: 'Basic listing visibility', description: 'Standard search ranking', available: true },
      { name: 'AI listing optimization', description: 'Automated content enhancement', available: false },
      { name: 'Performance coaching', description: 'AI-driven improvement tips', available: false },
    ],
  },
  {
    id: 'provider-professional',
    name: 'Provider Professional',
    description: 'Scale your service business',
    tier: 'premium',
    role: 'provider',
    pricing: {
      monthly: 29.99,
      yearly: 299.99,
      currency: 'USD',
    },
    features: [
      { name: 'Everything in Starter', included: true },
      { name: 'AI listing optimization', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Performance coaching', included: true },
      { name: 'Priority placement', included: true },
      { name: 'Multi-location support', included: true },
    ],
    limits: [
      { name: 'Active listings', limit: 10, unit: 'listings' },
      { name: 'Monthly bookings', limit: 'unlimited', unit: 'bookings' },
      { name: 'Revenue limit', limit: 'unlimited', unit: 'USD/month' },
    ],
    aiFeatures: [
      { name: 'AI listing optimization', description: 'Automated content enhancement', available: true },
      { name: 'Performance coaching', description: 'AI-driven improvement tips', available: true },
      { name: 'Dynamic pricing', description: 'AI-optimized pricing suggestions', available: true },
    ],
    recommended: true,
  },
  {
    id: 'provider-enterprise',
    name: 'Provider Enterprise',
    description: 'Full-featured business solution',
    tier: 'enterprise',
    role: 'provider',
    pricing: {
      monthly: 99.99,
      yearly: 999.99,
      currency: 'USD',
    },
    features: [
      { name: 'Everything in Professional', included: true },
      { name: 'Team management', included: true },
      { name: 'Advanced integrations', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
      { name: 'Dedicated support', included: true },
    ],
    limits: [
      { name: 'Active listings', limit: 'unlimited', unit: 'listings' },
      { name: 'Team members', limit: 'unlimited', unit: 'users' },
      { name: 'API calls', limit: 100000, unit: 'calls/month' },
    ],
    aiFeatures: [
      { name: 'Advanced AI coaching', description: 'Comprehensive business optimization', available: true },
      { name: 'Market intelligence', description: 'Competitive analysis and trends', available: true },
      { name: 'Custom AI models', description: 'Tailored AI solutions for your business', available: true },
    ],
  },
];

export function StripeSubscriptionManager({
  tenantId,
  userId,
  currentRole,
  currentSubscription,
  billingAccount,
  onSubscriptionChange,
  className
}: StripeSubscriptionManagerProps) {
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [aiOptimizations, setAiOptimizations] = useState<AIOptimization[]>([]);
  const [usageData, setUsageData] = useState<any>({});

  // Filter plans by current role
  const availablePlans = LOCONOMY_PLANS.filter(plan => plan.role === currentRole);
  const currentPlan = availablePlans.find(plan => plan.id === currentSubscription?.planId);

  // Load AI optimizations
  useEffect(() => {
    loadAIOptimizations();
    loadUsageData();
  }, [currentSubscription]);

  const loadAIOptimizations = async () => {
    try {
      // Mock AI optimizations - in, production, fetch from API
      const mockOptimizations: AIOptimization[] = [
        {
          type: 'pricing',
          suggestion: 'Switch to yearly billing to save 17% annually',
          potentialSavings: currentPlan ? currentPlan.pricing.monthly * 12 * 0.17 : 0,
          implemented: false,
        },
        {
          type: 'features',
          suggestion: 'Upgrade to unlock AI listing optimization for 25% more bookings',
          potentialSavings: 0,
          implemented: false,
        },
        {
          type: 'usage',
          suggestion: 'You\'re near your monthly limit. Consider upgrading.',
          potentialSavings: 0,
          implemented: false,
        },
      ];
      setAiOptimizations(mockOptimizations);
    } catch (error) {
      console.error('Failed to load AI optimizations:', error);
    }
  };

  const loadUsageData = async () => {
    try {
      // Mock usage data - in, production, fetch from API
      const mockUsage = {
        listings: { used: 1, limit: currentPlan?.limits.find(l => l.name === 'Active listings')?.limit || 2 },
        bookings: { used: 7, limit: currentPlan?.limits.find(l => l.name === 'Monthly bookings')?.limit || 10 },
        revenue: { used: 350, limit: currentPlan?.limits.find(l => l.name === 'Revenue limit')?.limit || 500 },
      };
      setUsageData(mockUsage);
    } catch (error) {
      console.error('Failed to load usage data:', error);
    }
  };

  const handlePlanSelect = useCallback((plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  }, []);

  const handleSubscriptionUpgrade = useCallback(async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      // Mock Stripe subscription creation
      const mockSubscription: Subscription = {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        planId: selectedPlan.id,
        status: 'active',
        currentPeriod: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          billingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        pricing: {
          baseAmount: billingInterval === 'yearly' ? selectedPlan.pricing.yearly : selectedPlan.pricing.monthly,
          usageAmount: 0,
          commissionAmount: 0,
          totalAmount: billingInterval === 'yearly' ? selectedPlan.pricing.yearly : selectedPlan.pricing.monthly,
          currency: selectedPlan.pricing.currency,
        },
        features: selectedPlan.features.map(f => ({
          name: f.name,
          limit: undefined,
          unlimited: false,
          aiEnhanced: false,
        })),
        usage: {
          period: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            billingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          listings: 0,
          bookings: 0,
          aiRequests: 0,
          storageUsed: 0,
          bandwidthUsed: 0,
        },
        aiOptimizations: [],
      };

      onSubscriptionChange?.(mockSubscription);
      
      toast({
        title: "✨ Subscription Updated!",
        description: `Successfully upgraded to ${selectedPlan.name}`,
      });

      setShowUpgradeDialog(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Subscription upgrade failed:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error upgrading your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlan, billingInterval, onSubscriptionChange, toast]);

  const calculateSavings = (plan: SubscriptionPlan) => {
    const monthlyCost = plan.pricing.monthly * 12;
    const yearlyCost = plan.pricing.yearly;
    return monthlyCost - yearlyCost;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Current Subscription Overview */}
      {currentSubscription && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              Current Subscription
            </CardTitle>
            <CardDescription>
              Manage your Loconomy subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Plan</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20">
                    {currentPlan?.name || 'Unknown Plan'}
                  </Badge>
                  {currentPlan?.tier === 'enterprise' && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}>
                  {currentSubscription.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Next Billing</p>
                <p className="font-medium">
                  {formatDate(currentSubscription.currentPeriod.end)}
                </p>
              </div>
            </div>

            {/* Usage Progress */}
            {currentPlan && (
              <div className="space-y-4">
                <h4 className="font-medium">Usage This Month</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(usageData).map(([key, data]: [string, any]) => {
                    const limit = data.limit;
                    const used = data.used;
                    const percentage = limit === 'unlimited' ? 0 : (used / limit) * 100;
                    
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{key}</span>
                          <span>
                            {used} / {limit === 'unlimited' ? '∞' : limit}
                          </span>
                        </div>
                        {limit !== 'unlimited' && (
                          <Progress 
                            value={percentage} 
                            className={`h-2 ${percentage > 80 ? 'bg-red-100' : 'bg-green-100'}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Optimizations */}
      {aiOptimizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Billing Optimizations
            </CardTitle>
            <CardDescription>
              Smart recommendations to optimize your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiOptimizations.map((optimization, index) => (
                <Alert key={index} className="border-blue-200">
                  <Target className="w-4 h-4" />
                  <AlertTitle className="flex items-center justify-between">
                    <span>{optimization.suggestion}</span>
                    {optimization.potentialSavings > 0 && (
                      <Badge variant="outline" className="text-green-600">
                        Save ${optimization.potentialSavings.toFixed(2)}
                      </Badge>
                    )}
                  </AlertTitle>
                  <AlertDescription>
                    <Button variant="outline" size="sm" className="mt-2">
                      Apply Optimization
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-lg border p-1">
          <Button
            variant={billingInterval === 'monthly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingInterval('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingInterval === 'yearly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingInterval('yearly')}
            className="relative"
          >
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 17%
            </Badge>
          </Button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availablePlans.map((plan) => {
          const isCurrentPlan = plan.id === currentSubscription?.planId;
          const price = billingInterval === 'yearly' ? plan.pricing.yearly : plan.pricing.monthly;
          const savings = calculateSavings(plan);
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`relative h-full ${
                plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''
              } ${plan.recommended ? 'border-green-500' : ''} ${
                isCurrentPlan ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 hover:bg-blue-700">Most Popular</Badge>
                  </div>
                )}
                {plan.recommended && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                    {plan.tier === 'free' && <NavigationIcons.Users className="w-6 h-6 text-white" / />}
                    {plan.tier === 'premium' && <Zap className="w-6 h-6 text-white" />}
                    {plan.tier === 'enterprise' && <Crown className="w-6 h-6 text-white" />}
                  </div>
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      {formatCurrency(price, plan.pricing.currency)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingInterval === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingInterval === 'yearly' && savings > 0 && (
                      <p className="text-sm text-green-600">
                        Save ${savings.toFixed(2)} per year
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Features</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          {feature.included ? (
                            <UIIcons.CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" / />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Limits */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Limits</h4>
                    <ul className="space-y-2">
                      {plan.limits.map((limit, index) => (
                        <li key={index} className="flex justify-between text-sm">
                          <span>{limit.name}</span>
                          <span className="font-medium">
                            {limit.limit === 'unlimited' ? (
                              <div className="flex items-center gap-1">
                                <Infinity className="w-4 h-4" />
                                Unlimited
                              </div>
                            ) : (
                              `${limit.limit} ${limit.unit}`
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* AI Features */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.aiFeatures.map((feature, index) => (
                        <li key={index} className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            {feature.available ? (
                              <UIIcons.CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" / />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span className={feature.available ? '' : 'text-muted-foreground'}>
                              {feature.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground ml-6">
                            {feature.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        <UIIcons.CheckCircle className="w-4 h-4 mr-2" / />
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handlePlanSelect(plan)}
                        className={`w-full ${
                          plan.popular || plan.recommended 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                            : ''
                        }`}
                      >
                        {plan.pricing.monthly === 0 ? 'Get Started' : 'Upgrade Now'}
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription Upgrade</DialogTitle>
            <DialogDescription>
              You're about to upgrade to {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing</span>
                  <span className="font-medium">
                    {formatCurrency(
                      billingInterval === 'yearly' ? selectedPlan.pricing.yearly : selectedPlan.pricing.monthly,
                      selectedPlan.pricing.currency
                    )} {billingInterval}
                  </span>
                </div>
                {billingInterval === 'yearly' && (
                  <div className="flex justify-between text-green-600">
                    <span>Annual Savings</span>
                    <span className="font-medium">
                      ${calculateSavings(selectedPlan).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <Alert>
                <OptimizedIcon name="Shield" className="w-4 h-4" />
                <AlertTitle>Secure Payment</AlertTitle>
                <AlertDescription>
                  Your payment is processed securely through Stripe. You can cancel anytime.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubscriptionUpgrade}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <OptimizedIcon name="Clock" className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Confirm Upgrade
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}