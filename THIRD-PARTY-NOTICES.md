# Avisos de Terceros (Third-Party Notices)

StockDesk utiliza las siguientes dependencias externas, cargadas vía CDN
(no hay dependencias instaladas vía npm/`package.json` porque el proyecto no
usa un gestor de paquetes ni build tool). Se listan con propósito, versión
aproximada y licencia según la documentación pública de cada proyecto.

| Nombre | Versión | Licencia | URL | Uso en StockDesk |
|---|---|---|---|---|
| Tailwind CSS (Play/Browser CDN) | v4 (`@tailwindcss/browser@4`) | MIT | https://tailwindcss.com | Utilidades CSS para toda la interfaz |
| Google Fonts — Inter | N/A (servicio de fuentes) | SIL Open Font License 1.1 (la fuente Inter) | https://fonts.google.com/specimen/Inter | Tipografía principal de la interfaz |
| GLM / ZhipuAI API | API externa (no es una librería incluida en el código) | Términos de servicio propios de Zhipu AI, no licencia de software libre | https://open.bigmodel.cn | Asistente de IA opcional (requiere API Key del propio usuario) |

## Notas importantes

1. **No se incluye ningún framework JavaScript** (React, Vue, jQuery, etc.):
   toda la lógica de la aplicación (`js/*.js`) es JavaScript vanilla escrito
   específicamente para StockDesk y es propiedad del Licenciante (ver
   `LICENSE`).
2. **Riesgo de dependencia de CDN**: tanto Tailwind como Google Fonts se
   cargan desde CDNs de terceros en tiempo de ejecución. Si esos CDNs no
   están disponibles, la aplicación puede perder estilos o tipografía
   (degradación visual), pero la lógica de negocio (JS) seguiría
   funcionando porque no depende de ellos. Para producción crítica se
   recomienda evaluar alojar Tailwind compilado y las fuentes localmente
   (ver `docs/DEPLOYMENT.md`).
3. Este archivo no copia textos legales completos de cada licencia; se
   referencia la fuente oficial. Antes de una distribución comercial formal,
   se recomienda verificar la versión exacta servida por el CDN en el
   momento del despliegue y adjuntar el texto completo de la licencia MIT/
   OFL si el asesor legal lo considera necesario.

---

*Última verificación: 2026-09-21, como parte de la auditoría de producción
(`docs/PRODUCTION-AUDIT.md`).*
