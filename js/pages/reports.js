/**
 * Reports Page
 * Stock Desk Application
 */

const ReportsPage = {
    dateFrom: null,
    dateTo: null,

    init() {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        this.dateFrom = weekAgo.toISOString().split('T')[0];
        this.dateTo = today.toISOString().split('T')[0];
    },

    render() {
        if (!this.dateFrom) this.init();

        const filteredSales = this.getFilteredSales();
        const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
        const topProduct = this.getTopProduct(filteredSales);
        const dailySales = this.getDailySales(filteredSales);
        const maxDaily = Math.max(...Object.values(dailySales), 1);

        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Reportes</h1>
                    <p class="text-slate-500 text-sm">Analiza el rendimiento de tu negocio</p>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4 md:mb-6">
                    <div class="flex flex-wrap items-center gap-3 md:gap-4">
                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-slate-600">Desde:</label>
                            <input type="date" id="date-from" value="${this.dateFrom}" 
                                   onchange="ReportsPage.updateDateFrom(this.value)"
                                   class="px-3 py-2 rounded-lg border border-slate-200 focus:border-orange-500 transition text-sm">
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="text-sm font-medium text-slate-600">Hasta:</label>
                            <input type="date" id="date-to" value="${this.dateTo}"
                                   onchange="ReportsPage.updateDateTo(this.value)"
                                   class="px-3 py-2 rounded-lg border border-slate-200 focus:border-orange-500 transition text-sm">
                        </div>
                        <button onclick="ReportsPage.resetDates()" class="px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition">
                            Última semana
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6">
                    ${Components.statCard('Ventas del Periodo', `$${totalRevenue.toFixed(2)}`, Components.icons.dollar, 'green')}
                    ${Components.statCard('Transacciones', filteredSales.length.toString(), Components.icons.clipboard, 'blue')}
                    ${Components.statCard('Producto Top', topProduct || 'N/A', Components.icons.star, 'orange')}
                </div>

                <div class="grid lg:grid-cols-2 gap-4 md:gap-6">
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                        <h3 class="font-semibold text-slate-900 mb-4 md:mb-6">Ventas por Día</h3>
                        <div class="space-y-3 md:space-y-4">
                            ${Object.entries(dailySales).slice(-7).map(([date, amount]) => {
                                const percentage = (amount / maxDaily) * 100;
                                return `
                                    <div class="flex items-center gap-3 md:gap-4">
                                        <span class="text-xs md:text-sm text-slate-500 w-16 md:w-24">${this.formatDate(date)}</span>
                                        <div class="flex-1 h-6 md:h-8 bg-slate-100 rounded-lg overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg transition-all duration-500" 
                                                 style="width: ${percentage}%"></div>
                                        </div>
                                        <span class="text-xs md:text-sm font-semibold text-slate-700 w-16 md:w-20 text-right">$${amount.toFixed(2)}</span>
                                    </div>
                                `;
                            }).join('') || `
                                <div class="text-center py-8 text-slate-400">
                                    ${Components.icons.chart.replace('w-5 h-5', 'w-12 h-12 mx-auto mb-3 opacity-50')}
                                    <p>No hay datos para mostrar</p>
                                </div>
                            `}
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                        <h3 class="font-semibold text-slate-900 mb-4 md:mb-6">Historial de Ventas</h3>
                        <div class="max-h-64 md:max-h-80 overflow-y-auto">
                            ${filteredSales.length > 0 ? `
                                <div class="space-y-2 md:space-y-3">
                                    ${filteredSales.slice().reverse().slice(0, 10).map(sale => `
                                        <div class="flex items-center justify-between p-2 md:p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p class="font-medium text-slate-900 text-sm">#${sale.id.toString().slice(-6)}</p>
                                                <p class="text-xs text-slate-500">${new Date(sale.date).toLocaleString('es')}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-bold text-orange-600 text-sm md:text-base">$${sale.total.toFixed(2)}</p>
                                                <!-- CORRECCIÓN: Sumamos las cantidades (qty) de cada item -->
                                                <p class="text-xs text-slate-500">${sale.items.reduce((acc, item) => acc + (item.qty || 0), 0)} items</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-8 text-slate-400">
                                    ${Components.icons.clipboard.replace('w-6 h-6', 'w-12 h-12 mx-auto mb-3 opacity-50')}
                                    <p>No hay ventas en este periodo</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return LayoutComponents.layout(content, 'reports');
    },

    getFilteredSales() {
        const sales = Store.sales.getAll();
        const from = new Date(this.dateFrom);
        from.setHours(0, 0, 0, 0);
        const to = new Date(this.dateTo);
        to.setHours(23, 59, 59, 999);

        return sales.filter(s => {
            const saleDate = new Date(s.date);
            return saleDate >= from && saleDate <= to;
        });
    },

    getTopProduct(sales) {
        const productCounts = {};
        sales.forEach(sale => {
            sale.items.forEach(item => {
                productCounts[item.name] = (productCounts[item.name] || 0) + item.qty;
            });
        });

        let topProduct = null;
        let maxQty = 0;
        Object.entries(productCounts).forEach(([name, qty]) => {
            if (qty > maxQty) { maxQty = qty; topProduct = name; }
        });
        return topProduct;
    },

    getDailySales(sales) {
        const daily = {};
        sales.forEach(sale => {
            const date = sale.date.split('T')[0];
            daily[date] = (daily[date] || 0) + sale.total;
        });
        return daily;
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es', { day: '2-digit', month: 'short' });
    },

    updateDateFrom(value) { this.dateFrom = value; Router.navigate('reports'); },
    updateDateTo(value) { this.dateTo = value; Router.navigate('reports'); },
    resetDates() { this.init(); Router.navigate('reports'); }
};

Router.register('reports', () => ReportsPage.render());
