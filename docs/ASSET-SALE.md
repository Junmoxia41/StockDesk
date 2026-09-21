# ASSET SALE — Vender StockDesk (código y derechos)

> **Aviso importante:** no soy abogado ni gestor de M&A, y esto **no es
> asesoría legal ni de valoración de negocio**. Este documento es un
> punto de partida ordenado para que tú (o un abogado/gestor que
> contrates) puedas negociar una venta con confianza sobre qué se está
> vendiendo exactamente. Antes de firmar cualquier cosa con un comprador
> real, haz revisar el contrato definitivo por un abogado mercantil en tu
> jurisdicción.

## 1. Qué se puede vender

Cuando se habla de "vender los derechos de autor" de un proyecto de
software, normalmente se negocia una de estas dos cosas — son muy
distintas y conviene tenerlo claro antes de hablar con nadie:

| Opción | Qué implica | Cuándo tiene sentido |
|---|---|---|
| **A. Cesión total (asset sale / copyright assignment)** | Transfieres **toda la titularidad** del código, marca "StockDesk" (si la registraras) y derechos de autor al comprador. Tú dejas de ser el dueño; ellos pueden hacer lo que quieran con el código, incluida reventa. | Venta única, "salida" completa del proyecto. Normalmente el precio es más alto porque es definitivo. |
| **B. Licencia comercial (lo que ya existe en el repo)** | Mantienes la titularidad y **licencias el uso** a uno o varios clientes/compradores bajo términos concretos (ver `LICENSE-COMMERCIAL.md`, `docs/LICENSING.md`). Puedes vender licencias a varios clientes a la vez. | Modelo de ingresos recurrente, quieres seguir siendo dueño del código. |

Este repositorio, tal como está hoy, está preparado principalmente para
**B** (`LICENSE`, `LICENSE-COMMERCIAL.md`, `docs/LICENSING.md`). Este
documento añade lo necesario para negociar **A** si es lo que realmente
buscas (una venta única y total).

## 2. Checklist honesto antes de vender (due diligence que te pedirán)

Cualquier comprador serio va a preguntar esto. Tenerlo resuelto de
antemano acelera la negociación y evita que baje el precio en el último
momento:

- [ ] **Titularidad clara**: ¿el código lo escribiste tú (o con ayuda de
      herramientas de IA, como en este caso) sin usar código con licencia
      incompatible de terceros? Ver `THIRD-PARTY-NOTICES.md` — hoy
      declara Tailwind CSS (CDN, MIT), Google Fonts y la API de ZhipuAI/
      GLM como dependencias de terceros. Un comprador querrá confirmar
      que ninguna de ellas impide la reventa (revísalo con un abogado:
      Tailwind vía CDN normalmente no es un problema porque no se
      redistribuye su código fuente, pero conviene confirmarlo).
- [ ] **Sin secretos filtrados**: confirma que no hay API keys, contraseñas
      ni datos de clientes reales commiteados en el historial de git (no
      solo en el estado actual). Puedes revisar con `git log -p` o
      herramientas como `gitleaks`/`trufflehog` antes de compartir el
      repositorio con un comprador.
- [ ] **Estado real documentado**: `docs/PRODUCTION-AUDIT.md` ya clasifica
      honestamente qué funciona en producción, qué es demo/simulado y qué
      falta. **Compártelo con el comprador tal cual** — es tu mejor
      protección legal: si el comprador tuvo acceso a esta auditoría antes
      de comprar, es mucho más difícil que después alegue que le
      ocultaste limitaciones conocidas.
- [ ] **Sin dependencias de tu cuenta personal**: revisa que no haya nada
      atado a tu usuario de GitHub, tu email, tu API key de IA personal,
      etc. que deba transferirse o desconectarse (ver `.env.example`).
- [ ] **Historial de commits**: decide si vas a transferir el repositorio
      de GitHub completo (con historial) o solo entregar un export del
      código en un momento dado. Transferir el repo completo con
      historial suele dar más confianza al comprador.

## 3. Qué incluir en el "paquete" que le enseñas a un comprador

1. Acceso de solo lectura al repositorio (o un ZIP del código en un
   commit concreto).
2. `README.md` (qué es el producto).
3. `docs/POSITIONING.md` (para quién es, mercado objetivo).
4. `docs/PRODUCTION-AUDIT.md` (estado real, honesto — es un punto a favor,
   no un riesgo: transmite seriedad).
5. `docs/ARCHITECTURE.md` (qué tan mantenible es el código).
6. `docs/LICENSING.md` y `LICENSE-COMMERCIAL.md` (si ya tienes clientes
   pagando con licencias, esto es parte del valor del negocio, no solo
   del código).
7. `docs/NATIVE-APPS.md` (que ya existan apps de Windows y Android es un
   argumento de venta: el producto no depende de un navegador).
8. Este documento (`docs/ASSET-SALE.md`) y el borrador de contrato de
   cesión (`docs/COPYRIGHT-ASSIGNMENT-TEMPLATE.md`), para mostrar que ya
   llegas preparado a negociar.

## 4. Sobre el precio

No puedo decirte cuánto vale StockDesk — depende de factores que no están
en el código (si ya tiene clientes pagando, ingresos recurrentes,
tracción, exclusividad del mercado, cuánto tiempo llevas manteniéndolo,
etc.). Como referencia de mercado, proyectos de software sin usuarios de
pago habitualmente se valoran por el **costo de desarrollo evitado** para
el comprador (cuánto le costaría construir algo similar desde cero) más
una prima si ya resuelve un problema real; proyectos con clientes de pago
se valoran típicamente como múltiplo de ingresos recurrentes anuales. Para
una cifra concreta, lo razonable es consultar a un bróker de M&A de
software o marketplaces especializados (p. ej. Flippa, Acquire.com,
MicroAcquire/Acquire, empresas de M&A de software) que pueden dar una
valoración de mercado real.

## 5. Siguiente paso recomendado

Si decides seguir por la vía de la cesión total (opción A), usa
`docs/COPYRIGHT-ASSIGNMENT-TEMPLATE.md` como punto de partida del contrato
y llévalo a un abogado antes de firmarlo con un comprador real. Si
prefieres seguir licenciando (opción B) y buscar varios clientes en vez de
un único comprador, el material ya existente (`LICENSE-COMMERCIAL.md`,
`docs/LICENSING.md`, `docs/POSITIONING.md`) es el que necesitas mostrar.

---

*Relacionado: `docs/COPYRIGHT-ASSIGNMENT-TEMPLATE.md`,
`LICENSE-COMMERCIAL.md`, `docs/LICENSING.md`, `docs/PRODUCTION-AUDIT.md`.*
