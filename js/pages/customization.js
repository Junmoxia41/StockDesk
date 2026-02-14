/**
 * Customization Page - Personalization Module
 * Stock Desk Application
 */

const CustomizationPage = {
    activeTab: 'themes',

    tabs: [
        { id: 'themes', label: 'Temas', icon: 'star' },
        { id: 'logo', label: 'Logo', icon: 'package' },
        { id: 'tickets', label: 'Tickets', icon: 'receipt' },
        { id: 'fields', label: 'Campos', icon: 'edit' },
        { id: 'categories', label: 'Categorías', icon: 'box' },
        { id: 'shortcuts', label: 'Atajos', icon: 'settings' }
    ],

    render() {
        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Personalización</h1>
                    <p class="text-slate-500 text-sm mt-1">Personaliza la apariencia de tu aplicación</p>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.tabs.map(tab => `
                        <button onclick="CustomizationPage.setTab('${tab.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeTab === tab.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[tab.icon] || Components.icons.settings}
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <div id="customization-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'customization');
    },

    setTab(tab) {
        this.activeTab = tab;
        Router.navigate('customization');
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'themes': return CustomizationThemes.render();
            case 'logo': return this.renderLogo();
            case 'tickets': return CustomizationTickets.render();
            case 'fields': return this.renderFields();
            case 'categories': return this.renderCategories();
            case 'shortcuts': return this.renderShortcuts();
            default: return CustomizationThemes.render();
        }
    },

    renderLogo() {
        const settings = Store.settings.get();
        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 class="font-semibold text-slate-900 mb-4">Logo de la Empresa</h3>
                <div class="flex flex-col items-center gap-4">
                    <div class="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                        ${settings.logo ? `<img src="${settings.logo}" class="w-full h-full object-contain rounded-xl">` : 
                          Components.icons.package.replace('w-5 h-5', 'w-12 h-12 text-slate-400')}
                    </div>
                    <input type="file" id="logo-input" accept="image/*" class="hidden" onchange="CustomizationPage.uploadLogo(this)">
                    <button onclick="document.getElementById('logo-input').click()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition">
                        Subir Logo
                    </button>
                    ${settings.logo ? `<button onclick="CustomizationPage.removeLogo()" class="text-red-500 text-sm">Eliminar</button>` : ''}
                </div>
            </div>
        `;
    },

    renderFields() {
        const fields = Store.get('stockdesk_custom_fields') || [];
        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Campos Personalizados</h3>
                    <button onclick="CustomizationPage.addField()" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
                        ${Components.icons.plus} Nuevo Campo
                    </button>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-slate-100">
                    ${fields.length > 0 ? fields.map(f => `
                        <div class="p-4 flex items-center justify-between border-b border-slate-100 last:border-0">
                            <div>
                                <p class="font-medium text-slate-900">${f.name}</p>
                                <p class="text-sm text-slate-500">Tipo: ${f.type} | Entidad: ${f.entity}</p>
                            </div>
                            <button onclick="CustomizationPage.deleteField('${f.id}')" class="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                ${Components.icons.trash}
                            </button>
                        </div>
                    `).join('') : '<div class="p-8 text-center text-slate-400">No hay campos personalizados</div>'}
                </div>
            </div>
        `;
    },

    renderCategories() {
        const categories = Store.get('stockdesk_categories') || ['General', 'Bebidas', 'Alimentos', 'Limpieza'];
        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Categorías de Productos</h3>
                    <button onclick="CustomizationPage.addCategory()" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
                        ${Components.icons.plus} Nueva Categoría
                    </button>
                </div>
                <div class="grid md:grid-cols-3 gap-3">
                    ${categories.map(cat => `
                        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                            <span class="font-medium text-slate-900">${cat}</span>
                            <button onclick="CustomizationPage.deleteCategory('${cat}')" class="text-red-500 hover:bg-red-50 p-1 rounded">
                                ${Components.icons.close.replace('w-6 h-6', 'w-4 h-4')}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderShortcuts() {
        const shortcuts = [
            { key: 'F1', action: 'Nueva Venta' },
            { key: 'F2', action: 'Nuevo Producto' },
            { key: 'F3', action: 'Buscar Producto' },
            { key: 'F4', action: 'Abrir Caja' },
            { key: 'Ctrl+P', action: 'Imprimir Ticket' },
            { key: 'Esc', action: 'Cerrar Modal' }
        ];
        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100">
                    <h3 class="font-semibold text-slate-900">Atajos de Teclado</h3>
                </div>
                <div class="divide-y divide-slate-100">
                    ${shortcuts.map(s => `
                        <div class="px-5 py-3 flex items-center justify-between">
                            <span class="text-slate-700">${s.action}</span>
                            <kbd class="px-3 py-1 bg-slate-100 rounded text-sm font-mono font-bold">${s.key}</kbd>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    uploadLogo(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                Store.settings.update({ logo: e.target.result });
                Components.toast('Logo actualizado', 'success');
                Router.navigate('customization');
            };
            reader.readAsDataURL(file);
        }
    },

    removeLogo() {
        Store.settings.update({ logo: null });
        Components.toast('Logo eliminado', 'success');
        Router.navigate('customization');
    },

    addField() {
        Components.modal({
            title: 'Nuevo Campo',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="field-name" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                        <select id="field-type" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="text">Texto</option>
                            <option value="number">Número</option>
                            <option value="date">Fecha</option>
                            <option value="select">Lista</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Aplicar a</label>
                        <select id="field-entity" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="products">Productos</option>
                            <option value="sales">Ventas</option>
                            <option value="customers">Clientes</option>
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Crear',
            onConfirm: () => {
                const fields = Store.get('stockdesk_custom_fields') || [];
                fields.push({
                    id: Date.now().toString(),
                    name: document.getElementById('field-name').value,
                    type: document.getElementById('field-type').value,
                    entity: document.getElementById('field-entity').value
                });
                Store.set('stockdesk_custom_fields', fields);
                Components.toast('Campo creado', 'success');
                Router.navigate('customization');
            }
        });
    },

    deleteField(id) {
        const fields = (Store.get('stockdesk_custom_fields') || []).filter(f => f.id !== id);
        Store.set('stockdesk_custom_fields', fields);
        Components.toast('Campo eliminado', 'success');
        Router.navigate('customization');
    },

    addCategory() {
        Components.modal({
            title: 'Nueva Categoría',
            content: `<input type="text" id="cat-name" placeholder="Nombre" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">`,
            confirmText: 'Crear',
            onConfirm: () => {
                const categories = Store.get('stockdesk_categories') || [];
                const name = document.getElementById('cat-name').value.trim();
                if (name && !categories.includes(name)) {
                    categories.push(name);
                    Store.set('stockdesk_categories', categories);
                    Components.toast('Categoría creada', 'success');
                }
                Router.navigate('customization');
            }
        });
    },

    deleteCategory(name) {
        const categories = (Store.get('stockdesk_categories') || []).filter(c => c !== name);
        Store.set('stockdesk_categories', categories);
        Components.toast('Categoría eliminada', 'success');
        Router.navigate('customization');
    }
};

Router.register('customization', () => CustomizationPage.render());
