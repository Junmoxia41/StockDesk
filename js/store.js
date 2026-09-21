/**
 * Store Module - State Management with LocalStorage
 * Stock Desk Application
 * FULL FIX: incluye payroll y budgets (para Nómina/Presupuestos)
 *
 * NOTA DE PRODUCCIÓN (reconstrucción P0):
 * Este archivo estaba truncado a mitad de la función `products.add` y le
 * faltaban TODOS los namespaces (sales, warehouses, transfers, kardex,
 * inventoryCounts, kits, transactions, expenses, payroll, budgets,
 * security, settings, sales) que el resto de la aplicación invoca.
 * Sin ellos la app no podía ni siquiera cargar (SyntaxError fatal en el
 * primer script), dejando el producto 100% inoperativo.
 * Se reconstruyó respetando exactamente las firmas usadas en
 * js/pages/*.js y js/modules/*.js.
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

  // NOTA (P3, capa de servicios): get/set delegan en StorageService
  // (js/services/storage-service.js), que encapsula el acceso real a
  // localStorage. Esto permite sustituir la persistencia (p. ej. por
  // IndexedDB o un backend remoto) sin tocar Store ni el resto de la app,
  // que siempre habla con Store.get()/Store.set(). Ver docs/ARCHITECTURE.md.
  get(key) {
    if (typeof StorageService !== 'undefined') return StorageService.get(key);
    // Fallback defensivo si StorageService no llegó a cargar (no debería
    // ocurrir en un despliegue normal; ver index.html).
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Store.get error (${key}):`, e);
      return null;
    }
  },

  set(key, value) {
    let result;
    if (typeof StorageService !== 'undefined') {
      result = StorageService.set(key, value);
    } else {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        result = true;
      } catch (e) {
        result = { error: true, name: e.name, message: e.message };
      }
    }

    if (result === true) return true;

    // result es un objeto de error ({ error, name, message })
    const err = result || {};
    console.error(`Store.set error (${key}):`, err.message || err);
    if (err.name === 'QuotaExceededError') {
      if (typeof Components !== 'undefined' && Components.toast) {
        Components.toast('[WARN] Memoria llena. Borra historial antiguo.', 'warning', 5000);
      } else {
        alert('Memoria llena. Borra historial antiguo.');
      }
    }
    return false;
  },

  remove(key) {
    if (typeof StorageService !== 'undefined') return StorageService.remove(key);
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Store.remove error (${key}):`, e);
      return false;
    }
  },

  _nextId(list) {
    return list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
  },

  device: {
    get() { return Store.get(Store.KEYS.DEVICE); },
    set(device) { Store.set(Store.KEYS.DEVICE, device); }
  },

  settings: {
    get() {
      return Store.get(Store.KEYS.SETTINGS) || Store.DEFAULTS.settings;
    },
    update(patch) {
      const current = this.get();
      const updated = { ...current, ...patch };
      Store.set(Store.KEYS.SETTINGS, updated);
      return updated;
    }
  },

  products: {
    getAll() { return Store.get(Store.KEYS.PRODUCTS) || []; },
    getById(id) { return this.getAll().find(p => p.id === id); },
    getByWarehouse(warehouseId) { return this.getAll().filter(p => p.warehouseId === warehouseId); },

    search(query) {
      const q = String(query || '').toLowerCase().trim();
      if (!q) return this.getAll();
      return this.getAll().filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.barcode || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    },

    add(product) {
      const products = this.getAll();
      const newId = Store._nextId(products);

      const newProduct = {
        ...product,
        id: newId,
        warehouseId: product.warehouseId || 1,
        barcode: product.barcode || '',
        sku: product.sku || `SKU-${newId}`,
        lot: product.lot || '',
        expirationDate: product.expirationDate || '',
        minStock: product.minStock || 5,
        stock: Number(product.stock) || 0,
        price: Number(product.price) || 0,
        cost: Number(product.cost) || 0,
        createdAt: new Date().toISOString()
      };

      products.push(newProduct);
      Store.set(Store.KEYS.PRODUCTS, products);
      return newProduct;
    },

    update(id, patch) {
      const products = this.getAll();
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return null;
      products[idx] = { ...products[idx], ...patch, updatedAt: new Date().toISOString() };
      Store.set(Store.KEYS.PRODUCTS, products);
      return products[idx];
    },

    delete(id) {
      const products = this.getAll().filter(p => p.id !== id);
      Store.set(Store.KEYS.PRODUCTS, products);
    },

    // Descuenta stock (usado por el POS). Nunca deja el stock en negativo.
    updateStock(id, quantitySold) {
      const products = this.getAll();
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return null;
      const newStock = Math.max(0, (products[idx].stock || 0) - Number(quantitySold || 0));
      products[idx].stock = newStock;
      Store.set(Store.KEYS.PRODUCTS, products);
      return products[idx];
    }
  },

  sales: {
    getAll() { return Store.get(Store.KEYS.SALES) || []; },
    getById(id) { return this.getAll().find(s => s.id === id); },

    getTodaySales() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.getAll().filter(s => new Date(s.date) >= today);
    },

    add(sale) {
      const sales = this.getAll();
      const newSale = {
        ...sale,
        id: Date.now(),
        date: sale.date || new Date().toISOString()
      };
      sales.push(newSale);
      Store.set(Store.KEYS.SALES, sales);

      // Registrar movimientos de Kardex automáticamente por cada línea vendida
      if (Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          Store.kardex.add(item.id, 'salida', item.qty, `Venta #${String(newSale.id).slice(-6)}`, item.name);
        });
      }

      return newSale;
    }
  },

  warehouses: {
    getAll() { return Store.get(Store.KEYS.WAREHOUSES) || Store.DEFAULTS.warehouses; },
    getById(id) { return this.getAll().find(w => w.id === id); },

    add(warehouse) {
      const warehouses = this.getAll();
      const newWarehouse = { ...warehouse, id: Store._nextId(warehouses), isDefault: false };
      warehouses.push(newWarehouse);
      Store.set(Store.KEYS.WAREHOUSES, warehouses);
      return newWarehouse;
    },

    update(id, patch) {
      const warehouses = this.getAll();
      const idx = warehouses.findIndex(w => w.id === id);
      if (idx === -1) return null;
      warehouses[idx] = { ...warehouses[idx], ...patch };
      Store.set(Store.KEYS.WAREHOUSES, warehouses);
      return warehouses[idx];
    },

    delete(id) {
      const warehouses = this.getAll().filter(w => w.id !== id);
      Store.set(Store.KEYS.WAREHOUSES, warehouses);
    }
  },

  transfers: {
    getAll() { return Store.get(Store.KEYS.TRANSFERS) || []; },
    add(transfer) {
      const transfers = this.getAll();
      const newTransfer = {
        ...transfer,
        id: Store._nextId(transfers),
        date: new Date().toISOString(),
        status: 'completed'
      };
      transfers.push(newTransfer);
      Store.set(Store.KEYS.TRANSFERS, transfers);
      return newTransfer;
    }
  },

  kardex: {
    getAll() { return Store.get(Store.KEYS.KARDEX) || []; },
    getByProduct(productId) { return this.getAll().filter(k => k.productId === productId); },

    add(productId, type, quantity, reason, productNameOverride) {
      const kardex = this.getAll();
      const product = Store.products.getById(productId);
      const productName = productNameOverride || product?.name || 'Producto eliminado';
      const balance = product ? product.stock : null;

      const entry = {
        id: Store._nextId(kardex),
        productId,
        productName,
        type, // 'entrada' | 'salida' | 'transferencia'
        quantity: Number(quantity) || 0,
        balance,
        reason: reason || '',
        date: new Date().toISOString()
      };
      kardex.push(entry);
      Store.set(Store.KEYS.KARDEX, kardex);
      return entry;
    }
  },

  inventoryCounts: {
    getAll() { return Store.get(Store.KEYS.INVENTORY_COUNTS) || []; },
    add(count) {
      const counts = this.getAll();
      const newCount = { ...count, id: Store._nextId(counts), date: new Date().toISOString() };
      counts.push(newCount);
      Store.set(Store.KEYS.INVENTORY_COUNTS, counts);
      return newCount;
    }
  },

  kits: {
    getAll() { return Store.get(Store.KEYS.KITS) || []; },
    add(kit) {
      const kits = this.getAll();
      const newKit = { ...kit, id: Store._nextId(kits), createdAt: new Date().toISOString() };
      kits.push(newKit);
      Store.set(Store.KEYS.KITS, kits);
      return newKit;
    },
    delete(id) {
      const kits = this.getAll().filter(k => k.id !== id);
      Store.set(Store.KEYS.KITS, kits);
    }
  },

  transactions: {
    getAll() { return Store.get(Store.KEYS.TRANSACTIONS) || []; },

    getByDateRange(from, to) {
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;
      if (toDate) toDate.setHours(23, 59, 59, 999);
      return this.getAll().filter(t => {
        const d = new Date(t.date);
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
        return true;
      });
    },

    add(transaction) {
      const transactions = this.getAll();
      const newTransaction = {
        ...transaction,
        id: Store._nextId(transactions),
        amount: Number(transaction.amount) || 0,
        date: transaction.date || new Date().toISOString()
      };
      transactions.push(newTransaction);
      Store.set(Store.KEYS.TRANSACTIONS, transactions);
      return newTransaction;
    }
  },

  expenses: {
    getAll() { return Store.get(Store.KEYS.EXPENSES) || []; },
    add(expense) {
      const expenses = this.getAll();
      const newExpense = {
        ...expense,
        id: Store._nextId(expenses),
        amount: Number(expense.amount) || 0,
        date: new Date().toISOString()
      };
      expenses.push(newExpense);
      Store.set(Store.KEYS.EXPENSES, expenses);

      // Los gastos operativos también impactan el flujo de caja general
      Store.transactions.add({
        type: 'expense',
        category: expense.category,
        amount: newExpense.amount,
        description: expense.description
      });

      return newExpense;
    }
  },

  payroll: {
    getAll() { return Store.get(Store.KEYS.PAYROLL) || []; },

    addEmployee(employee) {
      const payroll = this.getAll();
      const newEmployee = {
        ...employee,
        id: Store._nextId(payroll),
        type: 'employee',
        salary: Number(employee.salary) || 0,
        date: new Date().toISOString()
      };
      payroll.push(newEmployee);
      Store.set(Store.KEYS.PAYROLL, payroll);
      return newEmployee;
    },

    addPayment(payment) {
      const payroll = this.getAll();
      const newPayment = {
        ...payment,
        id: Store._nextId(payroll),
        type: 'payment',
        amount: Number(payment.amount) || 0,
        date: new Date().toISOString()
      };
      payroll.push(newPayment);
      Store.set(Store.KEYS.PAYROLL, payroll);

      // Un pago de nómina es un egreso real del negocio
      Store.transactions.add({
        type: 'expense',
        category: 'Nómina',
        amount: newPayment.amount,
        description: `${payment.concept || 'Pago nómina'} - ${payment.employeeName || ''}`
      });

      return newPayment;
    }
  },

  budgets: {
    getAll() { return Store.get(Store.KEYS.BUDGETS) || []; },
    add(budget) {
      const budgets = this.getAll();
      const newBudget = {
        ...budget,
        id: Store._nextId(budgets),
        amount: Number(budget.amount) || 0,
        createdAt: new Date().toISOString()
      };
      budgets.push(newBudget);
      Store.set(Store.KEYS.BUDGETS, budgets);
      return newBudget;
    }
  },

  security: {
    get() {
      return Store.get(Store.KEYS.SECURITY) || Store.DEFAULTS.security;
    },
    update(patch) {
      const current = this.get();
      const updated = { ...current, ...patch };
      Store.set(Store.KEYS.SECURITY, updated);
      return updated;
    },

    getLogs() { return Store.get(Store.KEYS.SECURITY_LOGS) || []; },
    // NOTA: el campo se llama `event` porque así lo esperan las vistas
    // (security-logs.js, dashboard-widgets.js). Se mantiene `message` como
    // alias por compatibilidad con código que pudiera leerlo así.
    addLog(event, type = 'info') {
      const logs = this.getLogs();
      logs.push({
        id: Store._nextId(logs),
        event,
        message: event,
        type,
        ip: '127.0.0.1',
        device: Store.device.get() || 'Desktop',
        date: new Date().toISOString()
      });
      Store.set(Store.KEYS.SECURITY_LOGS, logs);
    },
    clearLogs() { Store.set(Store.KEYS.SECURITY_LOGS, []); },

    getBackups() { return Store.get(Store.KEYS.SECURITY_BACKUPS) || []; },
    addBackup(backup) {
      const backups = this.getBackups();
      backups.push(backup);
      Store.set(Store.KEYS.SECURITY_BACKUPS, backups);
      return backup;
    },
    deleteBackup(id) {
      const backups = this.getBackups().filter(b => b.id !== id);
      Store.set(Store.KEYS.SECURITY_BACKUPS, backups);
    },

    getSessions() {
      const sessions = Store.get(Store.KEYS.SECURITY_SESSIONS);
      if (sessions && sessions.length > 0) return sessions;
      // Sesión simulada por defecto (no hay backend real de sesiones)
      return [{
        id: 'current',
        device: Store.device.get() || 'Este dispositivo',
        ip: '127.0.0.1',
        lastActive: new Date().toISOString()
      }];
    },
    removeSession(id) {
      const sessions = this.getSessions().filter(s => s.id !== id);
      Store.set(Store.KEYS.SECURITY_SESSIONS, sessions);
    },
    closeAllSessions() {
      Store.set(Store.KEYS.SECURITY_SESSIONS, [this.getSessions()[0]]);
    }
  }
};

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
