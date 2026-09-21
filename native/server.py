"""
StockDesk - servidor HTTP local compartido para las apps nativas
(Windows con pywebview, Android con python-for-android/webview).

No es un backend de StockDesk: es únicamente un servidor de archivos
estáticos (usa solo la librería estándar de Python, sin dependencias)
que sirve la MISMA aplicación web del repo (index.html, css/, js/,
assets/, manifest.webmanifest, favicon.ico) desde localhost, para que un
WebView nativo la muestre como si fuera una app instalada.

No se reescribe ni una sola línea de la app web para esto: se sirve tal
cual, exactamente como lo haría Vercel o cualquier hosting estático.
"""

import http.server
import os
import socket
import socketserver
import sys
import threading


def _web_root_from_here(this_file):
    """
    Ubica la carpeta que contiene index.html a partir de este archivo,
    funcionando tanto en desarrollo (native/server.py junto al repo)
    como empaquetado (PyInstaller --onefile, python-for-android), donde
    los assets viajan junto al script empaquetado.
    """
    here = os.path.dirname(os.path.abspath(this_file))

    # 1) Empaquetado con PyInstaller --onefile: los datos añadidos con
    #    --add-data quedan en sys._MEIPASS en tiempo de ejecución.
    meipass = getattr(sys, "_MEIPASS", None)
    if meipass and os.path.isfile(os.path.join(meipass, "webapp", "index.html")):
        return os.path.join(meipass, "webapp")

    # 2) Desarrollo local: native/server.py -> ../ (raíz del repo)
    candidate = os.path.abspath(os.path.join(here, ".."))
    if os.path.isfile(os.path.join(candidate, "index.html")):
        return candidate

    # 3) android/main.py y windows/main.py copian la web a ./webapp junto
    #    al propio script antes de empaquetar (ver build.spec / buildozer.spec).
    candidate = os.path.join(here, "webapp")
    if os.path.isfile(os.path.join(candidate, "index.html")):
        return candidate

    raise FileNotFoundError(
        "No se encontró index.html de StockDesk junto al servidor nativo. "
        "Revisa native/README.md."
    )


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    """Handler estático de solo lectura, sin logging por stdout (ruidoso en
    apps empaquetadas) y con soporte correcto de .webmanifest."""

    def log_message(self, fmt, *args):
        pass

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".webmanifest": "application/manifest+json",
        ".js": "application/javascript",
    }


class _ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def _free_port():
    """Encuentra un puerto TCP libre en localhost."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def start_server(web_root=None, port=None):
    """
    Arranca el servidor estático en un hilo daemon y devuelve la URL local
    (por ejemplo 'http://127.0.0.1:53214/'). No bloquea: la app nativa que
    llama a esta función sigue con su propio loop (webview.start() o el
    loop de Android).
    """
    root = web_root or _web_root_from_here(__file__)
    chosen_port = port or _free_port()

    handler = lambda *args, **kwargs: _QuietHandler(*args, directory=root, **kwargs)
    httpd = _ThreadingHTTPServer(("127.0.0.1", chosen_port), handler)

    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()

    return f"http://127.0.0.1:{chosen_port}/", httpd


if __name__ == "__main__":
    # Modo standalone, útil para probar server.py sin webview/pywebview:
    #   python3 native/server.py
    url, httpd = start_server()
    print(f"StockDesk sirviendo en {url} (Ctrl+C para detener)")
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        httpd.shutdown()
