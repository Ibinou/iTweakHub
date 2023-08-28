importScripts("https://cdn.pushalert.co/sw-55823_2.js");

// Fichier : service-worker.js

// Étape 1 : Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1')
      .then(cache => {
        return cache.addAll([
          '/', // Page principale
          'css/styles.css',
          'css/article.css',
          'css/banner.css',
          'css/featured.css',
          'css/navbar.css',
          'js/account.js',
          'js/appInfo.js',
          'js/index.js',
          'settings/credits.html',
          'settings/general.html',
          'settings/notifs.html',
          'settings/privacy-policy.html',
          'settings/terms.html',
          'settings/theme.html',
          '404.html',
          'account.html',
          'appinfos.html',
          'apps.json',
          'appsmanager.html',
          'article1.html',
          'manifest.json',
          'repo.json',
          'repoview.html',
          'search.html',
          'settings.html',
          'setup.html',
          'sw.js',
          'https://kit.fontawesome.com/a5ae6c00ff.js',
          'img/logo.png'
          // Ajoutez d'autres fichiers et ressources ici
        ]);
      })
  );
});

// Étape 2 : Gestion des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la ressource est en cache, on la retourne
        if (response) {
          return response;
        }
        
        // Sinon, on effectue une requête réseau et on met la ressource en cache
        return fetch(event.request)
          .then(response => {
            // Vérification pour éviter de mettre en cache des erreurs
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const clonedResponse = response.clone();
            caches.open('v1')
              .then(cache => {
                cache.put(event.request, clonedResponse);
              });
            
            return response;
          });
      })
  );
});

// Étape 3 : Nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Supprime tous les caches sauf le cache actuel ('v1')
          return cacheName !== 'v1';
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

