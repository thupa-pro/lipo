import { MockSubscription } from "./types";

export interface MockBillingPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: {
    maxListings: number;
    maxBookings: number;
    aiSupport: boolean;
    analytics: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    advancedReports: boolean;
  };
  popular?: boolean;
}

export interface MockInvoice {
  id: string;
  number: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: Date;
  dueDate: Date;
  plan: string;
  downloadUrl: string;
}

export interface MockPaymentMethod {
  id: string;
  type: "card" | "bank_account";
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export const mockBillingPlans: MockBillingPlan[] = [
  {
    id: "plan_free",
    name: "Free",
    price: 0,
    interval: "month",
    features: {
      maxListings: 3,
      maxBookings: 10,
      aiSupport: false,
      analytics: false,
      whiteLabel: false,
      prioritySupport: false,
      customBranding: false,
      advancedReports: false,
    },
  },
  {
    id: "plan_pro",
    name: "Pro",
    price: 29,
    interval: "month",
    popular: true,
    features: {
      maxListings: 25,
      maxBookings: 100,
      aiSupport: true,
      analytics: true,
      whiteLabel: false,
      prioritySupport: true,
      customBranding: false,
      advancedReports: true,
    },
  },
  {
    id: "plan_premium",
    name: "Premium",
    price: 79,
    interval: "month",
    features: {
      maxListings: 100,
      maxBookings: 500,
      aiSupport: true,
      analytics: true,
      whiteLabel: true,
      prioritySupport: true,
      customBranding: true,
      advancedReports: true,
    },
  },
];

// Simulate network delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class MockStripeService {
  private storageKey = "loconomy_mock_billing";

  private getBillingData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getDefaultBillingData();
    } catch {
      return this.getDefaultBillingData();
    }
  }

  private saveBillingData(data: any) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save billing data:", error);
    }
  }

  private getDefaultBillingData() {
    return {
      invoices: this.generateSampleInvoices(),
      paymentMethods: this.generateSamplePaymentMethods(),
      usage: {
        listings: 8,
        bookings: 45,
        apiCalls: 1250,
        storage: 2.4, // GB
        teamMembers: 3,
      },
    };
  }

  private generateSampleInvoices(): MockInvoice[] {
    const now = new Date();
    return [
      {
        id: "inv_001",
        number: "INV-2024-001",
        amount: 29.0,
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        plan: "Pro Plan",
        downloadUrl: "/api/mock/invoices/inv_001.pdf",
      },
      {
        id: "inv_002",
        number: "INV-2024-002",
        amount: 29.0,
        status: "paid",
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
        plan: "Pro Plan",
        downloadUrl: "/api/mock/invoices/inv_002.pdf",
      },
      {
        id: "inv_003",
        number: "INV-2024-003",
        amount: 79.0,
        status: "pending",
        date: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        plan: "Premium Plan",
        downloadUrl: "/api/mock/invoices/inv_003.pdf",
      },
    ];
  }

  private generateSamplePaymentMethods(): MockPaymentMethod[] {
    return [
      {
        id: "pm_001",
        type: "card",
        last4: "4242",
        brand: "visa",
        expiryMonth: 12,
        expiryYear: 2028,
        isDefault: true,
      },
      {
        id: "pm_002",
        type: "card",
        last4: "0005",
        brand: "mastercard",
        expiryMonth: 8,
        expiryYear: 2027,
        isDefault: false,
      },
    ];
  }

  async getPlans(): Promise<MockBillingPlan[]> {
    await delay(300);
    return mockBillingPlans;
  }

  async getCurrentPlan(
    subscription: MockSubscription,
  ): Promise<MockBillingPlan> {
    await delay(200);
    const planMap = {
      free: "plan_free",
      pro: "plan_pro",
      premium: "plan_premium",
    };

    const planId = planMap[subscription.plan];
    return (
      mockBillingPlans.find((plan) => plan.id === planId) || mockBillingPlans[0]
    );
  }

  async changePlan(
    newPlanId: string,
  ): Promise<{ success: boolean; message: string }> {
    await delay(1500); // Simulate longer processing time

    const plan = mockBillingPlans.find((p) => p.id === newPlanId);
    if (!plan) {
      return { success: false, message: "Invalid plan selected" };
    }

    // Simulate some random failures for demo purposes
    if (Math.random() < 0.1) {
      return {
        success: false,
        message:
          "Payment method declined. Please update your payment information.",
      };
    }

    return {
      success: true,
      message: `Successfully upgraded to ${plan.name} plan. Changes will take effect immediately.`,
    };
  }

  async getInvoices(): Promise<MockInvoice[]> {
    await delay(400);
    const data = this.getBillingData();
    return data.invoices.map((inv: any) => ({
      ...inv,
      date: new Date(inv.date),
      dueDate: new Date(inv.dueDate),
    }));
  }

  async downloadInvoice(invoiceId: string): Promise<string> {
    await delay(800);
    // In a real app, this would trigger a PDF download
    return `https://mock-invoices.loconomy.com/${invoiceId}.pdf`;
  }

  async getPaymentMethods(): Promise<MockPaymentMethod[]> {
    await delay(300);
    const data = this.getBillingData();
    return data.paymentMethods;
  }

  async addPaymentMethod(
    method: Omit<MockPaymentMethod, "id">,
  ): Promise<MockPaymentMethod> {
    await delay(1000);

    const data = this.getBillingData();
    const newMethod: MockPaymentMethod = {
      ...method,
      id: `pm_${Date.now()}`,
    };

    // If this is set as default, make all others non-default
    if (newMethod.isDefault) {
      data.paymentMethods.forEach((pm: MockPaymentMethod) => {
        pm.isDefault = false;
      });
    }

    data.paymentMethods.push(newMethod);
    this.saveBillingData(data);

    return newMethod;
  }

  async removePaymentMethod(methodId: string): Promise<boolean> {
    await delay(500);

    const data = this.getBillingData();
    const index = data.paymentMethods.findIndex(
      (pm: MockPaymentMethod) => pm.id === methodId,
    );

    if (index === -1) return false;

    // Don't allow removing the default method if it's the only one
    const method = data.paymentMethods[index];
    if (method.isDefault && data.paymentMethods.length === 1) {
      throw new Error("Cannot remove the only payment method");
    }

    data.paymentMethods.splice(index, 1);

    // If we removed the default, make the first remaining one default
    if (method.isDefault && data.paymentMethods.length > 0) {
      data.paymentMethods[0].isDefault = true;
    }

    this.saveBillingData(data);
    return true;
  }

  async setDefaultPaymentMethod(methodId: string): Promise<boolean> {
    await delay(300);

    const data = this.getBillingData();
    const method = data.paymentMethods.find(
      (pm: MockPaymentMethod) => pm.id === methodId,
    );

    if (!method) return false;

    // Reset all to non-default
    data.paymentMethods.forEach((pm: MockPaymentMethod) => {
      pm.isDefault = false;
    });

    // Set the selected one as default
    method.isDefault = true;

    this.saveBillingData(data);
    return true;
  }

  async getUsage(): Promise<{
    listings: number;
    bookings: number;
    apiCalls: number;
    storage: number;
    teamMembers: number;
  }> {
    await delay(600);
    const data = this.getBillingData();
    return data.usage;
  }

  async getUsageAlerts(subscription: MockSubscription): Promise<{
    listings: boolean;
    bookings: boolean;
    storage: boolean;
  }> {
    await delay(200);
    const usage = await this.getUsage();
    const features = subscription.features;

    return {
      listings: usage.listings >= features.maxListings * 0.8,
      bookings: usage.bookings >= features.maxBookings * 0.8,
      storage: usage.storage >= 5 * 0.8, // Assuming 5GB limit for all plans
    };
  }

  async cancelSubscription(): Promise<{ success: boolean; message: string }> {
    await delay(1000);

    // Simulate some random failures
    if (Math.random() < 0.05) {
      return {
        success: false,
        message: "Unable to cancel subscription. Please contact support.",
      };
    }

    return {
      success: true,
      message:
        "Subscription canceled successfully. You will continue to have access until the end of your current billing period.",
    };
  }

  async reactivateSubscription(
    planId: string,
  ): Promise<{ success: boolean; message: string }> {
    await delay(1200);

    const plan = mockBillingPlans.find((p) => p.id === planId);
    if (!plan) {
      return { success: false, message: "Invalid plan selected" };
    }

    return {
      success: true,
      message: `Subscription reactivated successfully on ${plan.name} plan.`,
    };
  }
}

// Export singleton instance
export const mockStripeService = new MockStripeService();

// Utility functions
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const getPlanFeatureList = (plan: MockBillingPlan): string[] => {
  const features = [];

  if (plan.features.maxListings === 999999) {
    features.push("Unlimited listings");
  } else {
    features.push(`Up to ${plan.features.maxListings} listings`);
  }

  if (plan.features.maxBookings === 999999) {
    features.push("Unlimited bookings");
  } else {
    features.push(`Up to ${plan.features.maxBookings} bookings per month`);
  }

  if (plan.features.aiSupport) features.push("AI-powered support");
  if (plan.features.analytics) features.push("Advanced analytics");
  if (plan.features.whiteLabel) features.push("White-label solution");
  if (plan.features.prioritySupport) features.push("Priority customer support");
  if (plan.features.customBranding) features.push("Custom branding");
  if (plan.features.advancedReports) features.push("Advanced reporting");

  return features;
};
