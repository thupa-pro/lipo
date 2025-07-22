# Loconomy Database Schema Summary

## Overview

This document provides a comprehensive overview of the Loconomy hyperlocal services marketplace database schema. The schema is designed for production deployment on Supabase (PostgreSQL 13+) and supports a multi-tenant, AI-native platform with advanced features including RBAC, geolocation, billing, and real-time capabilities.

## Schema Statistics

- **Total Tables**: 42
- **Custom Types/Enums**: 15
- **Indexes**: 80+
- **Triggers**: 25+
- **Extensions**: PostGIS, pg_trgm, btree_gin, btree_gist

## Core Entity Relationships

### 1. User Management & Authentication

```
tenants (1) ←→ (N) users
users (1) ←→ (1) user_profiles
users (1) ←→ (N) user_sessions
users (1) ←→ (N) user_permissions
```

**Key Tables:**
- `tenants` - Multi-tenant organization management
- `users` - Core user accounts (integrates with Clerk)
- `user_profiles` - Extended profile information
- `user_sessions` - Session tracking for analytics
- `permissions` - Granular permission definitions
- `role_permissions` - Role-based permission mappings
- `user_permissions` - User-specific permission overrides

**Features:**
- ✅ Clerk authentication integration
- ✅ Multi-tenant architecture
- ✅ Granular RBAC system
- ✅ Session analytics
- ✅ Soft deletes with audit trails

### 2. Service Catalog & Listings

```
categories (tree structure)
    ↓
listings (N) ←→ (1) users [providers]
listings (N) ←→ (N) tags [many-to-many]
```

**Key Tables:**
- `categories` - Hierarchical service categories
- `tags` - Service discovery tags
- `listings` - Service offerings from providers
- `listing_tags` - Many-to-many tag associations

**Features:**
- ✅ Hierarchical categories with parent-child relationships
- ✅ Full-text search with tsvector
- ✅ Geographic coordinates for location-based services
- ✅ Rich media support (images, videos)
- ✅ SEO-friendly slugs and metadata
- ✅ Status management (draft, active, paused, suspended)

### 3. Booking & Scheduling

```
users [providers] (1) ←→ (N) provider_availability
users [providers] (1) ←→ (N) availability_overrides
    ↓
bookings (N) ←→ (1) listings
bookings (N) ←→ (1) users [customers]
bookings (N) ←→ (1) users [providers]
```

**Key Tables:**
- `provider_availability` - Weekly availability schedules
- `availability_overrides` - Special dates/holidays
- `bookings` - Service bookings between customers and providers

**Features:**
- ✅ Flexible availability management
- ✅ Multi-timezone support
- ✅ Booking status workflow
- ✅ Geographic service areas
- ✅ Pricing breakdown with fees
- ✅ Cancellation policies

### 4. Reviews & Ratings

```
bookings (1) ←→ (1) reviews
reviews (1) ←→ (N) review_votes
```

**Key Tables:**
- `reviews` - Customer reviews and ratings
- `review_votes` - Helpfulness voting system

**Features:**
- ✅ 5-star rating system
- ✅ Multi-dimensional ratings (quality, communication, timeliness)
- ✅ Review responses from providers
- ✅ Helpfulness voting
- ✅ Verified review status

### 5. Payments & Billing

```
users (1) ←→ (N) subscriptions
users (1) ←→ (N) payment_methods
users (1) ←→ (N) transactions
users (1) ←→ (N) invoices
invoices (1) ←→ (N) invoice_items
subscriptions (1) ←→ (N) usage_logs
```

**Key Tables:**
- `subscriptions` - User subscription plans
- `payment_methods` - Stored payment methods
- `transactions` - All financial transactions
- `invoices` - Invoice generation and tracking
- `invoice_items` - Line items for invoices
- `usage_logs` - Metered billing tracking

**Features:**
- ✅ Stripe integration with external IDs
- ✅ Subscription tier management
- ✅ Metered billing and usage tracking
- ✅ Multi-currency support
- ✅ Fee breakdown (platform, processing, taxes)
- ✅ Invoice generation with line items

### 6. Referrals & Rewards

```
referral_programs (1) ←→ (N) referral_codes
referral_codes (N) ←→ (1) users
referrals (N) ←→ (1) referral_codes
referrals (1) ←→ (N) referral_rewards
```

**Key Tables:**
- `referral_programs` - Referral campaign definitions
- `referral_codes` - User-specific referral codes
- `referrals` - Referral tracking
- `referral_rewards` - Reward distribution

**Features:**
- ✅ Multi-program support
- ✅ Configurable reward amounts
- ✅ Usage limits and expiration
- ✅ Completion tracking
- ✅ Multiple reward types (credit, cash, discount)

### 7. Communication

```
conversations (N) ←→ (N) users [participants array]
conversations (1) ←→ (N) messages
conversations (N) ←→ (1) bookings [optional]
```

**Key Tables:**
- `conversations` - Chat conversations
- `messages` - Individual messages
- `notifications` - System notifications

**Features:**
- ✅ Real-time messaging
- ✅ Group conversations
- ✅ Message attachments
- ✅ Read receipts
- ✅ Multi-channel notifications (in-app, email, SMS, push)

### 8. Geographic Data

```
regions (1) ←→ (N) cities
cities ←→ user_profiles [coordinates]
cities ←→ listings [coordinates]
```

**Key Tables:**
- `regions` - Regional markets and compliance
- `cities` - City-level geographic data

**Features:**
- ✅ PostGIS spatial data types
- ✅ Geographic search capabilities
- ✅ Multi-region compliance settings
- ✅ Service radius management
- ✅ Location-based matching

### 9. Analytics & Monitoring

```
users (1) ←→ (N) events
users (1) ←→ (N) audit_logs
system_logs [standalone]
```

**Key Tables:**
- `events` - User behavior analytics
- `audit_logs` - Security and compliance audit trail
- `system_logs` - Application logging

**Features:**
- ✅ Comprehensive event tracking
- ✅ Audit compliance (SOX, GDPR)
- ✅ Performance monitoring
- ✅ Security incident tracking

### 10. File Management

```
users (1) ←→ (N) file_uploads
file_uploads ←→ [any entity via metadata]
```

**Key Tables:**
- `file_uploads` - Centralized file management

**Features:**
- ✅ Multi-provider storage support
- ✅ File type classification
- ✅ Usage tracking
- ✅ Soft deletes
- ✅ Generic entity relationships

### 11. API & Integrations

```
users (1) ←→ (N) api_keys
users (1) ←→ (N) webhook_endpoints
webhook_endpoints (1) ←→ (N) webhook_deliveries
```

**Key Tables:**
- `api_keys` - API access management
- `webhook_endpoints` - Webhook subscriptions
- `webhook_deliveries` - Webhook delivery tracking

**Features:**
- ✅ API key management with scopes
- ✅ Rate limiting
- ✅ Webhook event subscriptions
- ✅ Delivery retry logic
- ✅ Success/failure tracking

### 12. Feature Management

```
feature_flags [global]
user_feature_flags (N) ←→ (1) users
user_feature_flags (N) ←→ (1) feature_flags
```

**Key Tables:**
- `feature_flags` - A/B testing and feature rollouts
- `user_feature_flags` - User-specific overrides

**Features:**
- ✅ A/B testing support
- ✅ Gradual feature rollouts
- ✅ User targeting rules
- ✅ Feature variants
- ✅ Override capabilities

## Data Types & Constraints

### Custom Enums

1. **User Management**
   - `user_role`: guest, customer, provider, admin, super_admin
   - `user_status`: active, inactive, suspended, pending_verification, banned
   - `verification_status`: pending, in_review, verified, rejected

2. **Business Logic**
   - `listing_status`: draft, active, paused, inactive, suspended
   - `booking_status`: pending, confirmed, in_progress, completed, cancelled, disputed, refunded
   - `pricing_type`: hourly, fixed, custom
   - `location_type`: on_site, remote, both

3. **Financial**
   - `subscription_status`: trialing, active, past_due, canceled, unpaid, incomplete, incomplete_expired
   - `payment_status`: pending, processing, completed, failed, cancelled, refunded
   - `transaction_type`: payment, payout, fee, refund, bonus, referral

4. **System**
   - `audit_action`: create, read, update, delete, login, logout, admin_action, payment, booking
   - `log_level`: debug, info, warning, error, critical

### Constraints & Validations

- **Rating Constraints**: All ratings between 1-5
- **Geographic Data**: PostGIS POINT types for coordinates
- **Unique Constraints**: Email, slug, confirmation codes
- **Foreign Keys**: Comprehensive referential integrity
- **Check Constraints**: Business rule validation

## Performance Optimizations

### Indexing Strategy

1. **Primary Access Patterns**
   - User lookups by Clerk ID, email
   - Geographic searches (PostGIS GIST indexes)
   - Full-text search (GIN indexes)
   - Time-based queries (created_at, booking_date)

2. **Composite Indexes**
   - Multi-column indexes for common query patterns
   - Covering indexes for frequently accessed data

3. **Specialized Indexes**
   - PostGIS spatial indexes for geolocation
   - GIN indexes for JSONB and array columns
   - Partial indexes for active/published content

### Search & Discovery

1. **Full-Text Search**
   - Automated tsvector updates via triggers
   - Weighted search (title > description > keywords)
   - Multilingual search support

2. **Geographic Search**
   - PostGIS for efficient radius searches
   - Spatial indexing for proximity queries
   - Service area polygon support

## Security Features

### Row Level Security (RLS)

- **User Data**: Users can only access their own data
- **Booking Data**: Only participants can view bookings
- **Listing Data**: Public read, owner write
- **Admin Data**: Role-based access control

### Audit & Compliance

- **Audit Logs**: All data changes tracked
- **Soft Deletes**: Data retention for compliance
- **Data Encryption**: Supabase handles encryption at rest
- **GDPR/CCPA**: Regional compliance settings

### API Security

- **API Keys**: Scoped access with rate limiting
- **Webhook Security**: Signature validation
- **Permission System**: Granular resource access

## Scalability Considerations

### Horizontal Scaling

- **UUID Primary Keys**: Distributed system friendly
- **Partitioning Ready**: High-volume tables can be partitioned
- **Read Replicas**: Read-heavy workloads can use replicas

### Data Growth Management

- **Archival Strategy**: Old data can be archived
- **Cleanup Procedures**: Automated cleanup of temporary data
- **Usage Monitoring**: Track storage and query performance

### Caching Strategy

- **Application Level**: Cache frequently accessed data
- **Database Level**: Utilize PostgreSQL query cache
- **CDN Integration**: Static asset caching

## Deployment Checklist

### Pre-Deployment

1. ✅ Run schema.sql on target database
2. ✅ Verify all extensions are available
3. ✅ Configure RLS policies for production
4. ✅ Set up proper backup schedules
5. ✅ Configure monitoring and alerting

### Post-Deployment

1. ✅ Run seed.sql for initial data
2. ✅ Verify all indexes are created
3. ✅ Test API key generation
4. ✅ Validate webhook functionality
5. ✅ Run performance tests

### Production Optimization

1. ✅ Monitor query performance
2. ✅ Adjust RLS policies as needed
3. ✅ Implement archival procedures
4. ✅ Set up automated backups
5. ✅ Configure connection pooling

## Integration Points

### External Services

1. **Clerk Authentication**
   - User creation and management
   - Session handling
   - Role synchronization

2. **Stripe Payments**
   - Subscription management
   - Payment processing
   - Webhook handling

3. **Supabase Features**
   - Real-time subscriptions
   - Edge functions
   - Storage buckets

### API Endpoints

- **GraphQL**: Auto-generated from schema
- **REST**: Standard CRUD operations
- **Real-time**: WebSocket subscriptions
- **Webhooks**: Event-driven integrations

## Maintenance & Monitoring

### Regular Tasks

1. **Index Maintenance**: Analyze and rebuild as needed
2. **Statistics Updates**: Keep query planner informed
3. **Cleanup Jobs**: Remove old sessions, logs
4. **Backup Verification**: Test restore procedures

### Monitoring Metrics

1. **Performance**: Query times, connection counts
2. **Growth**: Table sizes, index usage
3. **Security**: Failed login attempts, suspicious activity
4. **Business**: User growth, transaction volume

## Future Enhancements

### Planned Features

1. **AI/ML Integration**: Recommendation engine tables
2. **Advanced Analytics**: Time-series data storage
3. **Multi-Language**: Localized content tables
4. **Advanced Scheduling**: Recurring booking patterns

### Scaling Considerations

1. **Microservices**: Service-specific databases
2. **Event Sourcing**: Audit log evolution
3. **CQRS**: Read/write separation
4. **Time-Series**: Metrics and analytics storage

This schema provides a solid foundation for a production-ready hyperlocal services marketplace with enterprise-grade features, security, and scalability built in from day one.