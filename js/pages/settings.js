/**
 * Settings Page
 * Stock Desk Application
 */

const SettingsPage = {
    currencies: [
        { code: 'USD', name: 'Dólar Estadounidense ($)' },
        { code: 'EUR', name: 'Euro (€)' },
        { code: 'CUP', name: 'Peso Cubano (CUP)' },
        { code: 'MLC', name: 'Moneda Libremente Convertible (MLC)' },
        { code: 'MXN', name: 'Peso Mexicano ($)' },
        { code: 'COP', name: 'Peso Colombiano ($)' },
        { code: 'ARS', name: 'Peso Argentino ($)' },
        { code: 'CLP', name: 'Peso Chileno ($)' },
        { code: 'PEN', name: 'Peso Chileno ($)' },
        { code: 'VES', name: 'Bolívar Venezolano (Bs)' },
        { code: 'BRL', name: 'Real Brasileño (R$)' },
        { code: 'CAD', name: 'Dólar Canadiense ($)' },
        { code: 'GBP', name: 'Libra Esterlina (£)' },
        { code: 'JPY', name: 'Yen Japonés (¥)' },
        { code: 'CNY', name: 'Yuan Chino (¥)' },
        { code: 'RUB', name: 'Rublo Ruso (₽)' },
        { code: 'INR', name: 'Rupia India (₹)' },
        { code: 'AUD', name: 'Dólar Australiano ($)' },
        { code: 'CHF', name: 'Franco Suizo (Fr)' },
        { code: 'DOP', name: 'Peso Colombiano ($)' },
        { code: 'GTQ', name: 'Quetzal Guatemalteco (Q)' },
        { code: 'HNL', name: 'Quetzal Hondureño (L)' },
        { code: 'NIO', name: 'Lempira Hondureño (L)' },
        { code: 'CRC', name: 'Colón Costarricense (₡)' },
        { code: 'PAB', name: 'Balboa Panameño (B/.)' },
        { code: 'PYG', name: 'Guaraní Paraguayo (₲)' },
        { code: 'UYU', name: 'Peso Uruguayo ($)' },
        { code: 'BOB', name: 'Boliviano (Bs.)' }
    ],

    render() {
        const settings = Store.settings.get();
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const device = Store.device.get();
        const aiApiKey = Store.get('stockdesk_ai_apikey') || '';

        const content = `
            <div class="animate-fade-in max-w-3xl mx-auto">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Configuración</h1>
                    <p class="text-slate-500 text-sm">Personaliza tu aplicación</p>
                </div>

                <!-- Info Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-4 md:mb-6 text-center">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                        ${Components.icons.package.replace('w-5 h-5', 'w-8 h-8 md:w-10 md:h-10 text-white')}
                    </div>
                    <h2 class="text-xl md:text-2xl font-bold gradient-text mb-2">Stock Desk</h2>
                    <p class="text-slate-500 mb-4 text-sm">Versión 2026.4.0</p>
                    <div class="flex justify-center gap-3 flex-wrap">
                        <span class="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                            ${products.length} productos
                        </span>
                        <span class="px-3 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                            ${sales.length} ventas
                        </span>
                    </div>
                </div>

                <!-- General Settings -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4 md:mb-6">
                    <div class="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900">Configuración General</h3>
                    </div>
                    <div class="p-4 md:p-6 space-y-4 md:space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Nombre del Negocio</label>
                            <input type="text" id="business-name" value="${settings.businessName || ''}" 
                                   onchange="SettingsPage.updateSetting('businessName', this.value)"
                                   class="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-orange-500 transition">
                        </div>
                        
                        <!-- Currency Selector with Search -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Moneda Principal</label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    ${Components.icons.search}
                                </span>
                                <input type="text" id="currency-search" placeholder="Buscar moneda (ej: Cuba, Euro)..." 
                                       onkeyup="SettingsPage.filterCurrencies(this.value)"
                                       class="w-full pl-12 pr-4 py-2.5 rounded-t-xl border border-slate-200 border-b-0 focus:border-orange-500 focus:ring-0">
                                <select id="currency" onchange="SettingsPage.updateSetting('currency', this.value)" size="5"
                                        class="w-full px-4 py-2 rounded-b-xl border border-slate-200 focus:border-orange-500 transition bg-slate-50">
                                    ${this.renderCurrencyOptions(settings.currency)}
                                </select>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">Selecciona la moneda para tus reportes y ventas.</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Dispositivo</label>
                            <select id="device" onchange="SettingsPage.changeDevice(this.value)"
                                    class="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-orange-500 transition">
                                <option value="desktop" ${device === 'desktop' ? 'selected' : ''}>Escritorio</option>
                                <option value="tablet" ${device === 'tablet' ? 'selected' : ''}>Tablet</option>
                                <option value="mobile" ${device === 'mobile' ? 'selected' : ''}>Móvil</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- AI Section -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4 md:mb-6">
                    <div class="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900 flex items-center gap-2">
                            ${Components.icons.brain} Asistente IA (GLM)
                        </h3>
                    </div>
                    <div class="p-4 md:p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">API Key de GLM (ZhipuAI)</label>
                            <input type="password" id="ai-api-key" value="${aiApiKey}" 
                                   placeholder="Ingresa tu API Key para habilitar IA avanzada"
                                   class="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-orange-500 transition">
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <button onclick="SettingsPage.saveAIKey()" 
                                    class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press text-sm">
                                Guardar API Key
                            </button>
                            <a href="https://open.bigmodel.cn" target="_blank" 
                               class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition text-sm text-center">
                                Obtener API Key
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Data Management -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                    <div class="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900">Gestión de Datos</h3>
                    </div>
                    <div class="p-4 md:p-6 space-y-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Retención de Historial</label>
                                <p class="text-xs text-slate-500">Borrar logs automáticamente después de:</p>
                            </div>
                            <select id="log-retention" onchange="SettingsPage.updateRetention(this.value)"
                                    class="w-full sm:w-40 px-3 py-2 rounded-xl border border-slate-200 text-sm">
                                <option value="1" ${settings.logRetention === 1 ? 'selected' : ''}>1 día</option>
                                <option value="7" ${settings.logRetention === 7 ? 'selected' : ''}>1 semana</option>
                                <option value="30" ${settings.logRetention === 30 || !settings.logRetention ? 'selected' : ''}>1 mes</option>
                                <option value="90" ${settings.logRetention === 90 ? 'selected' : ''}>3 meses</option>
                                <option value="365" ${settings.logRetention === 365 ? 'selected' : ''}>1 año</option>
                            </select>
                        </div>
                        <hr class="border-slate-100">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-slate-50 rounded-xl">
                            <div>
                                <h4 class="font-medium text-slate-900 text-sm md:text-base">Exportar Datos</h4>
                                <p class="text-xs md:text-sm text-slate-500">Descarga todos tus datos en JSON</p>
                            </div>
                            <button onclick="SettingsPage.exportData()" 
                                    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition btn-press text-sm">
                                Exportar
                            </button>
                        </div>
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-red-50 rounded-xl">
                            <div>
                                <h4 class="font-medium text-slate-900 text-sm md:text-base">Reiniciar Aplicación</h4>
                                <p class="text-xs md:text-sm text-slate-500">Elimina todos los datos y resetea</p>
                            </div>
                            <button onclick="SettingsPage.resetApp()" 
                                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition btn-press text-sm">
                                Reiniciar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Donation Section -->
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 mb-6 text-white relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div class="relative z-10">
                        <h3 class="font-bold text-xl mb-3 flex items-center gap-2">
                            <span class="text-orange-400">🚀</span> El Futuro de Stock Desk
                        </h3>
                        <div class="space-y-3 text-slate-300 text-sm leading-relaxed mb-6">
                            <p>
                                Stock Desk es un proyecto independiente desarrollado en Cuba 🇨🇺. Mi objetivo es mantener esta herramienta accesible para todos los emprendedores.
                            </p>
                            <p>
                                <strong class="text-white">Transparencia Total:</strong> Actualmente, la app funciona 100% en tu dispositivo. Sin embargo, sostener el desarrollo requiere tiempo y recursos.
                            </p>
                        </div>
                        
                        <button onclick="DonationsModule.openModal()" 
                                class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition transform hover:scale-[1.02] flex items-center justify-center gap-2">
                            Apoyar el Proyecto
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6 text-center">
                    <h3 class="font-semibold text-slate-900 mb-3 md:mb-4">Créditos</h3>
                    <p class="text-slate-600 mb-2 text-sm md:text-base">Desarrollado para emprendedores</p>
                    <p class="text-xs md:text-sm text-slate-400">© 2026 Stock Desk. Todos los derechos reservados.</p>
                </div>
            </div>
        `;

        return LayoutComponents.layout(content, 'settings');
    },

    renderCurrencyOptions(selectedCurrency) {
        // Sort: Selected first, then others
        const sorted = [...this.currencies].sort((a, b) => {
            if (a.code === selectedCurrency) return -1;
            if (b.code === selectedCurrency) return 1;
            return a.name.localeCompare(b.name);
        });

        return sorted.map(c => `
            <option value="${c.code}" ${c.code === selectedCurrency ? 'selected' : ''}>
                ${c.name}
            </option>
        `).join('');
    },

    filterCurrencies(query) {
        const q = query.toLowerCase();
        const select = document.getElementById('currency');
        if (!select) return;

        select.innerHTML = this.currencies
            .filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
            .map(c => `<option value="${c.code}">${c.name}</option>`)
            .join('');
    },

    updateSetting(key, value) {
        const settings = Store.settings.get();
        settings[key] = value;
        Store.set(Store.KEYS.SETTINGS, settings);
        
        // If currency changed, re-render to update UI elsewhere or just toast
        if (key === 'currency') {
            Components.toast(`Moneda cambiada a ${value}`, 'success');
        } else {
            Components.toast('Configuración guardada', 'success');
        }
    },

    updateRetention(days) {
        const settings = Store.settings.get();
        settings.logRetention = parseInt(days);
        Store.set(Store.KEYS.SETTINGS, settings);
        Store.cleanupLogs();
        Components.toast(`Historial ajustado a ${days} días`, 'success');
    },

    changeDevice(device) {
        Store.device.set(device);
        Components.toast(`Modo ${device} activado`, 'success');
        setTimeout(() => Router.navigate('settings'), 300);
    },

    saveAIKey() {
        const key = document.getElementById('ai-api-key')?.value || '';
        if (typeof AIAssistant !== 'undefined') {
            AIAssistant.setApiKey(key);
        } else {
            Store.set('stockdesk_ai_apikey', key);
        }
        Components.toast(key ? 'API Key guardada' : 'API Key eliminada', 'success');
    },

    exportData() {
        const data = {
            products: Store.products.getAll(),
            sales: Store.sales.getAll(),
            settings: Store.settings.get(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stockdesk-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Components.toast('Datos exportados', 'success');
    },

    resetApp() {
        Components.modal({
            title: 'Reiniciar Aplicación',
            content: '<p>Esta acción eliminará <strong>TODOS</strong> los datos. ¿Estás seguro?</p>',
            confirmText: 'Sí, reiniciar',
            type: 'danger',
            onConfirm: () => {
                localStorage.clear();
                Store.init();
                Components.toast('Aplicación reiniciada', 'success');
                window.location.reload();
            }
        });
    }
};

Router.register('settings', () => SettingsPage.render());
