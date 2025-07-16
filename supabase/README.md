# Loconomy Platform - Supabase Backend Setup

This directory contains all the necessary SQL scripts to set up a complete Supabase backend for the Loconomy local services platform.

## 🚀 Quick Start

### Prerequisites

- Supabase account and project created
- Supabase CLI installed (optional)
- Admin access to your Supabase project

### Environment Variables

Make sure these are set in your application:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📁 File Overview

| File                          | Purpose                              | Required    |
| ----------------------------- | ------------------------------------ | ----------- |
| `complete_database_setup.sql` | Main database schema with all tables | ✅ Yes      |
| `rls_policies.sql`            | Row-level security policies          | ✅ Yes      |
| `functions_and_triggers.sql`  | Automated functions and triggers     | ✅ Yes      |
| `seed_data.sql`               | Sample data for development          | 🟡 Optional |

## 🔧 Setup Instructions

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Run scripts in this exact order:**

#### Step 1: Database Schema

```sql
-- Copy and paste the entire content of complete_database_setup.sql
-- This creates all tables, types, enums, and indexes
```

#### Step 2: Security Policies

```sql
-- Copy and paste the entire content of rls_policies.sql
-- This sets up row-level security for all tables
```

#### Step 3: Functions & Triggers

```sql
-- Copy and paste the entire content of functions_and_triggers.sql
-- This adds automated functionality
```

#### Step 4: Seed Data (Optional)

```sql
-- Copy and paste the entire content of seed_data.sql
-- This adds sample data for development/testing
```

### Method 2: Using Supabase CLI

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Apply the scripts
psql -h your-db-host -U postgres -d postgres -f supabase/complete_database_setup.sql
psql -h your-db-host -U postgres -d postgres -f supabase/rls_policies.sql
psql -h your-db-host -U postgres -d postgres -f supabase/functions_and_triggers.sql
psql -h your-db-host -U postgres -d postgres -f supabase/seed_data.sql
```

## 🏗️ Database Architecture

### Core Features

#### 🔐 Authentication & Authorization

- **User Roles**: guest, consumer, provider, admin
- **RBAC System**: Role-based access control
- **Multi-tenant**: Provider workspaces
- **Row-level Security**: Comprehensive RLS policies

#### 🏪 Service Marketplace

- **Service Listings**: Categorized services with pricing
- **Booking System**: Request, confirm, track bookings
- **Reviews & Ratings**: Multi-dimensional rating system
- **Search & Discovery**: Location-based service search

#### 💳 Payments & Subscriptions

- **Stripe Integration**: Payment processing
- **Subscription Plans**: Tiered pricing model
- **Transaction History**: Complete payment tracking

#### 💬 Communication

- **Messaging System**: Real-time conversations
- **Notifications**: Multi-channel notification system
- **Activity Tracking**: User behavior analytics

### Database Tables (30+ tables)

<details>
<summary>Core Tables</summary>

- `user_roles` - User role management
- `user_preferences` - User settings and consent
- `tenants` - Multi-tenant workspaces
- `consumer_profiles` - Consumer information
- `provider_profiles` - Provider business profiles
</details>

<details>
<summary>Service Management</summary>

- `service_categories` - Service categorization
- `service_listings` - Provider service offerings
- `listing_images` - Service listing media
- `provider_availability` - Provider schedules
</details>

<details>
<summary>Booking System</summary>

- `bookings` - Service booking requests
- `booking_status_history` - Status change tracking
</details>

<details>
<summary>Payment System</summary>

- `subscription_plans` - Available plans
- `user_subscriptions` - User plan subscriptions
- `payments` - Payment transactions
</details>

<details>
<summary>Communication</summary>

- `conversations` - Message threads
- `messages` - Individual messages
- `notifications` - User notifications
</details>

<details>
<summary>Reviews & Analytics</summary>

- `reviews` - Service reviews and ratings
- `review_responses` - Provider responses
- `user_activities` - User behavior tracking
- `analytics_events` - Platform analytics
</details>

## 🔒 Security Features

### Row-Level Security (RLS)

- **Enabled on all tables**
- **User-based data isolation**
- **Role-based access control**
- **Multi-tenant data separation**

### Key Security Policies

- Users can only access their own data
- Providers can manage their own listings
- Admins have elevated access for moderation
- Public data is accessible to all users

### Data Protection

- **Personal data encryption** at rest
- **Secure API access** through RLS
- **Audit trails** for all changes
- **Content moderation** system

## ⚡ Automated Features

### Triggers & Functions

- **Auto user setup** on registration
- **Booking number generation**
- **Status change notifications**
- **Review notifications**
- **Timestamp management**
- **Search functionality**

### Example Automated Workflows

1. **New User Registration**

   ```
   User signs up → Auto-create user role → Create preferences → Start onboarding
   ```

2. **Booking Creation**

   ```
   Booking created → Generate booking number → Create conversation → Notify provider
   ```

3. **Status Changes**
   ```
   Status updated → Log history → Send notifications → Update timestamps
   ```

## 🧪 Development & Testing

### Sample Data

The `seed_data.sql` script includes:

- 15 service categories
- 4 subscription plans
- 1000 sample analytics events
- Utility functions for creating test data

### Creating Test Users

```sql
-- Use the provided utility function
SELECT create_sample_user('test@example.com', 'Test User', 'provider');
```

### Testing Features

1. **Authentication**: Test user creation and role assignment
2. **Bookings**: Create sample bookings and test status changes
3. **Reviews**: Test review creation and notifications
4. **Search**: Test service discovery functionality

## 📊 Performance Optimizations

### Indexes Created

- **User lookups**: user_id, role, tenant_id
- **Service search**: category, location, rating
- **Booking queries**: dates, status, participants
- **Full-text search**: service titles and descriptions
- **Analytics**: event tracking and user activities

### Query Optimization

- **Efficient joins** with proper foreign keys
- **Location-based search** with PostGIS
- **Pagination support** for large datasets
- **Caching-friendly** structure

## 🔧 Maintenance

### Regular Tasks

1. **Monitor performance** using Supabase dashboard
2. **Review security policies** regularly
3. **Update subscription limits** as needed
4. **Clean up old analytics data** periodically

### Backup Strategy

- **Automatic backups** via Supabase
- **Export critical data** regularly
- **Test restore procedures** periodically

## 🆘 Troubleshooting

### Common Issues

#### Setup Problems

```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

#### Permission Issues

```sql
-- Check user roles
SELECT * FROM user_roles WHERE user_id = 'your-user-id';

-- Test RLS policies
SELECT * FROM service_listings; -- Should only show accessible listings
```

### Support

- Check Supabase documentation
- Review error logs in Supabase dashboard
- Test queries in SQL editor
- Verify environment variables

## 🚀 Production Deployment

### Before Going Live

- [ ] Remove or modify seed data script
- [ ] Review and adjust RLS policies
- [ ] Set up monitoring and alerts
- [ ] Configure backup policies
- [ ] Test all critical user flows
- [ ] Verify Stripe integration
- [ ] Set up analytics tracking

### Post-Deployment

- [ ] Monitor performance metrics
- [ ] Set up log aggregation
- [ ] Configure alerting for errors
- [ ] Plan for data archival
- [ ] Regular security audits

---

## 📝 Additional Notes

This setup provides a production-ready foundation for a local services marketplace. The schema is designed to scale and can handle:

- **Thousands of users** across all roles
- **Complex service categorization**
- **Real-time messaging** and notifications
- **Advanced search** and filtering
- **Comprehensive analytics** tracking
- **Multi-tenant architecture** for providers
- **Subscription-based** revenue model

For questions or issues, refer to the Supabase documentation or create an issue in your project repository.
