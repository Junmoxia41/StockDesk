<p align="center">
  <img src="assets/icons/icon-192.png" alt="StockDesk" width="96" height="96">
</p>

<h1 align="center">StockDesk</h1>

<p align="center">
  Gestión de punto de venta, inventario y finanzas para pequeños y
  medianos negocios — como app web instalable (PWA), 100% del lado del
  cliente, sin backend propio.
</p>

<p align="center">
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-proprietary-red.svg"></a>
  <img alt="Status" src="https://img.shields.io/badge/status-pre--production-orange.svg">
  <img alt="Stack" src="https://img.shields.io/badge/stack-HTML%2FCSS%2FVanilla%20JS-blue.svg">
</p>

---

## ¿Qué es StockDesk?

StockDesk es un sistema de gestión de negocio todo-en-uno pensado para
tiendas y negocios pequeños/medianos: **punto de venta (POS)**,
**inventario multi-almacén**, **finanzas básicas** (flujo de caja, nómina
simple, presupuestos), **dashboards**, un **asistente de IA opcional** y
un módulo de **seguridad y personalización**.

Es una **Single Page Application** construida con HTML, CSS y JavaScript
"vanilla" (sin React/Vue/Angular, sin build step) y Tailwind CSS vía CDN.
Todos los datos de negocio se guardan en el `localStorage` del navegador:
**no hay servidor ni base de datos propios** hoy. Ver
`docs/ARCHITECTURE.md` para el detalle técnico completo.

> **Honestidad ante todo**: algunas funciones de seguridad avanzada (2FA,
> WAF, geobloqueo, listas de IP) están presentes en la interfaz como
> **demostraciones/simulaciones locales**, porque requieren un backend que
> el producto no tiene todavía. Se etiquetan explícitamente en la UI y en
> `docs/SECURITY.md`. Nunca presentamos una simulación como si fuera una
> protección real.

## Funcionalidades principales

| Módulo | Qué incluye |
|---|---|
| **Ventas / POS** | Carrito, descuentos, cobro, impresión/visualización de tickets |
| **Inventario** | Productos, almacenes, transferencias, conteos físicos, kardex, kits |
| **Finanzas** | Flujo de caja, gastos, nómina básica, presupuestos |
| **Dashboards** | Widgets y gráficos con datos en tiempo real de tu operación |
| **Seguridad** | Autenticación, roles y permisos, backups con verificación de integridad, logs de auditoría |
| **Asistente de IA** | Chat conversacional opcional vía GLM/ZhipuAI (usa tu propia API Key) |
| **Personalización** | Temas, colores, campos personalizados, plantillas de ticket |
| **Notificaciones** | Centro de notificaciones y alertas internas |
| **Proveedores** | Directorio y órdenes de compra |

Ver el detalle exacto de qué está en producción, qué es simulado y qué no
está implementado en **[`docs/PRODUCTION-AUDIT.md`](docs/PRODUCTION-AUDIT.md)**.

## Por qué StockDesk

- **Cero infraestructura que mantener**: se despliega como sitio estático
  (por ejemplo en [Vercel](https://vercel.com)) sin servidores ni bases de
  datos.
- **Funciona offline** como PWA instalable, una vez cargado por primera
  vez (app shell cacheado con Service Worker).
- **Sin dependencia de un proveedor de IA obligatorio**: el asistente de
  IA es opcional y usa tu propia API Key.
- **Transparente sobre sus límites**: ver `docs/POSITIONING.md` y
  `docs/SECURITY.md` para saber exactamente para qué casos de uso es
  (y no es) adecuado hoy.

## Empezar

```bash
git clone https://github.com/Junmoxia41/StockDesk.git
cd StockDesk
python3 -m http.server 8080
# abrir http://localhost:8080
```

No requiere `npm install`: no hay dependencias instaladas localmente (ver
`THIRD-PARTY-NOTICES.md`). Instrucciones completas en
**[`docs/INSTALLATION.md`](docs/INSTALLATION.md)**.

## Desplegar en producción

StockDesk incluye `vercel.json` listo para desplegar en Vercel (rewrites
de SPA, caché diferenciada por tipo de asset, headers de seguridad básicos).
Ver **[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)**.

## Apps nativas (Windows / Android)

StockDesk también se puede empaquetar como app de escritorio para
**Windows** (`.exe` de un solo archivo, con pywebview) y como **APK de
Android** (con python-for-android), sirviendo la misma web localmente
dentro de una ventana/WebView nativo — sin backend nuevo, sin
sincronización entre dispositivos. Los binarios se compilan en GitHub
Actions (no se commitean al repo). Ver
**[`docs/NATIVE-APPS.md`](docs/NATIVE-APPS.md)** para cómo descargarlos e
instalarlos, y `native/README.md` para el detalle técnico.

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arquitectura técnica, capas, persistencia de datos |
| [`docs/NATIVE-APPS.md`](docs/NATIVE-APPS.md) | App de Windows (.exe) y Android (.apk): cómo compilarlas e instalarlas |
| [`docs/PRODUCTION-AUDIT.md`](docs/PRODUCTION-AUDIT.md) | Auditoría honesta: qué es real, simulado o no implementado |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Despliegue en Vercel, PWA, Service Worker |
| [`docs/INSTALLATION.md`](docs/INSTALLATION.md) | Instalación local y primer uso |
| [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) | Variables de entorno (estado actual y futuro) |
| [`docs/AI.md`](docs/AI.md) | Cómo funciona el asistente de IA y qué datos se envían |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Qué es seguridad real vs. simulada, y por qué |
| [`docs/BACKUPS.md`](docs/BACKUPS.md) | Cómo respaldar, restaurar e importar datos |
| [`docs/SUPPORT.md`](docs/SUPPORT.md) | Canales y alcance del soporte |
| [`docs/POSITIONING.md`](docs/POSITIONING.md) | Para quién es (y no es) StockDesk |
| [`docs/LICENSING.md`](docs/LICENSING.md) | Modelo técnico de licenciamiento propuesto |
| [`docs/ASSET-SALE.md`](docs/ASSET-SALE.md) | Cómo plantear una venta total del proyecto (cesión de derechos) |
| [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) | Solución de problemas comunes |
| [`docs/PRODUCTION-CHECKLIST.md`](docs/PRODUCTION-CHECKLIST.md) | Checklist antes de un release |
| [`docs/PRODUCTION-TODO.md`](docs/PRODUCTION-TODO.md) | Roadmap técnico pendiente por fase |
| [`docs/RELEASE.md`](docs/RELEASE.md) | Proceso de versionado y publicación |
| [`CHANGELOG.md`](CHANGELOG.md) | Historial de cambios |
| [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) | Dependencias de terceros (Tailwind, Google Fonts, ZhipuAI) |

## Legal y privacidad

- **[`LICENSE`](LICENSE)** — Licencia propietaria (no open-source); uso
  comercial requiere licencia comercial, ver
  **[`LICENSE-COMMERCIAL.md`](LICENSE-COMMERCIAL.md)**.
- **[`PRIVACY.md`](PRIVACY.md)** — Qué datos se manejan, dónde se
  almacenan (localStorage del navegador) y qué se envía a servicios
  externos (solo la IA, si el usuario configura su propia API Key).
- **[`TERMS.md`](TERMS.md)** — Términos de uso.

> Ninguno de estos documentos constituye asesoría legal formal; se
> recomienda revisión por un abogado antes de un uso comercial extensivo.

## Estado del proyecto

StockDesk está en **fase pre-producción**: funcionalmente completo para
uso de un solo negocio/dispositivo, con una auditoría de seguridad y
honestidad de producto ya aplicada (ver `docs/PRODUCTION-AUDIT.md`).
Quedan pendientes, entre otros: una capa de servicios desacoplados
preparada para un backend futuro, y la división de algunos archivos
JavaScript grandes en módulos más pequeños (ver
`docs/PRODUCTION-TODO.md`).

## Contribuir / Soporte

Este es un proyecto de código propietario (ver `LICENSE`). Para reportar
errores o solicitar soporte, ver **[`docs/SUPPORT.md`](docs/SUPPORT.md)**
y [Issues de GitHub](https://github.com/Junmoxia41/StockDesk/issues).
Para reportar una vulnerabilidad de seguridad, ver
**[`.github/SECURITY.md`](.github/SECURITY.md)**.

---

<p align="center">Hecho para negocios que necesitan empezar rápido, sin infraestructura.</p>
