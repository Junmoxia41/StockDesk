/**
 * Finance Ledger Module - Income/Expense Book
 * Stock Desk Application
 */

const FinanceLedger = {
    filterType: 'all',
    dateFrom: null,
    dateTo: null,

    render() {
        if (!this.dateFrom) {
            const today = new Date();
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            this.dateFrom = monthAgo.toISOString().split('T')[0];
            this.dateTo = today.toISOString().split('T')[0];
        }

        let transactions = Store.transactions.getByDateRange(this.dateFrom, this.dateTo);
        if (this.filterType !== 'all') {
            transactions = transactions.filter(t => t.type === this.filterType);
        }

        const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        return `
            <div class="space-y-4">
                <!-- Filters -->
                <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div class="flex flex-wrap gap-4 items-end">
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">Desde</label>
                            <input type="date" value="${this.dateFrom}" onchange="FinanceLedger.setDateFrom(this.value)"
                                   class="px-3 py-2 rounded-lg border border-slate-200 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">Hasta</label>
                            <input type="date" value="${this.dateTo}" onchange="FinanceLedger.setDateTo(this.value)"
                                   class="px-3 py-2 rounded-lg border border-slate-200 text-sm">
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">Tipo</label>
                            <select onchange="FinanceLedger.setFilter(this.value)" class="px-3 py-2 rounded-lg border border-slate-200 text-sm">
                                <option value="all" ${this.filterType === 'all' ? 'selected' : ''}>Todos</option>
                                <option value="income" ${this.filterType === 'income' ? 'selected' : ''}>Ingresos</option>
                                <option value="expense" ${this.filterType === 'expense' ? 'selected' : ''}>Egresos</option>
                            </select>
                        </div>
                        <button onclick="FinanceLedger.export()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center gap-2">
                            ${Components.icons.clipboard} Exportar
                        </button>
                    </div>
                </div>

                <!-- Summary -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-green-50 rounded-xl p-4 text-center">
                        <p class="text-xs text-green-600 mb-1">Total Ingresos</p>
                        <p class="text-xl font-bold text-green-700">$${totalIncome.toFixed(2)}</p>
                    </div>
                    <div class="bg-red-50 rounded-xl p-4 text-center">
                        <p class="text-xs text-red-600 mb-1">Total Egresos</p>
                        <p class="text-xl font-bold text-red-700">$${totalExpense.toFixed(2)}</p>
                    </div>
                    <div class="bg-blue-50 rounded-xl p-4 text-center">
                        <p class="text-xs text-blue-600 mb-1">Balance</p>
                        <p class="text-xl font-bold text-blue-700">$${(totalIncome - totalExpense).toFixed(2)}</p>
                    </div>
                </div>

                <!-- Transactions Table -->
                ${transactions.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50">
                                    <tr class="text-left text-sm text-slate-600">
                                        <th class="px-4 py-3 font-semibold">Fecha</th>
                                        <th class="px-4 py-3 font-semibold">Tipo</th>
                                        <th class="px-4 py-3 font-semibold">Categoría</th>
                                        <th class="px-4 py-3 font-semibold">Descripción</th>
                                        <th class="px-4 py-3 font-semibold text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${transactions.slice().reverse().map(t => `
                                        <tr class="table-row-hover">
                                            <td class="px-4 py-3 text-sm text-slate-600">${new Date(t.date).toLocaleDateString('es')}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                                                    ${t.type === 'income' ? 'Ingreso' : 'Egreso'}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3 text-sm text-slate-900">${t.category}</td>
                                            <td class="px-4 py-3 text-sm text-slate-500">${t.description || '-'}</td>
                                            <td class="px-4 py-3 text-sm font-semibold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                                                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-8 text-center">
                        ${Components.icons.clipboard.replace('w-6 h-6', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                        <p class="text-slate-500">No hay transacciones en este periodo</p>
                    </div>
                `}
            </div>
        `;
    },

    setFilter(type) { this.filterType = type; Router.navigate('finance'); },
    setDateFrom(date) { this.dateFrom = date; Router.navigate('finance'); },
    setDateTo(date) { this.dateTo = date; Router.navigate('finance'); },

    export() {
        const transactions = Store.transactions.getByDateRange(this.dateFrom, this.dateTo);
        const csv = 'Fecha,Tipo,Categoría,Descripción,Monto\n' + 
            transactions.map(t => `${t.date},${t.type},${t.category},"${t.description || ''}",${t.amount}`).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `libro-contable-${this.dateFrom}-${this.dateTo}.csv`;
        a.click();
        Components.toast('Libro exportado', 'success');
    }
};

const FinanceExpenses = {
    render() {
        const expenses = Store.expenses.getAll();
        const byCategory = {};
        expenses.forEach(e => {
            byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
        });
        const total = expenses.reduce((s, e) => s + e.amount, 0);

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Gastos Operativos</h3>
                    <button onclick="FinanceExpenses.add()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press flex items-center gap-2">
                        ${Components.icons.plus} Nuevo Gasto
                    </button>
                </div>

                <!-- By Category -->
                <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-medium text-slate-900 mb-4">Gastos por Categoría</h4>
                    <div class="space-y-3">
                        ${Object.entries(byCategory).map(([cat, amount]) => `
                            <div class="flex items-center gap-3">
                                <span class="text-sm text-slate-600 w-32">${cat}</span>
                                <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                    <div class="h-full bg-orange-500 rounded-full" style="width: ${total > 0 ? (amount / total) * 100 : 0}%"></div>
                                </div>
                                <span class="text-sm font-semibold text-slate-900 w-24 text-right">$${amount.toFixed(2)}</span>
                            </div>
                        `).join('') || '<p class="text-slate-400 text-center py-4">Sin gastos registrados</p>'}
                    </div>
                    ${total > 0 ? `<p class="text-right font-bold text-slate-900 mt-4 pt-4 border-t">Total: $${total.toFixed(2)}</p>` : ''}
                </div>

                <!-- Recent Expenses -->
                ${expenses.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="px-4 py-3 border-b border-slate-100">
                            <h4 class="font-medium text-slate-900">Gastos Recientes</h4>
                        </div>
                        <div class="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                            ${expenses.slice().reverse().slice(0, 15).map(e => `
                                <div class="px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p class="font-medium text-slate-900">${e.description || e.category}</p>
                                        <p class="text-xs text-slate-500">${new Date(e.date).toLocaleDateString('es')} - ${e.category}</p>
                                    </div>
                                    <span class="font-semibold text-red-600">-$${e.amount.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    add() {
        Components.modal({
            title: 'Nuevo Gasto Operativo',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                        <select id="exp-cat" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="Alquiler">Alquiler</option>
                            <option value="Servicios">Servicios (luz, agua, internet)</option>
                            <option value="Suministros">Suministros de oficina</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Marketing">Marketing y publicidad</option>
                            <option value="Seguros">Seguros</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Monto</label>
                        <input type="number" id="exp-amount" step="0.01" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <input type="text" id="exp-desc" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Guardar',
            onConfirm: () => {
                Store.expenses.add({
                    category: document.getElementById('exp-cat').value,
                    amount: parseFloat(document.getElementById('exp-amount').value),
                    description: document.getElementById('exp-desc').value
                });
                Components.toast('Gasto registrado', 'success');
                Router.navigate('finance');
            }
        });
    }
};
