/**
 * BackupService — fachada de copias de seguridad.
 * Stock Desk Application
 *
 * P3 (auditoría de producción): centraliza la creación/lectura de backups
 * por encima de `Store.security.*` y `BackupValidator`
 * (js/modules/security-backup.js), que siguen siendo la implementación
 * real. La UI (`SecurityBackup`) ya usa estas piezas directamente; este
 * servicio existe para que código NO relacionado con la pantalla de
 * Seguridad (por ejemplo, un futuro recordatorio automático o un flujo de
 * "exportar antes de actualizar") pueda crear/leer backups sin duplicar
 * la lógica de validación de integridad.
 *
 * IMPORTANTE (honestidad, ver docs/BACKUPS.md): los backups se generan y
 * restauran enteramente en el navegador; no hay almacenamiento remoto.
 */
window.BackupService = {
  /** Crea un backup completo (formato v2, con checksum) y lo persiste
   * en la lista de respaldos disponibles. Reutiliza la misma lógica que
   * el botón "Crear Respaldo Ahora" de Seguridad. */
  createBackup() {
    const keysData = {};
    Object.values(Store.KEYS).forEach((k) => {
      keysData[k] = Store.get(k);
    });

    const data = {
      format: 'stockdesk-backup-v2',
      appVersion: '2026.4',
      createdAt: new Date().toISOString(),
      keys: keysData
    };
    data.checksum = BackupValidator.checksum(JSON.stringify(data));

    const backup = {
      id: Date.now().toString(),
      name: `Backup-${new Date().toISOString().split('T')[0]}`,
      date: new Date().toISOString(),
      size: `${(JSON.stringify(data).length / 1024).toFixed(1)} KB`,
      data
    };

    Store.security.addBackup(backup);
    return backup;
  },

  /** Lista los backups disponibles (más reciente primero). */
  listBackups() {
    return Store.security.getBackups().slice().reverse();
  },

  /**
   * Valida (sin restaurar) un objeto de backup ya parseado. Devuelve
   * { valid, error? }. Usa la misma validación de integridad que la UI.
   */
  validate(data) {
    if (data && data.format === 'stockdesk-backup-v2') {
      return BackupValidator.validateV2(data);
    }
    if (data && typeof data === 'object') {
      return { valid: true, legacy: true }; // formato v1 heredado, sin checksum
    }
    return { valid: false, error: 'El archivo no contiene un backup reconocible.' };
  },

  /**
   * Restaura un backup ya validado. Devuelve { success, error? }.
   * No hace la confirmación de UI (eso sigue en SecurityBackup.restore);
   * este método es para flujos programáticos que ya obtuvieron consentimiento.
   */
  restore(data) {
    const result = this.validate(data);
    if (!result.valid) return { success: false, error: result.error };

    if (data.format === 'stockdesk-backup-v2') {
      Object.entries(data.keys).forEach(([key, value]) => {
        if (value !== undefined) Store.set(key, value);
      });
      return { success: true };
    }

    // v1 heredado: mismos campos que SecurityBackup.restore() soporta.
    if (data.products) Store.set(Store.KEYS.PRODUCTS, data.products);
    if (data.sales) Store.set(Store.KEYS.SALES, data.sales);
    if (data.transactions) Store.set(Store.KEYS.TRANSACTIONS, data.transactions);
    if (data.settings) Store.set(Store.KEYS.SETTINGS, data.settings);
    if (data.warehouses) Store.set(Store.KEYS.WAREHOUSES, data.warehouses);
    if (data.payroll) Store.set(Store.KEYS.PAYROLL, data.payroll);
    return { success: true };
  }
};
