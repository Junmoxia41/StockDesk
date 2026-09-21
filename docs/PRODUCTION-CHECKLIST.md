# PRODUCTION CHECKLIST — StockDesk

Checklist a repasar antes de marcar una versión como lista para producción
o antes de un despliegue importante. Basado en los hallazgos de
`docs/PRODUCTION-AUDIT.md`.

## Funcional

- [ ] Instalación limpia funciona (`docs/INSTALLATION.md`): primer arranque,
      creación de usuario admin, cambio de contraseña.
- [ ] Flujo de venta (POS) completo: agregar productos, aplicar descuento,
      cobrar, imprimir/mostrar ticket, verificar que el stock se descuenta.
- [ ] Inventario: crear producto, transferir entre almacenes, hacer un
      conteo físico, revisar Kardex.
- [ ] Finanzas: registrar un ingreso/gasto, ver flujo de caja, generar un
      presupuesto simple.
- [ ] Dashboard: los widgets reflejan datos reales, sin errores en consola.
- [ ] Seguridad: cambio de contraseña, generación de backup, restauración
      de backup (probar con un backup corrupto para confirmar que se
      rechaza correctamente).
- [ ] Exportaciones (CSV/Excel/PDF si aplica) generan archivos válidos y
      sin HTML/JS sin escapar en los campos.

## Seguridad

- [ ] `docs/PRODUCTION-AUDIT.md` revisado: sin hallazgos 🔴 ROTA sin
      resolver.
- [ ] Todas las funciones simuladas están etiquetadas visualmente en la UI
      (ver `docs/SECURITY.md`).
- [ ] No hay credenciales, tokens ni API keys hardcodeadas en el
      código fuente (`git grep -i "api_key\|secret\|password ="`).
- [ ] `.gitignore` cubre `.env*`, backups locales de prueba, etc.

## PWA / Offline

- [ ] `manifest.webmanifest` carga sin errores (DevTools → Application →
      Manifest).
- [ ] `service-worker.js` se registra correctamente sobre HTTPS.
- [ ] La app carga en modo avión tras la primera visita (app shell
      cacheado).
- [ ] El flujo "Nueva versión disponible" funciona al desplegar un cambio.
- [ ] Verificar que el Service Worker **no** cachea llamadas a la API de
      IA ni a CDNs externos.

## Responsive / Dispositivos

- [ ] Probado en desktop, tablet y móvil (los tres perfiles de
      `device-setup.js`).
- [ ] Sin overflow horizontal ni elementos cortados en pantallas pequeñas.

## Despliegue (Vercel)

- [ ] `vercel.json` validado como JSON correcto.
- [ ] Preview deployment revisado antes de promover a producción.
- [ ] HTTPS activo (automático en Vercel).
- [ ] Consola del navegador sin errores ni warnings críticos en producción.

## Documentación y legal

- [ ] `README.md`, `CHANGELOG.md` actualizados con la versión actual.
- [ ] `LICENSE`, `PRIVACY.md`, `TERMS.md` revisados si hubo cambios de
      comportamiento relevantes (por ejemplo, nuevas integraciones que
      envíen datos a terceros).
- [ ] `THIRD-PARTY-NOTICES.md` actualizado si se agregó/cambió alguna
      dependencia externa.

---

*Relacionado: `docs/PRODUCTION-AUDIT.md`, `docs/DEPLOYMENT.md`,
`docs/RELEASE.md`.*
