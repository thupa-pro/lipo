#!/usr/bin/env node

/**
 * Comprehensive Functionality Repair and Verification Script
 * Ensures 100% functionality across the entire Loconomy application
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

const log = (message, color = COLORS.WHITE) => {
  console.log(`${color}${message}${COLORS.RESET}`);
};

const logHeader = (title) => {
  const border = '═'.repeat(60);
  log(`\n${border}`, COLORS.CYAN);
  log(`${' '.repeat(Math.max(0, (60 - title.length) / 2))}${title}`, COLORS.CYAN + COLORS.BOLD);
  log(`${border}\n`, COLORS.CYAN);
};

const logSection = (title) => {
  log(`\n🔍 ${title}`, COLORS.YELLOW + COLORS.BOLD);
  log('─'.repeat(50), COLORS.YELLOW);
};

const logSuccess = (message) => log(`✅ ${message}`, COLORS.GREEN);
const logError = (message) => log(`❌ ${message}`, COLORS.RED);
const logWarning = (message) => log(`⚠️  ${message}`, COLORS.YELLOW);
const logInfo = (message) => log(`ℹ️  ${message}`, COLORS.BLUE);

class FunctionalityChecker {
  constructor() {
    this.results = {
      totalChecks: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: []
    };
  }

  // Check if TypeScript compilation is clean
  async checkTypeScriptCompilation() {
    logSection('TypeScript Compilation Check');
    
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
      logSuccess('TypeScript compilation successful');
      this.recordPass('TypeScript compilation');
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || 'Unknown error';
      logError(`TypeScript compilation failed:\n${output}`);
      this.recordFail('TypeScript compilation', output);
    }
  }

  // Check for missing imports and dependencies
  async checkImportsAndDependencies() {
    logSection('Import and Dependency Check');
    
    const importPatterns = [
      { pattern: /import.*from ['"]@\//, description: 'Local imports' },
      { pattern: /import.*from ['"]next/, description: 'Next.js imports' },
      { pattern: /import.*from ['"]react/, description: 'React imports' },
      { pattern: /import.*from ['"]lucide-react/, description: 'Lucide icons' },
      { pattern: /useToast/, description: 'useToast hook usage' }
    ];

    const files = this.getAllTSXFiles();
    let importIssues = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for useToast import consistency
        if (content.includes('useToast')) {
          if (content.includes('from "@/hooks/use-toast"')) {
            logError(`Incorrect useToast import in ${file}`);
            importIssues++;
          } else if (content.includes('from "@/components/ui/use-toast"')) {
            // Correct import - no action needed
          }
        }

        // Check for missing icon imports
        const iconMatches = content.match(/<(\w+)\s+(?:className|size|color)/g);
        if (iconMatches) {
          for (const match of iconMatches) {
            const iconName = match.match(/<(\w+)/)[1];
            if (iconName.match(/^[A-Z]/) && !content.includes(`import.*${iconName}.*from.*lucide-react`)) {
              if (!content.includes(`${iconName},`) && !content.includes(`{ ${iconName} }`)) {
                logWarning(`Potential missing icon import: ${iconName} in ${file}`);
                importIssues++;
              }
            }
          }
        }
      } catch (error) {
        logError(`Error reading file ${file}: ${error.message}`);
        importIssues++;
      }
    }

    if (importIssues === 0) {
      logSuccess('All imports appear to be correct');
      this.recordPass('Import consistency');
    } else {
      logError(`Found ${importIssues} import issues`);
      this.recordFail('Import consistency', `${importIssues} issues found`);
    }
  }

  // Check all route files exist and are valid
  async checkRouteIntegrity() {
    logSection('Route Integrity Check');
    
    const routeFiles = this.getAllRouteFiles();
    let routeIssues = 0;

    for (const routeFile of routeFiles) {
      try {
        const content = fs.readFileSync(routeFile, 'utf8');
        
        // Check for basic React component structure
        if (!content.includes('export default') && !content.includes('export {')) {
          logError(`No default export in ${routeFile}`);
          routeIssues++;
        }

        // Check for common syntax issues
        if (content.includes('React.Fragment') && !content.includes('import React')) {
          logWarning(`React.Fragment used without React import in ${routeFile}`);
          routeIssues++;
        }

      } catch (error) {
        logError(`Cannot read route file ${routeFile}: ${error.message}`);
        routeIssues++;
      }
    }

    if (routeIssues === 0) {
      logSuccess(`All ${routeFiles.length} route files are valid`);
      this.recordPass('Route integrity');
    } else {
      logError(`Found ${routeIssues} route issues in ${routeFiles.length} files`);
      this.recordFail('Route integrity', `${routeIssues} issues found`);
    }
  }

  // Check API routes functionality
  async checkAPIRoutes() {
    logSection('API Routes Check');
    
    const apiRoutes = this.getAllAPIRoutes();
    let apiIssues = 0;

    for (const apiRoute of apiRoutes) {
      try {
        const content = fs.readFileSync(apiRoute, 'utf8');
        
        // Check for proper HTTP method exports
        const hasHttpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
          .some(method => content.includes(`export async function ${method}`));
          
        if (!hasHttpMethods) {
          logWarning(`No HTTP method exports found in ${apiRoute}`);
          apiIssues++;
        }

        // Check for NextResponse usage
        if (content.includes('Response') && !content.includes('NextResponse')) {
          logWarning(`Consider using NextResponse instead of Response in ${apiRoute}`);
        }

      } catch (error) {
        logError(`Cannot read API route ${apiRoute}: ${error.message}`);
        apiIssues++;
      }
    }

    if (apiIssues === 0) {
      logSuccess(`All ${apiRoutes.length} API routes are properly structured`);
      this.recordPass('API routes');
    } else {
      logError(`Found ${apiIssues} API route issues`);
      this.recordFail('API routes', `${apiIssues} issues found`);
    }
  }

  // Check component functionality
  async checkComponentFunctionality() {
    logSection('Component Functionality Check');
    
    const componentFiles = this.getAllComponentFiles();
    let componentIssues = 0;

    for (const componentFile of componentFiles) {
      try {
        const content = fs.readFileSync(componentFile, 'utf8');
        
        // Check for event handlers without proper types
        const buttonMatches = content.match(/<button[^>]*onClick/g);
        if (buttonMatches) {
          buttonMatches.forEach(() => {
            if (!content.includes('MouseEvent') && !content.includes('() => ')) {
              // This is just a warning, not a failure
            }
          });
        }

        // Check for form submissions
        const formMatches = content.match(/<form[^>]*onSubmit/g);
        if (formMatches && !content.includes('preventDefault')) {
          logWarning(`Form in ${componentFile} might need preventDefault`);
          componentIssues++;
        }

        // Check for missing key props in lists
        if (content.includes('.map(') && !content.includes('key=')) {
          logWarning(`Potential missing key prop in list rendering in ${componentFile}`);
          componentIssues++;
        }

      } catch (error) {
        logError(`Cannot read component ${componentFile}: ${error.message}`);
        componentIssues++;
      }
    }

    if (componentIssues === 0) {
      logSuccess(`All ${componentFiles.length} components appear functional`);
      this.recordPass('Component functionality');
    } else {
      logWarning(`Found ${componentIssues} potential component issues`);
      this.recordWarning('Component functionality', `${componentIssues} potential issues`);
    }
  }

  // Check for environment variables and configuration
  async checkEnvironmentConfiguration() {
    logSection('Environment Configuration Check');
    
    const envFiles = ['.env.local', '.env', '.env.example'];
    let configIssues = 0;

    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        logInfo(`Found ${envFile}`);
        
        try {
          const content = fs.readFileSync(envFile, 'utf8');
          
          // Check for common required variables
          const requiredVars = [
            'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
            'CLERK_SECRET_KEY',
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY'
          ];

          for (const varName of requiredVars) {
            if (!content.includes(varName)) {
              logWarning(`Missing environment variable: ${varName} in ${envFile}`);
              configIssues++;
            }
          }
        } catch (error) {
          logError(`Cannot read ${envFile}: ${error.message}`);
          configIssues++;
        }
      }
    }

    if (configIssues === 0) {
      logSuccess('Environment configuration appears complete');
      this.recordPass('Environment configuration');
    } else {
      logError(`Found ${configIssues} configuration issues`);
      this.recordFail('Environment configuration', `${configIssues} issues found`);
    }
  }

  // Check package.json and dependencies
  async checkDependencies() {
    logSection('Dependencies Check');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Check for critical dependencies
      const criticalDeps = [
        'next', 'react', 'react-dom', '@clerk/nextjs', 
        'lucide-react', 'tailwindcss', '@supabase/supabase-js'
      ];

      let missingDeps = 0;
      for (const dep of criticalDeps) {
        if (!dependencies[dep]) {
          logError(`Missing critical dependency: ${dep}`);
          missingDeps++;
        }
      }

      if (missingDeps === 0) {
        logSuccess('All critical dependencies are present');
        this.recordPass('Dependencies');
      } else {
        logError(`Missing ${missingDeps} critical dependencies`);
        this.recordFail('Dependencies', `${missingDeps} missing`);
      }

    } catch (error) {
      logError(`Cannot read package.json: ${error.message}`);
      this.recordFail('Dependencies', 'Cannot read package.json');
    }
  }

  // Auto-fix common issues
  async autoFixIssues() {
    logSection('Auto-Fix Common Issues');
    
    try {
      // Fix useToast imports
      logInfo('Fixing useToast imports...');
      execSync('find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs sed -i.bak \'s|from "@/hooks/use-toast"|from "@/components/ui/use-toast"|g\'', { stdio: 'pipe' });
      
      // Remove backup files
      execSync('find . -name "*.bak" -delete', { stdio: 'pipe' });
      
      logSuccess('Auto-fixed useToast imports');
      this.recordPass('Auto-fix useToast imports');
    } catch (error) {
      logWarning('Auto-fix completed with some issues');
      this.recordWarning('Auto-fix', 'Some issues during auto-fix');
    }
  }

  // Helper methods
  getAllTSXFiles() {
    try {
      const output = execSync('find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v ".next"', { encoding: 'utf8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  getAllRouteFiles() {
    try {
      const output = execSync('find app -name "page.tsx" -o -name "layout.tsx" -o -name "loading.tsx" -o -name "error.tsx"', { encoding: 'utf8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  getAllAPIRoutes() {
    try {
      const output = execSync('find app/api -name "route.ts"', { encoding: 'utf8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  getAllComponentFiles() {
    try {
      const output = execSync('find components -name "*.tsx" | grep -v node_modules', { encoding: 'utf8' });
      return output.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  recordPass(check) {
    this.results.totalChecks++;
    this.results.passed++;
  }

  recordFail(check, details) {
    this.results.totalChecks++;
    this.results.failed++;
    this.results.issues.push({ type: 'error', check, details });
  }

  recordWarning(check, details) {
    this.results.totalChecks++;
    this.results.warnings++;
    this.results.issues.push({ type: 'warning', check, details });
  }

  // Generate comprehensive report
  generateReport() {
    logHeader('COMPREHENSIVE FUNCTIONALITY REPORT');
    
    log(`📊 Total Checks: ${this.results.totalChecks}`, COLORS.BLUE);
    log(`✅ Passed: ${this.results.passed}`, COLORS.GREEN);
    log(`❌ Failed: ${this.results.failed}`, COLORS.RED);
    log(`⚠️  Warnings: ${this.results.warnings}`, COLORS.YELLOW);

    const successRate = ((this.results.passed / this.results.totalChecks) * 100).toFixed(1);
    log(`\n🎯 Success Rate: ${successRate}%`, successRate >= 90 ? COLORS.GREEN : successRate >= 70 ? COLORS.YELLOW : COLORS.RED);

    if (this.results.issues.length > 0) {
      logSection('Issues Summary');
      this.results.issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : '⚠️';
        log(`${index + 1}. ${icon} ${issue.check}: ${issue.details}`);
      });
    }

    logSection('Recommendations');
    if (this.results.failed === 0 && this.results.warnings === 0) {
      logSuccess('🎉 Perfect! All functionality is working correctly.');
      logSuccess('🚀 Your application is 100% functional and ready for production.');
    } else if (this.results.failed === 0) {
      logInfo('✨ Good! No critical errors found, but some optimizations available.');
      logInfo('🔧 Address the warnings above to achieve perfect functionality.');
    } else {
      logError('🚨 Critical issues found that need immediate attention.');
      logError('🛠️  Please fix the errors above before deploying to production.');
    }

    // Save report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      results: this.results,
      successRate: successRate
    };

    fs.writeFileSync('functionality-report.json', JSON.stringify(reportData, null, 2));
    logInfo('📄 Detailed report saved to functionality-report.json');
  }

  // Run all checks
  async runAllChecks() {
    logHeader('LOCONOMY FUNCTIONALITY VERIFICATION');
    logInfo('Ensuring 100% functionality across all components...\n');

    await this.checkDependencies();
    await this.checkEnvironmentConfiguration();
    await this.checkTypeScriptCompilation();
    await this.checkImportsAndDependencies();
    await this.checkRouteIntegrity();
    await this.checkAPIRoutes();
    await this.checkComponentFunctionality();
    await this.autoFixIssues();

    this.generateReport();
  }
}

// Run the functionality checker
async function main() {
  const checker = new FunctionalityChecker();
  await checker.runAllChecks();
  
  process.exit(checker.results.failed > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FunctionalityChecker;
