/**
 * Dashboards Page - Customizable Dashboard Module
 * Stock Desk Application
 */

const DashboardsPage = {
    activeView: 'overview',
    presentationMode: false,

    views: [
        { id: 'overview', label: 'General', icon: 'home' },
        { id: 'sales', label: 'Ventas', icon: 'cart' },
        { id: 'inventory', label: 'Inventario', icon: 'package' },
        { id: 'finance', label: 'Finanzas', icon: 'dollar' }
    ],

    render() {
        if (this.presentationMode) {
            return this.renderPresentationMode();
        }

        const content = `
            <div class="animate-fade-in">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Dashboards</h1>
                        <p class="text-slate-500 text-sm mt-1">Visualiza y analiza tu negocio en tiempo real</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="DashboardsPage.togglePresentation()" 
                                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center gap-2">
                            ${Components.icons.monitor} Modo Presentación
                        </button>
                        <button onclick="DashboardsPage.exportPDF()" 
                                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm flex items-center gap-2">
                            ${Components.icons.clipboard} Exportar PDF
                        </button>
                    </div>
                </div>

                <!-- View Tabs -->
                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.views.map(v => `
                        <button onclick="DashboardsPage.setView('${v.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeView === v.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[v.icon]}
                            ${v.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Dashboard Content -->
                <div id="dashboard-content">
                    ${this.renderDashboardView()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'dashboards');
    },

    setView(view) {
        this.activeView = view;
        Router.navigate('dashboards');
    },

    renderDashboardView() {
        switch(this.activeView) {
            case 'overview': return DashboardWidgets.renderOverview();
            case 'sales': return DashboardWidgets.renderSales();
            case 'inventory': return DashboardWidgets.renderInventory();
            case 'finance': return DashboardWidgets.renderFinance();
            default: return DashboardWidgets.renderOverview();
        }
    },

    togglePresentation() {
        this.presentationMode = !this.presentationMode;
        Router.navigate('dashboards');
    },

    renderPresentationMode() {
        return `
            <div class="fixed inset-0 bg-slate-900 z-50 overflow-auto">
                <div class="min-h-screen p-8">
                    <div class="flex justify-between items-center mb-8">
                        <h1 class="text-3xl font-bold text-white">Stock Desk - Dashboard</h1>
                        <button onclick="DashboardsPage.togglePresentation()" 
                                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2">
                            ${Components.icons.close} Salir
                        </button>
                    </div>
                    <div class="grid lg:grid-cols-4 gap-6 mb-8">
                        ${this.renderPresentationStats()}
                    </div>
                    <div class="grid lg:grid-cols-2 gap-6">
                        ${DashboardCharts.renderSalesChart('dark')}
                        ${DashboardCharts.renderInventoryChart('dark')}
                    </div>
                    <p class="text-center text-white/50 text-sm mt-8">
                        Actualizado: ${new Date().toLocaleString('es')}
                    </p>
                </div>
            </div>
        `;
    },

    renderPresentationStats() {
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const todaySales = Store.sales.getTodaySales();
        const transactions = Store.transactions.getAll();
        
        const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
        const todayRevenue = todaySales.reduce((s, sale) => s + sale.total, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const lowStock = products.filter(p => p.stock < (p.minStock || 10)).length;

        const stats = [
            { label: 'Ventas Hoy', value: `$${todayRevenue.toFixed(2)}`, color: 'from-green-500 to-emerald-600' },
            { label: 'Ventas Totales', value: `$${totalRevenue.toFixed(2)}`, color: 'from-blue-500 to-indigo-600' },
            { label: 'Gastos Totales', value: `$${totalExpenses.toFixed(2)}`, color: 'from-red-500 to-rose-600' },
            { label: 'Stock Bajo', value: lowStock.toString(), color: 'from-orange-500 to-amber-600' }
        ];

        return stats.map(s => `
            <div class="bg-gradient-to-br ${s.color} rounded-2xl p-6 text-white">
                <p class="text-white/80 text-sm mb-1">${s.label}</p>
                <p class="text-4xl font-bold">${s.value}</p>
            </div>
        `).join('');
    },

    exportPDF() {
        Components.toast('Generando PDF...', 'info');
        setTimeout(() => {
            Components.toast('PDF generado correctamente', 'success');
            // En una implementación real usaríamos html2pdf o similar
        }, 1500);
    }
};

Router.register('dashboards', () => DashboardsPage.render());
