# Clerk Authentication Setup Guide

This guide explains how to set up Clerk authentication in your Loconomy application with Google OAuth support.

## Prerequisites

1. A Clerk account at [clerk.com](https://clerk.com)
2. A Google Cloud Console project for OAuth
3. The Loconomy application running locally or deployed

## Step 1: Create a Clerk Application

1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Click "Create Application"
3. Choose your application name (e.g., "Loconomy")
4. Select the authentication providers you want (Email, Phone, Google, GitHub)
5. Click "Create Application"

## Step 2: Get Your Clerk Keys

1. In your Clerk dashboard, go to "API Keys"
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Update Environment Variables

Update your `.env.local` file with your actual Clerk keys:

```env
# Replace the placeholder values with your actual Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# For webhook support (optional but recommended)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 4: Configure Google OAuth

### 4.1 Set up Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up the OAuth consent screen
6. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: Add your Clerk OAuth redirect URL

### 4.2 Configure Google OAuth in Clerk

1. In your Clerk dashboard, go to "User & Authentication" → "Social Providers"
2. Click "Enable" next to Google
3. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Save the configuration

### 4.3 Set Redirect URLs

In your Google Cloud Console OAuth settings, add these redirect URLs:
- For development: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
- For production: `https://your-production-clerk-domain.clerk.accounts.dev/v1/oauth_callback`

## Step 5: Configure Webhooks (Optional but Recommended)

Webhooks allow Clerk to sync user data with your application database.

### 5.1 Create Webhook Endpoint in Clerk

1. In Clerk dashboard, go to "Webhooks"
2. Click "Add Endpoint"
3. Set the endpoint URL:
   - Development: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - Production: `https://your-domain.com/api/webhooks/clerk`
4. Select events to listen for:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the webhook secret and add it to your `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### 5.2 Test Webhook (Development)

If developing locally, use ngrok to expose your local server:

```bash
# Install ngrok if you haven't already
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL for your webhook endpoint
```

## Step 6: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/signin` and `/auth/signup`

3. Test the following:
   - Email/password sign up
   - Email/password sign in
   - Google OAuth sign up
   - Google OAuth sign in
   - User data sync via webhooks

## Features Included

### ✅ Custom UI with Clerk Backend
- Beautiful custom authentication pages
- Clerk handles authentication logic
- Same UI experience as before

### ✅ Google OAuth Integration
- One-click Google sign in/up
- Seamless OAuth flow
- Automatic account creation

### ✅ Database Sync
- Webhook integration for user data sync
- Automatic user profile creation
- Role-based user metadata

### ✅ Security Features
- Protected routes via middleware
- Session management
- CSRF protection
- Rate limiting (existing)

## Troubleshooting

### Common Issues

1. **"Invalid Publishable Key"**
   - Ensure your publishable key is correct
   - Check that it starts with `pk_test_` or `pk_live_`
   - Verify the key is set in `.env.local`

2. **Google OAuth Not Working**
   - Check redirect URLs in Google Cloud Console
   - Verify Google OAuth is enabled in Clerk
   - Ensure Google credentials are correct

3. **Webhook Not Receiving Events**
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Ensure selected events match your needs

4. **Users Not Syncing to Database**
   - Check webhook endpoint logs
   - Verify database connection
   - Ensure Prisma schema is up to date

### Debugging Tips

1. Check browser developer tools for error messages
2. Review Clerk dashboard logs
3. Monitor webhook endpoint logs
4. Verify environment variables are loaded correctly

## Security Best Practices

1. **Environment Variables**
   - Never commit actual keys to version control
   - Use different keys for development and production
   - Rotate keys regularly

2. **Webhook Security**
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Implement proper error handling

3. **User Data**
   - Follow GDPR compliance for EU users
   - Implement proper data retention policies
   - Secure user metadata appropriately

## Production Deployment

1. **Environment Setup**
   - Use production Clerk keys
   - Configure production webhook URLs
   - Set up proper error monitoring

2. **Database Migration**
   - Run database migrations
   - Verify user data sync
   - Test authentication flows

3. **Monitoring**
   - Monitor authentication success rates
   - Track webhook delivery
   - Set up alerts for authentication failures

## Support

For additional help:
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Community](https://clerk.com/community)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

## Quick Start Checklist

- [ ] Create Clerk application
- [ ] Get Clerk API keys
- [ ] Update `.env.local` with actual keys
- [ ] Set up Google OAuth in Google Cloud Console
- [ ] Configure Google OAuth in Clerk
- [ ] Set up webhooks (optional)
- [ ] Test authentication flows
- [ ] Deploy to production

Once completed, your application will have secure, scalable authentication with Google OAuth support while maintaining the beautiful custom UI.