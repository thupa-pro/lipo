#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Loconomy Development Server (Optimized)...\n');

// Check for environment file
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local not found. Please copy .env.example to .env.local and configure your keys.\n');
}

// Development configuration tips
console.log('🔧 Development Configuration:');
console.log('   📍 Local URL: http://localhost:3000');
console.log('   🌐 Locale URLs: http://localhost:3000/en, http://localhost:3000/es');
console.log('   🔗 Auth: http://localhost:3000/en/auth/signin');
console.log('   🏠 Homepage: http://localhost:3000/en');
console.log('   📊 Dashboard: http://localhost:3000/en/dashboard');
console.log('   🛍️  Browse: http://localhost:3000/en/browse');
console.log('   🍪 Cookie Demo: http://localhost:3000/en/cookie-demo');
console.log('');

console.log('⚡ Optimizations Applied:');
console.log('   ✅ OpenTelemetry warnings suppressed');
console.log('   ✅ Sentry sampling reduced for development');
console.log('   ✅ Enhanced webpack configuration');
console.log('   ✅ Next.js telemetry disabled');
console.log('   ✅ App structure consolidated under [locale]');
console.log('');

console.log('🎯 Recent Structure Fixes:');
console.log('   ✅ Duplicate routes removed from root /app/');
console.log('   ✅ All user pages now under /app/[locale]/');
console.log('   ✅ Navigation updated for locale-aware routing');
console.log('   ✅ Clean internationalization structure');
console.log('');

// Start the development server with optimizations
try {
  console.log('🎉 Starting Next.js development server...\n');
  
  execSync('pnpm run dev', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096',
      NEXT_TELEMETRY_DISABLED: '1',
      SUPPRESS_OTEL_WARNINGS: 'true'
    }
  });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Check if port 3000 is available');
  console.log('   2. Ensure dependencies are installed: pnpm install');
  console.log('   3. Check .env.local configuration');
  console.log('   4. Review the error message above');
  process.exit(1);
}