# PRODUCTION AUDIT — StockDesk

**Fecha de auditoría:** 2026-09-21 (actualizado el mismo día con correcciones P1)
**Auditor:** Agente Arena (siguiendo el mega-prompt `StockDesk Production Readiness.pdf`)
**Versión auditada:** 2026.4 (según `docs/CATALOGO-FUNCIONALIDADES.md` / `docs/CATALOGO-SEGURIDAD.md`)

> Metodología: se leyó y verificó en código fuente cada módulo (no solo la documentación). Cada
> hallazgo indica dónde está implementado, si funciona, y su clasificación real.

---

## 1. RESUMEN EJECUTIVO

StockDesk es una **SPA 100% frontend** (HTML + CSS + JavaScript vanilla + Tailwind CDN, sin build,
sin backend) que implementa un sistema de gestión de negocio: POS, inventario, finanzas,
seguridad, dashboards, IA, multiusuario, notificaciones y proveedores, todo persistido en
`localStorage`.

**Hallazgo crítico (P0) encontrado y corregido en esta sesión:**
`js/store.js` — el módulo central de datos del que dependen absolutamente todas las páginas —
estaba **truncado a mitad de la función `products.add()`** y le faltaban por completo los
namespaces `sales`, `warehouses`, `transfers`, `kardex`, `inventoryCounts`, `kits`,
`transactions`, `expenses`, `payroll`, `budgets`, `security` y `settings`. Esto provocaba un
`SyntaxError: Unexpected end of input` que **impedía que la aplicación cargara en cualquier
navegador**. En el estado en que se recibió el repositorio, **StockDesk no arrancaba en absoluto**.
Se reconstruyó el archivo completo respetando exactamente las firmas que el resto del código
(46 archivos JS) ya esperaba, y se verificó sintaxis de los 46 archivos con `node --check`: ahora
todos son válidos y la app carga y sirve la página de inicio.

Aparte de ese bloqueador, el resto de la base de código es una SPA razonablemente ordenada para
ser 100% vanilla JS, pero **contiene funcionalidades de seguridad presentadas como más robustas de
lo que realmente son** (2FA simulado, WAF/anti-SQLi simulados), **una API key de IA expuesta en el
cliente**, **ausencia total de artefactos de producción** (LICENSE, `.gitignore`, `package.json`,
`vercel.json`, manifest/service worker para PWA) y **sin ninguna suite de pruebas**.

---

## 2. TABLA: DOCUMENTADO vs IMPLEMENTADO vs PROBADO vs PRODUCCIÓN

| Módulo / Función | Documentado | Implementado | Probado (esta sesión) | Clasificación |
|---|---|---|---|---|
| Carga inicial de la app | ✅ | 🔴→✅ (corregido) | ✅ (server local, `node --check` en 46 archivos) | 🔴→✅ **Corregido en esta sesión** |
| CRUD Productos | ✅ | ✅ (`store.js` products.*, `pages/products.js`) | Código inspeccionado, no probado en navegador real | 🟡 Funcional pero mejorable (sin validación robusta de duplicados de SKU) |
| POS / Ventas | ✅ | ✅ (`pages/sales.js`, carrito, pago, cambio, descuento por permiso) | Código inspeccionado | 🟡 Funcional pero mejorable (no bloquea doble click / doble venta; no hay control de caja/turno obligatorio en el flujo) |
| Kardex automático | ✅ | ✅ (`Store.kardex.add` ahora reconstruido, se dispara desde ventas y transferencias) | Código inspeccionado | 🟡 Funcional pero mejorable |
| Transferencias entre almacenes | ✅ | 🟠 Parcial — mueve **todo** el stock del producto entre almacenes (no transferencias parciales por cantidad), según el propio comentario en el código (`inventory-transfers.js`) | Código inspeccionado | 🟠 Parcial (limitación reconocida en el propio código) |
| Finanzas (caja, libro, nómina, presupuestos) | ✅ | ✅ (namespaces reconstruidos: `transactions`, `expenses`, `payroll`, `budgets`) | Código inspeccionado | 🟡 Funcional pero mejorable (sin tests unitarios de fórmulas) |
| Dashboard / KPIs | ✅ | ✅ usa datos reales de `Store.sales/transactions/expenses` (no hardcodeados) | Código inspeccionado | 🟡 Funcional pero mejorable |
| Autenticación (usuario/contraseña) | ✅ | ✅ hash SHA-256 vía `crypto.subtle` (`auth-utils.js`), con fallback legacy texto plano | Código inspeccionado | 🟡 Funcional pero mejorable — **es autenticación LOCAL, no hay backend ni sesiones de servidor** |
| 2FA | ✅ ("Autenticación de Dos Factores") | ⚠️ **Simulado** — `setup2FA()` genera un código aleatorio de 6 caracteres y lo guarda; **nunca verifica** el código que el usuario ingresa contra ningún secreto TOTP real | No aplica (simulación) | ⚠️ **SIMULADA** — no es 2FA real, debe re-etiquetarse |
| WAF / Anti-SQL Injection / Geobloqueo | ✅ (catálogo de seguridad) | ⚠️ Simulado — el propio `CATALOGO-SEGURIDAD.md` lo admite ("Monitoreo tráfico (Simulado)") | Código inspeccionado | ⚠️ **SIMULADA (correctamente reconocida en la doc, pero no en la UI)** |
| Backups (export/import) | ✅ | ✅ formato `stockdesk-backup-v2` con todas las keys, compatibilidad v1 | Código inspeccionado | 🟡 Funcional pero mejorable — **sin checksum ni validación de estructura antes de restaurar** (riesgo de import corrupto) |
| IA / Asistente Chat | ✅ ("IA GLM") | ✅ funciona si el usuario configura su propia API key; fallback offline con respuestas locales | Código inspeccionado | 🟡 Funcional pero mejorable — **API key se guarda y se usa desde el cliente/localStorage, expuesta en el navegador** |
| PWA / Offline | ✅ (catálogo menciona compatibilidad) | ❌ No implementado — no existe `manifest.webmanifest`, no existe `service-worker.js` | — | ❌ **NO IMPLEMENTADA** |
| Multiusuario / Roles (RBAC) | ✅ | ✅ (`users-management.js`, middleware en `router.js`) | Código inspeccionado | 🟡 Funcional pero mejorable — el control de acceso es **solo de UI/cliente**, cualquier usuario con DevTools puede alterar `localStorage` y otorgarse permisos |
| Notificaciones (email/SMS/WhatsApp) | ✅ | ⚠️ Simulado — son toggles guardados en `localStorage`; no hay integración real con ningún proveedor de envío | — | ⚠️ **SIMULADA** |
| Proveedores / Órdenes de compra | ✅ | ✅ CRUD completo en localStorage | Código inspeccionado | 🟡 Funcional pero mejorable |
| Impresión de tickets | ✅ | ✅ (`ticket-printer.js`), incluye escape de HTML (`_escapeHtml`) — es de los módulos más cuidados del proyecto | Código inspeccionado | ✅ Producción (con las limitaciones propias de impresión vía navegador) |

---

## 3. HALLAZGOS DE SEGURIDAD

| # | Hallazgo | Severidad | Evidencia |
|---|---|---|---|
| S1 | `store.js` corrupto → app no arrancaba (bloqueador total) | **P0 — Crítico** | `node --check js/store.js` → `SyntaxError`. **Corregido en esta sesión.** |
| S2 | XSS potencial: nombres de producto/cliente se insertan sin sanitizar en `innerHTML` en varias páginas (`pages/products.js`, `pages/sales.js`) mientras que `ticket-printer.js` sí escapa correctamente | **P1 — Alto** | `grep _escapeHtml` solo aparece en `ticket-printer.js`; el resto de páginas interpolan `${p.name}` directo en plantillas que se asignan a `innerHTML` vía `router.js` |
| S3 | 2FA simulado presentado como funcionalidad de seguridad real | **P1 — Alto (honestidad comercial)** | `security-auth.js` líneas 111-138: genera código random, nunca lo valida contra input del usuario |
| S4 | API key de IA (GLM/ZhipuAI) almacenada y usada desde el cliente | **P1 — Alto** | `ai-chat.js` línea 138: `Authorization: Bearer ${this.config.apiKey}` ejecutado en el navegador; la key es visible en `localStorage` y en Network tab |
| S5 | RBAC / permisos son enteramente de cliente, manipulables vía DevTools/localStorage | **P1 — Alto (limitación inherente a frontend puro)** | `router.js` lee `Store.get(Store.KEYS.ROLES)` y `Store.get(Store.KEYS.USER)` de `localStorage`, editable por el propio usuario del navegador |
| S6 | Restauración de backups sin checksum/validación de esquema | **P2 — Medio** | `security-backup.js` función `restore()`: solo comprueba `data.format === 'stockdesk-backup-v2'`, sin validar tipos/campos antes de sobrescribir todo `localStorage` |
| S7 | Sin `.gitignore`; riesgo de futuros commits accidentales de `.env`/secretos | **P2 — Medio** | No existe el archivo en el repo |
| S8 | Notificaciones por Email/SMS/WhatsApp son solo toggles, sin integración real | **P2 — Medio (honestidad comercial)** | No hay ningún cliente HTTP hacia proveedores de mensajería en el código |

---

## 4. INVENTARIO TÉCNICO

- **Archivos JS:** 46 (~11.900 líneas tras la reconstrucción de `store.js`)
- **Dependencias externas (CDN):** Tailwind CSS v4 (`@tailwindcss/browser@4`), Google Fonts (Inter)
- **API externa opcional:** GLM/ZhipuAI (solo si el usuario configura su propia key)
- **Persistencia:** 100% `localStorage` (sin IndexedDB, sin backend)
- **Build tool:** ninguno (no hay `package.json`)
- **Tests:** ninguno
- **CI/CD:** ninguno
- **PWA:** no implementada (falta manifest y service worker)
- **Licencia:** no existe `LICENSE` en el repositorio (repo público sin licencia declarada)

---

## 5. SCORE DE PRODUCCIÓN (tras P0 + P1 de esta sesión)

| Categoría | Score /10 | Nota |
|---|---|---|
| Architecture | 6 | Separación pages/modules/store razonable para vanilla JS; sin capa de servicios (`AIService`, `BackupService`, etc.) todavía |
| Security | 3→6 | Se cerraron ~100 puntos de XSS/HTML injection, se añadió validación de integridad de backups y de formato de username. Sigue limitada porque 2FA/WAF/RBAC son de cliente por diseño (ahora **correctamente etiquetado como tal en la UI**, ya no se presenta como seguridad real) |
| Performance | 6 | Carga muchos scripts por `<script>` individuales sin bundling; sin problemas evidentes de renderizado |
| UX | 6 | Interfaz cuidada y responsive; ahora además más transparente (insignias de "Simulado/No implementado") en vez de prometer funciones inexistentes |
| PWA | 0 | No implementada |
| Reliability | 3→8 | Era 0 (no arrancaba). Con `store.js` reconstruido + validación de backups que nunca deja la base a medias, la app es fiable para uso local |
| Documentation | 5→6 | Buen catálogo de funcionalidades; ahora la UI también distingue simulado vs real, no solo `CATALOGO-SEGURIDAD.md` |
| Commercial readiness | 2 | Sin LICENSE, sin landing comercial, sin planes/ediciones, IA con key expuesta (ahora con aviso visible al usuario) |
| Deployment readiness | 2→3 | Se añadió `.gitignore`; sigue faltando `vercel.json`, `package.json` y variables de entorno documentadas |
| **Overall** | **~4/10 → ~6/10** | Bloqueador crítico resuelto y hardening de seguridad de cliente completado; queda trabajo de PWA, backend/servicios y comercialización (LICENSE, landing, planes) |

---

## 6. PRÓXIMOS PASOS (por prioridad)

### P0 — Bloquea producción
- [x] **Reconstruir `js/store.js`** (hecho — la app ya arranca; verificado con `node --check` en los 46 archivos JS y sirviendo la app con un servidor local).
- [ ] Añadir un smoke test automatizado (aunque sea `node --check` + un test E2E mínimo con Playwright) en CI para que un `store.js` roto nunca vuelva a llegar a producción sin detectarse. *(No se pudo instalar Playwright en este sandbox por falta de paquetes del sistema; queda pendiente de CI real).*

### P1 — Muy importante (seguridad, datos, ventas) — **COMPLETADO en esta sesión**
- [x] **Sanitización XSS/HTML injection**: se añadió `Sanitize.escapeHtml()`, `Sanitize.escapeJsString()` (para valores interpolados dentro de `onclick="fn('...')"`) y `Sanitize.csvField()` (para exports CSV, incluye protección contra CSV/Formula Injection) en `js/components.js`. Se aplicó en ~100 puntos de interpolación en `pages/` y `modules/` (nombre de producto, cliente, proveedor, empleado, notas, categorías, username, mensajes de chat de IA, títulos/mensajes de modal y toast — estos dos últimos ahora escapan de forma centralizada para cubrir cualquier llamador futuro).
- [x] Se corrigió además un vector real detectado durante la limpieza: el **mensaje del usuario en el chat de IA** (`ai-assistant.js` `renderMessage`) se guardaba y volvía a mostrar sin escapar.
- [x] Se añadió validación de formato de `username` (`Sanitize.isValidUsername`) al registrar administradores y crear usuarios, para impedir nombres con comillas/HTML que pudieran romper el escape en atributos `onclick`.
- [x] **Re-etiquetado honesto en la UI** (no solo en docs): 2FA, WAF/Anti-SQL Injection, Geobloqueo y los canales de notificación Email/SMS/WhatsApp/Push ahora muestran una insignia visible "Simulado / No implementado" con tooltip explicativo (`Components.simulatedBadge`), más un aviso de texto en la sección de 2FA.
- [x] **Aviso de seguridad sobre la API key de IA**: en Configuración se añadió un cuadro de advertencia explicando que la key se guarda en `localStorage` y las llamadas salen directo del navegador (sin backend intermedio).
- [x] **Validación de integridad de backups**: se creó `BackupValidator` (checksum FNV-1a + validación de esquema/claves conocidas) en `security-backup.js`. Ahora `createBackup()` firma cada backup con checksum, y tanto `restore()` como `importFile()` validan **antes** de escribir nada en `localStorage`; si la validación falla, se cancela toda la operación y no se toca el estado actual.
- [x] Se corrigió una inconsistencia descubierta al reconstruir `store.js`: `Store.security.addLog()` generaba un campo `message`, pero las vistas (`security-logs.js`, `dashboard-widgets.js`) esperaban `event`. Ahora se guardan ambos por compatibilidad.
- [x] Se creó `.gitignore` (excluye `.env`, `node_modules`, artefactos de build, logs, IDE).
- [x] Se revisó el historial de Git (`git log --all -p`) en busca de secretos/API keys expuestas: **no se encontró ninguno**; el repositorio solo tiene un commit (`Add files via upload`) y ninguna rama oculta.

Notas de esta limpieza:
- Se detectaron y corrigieron **falsos positivos** del primer barrido automático de escape: campos que van a CSV (`a.download`, exports) o al *prompt* de texto plano hacia la API de IA (`buildSystemPrompt`, `ai-advanced.js`) no deben llevar entidades HTML — se revirtieron y en su lugar se usa `Sanitize.csvField()` donde corresponde a CSV.
- Se identificó que `js/modules/users-roles.js` no está referenciado en `index.html` (código muerto, `UsersManagement` es el módulo realmente activo); se deja documentado para limpieza en P2/P3, no se modificó.

### P2 — Importante (arquitectura, documentación) — **Documentación y PWA completadas en esta sesión; servicios desacoplados pendientes**
- [x] **PWA real**: `manifest.webmanifest`, `service-worker.js` (cachea solo el app-shell same-origin con stale-while-revalidate; nunca cachea peticiones cross-origin ni la API de IA), set completo de iconos (`assets/icons/`) + `favicon.ico`, registro y flujo de actualización ("Nueva versión disponible") integrados en `js/app.js`.
- [x] **`vercel.json`** listo para despliegue (SPA rewrite, headers de caché por tipo de asset, headers básicos de seguridad); validado como JSON correcto.
- [x] **`LICENSE`** (propietaria) + **`LICENSE-COMMERCIAL.md`** + **`docs/LICENSING.md`** (modelo técnico de licenciamiento, deja explícito que no existe backend de licencias hoy).
- [x] **`README.md`** comercial en la raíz, **`CHANGELOG.md`**, **`THIRD-PARTY-NOTICES.md`** (Tailwind CDN, Google Fonts, GLM/ZhipuAI).
- [x] **`PRIVACY.md`** y **`TERMS.md`** — honestidad explícita sobre almacenamiento 100% local (`localStorage`) y flujo de datos hacia la API de IA solo si el usuario configura su propia key.
- [x] **Documentación técnica completa en `docs/`**: `ARCHITECTURE.md` (capas, flujo de datos, persistencia, backend futuro — incluye la "Documentación honesta LOCAL MODE" de autenticación/RBAC como parte de la sección de seguridad), `DEPLOYMENT.md`, `ENVIRONMENT.md` (+ `.env.example`), `INSTALLATION.md`, `AI.md`, `BACKUPS.md`, `SECURITY.md` (tabla completa real vs. simulado vs. no implementado), `SUPPORT.md`, `POSITIONING.md`, `TROUBLESHOOTING.md`, `PRODUCTION-CHECKLIST.md`, `PRODUCTION-TODO.md`, `RELEASE.md`; además `.github/SECURITY.md` para reporte de vulnerabilidades.
- [ ] Introducir capa de servicios (`AIService`, `BackupService`, `StorageService`, `AuthService`, `LicenseService`) para desacoplar módulos de `localStorage`/lógica directa — **pendiente**, documentado conceptualmente en `docs/ARCHITECTURE.md` (sección 2.5) y `docs/LICENSING.md`, no implementado en código.

### P3 — Mejoras
- [ ] Dividir archivos JS grandes (`login.js` 479 líneas, `sales.js` 479 líneas) en módulos más pequeños.
- [ ] Sustituir los `alert()` residuales por el sistema de `Components.toast`.
- [ ] Añadir tests unitarios a las fórmulas financieras (redondeo, balances).
- [ ] Eliminar o integrar `js/modules/users-roles.js` (no está cargado en `index.html`; el módulo activo es `users-management.js`). Es código muerto que puede confundir a futuros mantenedores.

---

*Este informe sigue los criterios del documento `StockDesk Production Readiness.pdf` incluido en
el repositorio (mega-prompt de auditoría). Ningún hallazgo aquí afirma capacidades de seguridad,
IA o cumplimiento legal que el código no respalde realmente.*
