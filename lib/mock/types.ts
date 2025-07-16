export type UserRole = "guest" | "consumer" | "provider" | "admin";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  subscription: MockSubscription;
}

export interface MockSubscription {
  plan: "free" | "pro" | "premium";
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: Date;
  features: {
    maxListings: number;
    maxBookings: number;
    aiSupport: boolean;
    analytics: boolean;
    whiteLabel: boolean;
  };
}

export interface MockListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  providerId: string;
  providerName: string;
  location: string;
  images: string[];
  availability: Record<string, string[]>;
  status: "active" | "inactive" | "pending";
  createdAt: Date;
}

export interface MockBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  providerId: string;
  providerName: string;
  consumerId: string;
  consumerName: string;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "canceled";
  totalAmount: number;
  createdAt: Date;
}

export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

export interface MockAuthState {
  user: MockUser | null;
  isLoading: boolean;
  signIn: (email: string, role: UserRole) => Promise<void>;
  signOut: () => void;
  switchRole: (role: UserRole) => void;
  updateSubscription: (plan: "free" | "pro" | "premium") => void;
}
