# NATIVE-APPS — StockDesk para Windows y Android

## 1. Qué es (y qué no es)

StockDesk es, en esencia, una aplicación web. Este documento describe cómo
se empaqueta **la misma aplicación web, sin ningún cambio de código**,
como:

- un ejecutable de **Windows** (`StockDesk.exe`, un solo archivo), y
- un **APK de Android** instalable.

No existe una versión "nativa" distinta con más funciones: es exactamente
la web (`index.html`, `css/`, `js/`, `assets/`) mostrada dentro de una
ventana/WebView propio, sin la barra de direcciones del navegador y con
icono y nombre de StockDesk. Los datos siguen guardándose localmente
(`localStorage`, ver `docs/ARCHITECTURE.md`), igual que en la PWA — **no
hay sincronización entre el Windows, el Android y la versión web**: cada
instalación tiene sus propios datos.

Ver `native/README.md` para el detalle técnico de implementación
(servidor local en Python + pywebview / python-for-android).

## 2. Cómo obtener los binarios

Los binarios **no se generan ni se commitean en este repositorio**: se
compilan bajo demanda en GitHub Actions, en runners reales de cada
sistema operativo (Windows para el `.exe`, Linux con Docker de Buildozer
para el `.apk`).

### Opción A — Disparar el build manualmente

1. En GitHub, ve a la pestaña **Actions** del repositorio.
2. Elige el workflow **"Build Windows App"** o **"Build Android APK"**.
3. Pulsa **"Run workflow"** sobre la rama que quieras compilar.
4. Cuando termine (Windows: ~5-10 min; Android: ~20-40 min la primera
   vez, porque descarga el SDK/NDK), descarga el resultado desde la
   sección **Artifacts** de esa ejecución:
   - `StockDesk-windows-exe` → contiene `StockDesk-windows.exe`.
   - `StockDesk-android-apk` → contiene `StockDesk-android.apk`.

### Opción B — Crear una release con un tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

Al hacer push de un tag `v*`, ambos workflows se disparan automáticamente
y, si tienen éxito, adjuntan el `.exe` y el `.apk` a una **Release** de
GitHub con ese nombre de tag, lista para compartir un enlace de descarga
directo.

## 3. Instalar en Windows

1. Descarga `StockDesk-windows.exe`.
2. Es un ejecutable **sin firmar** (no tiene certificado de code-signing
   comercial): Windows SmartScreen probablemente mostrará un aviso
   ("Windows protegió su PC"). Hay que pulsar **"Más información" →
   "Ejecutar de todas formas"**. Esto es normal y esperable para
   ejecutables sin firmar, no indica un problema del programa; para
   evitarlo en el futuro haría falta comprar un certificado de firma de
   código (fuera del alcance de este flujo automatizado).
3. Al abrirlo, aparece una ventana con StockDesk. La primera vez, la app
   pedirá el flujo normal de configuración inicial (igual que en el
   navegador).

No requiere instalar Python ni ninguna otra dependencia: todo va incluido
en el `.exe`.

## 4. Instalar en Android

1. Descarga `StockDesk-android.apk` en el dispositivo.
2. Como no viene de Google Play, Android pedirá habilitar **"Instalar
   apps de fuentes desconocidas"** para el navegador/gestor de archivos
   usado. Es el comportamiento normal para cualquier APK fuera de una
   tienda de aplicaciones.
3. **Este APK está firmado con la clave de depuración (`debug`) que
   genera Buildozer automáticamente**, no con una clave de release
   propia. Es válido para instalar y probar en cualquier dispositivo
   Android, pero:
   - **no se puede subir tal cual a Google Play** (Play exige firma de
     release con una clave propia y gestionada, y además una ficha de
     app, políticas de privacidad enlazadas, etc. — ver
     `docs/RELEASE.md` si se decide dar ese paso más adelante);
   - actualizaciones futuras deberán reinstalarse manualmente (sin
     "Actualizar" automático de una tienda).

## 5. Limitaciones honestas de estas apps

- **No hay backend ni sincronización**: cada instalación (Windows,
  Android, o la propia web en un navegador) mantiene sus propios datos
  locales de forma independiente. Para pasar datos entre dispositivos hay
  que usar `BackupService`/exportar-importar backups manualmente (ver
  `docs/BACKUPS.md`), igual que en la web.
- **El servidor local solo corre mientras la app está abierta**: no hay
  ningún proceso en segundo plano una vez cerrada la ventana (Windows) o
  la app (Android).
- **Tamaño del APK**: al incluir un intérprete de Python completo dentro
  del propio APK (vía python-for-android), el archivo pesa más que una
  app Android nativa típica (decenas de MB). Es el costo esperado de este
  enfoque de "empaquetar la web sin reescribirla en Kotlin/Java".
- **Icono/splash**: se reutiliza el icono PWA existente
  (`assets/icons/icon-512.png`); no se ha diseñado un branding nativo
  específico por plataforma.

## 6. Actualizar la app nativa cuando cambie la web

Como ambas apps sirven una **copia** de la web (ver
`native/copy_web_assets.py`), cualquier cambio en `index.html`, `css/`,
`js/` o `assets/` requiere **volver a compilar** (disparar de nuevo los
workflows) para que se refleje en el `.exe`/`.apk` ya instalados. No hay
auto-actualización: cada nueva versión es un nuevo binario a descargar e
instalar/reinstalar manualmente, hasta que exista un mecanismo de
actualización propio (fuera del alcance actual).

---

*Relacionado: `native/README.md` (detalle de implementación),
`docs/ARCHITECTURE.md`, `docs/RELEASE.md`, `docs/LICENSING.md`.*
