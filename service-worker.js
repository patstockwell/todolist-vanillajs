console.log('inside the service worker');
console.log(self);

var CACHE_NAME = 'to-do-site-cache-v1';
var CACHE_WHITELIST = [ CACHE_NAME ];
var urlsToCache = [
  '/',
  'style.css',
  'app.js',
  'redax.js',
];

self.addEventListener('install', function(event) {
  console.log(event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('cache opened', cache);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.forEach(function(cacheName) {
          if (!CACHE_WHITELIST.includes(cacheName)) {
            caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(cachedItem) {
        if (cachedItem) {
          return cachedItem;
        }
        return fetch(event.request);
      })
  );
});

