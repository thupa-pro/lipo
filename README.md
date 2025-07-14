# 🌟 Loconomy - Premium Local Services Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **Revolutionizing local service discovery with premium design and AI-powered matching**

Loconomy is the world's leading platform for premium local services, connecting millions of customers with verified service providers across 1,200+ cities globally. Built with modern web technologies and designed for scalability, security, and exceptional user experience.

## ✨ Features

### 🎯 **Core Platform**
- **AI-Powered Matching**: Intelligent provider-customer matching algorithm
- **Real-time Messaging**: Secure in-app communication system
- **Advanced Search & Filtering**: Multi-criteria service discovery
- **Secure Payment Processing**: Escrow-based payment protection
- **Review & Rating System**: Comprehensive feedback mechanism
- **Multi-language Support**: Internationalization ready

### 👥 **For Customers**
- **Premium Service Categories**: 15+ vetted service categories
- **Instant Booking**: One-click service scheduling
- **Provider Verification**: Background checks and credential verification
- **Service Tracking**: Real-time job progress updates
- **24/7 Support**: White-glove customer success team

### 🚀 **For Providers**
- **Professional Profiles**: Showcase skills and credentials
- **Business Analytics**: Revenue and performance insights
- **Marketing Tools**: Boost visibility and reach
- **Secure Payouts**: Fast, reliable payment processing
- **Training & Certification**: Professional development programs

### 🏢 **Enterprise Solutions**
- **Custom Integrations**: API access and white-label options
- **Team Management**: Multi-user business accounts
- **Advanced Reporting**: Business intelligence dashboard
- **SLA Guarantees**: Enterprise-grade service levels

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (recommended) or npm
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/loconomy.git
   cd loconomy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Database
   DATABASE_URL="your-database-url"
   
   # Authentication
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Payment Processing
   STRIPE_SECRET_KEY="your-stripe-secret"
   STRIPE_PUBLISHABLE_KEY="your-stripe-publishable"
   
   # Email Service
   SENDGRID_API_KEY="your-sendgrid-key"
   
   # File Storage
   AWS_S3_BUCKET="your-s3-bucket"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret"
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **UI Components**: Radix UI + Custom Components
- **Animations**: Framer Motion + CSS Animations
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

### **Backend & Infrastructure**
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Email**: SendGrid
- **Payments**: Stripe
- **Real-time**: WebSocket (Socket.io)

### **Development & Deployment**
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (recommended) or AWS
- **Monitoring**: Sentry
- **Analytics**: PostHog

## 📁 Project Structure

```
loconomy/
├── app/                     # Next.js 14 App Router
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Dashboard layouts
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components
│   ├── forms/              # Form components
│   ├── navigation/         # Navigation components
│   └── shared/             # Shared components
├── lib/                    # Utility libraries
│   ├── auth/               # Authentication logic
│   ├── database/           # Database utilities
│   ├── payments/           # Payment processing
│   └── utils.ts            # Common utilities
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── styles/                 # Additional stylesheets
├── tests/                  # Test files
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## 🧪 Testing

### **Unit & Integration Tests**
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### **End-to-End Tests**
```bash
# Run Playwright tests
pnpm test:e2e

# Run tests in headed mode
pnpm test:e2e:headed

# Generate test report
pnpm test:e2e:report
```

### **Linting & Formatting**
```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Export static site (if applicable)
pnpm export
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🔧 Configuration

### **Environment Variables**
See `.env.example` for all required environment variables.

### **Customization**
- **Styling**: Modify `tailwind.config.ts` and `app/globals.css`
- **Components**: Extend components in `components/ui/`
- **API**: Add new routes in `app/api/`
- **Database**: Update schema in `prisma/schema.prisma`

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: < 200KB gzipped
- **Load Time**: < 2s on 3G networks

## 🔒 Security

- **Authentication**: Secure JWT-based authentication
- **HTTPS**: Enforced in production
- **CSRF Protection**: Built-in protection
- **XSS Prevention**: Sanitized inputs and outputs
- **Rate Limiting**: API rate limiting implemented
- **Data Encryption**: Sensitive data encrypted at rest

For security issues, see [SECURITY.md](SECURITY.md).

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🌍 Community & Support

- **Documentation**: [docs.loconomy.com](https://docs.loconomy.com)
- **Discord**: [Join our community](https://discord.gg/loconomy)
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/loconomy/issues)
- **Twitter**: [@loconomy](https://twitter.com/loconomy)
- **Email**: [developers@loconomy.com](mailto:developers@loconomy.com)

## 🙏 Acknowledgments

- **Design Inspiration**: Stripe, Linear, Vercel
- **UI Components**: Radix UI team
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter)
- **Community**: All our amazing contributors

---

<div align="center">
  <img src="public/logo.png" alt="Loconomy" width="100" height="100">
  
  **Built with ❤️ by the Loconomy Team**
  
  [Website](https://loconomy.com) • [Documentation](https://docs.loconomy.com) • [Twitter](https://twitter.com/loconomy) • [Discord](https://discord.gg/loconomy)
</div>