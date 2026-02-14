/**
 * Users Shifts & Registers Module
 * Stock Desk Application
 */

const UsersShifts = {
    renderShifts() {
        const shifts = Store.get('stockdesk_shifts') || [];
        const currentShift = shifts.find(s => s.status === 'open');

        return `
            <div class="space-y-6">
                ${currentShift ? `
                    <div class="bg-green-50 rounded-xl p-6 border border-green-200">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
                                    ${Components.icons.clock}
                                </div>
                                <div>
                                    <h3 class="font-semibold text-green-900">Turno Activo</h3>
                                    <p class="text-sm text-green-600">Inicio: ${new Date(currentShift.startTime).toLocaleString('es')}</p>
                                </div>
                            </div>
                            <button onclick="UsersShifts.closeShift(${currentShift.id})" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                Cerrar Turno
                            </button>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="bg-white rounded-lg p-3 text-center">
                                <p class="text-xs text-slate-500">Cajero</p>
                                <p class="font-semibold">${currentShift.cashier}</p>
                            </div>
                            <div class="bg-white rounded-lg p-3 text-center">
                                <p class="text-xs text-slate-500">Caja</p>
                                <p class="font-semibold">${currentShift.register}</p>
                            </div>
                            <div class="bg-white rounded-lg p-3 text-center">
                                <p class="text-xs text-slate-500">Fondo Inicial</p>
                                <p class="font-semibold text-green-600">$${currentShift.openingCash.toFixed(2)}</p>
                            </div>
                            <div class="bg-white rounded-lg p-3 text-center">
                                <p class="text-xs text-slate-500">Ventas</p>
                                <p class="font-semibold text-orange-600">$${(currentShift.sales || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center">
                        <div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${Components.icons.clock.replace('w-5 h-5', 'w-8 h-8 text-slate-400')}
                        </div>
                        <h3 class="font-semibold text-slate-900 mb-2">No hay turno activo</h3>
                        <p class="text-slate-500 mb-4">Inicia un turno para registrar ventas</p>
                        <button onclick="UsersShifts.openShift()" class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl">
                            Abrir Turno
                        </button>
                    </div>
                `}

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900">Historial de Turnos</h3>
                    </div>
                    ${shifts.filter(s => s.status === 'closed').length > 0 ? `
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50">
                                    <tr class="text-left text-sm text-slate-600">
                                        <th class="px-4 py-3 font-semibold">Fecha</th>
                                        <th class="px-4 py-3 font-semibold">Cajero</th>
                                        <th class="px-4 py-3 font-semibold">Apertura</th>
                                        <th class="px-4 py-3 font-semibold">Ventas</th>
                                        <th class="px-4 py-3 font-semibold">Cierre</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${shifts.filter(s => s.status === 'closed').slice().reverse().slice(0, 10).map(s => `
                                        <tr class="table-row-hover">
                                            <td class="px-4 py-3 text-sm">${new Date(s.startTime).toLocaleDateString('es')}</td>
                                            <td class="px-4 py-3 text-sm font-medium">${s.cashier}</td>
                                            <td class="px-4 py-3 text-sm">$${s.openingCash.toFixed(2)}</td>
                                            <td class="px-4 py-3 text-sm font-semibold text-green-600">$${(s.sales || 0).toFixed(2)}</td>
                                            <td class="px-4 py-3 text-sm">$${(s.closingCash || 0).toFixed(2)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<div class="p-8 text-center text-slate-400">No hay turnos cerrados</div>'}
                </div>
            </div>
        `;
    },

    renderRegisters() {
        const registers = Store.get('stockdesk_registers') || [{ id: 1, name: 'Caja Principal', status: 'active' }];

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Cajas Registradoras</h3>
                    <button onclick="UsersShifts.addRegister()" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
                        ${Components.icons.plus} Nueva Caja
                    </button>
                </div>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${registers.map(reg => `
                        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                            <div class="flex items-start justify-between mb-4">
                                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                    ${Components.icons.box}
                                </div>
                                <span class="px-2 py-1 text-xs rounded-full ${reg.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}">
                                    ${reg.status === 'active' ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>
                            <h4 class="font-semibold text-slate-900 mb-1">${reg.name}</h4>
                            <p class="text-sm text-slate-500 mb-4">${reg.location || 'Sin ubicación'}</p>
                            <div class="flex gap-2">
                                <button onclick="UsersShifts.editRegister(${reg.id})" class="flex-1 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg">Editar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    openShift() {
        const registers = Store.get('stockdesk_registers') || [{ id: 1, name: 'Caja Principal' }];
        const user = Store.get(Store.KEYS.USER)?.username || 'Usuario';

        Components.modal({
            title: 'Abrir Turno',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Caja</label>
                        <select id="shift-register" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            ${registers.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Fondo Inicial</label>
                        <input type="number" id="shift-opening" step="0.01" value="0" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Abrir',
            onConfirm: () => {
                const shifts = Store.get('stockdesk_shifts') || [];
                shifts.push({
                    id: Date.now(),
                    cashier: user,
                    register: document.getElementById('shift-register').value,
                    openingCash: parseFloat(document.getElementById('shift-opening').value) || 0,
                    startTime: new Date().toISOString(),
                    status: 'open',
                    sales: 0
                });
                Store.set('stockdesk_shifts', shifts);
                addAuditLog('Crear', 'Turnos', 'Turno abierto');
                Components.toast('Turno abierto', 'success');
                Router.navigate('users');
            }
        });
    },

    closeShift(id) {
        Components.modal({
            title: 'Cerrar Turno',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Efectivo en Caja</label>
                        <input type="number" id="shift-closing" step="0.01" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                        <textarea id="shift-notes" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-200"></textarea>
                    </div>
                </form>
            `,
            confirmText: 'Cerrar',
            onConfirm: () => {
                const shifts = Store.get('stockdesk_shifts') || [];
                const idx = shifts.findIndex(s => s.id === id);
                if (idx !== -1) {
                    shifts[idx].closingCash = parseFloat(document.getElementById('shift-closing').value) || 0;
                    shifts[idx].endTime = new Date().toISOString();
                    shifts[idx].status = 'closed';
                    Store.set('stockdesk_shifts', shifts);
                    addAuditLog('Editar', 'Turnos', 'Turno cerrado');
                    Components.toast('Turno cerrado', 'success');
                }
                Router.navigate('users');
            }
        });
    },

    addRegister() {
        Components.modal({
            title: 'Nueva Caja',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="reg-name" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                        <input type="text" id="reg-location" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Crear',
            onConfirm: () => {
                const registers = Store.get('stockdesk_registers') || [];
                registers.push({
                    id: Date.now(),
                    name: document.getElementById('reg-name').value,
                    location: document.getElementById('reg-location').value,
                    status: 'active'
                });
                Store.set('stockdesk_registers', registers);
                Components.toast('Caja creada', 'success');
                Router.navigate('users');
            }
        });
    },

    editRegister(id) {
        const registers = Store.get('stockdesk_registers') || [];
        const reg = registers.find(r => r.id === id);
        if (!reg) return;

        Components.modal({
            title: 'Editar Caja',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="reg-name" value="${reg.name}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                        <input type="text" id="reg-location" value="${reg.location || ''}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Guardar',
            onConfirm: () => {
                const idx = registers.findIndex(r => r.id === id);
                if (idx !== -1) {
                    registers[idx].name = document.getElementById('reg-name').value;
                    registers[idx].location = document.getElementById('reg-location').value;
                    Store.set('stockdesk_registers', registers);
                    Components.toast('Caja actualizada', 'success');
                }
                Router.navigate('users');
            }
        });
    }
};
