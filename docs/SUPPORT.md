# SUPPORT — Soporte de StockDesk

## 1. Canales de soporte

StockDesk es mantenido por su Licenciante/desarrollador. Actualmente el
canal de soporte principal es:

- **Issues de GitHub**: https://github.com/Junmoxia41/StockDesk/issues
  (para bugs y solicitudes de funcionalidad sobre el propio software).

Para licencias comerciales, los términos de soporte (canal dedicado, SLA,
horario) se acuerdan por separado en el contrato de licencia comercial —
ver `LICENSE-COMMERCIAL.md`. **Ningún SLA está activo por defecto** salvo
que se firme explícitamente.

## 2. Qué cubre el soporte

- Preguntas sobre instalación y despliegue (`docs/INSTALLATION.md`,
  `docs/DEPLOYMENT.md`).
- Reporte de errores reproducibles.
- Dudas sobre el alcance real de una función (ver `docs/PRODUCTION-AUDIT.md`
  y `docs/SECURITY.md` para saber qué es real, simulado o no implementado).

## 3. Qué NO cubre el soporte estándar

- Desarrollo de funcionalidades a medida (requiere acuerdo comercial
  aparte).
- Recuperación de datos perdidos por no haber hecho backups (ver
  `docs/BACKUPS.md` — StockDesk no tiene backend, no hay "papelera" del
  lado del servidor).
- Soporte sobre servicios de terceros (ZhipuAI/GLM, Vercel, tu propio
  navegador) más allá de cómo se integran con StockDesk.

## 4. Antes de reportar un problema

1. Verifica que usas la última versión (ver `CHANGELOG.md`).
2. Revisa la consola del navegador (F12) por errores.
3. Confirma si el problema ocurre también en modo incógnito/otro navegador
   (para descartar extensiones interfiriendo).
4. Si es posible, exporta un backup (`docs/BACKUPS.md`) antes de intentar
   soluciones que modifiquen datos.

## 5. Información a incluir en un reporte

- Navegador y versión.
- Pasos para reproducir.
- Captura de pantalla o mensaje de error exacto.
- Si aplica, el archivo de backup (revisa antes que no contenga datos
  sensibles que no quieras compartir).

---

*Relacionado: `LICENSE-COMMERCIAL.md`, `docs/BACKUPS.md`, `TERMS.md`.*
