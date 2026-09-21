# StockDesk Native (Android / Windows)

Esta carpeta empaqueta la **misma aplicación web** (`index.html`, `css/`,
`js/`, `assets/`, `manifest.webmanifest`) como una app nativa instalable,
**sin reescribir ni un solo archivo de la app web**. No hay backend nuevo:
es la web de siempre, servida localmente y mostrada en un WebView/ventana
nativa.

## Cómo funciona (honesto, sin humo)

1. Un pequeño servidor HTTP en Python (`server.py`), basado únicamente en
   la librería estándar (`http.server`), sirve los archivos estáticos del
   repo (`index.html`, `css/`, `js/`, `assets/`, `manifest.webmanifest`,
   `favicon.ico`) desde `http://127.0.0.1:<puerto>/`.
2. En **Windows**, `windows/main.py` abre una ventana nativa con
   [`pywebview`](https://pywebview.flowrl.com/) apuntando a ese servidor
   local. Se empaqueta con PyInstaller en un único `.exe`
   (`--onefile`), incluyendo la web dentro del propio ejecutable.
3. En **Android**, `android/main.py` usa el *bootstrap* `webview` de
   [python-for-android](https://python-for-android.readthedocs.io/) /
   [Buildozer](https://buildozer.readthedocs.io/): arranca el mismo
   servidor local y Android muestra un `WebView` nativo apuntando a él.
   No se usa Kivy: python-for-android solo actúa como empaquetador.

En ambos casos, **los datos siguen viviendo en el almacenamiento local del
navegador embebido** (`localStorage`, vía `StorageService`), exactamente
igual que en la versión web — ver `docs/ARCHITECTURE.md`. Empaquetar como
app nativa **no añade sincronización, backend ni backup en la nube**: solo
cambia cómo se abre la aplicación (icono propio, sin barra de navegador,
funciona sin conexión igual que la PWA).

## Estructura

```
native/
├── server.py           # Servidor HTTP local compartido (stdlib únicamente)
├── windows/
│   ├── main.py          # Punto de entrada pywebview para Windows
│   ├── requirements.txt # pywebview + pyinstaller
│   └── build.spec        # Spec de PyInstaller (--onefile)
└── android/
    ├── main.py           # Punto de entrada python-for-android (bootstrap webview)
    └── buildozer.spec    # Configuración de Buildozer para generar el .apk
```

## Compilación

No se compila en este entorno de desarrollo (sandbox Linux sin SDK/NDK de
Android ni entorno Windows). Se compila en **GitHub Actions**, en runners
reales de cada plataforma:

- `.github/workflows/build-windows.yml` → compila el `.exe` en un runner
  `windows-latest` con PyInstaller.
- `.github/workflows/build-android.yml` → compila el `.apk` en un runner
  `ubuntu-latest` con Buildozer (Docker oficial de Buildozer).

Ambos workflows se disparan manualmente (`workflow_dispatch`) o al crear un
tag `v*`, y suben el resultado como *artifact* descargable (y, si es un
tag, también como *release* de GitHub). Ver `docs/NATIVE-APPS.md` para la
guía paso a paso de cómo descargarlos y qué esperar de cada uno.

## Limitaciones honestas

- **APK de Android**: firmado con la clave de *debug* automática de
  Buildozer. Sirve para instalar y probar en cualquier dispositivo
  Android (activando "orígenes desconocidos"), **no** para publicar en
  Google Play tal cual — eso requiere una clave de *release* propia y
  no está cubierto por este flujo.
- **Un solo dispositivo, sin sincronización**: cada instalación (Android o
  Windows) tiene sus propios datos locales, igual que la PWA. No hay
  servidor central.
- **Sin trabajo en segundo plano real**: el servidor local solo corre
  mientras la app está abierta.
