# POSITIONING — StockDesk

## 1. Qué es StockDesk

StockDesk es un sistema de gestión de negocio (punto de venta, inventario,
finanzas básicas, seguridad y personalización) pensado para **pequeños y
medianos negocios** (tiendas, minimarkets, almacenes pequeños) que
necesitan una herramienta simple, rápida de desplegar y sin dependencia de
infraestructura de servidor propia.

## 2. Para quién es (y para quién no)

**Ideal para:**
- Negocios de un solo local o pocos locales, con un número manejable de
  usuarios (empleados) por dispositivo.
- Equipos que priorizan simplicidad y velocidad de puesta en marcha sobre
  funciones avanzadas de nivel empresarial.
- Casos de uso donde tener los datos localmente (sin depender de un
  servidor externo) es aceptable o incluso preferible.

**No recomendado (todavía) para:**
- Negocios que requieren sincronización de inventario en tiempo real entre
  múltiples sucursales/dispositivos (StockDesk no tiene backend, por lo que
  cada dispositivo mantiene su propia copia de datos en `localStorage`).
- Entornos que requieren cumplimiento normativo estricto de seguridad
  (PCI-DSS, HIPAA, SOC2) — ver honestidad de límites en `docs/SECURITY.md`.
- Negocios con volúmenes de datos muy grandes (decenas de miles de
  transacciones), donde las limitaciones de `localStorage` descritas en
  `docs/ARCHITECTURE.md` empiezan a ser relevantes.

## 3. Diferenciadores

- **Cero infraestructura de servidor**: se despliega como sitio estático
  (por ejemplo en Vercel) sin base de datos que mantener.
- **Funciona offline** una vez cargado (PWA con Service Worker, app shell
  cacheado).
- **Todo en un solo lugar**: POS, inventario multi-almacén, finanzas
  básicas (flujo de caja, nómina simple, presupuestos), dashboards y un
  asistente de IA opcional.
- **Honestidad sobre sus límites**: a diferencia de presentarse como una
  suite "enterprise" con seguridad militar, StockDesk se posiciona
  explícitamente como una solución **local-first** con límites de
  seguridad y escalabilidad claros y documentados (`docs/SECURITY.md`).

## 4. Roadmap de posicionamiento (propuesta, no comprometida)

Esta sección es una **propuesta comercial**, no un compromiso contractual.
Ver `docs/LICENSING.md` para las ediciones propuestas y `CHANGELOG.md` para
lo efectivamente entregado en cada versión.

- **Hoy**: producto local-first de un solo dispositivo/local, licenciado
  por instalación.
- **Evolución posible**: backend opcional para sincronización
  multi-dispositivo y licenciamiento centralizado (ver
  "Backend futuro" en `docs/ARCHITECTURE.md`).

---

*Relacionado: `docs/LICENSING.md`, `LICENSE-COMMERCIAL.md`,
`docs/PRODUCTION-AUDIT.md`.*
