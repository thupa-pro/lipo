#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Elite Import Syntax Fixer - Correcting syntax errors...\n');

// Function to fix import syntax in a file
function fixImportSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let modified = false;

    // Fix missing commas in import statements
    // Pattern: import { item1 \n item2, } - fix missing comma after item1
    content = content.replace(
      /(import\s*{[^}]*?)(\w+)\s*\n\s*(\w+[,\s]*)/g,
      (match, start, item1, rest) => {
        if (!item1.endsWith(',')) {
          modified = true;
          return `${start}${item1},\n  ${rest}`;
        }
        return match;
      }
    );

    // Fix missing commas between items on same line
    content = content.replace(
      /(import\s*{[^}]*?)(\w+)\s+(\w+)/g,
      (match, start, item1, item2) => {
        if (!item1.endsWith(',')) {
          modified = true;
          return `${start}${item1}, ${item2}`;
        }
        return match;
      }
    );

    // Clean up extra empty lines in imports
    content = content.replace(
      /(import\s*{[^}]*?)\n\s*\n\s*([^}]*})/g,
      '$1\n  $2'
    );

    // Fix trailing commas and spaces
    content = content.replace(
      /(import\s*{[^}]*?),\s*\n\s*}\s*from/g,
      '$1\n} from'
    );

    if (modified && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No syntax issues: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
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
console.log('🔧 Fixing import syntax...\n');

let fixedCount = 0;
tsFiles.forEach(file => {
  if (fixImportSyntax(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Import Syntax Fix Complete!`);
console.log(`📊 Files processed: ${tsFiles.length}`);
console.log(`🔧 Files fixed: ${fixedCount}`);
console.log(`\n🎯 All import syntax errors should be resolved!`);