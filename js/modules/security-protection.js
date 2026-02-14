/**
 * Security Data Protection Module
 * Stock Desk Application
 */

const SecurityProtection = {
    render() {
        const config = Store.get('stockdesk_security_protection') || {
            dataMasking: false,
            secureDeletion: false,
            encryptionLevel: 'standard'
        };

        return `
            <div class="space-y-6 animate-fade-in">
                <!-- Data Masking -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Enmascaramiento de Datos</h4>
                                <p class="text-sm text-slate-500">Ocultar datos sensibles (ej: ###-####)</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${config.dataMasking ? 'checked' : ''} 
                                   onchange="SecurityProtection.toggle('dataMasking', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>

                <!-- Secure Deletion -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                ${Components.icons.trash}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Borrado Seguro</h4>
                                <p class="text-sm text-slate-500">Sobrescribir datos eliminados (más lento pero seguro)</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${config.secureDeletion ? 'checked' : ''} 
                                   onchange="SecurityProtection.toggle('secureDeletion', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>

                <!-- Encryption Level -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <h4 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        ${Components.icons.lock} Nivel de Encriptación
                    </h4>
                    <div class="grid md:grid-cols-3 gap-4">
                        <button onclick="SecurityProtection.setLevel('standard')" 
                                class="p-4 border rounded-xl text-left ${config.encryptionLevel === 'standard' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}">
                            <p class="font-bold text-slate-900">Estándar</p>
                            <p class="text-xs text-slate-500 mt-1">AES-128. Rápido y seguro para uso general.</p>
                        </button>
                        <button onclick="SecurityProtection.setLevel('high')" 
                                class="p-4 border rounded-xl text-left ${config.encryptionLevel === 'high' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}">
                            <p class="font-bold text-slate-900">Alto</p>
                            <p class="text-xs text-slate-500 mt-1">AES-256. Recomendado para datos sensibles.</p>
                        </button>
                        <button onclick="SecurityProtection.setLevel('military')" 
                                class="p-4 border rounded-xl text-left ${config.encryptionLevel === 'military' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}">
                            <p class="font-bold text-slate-900">Militar</p>
                            <p class="text-xs text-slate-500 mt-1">Capas múltiples. Máxima seguridad, menor rendimiento.</p>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    getConfig() {
        return Store.get('stockdesk_security_protection') || { dataMasking: false, secureDeletion: false, encryptionLevel: 'standard' };
    },

    saveConfig(config) {
        Store.set('stockdesk_security_protection', config);
        Router.render('security');
    },

    toggle(key, value) {
        const config = this.getConfig();
        config[key] = value;
        this.saveConfig(config);
        Components.toast('Configuración de privacidad actualizada', 'success');
    },

    setLevel(level) {
        const config = this.getConfig();
        config.encryptionLevel = level;
        this.saveConfig(config);
        Components.toast('Nivel de encriptación actualizado', 'success');
    }
};
