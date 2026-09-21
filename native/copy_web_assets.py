#!/usr/bin/env python3
"""
Copia la app web (index.html, css/, js/, assets/, manifest.webmanifest,
favicon.ico) desde la raíz del repo hacia native/<target>/webapp/, para
que quede empaquetada junto al script nativo correspondiente (PyInstaller
en Windows, python-for-android en Android).

No modifica ni un archivo de la web: es una copia literal.

Uso:
    python3 native/copy_web_assets.py windows
    python3 native/copy_web_assets.py android
"""

import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

WEB_ITEMS = [
    "index.html",
    "css",
    "js",
    "assets",
    "manifest.webmanifest",
    "favicon.ico",
]


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in ("windows", "android"):
        print("Uso: python3 native/copy_web_assets.py [windows|android]")
        sys.exit(1)

    target = sys.argv[1]
    dest = REPO_ROOT / "native" / target / "webapp"

    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)

    for item in WEB_ITEMS:
        src = REPO_ROOT / item
        if not src.exists():
            print(f"AVISO: {src} no existe, se omite.")
            continue
        if src.is_dir():
            shutil.copytree(src, dest / item)
        else:
            shutil.copy2(src, dest / item)

    print(f"Copiado a {dest}")


if __name__ == "__main__":
    main()
