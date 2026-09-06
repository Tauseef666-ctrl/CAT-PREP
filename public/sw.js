const CACHE_NAME = "cat-command-v1";
const PRECACHE = [
  "/",
  "/dashboard",
  "/learn",
  "/practice",
  "/today",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-maskable.svg",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE).then(() => self.skipWaiting()))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // App shell: cache-first, fall back to network then offline page.
  if (url.pathname === "/" || url.pathname.startsWith("/practice") || url.pathname.startsWith("/learn")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((res) => {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
              return res;
            })
            .catch(() => caches.match("/offline"))
      )
    );
    return;
  }

  // Everything else: network-first, falling back to cache.
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request).then((m) => m || caches.match("/offline")))
  );
});