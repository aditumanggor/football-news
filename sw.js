const CACHE_NAME = "premierLeague_v80";

let urlToCahce = [
  "/",
  "/pl.html",
  "/nav.html",
  "/css/materialize.min.css",
  "/css/all.css",
  "/js/api.js",
  "/js/app.js",
  "/js/idb.js",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/push.js",
  "/js/sw-regis.js",
  "/img/epl192.png",
  "/img/epl512.png",
  "https://fonts.googleapis.com/css2?family=Crimson+Text:ital@0;1&display=swap",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "https://api.football-data.org/v2/competitions/2021/matches",
  "https://api.football-data.org/v2/competitions/2021/standings?standingType=TOTAL",
  "/manifest.json",
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

self.addEventListener("push", function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  let options = {
    body: body,
    icon: "img/epl512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
