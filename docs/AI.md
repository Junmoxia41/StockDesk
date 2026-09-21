# AI — Asistente de Inteligencia Artificial en StockDesk

## 1. Qué es

StockDesk incluye un asistente conversacional opcional (`js/modules/ai-chat.js`,
`ai-assistant.js`, `ai-advanced.js`) que usa la API de **GLM (ZhipuAI)** para
responder preguntas sobre tu negocio en lenguaje natural.

## 2. Cómo funciona (honesto y técnico)

1. El usuario introduce **su propia API Key** de ZhipuAI/GLM en
   Configuración → Asistente IA. La key se guarda en `localStorage` del
   navegador (nunca en un servidor de StockDesk, porque **no existe** un
   servidor de StockDesk).
2. Cuando el usuario hace una pregunta, StockDesk arma un mensaje que puede
   incluir un resumen del contexto de negocio (por ejemplo: totales de
   ventas, número de productos con bajo stock) para que la respuesta sea
   relevante.
3. La llamada HTTP se hace **directamente desde el navegador del usuario**
   hacia la API de ZhipuAI — no pasa por ningún servidor intermedio de
   StockDesk.
4. La respuesta se muestra en la interfaz de chat.

## 3. Si no hay API Key configurada

El asistente funciona en **modo offline/degradado**: responde con mensajes
predefinidos o indica que necesita una API Key para dar respuestas
generadas por IA. Nunca se simulan respuestas de IA como si fueran reales.

## 4. Qué datos se envían a la API externa

Ver `PRIVACY.md` para el detalle. En resumen: solo se envían los datos que
formen parte del mensaje/contexto de la conversación (nunca toda la base de
datos completa), y solo si el usuario configuró su propia API Key. StockDesk
no tiene control sobre cómo ZhipuAI procesa o retiene esos datos en sus
servidores: revisa los términos de servicio y política de privacidad de
ZhipuAI antes de enviar información sensible.

## 5. Costos

El uso de la API de IA se factura directamente entre el usuario y ZhipuAI
según su propio plan/tarifa. StockDesk no cobra ni gestiona ningún costo
relacionado con el uso de IA.

## 6. Seguridad de la API Key

- La key se guarda en `localStorage`, visible para cualquier script que se
  ejecute en el mismo origen (por eso es importante no instalar extensiones
  de navegador no confiables mientras usas StockDesk) y para cualquier
  persona con acceso físico/DevTools al navegador.
- El Service Worker de StockDesk (`service-worker.js`) **nunca cachea**
  peticiones hacia la API de IA (ver `docs/DEPLOYMENT.md`, sección 5):
  las llamadas de IA siempre van en vivo a la red, nunca se sirven desde
  caché ni se guardan como respuesta cacheada.
- Se recomienda usar una API Key con límite de gasto configurado en el
  panel de ZhipuAI, para acotar el impacto de un uso indebido.

## 7. Limitaciones conocidas

- No hay streaming real de tokens en todos los flujos (puede variar según
  la implementación en `ai-chat.js`); ver el código para el detalle exacto
  de la versión actual.
- No hay memoria persistente de conversaciones entre sesiones más allá de
  lo que se guarde explícitamente en `localStorage`.
- El asistente no tiene acceso de escritura a tus datos: es de solo
  consulta/redacción, no ejecuta acciones (crear ventas, editar productos,
  etc.) en nombre del usuario.

---

*Relacionado: `PRIVACY.md`, `docs/SECURITY.md`, `docs/ENVIRONMENT.md`.*
