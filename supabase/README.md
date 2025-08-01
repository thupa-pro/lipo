# Supabase Database Setup for Loconomy

This guide will help you set up the Supabase database with the required tables and security policies for the Loconomy application.

## Prerequisites

1. Supabase project created at [supabase.com](https://supabase.com)
2. Environment variables configured in `.env.local`
3. Supabase CLI installed (optional, for migrations)

## Quick Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to your project at [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click on your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the entire contents of `migrations/001_initial_schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the migration

### Option 2: Using Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link your project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Run migrations**
   ```bash
   supabase db push
   ```

## Database Schema Overview

The migration creates the following tables:

### Core Tables

1. **user_profiles** - User account information
   - Links Clerk users to Supabase profiles
   - Stores user role, verification status, metadata

2. **user_sessions** - Active session tracking
   - Tracks user sessions across devices
   - Links Clerk sessions to Supabase records

3. **security_events** - Security audit log
   - Logs all security-related events
   - Used for monitoring and compliance

4. **rate_limits** - Rate limiting data
   - Prevents abuse and brute force attacks
   - Tracks request counts per IP/user

### Business Tables

5. **provider_profiles** - Provider-specific data
   - Business information, services, ratings
   - Verification and compliance data

6. **services** - Available services
   - Service descriptions, pricing, categories
   - Linked to provider profiles

7. **bookings** - Service bookings
   - Customer-provider transactions
   - Payment and scheduling information

8. **reviews** - Customer reviews
   - Ratings and feedback
   - Linked to completed bookings

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Service role has full access for server operations

### Data Encryption
- Sensitive data encrypted at rest
- All connections use TLS 1.3
- JWT tokens for authentication

### Audit Logging
- All security events logged
- Failed login attempts tracked
- Suspicious activity detection

## Configuration Verification

After running the migration, verify the setup:

1. **Check Tables Created**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

2. **Verify RLS Policies**
   ```sql
   SELECT schemaname, tablename, policyname, cmd, qual
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;
   ```

3. **Test User Profile Creation**
   ```sql
   SELECT * FROM user_profiles LIMIT 1;
   ```

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zjcdznphvvnkebibkame.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Best Practices

1. **Never expose service role key** on client-side
2. **Use anon key** for client-side operations
3. **Implement proper RLS policies** for all tables
4. **Regularly audit security events**
5. **Monitor database performance**

## Maintenance

### Automatic Cleanup
The database includes functions for automatic cleanup:

- `cleanup_expired_sessions()` - Removes expired sessions
- `cleanup_old_security_events()` - Removes old audit logs
- `cleanup_expired_rate_limits()` - Removes expired rate limits

### Manual Cleanup (Run periodically)
```sql
-- Clean up expired sessions
SELECT cleanup_expired_sessions();

-- Clean up old security events (keeps 90 days)
SELECT cleanup_old_security_events();

-- Clean up expired rate limits
SELECT cleanup_expired_rate_limits();
```

## Monitoring

Monitor these metrics regularly:

1. **Active Sessions**
   ```sql
   SELECT COUNT(*) FROM user_sessions WHERE is_active = true;
   ```

2. **Security Events (Last 24h)**
   ```sql
   SELECT event_type, COUNT(*) 
   FROM security_events 
   WHERE created_at > NOW() - INTERVAL '24 hours'
   GROUP BY event_type
   ORDER BY COUNT(*) DESC;
   ```

3. **High Severity Events**
   ```sql
   SELECT * FROM security_events 
   WHERE severity IN ('high', 'critical')
   AND created_at > NOW() - INTERVAL '7 days'
   ORDER BY created_at DESC;
   ```

## Troubleshooting

### Common Issues

1. **Migration Fails**
   - Check database permissions
   - Ensure no existing conflicting tables
   - Verify Supabase project is active

2. **RLS Blocking Queries**
   - Use service role for server operations
   - Check policy conditions
   - Verify user context is set

3. **Performance Issues**
   - Check indexes are created
   - Monitor query performance
   - Consider table partitioning for large datasets

### Support

For database-related issues:
1. Check Supabase documentation
2. Review security event logs
3. Contact Supabase support
4. Check application error logs

## Next Steps

After database setup:
1. Test authentication flows
2. Verify user profile creation
3. Test role-based access
4. Monitor security events
5. Set up regular maintenance tasks

Your Supabase database is now ready for production use with enterprise-grade security!
