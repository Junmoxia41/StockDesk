# DEPLOYMENT — StockDesk

## 1. Resumen

StockDesk es un sitio estático (HTML/CSS/JS sin build). Se puede desplegar
en cualquier hosting de archivos estáticos; este documento se centra en
**Vercel**, para el cual se incluye `vercel.json`.

## 2. Entornos

| Entorno | Cómo se ejecuta | Uso |
|---|---|---|
| **Local** | `python3 -m http.server 8080` (u otro servidor estático) desde la raíz del repo | Desarrollo día a día |
| **Preview** | Deploy automático de Vercel por cada Pull Request/rama | Revisar cambios antes de producción |
| **Production** | Deploy de Vercel sobre la rama de producción (normalmente `main`) | Uso real |

No existen variables de entorno "de servidor" porque no hay backend propio;
ver `docs/ENVIRONMENT.md` para las claves que sí son relevantes (API key de
IA, configurada por el usuario final desde la propia UI, no como env var de
build).

## 3. Desplegar en Vercel

1. Conectar el repositorio de GitHub (`Junmoxia41/StockDesk`) en el
   dashboard de Vercel.
2. Framework preset: **Other** (sitio estático, no hay build step).
3. Build command: dejar vacío (no hay build).
4. Output directory: `.` (raíz del repo, donde está `index.html`).
5. Vercel detectará `vercel.json` automáticamente para:
   - reescribir rutas SPA hacia `index.html` (excepto `js/`, `css/`,
     `assets/`, `favicon.ico`, `manifest.webmanifest` y `service-worker.js`,
     que deben servirse tal cual);
   - servir `service-worker.js` con `Cache-Control: no-cache` (para que los
     navegadores siempre consulten si hay una versión nueva del propio
     Service Worker, un requisito estándar de PWA);
   - servir `manifest.webmanifest` con el `Content-Type` correcto;
   - cabeceras de seguridad básicas (`X-Content-Type-Options`,
     `X-Frame-Options`, `Referrer-Policy`).
6. Desplegar. Cada Pull Request generará automáticamente un Preview
   Deployment con su propia URL.

## 4. SPA routing y "fallback"

StockDesk usa **hash routing** (`#dashboard`, `#products`, etc. — ver
`js/router.js`), por lo que técnicamente no depende de rewrites de servidor
para las rutas internas de la aplicación (el hash nunca llega al servidor).
El rewrite en `vercel.json` cubre igualmente el caso de recargar la página
raíz o compartir la URL, sirviendo siempre `index.html` para cualquier ruta
que no sea un asset conocido.

## 5. Service Worker y estrategia de caché (PWA)

- `service-worker.js` cachea únicamente el "app shell" (HTML/CSS/JS/íconos
  propios) con estrategia *stale-while-revalidate*.
- **Nunca cachea** peticiones cross-origin (CDN de Tailwind/Fonts, ni la API
  de IA), para no servir contenido desactualizado de terceros ni datos
  potencialmente sensibles.
- Los datos de negocio del usuario **nunca** pasan por el Service Worker:
  viven en `localStorage`, no en el Cache Storage.
- Flujo de actualización: cuando se publica una nueva versión, el navegador
  descarga el nuevo `service-worker.js` en segundo plano; StockDesk muestra
  un toast "Nueva versión disponible. Toca para actualizar." (ver
  `App.registerServiceWorker()` en `js/app.js`). Al hacer clic, el nuevo
  Service Worker toma control y la página se recarga una vez. Esto evita
  perder datos o forzar recargas no solicitadas por el usuario.
- Si cambias cualquier archivo del "app shell", **sube el número de versión
  `CACHE_VERSION`** en `service-worker.js` para invalidar la caché anterior.

## 6. HTTPS y dominio

Vercel provee HTTPS automático. Los Service Workers **requieren HTTPS**
(o `localhost` en desarrollo) para poder registrarse; en `http://` sobre un
dominio real, el registro fallará silenciosamente (StockDesk lo maneja con
un `catch` y sigue funcionando sin modo offline).

## 7. Checklist previo a marcar un release como "producción"

Ver `docs/PRODUCTION-CHECKLIST.md` para la lista completa. En resumen:
instalación, POS, inventario, finanzas, dashboard, seguridad, backups,
exportación, responsive, PWA, offline, Vercel, consola sin errores.

---

*Relacionado: `docs/ENVIRONMENT.md`, `docs/ARCHITECTURE.md`,
`docs/PRODUCTION-CHECKLIST.md`.*
