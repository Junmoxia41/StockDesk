/**
 * Security Logs Module
 * Stock Desk Application
 */

const SecurityLogs = {
    filterType: 'all',

    render() {
        let logs = Store.security.getLogs();
        if (this.filterType !== 'all') {
            logs = logs.filter(l => l.type === this.filterType);
        }

        return `
            <div class="space-y-4">
                <!-- Filters -->
                <div class="flex flex-wrap gap-3 items-center">
                    <select onchange="SecurityLogs.setFilter(this.value)" 
                            class="px-4 py-2 rounded-lg border border-slate-200 text-sm">
                        <option value="all" ${this.filterType === 'all' ? 'selected' : ''}>Todos los eventos</option>
                        <option value="auth" ${this.filterType === 'auth' ? 'selected' : ''}>Autenticación</option>
                        <option value="data" ${this.filterType === 'data' ? 'selected' : ''}>Datos</option>
                        <option value="config" ${this.filterType === 'config' ? 'selected' : ''}>Configuración</option>
                    </select>
                    <button onclick="SecurityLogs.export()" 
                            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center gap-2">
                        ${Components.icons.clipboard} Exportar
                    </button>
                    <button onclick="SecurityLogs.clear()" 
                            class="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm">
                        Limpiar registros
                    </button>
                </div>

                <!-- Logs Table -->
                ${logs.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50">
                                    <tr class="text-left text-sm text-slate-600">
                                        <th class="px-4 py-3 font-semibold">Fecha/Hora</th>
                                        <th class="px-4 py-3 font-semibold">Evento</th>
                                        <th class="px-4 py-3 font-semibold">Tipo</th>
                                        <th class="px-4 py-3 font-semibold">IP</th>
                                        <th class="px-4 py-3 font-semibold">Dispositivo</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${logs.slice().reverse().slice(0, 50).map(log => `
                                        <tr class="table-row-hover">
                                            <td class="px-4 py-3 text-sm text-slate-600">
                                                ${new Date(log.date).toLocaleString('es')}
                                            </td>
                                            <td class="px-4 py-3 text-sm font-medium text-slate-900">
                                                ${log.event}
                                            </td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs rounded-full ${this.getTypeColor(log.type)}">
                                                    ${log.type || 'general'}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3 text-sm text-slate-500 font-mono">
                                                ${log.ip || '192.168.1.1'}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-slate-500">
                                                ${log.device || Store.device.get() || 'Desktop'}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-8 text-center">
                        ${Components.icons.fileText.replace('w-5 h-5', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                        <p class="text-slate-500">No hay registros de seguridad</p>
                    </div>
                `}

                <!-- Security Tips -->
                <div class="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        ${Components.icons.info} Recomendaciones de Seguridad
                    </h4>
                    <ul class="space-y-2 text-sm text-blue-800">
                        <li class="flex items-start gap-2">
                            ${Components.icons.check.replace('w-5 h-5', 'w-4 h-4 mt-0.5 flex-shrink-0')}
                            <span>Revisa regularmente los registros de actividad</span>
                        </li>
                        <li class="flex items-start gap-2">
                            ${Components.icons.check.replace('w-5 h-5', 'w-4 h-4 mt-0.5 flex-shrink-0')}
                            <span>Mantén activado el 2FA para mayor protección</span>
                        </li>
                        <li class="flex items-start gap-2">
                            ${Components.icons.check.replace('w-5 h-5', 'w-4 h-4 mt-0.5 flex-shrink-0')}
                            <span>Realiza respaldos automáticos de tus datos</span>
                        </li>
                        <li class="flex items-start gap-2">
                            ${Components.icons.check.replace('w-5 h-5', 'w-4 h-4 mt-0.5 flex-shrink-0')}
                            <span>Cierra sesiones inactivas en otros dispositivos</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    },

    getTypeColor(type) {
        const colors = {
            auth: 'bg-purple-100 text-purple-600',
            data: 'bg-blue-100 text-blue-600',
            config: 'bg-orange-100 text-orange-600',
            security: 'bg-red-100 text-red-600'
        };
        return colors[type] || 'bg-slate-100 text-slate-600';
    },

    setFilter(type) {
        this.filterType = type;
        Router.navigate('security');
    },

    export() {
        const logs = Store.security.getLogs();
        const csv = 'Fecha,Evento,Tipo,IP,Dispositivo\n' + 
            logs.map(l => `"${l.date}","${l.event}","${l.type || 'general'}","${l.ip || ''}","${l.device || ''}"`).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        Components.toast('Registros exportados', 'success');
    },

    clear() {
        Components.modal({
            title: 'Limpiar Registros',
            content: '<p>¿Estás seguro de eliminar todos los registros de seguridad?</p>',
            confirmText: 'Limpiar',
            type: 'danger',
            onConfirm: () => {
                Store.security.clearLogs();
                Components.toast('Registros eliminados', 'success');
                Router.navigate('security');
            }
        });
    }
};
