# INSTALLATION — StockDesk

StockDesk no requiere Node.js, build tools ni un gestor de paquetes para
ejecutarse: es HTML/CSS/JS estático. Aun así, necesitas servirlo con un
servidor HTTP (no abrir `index.html` con `file://`) para que el Service
Worker (PWA) y las rutas funcionen correctamente.

## 1. Requisitos

- Un navegador moderno (Chrome, Firefox, Safari o Edge recientes).
- Conexión a internet la primera vez que se carga (para Tailwind CSS y
  Google Fonts vía CDN). Cargas posteriores pueden funcionar offline si el
  Service Worker ya cacheó el "app shell" (ver `docs/DEPLOYMENT.md`).
- Cualquier servidor HTTP estático para desarrollo local. Ejemplos:
  - Python 3: `python3 -m http.server 8080`
  - Node.js: `npx serve .`
  - PHP: `php -S localhost:8080`

## 2. Instalación local (desarrollo)

```bash
git clone https://github.com/Junmoxia41/StockDesk.git
cd StockDesk
python3 -m http.server 8080
# abrir http://localhost:8080 en el navegador
```

No hay `npm install` porque no existe `package.json` ni dependencias
instaladas localmente: Tailwind y las fuentes se cargan desde CDN en tiempo
de ejecución (ver `THIRD-PARTY-NOTICES.md`).

## 3. Primer uso

1. Al abrir la aplicación por primera vez, se te pedirá seleccionar el tipo
   de dispositivo (Escritorio / Tablet / Móvil) — esto ajusta la interfaz,
   no crea cuentas.
2. Verás la pantalla de bienvenida (splash) y la landing informativa.
3. En el login, si no existe ningún usuario "admin" todavía, StockDesk crea
   uno automáticamente con usuario `admin` y contraseña `admin` (hash
   SHA-256, ver `docs/SECURITY.md`). **Cambia esta contraseña de inmediato**
   desde Seguridad → Cambiar Contraseña.
4. Desde Configuración puedes cargar datos de demostración o empezar a
   registrar tus propios productos.

## 4. Instalación como PWA (opcional)

Una vez servida sobre HTTPS (o `localhost`), la mayoría de navegadores
ofrecerán instalar StockDesk como aplicación ("Agregar a pantalla de
inicio" / ícono de instalación en la barra de direcciones). Ver
`docs/DEPLOYMENT.md` para el detalle de la estrategia de caché y
actualización.

## 5. Desinstalación / reinicio de datos

Como todos los datos viven en `localStorage` (ver `PRIVACY.md`), puedes:
- Usar la opción "Reiniciar aplicación" desde Configuración, si está
  disponible.
- Borrar los datos del sitio desde la configuración de tu navegador.

**Antes de desinstalar o reiniciar, exporta un backup** (Seguridad →
Copias de Seguridad → Crear Respaldo Ahora, o Configuración → Exportar
datos) si quieres conservar tu información.

---

*Relacionado: `docs/DEPLOYMENT.md`, `docs/ENVIRONMENT.md`,
`docs/TROUBLESHOOTING.md`.*
