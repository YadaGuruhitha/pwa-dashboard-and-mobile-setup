/* Krishi Jal service worker
 * - /_next/static/*  : cache-first (content-hashed, immutable) -> app shell works offline
 * - navigations      : network-first, cached copy, then /offline.html
 * - API (/api/ or /backend-api/): network-first; offline replies are explicitly flagged stale
 * - other same-origin GET assets (icons, manifest): stale-while-revalidate
 */
const VERSION = 'v6';
const STATIC_CACHE = `krishi-jal-static-${VERSION}`;
const PAGES_CACHE = `krishi-jal-pages-${VERSION}`;
const API_CACHE = `krishi-jal-api-${VERSION}`;
const ALL_CACHES = [STATIC_CACHE, PAGES_CACHE, API_CACHE];

const PRECACHE = [
  '/offline.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.all(PRECACHE.map((u) => cache.add(u).catch(() => undefined)))
    )
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith('krishi-jal') && !ALL_CACHES.includes(k)).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

const isApi = (url) => url.pathname.startsWith('/api/') || url.pathname.startsWith('/backend-api/') || url.pathname.includes('/api/');

async function putSafe(name, request, response) {
  if (!response || response.status !== 200) return;
  const cache = await caches.open(name);
  await cache.put(request, response);
}

async function apiNetworkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) putSafe(API_CACHE, request, response.clone());
    return response;
  } catch (e) {
    const cached = await caches.match(request, { cacheName: API_CACHE });
    if (cached) {
      try {
        const data = await cached.clone().json();
        const body = Array.isArray(data)
          ? data
          : { ...data, is_stale: true, is_offline_cached: true, offline_notice: 'Offline: showing saved data, not live sensor readings.' };
        return new Response(JSON.stringify(body), {
          headers: { 'Content-Type': 'application/json', 'X-Data-Stale': 'true', 'X-Offline-Cached': 'true' },
        });
      } catch (_) {
        return cached;
      }
    }
    return new Response(JSON.stringify({ error: 'OFFLINE_UNAVAILABLE', is_stale: true, is_offline_cached: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // API (may be cross-origin, e.g. http://127.0.0.1:8000/api)
  if (isApi(url)) {
    event.respondWith(apiNetworkFirst(request));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Next.js dev/HMR: never touch
  if (url.pathname.startsWith('/_next/webpack-hmr') || url.pathname.startsWith('/__nextjs')) return;

  // Hashed build assets: cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            putSafe(STATIC_CACHE, request, res.clone());
            return res;
          })
      )
    );
    return;
  }

  // Page navigations: network-first -> cached page -> offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          putSafe(PAGES_CACHE, request, res.clone());
          return res;
        })
        .catch(async () => {
          return (
            (await caches.match(request, { cacheName: PAGES_CACHE })) ||
            (await caches.match('/offline.html')) ||
            Response.error()
          );
        })
    );
    return;
  }

  // Other static files: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((hit) => {
      const net = fetch(request)
        .then((res) => {
          putSafe(STATIC_CACHE, request, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});

// ---- Push notifications ----
self.addEventListener('push', (event) => {
  let payload = { title: 'Krishi Jal Irrigation Alert', body: 'Agricultural threshold update from field sensors.', url: '/alerts' };
  if (event.data) {
    try { payload = { ...payload, ...event.data.json() }; } catch (e) { payload.body = event.data.text(); }
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: payload.url || '/alerts' },
      actions: [{ action: 'open', title: 'View Alert' }, { action: 'close', title: 'Dismiss' }],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;
  const target = (event.notification.data && event.notification.data.url) || '/alerts';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if (c.url.includes(target) && 'focus' in c) return c.focus();
      return clients.openWindow ? clients.openWindow(target) : undefined;
    })
  );
});
