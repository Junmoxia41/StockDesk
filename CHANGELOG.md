# Changelog

Todos los cambios relevantes de StockDesk se documentan en este archivo.
Formato inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Ver `docs/RELEASE.md` para el proceso de publicación.

## [Unreleased]

### Agregado (apps nativas Windows / Android)
- Nueva carpeta `native/` que empaqueta la misma app web como app nativa,
  sin reescribir código de negocio: un servidor HTTP local compartido
  (`native/server.py`, solo librería estándar) sirve `index.html`/`css`/
  `js`/`assets` desde `127.0.0.1`.
  - **Windows**: `native/windows/main.py` (pywebview) + `build.spec` de
    PyInstaller para generar un único `StockDesk.exe`.
  - **Android**: `native/android/main.py` + `buildozer.spec` usando el
    bootstrap `webview` de python-for-android (sin Kivy) para generar un
    `.apk`.
- `.github/workflows/build-windows.yml` y `.github/workflows/build-android.yml`:
  compilan ambos binarios en runners reales de GitHub Actions
  (`workflow_dispatch` o al crear un tag `v*`), y los publican como
  artifact descargable y, en tags, como asset de una Release.
- `docs/NATIVE-APPS.md`: guía honesta de cómo compilar, descargar e
  instalar ambas apps, incluyendo limitaciones (sin sincronización entre
  dispositivos, APK firmado en modo debug, sin auto-actualización).
- `assets/icons/icon-256.ico` generado a partir del icono PWA existente
  para el `.exe` de Windows.

### Agregado (paquete de venta / cesión de derechos)
- `docs/ASSET-SALE.md`: guía para plantear la venta total de StockDesk
  (cesión de derechos) vs. seguir licenciando (modelo ya existente en
  `LICENSE-COMMERCIAL.md`), con checklist de due diligence honesto.
- `docs/COPYRIGHT-ASSIGNMENT-TEMPLATE.md`: borrador de contrato de cesión
  de derechos de autor, explícitamente marcado como plantilla a revisar
  por un abogado antes de firmarse.

### Agregado (capa de servicios)
- Nueva carpeta `js/services/` con fachadas desacopladas, genuinamente
  integradas en el código existente (no solo añadidas sin uso real):
  - `StorageService`: envuelve `localStorage`; `Store.get/set/remove` ahora
    delegan en él.
  - `AuthService`: sesión local y hashing de contraseñas; usado por
    `router.js` (middleware RBAC), `components-layout.js` (sidebar/logout),
    `login.js`, `security-auth.js` (cambio de contraseña) y
    `users-management.js`.
  - `AIService`: configuración de la API key de IA; usado por
    `settings.js`.
  - `BackupService`: creación/validación/restauración de backups; usado
    por `security-backup.js` (reemplaza la lógica duplicada que antes vivía
    solo en ese módulo).
  - `LicenseService` + `FeatureFlags`: primera implementación real (aunque
    LOCAL/DEMO, sin backend) del modelo conceptual descrito en
    `docs/LICENSING.md`. Ninguna página bloquea funciones con esto todavía.
- Verificación end-to-end de la integración con un sandbox de Node que
  carga los ~60 archivos JS en el orden exacto de `index.html` (login,
  RBAC por rol, cambio de contraseña, creación/validación de backups).

### Corregido (crítico)
- **El Asistente de IA nunca se cargaba en producción**: `js/modules/ai-assistant.js`,
  `js/modules/ai-chat.js` y `js/modules/ai-advanced.js` existían completos y eran
  sintácticamente válidos, pero no estaban enlazados en `index.html`. Se agregaron
  los tres `<script>` en el orden de dependencia correcto, y se conectó
  `ai-advanced.js` (predicciones/recomendaciones) al flujo de respuesta del chat.
  Se subió `CACHE_VERSION` en `service-worker.js` para invalidar el app-shell
  cacheado por instalaciones PWA previas a esta corrección.

### Eliminado
- `js/modules/users-roles.js`: código muerto, no estaba cargado en
  `index.html` (el módulo activo de gestión de usuarios es
  `users-management.js`).

### Cambiado (adicional)
- Etiquetado honesto de funciones simuladas ampliado a los interruptores
  que faltaban: Protección Fuerza Bruta y Anti-SQL Injection
  (`security-threats.js`), Restricción por IP (`security-access.js`),
  Encriptación de datos, Enmascaramiento de Datos, Borrado Seguro y Nivel
  de Encriptación (`security-auth.js`/`security-protection.js`). Se
  eliminaron las menciones a "AES-128/AES-256/Militar" que sugerían
  cifrado real donde no existe ninguna implementación de cifrado en el
  código.
- El "Nivel de Seguridad" de la pantalla de Seguridad se renombró a "Nivel
  de Configuración" con una insignia aclaratoria, para no insinuar una
  auditoría de seguridad real.
- Corregido mismatch de escapador en `donations.js` (`escapeJsString` en
  vez de `escapeHtml` dentro de atributos `onclick`).
- Reforzado el escape en la tabla de auditoría de usuarios (`js/pages/users.js`).

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
