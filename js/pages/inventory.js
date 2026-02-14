/**
 * Inventory Advanced Page - Main View
 * Stock Desk Application
 */

const InventoryPage = {
    activeTab: 'warehouses',

    tabs: [
        { id: 'warehouses', label: 'Almacenes', icon: 'warehouse' },
        { id: 'transfers', label: 'Transferencias', icon: 'transfer' },
        { id: 'kardex', label: 'Kardex', icon: 'clipboard' },
        { id: 'counts', label: 'Conteo Físico', icon: 'box' },
        { id: 'kits', label: 'Kits', icon: 'package' }
    ],

    render() {
        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Inventario Avanzado</h1>
                    <p class="text-slate-500 text-sm mt-1">Gestión completa de almacenes, transferencias y trazabilidad</p>
                </div>

                <!-- Tabs -->
                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.tabs.map(tab => `
                        <button onclick="InventoryPage.setTab('${tab.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeTab === tab.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[tab.icon] || Components.icons.package}
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Tab Content -->
                <div id="inventory-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'inventory');
    },

    setTab(tab) {
        this.activeTab = tab;
        Router.navigate('inventory');
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'warehouses': return InventoryWarehouses.render();
            case 'transfers': return InventoryTransfers.render();
            case 'kardex': return InventoryKardex.render();
            case 'counts': return InventoryCounts.render();
            case 'kits': return InventoryKits.render();
            default: return InventoryWarehouses.render();
        }
    }
};

Router.register('inventory', () => InventoryPage.render());
