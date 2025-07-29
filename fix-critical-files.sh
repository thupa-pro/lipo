#!/bin/bash

# Fix the most critical files for the app to run
critical_files=(
  "app/[locale]/page.tsx"
  "app/[locale]/landing/page.tsx" 
  "app/[locale]/browse/page.tsx"
  "app/[locale]/booking/page.tsx"
  "app/[locale]/providers/[id]/page.tsx"
  "app/[locale]/auth/signin/page.tsx"
  "app/[locale]/auth/signup/page.tsx"
  "components/ai/AIChat.tsx"
  "components/ui/logo.tsx"
)

echo "🔧 Fixing critical files..."

for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    # Check if file starts with import and has "use client" on line 2
    if head -2 "$file" | grep -q "^import.*optimized-icons"; then
      echo "  Fixing: $file"
      # Create temp file with "use client" first
      (echo '"use client";'; echo ''; tail -n +2 "$file") > "$file.tmp"
      mv "$file.tmp" "$file"
    else
      echo "  Skipping: $file (doesn't match pattern)"
    fi
  else
    echo "  Not found: $file"
  fi
done

echo "✅ Done fixing critical files"
