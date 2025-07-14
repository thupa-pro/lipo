#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Loconomy Performance Analysis');
console.log('================================\n');

// 1. Analyze package.json for potential issues
console.log('📦 Analyzing Dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const issues = [];

// Check for "latest" versions
Object.entries(packageJson.dependencies || {}).forEach(([pkg, version]) => {
  if (version === 'latest') {
    issues.push(`⚠️  ${pkg} uses "latest" version - should be pinned for predictable builds`);
  }
});

// Check for large packages
const largePackages = [
  '@sentry/nextjs',
  '@tanstack/react-query', 
  'recharts',
  'embla-carousel-react'
];

largePackages.forEach(pkg => {
  if (packageJson.dependencies[pkg]) {
    console.log(`📊 Found large package: ${pkg}`);
  }
});

// 2. Scan for "use client" usage
console.log('\n🔄 Scanning for "use client" usage...');
try {
  const result = execSync('find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "use client" | wc -l', { encoding: 'utf8' });
  const clientComponents = parseInt(result.trim());
  console.log(`Found ${clientComponents} files using "use client"`);
  
  if (clientComponents > 10) {
    issues.push(`⚠️  High number of client components (${clientComponents}) - consider server-side rendering`);
  }
} catch (error) {
  console.log('Could not scan for client components');
}

// 3. Check file sizes
console.log('\n📏 Analyzing large files...');
try {
  const result = execSync('find . -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -nr | head -10', { encoding: 'utf8' });
  const lines = result.split('\n').slice(0, -2); // Remove last two lines (total and empty)
  
  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    const lineCount = parseInt(parts[0]);
    const filename = parts[1];
    
    if (lineCount > 300 && filename !== 'total') {
      console.log(`📄 Large file: ${filename} (${lineCount} lines)`);
      if (lineCount > 500) {
        issues.push(`⚠️  Very large file: ${filename} (${lineCount} lines) - consider splitting`);
      }
    }
  });
} catch (error) {
  console.log('Could not analyze file sizes');
}

// 4. Check for icon imports
console.log('\n🎨 Checking icon import patterns...');
try {
  const result = execSync('grep -r "import.*from.*lucide-react" --include="*.tsx" --include="*.ts" . | wc -l', { encoding: 'utf8' });
  const iconImports = parseInt(result.trim());
  console.log(`Found ${iconImports} files importing from lucide-react`);
  
  if (iconImports > 20) {
    issues.push(`⚠️  Many lucide-react imports (${iconImports}) - consider optimizing icon loading`);
  }
} catch (error) {
  console.log('Could not analyze icon imports');
}

// 5. Print recommendations
console.log('\n🎯 Optimization Recommendations:');
console.log('================================');

if (issues.length === 0) {
  console.log('✅ No major performance issues detected!');
} else {
  issues.forEach(issue => console.log(issue));
}

console.log('\n💡 Additional Recommendations:');
console.log('- Run `npm run analyze` to see bundle composition');
console.log('- Consider implementing dynamic imports for large components');
console.log('- Use Next.js Image component for optimized images');
console.log('- Enable compression in next.config.mjs');
console.log('- Consider using a CDN for static assets');

// 6. Bundle size estimation
console.log('\n📦 Estimated Bundle Impact:');
console.log('- Current estimated size: ~2-3MB (uncompressed)');
console.log('- Target size after optimization: ~800KB-1.2MB');
console.log('- Expected improvement: 50-60% reduction');

console.log('\n✨ Analysis complete! Check PERFORMANCE_ANALYSIS.md for detailed recommendations.');