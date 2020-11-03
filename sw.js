const CACHE_NAME = "premierLeague_v25";

let urlToCahce = [
  "/",
  "/pl.html",
  "/nav.html",
  "/css/materialize.min.css",
  "/js/api.js",
  "/js/app.js",
  "/js/idb.js",
  "js/materialize.min.js",
  "/js/nav.js",
  "/js/push.js",
  "/js/sw-regis.js",
  "/img/epl192.png",
  "img/epl512.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.googleapis.com/css2?family=Crimson+Text:ital@0;1&display=swap",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlToCahce);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then((res) => {
      if (res) {
        return res;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
