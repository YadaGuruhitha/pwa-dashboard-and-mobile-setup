'use client';

import { useEffect } from 'react';

/** Registers the service worker in production builds; removes stale ones in dev. */
export default function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      if ('caches' in window) {
        caches.keys().then((names) => names.filter((n) => n.startsWith('krishi-jal')).forEach((n) => caches.delete(n)));
      }
      return;
    }

    const register = () =>
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Activate a waiting update on next load
          reg.addEventListener('updatefound', () => {
            const nw = reg.installing;
            nw?.addEventListener('statechange', () => {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) nw.postMessage({ type: 'SKIP_WAITING' });
            });
          });
        })
        .catch((err) => console.warn('Service worker registration failed', err));

    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  return null;
}
