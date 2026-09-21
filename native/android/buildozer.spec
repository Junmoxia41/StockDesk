[app]

# (str) Title of your application
title = StockDesk

# (str) Package name
package.name = stockdesk

# (str) Package domain (needed for android packaging)
package.domain = com.stockdesk

# (str) Source code where main.py lives.
# El workflow de CI copia native/android/main.py, native/server.py y una
# copia de la web (index.html, css/, js/, assets/, manifest.webmanifest,
# favicon.ico) dentro de esta misma carpeta antes de invocar buildozer,
# para que todo viaje junto al script principal.
source.dir = .

# (list) Source files to include
source.include_exts = py,png,jpg,jpeg,ico,html,css,js,json,webmanifest,txt,svg,woff,woff2,ttf

# (str) Application versioning
version = 1.0.0

# (list) Application requirements. Bootstrap webview no requiere Kivy.
requirements = python3

# (str) Presplash / icono de la app
presplash.filename = %(source.dir)s/webapp/assets/icons/icon-512.png
icon.filename = %(source.dir)s/webapp/assets/icons/icon-512.png

# (str) Orientación soportada
orientation = portrait

# (bool) Pantalla completa
fullscreen = 0

#
# Android specific
#

# (list) Permisos: solo red local para el servidor HTTP embebido en
# 127.0.0.1 (no se usa Internet real; la IA y demás siguen siendo
# opcionales y solo se activan si el usuario configura su propia API key).
android.permissions = INTERNET

# (int) Target Android API
android.api = 33

# (int) Minimum API
android.minapi = 24

# (list) Arquitecturas objetivo
android.archs = arm64-v8a, armeabi-v7a

# (bool) Acepta automáticamente las licencias del SDK en CI
android.accept_sdk_license = True

#
# python-for-android (p4a) specific
#

# Bootstrap webview: p4a arranca este main.py y muestra en un WebView
# nativo la URL http://127.0.0.1:<p4a.port>/ una vez el servidor responde.
p4a.bootstrap = webview
p4a.port = 5000

[buildozer]

log_level = 2
warn_on_root = 1
