# Plantilla — Contrato de Cesión de Derechos de Autor de StockDesk (Borrador)

> **Esto es un borrador orientativo, NO un contrato listo para firmar.**
> Debe ser revisado, completado y adaptado por un abogado mercantil/de
> propiedad intelectual antes de usarse con un comprador real. Los
> corchetes `[ ]` marcan datos que deben completarse. No incluye cláusulas
> fiscales ni de protección de datos específicas de ninguna jurisdicción
> concreta: eso debe añadirlo tu abogado según dónde residan cedente y
> cesionario.

---

## CONTRATO DE CESIÓN DE DERECHOS DE AUTOR Y ACTIVOS DE SOFTWARE

**Entre:**

- **[Nombre completo / razón social del Cedente]**, en adelante "el
  Cedente", titular de los derechos de autor sobre el software
  denominado "StockDesk".

**Y:**

- **[Nombre completo / razón social del Cesionario]**, en adelante "el
  Cesionario".

Ambas partes acuerdan lo siguiente:

### Cláusula 1 — Objeto de la cesión

El Cedente transfiere al Cesionario, de forma **[total / parcial —
especificar]** y **[exclusiva / no exclusiva]**, la titularidad de los
derechos de autor y activos relacionados con el software "StockDesk",
incluyendo:

1. El código fuente completo, en el estado del repositorio Git a fecha
   de **[fecha]**, identificado por el commit `[hash de commit]` de la
   rama `[nombre de rama]`.
2. La documentación asociada (README, `docs/`, `CHANGELOG.md`, etc.).
3. Los activos de diseño (iconos, logotipos, assets en `assets/`).
4. **[Si aplica]** El nombre de dominio, cuenta de GitHub, cuenta de
   despliegue (Vercel u otro hosting), y cualquier otra cuenta de
   servicio asociada al proyecto — listar explícitamente cuáles se
   transfieren y cuáles no.
5. **[Si aplica]** Las licencias comerciales activas con clientes
   existentes a la fecha de la cesión (ver lista adjunta en el Anexo A).

### Cláusula 2 — Qué NO se transfiere (a completar y acordar)

- **[ ]** Cuentas personales de servicios de terceros que el Cedente no
  desee transferir (p. ej. su propia cuenta de API de IA usada solo para
  pruebas).
- **[ ]** Cualquier otro proyecto o código del Cedente no relacionado con
  StockDesk.
- **[ ]** Marcas registradas de terceros mencionadas en
  `THIRD-PARTY-NOTICES.md` (Tailwind CSS, Google Fonts, ZhipuAI/GLM):
  estas siguen perteneciendo a sus respectivos titulares; StockDesk solo
  las usa bajo sus términos de uso públicos, no las posee.

### Cláusula 3 — Declaraciones y garantías del Cedente

El Cedente declara que:

1. Es el único titular de los derechos de autor sobre el código propio
   de StockDesk (excluyendo dependencias de terceros listadas en
   `THIRD-PARTY-NOTICES.md`), y tiene plena capacidad para cederlos.
2. No existen litigios, reclamaciones ni gravámenes sobre el software
   objeto de esta cesión.
3. Ha entregado al Cesionario, previamente a la firma, el documento
   `docs/PRODUCTION-AUDIT.md` describiendo honestamente el estado
   funcional del software, y el Cesionario reconoce haberlo revisado.
4. **[Si aplica]** No existen contratos de licencia comercial previos
   con terceros que sean incompatibles con esta cesión, salvo los
   listados en el Anexo A.

### Cláusula 4 — Garantía "tal cual" (AS-IS)

Salvo lo expresamente declarado en la Cláusula 3, el software se cede
"tal cual" (*as-is*), sin garantía de estar libre de errores, sin
garantía de idoneidad para un propósito particular, en los mismos
términos de exención de responsabilidad ya presentes en `LICENSE` del
repositorio.

### Cláusula 5 — Contraprestación

El Cesionario pagará al Cedente la cantidad de **[importe y moneda]**,
mediante **[forma de pago: transferencia única / hitos / earn-out,
etc.]**, en los plazos siguientes: **[detallar]**.

### Cláusula 6 — Entrega

El Cedente se compromete a:

1. Transferir la propiedad del repositorio de GitHub (o proporcionar un
   export completo con historial) dentro de **[X días]** tras el pago.
2. **[Si aplica]** Revocar su propio acceso a cuentas de servicio
   transferidas y proporcionar credenciales/keys nuevas al Cesionario.
3. Prestar soporte de transición razonable durante **[X días/semanas]**
   para resolver dudas técnicas sobre el código entregado (alcance a
   acordar; no es soporte indefinido).

### Cláusula 7 — Legislación aplicable y jurisdicción

A definir según la residencia de ambas partes — **[completar con tu
abogado]**.

---

**Firmas**

Cedente: _______________________  Fecha: __________

Cesionario: _______________________  Fecha: __________

---

## Anexo A — Licencias comerciales activas a la fecha de cesión (si aplica)

| Cliente | Edición/Plan | Fecha de inicio | Vigencia |
|---|---|---|---|
| *(completar si existen clientes de pago activos)* | | | |

---

*Relacionado: `docs/ASSET-SALE.md`, `LICENSE`, `LICENSE-COMMERCIAL.md`,
`docs/LICENSING.md`.*
