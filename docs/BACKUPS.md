# BACKUPS — StockDesk

## 1. Dónde viven tus datos

Todos los datos de StockDesk viven en `localStorage` del navegador (ver
`docs/ARCHITECTURE.md`, sección 4). Esto significa que **no hay backup
automático en un servidor remoto**: si no exportas un respaldo, tus datos
solo existen en ese navegador/dispositivo.

## 2. Crear un respaldo manual

1. Ve a **Seguridad → Copias de Seguridad**.
2. Pulsa **"Crear Respaldo Ahora"**.
3. El respaldo se guarda en la lista de "Respaldos Disponibles" (dentro del
   propio `localStorage`) y puedes descargarlo como archivo `.json` con el
   botón **"Descargar"**.

Formato del backup (versión `v2`, actual):

```json
{
  "format": "stockdesk-backup-v2",
  "appVersion": "2026.4",
  "createdAt": "2026-09-21T12:00:00.000Z",
  "keys": { "stockdesk_products": [...], "stockdesk_sales": [...], "...": "..." },
  "checksum": "a1b2c3d4"
}
```

- `keys` contiene el valor completo de cada clave conocida de `Store.KEYS`.
- `checksum` es un hash no criptográfico (FNV-1a) calculado sobre el propio
  backup, usado **únicamente para detectar corrupción o alteración
  accidental**, no como firma de seguridad (ver `docs/SECURITY.md`).

## 3. Restaurar un respaldo

1. Ve a **Seguridad → Copias de Seguridad**.
2. Pulsa **"Restaurar"** junto al respaldo deseado (o importa uno externo
   primero, ver punto 4).
3. Se te pedirá confirmación explícita porque **la restauración reemplaza
   todos los datos actuales**.

Desde esta auditoría, antes de restaurar:
- se valida que el backup tenga el formato `stockdesk-backup-v2` esperado;
- se valida que solo contenga claves conocidas de la aplicación (nunca
  claves arbitrarias);
- si el backup incluye `checksum`, se verifica que coincida con el
  contenido actual del archivo;
- **si cualquiera de estas validaciones falla, se cancela toda la
  restauración** y no se modifica ningún dato existente (nunca se deja la
  base de datos en un estado parcialmente corrupto).

Los backups del formato heredado `v1` (sin `checksum` ni estructura `keys`)
siguen siendo compatibles por retrocompatibilidad, pero se restauran sin
verificación de integridad — se recomienda migrar a backups nuevos (`v2`)
en cuanto sea posible.

## 4. Importar un respaldo externo

1. Ve a **Seguridad → Copias de Seguridad → Importar Respaldo**.
2. Selecciona un archivo `.json` exportado previamente por StockDesk.
3. El archivo se valida (formato, esquema y checksum si aplica) **antes**
   de agregarse a la lista de respaldos disponibles. Si la validación
   falla, se muestra el motivo exacto y no se importa nada.
4. Un respaldo importado no se restaura automáticamente: debes pulsar
   "Restaurar" explícitamente después de revisarlo.

## 5. Backup automático (configuración)

Desde la misma pantalla puedes activar "Copias de Seguridad Automáticas"
con una frecuencia (horaria/diaria/semanal) y una retención (7/30/90 días).
**Nota de transparencia**: esta opción programa la generación de backups
dentro de la propia sesión del navegador; no hay un proceso en segundo
plano fuera del navegador, por lo que solo se generarán backups mientras la
aplicación esté abierta y ese ajuste esté activo.

## 6. Buenas prácticas recomendadas

- Descarga backups `.json` periódicamente a un almacenamiento externo
  (no solo dentro del propio `localStorage` del navegador).
- Antes de actualizar StockDesk a una versión nueva, crea un respaldo
  manual (ver política de actualización en `CHANGELOG.md` / `docs/RELEASE.md`).
- No compartas archivos de backup: pueden contener datos de clientes,
  ventas y configuración de tu negocio.

---

*Relacionado: `docs/SECURITY.md`, `PRIVACY.md`, `docs/ARCHITECTURE.md`.*
