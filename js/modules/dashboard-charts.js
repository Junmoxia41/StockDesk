/**
 * Dashboard Charts Module
 * Stock Desk Application
 */

const DashboardCharts = {
    renderSalesChart(theme = 'light') {
        const sales = Store.sales.getAll();
        const last7Days = this.getLast7DaysSales(sales);
        const max = Math.max(...Object.values(last7Days), 1);
        const isDark = theme === 'dark';

        return `
            <div class="${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-5 ${isDark ? '' : 'shadow-sm border border-slate-100'}">
                <h4 class="font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4">Ventas Últimos 7 Días</h4>
                <div class="flex items-end justify-between gap-2 h-40">
                    ${Object.entries(last7Days).map(([day, amount]) => {
                        const height = (amount / max) * 100;
                        return `
                            <div class="flex-1 flex flex-col items-center justify-end h-full">
                                <div class="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-orange-500" 
                                     style="height: ${height}%;" title="$${amount.toFixed(2)}"></div>
                                <span class="text-xs ${isDark ? 'text-white/60' : 'text-slate-500'} mt-2">${day}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="flex justify-between mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}">
                    <span class="text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}">Total Período</span>
                    <span class="font-bold ${isDark ? 'text-white' : 'text-orange-600'}">$${Object.values(last7Days).reduce((a, b) => a + b, 0).toFixed(2)}</span>
                </div>
            </div>
        `;
    },

    renderCategoryChart() {
        const products = Store.products.getAll();
        const categories = {};
        products.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        const total = products.length || 1;
        const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-4">Productos por Categoría</h4>
                ${Object.keys(categories).length > 0 ? `
                    <div class="flex h-6 rounded-full overflow-hidden mb-4">
                        ${Object.entries(categories).map(([cat, count], i) => `
                            <div class="${colors[i % colors.length]}" style="width: ${(count / total) * 100}%" title="${cat}: ${count}"></div>
                        `).join('')}
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        ${Object.entries(categories).map(([cat, count], i) => `
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 rounded ${colors[i % colors.length]}"></span>
                                <span class="text-sm text-slate-600">${cat}</span>
                                <span class="text-sm font-bold text-slate-900 ml-auto">${count}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-slate-400 text-sm text-center py-8">Sin productos</p>'}
            </div>
        `;
    },

    renderInventoryChart(theme = 'light') {
        const products = Store.products.getAll();
        const inStock = products.filter(p => p.stock >= (p.minStock || 10)).length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock < (p.minStock || 10)).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const total = products.length || 1;
        const isDark = theme === 'dark';

        return `
            <div class="${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-5 ${isDark ? '' : 'shadow-sm border border-slate-100'}">
                <h4 class="font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4">Estado del Inventario</h4>
                <div class="flex justify-center mb-6">
                    <div class="relative w-32 h-32">
                        <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="${isDark ? '#ffffff20' : '#e2e8f0'}" stroke-width="3"/>
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" stroke-width="3" 
                                    stroke-dasharray="${(inStock / total) * 100} 100" stroke-linecap="round"/>
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" stroke-width="3" 
                                    stroke-dasharray="${(lowStock / total) * 100} 100" 
                                    stroke-dashoffset="-${(inStock / total) * 100}" stroke-linecap="round"/>
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" stroke-width="3" 
                                    stroke-dasharray="${(outOfStock / total) * 100} 100" 
                                    stroke-dashoffset="-${((inStock + lowStock) / total) * 100}" stroke-linecap="round"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <span class="text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}">${products.length}</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="flex items-center gap-2 text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}">
                            <span class="w-3 h-3 rounded bg-green-500"></span> En stock
                        </span>
                        <span class="font-bold ${isDark ? 'text-white' : 'text-slate-900'}">${inStock}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="flex items-center gap-2 text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}">
                            <span class="w-3 h-3 rounded bg-amber-500"></span> Stock bajo
                        </span>
                        <span class="font-bold ${isDark ? 'text-white' : 'text-slate-900'}">${lowStock}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="flex items-center gap-2 text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}">
                            <span class="w-3 h-3 rounded bg-red-500"></span> Agotado
                        </span>
                        <span class="font-bold ${isDark ? 'text-white' : 'text-slate-900'}">${outOfStock}</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderSalesTrendChart() {
        const sales = Store.sales.getAll();
        const last14Days = {};
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('es', { day: '2-digit', month: 'short' });
            last14Days[key] = 0;
        }
        sales.forEach(s => {
            const key = new Date(s.date).toLocaleDateString('es', { day: '2-digit', month: 'short' });
            if (last14Days.hasOwnProperty(key)) last14Days[key] += s.total;
        });
        const max = Math.max(...Object.values(last14Days), 1);

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-4">Tendencia de Ventas (14 días)</h4>
                <div class="relative h-40">
                    <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#f97316" stroke-width="2" 
                                  points="${Object.values(last14Days).map((v, i) => `${(i / 13) * 390 + 5},${100 - (v / max) * 90}`).join(' ')}"/>
                        <polyline fill="url(#gradient)" stroke="none" 
                                  points="5,100 ${Object.values(last14Days).map((v, i) => `${(i / 13) * 390 + 5},${100 - (v / max) * 90}`).join(' ')} 395,100"/>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#f97316;stop-opacity:0.3"/>
                                <stop offset="100%" style="stop-color:#f97316;stop-opacity:0"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        `;
    },

    renderHourlySalesChart() {
        const sales = Store.sales.getTodaySales();
        const hourly = Array(24).fill(0);
        sales.forEach(s => {
            const h = new Date(s.date).getHours();
            hourly[h] += s.total;
        });
        const max = Math.max(...hourly, 1);

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-4">Ventas por Hora (Hoy)</h4>
                <div class="flex items-end gap-1 h-32 overflow-x-auto pb-2">
                    ${hourly.map((v, i) => `
                        <div class="flex flex-col items-center min-w-[20px]">
                            <div class="w-4 bg-orange-500 rounded-t transition-all" style="height: ${(v / max) * 100}px"></div>
                            <span class="text-xs text-slate-400 mt-1">${i}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderStockDistributionChart() {
        const products = Store.products.getAll();
        const ranges = { '0': 0, '1-10': 0, '11-50': 0, '51-100': 0, '100+': 0 };
        products.forEach(p => {
            if (p.stock === 0) ranges['0']++;
            else if (p.stock <= 10) ranges['1-10']++;
            else if (p.stock <= 50) ranges['11-50']++;
            else if (p.stock <= 100) ranges['51-100']++;
            else ranges['100+']++;
        });
        const max = Math.max(...Object.values(ranges), 1);

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-4">Distribución de Stock</h4>
                <div class="space-y-3">
                    ${Object.entries(ranges).map(([range, count]) => `
                        <div class="flex items-center gap-3">
                            <span class="text-sm text-slate-600 w-16">${range}</span>
                            <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                <div class="h-full bg-blue-500 rounded-full" style="width: ${(count / max) * 100}%"></div>
                            </div>
                            <span class="text-sm font-bold text-slate-900 w-8 text-right">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderWarehouseChart() {
        const warehouses = Store.warehouses.getAll();
        const products = Store.products.getAll();

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-4">Productos por Almacén</h4>
                <div class="space-y-3">
                    ${warehouses.map(w => {
                        const count = products.filter(p => p.warehouseId === w.id).length;
                        const value = products.filter(p => p.warehouseId === w.id).reduce((s, p) => s + (p.price * p.stock), 0);
                        return `
                            <div class="p-3 bg-slate-50 rounded-lg">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium text-slate-900">${w.name}</span>
                                    <span class="text-sm text-slate-500">${count} productos</span>
                                </div>
                                <p class="text-lg font-bold text-orange-600">$${value.toFixed(2)}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderCashFlowChart() {
        const transactions = Store.transactions.getAll();
        const last7Days = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('es', { weekday: 'short' });
            last7Days[key] = { income: 0, expense: 0 };
        }
        transactions.forEach(t => {
            const key = new Date(t.date).toLocaleDateString('es', { weekday: 'short' });
            if (last7Days[key]) last7Days[key][t.type] += t.amount;
        });
        const max = Math.max(...Object.values(last7Days).flatMap(v => [v.income, v.expense]), 1);

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-4">Flujo de Caja Semanal</h4>
                <div class="flex items-end gap-4 h-40">
                    ${Object.entries(last7Days).map(([day, data]) => `
                        <div class="flex-1 flex flex-col items-center gap-1">
                            <div class="w-full flex gap-1 items-end h-32">
                                <div class="flex-1 bg-green-500 rounded-t" style="height: ${(data.income / max) * 100}%"></div>
                                <div class="flex-1 bg-red-400 rounded-t" style="height: ${(data.expense / max) * 100}%"></div>
                            </div>
                            <span class="text-xs text-slate-500">${day}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="flex justify-center gap-6 mt-4">
                    <span class="flex items-center gap-2 text-sm"><span class="w-3 h-3 bg-green-500 rounded"></span> Ingresos</span>
                    <span class="flex items-center gap-2 text-sm"><span class="w-3 h-3 bg-red-400 rounded"></span> Gastos</span>
                </div>
            </div>
        `;
    },

    renderExpensesByCategoryChart() {
        const expenses = Store.expenses.getAll();
        const byCategory = {};
        expenses.forEach(e => byCategory[e.category] = (byCategory[e.category] || 0) + e.amount);
        const total = Object.values(byCategory).reduce((a, b) => a + b, 0) || 1;
        const colors = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6'];

        return `
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h4 class="font-semibold text-slate-900 mb-4">Gastos por Categoría</h4>
                ${Object.keys(byCategory).length > 0 ? `
                    <div class="space-y-3">
                        ${Object.entries(byCategory).map(([cat, amount], i) => `
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-slate-600">${cat}</span>
                                    <span class="font-medium text-slate-900">$${amount.toFixed(2)}</span>
                                </div>
                                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full" style="width: ${(amount / total) * 100}%; background: ${colors[i % colors.length]}"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-slate-400 text-sm text-center py-8">Sin gastos registrados</p>'}
            </div>
        `;
    },

    getLast7DaysSales(sales) {
        const days = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('es', { weekday: 'short' });
            days[key] = 0;
        }
        sales.forEach(s => {
            const key = new Date(s.date).toLocaleDateString('es', { weekday: 'short' });
            if (days.hasOwnProperty(key)) days[key] += s.total;
        });
        return days;
    }
};
