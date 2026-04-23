/**
 * Store Module - State Management with LocalStorage
 * Stock Desk Application
 * FULL FIX: incluye payroll y budgets (para Nómina/Presupuestos)
 */
const Store = {
  KEYS: {
    PRODUCTS: 'stockdesk_products',
    SALES: 'stockdesk_sales',
    USER: 'stockdesk_user',
    SETTINGS: 'stockdesk_settings',
    DEVICE: 'stockdesk_device',

    WAREHOUSES: 'stockdesk_warehouses',
    TRANSFERS: 'stockdesk_transfers',
    INVENTORY_COUNTS: 'stockdesk_inventory_counts',
    KARDEX: 'stockdesk_kardex',
    KITS: 'stockdesk_kits',

    TRANSACTIONS: 'stockdesk_transactions',
    EXPENSES: 'stockdesk_expenses',
    PAYROLL: 'stockdesk_payroll',
    BUDGETS: 'stockdesk_budgets',

    SECURITY: 'stockdesk_security',
    SECURITY_LOGS: 'stockdesk_security_logs',
    SECURITY_BACKUPS: 'stockdesk_backups',
    SECURITY_SESSIONS: 'stockdesk_sessions',

    NOTIFICATIONS: 'stockdesk_notifications',
    CHANNELS: 'stockdesk_channels',
    ALERT_CONFIG: 'stockdesk_alert_config',

    SUPPLIERS: 'stockdesk_suppliers',
    PURCHASE_ORDERS: 'stockdesk_purchase_orders',

    CUSTOM_FIELDS: 'stockdesk_custom_fields',
    CATEGORIES: 'stockdesk_categories',

    TICKET_CONFIG: 'stockdesk_ticket_config',
    THEME: 'stockdesk_theme',
    CUSTOM_COLORS: 'stockdesk_custom_colors',

    USERS: 'stockdesk_users',
    ROLES: 'stockdesk_roles',
    SHIFTS: 'stockdesk_shifts',
    REGISTERS: 'stockdesk_registers',
    AUDIT_LOGS: 'stockdesk_audit_logs',

    SECURITY_ACCESS: 'stockdesk_security_access',
    SECURITY_PROTECTION: 'stockdesk_security_protection',
    SECURITY_THREATS: 'stockdesk_security_threats'
  },

  DEFAULTS: {
    settings: {
      businessName: 'Mi Negocio',
      currency: 'USD',
      sidebarCollapsed: false,
      logRetention: 30,
      logo: null
    },

    warehouses: [{ id: 1, name: 'Almacén Principal', location: 'Principal', isDefault: true }],

    security: {
      twoFactorEnabled: false,
      lockOnFailure: true,
      encryptionEnabled: false,
      autoBackup: false,
      backupFrequency: 'daily',
      backupRetention: 30,
      sessionTimeout: 60
    },

    security_access: {
      ipWhitelistEnabled: false,
      ips: [],
      scheduleEnabled: false,
      startTime: '08:00',
      endTime: '18:00',
      geoBlockEnabled: false
    },

    security_threats: {
      bruteForceProtection: true,
      maxAttempts: 5,
      wafEnabled: false,
      sqlInjectionCheck: false,
      xssProtection: true
    },

    security_protection: {
      dataMasking: false,
      secureDeletion: false,
      encryptionLevel: 'standard'
    },

    channels: { email: false, sms: false, whatsapp: false, push: true },

    alert_config: {
      lowStock: { enabled: false, threshold: 10 },
      dailySummary: { enabled: false, time: '18:00' },
      newSale: { enabled: false, minAmount: 100 },
      pendingPayments: { enabled: false }
    },

    // Tickets pro + pago/cambio + unit price
    ticket_config: {
      showLogo: true,
      showDate: true,
      showCashier: true,
      showCustomer: false,
      autoPrint: false,
      showUnitPrice: true,
      showPayment: true,
      header: 'Stock Desk',
      footer: 'Gracias por su compra',
      width: '80mm'
    }
  },

  init() {
    // Inicializa listas vacías si faltan (sin pisar configs)
    Object.values(this.KEYS).forEach(key => {
      if (!localStorage.getItem(key)) {
        const configKeys = [
          this.KEYS.SETTINGS,
          this.KEYS.SECURITY,
          this.KEYS.SECURITY_ACCESS,
          this.KEYS.SECURITY_THREATS,
          this.KEYS.SECURITY_PROTECTION,
          this.KEYS.CHANNELS,
          this.KEYS.ALERT_CONFIG,
          this.KEYS.TICKET_CONFIG
        ];
        if (!configKeys.includes(key) && key !== this.KEYS.ROLES) {
          this.set(key, []);
        }
      }
    });

    // Safe load defaults
    this._safeLoad(this.KEYS.SETTINGS, this.DEFAULTS.settings);
    this._safeLoad(this.KEYS.WAREHOUSES, this.DEFAULTS.warehouses);
    this._safeLoad(this.KEYS.SECURITY, this.DEFAULTS.security);
    this._safeLoad(this.KEYS.SECURITY_ACCESS, this.DEFAULTS.security_access);
    this._safeLoad(this.KEYS.SECURITY_THREATS, this.DEFAULTS.security_threats);
    this._safeLoad(this.KEYS.SECURITY_PROTECTION, this.DEFAULTS.security_protection);
    this._safeLoad(this.KEYS.CHANNELS, this.DEFAULTS.channels);
    this._safeLoad(this.KEYS.ALERT_CONFIG, this.DEFAULTS.alert_config);
    this._safeLoad(this.KEYS.TICKET_CONFIG, this.DEFAULTS.ticket_config);

    this.cleanupLogs();
  },

  _safeLoad(key, defaults) {
    const current = this.get(key);

    if (current === null || current === undefined) {
      this.set(key, defaults);
      return;
    }

    if (Array.isArray(defaults)) {
      if (!Array.isArray(current) || current.length === 0) this.set(key, defaults);
      return;
    }

    if (typeof defaults === 'object' && !Array.isArray(defaults)) {
      const merged = this._deepMerge(defaults, current);
      this.set(key, merged);
    }
  },

  _deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          output[key] = (key in target) ? this._deepMerge(target[key], source[key]) : source[key];
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  },

  cleanupLogs() {
    const settings = this.get(this.KEYS.SETTINGS) || {};
    const retentionDays = parseInt(settings.logRetention) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    [this.KEYS.SECURITY_LOGS, this.KEYS.AUDIT_LOGS].forEach(key => {
      const logs = this.get(key) || [];
      if (Array.isArray(logs) && logs.length > 0) {
        const clean = logs.filter(l => new Date(l.date) >= cutoffDate);
        if (clean.length !== logs.length) this.set(key, clean);
      }
    });
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Store.get error (${key}):`, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Store.set error (${key}):`, e);
      if (e.name === 'QuotaExceededError') {
        if (typeof Components !== 'undefined' && Components.toast) {
          Components.toast('[WARN] Memoria llena. Borra historial antiguo.', 'warning', 5000);
        } else {
          alert('Memoria llena. Borra historial antiguo.');
        }
      }
      return false;
    }
  },

  device: {
    get() { return Store.get(Store.KEYS.DEVICE); },
    set(device) { Store.set(Store.KEYS.DEVICE, device); }
  },

  products: {
    getAll() { return Store.get(Store.KEYS.PRODUCTS) || []; },
    getById(id) { return this.getAll().find(p => p.id === id); },
    getByWarehouse(warehouseId) { return this.getAll().filter(p => p.warehouseId === warehouseId); },

    add(product) {
      const products = this.getAll();
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

      const newProduct = {
        ...product,
        id: newId,
        warehouseId: product.warehouseId || 1,
        barcode: product.barcode || '',
        sku: product.sku || `SKU-${newId}`,
        lot: product.lot || '',
        expirationDate: product.expirationDate || '',
        minStock: product.minStock || 5,
        createdAt: new Date().toISOString()
      };

      products.push(newProduct);
      Store.set
