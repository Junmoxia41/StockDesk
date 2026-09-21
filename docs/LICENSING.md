# LICENSING — Modelo de Licencias de StockDesk

> Este documento describe el **modelo técnico** de licenciamiento pensado
> para StockDesk. Para los términos legales, ver `LICENSE` y
> `LICENSE-COMMERCIAL.md`. Nada de lo aquí descrito implica que exista hoy
> un backend de validación de licencias: **la validación descrita en este
> documento es LOCAL/DEMO**, no hay servidor de licencias todavía.

## 1. Estado actual (honesto)

StockDesk **no tiene hoy** un sistema de activación/validación de licencias
contra un servidor. Cualquier persona con el código puede ejecutar la
aplicación completa sin restricciones reales. Desde la ronda P3 de la
auditoría de producción existe una primera implementación de
`LicenseService`/`FeatureFlags` en `js/services/license-service.js`, pero
es explícitamente **LOCAL/DEMO**: `activate()`/`deactivate()` solo guardan
una preferencia en `localStorage`, y `validate()` siempre resuelve válido
porque no hay ningún servidor contra el que validar. Ninguna página
consulta todavía `LicenseService`/`FeatureFlags` para bloquear una función:
son la base para cuando se decida implementar ese bloqueo, no una
funcionalidad de licenciamiento activa hoy. Este documento describe la
arquitectura **propuesta** para cuando exista un backend real (ver
`docs/ARCHITECTURE.md`, sección "Backend futuro").

## 2. Ediciones propuestas

| Edición | Público objetivo | Módulos incluidos (referencia) |
|---|---|---|
| **FREE / DEMO** | Evaluación | Productos, POS básico, Reportes básicos, datos de demostración |
| **STARTER** | Negocio pequeño, 1 caja | Productos, POS, Inventario básico, Reportes |
| **PROFESSIONAL** | Negocio en crecimiento | Starter + Inventario avanzado (almacenes/kardex/kits), Finanzas, Usuarios/roles, Proveedores, Personalización |
| **BUSINESS** | Multi-sucursal | Professional + IA, Backups, Seguridad avanzada (client-side), soporte prioritario |
| **ENTERPRISE** | A medida | Business + White-Label, integraciones a medida, backend dedicado |

Estas ediciones son una propuesta comercial inicial; no hay lógica de
bloqueo de funciones por edición implementada en el código todavía (ver
"Feature Flags" más abajo para cómo se implementaría).

## 3. Modelo de datos de licencia (conceptual, futuro)

```json
{
  "licenseKey": "STK-XXXX-XXXX-XXXX",
  "customerId": "cus_123",
  "product": "StockDesk",
  "edition": "PROFESSIONAL",
  "issuedAt": "2026-01-01T00:00:00Z",
  "expiresAt": "2027-01-01T00:00:00Z",
  "status": "active",
  "deviceLimit": 3,
  "features": ["inventory.advanced", "finance", "users", "suppliers"],
  "signature": "..."
}
```

Este objeto **no existe hoy** en el código. Es la forma en la que un futuro
`LicenseService` (ver `docs/ARCHITECTURE.md`) validaría contra un backend.

## 4. `LicenseService` (implementación inicial LOCAL/DEMO)

```js
LicenseService
 ├── validate()             // LOCAL: siempre resuelve válido, no hay backend
 ├── activate(edition)      // guarda la edición elegida en localStorage
 ├── deactivate()           // vuelve a FREE/DEMO
 ├── getStatus()            // { valid, edition, verified: false, mode: 'local-demo' }
 └── getFeatures()          // features nominales de la edición activa (informativo)
```

Implementado en `js/services/license-service.js`. Es intencionalmente
**local/demo** (lee/escribe `localStorage`) mientras no exista backend de
licencias/pagos, y `getStatus()` siempre marca `verified: false` para
dejarlo explícito. **Ninguna página bloquea funciones según esto todavía**:
introducirlo sería el siguiente paso si se decide comercializar por
ediciones.

## 5. Feature Flags

Implementado en el mismo archivo (`js/services/license-service.js`) como
`window.FeatureFlags`:

```js
FeatureFlags = {
  ai: true,
  advancedReports: true,
  multiUser: true,
  cloudBackup: false, // requiere backend, no implementado
  suppliers: true,
  isEnabled(flag) { return this[flag] === true; }
}
```

Hoy todas las flags relevantes están en `true` (o `false` si la función no
existe, como `cloudBackup`): no hay ninguna página que actualmente consulte
`FeatureFlags.xxx` para decidir si renderizar una sección. Es la base
preparada para ese bloqueo futuro, no una funcionalidad activa.

## 6. Ciclo de vida de una licencia (futuro)

trial → activación → uso → renovación / expiración → revocación

Ninguno de estos estados está implementado hoy; se documentan para guiar el
desarrollo futuro cuando exista un backend real (ver "Backend futuro" en
`docs/ARCHITECTURE.md`).

## 7. Separación LOCAL vs SERVER

- **LOCAL LICENSE** (estado actual): no hay validación real, la app es
  completamente funcional sin ningún tipo de activación.
- **SERVER LICENSE** (futuro): requeriría un backend (p. ej. Supabase,
  Postgres + API propia, o Vercel Functions) que emita, valide y revoque
  licencias, y un `LicenseService` en el cliente que consulte ese backend
  con manejo de fallback offline (p. ej. gracia de N días sin conexión).

---

*Relacionado: `LICENSE`, `LICENSE-COMMERCIAL.md`, `docs/POSITIONING.md`,
`docs/ARCHITECTURE.md`.*
