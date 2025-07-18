# Deployment Guide

This guide covers deploying Loconomy to various platforms and environments. Choose the deployment method that best fits your needs.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/loconomy)

The fastest way to deploy Loconomy is using Vercel, which provides optimal Next.js hosting with automatic deployments.

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-org/loconomy)

Alternative deployment option with excellent CI/CD integration.

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YourTemplateId)

Full-stack deployment with database included.

---

## 📋 Prerequisites

### System Requirements

- **Node.js** 20.0.0 or higher (22.0+ recommended for optimal performance)
- **pnpm** 10.0.0 or higher (recommended) or npm 10+
- **Git** for version control
- **PostgreSQL** 15+ (for production with React 19 Server Components)
- **Redis** 7+ (for caching, sessions, and Next.js 15 cache)

### External Services

- **Database**: PostgreSQL (AWS RDS, Supabase, or self-hosted)
- **File Storage**: AWS S3 or compatible service
- **Email**: SendGrid, Mailgun, or SMTP service
- **Payments**: Stripe account with API keys
- **Monitoring**: Sentry account (optional)
- **Analytics**: PostHog or Google Analytics (optional)

---

## ⚙️ Environment Configuration

### Environment Variables

Create a `.env.production` file with the following variables:

```bash
# ===============================
# Application
# ===============================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# ===============================
# Database
# ===============================
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://username:password@host:port

# ===============================
# Authentication
# ===============================
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your-jwt-secret-key

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# ===============================
# Payment Processing
# ===============================
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# ===============================
# Email Service
# ===============================
EMAIL_PROVIDER=sendgrid # or mailgun, smtp
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@your-domain.com

# Alternative: SMTP
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# ===============================
# File Storage
# ===============================
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# ===============================
# External APIs
# ===============================
GOOGLE_MAPS_API_KEY=your-google-maps-key
GOOGLE_PLACES_API_KEY=your-google-places-key

# ===============================
# Monitoring & Analytics
# ===============================
SENTRY_DSN=your-sentry-dsn
POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# ===============================
# Security
# ===============================
RATE_LIMIT_WINDOW=3600000  # 1 hour in ms
RATE_LIMIT_MAX=1000        # requests per window
BCRYPT_ROUNDS=12
SESSION_MAX_AGE=2592000    # 30 days in seconds

# ===============================
# Feature Flags
# ===============================
FEATURE_CHAT=true
FEATURE_VIDEO_CALLS=true
FEATURE_PUSH_NOTIFICATIONS=true
FEATURE_ANALYTICS=true
```

### Securing Environment Variables

1. **Never commit** `.env` files to version control
2. **Use secure key generation**:
   ```bash
   # Generate secure random keys
   openssl rand -base64 32
   ```
3. **Rotate keys regularly** in production
4. **Use environment-specific configs** for staging/production

---

## 🌐 Vercel Deployment

### Automatic Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```bash
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

3. **Environment Variables**
   - Add all production environment variables in Vercel dashboard
   - Use Vercel's environment variable encryption

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VARIABLE_NAME production
```

### Custom Domain Setup

1. **Add Domain** in Vercel dashboard
2. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
3. **SSL Certificate** is automatically provisioned

---

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm install -g pnpm && pnpm build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: loconomy
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Build and Deploy

```bash
# Build Docker image
docker build -t loconomy:latest .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

---

## ☁️ AWS Deployment

### AWS App Runner

1. **Create App Runner Service**:
   ```bash
   aws apprunner create-service \
     --service-name loconomy-prod \
     --source-configuration '{
       "ImageRepository": {
         "ImageIdentifier": "your-ecr-repo:latest",
         "ImageConfiguration": {
           "Port": "3000"
         }
       }
     }'
   ```

2. **Environment Variables** via AWS Systems Manager Parameter Store

3. **Custom Domain** with Route 53 and Certificate Manager

### AWS ECS with Fargate

```yaml
# ecs-task-definition.json
{
  "family": "loconomy-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "loconomy-app",
      "image": "your-account.dkr.ecr.region.amazonaws.com/loconomy:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:ssm:region:account:parameter/loconomy/database-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/loconomy",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 🔧 Advanced Configuration

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Performance optimizations
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Image optimization
  images: {
    domains: ['your-s3-bucket.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
        })
      );
      return config;
    },
  }),
};

module.exports = nextConfig;
```

### Database Migrations

```bash
# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed database (if needed)
npx prisma db seed
```

### Health Checks

```javascript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        application: 'running',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      },
      { status: 503 }
    );
  }
}
```

---

## 📊 Monitoring & Observability

### Application Monitoring

```bash
# Add monitoring dependencies
pnpm add @sentry/nextjs @sentry/node

# Configure Sentry
# sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

- **Core Web Vitals**: Automatic Next.js reporting
- **API Response Times**: Custom metrics in API routes
- **Database Query Performance**: Prisma query logging
- **Error Tracking**: Sentry error reporting

### Log Management

```javascript
// lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'loconomy' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## 🔒 Security Considerations

### SSL/TLS Configuration

- **Always use HTTPS** in production
- **HSTS headers** for enhanced security
- **SSL certificate management** with automatic renewal

### Security Headers

```nginx
# nginx.conf security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Rate Limiting

```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  const identifier = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
      },
    });
  }

  return NextResponse.next();
}
```

---

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear build cache
   rm -rf .next
   pnpm build
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   npx prisma db pull
   ```

3. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   echo $DATABASE_URL
   ```

### Performance Optimization

- **Bundle Analysis**: Use `ANALYZE=true pnpm build`
- **Image Optimization**: Configure Next.js image domains
- **Caching Strategy**: Implement Redis caching
- **Database Optimization**: Add proper indexes

### Backup and Recovery

```bash
# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# File backup (S3)
aws s3 sync s3://your-bucket s3://your-backup-bucket
```

---

## 📞 Support

For deployment assistance:

- **Documentation**: [docs.loconomy.com/deployment](https://docs.loconomy.com/deployment)
- **GitHub Issues**: [Report deployment issues](https://github.com/loconomy/loconomy/issues)
- **Discord**: [#deployment channel](https://discord.gg/loconomy)
- **Email**: [devops@loconomy.com](mailto:devops@loconomy.com)

---

*This deployment guide is updated regularly. For the latest information, check our documentation website.*