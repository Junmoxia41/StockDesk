"""
StockDesk para Windows — punto de entrada de la app nativa (pywebview).

Arranca el servidor estático local (native/server.py) y abre una ventana
nativa de escritorio con pywebview apuntando a él. Es la MISMA app web del
repo, sin ningún cambio de código ni backend nuevo: pywebview simplemente
reemplaza "abrir Chrome/Edge" por una ventana propia, sin barra de
direcciones, con icono y nombre de StockDesk.

Se empaqueta con PyInstaller (--onefile) usando build.spec, que incluye la
carpeta webapp/ (copia de index.html/css/js/assets/manifest/favicon) dentro
del propio .exe.
"""

import os
import sys

# Permite ejecutar tanto como "python native/windows/main.py" (desarrollo)
# como ya empaquetado por PyInstaller.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

import webview  # noqa: E402  (pywebview)

from server import start_server  # noqa: E402


APP_TITLE = "StockDesk"
WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 800


def main():
    url, httpd = start_server()

    window = webview.create_window(
        APP_TITLE,
        url,
        width=WINDOW_WIDTH,
        height=WINDOW_HEIGHT,
        min_size=(1024, 640),
        confirm_close=False,
        text_select=True,
    )

    def on_closed():
        # Apaga el servidor local al cerrar la ventana; no queda ningún
        # proceso en segundo plano tras cerrar la app.
        try:
            httpd.shutdown()
        except Exception:
            pass

    window.events.closed += on_closed

    # gui=None deja que pywebview elija el motor disponible en Windows
    # (normalmente WebView2/Edge Chromium, preinstalado en Windows 10/11).
    webview.start()


if __name__ == "__main__":
    main()
