# ENVIRONMENT — Variables de Entorno de StockDesk

## 1. Estado actual (honesto)

StockDesk **no tiene un proceso de build**, por lo que no consume variables
de entorno de la forma tradicional (`process.env.X` en tiempo de build). No
hay `.env` necesario para que la aplicación funcione en su forma actual.

Se incluye igualmente un `.env.example` de referencia para el día en que se
incorpore un backend o un pipeline de build, y para documentar claramente
cuál es la única "credencial" que maneja hoy la aplicación: la API Key de
IA, que **el usuario final configura desde la propia interfaz**, no como
variable de entorno de despliegue.

## 2. La API Key de IA no es una variable de entorno de Vercel

A diferencia de un backend típico, la API Key de GLM/ZhipuAI:

- **no se configura en Vercel** ni en ningún archivo `.env` del repositorio;
- se introduce por cada usuario en Configuración → Asistente IA, y se
  guarda en `localStorage` de su propio navegador;
- **nunca debe** copiarse a un archivo del repositorio ni a variables de
  entorno de build, porque el bundle es estático y cualquier variable
  "inyectada en build" sería igualmente visible en el código fuente
  entregado al navegador.

Este diseño tiene una implicación de seguridad relevante (ver
`docs/AI.md` y `docs/SECURITY.md`): la key vive y se usa enteramente en el
cliente. Es responsabilidad del usuario usar una key con límites de gasto
razonables.

## 3. `.env.example`

Ver el archivo `.env.example` en la raíz del repositorio. Hoy no tiene
variables activas; se deja como plantilla para cuando exista backend.

## 4. Variables por entorno (futuro, si se añade backend)

| Variable | Development | Preview | Production | Notas |
|---|---|---|---|---|
| `NEXT_PUBLIC_*` / equivalentes de build | — | — | — | No aplica hoy: no hay build step |
| `DATABASE_URL` | (futuro) | (futuro) | (futuro) | Solo si se incorpora backend (Supabase/Postgres) |
| `LICENSE_SERVER_URL` | (futuro) | (futuro) | (futuro) | Solo si se implementa `LicenseService` real, ver `docs/LICENSING.md` |

Ninguna de estas existe en el código actual; se documentan para guiar el
desarrollo futuro.

## 5. Regla de oro

**Los secretos reales (si en el futuro los hay) deben vivir en Vercel
Environment Variables, nunca en Git.** Este repositorio incluye un
`.gitignore` que excluye `.env`, `.env.local` y variantes para evitar que
esto ocurra por accidente.

---

*Relacionado: `docs/AI.md`, `docs/DEPLOYMENT.md`, `docs/SECURITY.md`.*
