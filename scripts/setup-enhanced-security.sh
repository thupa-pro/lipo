#!/bin/bash

# Enhanced Security Setup Script for Loconomy Platform
# This script helps configure the new security features

set -e

echo "🛡️ Loconomy Enhanced Security Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to generate secure random string
generate_secret() {
    local length=${1:-64}
    openssl rand -hex $length 2>/dev/null || dd if=/dev/urandom bs=1 count=$length 2>/dev/null | xxd -p -c $length
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}Checking prerequisites...${NC}"

# Check for required tools
if ! command_exists openssl && ! command_exists dd; then
    echo -e "${RED}Error: Neither openssl nor dd found. Cannot generate secure secrets.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm && ! command_exists pnpm; then
    echo -e "${RED}Error: Neither npm nor pnpm found. Please install a package manager.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}Warning: .env.local already exists. Creating backup...${NC}"
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
fi

echo -e "${BLUE}Generating secure secrets...${NC}"

# Generate secrets
JWT_ACCESS_SECRET=$(generate_secret 32)
JWT_REFRESH_SECRET=$(generate_secret 32)
CSRF_SECRET=$(generate_secret 16)

echo -e "${GREEN}✓ Secure secrets generated${NC}"

# Create or update .env.local
echo -e "${BLUE}Updating environment configuration...${NC}"

cat > .env.local << EOF
# ============================================================================
# LOCONOMY ENHANCED SECURITY CONFIGURATION
# Generated on $(date)
# ============================================================================

# Enhanced Authentication Secrets
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
CSRF_SECRET=${CSRF_SECRET}

# Security Configuration
SESSION_TIMEOUT=86400000
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_ATTEMPTS=5

# API Gateway Configuration
API_TIMEOUT_MS=30000
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_RECOVERY_TIME_MS=60000

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1

# ============================================================================
# EXISTING CONFIGURATION (Update these with your actual values)
# ============================================================================

# Clerk Authentication (Replace with your actual keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Database (Replace with your actual connection strings)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Add your other existing environment variables below this line
# ...

EOF

echo -e "${GREEN}✓ Environment configuration updated${NC}"

# Install required dependencies if they're not already installed
echo -e "${BLUE}Checking dependencies...${NC}"

PACKAGE_MANAGER="npm"
if command_exists pnpm; then
    PACKAGE_MANAGER="pnpm"
fi

# Check if jsonwebtoken is installed
if ! node -e "require('jsonwebtoken')" 2>/dev/null; then
    echo -e "${YELLOW}Installing jsonwebtoken...${NC}"
    $PACKAGE_MANAGER install jsonwebtoken @types/jsonwebtoken
fi

echo -e "${GREEN}✓ Dependencies check completed${NC}"

# Create a simple test script
cat > scripts/test-security.js << 'EOF'
const crypto = require('crypto');

console.log('🔒 Security Configuration Test');
console.log('==============================');

// Test JWT secret generation
const testSecret = process.env.JWT_ACCESS_SECRET;
if (testSecret && testSecret.length >= 32) {
    console.log('✅ JWT secrets configured correctly');
} else {
    console.log('❌ JWT secrets not properly configured');
}

// Test CSRF secret
const csrfSecret = process.env.CSRF_SECRET;
if (csrfSecret && csrfSecret.length >= 16) {
    console.log('✅ CSRF secret configured correctly');
} else {
    console.log('❌ CSRF secret not properly configured');
}

console.log('\n📊 Configuration Summary:');
console.log(`- JWT Access Secret Length: ${testSecret ? testSecret.length : 'Not set'} characters`);
console.log(`- CSRF Secret Length: ${csrfSecret ? csrfSecret.length : 'Not set'} characters`);
console.log(`- Environment: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`- App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Not set'}`);
EOF

echo -e "${BLUE}Running security configuration test...${NC}"
node scripts/test-security.js

echo ""
echo -e "${GREEN}🎉 Enhanced Security Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update .env.local with your actual API keys and database credentials"
echo "2. Review the security configuration in the generated .env.local file"
echo "3. Test the authentication system with: npm run dev"
echo "4. Monitor security logs during development"
echo ""
echo -e "${BLUE}Important Security Notes:${NC}"
echo "• Keep your JWT secrets secure and never commit them to version control"
echo "• Rotate secrets regularly in production environments"
echo "• Monitor authentication logs for suspicious activity"
echo "• Ensure HTTPS is enabled in production"
echo ""
echo -e "${GREEN}Security Report: See ENHANCED_BACKEND_SECURITY_REPORT.md for details${NC}"
echo ""
echo -e "${YELLOW}For production deployment, ensure all environment variables are properly configured!${NC}"