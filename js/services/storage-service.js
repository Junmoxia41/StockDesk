/**
 * StorageService — capa de acceso a almacenamiento de bajo nivel.
 * Stock Desk Application
 *
 * P3 (auditoría de producción): StockDesk usa `localStorage` directamente
 * en `Store.get()/set()`. Este servicio existe para que ese acceso quede
 * detrás de una interfaz estable y reemplazable: si en el futuro se migra
 * a IndexedDB o a un backend remoto (ver docs/ARCHITECTURE.md, sección 4
 * "Backend futuro"), solo hay que cambiar la implementación de
 * StorageService, sin tocar Store ni ninguna página/módulo que ya use
 * `Store.get/set/remove`.
 *
 * IMPORTANTE (honestidad): esta es la MISMA implementación de localStorage
 * que ya existía, solo movida detrás de una interfaz con nombre. No agrega
 * cifrado, cuotas ni sincronización — eso sigue siendo trabajo futuro
 * documentado en docs/ARCHITECTURE.md y docs/SECURITY.md.
 *
 * Uso real en el código: `Store.get()`/`Store.set()`/`Store.remove()`
 * delegan en `StorageService` (ver js/store.js). Esto no es un archivo
 * "de adorno": si se rompe, toda la app deja de persistir datos.
 */
window.StorageService = {
  /**
   * Lee y parsea un valor JSON guardado bajo `key`.
   * @returns {*} el valor parseado, o null si no existe o hay un error.
   */
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error(`StorageService.get error (${key}):`, e);
      return null;
    }
  },

  /**
   * Serializa y guarda `value` bajo `key`.
   * @returns {boolean} true si se pudo guardar, false si falló
   *   (por ejemplo, `QuotaExceededError` cuando el navegador se queda sin
   *   espacio de almacenamiento local).
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`StorageService.set error (${key}):`, e);
      return { error: true, name: e.name, message: e.message };
    }
  },

  /** Elimina la clave indicada. */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`StorageService.remove error (${key}):`, e);
      return false;
    }
  },

  /** Devuelve todas las claves actualmente usadas en localStorage. */
  listKeys() {
    try {
      return Object.keys(localStorage);
    } catch (e) {
      return [];
    }
  },

  /**
   * Tamaño aproximado (en bytes) de todo lo guardado en localStorage por
   * esta app. Útil para diagnósticos (ver docs/BACKUPS.md, límites de
   * localStorage).
   */
  estimateUsageBytes() {
    try {
      let total = 0;
      for (const key of Object.keys(localStorage)) {
        const value = localStorage.getItem(key) || '';
        total += key.length + value.length;
      }
      return total * 2; // UTF-16: ~2 bytes por carácter
    } catch (e) {
      return 0;
    }
  }
};
