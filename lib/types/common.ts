// Common utility types
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ObjectWithStringKeys = Record<string, unknown>;

export type UpdateFunction<T> = (key: keyof T, value: T[keyof T]) => void;

export type GenericUpdateFunction = (key: string, value: unknown) => void;

// Form related types
export interface FormField {
  name: string;
  value: unknown;
  error?: string;
  touched?: boolean;
}

export interface FormData {
  [key: string]: unknown;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Settings types
export interface BaseSettings {
  [key: string]: unknown;
}

export type SettingsUpdateFunction<T extends BaseSettings> = (
  key: keyof T,
  value: T[keyof T],
) => void;

// API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// User profile types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
  bookingUpdates: boolean;
  paymentNotifications: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: "public" | "private" | "contacts";
  activityVisibility: "public" | "private";
  contactInfoVisibility: "public" | "private" | "verified";
}

export interface AccessibilityPreferences {
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

// Billing and payment types
export interface BillingSettings {
  autoRenewal: boolean;
  billingEmail: string;
  invoiceNotifications: boolean;
  taxId?: string;
  billingAddress: BillingAddress;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Discovery and search types
export interface DiscoveryFilters {
  category?: string;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: "now" | "today" | "week" | "month";
  urgency?: "emergency" | "urgent" | "flexible";
  distance?: number;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: Pick<UserProfile, "id" | "email" | "firstName" | "lastName" | "avatar">;
}

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  invitedBy: string;
  createdAt: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: JsonValue;
  timestamp: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps {
  isLoading: boolean;
  error?: string | null;
  retry?: () => void;
}

// Event handler types
export type EventHandler<T = void> = () => T;
export type EventHandlerWithPayload<P, T = void> = (payload: P) => T;

// Async operation types
export type AsyncOperation<T = void> = () => Promise<T>;
export type AsyncOperationWithPayload<P, T = void> = (payload: P) => Promise<T>;
