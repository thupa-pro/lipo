const CACHE_NAME = 'loconomy-v1.2.0';
const STATIC_CACHE = 'loconomy-static-v1.2.0';
const DYNAMIC_CACHE = 'loconomy-dynamic-v1.2.0';
const API_CACHE = 'loconomy-api-v1.2.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/search',
  '/messages',
  '/provider/dashboard',
  '/customer/bookings',
  '/manifest.json',
  '/offline.html',
  // Core CSS and JS files would be added here
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/services',
  '/api/providers', 
  '/api/categories',
  '/api/user/profile',
  '/api/bookings',
  '/api/messages',
];

// Network-first strategies for these patterns
const NETWORK_FIRST_PATTERNS = [
  /\/api\/bookings\/\d+$/,
  /\/api\/messages/,
  /\/api\/notifications/,
  /\/api\/payments/,
];

// Cache-first strategies for these patterns  
const CACHE_FIRST_PATTERNS = [
  /\/api\/services$/,
  /\/api\/categories$/,
  /\/api\/providers$/,
  /\.(png|jpg|jpeg|svg|gif|webp)$/,
  /\.(css|js)$/,
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE &&
              cacheName.startsWith('loconomy-')
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle API requests with different strategies
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check for network-first patterns
  const isNetworkFirst = NETWORK_FIRST_PATTERNS.some(pattern => 
    pattern.test(url.pathname)
  );
  
  // Check for cache-first patterns
  const isCacheFirst = CACHE_FIRST_PATTERNS.some(pattern => 
    pattern.test(url.pathname)
  );

  if (isNetworkFirst) {
    return networkFirstStrategy(request);
  } else if (isCacheFirst) {
    return cacheFirstStrategy(request);
  } else {
    return networkWithCacheFallback(request);
  }
}

// Network-first strategy (for real-time data)
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Cache-first strategy (for static data)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.status === 200) {
        caches.open(API_CACHE).then(cache => {
          cache.put(request, response);
        });
      }
    }).catch(() => {
      // Ignore network errors in background update
    });
    
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    throw error;
  }
}

// Network with cache fallback
async function networkWithCacheFallback(request) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle static assets (images, CSS, JS)
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Handle navigation requests
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('[SW] Navigation failed, trying cache:', request.url);
    
    // Try to serve cached page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page
    return caches.match('/offline.html');
  }
}

// Check if request is for static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/_next/static/') ||
    /\.(png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/.test(url.pathname)
  );
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'booking-submission') {
    event.waitUntil(syncBookings());
  } else if (event.tag === 'message-send') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'review-submission') {
    event.waitUntil(syncReviews());
  }
});

// Sync pending bookings
async function syncBookings() {
  try {
    const db = await openDB();
    const pendingBookings = await db.getAll('pendingBookings');
    
    for (const booking of pendingBookings) {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking.data),
        });
        
        if (response.ok) {
          await db.delete('pendingBookings', booking.id);
          console.log('[SW] Synced booking:', booking.id);
        }
      } catch (error) {
        console.log('[SW] Failed to sync booking:', booking.id, error);
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

// Sync pending messages
async function syncMessages() {
  try {
    const db = await openDB();
    const pendingMessages = await db.getAll('pendingMessages');
    
    for (const message of pendingMessages) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message.data),
        });
        
        if (response.ok) {
          await db.delete('pendingMessages', message.id);
          console.log('[SW] Synced message:', message.id);
        }
      } catch (error) {
        console.log('[SW] Failed to sync message:', message.id, error);
      }
    }
  } catch (error) {
    console.log('[SW] Message sync failed:', error);
  }
}

// Sync pending reviews
async function syncReviews() {
  try {
    const db = await openDB();
    const pendingReviews = await db.getAll('pendingReviews');
    
    for (const review of pendingReviews) {
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(review.data),
        });
        
        if (response.ok) {
          await db.delete('pendingReviews', review.id);
          console.log('[SW] Synced review:', review.id);
        }
      } catch (error) {
        console.log('[SW] Failed to sync review:', review.id, error);
      }
    }
  } catch (error) {
    console.log('[SW] Review sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push received');
  
  const options = {
    badge: '/icons/icon-72x72.png',
    icon: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {},
    actions: []
  };

  if (event.data) {
    const data = event.data.json();
    
    options.title = data.title || 'Loconomy';
    options.body = data.body || 'You have a new notification';
    options.data = data.data || {};
    options.tag = data.tag || 'general';
    
    // Add action buttons based on notification type
    if (data.type === 'booking') {
      options.actions = [
        {
          action: 'view',
          title: 'View Booking',
          icon: '/icons/view-action.png'
        },
        {
          action: 'message',
          title: 'Send Message',
          icon: '/icons/message-action.png'
        }
      ];
    } else if (data.type === 'message') {
      options.actions = [
        {
          action: 'reply',
          title: 'Reply',
          icon: '/icons/reply-action.png'
        },
        {
          action: 'view',
          title: 'View Chat',
          icon: '/icons/view-action.png'
        }
      ];
    }
  } else {
    options.title = 'Loconomy';
    options.body = 'You have a new notification';
  }

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  let url = '/';
  
  if (action === 'view' && data.bookingId) {
    url = `/bookings/${data.bookingId}`;
  } else if (action === 'reply' || action === 'message') {
    url = '/messages';
    if (data.conversationId) {
      url += `?conversation=${data.conversationId}`;
    }
  } else if (data.url) {
    url = data.url;
  }
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

// IndexedDB helper for offline storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('loconomy-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Create object stores for offline data
      if (!db.objectStoreNames.contains('pendingBookings')) {
        db.createObjectStore('pendingBookings', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pendingMessages')) {
        db.createObjectStore('pendingMessages', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pendingReviews')) {
        db.createObjectStore('pendingReviews', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('cachedServices')) {
        db.createObjectStore('cachedServices', { keyPath: 'id' });
      }
    };
  });
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    // Sync latest services, providers, and other content
    const response = await fetch('/api/sync/content');
    if (response.ok) {
      const data = await response.json();
      
      const cache = await caches.open(API_CACHE);
      await cache.put('/api/services', new Response(JSON.stringify(data.services)));
      await cache.put('/api/providers', new Response(JSON.stringify(data.providers)));
      
      console.log('[SW] Content synced successfully');
    }
  } catch (error) {
    console.log('[SW] Content sync failed:', error);
  }
}

console.log('[SW] Service Worker loaded');
