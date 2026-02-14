/**
 * Users Page - Multi-User Management Module
 * Stock Desk Application
 */

const UsersPage = {
    activeTab: 'users',

    tabs: [
        { id: 'users', label: 'Usuarios', icon: 'users' },
        { id: 'roles', label: 'Roles', icon: 'lock' },
        { id: 'shifts', label: 'Turnos', icon: 'clock' },
        { id: 'registers', label: 'Cajas', icon: 'box' },
        { id: 'audit', label: 'Auditoría', icon: 'fileText' }
    ],

    render() {
        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
                    <p class="text-slate-500 text-sm mt-1">Administra usuarios, roles y permisos</p>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.tabs.map(tab => `
                        <button onclick="UsersPage.setTab('${tab.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeTab === tab.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[tab.icon] || Components.icons.users}
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <div id="users-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'users');
    },

    setTab(tab) {
        this.activeTab = tab;
        Router.navigate('users');
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'users': return UsersManagement.renderUsers();
            case 'roles': return UsersManagement.renderRoles();
            case 'shifts': return UsersShifts.renderShifts();
            case 'registers': return UsersShifts.renderRegisters();
            case 'audit': return this.renderAudit();
            default: return UsersManagement.renderUsers();
        }
    },

    renderAudit() {
        const logs = Store.get('stockdesk_audit_logs') || [];
        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Registro de Auditoría</h3>
                    <button onclick="UsersPage.exportAudit()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center gap-2">
                        ${Components.icons.clipboard} Exportar
                    </button>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    ${logs.length > 0 ? `
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50">
                                    <tr class="text-left text-sm text-slate-600">
                                        <th class="px-4 py-3 font-semibold">Fecha</th>
                                        <th class="px-4 py-3 font-semibold">Usuario</th>
                                        <th class="px-4 py-3 font-semibold">Acción</th>
                                        <th class="px-4 py-3 font-semibold">Módulo</th>
                                        <th class="px-4 py-3 font-semibold">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${logs.slice().reverse().slice(0, 50).map(log => `
                                        <tr class="table-row-hover">
                                            <td class="px-4 py-3 text-sm">${new Date(log.date).toLocaleString('es')}</td>
                                            <td class="px-4 py-3 text-sm font-medium">${log.user}</td>
                                            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">${log.action}</span></td>
                                            <td class="px-4 py-3 text-sm">${log.module}</td>
                                            <td class="px-4 py-3 text-sm text-slate-500">${log.details || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<div class="p-8 text-center text-slate-400">No hay registros de auditoría</div>'}
                </div>
            </div>
        `;
    },

    exportAudit() {
        const logs = Store.get('stockdesk_audit_logs') || [];
        const csv = 'Fecha,Usuario,Acción,Módulo,Detalles\n' + logs.map(l => `"${l.date}","${l.user}","${l.action}","${l.module}","${l.details || ''}"`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auditoria-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        Components.toast('Auditoría exportada', 'success');
    }
};

function addAuditLog(action, module, details = '') {
    const logs = Store.get('stockdesk_audit_logs') || [];
    const user = Store.get(Store.KEYS.USER)?.username || 'Sistema';
    logs.push({ id: Date.now(), date: new Date().toISOString(), user, action, module, details });
    Store.set('stockdesk_audit_logs', logs.slice(-500));
}

Router.register('users', () => UsersPage.render());
