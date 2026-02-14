/**
 * Security Backup & Sessions Module
 * Stock Desk Application
 */

const SecurityBackup = {
    render() {
        const security = Store.security.get();
        const backups = Store.security.getBackups();

        return `
            <div class="space-y-6">
                <!-- Auto Backup -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            ${Components.icons.database}
                            <h3 class="font-semibold text-slate-900">Copias de Seguridad Automáticas</h3>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${security.autoBackup ? 'checked' : ''} 
                                   onchange="SecurityBackup.toggleAutoBackup(this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    <div class="p-5">
                        <div class="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Frecuencia</label>
                                <select onchange="SecurityBackup.setFrequency(this.value)" 
                                        class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                                    <option value="hourly" ${security.backupFrequency === 'hourly' ? 'selected' : ''}>Cada hora</option>
                                    <option value="daily" ${security.backupFrequency === 'daily' ? 'selected' : ''}>Diario</option>
                                    <option value="weekly" ${security.backupFrequency === 'weekly' ? 'selected' : ''}>Semanal</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Retención</label>
                                <select onchange="SecurityBackup.setRetention(this.value)"
                                        class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                                    <option value="7" ${security.backupRetention === 7 ? 'selected' : ''}>7 días</option>
                                    <option value="30" ${security.backupRetention === 30 ? 'selected' : ''}>30 días</option>
                                    <option value="90" ${security.backupRetention === 90 ? 'selected' : ''}>90 días</option>
                                </select>
                            </div>
                        </div>
                        <button onclick="SecurityBackup.createBackup()" 
                                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition flex items-center gap-2">
                            ${Components.icons.plus} Crear Respaldo Ahora
                        </button>
                    </div>
                </div>

                <!-- Backup List -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100">
                        <h3 class="font-semibold text-slate-900">Respaldos Disponibles</h3>
                    </div>
                    ${backups.length > 0 ? `
                        <div class="divide-y divide-slate-100">
                            ${backups.slice().reverse().map(b => `
                                <div class="px-5 py-4 flex items-center justify-between hover:bg-slate-50">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                            ${Components.icons.database}
                                        </div>
                                        <div>
                                            <p class="font-medium text-slate-900">${b.name}</p>
                                            <p class="text-xs text-slate-500">${new Date(b.date).toLocaleString('es')} • ${b.size}</p>
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="SecurityBackup.restore('${b.id}')" 
                                                class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-600 text-sm font-medium rounded-lg transition">
                                            Restaurar
                                        </button>
                                        <button onclick="SecurityBackup.download('${b.id}')" 
                                                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition">
                                            Descargar
                                        </button>
                                        <button onclick="SecurityBackup.delete('${b.id}')" 
                                                class="px-3 py-1.5 text-red-500 hover:bg-red-50 text-sm font-medium rounded-lg transition">
                                            ${Components.icons.trash}
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="p-8 text-center">
                            ${Components.icons.database.replace('w-5 h-5', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                            <p class="text-slate-500">No hay respaldos disponibles</p>
                        </div>
                    `}
                </div>

                <!-- Import Backup -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <h3 class="font-semibold text-slate-900 mb-4">Importar Respaldo</h3>
                    <div class="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-orange-300 transition cursor-pointer"
                         onclick="document.getElementById('backup-file').click()">
                        <input type="file" id="backup-file" accept=".json" class="hidden" onchange="SecurityBackup.importFile(this)">
                        ${Components.icons.plus.replace('w-5 h-5', 'w-8 h-8 mx-auto text-slate-400 mb-2')}
                        <p class="text-slate-600 font-medium">Arrastra un archivo o haz clic para seleccionar</p>
                        <p class="text-xs text-slate-400 mt-1">Formato JSON</p>
                    </div>
                </div>
            </div>
        `;
    },

    toggleAutoBackup(enabled) {
        Store.security.update({ autoBackup: enabled });
        Store.security.addLog(enabled ? 'Backup automático activado' : 'Backup automático desactivado');
        Components.toast(`Backup automático ${enabled ? 'activado' : 'desactivado'}`, 'success');
    },

    setFrequency(freq) {
        Store.security.update({ backupFrequency: freq });
        Components.toast('Frecuencia actualizada', 'success');
    },

    setRetention(days) {
        Store.security.update({ backupRetention: parseInt(days) });
        Components.toast('Retención actualizada', 'success');
    },

    createBackup() {
        const data = {
            products: Store.products.getAll(),
            sales: Store.sales.getAll(),
            transactions: Store.transactions.getAll(),
            settings: Store.settings.get(),
            warehouses: Store.warehouses.getAll(),
            payroll: Store.payroll.getAll()
        };
        
        const backup = {
            id: Date.now().toString(),
            name: `Backup-${new Date().toISOString().split('T')[0]}`,
            date: new Date().toISOString(),
            size: `${(JSON.stringify(data).length / 1024).toFixed(1)} KB`,
            data: data
        };
        
        Store.security.addBackup(backup);
        Store.security.addLog('Respaldo creado manualmente');
        Components.toast('Respaldo creado correctamente', 'success');
        Router.navigate('security');
    },

    restore(id) {
        Components.modal({
            title: 'Restaurar Respaldo',
            content: '<p class="text-red-600 font-medium">¡Advertencia!</p><p>Esta acción reemplazará todos los datos actuales. ¿Deseas continuar?</p>',
            confirmText: 'Restaurar',
            type: 'danger',
            onConfirm: () => {
                const backup = Store.security.getBackups().find(b => b.id === id);
                if (backup && backup.data) {
                    if (backup.data.products) Store.set(Store.KEYS.PRODUCTS, backup.data.products);
                    if (backup.data.sales) Store.set(Store.KEYS.SALES, backup.data.sales);
                    if (backup.data.transactions) Store.set(Store.KEYS.TRANSACTIONS, backup.data.transactions);
                    if (backup.data.settings) Store.set(Store.KEYS.SETTINGS, backup.data.settings);
                    Store.security.addLog(`Respaldo ${backup.name} restaurado`);
                    Components.toast('Datos restaurados correctamente', 'success');
                    Router.navigate('security');
                }
            }
        });
    },

    download(id) {
        const backup = Store.security.getBackups().find(b => b.id === id);
        if (backup) {
            const blob = new Blob([JSON.stringify(backup.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${backup.name}.json`;
            a.click();
            URL.revokeObjectURL(url);
            Components.toast('Descarga iniciada', 'success');
        }
    },

    delete(id) {
        Components.modal({
            title: 'Eliminar Respaldo',
            content: '<p>¿Estás seguro de eliminar este respaldo?</p>',
            confirmText: 'Eliminar',
            type: 'danger',
            onConfirm: () => {
                Store.security.deleteBackup(id);
                Components.toast('Respaldo eliminado', 'success');
                Router.navigate('security');
            }
        });
    },

    importFile(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const backup = {
                    id: Date.now().toString(),
                    name: `Importado-${file.name}`,
                    date: new Date().toISOString(),
                    size: `${(file.size / 1024).toFixed(1)} KB`,
                    data: data
                };
                Store.security.addBackup(backup);
                Store.security.addLog('Respaldo importado');
                Components.toast('Respaldo importado correctamente', 'success');
                Router.navigate('security');
            } catch (err) {
                Components.toast('Error: archivo inválido', 'error');
            }
        };
        reader.readAsText(file);
    }
};

const SecuritySessions = {
    render() {
        const sessions = Store.security.getSessions();
        const currentSession = sessions[0] || { device: 'Este dispositivo', ip: '192.168.1.1', lastActive: new Date().toISOString() };

        return `
            <div class="space-y-6">
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-semibold text-slate-900">Sesiones Activas</h3>
                        <button onclick="SecuritySessions.closeAll()" 
                                class="text-sm text-red-500 hover:text-red-600">
                            Cerrar todas excepto esta
                        </button>
                    </div>
                    <div class="divide-y divide-slate-100">
                        <!-- Current Session -->
                        <div class="px-5 py-4 flex items-center justify-between bg-green-50">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                    ${Components.icons.monitor}
                                </div>
                                <div>
                                    <p class="font-medium text-slate-900 flex items-center gap-2">
                                        ${Store.device.get() || 'Desktop'}
                                        <span class="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Actual</span>
                                    </p>
                                    <p class="text-xs text-slate-500">IP: ${currentSession.ip} • Activo ahora</p>
                                </div>
                            </div>
                        </div>
                        
                        ${sessions.slice(1).map(s => `
                            <div class="px-5 py-4 flex items-center justify-between hover:bg-slate-50">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                        ${Components.icons.monitor}
                                    </div>
                                    <div>
                                        <p class="font-medium text-slate-900">${s.device}</p>
                                        <p class="text-xs text-slate-500">IP: ${s.ip} • Último acceso: ${new Date(s.lastActive).toLocaleString('es')}</p>
                                    </div>
                                </div>
                                <button onclick="SecuritySessions.close('${s.id}')" 
                                        class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium rounded-lg transition">
                                    Cerrar
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Session Timeout -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <h3 class="font-semibold text-slate-900 mb-4">Tiempo de Inactividad</h3>
                    <p class="text-sm text-slate-600 mb-4">Cerrar sesión automáticamente después de:</p>
                    <select onchange="SecuritySessions.setTimeout(this.value)" 
                            class="px-4 py-2.5 rounded-lg border border-slate-200">
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                        <option value="60" selected>1 hora</option>
                        <option value="480">8 horas</option>
                        <option value="0">Nunca</option>
                    </select>
                </div>
            </div>
        `;
    },

    close(id) {
        Store.security.removeSession(id);
        Store.security.addLog('Sesión cerrada remotamente');
        Components.toast('Sesión cerrada', 'success');
        Router.navigate('security');
    },

    closeAll() {
        Store.security.closeAllSessions();
        Store.security.addLog('Todas las sesiones cerradas');
        Components.toast('Sesiones cerradas', 'success');
        Router.navigate('security');
    },

    setTimeout(mins) {
        Store.security.update({ sessionTimeout: parseInt(mins) });
        Components.toast('Tiempo de inactividad actualizado', 'success');
    }
};
