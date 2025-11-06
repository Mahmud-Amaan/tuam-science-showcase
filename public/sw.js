const CACHE_NAME = 'science-simulator-v1';
const STATIC_CACHE = 'science-simulator-static-v1';
const DYNAMIC_CACHE = 'science-simulator-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/_next/static/css/',
  '/_next/static/js/',
  '/banner.jpg',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return;

  // Handle static assets
  if (request.url.includes('/_next/static/') ||
      request.url.includes('.css') ||
      request.url.includes('.js') ||
      request.url.includes('.woff') ||
      request.url.includes('.woff2')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) return response;

          return fetch(request).then((response) => {
            if (!response || response.status !== 200) return response;

            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          });
        })
    );
    return;
  }

  // Handle images
  if (request.url.includes('.jpg') ||
      request.url.includes('.jpeg') ||
      request.url.includes('.png') ||
      request.url.includes('.gif') ||
      request.url.includes('.webp') ||
      request.url.includes('.svg')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) return response;

          return fetch(request).then((response) => {
            if (!response || response.status !== 200) return response;

            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          });
        })
    );
    return;
  }

  // Default strategy - network first for HTML, cache first for others
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) return response;

          return fetch(request).then((response) => {
            if (!response || response.status !== 200) return response;

            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          });
        })
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here if needed
  return Promise.resolve();
}

// Push notifications (if implemented later)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});