var CACHE_NAME = 'to-do-site-cache-v1';
var urlsToCache = [
  '/',
  'style.css',
  'app.js',
  'redax.js',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName != CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

function fromNetwork(request, milliseconds) {
  return new Promise(function(resolve, reject) {
    var timeout = setTimeout(reject, milliseconds);
    fetch(request)
      .then(function(response) {
        clearTimeout(timeout);
        return resolve(response);
      });
  });
}

function fromCache(request) {
  return caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.match(request);
    })
    .then(function(cachedAsset) {
      return cachedAsset;
    })
    .catch(function(error) {
      console.log('Couldn\'t find the cached asset.'
        + 'Please wait for a network connection', error);
    });
}

self.addEventListener('fetch', function(event) {
  event.respondWith(fromNetwork(event.request, 1000)
    .catch(function() {
      return fromCache(event.request);
    }));
});

