# Política de Privacidad de StockDesk (Borrador)

> **Aviso legal importante:** este documento es un borrador informativo
> preparado como parte de una auditoría de preparación para producción.
> **No constituye asesoría legal** ni una declaración de cumplimiento
> normativo (por ejemplo, GDPR, LOPD, LGPD, etc.). Debe ser revisado por un
> profesional del derecho antes de publicarse o usarse frente a clientes
> reales.

## 1. Qué es StockDesk y cómo trata tus datos

StockDesk es, en su estado actual, una aplicación **100% del lado del
cliente (frontend)**: no existe un servidor backend propio que reciba o
almacene los datos de tu negocio. Esto tiene implicaciones importantes que
queremos explicar con total honestidad:

### 1.1. Datos almacenados localmente

Todos los datos que introduces en StockDesk (productos, ventas, clientes,
proveedores, empleados, transacciones financieras, configuración, usuarios,
logs, etc.) se guardan usando la API `localStorage` del navegador, **en el
dispositivo donde se ejecuta la aplicación**. Esto significa:

- Los datos **no se envían a ningún servidor de StockDesk** (porque no
  existe uno hoy).
- Los datos **no se sincronizan entre dispositivos** automáticamente.
- Si limpias el caché/datos del navegador, o usas el modo incógnito, o
  cambias de dispositivo, **los datos no estarán disponibles** salvo que
  hayas exportado un backup manualmente (ver `docs/BACKUPS.md`).
- Cualquier persona con acceso físico a tu navegador/dispositivo puede
  potencialmente ver estos datos (no hay cifrado fuerte de `localStorage`
  por parte del navegador).

### 1.2. Datos enviados a la API de Inteligencia Artificial (opcional)

Si configuras voluntariamente una API Key de GLM/ZhipuAI en Configuración
para habilitar el Asistente de IA avanzado:

- El mensaje que escribes y un resumen del contexto de tu negocio (nombre,
  moneda, productos con bajo stock, top productos, cifras de ventas) se
  envían **directamente desde tu navegador** a los servidores de GLM/ZhipuAI
  para generar una respuesta.
- Esa comunicación está sujeta a la política de privacidad del proveedor de
  IA (GLM/ZhipuAI), no a la de StockDesk.
- Si no configuras una API Key, el asistente funciona en modo "offline" con
  respuestas predefinidas y **no se envía ningún dato a terceros**.
- Ver `docs/AI.md` para más detalle técnico.

### 1.3. Backups

Los backups que generas (botón "Crear Respaldo") se guardan también en
`localStorage` y, si los descargas, como archivo `.json` en tu dispositivo.
StockDesk no los sube a ningún servidor por sí mismo.

### 1.4. Cookies y analítica

StockDesk **no utiliza cookies de seguimiento ni analítica de terceros por
defecto**. Si en el futuro se incorpora telemetría, debe ser opcional,
documentada aquí explícitamente y desactivable (ver principio en
`docs/PRODUCTION-AUDIT.md`, sección "Telemetría").

## 2. Dependencias externas que sí hacen peticiones de red

- **Tailwind CSS (CDN jsdelivr)** y **Google Fonts**: se descargan desde sus
  respectivos CDN al cargar la aplicación. Estas peticiones pueden revelar
  tu dirección IP a esos proveedores, como ocurre con cualquier sitio web
  que use CDNs públicos.
- **API de GLM/ZhipuAI**: solo si configuras una API Key, como se explica en
  el punto 1.2.

## 3. Tus derechos y control sobre tus datos

Como los datos viven en tu propio navegador:

- Puedes exportarlos en cualquier momento (Configuración → Exportar datos,
  o Seguridad → Backups).
- Puedes eliminarlos por completo borrando los datos del sitio desde la
  configuración de tu navegador, o usando "Reiniciar aplicación" si esa
  opción está disponible.
- No existe hoy un mecanismo para que StockDesk elimine datos "en el
  servidor", porque no hay servidor que los reciba.

## 4. Menores de edad

StockDesk está pensado para uso profesional/empresarial y no está dirigido
a menores de edad.

## 5. Cambios a esta política

Si en el futuro se introduce un backend, sincronización en la nube, o
telemetría opcional, esta política se actualizará para reflejar con
precisión qué datos salen del dispositivo del usuario y hacia dónde.

---

*Relacionado: `docs/AI.md`, `docs/BACKUPS.md`, `docs/SECURITY.md`,
`TERMS.md`.*
