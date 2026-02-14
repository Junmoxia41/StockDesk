/**
 * Suppliers Page - Supplier Management Module
 * Stock Desk Application
 */

const SuppliersPage = {
    activeTab: 'directory',

    tabs: [
        { id: 'directory', label: 'Directorio', icon: 'users' },
        { id: 'orders', label: 'Órdenes de Compra', icon: 'clipboard' },
        { id: 'payables', label: 'Cuentas por Pagar', icon: 'dollar' }
    ],

    render() {
        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Proveedores</h1>
                    <p class="text-slate-500 text-sm mt-1">Gestiona proveedores y órdenes de compra</p>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.tabs.map(tab => `
                        <button onclick="SuppliersPage.setTab('${tab.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeTab === tab.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[tab.icon] || Components.icons.users}
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <div id="suppliers-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'suppliers');
    },

    setTab(tab) {
        this.activeTab = tab;
        Router.navigate('suppliers');
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'directory': return SuppliersDirectory.render();
            case 'orders': return SuppliersOrders.render();
            case 'payables': return this.renderPayables();
            default: return SuppliersDirectory.render();
        }
    },

    renderPayables() {
        const orders = Store.get('stockdesk_purchase_orders') || [];
        const pending = orders.filter(o => o.paymentStatus !== 'paid');
        const total = pending.reduce((s, o) => s + o.total, 0);

        return `
            <div class="space-y-4">
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <p class="text-sm text-slate-500 mb-1">Total por Pagar</p>
                        <p class="text-2xl font-bold text-red-600">$${total.toFixed(2)}</p>
                    </div>
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <p class="text-sm text-slate-500 mb-1">Facturas Pendientes</p>
                        <p class="text-2xl font-bold text-slate-900">${pending.length}</p>
                    </div>
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <p class="text-sm text-slate-500 mb-1">Vencidas</p>
                        <p class="text-2xl font-bold text-orange-600">${pending.filter(o => new Date(o.dueDate) < new Date()).length}</p>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900">Pagos Pendientes</h3>
                    </div>
                    ${pending.length > 0 ? `
                        <div class="divide-y divide-slate-100">
                            ${pending.map(o => `
                                <div class="px-5 py-4 flex items-center justify-between hover:bg-slate-50">
                                    <div>
                                        <p class="font-medium text-slate-900">${o.supplierName}</p>
                                        <p class="text-sm text-slate-500">Orden #${o.id} - Vence: ${new Date(o.dueDate).toLocaleDateString('es')}</p>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <span class="font-bold text-slate-900">$${o.total.toFixed(2)}</span>
                                        <button onclick="SuppliersPage.markPaid(${o.id})" class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-600 text-sm rounded-lg">
                                            Marcar Pagado
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="p-8 text-center text-slate-400">No hay pagos pendientes</div>'}
                </div>
            </div>
        `;
    },

    markPaid(orderId) {
        const orders = Store.get('stockdesk_purchase_orders') || [];
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            orders[idx].paymentStatus = 'paid';
            orders[idx].paidDate = new Date().toISOString();
            Store.set('stockdesk_purchase_orders', orders);
            Components.toast('Pago registrado', 'success');
            Router.navigate('suppliers');
        }
    }
};

Router.register('suppliers', () => SuppliersPage.render());
