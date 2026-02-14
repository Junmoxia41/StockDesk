/**
 * Store Module - State Management with LocalStorage
 * Stock Desk Application
 * 
 * ROBUST VERSION: Includes Deep Merging and Safe Defaults
 * to prevent crashes when upgrading versions.
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
        INVENTORY_ADJUSTMENTS: 'stockdesk_adjustments',
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
        
        // New Modular Keys
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
        
        // Security Sub-modules
        SECURITY_ACCESS: 'stockdesk_security_access',
        SECURITY_PROTECTION: 'stockdesk_security_protection',
        SECURITY_THREATS: 'stockdesk_security_threats'
    },

    // Master Default State - The "Blueprint"
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
        ticket_config: {
            showLogo: true,
            showDate: true,
            showCashier: true,
            header: 'Stock Desk',
            footer: 'Gracias por su compra',
            width: '80mm'
        }
    },

    init() {
        console.log('📦 Store: Initializing Safe Load...');
        
        // 1. Initialize basic keys with [] if missing
        Object.values(this.KEYS).forEach(key => {
            if (!localStorage.getItem(key)) {
                // If it's a key that requires a complex object default, handle it below.
                // Otherwise, default to empty array for lists.
                const isList = !['stockdesk_settings', 'stockdesk_security', 'stockdesk_security_access', 'stockdesk_alert_config'].includes(key);
                if (isList && !this._getDefaultForKey(key)) {
                    this.set(key, []);
                }
            }
        });

        // 2. Perform Deep Merge for Configuration Objects
        // This ensures new features don't crash old data
        this._safeLoad(this.KEYS.SETTINGS, this.DEFAULTS.settings);
        this._safeLoad(this.KEYS.WAREHOUSES, this.DEFAULTS.warehouses);
        this._safeLoad(this.KEYS.SECURITY, this.DEFAULTS.security);
        this._safeLoad(this.KEYS.SECURITY_ACCESS, this.DEFAULTS.security_access);
        this._safeLoad(this.KEYS.SECURITY_THREATS, this.DEFAULTS.security_threats);
        this._safeLoad(this.KEYS.SECURITY_PROTECTION, this.DEFAULTS.security_protection);
        this._safeLoad(this.KEYS.CHANNELS, this.DEFAULTS.channels);
        this._safeLoad(this.KEYS.ALERT_CONFIG, this.DEFAULTS.alert_config);
        this._safeLoad(this.KEYS.TICKET_CONFIG, this.DEFAULTS.ticket_config);
        
        // Clean old logs on startup
        this.cleanupLogs();
        
        console.log('✅ Store: Initialization Complete.');
    },

    // Helper: Get default value if defined in DEFAULTS
    _getDefaultForKey(storageKey) {
        // Map storage keys to DEFAULTS properties
        if (storageKey === this.KEYS.SETTINGS) return this.DEFAULTS.settings;
        if (storageKey === this.KEYS.SECURITY) return this.DEFAULTS.security;
        // ... add others if needed for strict mapping
        return null;
    },

    // Helper: Deep Merge strategy
    _safeLoad(key, defaults) {
        const current = this.get(key);
        if (!current) {
            // New install or missing key: Set default
            this.set(key, defaults);
        } else if (typeof defaults === 'object' && !Array.isArray(defaults)) {
            // Existing data: Merge to ensure new fields exist
            // We clone defaults first, then overwrite with current data
            // This ensures structure matches latest version
            const merged = this._deepMerge(defaults, current);
            this.set(key, merged);
        }
        // Arrays are generally just loaded or initialized as-is
    },

    _deepMerge(target, source) {
        const output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this._deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
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

        // List of log keys to clean
        const logKeys = [
            this.KEYS.SECURITY_LOGS,
            this.KEYS.AUDIT_LOGS
        ];

        logKeys.forEach(key => {
            const logs = this.get(key) || [];
            if (Array.isArray(logs) && logs.length > 0) {
                const cleanLogs = logs.filter(l => new Date(l.date) >= cutoffDate);
                if (logs.length !== cleanLogs.length) {
                    this.set(key, cleanLogs);
                    console.log(`🧹 Cleaned ${logs.length - cleanLogs.length} old logs from ${key}`);
                }
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
            // Handle quota exceeded?
            if (e.name === 'QuotaExceededError') {
                Components.toast('⚠️ Memoria llena. Borra historial antiguo.', 'warning', 5000);
            }
            return false;
        }
    },

    // --- Specific Module Accessors (Proxies) ---

    // Device config
    device: {
        get() { return Store.get(Store.KEYS.DEVICE); },
        set(device) { Store.set(Store.KEYS.DEVICE, device); }
    },

    // Products
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
                serialNumbers: product.serialNumbers || [],
                unitOfMeasure: product.unitOfMeasure || 'unidad',
                minStock: product.minStock || 5,
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
            Store.set(Store.KEYS.PRODUCTS, products);
            Store.kardex.add(newId, 'entrada', product.stock || 0, 'Stock inicial');
            return newProduct;
        },
        update(id, data) {
            const products = this.getAll();
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                const oldStock = products[index].stock;
                products[index] = { ...products[index], ...data };
                Store.set(Store.KEYS.PRODUCTS, products);
                if (data.stock !== undefined && data.stock !== oldStock) {
                    const diff = data.stock - oldStock;
                    Store.kardex.add(id, diff > 0 ? 'entrada' : 'salida', Math.abs(diff), 'Ajuste manual');
                }
                return products[index];
            }
            return null;
        },
        delete(id) {
            const products = this.getAll().filter(p => p.id !== id);
            Store.set(Store.KEYS.PRODUCTS, products);
            return true;
        },
        updateStock(id, quantity, reason = 'Venta') {
            const products = this.getAll();
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index].stock = Math.max(0, products[index].stock - quantity);
                Store.set(Store.KEYS.PRODUCTS, products);
                Store.kardex.add(id, 'salida', quantity, reason);
                return products[index];
            }
            return null;
        },
        search(query) {
            const q = query.toLowerCase();
            return this.getAll().filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.category.toLowerCase().includes(q) ||
                (p.barcode && p.barcode.includes(q)) ||
                (p.sku && p.sku.toLowerCase().includes(q))
            );
        }
    },

    // Warehouses
    warehouses: {
        getAll() { return Store.get(Store.KEYS.WAREHOUSES) || []; },
        getById(id) { return this.getAll().find(w => w.id === id); },
        add(warehouse) {
            const warehouses = this.getAll();
            const newId = warehouses.length > 0 ? Math.max(...warehouses.map(w => w.id)) + 1 : 1;
            warehouses.push({ ...warehouse, id: newId });
            Store.set(Store.KEYS.WAREHOUSES, warehouses);
            return { ...warehouse, id: newId };
        },
        update(id, data) {
            const warehouses = this.getAll();
            const index = warehouses.findIndex(w => w.id === id);
            if (index !== -1) {
                warehouses[index] = { ...warehouses[index], ...data };
                Store.set(Store.KEYS.WAREHOUSES, warehouses);
                return warehouses[index];
            }
            return null;
        },
        delete(id) {
            const warehouses = this.getAll().filter(w => w.id !== id);
            Store.set(Store.KEYS.WAREHOUSES, warehouses);
            return true;
        }
    },

    // Transfers
    transfers: {
        getAll() { return Store.get(Store.KEYS.TRANSFERS) || []; },
        add(transfer) {
            const transfers = this.getAll();
            const newTransfer = {
                id: Date.now(),
                date: new Date().toISOString(),
                status: 'completed',
                ...transfer
            };
            transfers.push(newTransfer);
            Store.set(Store.KEYS.TRANSFERS, transfers);
            return newTransfer;
        }
    },

    // Kardex
    kardex: {
        getAll() { return Store.get(Store.KEYS.KARDEX) || []; },
        getByProduct(productId) { return this.getAll().filter(k => k.productId === productId); },
        add(productId, type, quantity, reason) {
            const entries = this.getAll();
            const product = Store.products.getById(productId);
            entries.push({
                id: Date.now(),
                productId,
                productName: product?.name || 'Producto',
                type,
                quantity,
                reason,
                balance: product?.stock || 0,
                date: new Date().toISOString()
            });
            Store.set(Store.KEYS.KARDEX, entries);
        }
    },

    // Inventory Counts
    inventoryCounts: {
        getAll() { return Store.get(Store.KEYS.INVENTORY_COUNTS) || []; },
        add(count) {
            const counts = this.getAll();
            counts.push({ id: Date.now(), date: new Date().toISOString(), ...count });
            Store.set(Store.KEYS.INVENTORY_COUNTS, counts);
        }
    },

    // Kits
    kits: {
        getAll() { return Store.get(Store.KEYS.KITS) || []; },
        add(kit) {
            const kits = this.getAll();
            const newId = kits.length > 0 ? Math.max(...kits.map(k => k.id)) + 1 : 1;
            kits.push({ ...kit, id: newId });
            Store.set(Store.KEYS.KITS, kits);
            return { ...kit, id: newId };
        },
        delete(id) {
            const kits = this.getAll().filter(k => k.id !== id);
            Store.set(Store.KEYS.KITS, kits);
            return true;
        }
    },

    // Sales
    sales: {
        getAll() { return Store.get(Store.KEYS.SALES) || []; },
        add(sale) {
            const sales = this.getAll();
            const newSale = { id: Date.now(), date: new Date().toISOString(), ...sale };
            sales.push(newSale);
            Store.set(Store.KEYS.SALES, sales);
            Store.transactions.add({ type: 'income', category: 'Ventas', amount: sale.total, description: `Venta #${newSale.id}` });
            return newSale;
        },
        getByDateRange(startDate, endDate) {
            return this.getAll().filter(s => {
                const saleDate = new Date(s.date);
                return saleDate >= startDate && saleDate <= endDate;
            });
        },
        getTodaySales() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return this.getByDateRange(today, tomorrow);
        }
    },

    // Transactions
    transactions: {
        getAll() { return Store.get(Store.KEYS.TRANSACTIONS) || []; },
        add(transaction) {
            const transactions = this.getAll();
            transactions.push({ id: Date.now(), date: new Date().toISOString(), ...transaction });
            Store.set(Store.KEYS.TRANSACTIONS, transactions);
        },
        getByType(type) { return this.getAll().filter(t => t.type === type); },
        getByDateRange(start, end) {
            return this.getAll().filter(t => {
                const date = new Date(t.date);
                return date >= new Date(start) && date <= new Date(end);
            });
        }
    },

    // Expenses
    expenses: {
        getAll() { return Store.get(Store.KEYS.EXPENSES) || []; },
        add(expense) {
            const expenses = this.getAll();
            const newExpense = { id: Date.now(), date: new Date().toISOString(), ...expense };
            expenses.push(newExpense);
            Store.set(Store.KEYS.EXPENSES, expenses);
            Store.transactions.add({ type: 'expense', category: expense.category, amount: expense.amount, description: expense.description });
            return newExpense;
        }
    },

    // Payroll
    payroll: {
        getAll() { return Store.get(Store.KEYS.PAYROLL) || []; },
        getEmployees() { return this.getAll().filter(p => p.type === 'employee'); },
        getPayments() { return this.getAll().filter(p => p.type === 'payment'); },
        addEmployee(employee) {
            const payroll = this.getAll();
            const newId = payroll.length > 0 ? Math.max(...payroll.map(p => p.id)) + 1 : 1;
            payroll.push({ id: newId, type: 'employee', ...employee });
            Store.set(Store.KEYS.PAYROLL, payroll);
        },
        addPayment(payment) {
            const payroll = this.getAll();
            payroll.push({ id: Date.now(), type: 'payment', date: new Date().toISOString(), ...payment });
            Store.set(Store.KEYS.PAYROLL, payroll);
            Store.transactions.add({ type: 'expense', category: 'Nómina', amount: payment.amount, description: `Pago a ${payment.employeeName}` });
        }
    },

    // Budgets
    budgets: {
        getAll() { return Store.get(Store.KEYS.BUDGETS) || []; },
        add(budget) {
            const budgets = this.getAll();
            const newId = budgets.length > 0 ? Math.max(...budgets.map(b => b.id)) + 1 : 1;
            budgets.push({ id: newId, ...budget });
            Store.set(Store.KEYS.BUDGETS, budgets);
        },
        update(id, data) {
            const budgets = this.getAll();
            const index = budgets.findIndex(b => b.id === id);
            if (index !== -1) {
                budgets[index] = { ...budgets[index], ...data };
                Store.set(Store.KEYS.BUDGETS, budgets);
            }
        }
    },

    // Settings Proxy
    settings: {
        get() { return Store.get(Store.KEYS.SETTINGS) || {}; },
        update(data) {
            const settings = this.get();
            Store.set(Store.KEYS.SETTINGS, { ...settings, ...data });
        }
    },

    // Security Proxy
    security: {
        get() { 
            return Store.get(Store.KEYS.SECURITY) || Store.DEFAULTS.security;
        },
        update(data) {
            const security = this.get();
            Store.set(Store.KEYS.SECURITY, { ...security, ...data });
        },
        getLogs() { return Store.get(Store.KEYS.SECURITY_LOGS) || []; },
        addLog(event, type = 'general') {
            const logs = this.getLogs();
            logs.push({
                id: Date.now(),
                event,
                type,
                date: new Date().toISOString(),
                ip: '192.168.1.' + Math.floor(Math.random() * 255),
                device: Store.device.get() || 'desktop'
            });
            Store.set(Store.KEYS.SECURITY_LOGS, logs.slice(-500));
        },
        clearLogs() { Store.set(Store.KEYS.SECURITY_LOGS, []); },
        getBackups() { return Store.get(Store.KEYS.SECURITY_BACKUPS) || []; },
        addBackup(backup) {
            const backups = this.getBackups();
            backups.push(backup);
            Store.set(Store.KEYS.SECURITY_BACKUPS, backups.slice(-20));
        },
        deleteBackup(id) {
            const backups = this.getBackups().filter(b => b.id !== id);
            Store.set(Store.KEYS.SECURITY_BACKUPS, backups);
        },
        getSessions() { 
            return Store.get(Store.KEYS.SECURITY_SESSIONS) || [
                { id: '1', device: 'Chrome - Windows', ip: '192.168.1.100', lastActive: new Date().toISOString() }
            ]; 
        },
        removeSession(id) {
            const sessions = this.getSessions().filter(s => s.id !== id);
            Store.set(Store.KEYS.SECURITY_SESSIONS, sessions);
        },
        closeAllSessions() { Store.set(Store.KEYS.SECURITY_SESSIONS, []); }
    }
};

// Utility for deep merge check
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

Store.init();
