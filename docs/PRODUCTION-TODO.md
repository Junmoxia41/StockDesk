# PRODUCTION TODO — StockDesk

Lista viva de trabajo pendiente identificado durante la auditoría de
producción (`docs/PRODUCTION-AUDIT.md`), organizada por fase. Esto **no**
es un compromiso de fechas, es un registro de próximos pasos técnicos.

## P0 — Bloqueantes (completado)

- [x] Corregir error de sintaxis fatal en `js/store.js` que impedía cargar
      toda la aplicación.

## P1 — Seguridad y honestidad de UI (completado, ver `docs/PRODUCTION-AUDIT.md`)

- [x] Sanitización XSS/HTML injection en ~100+ puntos de renderizado.
- [x] Validación de integridad de backups (checksum + validación de
      esquema) antes de restaurar/importar.
- [x] `.gitignore` para excluir artefactos y secretos.
- [x] Auditoría del historial de git en busca de secretos expuestos.
- [ ] Etiquetado "Simulado" completo en `security-threats.js` y
      `security-access.js` (parcialmente aplicado, revisar cobertura total
      de toggles).
- [ ] Revisar y corregir mismatch de escapador detectado en
      `donations.js:80` (uso de `onclick` con posible escape incorrecto).
- [ ] Completar auditoría XSS de archivos aún no revisados:
      `js/pages/{inventory,finance,security,dashboards,users,landing,splash,device-setup}.js`,
      `js/modules/{security-protection,notifications-alerts,guide-content}.js`,
      `js/components-layout.js`.

## P2 — Producto comercial y despliegue (en curso)

- [x] PWA: `manifest.webmanifest`, `service-worker.js`, iconos, registro
      en `js/app.js`.
- [x] `vercel.json` para despliegue en Vercel.
- [x] Documentos legales base: `LICENSE`, `LICENSE-COMMERCIAL.md`,
      `docs/LICENSING.md`, `PRIVACY.md`, `TERMS.md`.
- [x] Documentación técnica: `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`,
      `docs/AI.md`, `docs/BACKUPS.md`, `docs/SECURITY.md`,
      `docs/SUPPORT.md`, `docs/POSITIONING.md`, `docs/ENVIRONMENT.md`,
      `docs/INSTALLATION.md`, `docs/TROUBLESHOOTING.md`.
- [x] `README.md` comercial, `CHANGELOG.md`, `THIRD-PARTY-NOTICES.md`.
- [ ] Capa de servicios desacoplados (`StorageService`, `AuthService`,
      `AIService`, `BackupService`, `LicenseService`) — hoy la lógica vive
      directamente en páginas/módulos (ver `docs/ARCHITECTURE.md`,
      sección 2.5).

## P3 — Mantenibilidad de código (no iniciado)

- [ ] Dividir archivos JS grandes hacia un objetivo aproximado de ~200
      líneas por archivo, donde sea razonable sin romper cohesión lógica.
- [ ] Eliminar código muerto: `js/modules/users-roles.js` (no está cargado
      en `index.html`).
- [ ] Evaluar introducir un `LicenseService` real si se decide comercializar
      con activación de licencias (ver `docs/LICENSING.md`).
- [ ] Evaluar migración progresiva de `localStorage` a IndexedDB si el
      volumen de datos lo justifica (ver `docs/ARCHITECTURE.md`, sección 4).

---

*Este archivo debe actualizarse cada vez que se cierre o abra un ítem de
trabajo relevante para producción.*
