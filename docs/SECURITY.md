# SECURITY — StockDesk

Este documento describe honestamente qué protecciones son **reales** y
cuáles son **simulaciones locales del lado del cliente**, siguiendo el
principio rector de esta auditoría: nunca presentar como seguridad real
algo que solo es una simulación.

## 1. Resumen por función

| Función | Ubicación | Naturaleza real | Notas |
|---|---|---|---|
| Hash de contraseñas | `js/modules/auth-utils.js` | ✅ Real (SHA-256 vía `crypto.subtle`) | No es bcrypt/Argon2 ni tiene "salt" por usuario; suficiente para evitar texto plano, no para un backend de alto riesgo |
| Autenticación de usuario | `js/pages/login.js` | 🟡 Local | No hay servidor: la sesión es un objeto en `localStorage` (`Store.KEYS.USER`). Cualquier persona con acceso a DevTools puede modificarlo |
| 2FA | `js/modules/security-auth.js` | ⚠️ **Simulado** | Genera un código aleatorio, no un secreto TOTP/HOTP real, y no verifica criptográficamente el código introducido. Etiquetado en la propia UI desde esta auditoría |
| RBAC (roles y permisos) | `js/router.js`, `js/modules/users-management.js` | 🟡 Solo de cliente | Los permisos se leen de `localStorage`; útil para UX (ocultar opciones) pero no es una barrera de seguridad real sin backend |
| WAF / Anti-SQL Injection | `js/modules/security-threats.js` | ⚠️ **Simulado (local)** | No hay servidor ni tráfico HTTP que inspeccionar; el toggle no protege nada real. Etiquetado en la UI |
| Geobloqueo | `js/modules/security-access.js` | ⚠️ **Simulado** | Requiere backend con geolocalización por IP; no implementado |
| Lista blanca de IPs / horarios | `js/modules/security-access.js` | ⚠️ **Simulado** | Sin backend no hay forma de verificar la IP real de origen de forma confiable |
| Backups (export/import) | `js/modules/security-backup.js` | ✅ Real, con integridad verificada | Desde esta auditoría, cada backup incluye un checksum (no criptográfico) y se valida el esquema antes de restaurar; si falla, se cancela toda la operación |
| Sesiones activas | `js/modules/security-backup.js` (`SecuritySessions`) | ⚠️ **Simulado** | No hay servidor de sesiones; se muestra una sesión "actual" simulada |
| Sanitización XSS/HTML injection | `js/components.js` (`Sanitize`) | ✅ Real | Añadida en esta auditoría: `escapeHtml`, `escapeJsString`, `csvField`, `isValidUsername`, aplicadas en ~100 puntos de renderizado de datos de usuario |
| Notificaciones (Email/SMS/WhatsApp) | `js/pages/notifications.js` | ❌ No implementado | Los toggles solo guardan preferencia local; no hay integración con proveedores reales de envío |

## 2. Por qué estas limitaciones son inherentes a un frontend puro

StockDesk, en su estado actual, **no tiene backend**. Cualquier aplicación
puramente del lado del cliente no puede garantizar:

- secreto absoluto de datos (todo es inspeccionable con DevTools);
- autenticación fuerte contra un tercero no confiable;
- autorización confiable (el propio usuario controla su `localStorage`);
- protección real contra manipulación del cliente.

Esto no es un defecto exclusivo de StockDesk: es una limitación fundamental
de cualquier app 100% frontend. La honestidad al respecto es justamente el
criterio que separa a un producto confiable de uno que exagera sus
capacidades comerciales (ver principio en `docs/PRODUCTION-AUDIT.md`,
sección "Regla fundamental de honestidad").

## 3. Mitigaciones aplicadas en esta auditoría (P1)

1. **Sanitización centralizada**: `Components.toast()` y `Components.modal()`
   ahora escapan automáticamente `message`/`title`, así cualquier código que
   los use queda protegido sin depender de que cada desarrollador recuerde
   escapar manualmente.
2. **Validación de username**: solo se permiten caracteres seguros
   (`[a-zA-Z0-9._-]`, 3-32 caracteres) al crear usuarios, evitando que un
   nombre con comillas rompa el escape en atributos `onclick`.
3. **Integridad de backups**: checksum + validación de esquema antes de
   restaurar/importar, cancelando toda la operación si algo no coincide.
4. **Transparencia en la UI**: insignias visibles "Simulado" / "No
   implementado" en 2FA, WAF, Geobloqueo y canales de notificación.
5. **Aviso sobre la API Key de IA**: mensaje visible en Configuración
   explicando que la key se usa directamente desde el navegador.

## 4. Recomendaciones para producción real con datos sensibles

Si StockDesk va a manejar datos de negocio críticos en un entorno
multiusuario real, se recomienda (no implementado, ver
`docs/PRODUCTION-TODO.md`):

- Backend de autenticación real (sesiones firmadas, JWT o cookies
  `HttpOnly`).
- 2FA basado en TOTP real (librería estándar + verificación server-side).
- RBAC verificado en servidor, no solo en cliente.
- Rate limiting real contra fuerza bruta (hoy solo hay un contador local).
- Backups en almacenamiento remoto redundante, no solo `localStorage`.

## 5. Reportar una vulnerabilidad

Ver `.github/SECURITY.md` para el proceso de reporte responsable.

---

*Relacionado: `docs/PRODUCTION-AUDIT.md`, `docs/AI.md`, `docs/BACKUPS.md`,
`PRIVACY.md`.*
