/**
 * Dashboard Widgets Module
 * Stock Desk Application
 */

const DashboardWidgets = {
    renderOverview() {
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const todaySales = Store.sales.getTodaySales();
        const transactions = Store.transactions.getAll();
        
        const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
        const todayRevenue = todaySales.reduce((s, sale) => s + sale.total, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const profit = totalRevenue - totalExpenses;

        return `
            <div class="space-y-6">
                <!-- KPI Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.renderKPICard('Ventas Hoy', `$${todayRevenue.toFixed(2)}`, todaySales.length + ' transacciones', 'green', 'trending')}
                    ${this.renderKPICard('Ingresos Totales', `$${totalRevenue.toFixed(2)}`, sales.length + ' ventas', 'blue', 'dollar')}
                    ${this.renderKPICard('Gastos', `$${totalExpenses.toFixed(2)}`, 'Este período', 'red', 'receipt')}
                    ${this.renderKPICard('Ganancia Neta', `$${profit.toFixed(2)}`, profit >= 0 ? 'Positivo' : 'Negativo', profit >= 0 ? 'green' : 'red', 'chart')}
                </div>

                <!-- Charts Row -->
                <div class="grid lg:grid-cols-2 gap-6">
                    ${DashboardCharts.renderSalesChart()}
                    ${DashboardCharts.renderCategoryChart()}
                </div>

                <!-- Widgets Row -->
                <div class="grid lg:grid-cols-3 gap-6">
                    ${this.renderTopProductsWidget()}
                    ${this.renderLowStockWidget()}
                    ${this.renderRecentActivityWidget()}
                </div>
            </div>
        `;
    },

    renderSales() {
        const sales = Store.sales.getAll();
        const todaySales = Store.sales.getTodaySales();
        const weekSales = this.getWeekSales();
        const monthSales = this.getMonthSales();

        return `
            <div class="space-y-6">
                <!-- Sales KPIs -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.renderKPICard('Hoy', `$${todaySales.reduce((s, v) => s + v.total, 0).toFixed(2)}`, todaySales.length + ' ventas', 'green', 'cart')}
                    ${this.renderKPICard('Esta Semana', `$${weekSales.reduce((s, v) => s + v.total, 0).toFixed(2)}`, weekSales.length + ' ventas', 'blue', 'calendar')}
                    ${this.renderKPICard('Este Mes', `$${monthSales.reduce((s, v) => s + v.total, 0).toFixed(2)}`, monthSales.length + ' ventas', 'purple', 'chart')}
                    ${this.renderKPICard('Ticket Promedio', `$${sales.length > 0 ? (sales.reduce((s, v) => s + v.total, 0) / sales.length).toFixed(2) : '0.00'}`, 'Por venta', 'orange', 'dollar')}
                </div>

                <!-- Sales Chart -->
                <div class="grid lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2">
                        ${DashboardCharts.renderSalesTrendChart()}
                    </div>
                    ${this.renderTopProductsWidget()}
                </div>

                <!-- Hourly Sales -->
                ${DashboardCharts.renderHourlySalesChart()}
            </div>
        `;
    },

    renderInventory() {
        const products = Store.products.getAll();
        const warehouses = Store.warehouses.getAll();
        const totalValue = products.reduce((s, p) => s + (p.price * p.stock), 0);
        const lowStock = products.filter(p => p.stock < (p.minStock || 10));

        return `
            <div class="space-y-6">
                <!-- Inventory KPIs -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.renderKPICard('Productos', products.length.toString(), 'En catálogo', 'blue', 'package')}
                    ${this.renderKPICard('Almacenes', warehouses.length.toString(), 'Configurados', 'purple', 'warehouse')}
                    ${this.renderKPICard('Valor Total', `$${totalValue.toFixed(2)}`, 'Inventario', 'green', 'dollar')}
                    ${this.renderKPICard('Stock Bajo', lowStock.length.toString(), 'Productos', lowStock.length > 0 ? 'red' : 'green', 'warning')}
                </div>

                <div class="grid lg:grid-cols-2 gap-6">
                    ${DashboardCharts.renderStockDistributionChart()}
                    ${DashboardCharts.renderWarehouseChart()}
                </div>

                ${this.renderLowStockWidget(true)}
            </div>
        `;
    },

    renderFinance() {
        const transactions = Store.transactions.getAll();
        const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const balance = income - expenses;

        return `
            <div class="space-y-6">
                <!-- Finance KPIs -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.renderKPICard('Ingresos', `$${income.toFixed(2)}`, 'Total', 'green', 'trending')}
                    ${this.renderKPICard('Gastos', `$${expenses.toFixed(2)}`, 'Total', 'red', 'receipt')}
                    ${this.renderKPICard('Balance', `$${balance.toFixed(2)}`, balance >= 0 ? 'Positivo' : 'Negativo', balance >= 0 ? 'blue' : 'red', 'wallet')}
                    ${this.renderKPICard('Margen', `${income > 0 ? ((balance / income) * 100).toFixed(1) : 0}%`, 'Rentabilidad', 'purple', 'chart')}
                </div>

                <div class="grid lg:grid-cols-2 gap-6">
                    ${DashboardCharts.renderCashFlowChart()}
                    ${DashboardCharts.renderExpensesByCategoryChart()}
                </div>
            </div>
        `;
    },

    renderKPICard(title, value, subtitle, color, icon) {
        const colors = {
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            red: 'bg-red-100 text-red-600',
            orange: 'bg-orange-100 text-orange-600',
            purple: 'bg-purple-100 text-purple-600'
        };

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center">
                        ${Components.icons[icon] || Components.icons.chart}
                    </div>
                </div>
                <p class="text-2xl font-bold text-slate-900 mb-1">${value}</p>
                <p class="text-sm text-slate-500">${title}</p>
                <p class="text-xs text-slate-400 mt-1">${subtitle}</p>
            </div>
        `;
    },

    renderTopProductsWidget() {
        const sales = Store.sales.getAll();
        const productSales = {};
        sales.forEach(s => {
            s.items.forEach(i => {
                productSales[i.name] = (productSales[i.name] || 0) + i.qty;
            });
        });
        const top = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h4 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    ${Components.icons.star} Productos Más Vendidos
                </h4>
                ${top.length > 0 ? `
                    <div class="space-y-3">
                        ${top.map(([name, qty], i) => `
                            <div class="flex items-center gap-3">
                                <span class="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">${i + 1}</span>
                                <span class="flex-1 text-sm text-slate-700 truncate">${name}</span>
                                <span class="text-sm font-semibold text-slate-900">${qty} uds</span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-slate-400 text-sm text-center py-4">Sin datos</p>'}
            </div>
        `;
    },

    renderLowStockWidget(full = false) {
        const products = Store.products.getAll().filter(p => p.stock < (p.minStock || 10));

        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 ${full ? 'col-span-full' : ''}">
                <h4 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    ${Components.icons.warning.replace('w-5 h-5', 'w-5 h-5 text-red-500')} Alertas de Stock
                </h4>
                ${products.length > 0 ? `
                    <div class="${full ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-2'}">
                        ${products.slice(0, full ? 9 : 5).map(p => `
                            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <span class="text-sm text-slate-700">${p.name}</span>
                                <span class="text-sm font-bold text-red-600">${p.stock} uds</span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-green-600 text-sm text-center py-4">Todo el inventario está OK</p>'}
            </div>
        `;
    },

    renderRecentActivityWidget() {
        const logs = Store.security.getLogs().slice(-5).reverse();

        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h4 class="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    ${Components.icons.clock} Actividad Reciente
                </h4>
                ${logs.length > 0 ? `
                    <div class="space-y-3">
                        ${logs.map(l => `
                            <div class="flex items-start gap-3">
                                <div class="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                                <div>
                                    <p class="text-sm text-slate-700">${l.event}</p>
                                    <p class="text-xs text-slate-400">${new Date(l.date).toLocaleString('es')}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-slate-400 text-sm text-center py-4">Sin actividad</p>'}
            </div>
        `;
    },

    getWeekSales() {
        const week = new Date();
        week.setDate(week.getDate() - 7);
        return Store.sales.getAll().filter(s => new Date(s.date) >= week);
    },

    getMonthSales() {
        const month = new Date();
        month.setMonth(month.getMonth() - 1);
        return Store.sales.getAll().filter(s => new Date(s.date) >= month);
    }
};
