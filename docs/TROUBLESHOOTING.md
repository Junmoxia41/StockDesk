# TROUBLESHOOTING — StockDesk

## 1. La aplicación no carga / pantalla en blanco

- Abre la consola del navegador (F12 → Console) y busca errores en rojo.
- Confirma que estás sirviendo el sitio con un servidor HTTP (`http://` o
  `https://`), no abriendo `index.html` directamente con `file://`: algunas
  funciones (Service Worker, ciertos `fetch`) no funcionan sobre `file://`.
- Si el error menciona `store.js` o cualquier script core, revisa que no se
  haya introducido un error de sintaxis (`node --check js/archivo.js` es
  una forma rápida de validar sintaxis fuera del navegador).

## 2. "Nueva versión disponible" no aparece nunca

- El Service Worker solo se registra sobre HTTPS o `localhost`. Si estás
  probando desde una IP directa por HTTP, no se registrará (silenciosamente,
  sin romper la app).
- Verifica en DevTools → Application → Service Workers que esté activo.
- Si cambiaste archivos del app shell pero no subiste `CACHE_VERSION` en
  `service-worker.js`, el navegador puede tardar en detectar el cambio.

## 3. Perdí mis datos (productos, ventas, etc.)

- Todos los datos viven en `localStorage` del navegador (ver
  `docs/ARCHITECTURE.md`). Si limpiaste el caché/datos del sitio, o
  cambiaste de navegador/dispositivo, los datos no se transfieren
  automáticamente: **no hay sincronización en la nube hoy**.
- Si tienes un backup exportado (`.json`), ve a Seguridad → Copias de
  Seguridad → Importar Respaldo y restáuralo. Ver `docs/BACKUPS.md`.
- Si no tienes backup, lamentablemente no hay forma de recuperar los datos:
  no existen en ningún servidor.

## 4. El Asistente de IA no responde / da error

- Verifica que configuraste una API Key válida de ZhipuAI/GLM en
  Configuración → Asistente IA.
- Revisa la consola del navegador por errores de red (401 = key inválida,
  429 = límite de uso alcanzado, CORS/timeout = problema de red o del
  proveedor).
- Ver `docs/AI.md` para el detalle completo del flujo.

## 5. Los estilos se ven rotos / la tipografía es genérica

- Tailwind CSS y la fuente Inter se cargan desde CDN (ver
  `THIRD-PARTY-NOTICES.md`). Si no tienes conexión a internet en la
  primera carga, o el CDN está caído, los estilos pueden no aplicarse.
  Cargas posteriores pueden beneficiarse del caché del Service Worker
  para el propio HTML/JS de StockDesk, pero el CDN externo no se cachea
  intencionalmente (ver `docs/DEPLOYMENT.md`, sección 5).

## 6. Funciones de seguridad no bloquean nada

- Es esperado para las funciones marcadas "Simulado" en la UI y en
  `docs/SECURITY.md` (2FA, WAF, Geobloqueo, listas de IP). Son
  demostrativas porque requieren un backend que hoy no existe.

## 7. El stock no cuadra después de una venta

- Revisa el Kardex del producto (Inventario → Kardex) para ver el
  historial de movimientos y detectar transferencias/ajustes manuales.
- Recuerda que StockDesk no soporta multi-dispositivo sincronizado: si
  usas dos dispositivos con la misma "base de datos" local pero sin
  compartir `localStorage`, cada uno llevará su propio conteo
  independiente.

## 8. Cómo reportar un problema que no está aquí

Ver `docs/SUPPORT.md`.

---

*Relacionado: `docs/SECURITY.md`, `docs/BACKUPS.md`, `docs/AI.md`,
`docs/DEPLOYMENT.md`.*
