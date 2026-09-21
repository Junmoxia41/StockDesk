# PyInstaller spec para StockDesk (Windows, --onefile).
#
# Se espera que, antes de invocar `pyinstaller build.spec`, exista una
# carpeta native/windows/webapp/ con una copia de la app web
# (index.html, css/, js/, assets/, manifest.webmanifest, favicon.ico).
# El workflow de GitHub Actions (build-windows.yml) se encarga de copiarla
# desde la raíz del repo antes de este paso.
#
# Uso manual (en Windows, con las dependencias de requirements.txt
# instaladas):
#   cd native/windows
#   xcopy /E /I ..\..\index.html . & (copiar index.html, css, js, assets,
#   manifest.webmanifest, favicon.ico dentro de una carpeta "webapp")
#   pyinstaller build.spec
#
# El resultado queda en native/windows/dist/StockDesk.exe (un solo archivo).

import os

block_cipher = None

here = os.path.dirname(os.path.abspath(SPEC))

a = Analysis(
    ['main.py'],
    pathex=[here, os.path.join(here, '..')],
    binaries=[],
    datas=[
        (os.path.join(here, 'webapp'), 'webapp'),
    ],
    hiddenimports=['webview.platforms.winforms', 'webview.platforms.edgechromium'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='StockDesk',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=os.path.join(here, 'webapp', 'assets', 'icons', 'icon-256.ico') if os.path.exists(os.path.join(here, 'webapp', 'assets', 'icons', 'icon-256.ico')) else None,
)
