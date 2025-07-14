# Troubleshooting Guide

This guide helps you diagnose and resolve common issues when working with Loconomy. It covers development, deployment, and runtime problems with step-by-step solutions.

## 🚨 Quick Issue Resolution

### **Emergency Checklist**

1. **Check System Status**: [status.loconomy.com](https://status.loconomy.com)
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Check Service Dependencies**: Database, Redis, external APIs
4. **Review Recent Changes**: Git commits, deployments, config changes
5. **Check Error Logs**: Application, server, and service logs

---

## 🛠️ Development Issues

### **Installation & Setup Problems**

#### **Node.js Version Mismatch**

**Error Message:**
```
Error: This project requires Node.js version 18.0.0 or higher
```

**Solution:**
```bash
# Check current Node.js version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Or update using node version manager
n 18
```

#### **Package Installation Failures**

**Error Message:**
```
ERR_PNPM_PEER_DEP_ISSUES
```

**Solution:**
```bash
# Clear package cache
pnpm store prune

# Delete node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# Reinstall dependencies
pnpm install

# If still failing, use force flag
pnpm install --force
```

#### **TypeScript Configuration Issues**

**Error Message:**
```
Cannot find module '@/components/ui/Button' or its corresponding type declarations
```

**Solution:**
```bash
# Check tsconfig.json paths configuration
cat tsconfig.json | grep -A 5 "paths"

# Regenerate TypeScript declarations
pnpm tsc --noEmit

# Restart TypeScript server in VSCode
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### **Build & Compilation Issues**

#### **Next.js Build Failures**

**Error Message:**
```
Error: Build optimization failed
```

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Check for circular dependencies
pnpm run build 2>&1 | grep -i "circular"

# Build with detailed error output
pnpm build --debug

# Check bundle analyzer for issues
ANALYZE=true pnpm build
```

#### **CSS/Styling Issues**

**Error Message:**
```
Error: PostCSS plugin tailwindcss requires PostCSS 8
```

**Solution:**
```bash
# Update PostCSS and Tailwind
pnpm update postcss tailwindcss

# Check Tailwind config
npx tailwindcss init --check

# Regenerate CSS
pnpm dev
```

#### **Import/Module Resolution Issues**

**Error Message:**
```
Module not found: Can't resolve '@/lib/utils'
```

**Solution:**
```typescript
// Check tsconfig.json baseUrl and paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### **Development Server Issues**

#### **Port Already in Use**

**Error Message:**
```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

#### **Hot Reload Not Working**

**Solution:**
```bash
# Check if you're using WSL (Windows)
# Add to next.config.js:
module.exports = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

# Clear browser cache
# Restart development server
```

---

## 🗄️ Database Issues

### **Connection Problems**

#### **Database Connection Failed**

**Error Message:**
```
Error: Connection terminated unexpectedly
```

**Diagnosis Steps:**
```bash
# Test database connection
psql $DATABASE_URL

# Check database status
pg_isready -d $DATABASE_URL

# Verify connection string format
echo $DATABASE_URL
```

**Solution:**
```bash
# Update connection string
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Check firewall/security groups
# Verify database server is running
# Check SSL requirements
```

#### **Migration Issues**

**Error Message:**
```
Error: Migration failed to apply
```

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset

# Apply specific migration
npx prisma migrate deploy

# Generate client after migration
npx prisma generate
```

#### **Schema Drift**

**Error Message:**
```
Error: The database schema is not in sync
```

**Solution:**
```bash
# Check schema differences
npx prisma db pull

# Create new migration
npx prisma migrate dev --name fix_schema_drift

# Force reset (last resort)
npx prisma migrate reset --force
```

### **Performance Issues**

#### **Slow Query Performance**

**Diagnosis:**
```sql
-- Enable query logging in PostgreSQL
SHOW log_statement;
SHOW log_min_duration_statement;

-- Check slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

**Solution:**
```sql
-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_bookings_provider_date 
ON bookings (provider_id, scheduled_at);

-- Optimize queries with EXPLAIN
EXPLAIN ANALYZE SELECT * FROM providers WHERE location = $1;

-- Update table statistics
ANALYZE providers;
```

---

## 🔐 Authentication Issues

### **NextAuth.js Problems**

#### **Session Not Persisting**

**Error Message:**
```
Error: Session callback error
```

**Solution:**
```javascript
// Check NEXTAUTH_SECRET environment variable
// Ensure NEXTAUTH_URL is correct
// Verify cookie settings

// next-auth.config.js
export default {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}
```

#### **OAuth Provider Issues**

**Error Message:**
```
OAuthCallback error: invalid_grant
```

**Solution:**
```bash
# Check OAuth app configuration
# Verify redirect URLs match exactly
# Ensure client ID and secret are correct
# Check OAuth app permissions/scopes

# Debug OAuth flow
NEXTAUTH_DEBUG=true pnpm dev
```

#### **JWT Token Issues**

**Error Message:**
```
JsonWebTokenError: invalid signature
```

**Solution:**
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32

# Clear browser cookies and storage
# Restart application

# Check JWT configuration
const jwt = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  encode: async ({ secret, token }) => {
    return jsonwebtoken.sign(token, secret, { algorithm: 'HS256' })
  },
}
```

---

## 💳 Payment Issues

### **Stripe Integration Problems**

#### **Payment Failures**

**Error Message:**
```
StripeCardError: Your card was declined
```

**Diagnosis:**
```javascript
// Log Stripe webhook events
app.post('/api/webhooks/stripe', (req, res) => {
  const event = req.body;
  
  console.log('Stripe webhook:', {
    type: event.type,
    id: event.id,
    created: event.created
  });
  
  // Handle specific event types
  switch (event.type) {
    case 'payment_intent.payment_failed':
      console.error('Payment failed:', event.data.object);
      break;
  }
});
```

**Solution:**
```javascript
// Use test card numbers in development
const testCards = {
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  declined: '4000000000000002'
};

// Handle payment errors gracefully
try {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    metadata: { bookingId: 'booking_123' }
  });
} catch (error) {
  if (error.type === 'StripeCardError') {
    // Handle card errors
    console.error('Card error:', error.message);
  }
}
```

#### **Webhook Signature Verification**

**Error Message:**
```
Error: Invalid signature
```

**Solution:**
```javascript
// Verify webhook signature
const sig = req.headers['stripe-signature'];
let event;

try {
  event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
} catch (err) {
  console.error(`Webhook signature verification failed:`, err.message);
  return res.status(400).send(`Webhook Error: ${err.message}`);
}

// Check webhook endpoint URL in Stripe dashboard
// Ensure endpoint secret is correct
```

---

## 📧 Email & Notifications

### **SendGrid Issues**

#### **Email Delivery Failures**

**Error Message:**
```
Error: The from address does not match a verified Sender Identity
```

**Solution:**
```bash
# Verify sender email in SendGrid dashboard
# Check domain authentication
# Update from email in environment variables

SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Test email sending
curl -X "POST" "https://api.sendgrid.com/v3/mail/send" \
  -H "Authorization: Bearer $SENDGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{"to": [{"email": "test@example.com"}]}],
    "from": {"email": "noreply@yourdomain.com"},
    "subject": "Test Email",
    "content": [{"type": "text/plain", "value": "Test content"}]
  }'
```

#### **Rate Limiting Issues**

**Error Message:**
```
Error: Rate limit exceeded
```

**Solution:**
```javascript
// Implement email queuing
import Bull from 'bull';

const emailQueue = new Bull('email queue', {
  redis: { host: 'localhost', port: 6379 }
});

emailQueue.process(async (job) => {
  const { to, subject, content } = job.data;
  await sendEmail({ to, subject, content });
});

// Add delay between emails
emailQueue.add('send-email', emailData, {
  delay: 1000, // 1 second delay
  attempts: 3
});
```

---

## 🚀 Deployment Issues

### **Vercel Deployment Problems**

#### **Build Failures on Vercel**

**Error Message:**
```
Error: Command "pnpm build" exited with 1
```

**Solution:**
```bash
# Check build logs in Vercel dashboard
# Verify all environment variables are set
# Test build locally with production settings

NODE_ENV=production pnpm build

# Check for environment-specific issues
# Review build output for specific errors
```

#### **Function Timeout Issues**

**Error Message:**
```
Error: Function execution timed out
```

**Solution:**
```javascript
// Optimize API route performance
export const config = {
  maxDuration: 30, // Extend timeout to 30 seconds
}

// Implement proper error handling
export default async function handler(req, res) {
  try {
    const result = await processRequest(req);
    res.json(result);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### **Environment Variable Issues**

**Error Message:**
```
Error: Environment variable DATABASE_URL is not defined
```

**Solution:**
```bash
# Check environment variables in Vercel dashboard
# Ensure variables are set for correct environment (preview/production)
# Verify variable names match exactly

# Test locally with production environment
vercel env pull .env.local
pnpm dev
```

### **Docker Deployment Issues**

#### **Container Build Failures**

**Error Message:**
```
Error: Docker build failed at step X
```

**Solution:**
```dockerfile
# Optimize Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# ... rest of Dockerfile
```

---

## 🔍 Debugging Techniques

### **Logging & Monitoring**

#### **Application Logging**

```typescript
// Structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Add context to logs
logger.info('User action', {
  userId: '123',
  action: 'create_booking',
  metadata: { providerId: '456' }
});
```

#### **Error Tracking**

```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Custom error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }
  
  render() {
    // Error UI
  }
}
```

### **Performance Debugging**

#### **Database Query Analysis**

```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s

-- Analyze slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC;

-- Check table bloat
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### **Memory Usage Analysis**

```bash
# Check Node.js memory usage
node --inspect=0.0.0.0:9229 app.js

# Monitor memory in production
process.memoryUsage()
// {
//   rss: 4935680,
//   heapTotal: 1826816,
//   heapUsed: 650472,
//   external: 49879
// }

# Check for memory leaks
node --trace-gc app.js
```

---

## 📱 Browser-Specific Issues

### **Cross-Browser Compatibility**

#### **Safari Issues**

```css
/* Fix Safari-specific CSS issues */
.glass-effect {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari support */
}

.scroll-smooth {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* iOS smooth scrolling */
}
```

#### **Internet Explorer/Edge Legacy**

```javascript
// Polyfills for older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Feature detection
if (!window.fetch) {
  import('whatwg-fetch');
}

if (!window.IntersectionObserver) {
  import('intersection-observer');
}
```

### **Mobile-Specific Issues**

#### **iOS Viewport Issues**

```html
<!-- Fix iOS viewport issues -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<style>
  /* Handle safe area insets */
  .container {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
```

#### **Android Performance Issues**

```javascript
// Optimize for Android
const isAndroid = /Android/i.test(navigator.userAgent);

if (isAndroid) {
  // Disable expensive animations
  document.body.classList.add('android-optimizations');
}
```

---

## 🆘 Getting Help

### **Community Support**

- **Discord**: [#help channel](https://discord.gg/loconomy)
- **GitHub Issues**: [Report bugs](https://github.com/loconomy/loconomy/issues)
- **Stack Overflow**: Tag questions with `loconomy`
- **Community Forum**: [community.loconomy.com](https://community.loconomy.com)

### **Professional Support**

- **Technical Support**: [support@loconomy.com](mailto:support@loconomy.com)
- **Emergency Hotline**: +1-555-SUPPORT (24/7 for Enterprise customers)
- **Slack Connect**: Available for Enterprise customers

### **Useful Resources**

- **Documentation**: [docs.loconomy.com](https://docs.loconomy.com)
- **API Reference**: [API.md](API.md)
- **Architecture Guide**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📋 Issue Report Template

When reporting issues, please include:

```markdown
## Bug Report

**Environment:**
- OS: [e.g., macOS 14.0]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 119.0]
- Loconomy version: [e.g., 2.1.0]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Error Messages:**
```
Paste any error messages here
```

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Additional Context:**
Any other context about the problem here.
```

---

## 🔄 Regular Maintenance

### **Health Checks**

```bash
# Run health check script
#!/bin/bash

echo "🏥 Loconomy Health Check"
echo "========================"

# Check application status
curl -f http://localhost:3000/api/health || echo "❌ App health check failed"

# Check database connection
psql $DATABASE_URL -c "SELECT 1;" || echo "❌ Database connection failed"

# Check Redis connection
redis-cli ping || echo "❌ Redis connection failed"

# Check external services
curl -f https://api.stripe.com/v1/charges || echo "❌ Stripe API unreachable"

echo "✅ Health check completed"
```

### **Performance Monitoring**

```bash
# Monitor key metrics
#!/bin/bash

# CPU and memory usage
top -b -n1 | grep "Cpu\|Mem"

# Disk usage
df -h

# Network connections
netstat -tuln | grep :3000

# Process information
ps aux | grep node
```

---

*This troubleshooting guide is continuously updated. If you encounter an issue not covered here, please contribute by creating a pull request or reaching out to our support team.*