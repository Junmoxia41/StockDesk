# Política de Seguridad

## Versiones soportadas

StockDesk no tiene aún un ciclo formal de versiones con soporte de
seguridad a largo plazo (LTS). Se recomienda usar siempre la última versión
publicada en la rama principal del repositorio. Ver `CHANGELOG.md`.

## Reportar una vulnerabilidad

Si descubres una vulnerabilidad de seguridad en StockDesk:

1. **No la publiques como Issue público** si crees que es explotable de
   forma inmediata contra usuarios reales.
2. Repórtala de forma privada abriendo un
   [Security Advisory en GitHub](https://github.com/Junmoxia41/StockDesk/security/advisories)
   en este repositorio, o contactando directamente al mantenedor a través
   del perfil de GitHub `Junmoxia41`.
3. Incluye: descripción del problema, pasos para reproducirlo, e impacto
   estimado.

Dado que StockDesk es hoy una aplicación 100% del lado del cliente sin
backend propio (ver `docs/SECURITY.md`), la mayoría de vulnerabilidades
relevantes serán de tipo XSS/HTML injection, manipulación de
`localStorage`, o exposición de la API Key de IA — se tratarán con
prioridad alta.

## Alcance

Quedan fuera de alcance: vulnerabilidades en servicios de terceros
(ZhipuAI/GLM, Vercel, CDNs de Tailwind/Google Fonts) — repórtalas
directamente a esos proveedores.

## Reconocimientos

Se agradecerá (con consentimiento del reportante) a quienes reporten
vulnerabilidades de forma responsable en `CHANGELOG.md`.
