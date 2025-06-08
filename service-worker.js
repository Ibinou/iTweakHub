/*
const CACHE_NAME = 'itweakhub-cache-v1.1';

const URLS_TO_CACHE = [
  // HTML
  '/404.html',
  '/account.html',
  '/appinfos.html',
  '/appsmanager.html',
  '/devs.html',
  '/favorite.html',
  '/index.html',
  '/index2.html',
  '/news.html',
  '/repoview.html',
  '/search.html',
  '/sections.html',
  '/settings.html',
  '/setup.html',
  '/sw.js',
  '/versions.html',
  '/2025/2025.html',
  '/settings/certificates.html',
  '/settings/color.html',
  '/settings/credits.html',
  '/settings/general.html',
  '/settings/notifs.html',
  '/settings/privacy-policy.html',
  '/settings/terms.html',
  '/settings/theme.html',
  '/setup/color.html',
  '/setup/method.html',

  // CSS
  '/css/featured.css',
  '/css/navbar.css',
  '/css/styles.css',

  // JS
  '/js/index.js',
  '/js/language.js',
  '/js/search.js',
  '/js/sections.js',
  '/js/sources.js',
  '/js/transition.js',
  '/js/view.js',
];

// Installation : mise en cache des fichiers sélectionnés
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Activation : suppression des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  return self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
*/
