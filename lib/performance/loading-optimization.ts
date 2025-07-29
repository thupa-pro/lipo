/**
 * Elite Loading Performance Optimization
 * Advanced performance utilities for loading screens
 */

// Preload critical images
export function preloadCriticalImages() {
  if (typeof window === 'undefined') return;

  const criticalImages = [
    "https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=400",
    "https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=200",
  ];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Optimize loading sequence
export function optimizeLoadingSequence() {
  if (typeof window === 'undefined') return;

  // Preload critical assets
  preloadCriticalImages();
  
  // Set loading performance hints
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = "https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=800";
  link.as = 'image';
  document.head.appendChild(link);
}

// Loading state management
export class LoadingStateManager {
  private static instance: LoadingStateManager;
  private loadingStates: Map<string, boolean> = new Map();
  private callbacks: Map<string, () => void> = new Map();

  static getInstance(): LoadingStateManager {
    if (!LoadingStateManager.instance) {
      LoadingStateManager.instance = new LoadingStateManager();
    }
    return LoadingStateManager.instance;
  }

  setLoading(key: string, isLoading: boolean, callback?: () => void): void {
    this.loadingStates.set(key, isLoading);
    if (callback) {
      this.callbacks.set(key, callback);
    }
    
    if (!isLoading && this.callbacks.has(key)) {
      const cb = this.callbacks.get(key);
      cb?.();
      this.callbacks.delete(key);
    }
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  hasAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }

  clearAllLoading(): void {
    this.loadingStates.clear();
    this.callbacks.clear();
  }
}

// Performance monitoring for loading screens
export function monitorLoadingPerformance() {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name.includes('loading') || entry.name.includes('image')) {
        console.log(`Loading Performance: ${entry.name} took ${entry.duration}ms`);
      }
    });
  });

  observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
}

// Image loading optimization
export function optimizeImageLoading(src: string, sizes?: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set loading priority
    img.loading = 'eager';
    img.decoding = 'sync';
    
    // Set sizes for responsive images
    if (sizes) {
      img.sizes = sizes;
    }
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    img.src = src;
  });
}

// Progressive image loading
export function createProgressiveImageLoader() {
  return {
    loadLowQuality: (src: string) => {
      const lowQualitySrc = src.replace('width=800', 'width=200').replace('width=400', 'width=100');
      return optimizeImageLoading(lowQualitySrc);
    },
    
    loadHighQuality: (src: string) => {
      return optimizeImageLoading(src);
    },
    
    loadProgressive: async (src: string) => {
      try {
        // Load low quality first
        const lowQualityImg = await createProgressiveImageLoader().loadLowQuality(src);
        
        // Then load high quality
        const highQualityImg = await createProgressiveImageLoader().loadHighQuality(src);
        
        return { lowQualityImg, highQualityImg };
      } catch (error) {
        console.error('Progressive image loading failed:', error);
        throw error;
      }
    }
  };
}

// Initialize performance optimizations
export function initializeLoadingOptimizations() {
  if (typeof window === 'undefined') return;

  // Run optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeLoadingSequence();
      monitorLoadingPerformance();
    });
  } else {
    optimizeLoadingSequence();
    monitorLoadingPerformance();
  }
}

// Service Worker for caching loading assets
export function registerLoadingServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const swScript = `
    const CACHE_NAME = 'loconomy-loading-v1';
    const LOADING_ASSETS = [
      'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=800',
      'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=400',
      'https://cdn.builder.io/api/v1/image/assets%2Fc9e48d21b17f4c5990f7115c35da4797%2F49e29029ab1347bc97939adb24510e95?format=webp&width=200'
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => cache.addAll(LOADING_ASSETS))
      );
    });

    self.addEventListener('fetch', (event) => {
      if (LOADING_ASSETS.some(asset => event.request.url.includes(asset))) {
        event.respondWith(
          caches.match(event.request)
            .then((response) => response || fetch(event.request))
        );
      }
    });
  `;

  const blob = new Blob([swScript], { type: 'application/javascript' });
  const swUrl = URL.createObjectURL(blob);

  navigator.serviceWorker.register(swUrl)
    .then(() => console.log('Loading Service Worker registered'))
    .catch((error) => console.error('Service Worker registration failed:', error));
}

export default {
  preloadCriticalImages,
  optimizeLoadingSequence,
  LoadingStateManager,
  monitorLoadingPerformance,
  optimizeImageLoading,
  createProgressiveImageLoader,
  initializeLoadingOptimizations,
  registerLoadingServiceWorker,
};
