"""
StockDesk para Android — punto de entrada para python-for-android
(bootstrap `webview`, sin Kivy).

Arranca el mismo servidor estático local (server.py) que la versión de
Windows y deja que el bootstrap `webview` de python-for-android muestre
esa URL en un WebView nativo de Android. No hay reescritura de la app: es
la misma web servida localmente dentro del propio dispositivo.

python-for-android/Buildozer, con `p4a.bootstrap = webview`, espera que
este script imprima o sirva contenido HTTP en un puerto fijo (por defecto
5000, configurable con --port en buildozer.spec) y se encarga de mostrar
una pantalla de carga hasta que el servidor responde.
"""

import os
import sys
import threading

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from server import start_server  # noqa: E402

# Debe coincidir con `p4a.port` en buildozer.spec.
PORT = 5000


def main():
    start_server(port=PORT)
    # El bootstrap webview de p4a gestiona su propio ciclo de vida de
    # Android (Activity/WebView); este proceso Python solo necesita
    # mantenerse vivo sirviendo peticiones en segundo plano.
    threading.Event().wait()


if __name__ == "__main__":
    main()
