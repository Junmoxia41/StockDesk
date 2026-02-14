/**
 * Finance Cash Flow Module
 * Stock Desk Application
 */

const FinanceCashFlow = {
    render() {
        const transactions = Store.transactions.getAll();
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const monthTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
        const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const balance = totalIncome - totalExpenses;

        // Group by day for chart
        const dailyFlow = {};
        monthTransactions.forEach(t => {
            const day = new Date(t.date).toLocaleDateString('es');
            if (!dailyFlow[day]) dailyFlow[day] = { income: 0, expense: 0 };
            dailyFlow[day][t.type] += t.amount;
        });

        return `
            <div class="space-y-6">
                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                ${Components.icons.trending}
                            </div>
                            <span class="text-sm text-slate-500">Ingresos del Mes</span>
                        </div>
                        <p class="text-2xl font-bold text-green-600">$${totalIncome.toFixed(2)}</p>
                    </div>
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                ${Components.icons.receipt}
                            </div>
                            <span class="text-sm text-slate-500">Egresos del Mes</span>
                        </div>
                        <p class="text-2xl font-bold text-red-600">$${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-lg flex items-center justify-center ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}">
                                ${Components.icons.wallet}
                            </div>
                            <span class="text-sm text-slate-500">Balance</span>
                        </div>
                        <p class="text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}">$${balance.toFixed(2)}</p>
                    </div>
                </div>

                <!-- Cash Flow Chart -->
                <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-semibold text-slate-900 mb-4">Flujo de Caja - Últimos días</h4>
                    <div class="space-y-3">
                        ${Object.entries(dailyFlow).slice(-7).map(([day, data]) => {
                            const max = Math.max(totalIncome, totalExpenses, 1);
                            return `
                                <div class="flex items-center gap-4">
                                    <span class="text-xs text-slate-500 w-20">${day}</span>
                                    <div class="flex-1 flex gap-2">
                                        <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                            <div class="h-full bg-green-500 rounded-full" style="width: ${(data.income / max) * 100}%"></div>
                                        </div>
                                        <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                            <div class="h-full bg-red-400 rounded-full" style="width: ${(data.expense / max) * 100}%"></div>
                                        </div>
                                    </div>
                                    <div class="text-xs w-24 text-right">
                                        <span class="text-green-600">+${data.income.toFixed(0)}</span> / 
                                        <span class="text-red-500">-${data.expense.toFixed(0)}</span>
                                    </div>
                                </div>
                            `;
                        }).join('') || '<p class="text-center text-slate-400 py-4">Sin movimientos este mes</p>'}
                    </div>
                    <div class="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
                        <span class="flex items-center gap-2 text-sm"><span class="w-3 h-3 bg-green-500 rounded-full"></span> Ingresos</span>
                        <span class="flex items-center gap-2 text-sm"><span class="w-3 h-3 bg-red-400 rounded-full"></span> Egresos</span>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid md:grid-cols-2 gap-4">
                    <button onclick="FinanceCashFlow.addIncome()" 
                            class="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-left transition">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                ${Components.icons.plus}
                            </div>
                            <div>
                                <h4 class="font-semibold text-green-700">Registrar Ingreso</h4>
                                <p class="text-sm text-green-600">Añadir entrada de dinero</p>
                            </div>
                        </div>
                    </button>
                    <button onclick="FinanceCashFlow.addExpense()" 
                            class="p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-left transition">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                                ${Components.icons.minus}
                            </div>
                            <div>
                                <h4 class="font-semibold text-red-700">Registrar Egreso</h4>
                                <p class="text-sm text-red-600">Añadir salida de dinero</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        `;
    },

    addIncome() {
        Components.modal({
            title: 'Registrar Ingreso',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                        <select id="income-cat" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="Ventas">Ventas</option>
                            <option value="Servicios">Servicios</option>
                            <option value="Inversión">Inversión</option>
                            <option value="Préstamo">Préstamo recibido</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Monto</label>
                        <input type="number" id="income-amount" step="0.01" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <input type="text" id="income-desc" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Registrar',
            onConfirm: () => {
                Store.transactions.add({
                    type: 'income',
                    category: document.getElementById('income-cat').value,
                    amount: parseFloat(document.getElementById('income-amount').value),
                    description: document.getElementById('income-desc').value
                });
                Components.toast('Ingreso registrado', 'success');
                Router.navigate('finance');
            }
        });
    },

    addExpense() {
        Components.modal({
            title: 'Registrar Egreso',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                        <select id="expense-cat" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="Operativos">Gastos Operativos</option>
                            <option value="Servicios">Servicios (luz, agua, etc)</option>
                            <option value="Nómina">Nómina</option>
                            <option value="Proveedores">Pago a Proveedores</option>
                            <option value="Impuestos">Impuestos</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Monto</label>
                        <input type="number" id="expense-amount" step="0.01" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <input type="text" id="expense-desc" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Registrar',
            onConfirm: () => {
                Store.transactions.add({
                    type: 'expense',
                    category: document.getElementById('expense-cat').value,
                    amount: parseFloat(document.getElementById('expense-amount').value),
                    description: document.getElementById('expense-desc').value
                });
                Components.toast('Egreso registrado', 'success');
                Router.navigate('finance');
            }
        });
    }
};
