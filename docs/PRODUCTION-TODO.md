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
- [x] Etiquetado "Simulado/No implementado" completo en `security-threats.js`,
      `security-access.js`, `security-auth.js` y `security-protection.js`
      (incluye la corrección del "Nivel de Seguridad" engañoso y la
      eliminación de menciones a "AES-128/256/Militar" sin cifrado real).
- [x] Corregido mismatch de escapador en `donations.js` (ahora usa
      `Sanitize.escapeJsString()` para valores dentro de `onclick`).
- [x] Completada auditoría XSS de los archivos que quedaban pendientes:
      `js/pages/{inventory,finance,dashboards,users,landing,splash,device-setup,login}.js`
      (sin hallazgos nuevos, salvo refuerzo de escape en la tabla de
      auditoría de `users.js`), `js/modules/{notifications-alerts,guide-content}.js`,
      `js/components-layout.js` (sin hallazgos: solo interpolan datos
      internos, no input de usuario). Nota: `js/pages/security.js` y sus
      submódulos también quedaron cubiertos como parte del trabajo de
      etiquetado honesto de esta misma ronda.

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

## P3 — Mantenibilidad de código (en curso)

- [x] Eliminar código muerto: `js/modules/users-roles.js` (no estaba cargado
      en `index.html`).
- [x] Corregido bloqueador crítico: el Asistente de IA (`ai-assistant.js`,
      `ai-chat.js`, `ai-advanced.js`) nunca se cargaba en `index.html`.
- [x] **Capa de servicios desacoplados** (`js/services/`): `StorageService`,
      `AuthService`, `AIService`, `BackupService`, `LicenseService` +
      `FeatureFlags`. Integrados realmente en el código existente (no solo
      añadidos y sin usar): `Store.get/set/remove` delegan en
      `StorageService`; `router.js`, `components-layout.js`, `login.js`,
      `security-auth.js` y `users-management.js` usan `AuthService`;
      `settings.js` usa `AIService`; `security-backup.js` usa
      `BackupService`. `LicenseService`/`FeatureFlags` son código nuevo
      LOCAL/DEMO (ver `docs/LICENSING.md`), sin ninguna página consultándolo
      todavía porque no hay bloqueo de funciones por edición implementado.
      Verificado end-to-end con un sandbox de Node que carga los ~60
      archivos JS en el orden exacto de `index.html` (login, RBAC, cambio
      de contraseña, creación/validación de backups, disponibilidad de IA).
- [ ] Dividir archivos JS grandes hacia un objetivo aproximado de ~200
      líneas por archivo, donde sea razonable sin romper cohesión lógica.
- [ ] Evaluar migración progresiva de `localStorage` a IndexedDB si el
      volumen de datos lo justifica (ver `docs/ARCHITECTURE.md`, sección 4).

---

*Este archivo debe actualizarse cada vez que se cierre o abra un ítem de
trabajo relevante para producción.*
