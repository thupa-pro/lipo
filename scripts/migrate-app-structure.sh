#!/bin/bash

# 🔧 App Structure Migration Script
# Moves pages from /app/ to /app/[locale]/ for proper internationalization

set -e

echo "🚀 Starting App Structure Migration..."

# Create necessary directories in [locale] structure
echo "📁 Creating directory structure..."

mkdir -p app/[locale]/provider/calendar
mkdir -p app/[locale]/provider/listings/new
mkdir -p app/[locale]/provider/reports
mkdir -p app/[locale]/provider/availability
mkdir -p app/[locale]/customer
mkdir -p app/[locale]/booking/[serviceId]
mkdir -p app/[locale]/admin/users
mkdir -p app/[locale]/admin/content-moderation
mkdir -p app/[locale]/admin/financial-overview
mkdir -p app/[locale]/admin/growth-analytics
mkdir -p app/[locale]/admin/service-job-management
mkdir -p app/[locale]/admin/system-health-logs
mkdir -p app/[locale]/admin/user-management
mkdir -p app/[locale]/billing
mkdir -p app/[locale]/feedback
mkdir -p app/[locale]/gdpr
mkdir -p app/[locale]/press
mkdir -p app/[locale]/multi-region
mkdir -p app/[locale]/notifications
mkdir -p app/[locale]/help
mkdir -p app/[locale]/ai-listing-generator
mkdir -p app/[locale]/analytics
mkdir -p app/[locale]/about
mkdir -p app/[locale]/accessibility
mkdir -p app/[locale]/become-provider
mkdir -p app/[locale]/blog
mkdir -p app/[locale]/bookings
mkdir -p app/[locale]/careers
mkdir -p app/[locale]/chat
mkdir -p app/[locale]/community
mkdir -p app/[locale]/cookies
mkdir -p app/[locale]/customer-support
mkdir -p app/[locale]/funnel-optimization
mkdir -p app/[locale]/global-cities
mkdir -p app/[locale]/growth-engine
mkdir -p app/[locale]/how-it-works
mkdir -p app/[locale]/international-form
mkdir -p app/[locale]/investors
mkdir -p app/[locale]/invite
mkdir -p app/[locale]/listings
mkdir -p app/[locale]/messages
mkdir -p app/[locale]/monetization-engine
mkdir -p app/[locale]/my-bookings
mkdir -p app/[locale]/onboarding
mkdir -p app/[locale]/onboarding-assistant
mkdir -p app/[locale]/partnerships
mkdir -p app/[locale]/payments
mkdir -p app/[locale]/post-launch
mkdir -p app/[locale]/provider-app
mkdir -p app/[locale]/provider-resources
mkdir -p app/[locale]/provider-support
mkdir -p app/[locale]/provider-terms
mkdir -p app/[locale]/requests
mkdir -p app/[locale]/revolutionary-design
mkdir -p app/[locale]/revolutionary-features
mkdir -p app/[locale]/safety
mkdir -p app/[locale]/search
mkdir -p app/[locale]/simulator
mkdir -p app/[locale]/sitemap
mkdir -p app/[locale]/subscription/success
mkdir -p app/[locale]/success-stories
mkdir -p app/[locale]/training-certification
mkdir -p app/[locale]/ui-evolution
mkdir -p app/[locale]/verification
mkdir -p app/[locale]/referrals-dashboard
mkdir -p app/[locale]/workspace

echo "🔄 Migrating unique pages..."

# Function to move page if it doesn't exist in locale and exists in root
migrate_page() {
    local src="app/$1/page.tsx"
    local dest="app/[locale]/$1/page.tsx"
    
    if [ -f "$src" ] && [ ! -f "$dest" ]; then
        echo "  ✅ Moving $1"
        cp "$src" "$dest"
    elif [ -f "$src" ] && [ -f "$dest" ]; then
        echo "  ⚠️  $1 exists in both locations - keeping locale version"
    elif [ ! -f "$src" ]; then
        echo "  ℹ️  $1 doesn't exist in root"
    fi
}

# Migrate provider pages
echo "📊 Migrating provider pages..."
migrate_page "provider/calendar"
migrate_page "provider/reports"
migrate_page "provider/listings/new"
migrate_page "provider/availability"

# Migrate admin pages
echo "🔧 Migrating admin pages..."
migrate_page "admin/content-moderation"
migrate_page "admin/financial-overview"
migrate_page "admin/growth-analytics"
migrate_page "admin/service-job-management"
migrate_page "admin/system-health-logs"
migrate_page "admin/user-management"

# Migrate customer pages
echo "👤 Migrating customer pages..."
migrate_page "customer/dashboard"

# Migrate booking pages
echo "📅 Migrating booking pages..."
if [ -f "app/booking/[serviceId]/page.tsx" ] && [ ! -f "app/[locale]/booking/[serviceId]/page.tsx" ]; then
    cp "app/booking/[serviceId]/page.tsx" "app/[locale]/booking/[serviceId]/page.tsx"
    echo "  ✅ Moved booking/[serviceId]"
fi

# Migrate core marketing/info pages
echo "📄 Migrating marketing pages..."
migrate_page "about"
migrate_page "accessibility" 
migrate_page "become-provider"
migrate_page "blog"
migrate_page "bookings"
migrate_page "careers"
migrate_page "chat"
migrate_page "community"
migrate_page "cookies"
migrate_page "customer-support"
migrate_page "feedback"
migrate_page "gdpr"
migrate_page "press"
migrate_page "multi-region"
migrate_page "notifications"
migrate_page "help"

# Migrate feature pages
echo "⚡ Migrating feature pages..."
migrate_page "ai-listing-generator"
migrate_page "analytics"
migrate_page "billing"
migrate_page "funnel-optimization"
migrate_page "global-cities"
migrate_page "growth-engine"
migrate_page "how-it-works"
migrate_page "international-form"
migrate_page "investors"
migrate_page "invite"
migrate_page "listings"
migrate_page "messages"
migrate_page "monetization-engine"
migrate_page "my-bookings"
migrate_page "onboarding"
migrate_page "onboarding-assistant"
migrate_page "partnerships"
migrate_page "payments"
migrate_page "post-launch"
migrate_page "provider-app"
migrate_page "provider-resources"
migrate_page "provider-support"
migrate_page "provider-terms"
migrate_page "requests"
migrate_page "revolutionary-design"
migrate_page "revolutionary-features"
migrate_page "safety"
migrate_page "search"
migrate_page "simulator"
migrate_page "sitemap"
migrate_page "success-stories"
migrate_page "training-certification"
migrate_page "ui-evolution"
migrate_page "verification"
migrate_page "referrals-dashboard"
migrate_page "workspace"

# Copy subscription success page
if [ -f "app/subscription/success/page.tsx" ] && [ ! -f "app/[locale]/subscription/success/page.tsx" ]; then
    cp "app/subscription/success/page.tsx" "app/[locale]/subscription/success/page.tsx"
    echo "  ✅ Moved subscription/success"
fi

echo "✅ Migration completed!"
echo "📝 Check APP_STRUCTURE_MIGRATION_PLAN.md for next steps"