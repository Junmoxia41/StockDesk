/**
 * StockDesk Service Worker
 *
 * Alcance de esta PWA (ver docs/DEPLOYMENT.md y docs/ARCHITECTURE.md):
 *  - Cachea únicamente el "app shell" (HTML/CSS/JS/íconos propios de
 *    StockDesk) para permitir que la interfaz cargue offline.
 *  - NO cachea nunca peticiones a la API externa de IA (GLM/ZhipuAI) ni
 *    ninguna petición cross-origin: esos datos pueden ser sensibles y deben
 *    ir siempre a la red (si no hay red, simplemente fallan, tal como se
 *    documenta en docs/AI.md — la app sigue funcionando sin IA).
 *  - Los datos de negocio del usuario (productos, ventas, etc.) NUNCA pasan
 *    por este service worker: viven en localStorage, no en el Cache Storage.
 *  - Estrategia: "stale-while-revalidate" para el shell (respuesta rápida
 *    desde caché + actualización en segundo plano) con un flujo explícito
 *    de "nueva versión disponible" gestionado desde app.js.
 */

// Sube este número cada vez que cambie algún archivo del shell para forzar
// la invalidación de caché de versiones anteriores.
const CACHE_VERSION = 'stockdesk-shell-v2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',

  './js/store.js',
  './js/router.js',
  './js/components.js',
  './js/components-layout.js',
  './js/app.js',

  './js/modules/auth-utils.js',
  './js/modules/ticket-printer.js',

  './js/services/storage-service.js',
  './js/services/auth-service.js',
  './js/services/ai-service.js',
  './js/services/license-service.js',
  './js/services/backup-service.js',

  './js/pages/device-setup.js',
  './js/pages/splash.js',
  './js/pages/landing.js',
  './js/pages/login.js',
  './js/pages/dashboard.js',
  './js/pages/catalog.js',
  './js/pages/products.js',
  './js/pages/sales.js',
  './js/pages/reports.js',
  './js/pages/settings.js',

  './js/pages/inventory.js',
  './js/modules/inventory-warehouses.js',
  './js/modules/inventory-transfers.js',
  './js/modules/inventory-kardex.js',
  './js/modules/inventory-kits.js',

  './js/pages/finance.js',
  './js/modules/finance-cashflow.js',
  './js/modules/finance-ledger.js',
  './js/modules/finance-payroll.js',
  './js/modules/finance-budgets.js',

  './js/pages/security.js',
  './js/modules/security-auth.js',
  './js/modules/security-access.js',
  './js/modules/security-protection.js',
  './js/modules/security-threats.js',
  './js/modules/security-backup.js',
  './js/modules/security-logs.js',

  './js/pages/dashboards.js',
  './js/modules/dashboard-widgets.js',
  './js/modules/dashboard-charts.js',

  './js/modules/guide-content.js',
  './js/pages/guide.js',

  './js/pages/customization.js',
  './js/modules/customization-themes.js',
  './js/modules/customization-tickets.js',

  './js/pages/users.js',
  './js/modules/users-management.js',
  './js/modules/users-shifts.js',

  './js/pages/notifications.js',
  './js/modules/notifications-center.js',
  './js/modules/notifications-alerts.js',

  './js/pages/suppliers.js',
  './js/modules/suppliers-directory.js',
  './js/modules/suppliers-orders.js',

  './js/modules/donations.js',
  './js/modules/ai-advanced.js',
  './js/modules/ai-assistant.js',
  './js/modules/ai-chat.js',

  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  // No forzamos skipWaiting aquí: dejamos que el usuario decida actualizar
  // desde el aviso "Nueva versión disponible" (ver app.js -> checkForUpdate).
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('stockdesk-shell-') && key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Permite que la página fuerce la activación inmediata del SW en espera
// cuando el usuario pulsa "Actualizar ahora".
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo interceptamos peticiones GET de nuestro propio origen (el app
  // shell). Cualquier otra cosa (APIs externas de IA, POST, etc.) va
  // directa a la red sin pasar por caché.
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached); // sin red: usar lo cacheado si existe

        // stale-while-revalidate: responde rápido con caché si existe,
        // y actualiza la caché en segundo plano.
        return cached || networkFetch;
      })
    )
  );
});
