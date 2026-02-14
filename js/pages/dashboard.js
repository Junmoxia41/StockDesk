/**
 * Dashboard Page
 * Stock Desk Application
 */

const DashboardPage = {
    render() {
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const todaySales = Store.sales.getTodaySales();
        const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
        const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
        const lowStock = products.filter(p => p.stock < 10).length;

        const content = `
            <div class="animate-fade-in">
                <div class="mb-6 md:mb-8">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p class="text-slate-500 mt-1 text-sm md:text-base">Bienvenido. Aquí está el resumen de tu negocio.</p>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    ${Components.statCard('Ventas Hoy', `$${todayRevenue.toFixed(2)}`, Components.icons.dollar, 'green')}
                    ${Components.statCard('Ventas Totales', `$${totalRevenue.toFixed(2)}`, Components.icons.chart, 'orange')}
                    ${Components.statCard('Productos', products.length.toString(), Components.icons.package, 'blue')}
                    ${Components.statCard('Stock Bajo', lowStock.toString(), Components.icons.warning, 'purple')}
                </div>

                <div class="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                        <h3 class="font-semibold text-slate-900 mb-4">Acciones Rápidas</h3>
                        <div class="grid grid-cols-3 gap-3 md:gap-4">
                            <button onclick="Router.navigate('sales')" class="p-3 md:p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center transition card-hover">
                                <div class="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                                    ${Components.icons.cart.replace('w-5 h-5', 'w-5 h-5 md:w-6 md:h-6 text-white')}
                                </div>
                                <span class="font-medium text-slate-700 text-xs md:text-sm">Nueva Venta</span>
                            </button>
                            <button onclick="Router.navigate('products')" class="p-3 md:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition card-hover">
                                <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                                    ${Components.icons.plus.replace('w-5 h-5', 'w-5 h-5 md:w-6 md:h-6 text-white')}
                                </div>
                                <span class="font-medium text-slate-700 text-xs md:text-sm">Agregar Producto</span>
                            </button>
                            <button onclick="Router.navigate('reports')" class="p-3 md:p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition card-hover">
                                <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                                    <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <span class="font-medium text-slate-700 text-xs md:text-sm">Ver Reportes</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                        <h3 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            ${Components.icons.warning.replace('w-5 h-5', 'w-5 h-5 text-orange-500')}
                            Stock Bajo
                        </h3>
                        <div class="space-y-2 max-h-40 overflow-y-auto">
                            ${products.filter(p => p.stock < 10).slice(0, 5).map(p => `
                                <div class="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg">
                                    <span class="text-xs md:text-sm text-slate-700 truncate">${p.name}</span>
                                    <span class="text-xs md:text-sm font-semibold text-red-600">${p.stock} uds</span>
                                </div>
                            `).join('') || '<p class="text-slate-500 text-sm text-center py-4">No hay productos con stock bajo</p>'}
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-slate-900">Ventas Recientes</h3>
                        <button onclick="Router.navigate('reports')" class="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Ver todas
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        ${sales.length > 0 ? `
                            <table class="w-full min-w-[400px]">
                                <thead>
                                    <tr class="text-left text-xs md:text-sm text-slate-500 border-b border-slate-100">
                                        <th class="pb-3 font-medium">ID</th>
                                        <th class="pb-3 font-medium">Fecha</th>
                                        <th class="pb-3 font-medium">Items</th>
                                        <th class="pb-3 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sales.slice(-5).reverse().map(s => `
                                        <tr class="border-b border-slate-50 table-row-hover">
                                            <td class="py-3 text-xs md:text-sm text-slate-600">#${s.id.toString().slice(-6)}</td>
                                            <td class="py-3 text-xs md:text-sm text-slate-600">${new Date(s.date).toLocaleString('es')}</td>
                                            <td class="py-3 text-xs md:text-sm text-slate-600">${s.items.length} productos</td>
                                            <td class="py-3 text-xs md:text-sm font-semibold text-slate-900 text-right">$${s.total.toFixed(2)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <div class="text-center py-8 text-slate-400">
                                ${Components.icons.cart.replace('w-5 h-5', 'w-12 h-12 mx-auto mb-3 opacity-50')}
                                <p>No hay ventas registradas aún</p>
                                <button onclick="Router.navigate('sales')" class="mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm">
                                    Realizar primera venta
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        return LayoutComponents.layout(content, 'dashboard');
    },

    afterRender() {
        // Verificar si es momento de pedir apoyo (solo si el módulo existe)
        if (typeof DonationsModule !== 'undefined') {
            setTimeout(() => DonationsModule.tryShowSupportModal(), 2000);
        }
    }
};

// Hook para ejecutar afterRender
const originalRender = DashboardPage.render;
DashboardPage.render = function() {
    const html = originalRender.call(this);
    setTimeout(() => this.afterRender(), 100);
    return html;
};

Router.register('dashboard', () => DashboardPage.render());
