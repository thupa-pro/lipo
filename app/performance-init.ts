/**
 * Performance Initialization Script
 * Runs on app startup to optimize loading performance
 */

import { initializeLoadingOptimizations, registerLoadingServiceWorker } from "@/lib/performance/loading-optimization";

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  // Preload critical loading image immediately
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = 'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=800';
  link.as = 'image';
  document.head.appendChild(link);

  // Initialize optimizations
  initializeLoadingOptimizations();
  
  // Register service worker for caching
  registerLoadingServiceWorker();

  // Add performance observer for loading metrics
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('loading') && entry.duration > 100) {
          console.warn(`Slow loading detected: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }
}

export default {};
