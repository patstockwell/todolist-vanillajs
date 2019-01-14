console.log('inside the service worker');
console.log(self);

var CACHE_NAME = 'to-do-site-cache-v1';
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
