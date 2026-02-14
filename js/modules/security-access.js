/**
 * Security Access Control Module
 * Stock Desk Application
 */

const SecurityAccess = {
    render() {
        const config = Store.get('stockdesk_security_access') || {
            ipWhitelistEnabled: false,
            ips: [],
            scheduleEnabled: false,
            workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            startTime: '08:00',
            endTime: '18:00',
            geoBlockEnabled: false,
            allowedCountries: ['CU', 'ES', 'US']
        };

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- IP Whitelist -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                ${Components.icons.monitor}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Restricción por IP</h4>
                                <p class="text-sm text-slate-500">Solo permitir acceso desde IPs confiables</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${config.ipWhitelistEnabled ? 'checked' : ''} 
                                   onchange="SecurityAccess.toggle('ipWhitelistEnabled', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    ${config.ipWhitelistEnabled ? `
                        <div class="space-y-3">
                            <div class="flex gap-2">
                                <input type="text" id="new-ip" placeholder="Ej: 192.168.1.50" class="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm">
                                <button onclick="SecurityAccess.addIP()" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Añadir</button>
                            </div>
                            <div class="space-y-2">
                                ${config.ips.map((ip, i) => `
                                    <div class="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100 text-sm">
                                        <span class="font-mono text-slate-600">${ip}</span>
                                        <button onclick="SecurityAccess.removeIP(${i})" class="text-red-500 hover:text-red-700">Eliminar</button>
                                    </div>
                                `).join('') || '<p class="text-xs text-slate-400">Ninguna IP configurada</p>'}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Schedule Access -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                ${Components.icons.clock}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Horario Laboral</h4>
                                <p class="text-sm text-slate-500">Restringir acceso fuera de horas de trabajo</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${config.scheduleEnabled ? 'checked' : ''} 
                                   onchange="SecurityAccess.toggle('scheduleEnabled', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    ${config.scheduleEnabled ? `
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs text-slate-500 mb-1">Hora Inicio</label>
                                <input type="time" value="${config.startTime}" onchange="SecurityAccess.update('startTime', this.value)" 
                                       class="w-full px-3 py-2 rounded-lg border border-slate-200">
                            </div>
                            <div>
                                <label class="block text-xs text-slate-500 mb-1">Hora Fin</label>
                                <input type="time" value="${config.endTime}" onchange="SecurityAccess.update('endTime', this.value)"
                                       class="w-full px-3 py-2 rounded-lg border border-slate-200">
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Geo Block -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Geobloqueo</h4>
                                <p class="text-sm text-slate-500">Bloquear acceso desde países no autorizados</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${config.geoBlockEnabled ? 'checked' : ''} 
                                   onchange="SecurityAccess.toggle('geoBlockEnabled', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        `;
    },

    getConfig() {
        return Store.get('stockdesk_security_access') || {
            ipWhitelistEnabled: false, ips: [], scheduleEnabled: false, startTime: '08:00', endTime: '18:00', geoBlockEnabled: false
        };
    },

    saveConfig(config) {
        Store.set('stockdesk_security_access', config);
        Router.render('security'); // Re-render to show/hide fields
    },

    toggle(key, value) {
        const config = this.getConfig();
        config[key] = value;
        this.saveConfig(config);
        Components.toast('Configuración actualizada', 'success');
    },

    update(key, value) {
        const config = this.getConfig();
        config[key] = value;
        this.saveConfig(config);
    },

    addIP() {
        const ip = document.getElementById('new-ip').value;
        if (!ip) return;
        const config = this.getConfig();
        config.ips.push(ip);
        this.saveConfig(config);
        Components.toast('IP añadida', 'success');
    },

    removeIP(index) {
        const config = this.getConfig();
        config.ips.splice(index, 1);
        this.saveConfig(config);
        Components.toast('IP eliminada', 'success');
    },

    // --- LÓGICA DE SEGURIDAD REAL (CORE) ---

    checkAccess() {
        const config = this.getConfig();
        const user = Store.get(Store.KEYS.USER);
        
        // Si no hay configuración, pasa.
        if (!config) return { allowed: true };

        // 1. Verificación de Horario
        if (config.scheduleEnabled && !this.isTimeAllowed(config.startTime, config.endTime)) {
            return { 
                allowed: false, 
                reason: 'Fuera de horario laboral. Acceso restringido.',
                type: 'schedule'
            };
        }

        // 2. Verificación de IP (Simulada para localStorage)
        if (config.ipWhitelistEnabled && config.ips.length > 0) {
            const currentIP = this.getCurrentIP();
            if (!config.ips.includes(currentIP)) {
                return { 
                    allowed: false, 
                    reason: `IP no autorizada (${currentIP}).`,
                    type: 'ip'
                };
            }
        }

        // 3. Geobloqueo (Simulado) - Se podría implementar con una API real si hubiera internet
        if (config.geoBlockEnabled) {
            // Simulamos acceso permitido por ahora
        }

        return { allowed: true };
    },

    isTimeAllowed(start, end) {
        if (!start || !end) return true;
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        return currentTime >= startTime && currentTime <= endTime;
    },

    getCurrentIP() {
        // En una app real, esto vendría del servidor. 
        // Aquí simulamos una IP fija o la recuperamos de la sesión simulada.
        // Si el usuario añade "192.168.1.100" a la lista blanca, funcionará.
        return '192.168.1.100'; 
    }
};