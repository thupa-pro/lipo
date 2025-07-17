import type {
  JsonValue,
  UserProfile,
  Workspace,
  ApiResponse,
} from "@/lib/types/common";

// Basic type guards
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// Null/undefined checks
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return isArray(value) && value.length > 0;
}

// JSON value type guard
export function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (isObject(value)) {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

// API response type guard
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    isObject(value) &&
    "success" in value &&
    isBoolean(value.success) &&
    (!("error" in value) || isString(value.error) || value.error === undefined)
  );
}

// UserProfile type guard
export function isUserProfile(value: unknown): value is UserProfile {
  return (
    isObject(value) &&
    "id" in value &&
    isString(value.id) &&
    "email" in value &&
    isString(value.email) &&
    "firstName" in value &&
    isString(value.firstName) &&
    "lastName" in value &&
    isString(value.lastName)
  );
}

// Workspace type guard
export function isWorkspace(value: unknown): value is Workspace {
  return (
    isObject(value) &&
    "id" in value &&
    isString(value.id) &&
    "name" in value &&
    isString(value.name) &&
    "slug" in value &&
    isString(value.slug) &&
    "ownerId" in value &&
    isString(value.ownerId)
  );
}

// Error handling type guards
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function hasErrorMessage(value: unknown): value is { message: string } {
  return isObject(value) && "message" in value && isString(value.message);
}

// Form validation type guards
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Environment type guards
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

// Generic utility type guards
export function hasProperty<T extends object, K extends string>(
  obj: T,
  prop: K,
): obj is T & Record<K, unknown> {
  return prop in obj;
}

export function hasRequiredProperties<T extends object, K extends keyof T>(
  obj: T,
  props: K[],
): obj is T & Required<Pick<T, K>> {
  return props.every((prop) => prop in obj && obj[prop] !== undefined);
}

// Safe type assertion with fallback
export function safeAssert<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  fallback: T,
): T {
  return guard(value) ? value : fallback;
}

// Array type guard with element validation
export function isArrayOf<T>(
  value: unknown,
  elementGuard: (item: unknown) => item is T,
): value is T[] {
  return isArray(value) && value.every(elementGuard);
}
