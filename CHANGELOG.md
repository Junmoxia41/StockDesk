# Changelog

Todos los cambios relevantes de StockDesk se documentan en este archivo.
Formato inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Ver `docs/RELEASE.md` para el proceso de publicación.

## [Unreleased]

### Agregado
- Documentación comercial y técnica completa: `README.md`, `LICENSE`,
  `LICENSE-COMMERCIAL.md`, `PRIVACY.md`, `TERMS.md`,
  `THIRD-PARTY-NOTICES.md`, y toda la carpeta `docs/` (arquitectura,
  despliegue, IA, backups, seguridad, soporte, posicionamiento, entorno,
  instalación, troubleshooting, checklist de producción, roadmap técnico y
  proceso de release).
- Soporte PWA: `manifest.webmanifest`, `service-worker.js` (cachea solo el
  app shell propio, nunca peticiones a la API de IA ni a CDNs externos),
  set completo de iconos (`assets/icons/`) y `favicon.ico`.
- Flujo de "Nueva versión disponible" integrado en `js/app.js`
  (`registerServiceWorker`, `notifyUpdateAvailable`).
- `vercel.json` para despliegue en Vercel (SPA rewrite, headers de caché
  diferenciados por tipo de asset, headers básicos de seguridad).
- `docs/PRODUCTION-AUDIT.md`: auditoría completa de producción,
  clasificando cada funcionalidad como PRODUCCIÓN / FUNCIONAL PERO
  MEJORABLE / PARCIAL / ROTA / SIMULADA / NO IMPLEMENTADA.
- Utilidad de sanitización centralizada `Sanitize` en `js/components.js`
  (`escapeHtml`, `escapeJsString`, `csvField`, `isValidUsername`), aplicada
  en ~100 puntos de renderizado de datos de usuario para prevenir
  XSS/HTML injection.
- Validación de integridad de backups (checksum + validación de esquema)
  antes de restaurar o importar, cancelando toda la operación si algo no
  coincide.
- `.gitignore` del proyecto.

### Corregido
- Error de sintaxis fatal en `js/store.js` que impedía que **toda** la
  aplicación cargara (bug bloqueante P0).
- Múltiples puntos de inyección HTML/XSS en páginas y módulos (ventas,
  reportes, personalización, notificaciones, finanzas, inventario,
  seguridad, usuarios).

### Cambiado
- `index.html`: agregadas meta etiquetas (descripción, Open Graph),
  enlaces de manifest/favicons/apple-touch-icon, y comentario explicando
  la decisión de `noindex`.

## [2026.1] - 2026-08-31

- Versión inicial subida al repositorio (`Add files via upload`): POS,
  inventario multi-almacén, finanzas básicas, seguridad (con funciones
  simuladas sin backend), dashboards, asistente de IA opcional,
  personalización y notificaciones.

---

*Nota: las fechas y el versionado detallado de commits previos al
`Add files via upload` inicial no están disponibles porque el repositorio
se subió como un único commit histórico.*
