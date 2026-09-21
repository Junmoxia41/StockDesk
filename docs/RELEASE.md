# RELEASE PROCESS — StockDesk

## 1. Versionado

StockDesk usa un esquema de versión simple `AAAA.N` (año + número
incremental dentro del año), reflejado en `CHANGELOG.md`. No se sigue
estrictamente SemVer porque no hay una API pública versionada (no es una
librería consumida por terceros vía npm).

## 2. Antes de publicar una versión

1. Repasar `docs/PRODUCTION-CHECKLIST.md` completo.
2. Actualizar `CHANGELOG.md` con los cambios de la versión (agregado,
   cambiado, corregido, eliminado).
3. Si cambió el comportamiento de PWA/caché, subir `CACHE_VERSION` en
   `service-worker.js`.
4. Si se agregó/cambió una dependencia de terceros (CDN), actualizar
   `THIRD-PARTY-NOTICES.md`.
5. Si cambió cómo se manejan datos personales o el comportamiento de la
   IA, revisar si `PRIVACY.md` necesita actualizarse.

## 3. Publicar

1. Hacer merge a la rama de producción configurada en Vercel (según
   convención del repositorio).
2. Vercel desplegará automáticamente (ver `docs/DEPLOYMENT.md`).
3. Verificar el deployment en producción: consola sin errores, Service
   Worker actualizado, flujo de "Nueva versión disponible" mostrado a
   usuarios con una versión anterior ya instalada.
4. Etiquetar el release en GitHub (`gh release create` o vía UI) con las
   notas relevantes de `CHANGELOG.md`.

## 4. Rollback

Al no haber backend ni migraciones de base de datos, un rollback consiste
en:
1. Revertir el deployment en Vercel a la versión anterior (Vercel guarda
   deployments anteriores y permite "promote to production" de uno previo).
2. Si el problema afecta al Service Worker de forma que usuarios queden
   atascados en una versión rota, subir un `CACHE_VERSION` nuevo con el
   fix es más seguro que depender solo del rollback de Vercel, porque los
   clientes ya pueden tener cacheado el app shell problemático.

## 5. Comunicación de cambios importantes

Cambios que afecten datos existentes de usuarios (por ejemplo, cambios en
el formato de backup) deben documentarse explícitamente en `CHANGELOG.md`
con una nota de migración, y mantenerse retrocompatibles cuando sea
razonable (como el soporte actual de backups formato `v1` heredado, ver
`docs/BACKUPS.md`).

---

*Relacionado: `CHANGELOG.md`, `docs/DEPLOYMENT.md`,
`docs/PRODUCTION-CHECKLIST.md`.*
