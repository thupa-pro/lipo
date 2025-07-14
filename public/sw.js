const CACHE_NAME = "loconomy-elite-v1";
const API_CACHE_NAME = "loconomy-api-v1";
const STATIC_CACHE_NAME = "loconomy-static-v1";

const STATIC_ASSETS = [
  "/",
  "/browse",
  "/dashboard",
  "/profile",
  "/settings",
  "/manifest.json",
  "/icon.svg",
];

const API_ENDPOINTS = ["/api/services", "/api/providers", "/api/bookings"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log("Service Worker: Preparing API cache");
        return Promise.resolve();
      }),
    ]).then(() => {
      console.log("Service Worker: Installation complete");
      return self.skipWaiting();
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== API_CACHE_NAME &&
              cacheName !== STATIC_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME));
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    return;
  }

  // Handle page requests with stale-while-revalidate
  event.respondWith(staleWhileRevalidateStrategy(request, CACHE_NAME));
});

// Caching strategies
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful response
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Fallback to cache
    console.log("Service Worker: Network failed, trying cache:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or error response
    return new Response(
      JSON.stringify({ error: "Offline", message: "No network connection" }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Service Worker: Failed to fetch:", request.url);

    // Return a fallback response for images
    if (request.destination === "image") {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image unavailable</text></svg>',
        { headers: { "Content-Type": "image/svg+xml" } },
      );
    }

    throw error;
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => {
      // Ignore network errors for background updates
    });

  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Service Worker: Background sync triggered");
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle offline actions when connection is restored
  try {
    // Sync pending bookings, payments, messages, etc.
    console.log("Service Worker: Syncing offline actions...");

    // This would typically retrieve stored actions from IndexedDB
    // and send them to the server
  } catch (error) {
    console.error("Service Worker: Background sync failed:", error);
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  const options = {
    body: event.data ? event.data.text() : "New notification from Loconomy",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200],
    tag: "loconomy-notification",
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/icon-192x192.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Loconomy Elite", options),
  );
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Handle app shortcuts
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log("Service Worker: Loaded and ready");
