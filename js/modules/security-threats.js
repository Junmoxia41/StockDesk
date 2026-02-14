/**
 * Security Threat Management Module
 * Stock Desk Application
 */

const SecurityThreats = {
    render() {
        const config = Store.get('stockdesk_security_threats') || {
            bruteForceProtection: true,
            maxAttempts: 5,
            wafEnabled: false,
            sqlInjectionCheck: false,
            xssProtection: true
        };

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Brute Force -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Protección Fuerza Bruta</h4>
                                <p class="text-sm text-slate-500">Bloquear IPs tras intentos fallidos</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${config.bruteForceProtection ? 'checked' : ''} 
                                   onchange="SecurityThreats.toggle('bruteForceProtection', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    ${config.bruteForceProtection ? `
                        <div class="flex items-center gap-3">
                            <label class="text-sm text-slate-600">Intentos máximos:</label>
                            <input type="number" value="${config.maxAttempts}" min="3" max="20"
                                   onchange="SecurityThreats.update('maxAttempts', parseInt(this.value))" 
                                   class="w-20 px-3 py-2 rounded-lg border border-slate-200 text-center">
                        </div>
                    ` : ''}
                </div>

                <!-- Web Application Firewall (WAF) Simulation -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Firewall de Aplicación (WAF)</h4>
                                <p class="text-sm text-slate-500">Monitoreo de tráfico malicioso</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${config.wafEnabled ? 'checked' : ''} 
                                   onchange="SecurityThreats.toggle('wafEnabled', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span class="text-sm text-slate-700">Anti-SQL Injection</span>
                            <input type="checkbox" ${config.sqlInjectionCheck ? 'checked' : ''} 
                                   onchange="SecurityThreats.toggle('sqlInjectionCheck', this.checked)" class="accent-orange-500 w-4 h-4">
                        </div>
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span class="text-sm text-slate-700">Protección XSS</span>
                            <input type="checkbox" ${config.xssProtection ? 'checked' : ''} 
                                   onchange="SecurityThreats.toggle('xssProtection', this.checked)" class="accent-orange-500 w-4 h-4">
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getConfig() {
        return Store.get('stockdesk_security_threats') || {
            bruteForceProtection: true, maxAttempts: 5, wafEnabled: false, sqlInjectionCheck: false, xssProtection: true
        };
    },

    saveConfig(config) {
        Store.set('stockdesk_security_threats', config);
        Router.render('security');
    },

    toggle(key, value) {
        const config = this.getConfig();
        config[key] = value;
        this.saveConfig(config);
        Components.toast('Configuración de seguridad actualizada', 'success');
    },

    update(key, value) {
        const config = this.getConfig();
        config[key] = value;
        this.saveConfig(config);
    }
};
