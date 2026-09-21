# LICENSING — Modelo de Licencias de StockDesk

> Este documento describe el **modelo técnico** de licenciamiento pensado
> para StockDesk. Para los términos legales, ver `LICENSE` y
> `LICENSE-COMMERCIAL.md`. Nada de lo aquí descrito implica que exista hoy
> un backend de validación de licencias: **la validación descrita en este
> documento es LOCAL/DEMO**, no hay servidor de licencias todavía.

## 1. Estado actual (honesto)

StockDesk **no tiene hoy** un sistema de activación/validación de licencias
contra un servidor. Cualquier persona con el código puede ejecutar la
aplicación completa. Este documento describe la arquitectura **propuesta**
para cuando exista un backend (ver `docs/ARCHITECTURE.md`, sección
"Backend futuro"), no una funcionalidad ya construida.

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

## 4. `LicenseService` (interfaz propuesta, no implementada)

```js
LicenseService
 ├── validate(licenseKey)   // consulta al backend si la key es válida
 ├── activate(licenseKey)   // asocia la key a este dispositivo/negocio
 ├── deactivate()           // libera el dispositivo actual
 ├── getStatus()            // { valid, edition, expiresAt, ... }
 └── getFeatures()          // lista de features habilitadas para la edición
```

La implementación inicial, si se construye, puede ser **local/demo**
(simplemente lee un valor de `localStorage`) mientras no exista backend de
licencias/pagos. Debe quedar documentado explícitamente como tal en la UI,
igual que se hizo con 2FA/WAF en esta auditoría (ver
`docs/PRODUCTION-AUDIT.md`).

## 5. Feature Flags

Para evitar duplicar código por edición, se recomienda un objeto central de
flags, por ejemplo:

```js
FeatureFlags = {
  ai: true,
  advancedReports: true,
  multiUser: true,
  cloudBackup: false, // requiere backend, no implementado
  suppliers: true
}
```

Las páginas/módulos consultarían `FeatureFlags.xxx` antes de renderizar una
sección, en vez de tener bloques de código distintos por edición.

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
