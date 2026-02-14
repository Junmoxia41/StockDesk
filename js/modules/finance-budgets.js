/**
 * Finance Budgets Module - Budget Planning & Projections
 * Stock Desk Application
 */

const FinanceBudgets = {
    render() {
        const budgets = Store.budgets.getAll();
        const transactions = Store.transactions.getAll();
        
        // Calculate projections based on last 3 months
        const now = new Date();
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        const recentTx = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
        const avgIncome = recentTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) / 3;
        const avgExpense = recentTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / 3;

        return `
            <div class="space-y-6">
                <!-- Projections -->
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <h4 class="font-semibold mb-4 flex items-center gap-2">
                        ${Components.icons.trending} Proyecciones Financieras (3 meses)
                    </h4>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="bg-white/20 rounded-lg p-4 text-center">
                            <p class="text-sm text-orange-100 mb-1">Ingresos Prom.</p>
                            <p class="text-2xl font-bold">$${avgIncome.toFixed(0)}</p>
                        </div>
                        <div class="bg-white/20 rounded-lg p-4 text-center">
                            <p class="text-sm text-orange-100 mb-1">Gastos Prom.</p>
                            <p class="text-2xl font-bold">$${avgExpense.toFixed(0)}</p>
                        </div>
                        <div class="bg-white/20 rounded-lg p-4 text-center">
                            <p class="text-sm text-orange-100 mb-1">Proyección Anual</p>
                            <p class="text-2xl font-bold">$${((avgIncome - avgExpense) * 12).toFixed(0)}</p>
                        </div>
                    </div>
                </div>

                <!-- Budgets List -->
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Presupuestos</h3>
                    <button onclick="FinanceBudgets.add()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press flex items-center gap-2">
                        ${Components.icons.plus} Nuevo Presupuesto
                    </button>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    ${budgets.map(b => {
                        const spent = transactions
                            .filter(t => t.type === 'expense' && t.category === b.category)
                            .reduce((s, t) => s + t.amount, 0);
                        const percentage = b.amount > 0 ? Math.min((spent / b.amount) * 100, 100) : 0;
                        const remaining = b.amount - spent;
                        const isOver = spent > b.amount;

                        return `
                            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 class="font-semibold text-slate-900">${b.name}</h4>
                                        <p class="text-sm text-slate-500">${b.category} - ${b.period}</p>
                                    </div>
                                    <span class="px-2 py-1 text-xs rounded-full ${isOver ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
                                        ${isOver ? 'Excedido' : 'En rango'}
                                    </span>
                                </div>
                                
                                <div class="mb-3">
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="text-slate-500">Gastado</span>
                                        <span class="font-medium">${percentage.toFixed(0)}%</span>
                                    </div>
                                    <div class="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div class="h-full ${isOver ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'} rounded-full transition-all" 
                                             style="width: ${percentage}%"></div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
                                    <div>
                                        <p class="text-xs text-slate-500">Presupuesto</p>
                                        <p class="font-semibold text-slate-900">$${b.amount.toFixed(0)}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500">Gastado</p>
                                        <p class="font-semibold ${isOver ? 'text-red-600' : 'text-slate-900'}">$${spent.toFixed(0)}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500">Disponible</p>
                                        <p class="font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}">$${remaining.toFixed(0)}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${budgets.length === 0 ? `
                    <div class="bg-white rounded-xl p-8 text-center">
                        ${Components.icons.trending.replace('w-5 h-5', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                        <p class="text-slate-500 mb-2">No hay presupuestos configurados</p>
                        <p class="text-sm text-slate-400">Crea presupuestos para controlar tus gastos</p>
                    </div>
                ` : ''}

                <!-- Financial Tips -->
                <div class="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        ${Components.icons.info} Consejos Financieros
                    </h4>
                    <ul class="space-y-2 text-sm text-blue-800">
                        <li class="flex items-start gap-2">
                            ${Components.icons.check.replace('w-5 h-5', 'w-4 h-4 mt-0.5 flex-shrink-0')}
                            <span>Mantén tus gastos operativos por debajo del 30% de tus ingresos</span>
                        </li>
                        <li class="flex items-start gap-2">
                            ${Components.icons.check.replace('w-5 h-5', 'w-4 h-4 mt-0.5 flex-shrink-0')}
                            <span>Reserva el 10% de las ganancias para emergencias</span>
                        </li>
                        <li class="flex items-start gap-2">
                            ${Components.icons.check.replace('w-5 h-5', 'w-4 h-4 mt-0.5 flex-shrink-0')}
                            <span>Revisa tus presupuestos semanalmente para evitar desviaciones</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    },

    add() {
        Components.modal({
            title: 'Nuevo Presupuesto',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="budget-name" required placeholder="Ej: Gastos de oficina"
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                        <select id="budget-cat" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="Operativos">Gastos Operativos</option>
                            <option value="Servicios">Servicios</option>
                            <option value="Nómina">Nómina</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Proveedores">Proveedores</option>
                            <option value="Impuestos">Impuestos</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Monto Límite</label>
                        <input type="number" id="budget-amount" step="0.01" required
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Periodo</label>
                        <select id="budget-period" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="Mensual">Mensual</option>
                            <option value="Semanal">Semanal</option>
                            <option value="Trimestral">Trimestral</option>
                            <option value="Anual">Anual</option>
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Crear',
            onConfirm: () => {
                Store.budgets.add({
                    name: document.getElementById('budget-name').value,
                    category: document.getElementById('budget-cat').value,
                    amount: parseFloat(document.getElementById('budget-amount').value),
                    period: document.getElementById('budget-period').value
                });
                Components.toast('Presupuesto creado', 'success');
                Router.navigate('finance');
            }
        });
    }
};
