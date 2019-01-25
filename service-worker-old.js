var CACHE_NAME = 'to-do-site-cache-v1';
var urlsToCache = [
  '/',
  'style.css',
  'app.js',
  'redax.js',
  'app.test.js',
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
      })
      .catch(function(error) {
        return reject(error);
      });
  });
}

function fromCache(request) {
  return caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.match(request);
    })
    .then(function(cachedAsset) {
      return cachedAsset || Promise.reject('no-match');
    });
}

self.addEventListener('fetch', function(event) {
  event.respondWith(fromNetwork(event.request, 1000)
    .catch(function(error) {
      console.log('Couldn\'t get the file from the network.'
        + 'Attempting to use the cached asset.', error);
    })
    .then(function() {
      return fromCache(event.request);
    })
    .catch(function(error) {
      console.log('Couldn\'t get the file from the cache:', error);
    })
  );
});

