const CACHE_NAME = "kisanvoice-v3";
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = ["/", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Skip Convex WebSocket and Clerk auth
  if (
    url.hostname.includes("convex.cloud") ||
    url.hostname.includes("clerk") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Network-first for navigation, cache-first for assets
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Network-first for Next chunks — cache-first stale JS breaks the app after deploys / HMR.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for other static assets (images, fonts at root, etc.)
  if (url.pathname.match(/\.(js|css|woff2?|png|jpg|svg|ico)$/)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }
});

// Cache last-known briefing data from the app
self.addEventListener("message", (event) => {
  if (event.data?.type === "CACHE_BRIEFING") {
    caches.open(CACHE_NAME).then((cache) => {
      const response = new Response(JSON.stringify(event.data.payload), {
        headers: { "Content-Type": "application/json" },
      });
      cache.put("/api/cached-briefing", response);
    });
  }

  if (event.data?.type === "GET_CACHED_BRIEFING") {
    caches.open(CACHE_NAME).then((cache) => {
      cache.match("/api/cached-briefing").then((response) => {
        if (response) {
          response.json().then((data) => {
            event.source?.postMessage({
              type: "CACHED_BRIEFING",
              payload: data,
            });
          });
        }
      });
    });
  }
});
