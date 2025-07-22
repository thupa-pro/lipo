#!/bin/bash

# 🧹 Cleanup Duplicate Routes Script
# Removes duplicate directories from /app/ that now exist in /app/[locale]/

set -e

echo "🧹 Starting cleanup of duplicate app routes..."

# Create a backup first
if [ ! -d "backup/before-cleanup" ]; then
    echo "📦 Creating backup before cleanup..."
    mkdir -p backup/before-cleanup
    cp -r app backup/before-cleanup/
fi

# Function to safely remove directory if it exists in both places
cleanup_duplicate() {
    local dir_name="$1"
    local root_path="app/$dir_name"
    local locale_path="app/[locale]/$dir_name"
    
    if [ -d "$root_path" ] && [ -d "$locale_path" ]; then
        echo "  🗑️  Removing duplicate: $dir_name"
        rm -rf "$root_path"
    elif [ -d "$root_path" ] && [ ! -d "$locale_path" ]; then
        echo "  ⚠️  Warning: $dir_name only exists in root (not moved?)"
    elif [ ! -d "$root_path" ]; then
        echo "  ✅ $dir_name already cleaned up"
    fi
}

echo "🔄 Removing duplicate directories..."

# Clean up main feature directories
cleanup_duplicate "about"
cleanup_duplicate "accessibility"
cleanup_duplicate "admin"
cleanup_duplicate "analytics"
cleanup_duplicate "become-provider"
cleanup_duplicate "billing"
cleanup_duplicate "blog"
cleanup_duplicate "booking"
cleanup_duplicate "bookings"
cleanup_duplicate "browse"
cleanup_duplicate "careers"
cleanup_duplicate "chat"
cleanup_duplicate "community"
cleanup_duplicate "contact"
cleanup_duplicate "cookies"
cleanup_duplicate "customer"
cleanup_duplicate "customer-support"
cleanup_duplicate "dashboard"
cleanup_duplicate "feedback"
cleanup_duplicate "gdpr"
cleanup_duplicate "help"
cleanup_duplicate "messages"
cleanup_duplicate "notifications"
cleanup_duplicate "payments"
cleanup_duplicate "press"
cleanup_duplicate "privacy"
cleanup_duplicate "profile"
cleanup_duplicate "settings"
cleanup_duplicate "terms"
cleanup_duplicate "verification"

# Clean up provider directories
cleanup_duplicate "provider"
cleanup_duplicate "provider-app"
cleanup_duplicate "provider-resources"
cleanup_duplicate "provider-support"
cleanup_duplicate "provider-terms"

# Clean up feature-specific directories
cleanup_duplicate "ai-listing-generator"
cleanup_duplicate "funnel-optimization"
cleanup_duplicate "global-cities"
cleanup_duplicate "growth-engine"
cleanup_duplicate "how-it-works"
cleanup_duplicate "international-form"
cleanup_duplicate "investors"
cleanup_duplicate "monetization-engine"
cleanup_duplicate "multi-region"
cleanup_duplicate "my-bookings"
cleanup_duplicate "onboarding"
cleanup_duplicate "onboarding-assistant"
cleanup_duplicate "partnerships"
cleanup_duplicate "post-launch"
cleanup_duplicate "referrals-dashboard"
cleanup_duplicate "requests"
cleanup_duplicate "revolutionary-design"
cleanup_duplicate "revolutionary-features"
cleanup_duplicate "safety"
cleanup_duplicate "search"
cleanup_duplicate "simulator"
cleanup_duplicate "sitemap"
cleanup_duplicate "subscription"
cleanup_duplicate "success-stories"
cleanup_duplicate "training-certification"
cleanup_duplicate "ui-evolution"

# Clean up auth directories (keeping them in locale structure)
cleanup_duplicate "auth"

echo "✅ Cleanup completed!"

# Show remaining structure
echo ""
echo "📊 Remaining app structure:"
echo "Root app directories:"
ls -la app/ | grep "^d" | grep -v "\[locale\]" | grep -v "api" | head -10

echo ""
echo "Locale app directories:"
ls -la app/[locale]/ | grep "^d" | head -10

echo ""
echo "🎯 Structure is now clean and internationalization-ready!"
echo "   • All user-facing pages in /app/[locale]/"
echo "   • API routes remain in /app/api/"
echo "   • Root files (layout, globals.css, etc.) preserved"