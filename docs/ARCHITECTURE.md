# ARCHITECTURE — StockDesk

## 1. Visión general

StockDesk es una **Single Page Application (SPA) 100% frontend**: HTML5 +
CSS3 + JavaScript ES6+ "vanilla" (sin framework), con Tailwind CSS cargado
vía CDN. No hay build step, no hay bundler, no hay backend propio. Todo el
estado de negocio se persiste en `localStorage` del navegador.

```
┌─────────────────────────────────────────────────────────┐
│                        index.html                        │
│   (carga todos los <script> en orden de dependencia)      │
└───────────────────────────┬───────────────────────────────┘
                             ▼
                        ┌─────────┐
                        │  App    │  js/app.js — entry point
                        └────┬────┘
                             ▼
                        ┌─────────┐
                        │ Router  │  js/router.js — hash routing + RBAC
                        └────┬────┘
                             ▼
                   ┌─────────────────┐
                   │     Pages       │  js/pages/*.js — una por sección
                   └────────┬────────┘
                             ▼
              ┌────────────────────────────┐
              │  Components / Layout        │  js/components*.js — UI genérica
              └────────────┬────────────────┘
                             ▼
                   ┌─────────────────┐
                   │  Business Modules │  js/modules/*.js — lógica de negocio
                   └────────┬────────┘
                             ▼
                        ┌─────────┐
                        │  Store  │  js/store.js — persistencia (localStorage)
                        └────┬────┘
                             ▼
                   ┌─────────────────────┐
                   │  External APIs (opc.)│  GLM/ZhipuAI (IA), CDNs (Tailwind/Fonts)
                   └─────────────────────┘
```

## 2. Capas

### 2.1. Core
- **`js/app.js`**: punto de entrada. Inicializa `Store`, tema, `Router`, el
  asistente de IA (con delay para no bloquear el hilo principal) y el
  registro del Service Worker (PWA).
- **`js/router.js`**: enrutamiento por hash (`#ruta`), con un middleware de
  seguridad que valida sesión (`Store.KEYS.USER`) y permisos por rol (RBAC)
  antes de navegar. **Importante**: este control de acceso es enteramente
  del lado del cliente (ver `docs/SECURITY.md`).
- **`js/store.js`**: capa de acceso a datos. Expone namespaces por dominio
  (`Store.products`, `Store.sales`, `Store.warehouses`, `Store.transactions`,
  `Store.security`, etc.), cada uno con su propio CRUD sobre una clave de
  `localStorage`. Ver sección 4 para el detalle de claves.

### 2.2. UI
- **`js/components.js`**: iconos SVG, `Components.toast()`, `Components.modal()`,
  y la utilidad de seguridad `Sanitize` (`escapeHtml`, `escapeJsString`,
  `csvField`, `isValidUsername`) añadida en la auditoría de producción para
  prevenir XSS/HTML injection.
- **`js/components-layout.js`**: sidebar, header, navegación responsive.

### 2.3. Pages
Un archivo por sección principal (`products.js`, `sales.js`, `inventory.js`,
`finance.js`, `security.js`, `dashboards.js`, `users.js`, `notifications.js`,
`suppliers.js`, `customization.js`, `settings.js`, `reports.js`, `guide.js`,
más las pantallas de onboarding `device-setup.js`, `splash.js`, `landing.js`,
`login.js`). Las páginas orquestan la vista y delegan la lógica de negocio
específica a los módulos correspondientes.

### 2.4. Business Modules
Sub-funcionalidades agrupadas por dominio dentro de `js/modules/`:

| Dominio | Módulos |
|---|---|
| Inventario | `inventory-warehouses`, `inventory-transfers`, `inventory-kardex`, `inventory-kits` |
| Finanzas | `finance-cashflow`, `finance-ledger`, `finance-payroll`, `finance-budgets` |
| Seguridad | `security-auth`, `security-access`, `security-protection`, `security-threats`, `security-backup`, `security-logs` |
| Dashboards | `dashboard-widgets`, `dashboard-charts` |
| IA | `ai-assistant`, `ai-chat`, `ai-advanced` |
| Personalización | `customization-themes`, `customization-tickets` |
| Usuarios | `users-management`, `users-shifts` (nota: `users-roles.js` existe en el repo pero **no está cargado en `index.html`**, es código muerto pendiente de limpieza) |
| Notificaciones | `notifications-center`, `notifications-alerts` |
| Proveedores | `suppliers-directory`, `suppliers-orders` |
| Utilidades | `auth-utils` (hashing SHA-256 de contraseñas), `ticket-printer` (impresión de tickets con escape HTML propio), `guide-content`, `donations` |

### 2.5. Services (parcialmente implementado)

La auditoría de producción identificó que StockDesk **no tiene** hoy una
capa formal de servicios desacoplados (`AIService`, `BackupService`,
`StorageService`, `LicenseService`, `NotificationService`). La lógica de
IA vive directamente en `ai-chat.js`, la de backups en `security-backup.js`,
etc. Esto es funcional para el tamaño actual del proyecto, pero se
recomienda para un futuro backend (ver sección 5) introducir estas
interfaces para poder sustituir implementaciones sin tocar las páginas.

## 3. Flujo de una operación típica: una venta (POS)

1. `pages/sales.js` renderiza el carrito y captura clics de usuario.
2. Al confirmar el pago, `SalesPage.checkout()`:
   - calcula subtotal/descuento/total;
   - llama a `Store.products.updateStock()` por cada línea (nunca deja el
     stock negativo, usa `Math.max(0, ...)`);
   - llama a `Store.sales.add()`, que internamente registra también el
     movimiento en `Store.kardex` automáticamente;
   - opcionalmente llama a `TicketPrinter.printSale()`.
3. Todo lo anterior ocurre de forma síncrona sobre `localStorage`: no hay
   posibilidad de "petición a medias" como en un backend real, pero tampoco
   hay control transaccional multi-pestaña (ver `docs/SECURITY.md`,
   limitaciones de concurrencia).

## 4. Persistencia de datos (`localStorage`)

Cada dominio de datos vive bajo una clave prefijada `stockdesk_*` (ver
`Store.KEYS` en `js/store.js`): productos, ventas, usuario actual,
configuración, dispositivo, almacenes, transferencias, conteos de
inventario, kardex, kits, transacciones, gastos, nómina, presupuestos,
seguridad (config/logs/backups/sesiones), notificaciones, canales, alertas,
proveedores, órdenes de compra, campos personalizados, categorías,
configuración de tickets, tema, colores personalizados, usuarios, roles,
turnos, cajas y logs de auditoría.

**Limitaciones conocidas de `localStorage`** (evaluadas en esta auditoría):
- Límite de tamaño típico de 5-10 MB por origen (varía por navegador).
- Es síncrono y bloqueante; con datasets muy grandes (miles de ventas/kardex)
  puede introducir jank perceptible.
- No hay transacciones atómicas entre múltiples claves: una operación que
  toca `products` y `kardex` (como una venta) hace dos `localStorage.setItem`
  independientes; si el navegador se cierra exactamente entre medias, es
  teóricamente posible una inconsistencia menor (perder el registro de
  kardex de la última línea, no el stock).

**Recomendación de migración progresiva** (no implementada, ver
`docs/PRODUCTION-TODO.md`): si el volumen de datos crece, migrar a
IndexedDB en fases:
- **v1** (actual): `localStorage` plano por clave.
- **v2**: IndexedDB con un objeto por entidad y wrapper que mantenga la
  misma API pública de `Store.*` (para no romper páginas/módulos).
- **v3**: migraciones versionadas explícitas con un campo `schemaVersion`.

## 5. Backend futuro (no implementado)

StockDesk está diseñado para poder incorporar un backend sin reescribir la
UI, siempre que se respete la interfaz pública de `Store.*`. Candidatos
razonables: Supabase, PostgreSQL + API propia, o Vercel Functions. El punto
de entrada natural sería sustituir la implementación interna de `Store` por
llamadas HTTP, manteniendo la misma forma (`getAll()`, `add()`, `update()`,
`delete()`) para minimizar el impacto en páginas y módulos.

## 6. Diagrama de dependencias de carga (`index.html`)

El orden de los `<script>` en `index.html` importa: `store.js` y
`router.js` deben cargar antes que cualquier página/módulo que los use (no
hay imports ES modules, todo es scope global). Esto fue la causa raíz del
incidente P0 corregido en esta auditoría: un `store.js` con sintaxis rota
impedía que **todo** el resto de la aplicación se ejecutara.

---

*Relacionado: `docs/PRODUCTION-AUDIT.md`, `docs/SECURITY.md`,
`docs/DEPLOYMENT.md`.*
