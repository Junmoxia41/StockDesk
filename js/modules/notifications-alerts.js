/**
 * Notifications Alerts Module
 * Stock Desk Application
 * Fixed: Crash prevention and Default OFF
 */

const NotificationsAlerts = {
    render() {
        const defaults = {
            lowStock: { enabled: false, threshold: 10 },
            dailySummary: { enabled: false, time: '18:00' },
            newSale: { enabled: false, minAmount: 100 },
            pendingPayments: { enabled: false }
        };

        const savedConfig = Store.get('stockdesk_alert_config') || {};
        
        const alertConfig = {
            lowStock: { ...defaults.lowStock, ...(savedConfig.lowStock || {}) },
            dailySummary: { ...defaults.dailySummary, ...(savedConfig.dailySummary || {}) },
            newSale: { ...defaults.newSale, ...(savedConfig.newSale || {}) },
            pendingPayments: { ...defaults.pendingPayments, ...(savedConfig.pendingPayments || {}) }
        };

        return `
            <div class="space-y-4 animate-fade-in">
                <h3 class="font-semibold text-slate-900">Configuración de Alertas</h3>
                <p class="text-sm text-slate-500 mb-4">Activa solo las notificaciones que necesites.</p>

                <!-- STOCK BAJO -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                ${Components.icons.package}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Stock Bajo</h4>
                                <p class="text-sm text-slate-500">Avisar cuando queden pocos productos</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${alertConfig.lowStock.enabled ? 'checked' : ''} 
                                   onchange="NotificationsAlerts.toggleAlert('lowStock', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    ${alertConfig.lowStock.enabled ? `
                        <div class="flex items-center gap-3 animate-fade-in">
                            <label class="text-sm text-slate-600">Avisar con menos de:</label>
                            <input type="number" value="${alertConfig.lowStock.threshold}" min="1" 
                                   onchange="NotificationsAlerts.updateConfig('lowStock', 'threshold', parseInt(this.value))" 
                                   class="w-20 px-3 py-2 rounded-lg border border-slate-200 text-center focus:border-orange-500 outline-none">
                            <span class="text-sm text-slate-500">unidades</span>
                        </div>
                    ` : ''}
                </div>

                <!-- RESUMEN DIARIO -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                ${Components.icons.chart}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Resumen Diario</h4>
                                <p class="text-sm text-slate-500">Reporte de ventas al final del día</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${alertConfig.dailySummary.enabled ? 'checked' : ''} 
                                   onchange="NotificationsAlerts.toggleAlert('dailySummary', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    ${alertConfig.dailySummary.enabled ? `
                        <div class="flex items-center gap-3 animate-fade-in">
                            <label class="text-sm text-slate-600">Hora del reporte:</label>
                            <input type="time" value="${alertConfig.dailySummary.time}" 
                                   onchange="NotificationsAlerts.updateConfig('dailySummary', 'time', this.value)" 
                                   class="px-3 py-2 rounded-lg border border-slate-200 focus:border-orange-500 outline-none">
                        </div>
                    ` : ''}
                </div>

                <!-- VENTA GRANDE -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                ${Components.icons.cart}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Venta Grande</h4>
                                <p class="text-sm text-slate-500">Notificar ventas superiores a un monto</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${alertConfig.newSale.enabled ? 'checked' : ''} 
                                   onchange="NotificationsAlerts.toggleAlert('newSale', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    ${alertConfig.newSale.enabled ? `
                        <div class="flex items-center gap-3 animate-fade-in">
                            <label class="text-sm text-slate-600">Monto mínimo:</label>
                            <span class="text-slate-400 font-bold">$</span>
                            <input type="number" value="${alertConfig.newSale.minAmount}" min="1" 
                                   onchange="NotificationsAlerts.updateConfig('newSale', 'minAmount', parseFloat(this.value))" 
                                   class="w-24 px-3 py-2 rounded-lg border border-slate-200 text-center focus:border-orange-500 outline-none">
                        </div>
                    ` : ''}
                </div>

                <!-- PAGOS PENDIENTES -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                ${Components.icons.warning}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Pagos Pendientes</h4>
                                <p class="text-sm text-slate-500">Alertar facturas o pagos vencidos</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${alertConfig.pendingPayments.enabled ? 'checked' : ''} 
                                   onchange="NotificationsAlerts.toggleAlert('pendingPayments', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        `;
    },

    getSafeConfig() {
        const defaults = {
            lowStock: { enabled: false, threshold: 10 },
            dailySummary: { enabled: false, time: '18:00' },
            newSale: { enabled: false, minAmount: 100 },
            pendingPayments: { enabled: false }
        };
        const saved = Store.get('stockdesk_alert_config') || {};
        return {
            lowStock: { ...defaults.lowStock, ...(saved.lowStock || {}) },
            dailySummary: { ...defaults.dailySummary, ...(saved.dailySummary || {}) },
            newSale: { ...defaults.newSale, ...(saved.newSale || {}) },
            pendingPayments: { ...defaults.pendingPayments, ...(saved.pendingPayments || {}) }
        };
    },

    toggleAlert(alertType, isEnabled) {
        const config = this.getSafeConfig();
        if (config[alertType]) {
            config[alertType].enabled = isEnabled;
            Store.set('stockdesk_alert_config', config);
            Components.toast(`Alerta ${isEnabled ? 'activada' : 'desactivada'}`, 'success');
            
            // Forzar re-render de la vista actual para mostrar/ocultar campos
            Router.render('notifications'); 
        }
    },

    updateConfig(alertType, field, value) {
        const config = this.getSafeConfig();
        if (config[alertType]) {
            config[alertType][field] = value;
            Store.set('stockdesk_alert_config', config);
        }
    }
};
