#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Elite TypeScript Cleanup - Removing unused imports...\n');

// Common unused imports to remove
const commonUnusedImports = [
  'Link',
  'Clock',
  'Zap',
  'CheckCircle',
  'Shield',
  'Star',
  'MessageSquare',
  'Trash2',
  'User',
  'Target',
  'Progress',
  'LineChart',
  'Line'
];

// Function to clean up a TypeScript/React file
function cleanupFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Remove unused imports from lucide-react
    commonUnusedImports.forEach(importName => {
      // Pattern: import { ..., ImportName, ... } from "lucide-react"
      const importRegex = new RegExp(`(import\\s*{[^}]*),\\s*${importName}\\s*,([^}]*}\\s*from\\s*["']lucide-react["'])`, 'g');
      const newContent = content.replace(importRegex, '$1$2');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }

      // Pattern: import { ImportName, ... } from "lucide-react"
      const startImportRegex = new RegExp(`(import\\s*{\\s*)${importName}\\s*,([^}]*}\\s*from\\s*["']lucide-react["'])`, 'g');
      const newContent2 = content.replace(startImportRegex, '$1$2');
      if (newContent2 !== content) {
        content = newContent2;
        modified = true;
      }

      // Pattern: import { ..., ImportName } from "lucide-react"
      const endImportRegex = new RegExp(`(import\\s*{[^}]*),\\s*${importName}\\s*(}\\s*from\\s*["']lucide-react["'])`, 'g');
      const newContent3 = content.replace(endImportRegex, '$1$2');
      if (newContent3 !== content) {
        content = newContent3;
        modified = true;
      }

      // Pattern: import { ImportName } from "lucide-react" (single import)
      const singleImportRegex = new RegExp(`import\\s*{\\s*${importName}\\s*}\\s*from\\s*["']lucide-react["'];?\\s*\\n?`, 'g');
      const newContent4 = content.replace(singleImportRegex, '');
      if (newContent4 !== content) {
        content = newContent4;
        modified = true;
      }
    });

    // Clean up empty import lines
    content = content.replace(/import\s*{\s*}\s*from\s*["']lucide-react["'];\s*\n?/g, '');

    // Remove unused React imports if no JSX is present
    if (!content.includes('<') && !content.includes('React.')) {
      content = content.replace(/import\s+React\s*,?\s*{?[^}]*}?\s*from\s*["']react["'];\s*\n?/g, '');
      modified = true;
    }

    // Remove unused Link imports if no Link components are used
    if (!content.includes('<Link') && !content.includes('Link ')) {
      content = content.replace(/import\s+Link\s+from\s*["']next\/link["'];\s*\n?/g, '');
      modified = true;
    }

    // Clean up multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');

    if (modified && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find TypeScript files
function findTSFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findTSFiles(fullPath, files);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
console.log('🔍 Finding TypeScript files...');
const tsFiles = findTSFiles('./app').concat(findTSFiles('./components'));

console.log(`📊 Found ${tsFiles.length} TypeScript files`);
console.log('🧹 Starting cleanup...\n');

let cleanedCount = 0;
tsFiles.forEach(file => {
  if (cleanupFile(file)) {
    cleanedCount++;
  }
});

console.log(`\n✅ TypeScript Cleanup Complete!`);
console.log(`📊 Files processed: ${tsFiles.length}`);
console.log(`🧹 Files cleaned: ${cleanedCount}`);
console.log(`\n🎯 Unused imports removed successfully!`);