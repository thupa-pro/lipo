# 🛡️ RBAC & Cookie Consent System Implementation

## Overview

This document describes the production-ready Role-Based Access Control (RBAC) and Cookie Consent system implemented for Loconomy. The system provides granular access control based on user roles and subscription tiers, along with GDPR-compliant cookie consent management.

## 🏗️ Architecture

### Core Components

1. **Type Definitions** (`types/rbac.ts`)
   - Comprehensive TypeScript interfaces for roles, permissions, and consent
   - Strict typing for better developer experience and runtime safety

2. **Utility Functions** (`lib/rbac/utils.ts`)
   - Permission checking and role validation
   - Consent management for guests and authenticated users
   - Subscription tier access controls

3. **Session Management** (`lib/auth/session.ts`)
   - Unified authentication supporting both NextAuth and Clerk
   - Server-side session handling for RBAC
   - Graceful fallback between authentication providers

4. **RoleGate Component** (`components/rbac/RoleGate.tsx`)
   - Conditional rendering based on roles and subscriptions
   - Elegant fallback UI for access denied scenarios
   - Multiple convenience components for common use cases

5. **Cookie Consent System** (`components/consent/`)
   - GDPR-compliant consent banner with animations
   - Granular settings modal for cookie preferences
   - Third-party script loading based on consent

6. **Middleware Protection** (`middleware.ts`)
   - Route-level access control
   - Internationalization integration
   - Automatic redirects for unauthorized access

## 🔐 Role System

### User Roles

```typescript
type UserRole = 'guest' | 'consumer' | 'provider' | 'admin';
```

- **Guest**: Unauthenticated visitors with limited access
- **Consumer**: Authenticated users who book services
- **Provider**: Service providers managing listings and bookings
- **Admin**: Platform administrators with full access

### Subscription Tiers

```typescript
type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';
```

Each tier unlocks additional features and capabilities for providers.

### Permission System

Permissions are automatically derived from roles with hierarchical inheritance:

```typescript
const PERMISSIONS = {
  guest: ['browse_services', 'view_public_profiles'],
  consumer: [...guest, 'book_services', 'manage_bookings', 'write_reviews'],
  provider: [...guest, 'manage_listings', 'view_earnings', 'respond_bookings'],
  admin: [...all permissions]
};
```

## 🍪 Cookie Consent System

### Features

- **GDPR Compliance**: Full compliance with European privacy regulations
- **Granular Control**: Separate consent for analytics, marketing, and personalization
- **Third-party Integration**: Automatic script loading based on consent
- **Dual Storage**: localStorage for guests, database for authenticated users
- **Accessible Design**: Full keyboard navigation and screen reader support

### Cookie Categories

1. **Essential**: Always enabled (authentication, security, basic functionality)
2. **Analytics**: Google Analytics, PostHog (optional)
3. **Marketing**: Google Ads, Facebook Pixel (optional)
4. **Personalization**: Hotjar, Intercom chat (optional)

## 📋 Usage Examples

### Basic Role Protection

```tsx
import { RoleGate } from '@/components/rbac/RoleGate';

// Only providers and admins can see this content
<RoleGate allowedRoles={['provider', 'admin']}>
  <ProviderDashboard />
</RoleGate>
```

### Subscription-Based Access

```tsx
// Requires provider role + professional subscription
<RoleGate 
  allowedRoles={['provider']} 
  requireSubscription={['professional', 'enterprise']}
>
  <AdvancedAnalytics />
</RoleGate>
```

### Convenience Components

```tsx
import { ProviderGate, AdminGate, AuthGate, PremiumGate } from '@/components/rbac/RoleGate';

<ProviderGate>
  <ProviderTools />
</ProviderGate>

<AdminGate>
  <AdminPanel />
</AdminGate>

<AuthGate>
  <UserDashboard />
</AuthGate>

<PremiumGate>
  <PremiumFeatures />
</PremiumGate>
```

### Server-Side Usage

```tsx
import { getCurrentUser, requireRole } from '@/lib/auth/session';

// In Server Components
export default async function ProviderPage() {
  await requireRole(['provider', 'admin']);
  // Page content here
}

// Or with user data
export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');
  // Use user data
}
```

### Cookie Consent Integration

```tsx
import { CookieConsent } from '@/components/consent/CookieConsent';

<CookieConsent 
  user={user}
  onConsentChange={(settings) => {
    console.log('Consent updated:', settings);
  }}
/>
```

## 🛣️ Route Protection

The middleware automatically protects routes based on configuration:

```typescript
const PROTECTED_ROUTES = {
  '/dashboard': ['consumer', 'provider', 'admin'],
  '/provider': ['provider', 'admin'],
  '/admin': ['admin'],
  '/subscription': ['provider', 'admin'],
};
```

### Public Routes

These routes are accessible to all users:
- `/` (home)
- `/browse` (service browsing)
- `/auth/*` (authentication pages)
- `/example-rbac` (demo page)

## 🎨 UI/UX Features

### Access Denied Fallbacks

1. **Guest Users**: Sign in/sign up prompts with clear CTAs
2. **Role Restrictions**: Upgrade prompts with role-specific guidance
3. **Subscription Limits**: Subscription upgrade prompts with plan recommendations

### Responsive Design

- Mobile-first approach with collapsible navigation
- Touch-friendly consent interfaces
- Accessible keyboard navigation throughout

### Animations

- Smooth fade-in effects for consent banner
- Hover states and micro-interactions
- Loading states during consent updates

## ⚡ Performance Optimizations

### Server Components First

- Most components render server-side for better performance
- Client components only where interactivity is required
- Streaming support for faster page loads

### Efficient Script Loading

- Third-party scripts load only after consent
- Duplicate script prevention
- Clean removal of revoked consent scripts

### Caching Strategy

- Server-side session caching
- Optimized database queries
- Minimal client-side JavaScript

## 🔧 Configuration

### Environment Variables

```env
# Authentication (optional - for enhanced features)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Third-party services (loaded based on consent)
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-pixel-id
NEXT_PUBLIC_GOOGLE_ADS_ID=your-ads-id
NEXT_PUBLIC_INTERCOM_APP_ID=your-intercom-id
```

### Customization

#### Adding New Roles

1. Update the `UserRole` type in `types/rbac.ts`
2. Add permissions to `PERMISSIONS` constant
3. Update navigation items in `RoleAwareNavigation.tsx`
4. Add route protection rules in `middleware.ts`

#### Adding New Subscription Tiers

1. Update `SubscriptionTier` type
2. Add tier access rules to `SUBSCRIPTION_ACCESS`
3. Update UI components for new tier display

## 🧪 Testing

### Demo Page

Visit `/example-rbac` to see the system in action:
- Role-specific content visibility
- Subscription tier restrictions
- Access denied fallbacks
- Consent management

### Test Scenarios

1. **Guest User**: Can only access public content
2. **Consumer**: Can book services, manage bookings
3. **Provider**: Can manage listings, view earnings
4. **Admin**: Full platform access
5. **Subscription Tiers**: Premium features locked behind subscriptions

## 🚀 Deployment Considerations

### Database Setup

Ensure your user table includes:
- `role` field with proper enum/string values
- `metadata` field for consent and subscription data
- Proper indexes for role-based queries

### Security

- All role checks happen server-side
- JWT tokens include role information
- Middleware validates every protected request
- CSRF protection enabled
- Input validation on all forms

### Monitoring

- Log consent changes for audit compliance
- Track role transitions and access attempts
- Monitor subscription tier usage
- Performance metrics for protected routes

## 📚 API Reference

### Core Functions

```typescript
// Permission checking
hasPermission(userRole: UserRole, permission: Permission): boolean
isRoleAllowed(userRole: UserRole, allowedRoles: UserRole[]): boolean
canAccessFeature(user: User, roles: UserRole[], permission?: Permission, subscription?: SubscriptionTier[]): boolean

// Session management
getCurrentUser(): Promise<User | null>
getCurrentUserRole(): Promise<UserRole>
requireAuth(): Promise<User>
requireRole(allowedRoles: UserRole[]): Promise<User>

// Consent management
getGuestConsent(): ConsentSettings | null
setGuestConsent(settings: ConsentSettings): void
getUserConsent(user: User): ConsentSettings
```

### API Endpoints

- `POST /api/user/consent` - Update user consent settings
- `GET /api/user/consent` - Get current consent settings

## 🎯 Best Practices

1. **Always use Server Components** for role checks when possible
2. **Validate permissions** on both client and server
3. **Provide clear feedback** for access restrictions
4. **Keep consent simple** but comprehensive
5. **Test thoroughly** across all roles and tiers
6. **Monitor compliance** with GDPR requirements
7. **Update gracefully** when roles change

## 🔮 Future Enhancements

- Dynamic permission assignment
- Time-based role restrictions
- Advanced audit logging
- A/B testing for consent flows
- Integration with external identity providers
- Advanced subscription management

---

This RBAC system provides a solid foundation for secure, scalable, and compliant access control in the Loconomy platform while maintaining excellent user experience and developer productivity.