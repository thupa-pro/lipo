#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Elite Routing Fix - Making all routes locale-aware...\n');

// Files that need routing fixes (excluding backups)
const targetFiles = [
  'app/[locale]/auth/signup/page.tsx',
  'app/[locale]/onboarding/page.tsx',
  'app/[locale]/become-provider/page.tsx',
  'app/[locale]/provider/listings/new/page.tsx',
  'app/[locale]/booking/[serviceId]/page.tsx',
  'hooks/useAuth.tsx'
];

// Common routing patterns to fix
const routingFixes = [
  {
    // Fix router.push("/dashboard") patterns
    search: /router\.push\(["'](\/dashboard)["']\)/g,
    replace: 'router.push(`/${locale}/dashboard`)'
  },
  {
    // Fix router.push("/auth/signin") patterns
    search: /router\.push\(["'](\/auth\/[^"']+)["']\)/g,
    replace: 'router.push(`/${locale}$1`)'
  },
  {
    // Fix router.push("/provider/dashboard") patterns
    search: /router\.push\(["'](\/provider\/[^"']+)["']\)/g,
    replace: 'router.push(`/${locale}$1`)'
  },
  {
    // Fix router.push("/customer/dashboard") patterns
    search: /router\.push\(["'](\/customer\/[^"']+)["']\)/g,
    replace: 'router.push(`/${locale}$1`)'
  },
  {
    // Fix router.push("/admin/dashboard") patterns
    search: /router\.push\(["'](\/admin\/[^"']+)["']\)/g,
    replace: 'router.push(`/${locale}$1`)'
  }
];

// Function to add locale imports to a file
function addLocaleImports(filePath, content) {
  // Check if useParams is already imported
  if (content.includes('useParams')) {
    return content;
  }

  // Add useParams to existing useRouter import
  const routerImportRegex = /import\s*{\s*([^}]*useRouter[^}]*)\s*}\s*from\s*["']next\/navigation["']/;
  const match = content.match(routerImportRegex);
  
  if (match) {
    const imports = match[1];
    if (!imports.includes('useParams')) {
      const newImports = imports.includes('useRouter') 
        ? imports.replace('useRouter', 'useRouter, useParams')
        : imports + ', useParams';
      
      content = content.replace(routerImportRegex, `import { ${newImports} } from "next/navigation"`);
    }
  }

  // Add locale parameter extraction
  const functionRegex = /export default function \w+\(\)\s*{/;
  const functionMatch = content.match(functionRegex);
  
  if (functionMatch && !content.includes('params?.locale')) {
    const insertPoint = content.indexOf(functionMatch[0]) + functionMatch[0].length;
    const beforeInsert = content.substring(0, insertPoint);
    const afterInsert = content.substring(insertPoint);
    
    // Find where to insert locale extraction (after router declaration)
    const routerDeclaration = afterInsert.match(/const router = useRouter\(\);/);
    if (routerDeclaration) {
      const routerIndex = afterInsert.indexOf(routerDeclaration[0]) + routerDeclaration[0].length;
      const localeCode = `
  const params = useParams();
  const locale = params?.locale as string || 'en';`;
      
      content = beforeInsert + afterInsert.substring(0, routerIndex) + localeCode + afterInsert.substring(routerIndex);
    }
  }

  return content;
}

// Function to fix routing in a file
function fixFileRouting(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add locale imports and parameters
    const originalContent = content;
    content = addLocaleImports(filePath, content);
    if (content !== originalContent) {
      modified = true;
    }

    // Apply routing fixes
    routingFixes.forEach(fix => {
      const newContent = content.replace(fix.search, fix.replace);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // Special handling for specific patterns
    if (content.includes('router.push("/auth/verify-email")')) {
      content = content.replace(/router\.push\(["']\/auth\/verify-email["']\)/g, 'router.push(`/${locale}/auth/verify-email`)');
      modified = true;
    }

    if (content.includes('router.push("/provider-resources")')) {
      content = content.replace(/router\.push\(["']\/provider-resources["']\)/g, 'router.push(`/${locale}/provider-resources`)');
      modified = true;
    }

    if (content.includes('router.push("/")')) {
      content = content.replace(/router\.push\(["']\/"["']\)/g, 'router.push(`/${locale}`)');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed routing in: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔧 Fixing critical routing issues...\n');

let totalFixed = 0;

targetFiles.forEach(filePath => {
  if (fixFileRouting(filePath)) {
    totalFixed++;
  }
});

console.log(`\n✅ Elite Routing Fix Complete!`);
console.log(`📊 Files processed: ${targetFiles.length}`);
console.log(`🔧 Files modified: ${totalFixed}`);
console.log(`\n🎯 All routes are now locale-aware!`);
console.log(`\n📝 Next: Test the application with: pnpm dev`);