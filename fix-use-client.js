#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files that need fixing based on the agent search
const filesToFix = [
  // App pages
  'app/[locale]/page-enhanced.tsx',
  'app/[locale]/provider-terms/page.tsx',
  'app/[locale]/revolutionary-features/page.tsx',
  'app/[locale]/auth/signin/page.tsx',
  'app/[locale]/auth/loading/page.tsx',
  'app/[locale]/auth/signup/page.tsx',
  'app/[locale]/auth/oauth-callback/page.tsx',
  'app/[locale]/gdpr/page.tsx',
  'app/[locale]/chat/page.tsx',
  'app/[locale]/post-launch/page.tsx',
  'app/[locale]/settings/page.tsx',
  'app/[locale]/success-stories/page.tsx',
  'app/[locale]/onboarding/page.tsx',
  'app/[locale]/provider/listings/new/page.tsx',
  'app/[locale]/provider/availability/page.tsx',
  'app/[locale]/provider/calendar/page.tsx',
  'app/[locale]/provider/reports/page.tsx',
  'app/[locale]/provider/page.tsx',
  'app/[locale]/investors/page.tsx',
  'app/[locale]/landing/page.tsx',
  'app/[locale]/accessibility-performance/page.tsx',
  'app/[locale]/customer-support/page.tsx',
  'app/[locale]/browse/page.tsx',
  'app/[locale]/bookings/page.tsx',
  'app/[locale]/training-certification/page.tsx',
  'app/[locale]/global-cities/page.tsx',
  'app/[locale]/provider-app/page.tsx',
  'app/[locale]/provider-support/page.tsx',
  'app/[locale]/requests/page.tsx',
  'app/[locale]/sitemap/page.tsx',
  'app/[locale]/safety/page.tsx',
  'app/[locale]/polish/page.tsx',
  'app/[locale]/booking/enhanced-page.tsx',
  'app/[locale]/booking/[serviceId]/page.tsx',
  'app/[locale]/booking/page.tsx',
  'app/[locale]/cookies/page.tsx',
  'app/[locale]/not-found-enhanced.tsx',
  'app/[locale]/community/page.tsx',
  'app/[locale]/partnerships/page.tsx',
  'app/[locale]/revolutionary-design/page.tsx',
  'app/[locale]/customer/dashboard/page.tsx',
  'app/[locale]/customer/page.tsx',
  'app/[locale]/providers/[id]/page.tsx',
  'app/[locale]/admin/growth-analytics/page.tsx',
  'app/[locale]/admin/system-health-logs/page.tsx',
  'app/[locale]/admin/service-job-management/page.tsx',
  'app/[locale]/admin/financial-overview/page.tsx',
  'app/[locale]/admin/user-management/page.tsx',
  'app/[locale]/admin/content-moderation/page.tsx',
  'app/[locale]/provider-resources/page.tsx',
  'app/[locale]/subscription/success/page.tsx',
  'app/[locale]/become-provider/page.tsx',
  'app/[locale]/press/page.tsx',
  'app/[locale]/multi-region/page.tsx',
  'app/[locale]/ui-evolution/page.tsx',
  'app/[locale]/billing/page.tsx',
  'app/[locale]/funnel-optimization/page.tsx',
  'app/[locale]/messages/page.tsx',
  'app/[locale]/blog/page.tsx',
  'app/[locale]/careers/page.tsx',
  
  // Components
  'components/ai/AIChat.tsx',
  'components/footer.tsx',
  'components/theme-provider.tsx',
  'components/subscription/SubscriptionDashboard.tsx',
  'components/subscription/SubscriptionPlans.tsx',
  'components/analytics-dashboard.tsx',
  'components/billing/BillingHistory.tsx',
  'components/billing/PaymentMethods.tsx',
  'components/billing/BillingSettings.tsx',
  'components/billing/SubscriptionPlans.tsx',
  'components/billing/StripeSubscriptionManager.tsx',
  'components/billing/UsageMetrics.tsx',
  'components/monetization-engine.tsx',
  'components/messages/chat-bubble.tsx',
  'components/verification/VerificationStatusIndicator.tsx',
  'components/health-check.tsx',
  'components/smart-form-autofill.tsx',
  'components/onboarding-flow.tsx',
  'components/notification-system.tsx',
  'components/provider-reputation-scorecard.tsx',
  'components/ui/logo.tsx'
];

function fixUseClientDirective(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Check if this matches our problematic pattern
    if (lines.length >= 2 && 
        lines[0].includes('import') && 
        lines[0].includes('@/lib/icons/optimized-icons') &&
        (lines[1] === '"use client";' || lines[1] === "'use client';")) {
      
      // Move "use client" to the top
      const useClientLine = lines[1];
      const importLine = lines[0];
      
      // Create new content with use client first
      const newLines = [useClientLine, '', importLine, ...lines.slice(2)];
      const newContent = newLines.join('\n');
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No fix needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Starting to fix "use client" directive placement...\n');

let fixedCount = 0;
let totalFiles = filesToFix.length;

for (const file of filesToFix) {
  if (fixUseClientDirective(file)) {
    fixedCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Total files processed: ${totalFiles}`);
console.log(`   Files fixed: ${fixedCount}`);
console.log(`   Files skipped: ${totalFiles - fixedCount}`);
console.log('\n✨ Done!');
