/**
 * Customization Themes Module
 * Stock Desk Application
 */

const CustomizationThemes = {
    themes: [
        { id: 'orange', name: 'Naranja (Default)', primary: '#f97316', secondary: '#ea580c' },
        { id: 'blue', name: 'Azul Profesional', primary: '#3b82f6', secondary: '#2563eb' },
        { id: 'green', name: 'Verde Natural', primary: '#22c55e', secondary: '#16a34a' },
        { id: 'purple', name: 'Púrpura Elegante', primary: '#a855f7', secondary: '#9333ea' },
        { id: 'red', name: 'Rojo Intenso', primary: '#ef4444', secondary: '#dc2626' },
        { id: 'teal', name: 'Turquesa Moderno', primary: '#14b8a6', secondary: '#0d9488' }
    ],

    render() {
        const currentTheme = Store.get('stockdesk_theme') || 'orange';

        return `
            <div class="space-y-6">
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 class="font-semibold text-slate-900 mb-4">Tema de Colores</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        ${this.themes.map(theme => `
                            <button onclick="CustomizationThemes.setTheme('${theme.id}')" 
                                    class="p-4 rounded-xl border-2 transition ${currentTheme === theme.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}">
                                <div class="flex items-center gap-3 mb-3">
                                    <div class="w-8 h-8 rounded-full" style="background: ${theme.primary}"></div>
                                    <div class="w-6 h-6 rounded-full" style="background: ${theme.secondary}"></div>
                                </div>
                                <p class="font-medium text-slate-900 text-sm">${theme.name}</p>
                                ${currentTheme === theme.id ? '<p class="text-xs text-orange-600 mt-1">Activo</p>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 class="font-semibold text-slate-900 mb-4">Colores Personalizados</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Color Primario</label>
                            <div class="flex items-center gap-2">
                                <input type="color" id="custom-primary" value="#f97316" class="w-12 h-10 rounded border cursor-pointer">
                                <input type="text" value="#f97316" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">Color Secundario</label>
                            <div class="flex items-center gap-2">
                                <input type="color" id="custom-secondary" value="#ea580c" class="w-12 h-10 rounded border cursor-pointer">
                                <input type="text" value="#ea580c" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono">
                            </div>
                        </div>
                    </div>
                    <button onclick="CustomizationThemes.applyCustomColors()" class="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition">
                        Aplicar Colores
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 class="font-semibold text-slate-900 mb-4">Vista Previa</h3>
                    <div class="border border-slate-200 rounded-xl overflow-hidden">
                        <div class="bg-orange-500 p-4 flex items-center gap-3">
                            <div class="w-8 h-8 bg-white/20 rounded-lg"></div>
                            <span class="text-white font-semibold">Stock Desk</span>
                        </div>
                        <div class="p-4 bg-slate-50">
                            <div class="grid grid-cols-3 gap-3 mb-4">
                                <div class="bg-white p-3 rounded-lg shadow-sm">
                                    <p class="text-xs text-slate-500">Ventas</p>
                                    <p class="text-lg font-bold text-slate-900">$1,234</p>
                                </div>
                                <div class="bg-white p-3 rounded-lg shadow-sm">
                                    <p class="text-xs text-slate-500">Productos</p>
                                    <p class="text-lg font-bold text-slate-900">56</p>
                                </div>
                                <div class="bg-white p-3 rounded-lg shadow-sm">
                                    <p class="text-xs text-slate-500">Clientes</p>
                                    <p class="text-lg font-bold text-slate-900">89</p>
                                </div>
                            </div>
                            <button class="w-full py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">
                                Botón de Ejemplo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    setTheme(themeId) {
        Store.set('stockdesk_theme', themeId);
        this.applyTheme(themeId);
        Components.toast('Tema aplicado correctamente', 'success');
        
        // Refrescar para actualizar la UI (borde activo, texto 'Activo')
        Router.navigate('customization');
    },

    applyTheme(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        if (theme) {
            document.documentElement.style.setProperty('--color-primary', theme.primary);
            document.documentElement.style.setProperty('--color-secondary', theme.secondary);
        }
    },

    applyCustomColors() {
        const primary = document.getElementById('custom-primary').value;
        const secondary = document.getElementById('custom-secondary').value;
        
        // Guardar configuración personalizada
        Store.set('stockdesk_custom_colors', { primary, secondary });
        Store.set('stockdesk_theme', 'custom');
        
        // Aplicar variables
        document.documentElement.style.setProperty('--color-primary', primary);
        document.documentElement.style.setProperty('--color-secondary', secondary);
        
        Components.toast('Colores personalizados aplicados', 'success');
        Router.navigate('customization');
    }
};
