/**
 * Finance Payroll Module - Basic Payroll Management
 * Stock Desk Application
 */

const FinancePayroll = {
    render() {
        const payroll = Store.payroll.getAll();
        const employees = payroll.filter(p => p.type === 'employee');
        const payments = payroll.filter(p => p.type === 'payment');
        const totalPayroll = employees.reduce((s, e) => s + (e.salary || 0), 0);
        const thisMonth = payments.filter(p => {
            const d = new Date(p.date);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const paidThisMonth = thisMonth.reduce((s, p) => s + p.amount, 0);

        return `
            <div class="space-y-4">
                <!-- Summary -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                ${Components.icons.users}
                            </div>
                            <span class="text-sm text-slate-500">Empleados</span>
                        </div>
                        <p class="text-2xl font-bold text-slate-900">${employees.length}</p>
                    </div>
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                ${Components.icons.dollar}
                            </div>
                            <span class="text-sm text-slate-500">Nómina Mensual</span>
                        </div>
                        <p class="text-2xl font-bold text-orange-600">$${totalPayroll.toFixed(2)}</p>
                    </div>
                    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                ${Components.icons.check}
                            </div>
                            <span class="text-sm text-slate-500">Pagado este Mes</span>
                        </div>
                        <p class="text-2xl font-bold text-green-600">$${paidThisMonth.toFixed(2)}</p>
                    </div>
                </div>

                <!-- Employees -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <h4 class="font-semibold text-slate-900">Empleados</h4>
                        <button onclick="FinancePayroll.addEmployee()" 
                                class="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition flex items-center gap-1">
                            ${Components.icons.plus} Agregar
                        </button>
                    </div>
                    ${employees.length > 0 ? `
                        <div class="divide-y divide-slate-100">
                            ${employees.map(e => `
                                <div class="px-4 py-3 flex items-center justify-between hover:bg-slate-50">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-semibold text-slate-600">
                                            ${e.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p class="font-medium text-slate-900">${e.name}</p>
                                            <p class="text-xs text-slate-500">${e.position || 'Sin cargo'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="text-right">
                                            <p class="font-semibold text-slate-900">$${(e.salary || 0).toFixed(2)}</p>
                                            <p class="text-xs text-slate-500">mensual</p>
                                        </div>
                                        <button onclick="FinancePayroll.payEmployee(${e.id}, '${e.name}', ${e.salary || 0})" 
                                                class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium rounded-lg transition">
                                            Pagar
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="p-8 text-center">
                            ${Components.icons.users.replace('w-5 h-5', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                            <p class="text-slate-500">No hay empleados registrados</p>
                        </div>
                    `}
                </div>

                <!-- Payment History -->
                ${payments.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="px-4 py-3 border-b border-slate-100">
                            <h4 class="font-semibold text-slate-900">Historial de Pagos</h4>
                        </div>
                        <div class="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                            ${payments.slice().reverse().slice(0, 10).map(p => `
                                <div class="px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p class="font-medium text-slate-900">${p.employeeName}</p>
                                        <p class="text-xs text-slate-500">${new Date(p.date).toLocaleDateString('es')}</p>
                                    </div>
                                    <span class="font-semibold text-green-600">$${p.amount.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    addEmployee() {
        Components.modal({
            title: 'Agregar Empleado',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input type="text" id="emp-name" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
                        <input type="text" id="emp-position" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Salario Mensual</label>
                        <input type="number" id="emp-salary" step="0.01" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                        <input type="text" id="emp-phone" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Guardar',
            onConfirm: () => {
                Store.payroll.addEmployee({
                    name: document.getElementById('emp-name').value,
                    position: document.getElementById('emp-position').value,
                    salary: parseFloat(document.getElementById('emp-salary').value),
                    phone: document.getElementById('emp-phone').value
                });
                Components.toast('Empleado agregado', 'success');
                Router.navigate('finance');
            }
        });
    },

    payEmployee(id, name, salary) {
        Components.modal({
            title: `Pagar a ${name}`,
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Monto a Pagar</label>
                        <input type="number" id="pay-amount" step="0.01" value="${salary}" required 
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Concepto</label>
                        <select id="pay-concept" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="Salario">Salario mensual</option>
                            <option value="Adelanto">Adelanto</option>
                            <option value="Bonificación">Bonificación</option>
                            <option value="Liquidación">Liquidación</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                        <input type="text" id="pay-notes" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Registrar Pago',
            onConfirm: () => {
                Store.payroll.addPayment({
                    employeeId: id,
                    employeeName: name,
                    amount: parseFloat(document.getElementById('pay-amount').value),
                    concept: document.getElementById('pay-concept').value,
                    notes: document.getElementById('pay-notes').value
                });
                Components.toast('Pago registrado', 'success');
                Router.navigate('finance');
            }
        });
    }
};
