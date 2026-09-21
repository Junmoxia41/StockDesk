/**
 * LicenseService — validación de licencia LOCAL/DEMO (sin backend).
 * Stock Desk Application
 *
 * P3 (auditoría de producción): implementación inicial de la interfaz
 * conceptual descrita en docs/LICENSING.md. Es intencionalmente una
 * implementación LOCAL/DEMO: no hay servidor de licencias, no hay
 * verificación criptográfica de la licencia, y CUALQUIER persona con el
 * código puede usar la aplicación completa sin restricciones reales.
 *
 * Este servicio existe para que la futura integración de un backend de
 * licencias (ver docs/LICENSING.md, sección 7 "Separación LOCAL vs
 * SERVER") solo requiera cambiar esta implementación, sin tocar las
 * páginas/módulos que consulten `LicenseService.getFeatures()` o
 * `FeatureFlags`.
 *
 * IMPORTANTE (honestidad): hoy `validate()`/`activate()` NO verifican nada
 * contra un servidor. Simplemente guardan localmente la edición elegida.
 * No se debe presentar esto en la UI como "licencia verificada" ni
 * similar sin dejar claro que es una demo local.
 */
window.LicenseService = {
  STORAGE_KEY: 'stockdesk_license',

  // Ediciones propuestas (ver docs/LICENSING.md, sección 2). Los arrays de
  // features son ilustrativos: hoy TODAS las páginas están disponibles sin
  // importar la edición, porque no hay bloqueo de funciones implementado
  // (ver FeatureFlags más abajo, todo en `true` por defecto).
  EDITIONS: {
    FREE: { name: 'FREE / DEMO', features: ['products', 'sales'] },
    STARTER: { name: 'STARTER', features: ['products', 'sales', 'inventory', 'reports'] },
    PROFESSIONAL: { name: 'PROFESSIONAL', features: ['products', 'sales', 'inventory', 'reports', 'finance', 'users', 'suppliers', 'customization'] },
    BUSINESS: { name: 'BUSINESS', features: ['products', 'sales', 'inventory', 'reports', 'finance', 'users', 'suppliers', 'customization', 'ai', 'security'] },
    ENTERPRISE: { name: 'ENTERPRISE', features: ['products', 'sales', 'inventory', 'reports', 'finance', 'users', 'suppliers', 'customization', 'ai', 'security', 'whitelabel'] }
  },

  /** Estado local de licencia (demo). Nunca fue validado en un servidor. */
  getStatus() {
    const local = Store.get(this.STORAGE_KEY);
    if (!local) {
      return { valid: true, edition: 'FREE', verified: false, mode: 'local-demo' };
    }
    return { ...local, verified: false, mode: 'local-demo' };
  },

  /**
   * "Activa" una edición localmente. No contacta ningún servidor: es
   * exclusivamente una preferencia guardada en este navegador.
   */
  activate(edition) {
    if (!this.EDITIONS[edition]) {
      return { success: false, error: `Edición desconocida: ${edition}` };
    }
    Store.set(this.STORAGE_KEY, { edition, activatedAt: new Date().toISOString() });
    return { success: true, edition };
  },

  /** Vuelve al estado por defecto (FREE/DEMO). */
  deactivate() {
    Store.remove(this.STORAGE_KEY);
    return { success: true };
  },

  /**
   * Validación LOCAL (no real): siempre resuelve `valid: true` porque no
   * hay ningún servidor contra el que validar. Se deja como stub explícito
   * para cuando exista `docs/LICENSING.md` "SERVER LICENSE".
   */
  validate() {
    console.warn('LicenseService.validate(): validación LOCAL/DEMO, no hay backend de licencias todavía.');
    return Promise.resolve(this.getStatus());
  },

  /** Features nominalmente incluidas en la edición activa (ver nota arriba). */
  getFeatures() {
    const status = this.getStatus();
    return this.EDITIONS[status.edition]?.features || this.EDITIONS.FREE.features;
  }
};

/**
 * FeatureFlags — interruptor central de funciones (ver docs/LICENSING.md,
 * sección 5). Hoy todas están en `true`: StockDesk no bloquea ninguna
 * función por edición todavía. Este objeto es el único lugar que habría
 * que tocar para introducir ese bloqueo en el futuro, en vez de repartir
 * checks de licencia por todas las páginas.
 */
window.FeatureFlags = {
  ai: true,
  advancedReports: true,
  multiUser: true,
  cloudBackup: false, // requiere backend, no implementado (ver docs/ARCHITECTURE.md)
  suppliers: true,

  /** true si la función está habilitada globalmente (hoy, siempre local). */
  isEnabled(flag) {
    return this[flag] === true;
  }
};
