#!/usr/bin/env node

/**
 * 🚀 Loconomy Development Startup Script
 * Optimized development experience with helpful feedback
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Loconomy Development Server...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local not found. Please copy .env.example to .env.local and configure your keys.\n');
}

// Display helpful development information
console.log('🔧 Development Configuration:');
console.log('   📍 Local URL: http://localhost:3000');
console.log('   🌐 Network URL: Check terminal output above');
console.log('   🔄 Hot Reload: Enabled');
console.log('   📊 Telemetry: Disabled for privacy');
console.log('   🛡️  Sentry: Disabled in development (reduces noise)');
console.log('   ⚡ OpenTelemetry: Warnings suppressed');
console.log('');

console.log('🎯 Quick Links:');
console.log('   🏠 Homepage: http://localhost:3000/en');
console.log('   🔐 Sign In: http://localhost:3000/en/auth/signin');
console.log('   📝 Sign Up: http://localhost:3000/en/auth/signup');
console.log('   🌟 Landing: http://localhost:3000/en/landing');
console.log('');

console.log('💡 Development Tips:');
console.log('   • OpenTelemetry warnings are suppressed (normal behavior)');
console.log('   • Auth pages work without real Clerk keys (mock data)');
console.log('   • Build warnings about prerendering are expected');
console.log('   • Use Ctrl+C to stop the server');
console.log('');

console.log('🔧 Starting Next.js development server...\n');

// Start the development server with optimized settings
try {
  execSync('pnpm run dev', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
  process.exit(1);
}