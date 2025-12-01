// Service Worker for dericBI - Safe version that prevents redirect loops
const CACHE_NAME = 'dericbi-projects-v2';
const urlsToCache = [
  '/journey-data.json',
  '/my-projects.html',
  '/assets/css/style.css',
  '/assets/css/loading-states.css',
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - NETWORK FIRST for navigations to prevent redirect loops
self.addEventListener('fetch', event => {
  // For navigation requests (page loads), always use network first
  // This prevents serving any cached redirect responses that could cause loops
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails (offline), try cached fallback
        return caches.match('/index.html');
      })
    );
    return;
  }

  // For assets, use cache-first (normal caching behavior)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          // Update cache in background
          fetch(event.request).then(freshResponse => {
            if (freshResponse && freshResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, freshResponse);
              });
            }
          });
          return response;
        }

        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});
