/**
 * Advanced Service Worker for Loconomy Platform
 * Revolutionary PWA capabilities with intelligent caching and offline functionality
 */

const CACHE_VERSION = 'loconomy-v1.2.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Cache strategies configuration
const CACHE_STRATEGIES = {
  static: {
    name: STATIC_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 100
  },
  dynamic: {
    name: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 50
  },
  api: {
    name: API_CACHE,
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 100
  },
  images: {
    name: IMAGE_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  }
};

// Critical resources that must be cached
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/offline',
  '/_next/static/css/',
  '/_next/static/js/',
  '/api/services/categories',
  '/api/user/profile'
];

// Background sync queue
let backgroundSyncQueue = [];

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('[SW] Installing advanced service worker');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(CRITICAL_RESOURCES.filter(url => !url.includes('_next')));
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating advanced service worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.includes('loconomy') && 
              !Object.values(CACHE_STRATEGIES).some(strategy => strategy.name === cacheName)
            )
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - intelligent caching and offline strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirstWithIntelligentFallback(request));
  } else if (isImageRequest(url)) {
    event.respondWith(cacheFirstWithNetworkFallback(request, IMAGE_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'booking-sync':
      event.waitUntil(syncBookings());
      break;
    case 'message-sync':
      event.waitUntil(syncMessages());
      break;
    case 'analytics-sync':
      event.waitUntil(syncAnalytics());
      break;
    case 'preference-sync':
      event.waitUntil(syncUserPreferences());
      break;
  }
});

// Push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      image: data.image,
      data: data,
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: '/icons/view-action.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss-action.png'
        }
      ],
      tag: data.tag || 'default',
      renotify: true,
      requireInteraction: data.important || false,
      silent: false,
      vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' || !action) {
    event.waitUntil(
      clients.openWindow(data.url || '/')
    );
  } else if (action === 'dismiss') {
    // Analytics tracking for dismissed notifications
    trackNotificationDismissal(data);
  }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_CACHE_STATS':
      getCacheStats().then(stats => {
        event.ports[0].postMessage({ type: 'CACHE_STATS', payload: stats });
      });
      break;
    case 'CLEAR_CACHE':
      clearSpecificCache(payload.cacheName).then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
    case 'PRELOAD_ROUTES':
      preloadRoutes(payload.routes);
      break;
    case 'QUEUE_BACKGROUND_SYNC':
      queueBackgroundSync(payload);
      break;
  }
});

// Caching strategies implementation

async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Update cache in background if stale
      updateCacheInBackground(request, cacheName);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Cache first strategy failed:', error);
    return getCachedResponse(request) || createOfflineResponse();
  }
}

async function networkFirstWithIntelligentFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses with TTL
      const cache = await caches.open(API_CACHE);
      const responseToCache = networkResponse.clone();
      
      // Add timestamp for TTL checking
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network request failed, falling back to cache:', error);
    
    const cachedResponse = await getCachedAPIResponse(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Queue for background sync if it's a mutation
    if (isMutationRequest(request)) {
      queueBackgroundSync({
        type: 'api-retry',
        request: await serializeRequest(request)
      });
    }
    
    return createOfflineAPIResponse(request);
  }
}

async function cacheFirstWithNetworkFallback(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse && !isCacheExpired(cachedResponse)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network failed, using cached version:', error);
    return cachedResponse || createOfflineResponse();
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || createOfflineResponse();
  }
}

// Background sync functions

async function syncBookings() {
  try {
    const bookings = await getQueuedItems('bookings');
    
    for (const booking of bookings) {
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking.data)
        });
        
        // Remove from queue on success
        removeQueuedItem('bookings', booking.id);
        
        // Notify user of successful sync
        await self.registration.showNotification('Booking Confirmed', {
          body: 'Your booking has been successfully processed.',
          icon: '/icons/success.png',
          tag: 'booking-success'
        });
      } catch (error) {
        console.warn('[SW] Failed to sync booking:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Booking sync failed:', error);
  }
}

async function syncMessages() {
  try {
    const messages = await getQueuedItems('messages');
    
    for (const message of messages) {
      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message.data)
        });
        
        removeQueuedItem('messages', message.id);
      } catch (error) {
        console.warn('[SW] Failed to sync message:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Message sync failed:', error);
  }
}

async function syncAnalytics() {
  try {
    const events = await getQueuedItems('analytics');
    
    if (events.length > 0) {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: events.map(e => e.data) })
      });
      
      // Clear analytics queue
      clearQueuedItems('analytics');
    }
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
  }
}

async function syncUserPreferences() {
  try {
    const preferences = await getQueuedItems('preferences');
    
    for (const pref of preferences) {
      try {
        await fetch('/api/user/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pref.data)
        });
        
        removeQueuedItem('preferences', pref.id);
      } catch (error) {
        console.warn('[SW] Failed to sync preference:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Preference sync failed:', error);
  }
}

// Utility functions

function isStaticAsset(url) {
  return url.pathname.includes('/_next/static/') ||
         url.pathname.includes('/static/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff');
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isMutationRequest(request) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
}

function isCacheExpired(response) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return false;
  
  const cacheAge = Date.now() - parseInt(cachedAt);
  return cacheAge > CACHE_STRATEGIES.api.maxAge;
}

async function getCachedAPIResponse(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !isCacheExpired(cachedResponse)) {
    return cachedResponse;
  }
  return null;
}

async function getCachedResponse(request) {
  return await caches.match(request);
}

function createOfflineResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offline - Loconomy</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        .container {
          max-width: 400px;
          padding: 2rem;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        p { opacity: 0.9; line-height: 1.6; }
        .retry-btn {
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          margin-top: 1rem;
          font-size: 1rem;
        }
        .retry-btn:hover {
          background: rgba(255,255,255,0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📶</div>
        <h1>You're Offline</h1>
        <p>Don't worry! You can still browse previously viewed services and your booking history. We'll sync everything once you're back online.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

function createOfflineAPIResponse(request) {
  const url = new URL(request.url);
  
  // Return helpful offline responses for different API endpoints
  if (url.pathname.includes('/services')) {
    return new Response(JSON.stringify({
      error: 'offline',
      message: 'Services will be loaded when connection is restored',
      cached: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({
    error: 'offline',
    message: 'This feature requires an internet connection'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

async function preloadRoutes(routes) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    for (const route of routes) {
      try {
        const response = await fetch(route);
        if (response.ok) {
          cache.put(route, response);
        }
      } catch (error) {
        console.warn('[SW] Failed to preload route:', route, error);
      }
    }
  } catch (error) {
    console.error('[SW] Route preloading failed:', error);
  }
}

function queueBackgroundSync(data) {
  const id = Date.now().toString();
  backgroundSyncQueue.push({ id, data, timestamp: Date.now() });
  
  // Register background sync
  self.registration.sync.register(data.type || 'default-sync');
}

async function getQueuedItems(type) {
  // In a real implementation, this would use IndexedDB
  return backgroundSyncQueue.filter(item => item.data.type === type);
}

function removeQueuedItem(type, id) {
  backgroundSyncQueue = backgroundSyncQueue.filter(
    item => !(item.data.type === type && item.id === id)
  );
}

function clearQueuedItems(type) {
  backgroundSyncQueue = backgroundSyncQueue.filter(item => item.data.type !== type);
}

async function serializeRequest(request) {
  const body = await request.text();
  return {
    url: request.url,
    method: request.method,
    headers: [...request.headers.entries()],
    body: body
  };
}

async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    stats[cacheName] = {
      entries: keys.length,
      size: await calculateCacheSize(cache, keys)
    };
  }
  
  return stats;
}

async function calculateCacheSize(cache, keys) {
  let totalSize = 0;
  
  for (const request of keys) {
    try {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    } catch (error) {
      // Skip if we can't calculate size
    }
  }
  
  return totalSize;
}

async function clearSpecificCache(cacheName) {
  await caches.delete(cacheName);
}

function trackNotificationDismissal(data) {
  // Queue analytics event for notification dismissal
  queueBackgroundSync({
    type: 'analytics',
    data: {
      event: 'notification_dismissed',
      properties: {
        notification_tag: data.tag,
        timestamp: Date.now()
      }
    }
  });
}

// Periodic cache cleanup
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      // Clean up expired entries
      for (const request of requests) {
        const response = await cache.match(request);
        if (response && isCacheExpired(response)) {
          await cache.delete(request);
        }
      }
    }
  } catch (error) {
    console.warn('[SW] Cache cleanup failed:', error);
  }
}, 60 * 60 * 1000); // Run every hour

console.log('[SW] Advanced Service Worker loaded successfully');