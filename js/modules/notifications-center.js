/**
 * Notifications Center Module
 * Stock Desk Application
 */

const NotificationsCenter = {
    render() {
        const notifications = Store.get('stockdesk_notifications') || [];
        const unread = notifications.filter(n => !n.read).length;

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <h3 class="font-semibold text-slate-900">Centro de Notificaciones</h3>
                        ${unread > 0 ? `<span class="px-2 py-1 bg-red-500 text-white text-xs rounded-full">${unread} nuevas</span>` : ''}
                    </div>
                    <div class="flex gap-2">
                        ${unread > 0 ? `<button onclick="NotificationsCenter.markAllRead()" class="px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg">Marcar todas leídas</button>` : ''}
                        <button onclick="NotificationsCenter.clearAll()" class="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">Limpiar</button>
                    </div>
                </div>

                ${notifications.length > 0 ? `
                    <div class="space-y-3">
                        ${notifications.slice().reverse().map(n => `
                            <div class="bg-white rounded-xl p-4 shadow-sm border ${n.read ? 'border-slate-100' : 'border-orange-200 bg-orange-50'}">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 rounded-lg flex items-center justify-center ${this.getTypeStyle(n.type)}">
                                        ${this.getTypeIcon(n.type)}
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <h4 class="font-medium text-slate-900">${n.title}</h4>
                                                <p class="text-sm text-slate-600 mt-1">${n.message}</p>
                                            </div>
                                            <span class="text-xs text-slate-400">${this.formatTime(n.date)}</span>
                                        </div>
                                        ${!n.read ? `<button onclick="NotificationsCenter.markRead('${n.id}')" class="text-xs text-orange-600 mt-2">Marcar leída</button>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${Components.icons.info.replace('w-5 h-5', 'w-8 h-8 text-slate-400')}
                        </div>
                        <h4 class="font-semibold text-slate-900 mb-2">No hay notificaciones</h4>
                        <p class="text-slate-500">Las notificaciones aparecerán aquí</p>
                    </div>
                `}

                <div class="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 class="font-semibold text-blue-900 mb-3">Probar Notificaciones</h4>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="NotificationsCenter.sendTest('info')" class="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg">Info</button>
                        <button onclick="NotificationsCenter.sendTest('success')" class="px-3 py-2 bg-green-500 text-white text-sm rounded-lg">Éxito</button>
                        <button onclick="NotificationsCenter.sendTest('warning')" class="px-3 py-2 bg-yellow-500 text-white text-sm rounded-lg">Advertencia</button>
                        <button onclick="NotificationsCenter.sendTest('error')" class="px-3 py-2 bg-red-500 text-white text-sm rounded-lg">Error</button>
                    </div>
                </div>
            </div>
        `;
    },

    getTypeStyle(type) {
        const styles = {
            info: 'bg-blue-100 text-blue-600',
            success: 'bg-green-100 text-green-600',
            warning: 'bg-yellow-100 text-yellow-600',
            error: 'bg-red-100 text-red-600'
        };
        return styles[type] || styles.info;
    },

    getTypeIcon(type) {
        return Components.icons[type === 'error' ? 'close' : type === 'warning' ? 'warning' : type === 'success' ? 'check' : 'info'];
    },

    formatTime(date) {
        const now = new Date();
        const d = new Date(date);
        const diff = now - d;
        if (diff < 60000) return 'Ahora';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
        return d.toLocaleDateString('es');
    },

    markRead(id) {
        const notifications = Store.get('stockdesk_notifications') || [];
        const idx = notifications.findIndex(n => n.id === id);
        if (idx !== -1) {
            notifications[idx].read = true;
            Store.set('stockdesk_notifications', notifications);
            Router.navigate('notifications');
        }
    },

    markAllRead() {
        const notifications = Store.get('stockdesk_notifications') || [];
        notifications.forEach(n => n.read = true);
        Store.set('stockdesk_notifications', notifications);
        Components.toast('Todas marcadas como leídas', 'success');
        Router.navigate('notifications');
    },

    clearAll() {
        Store.set('stockdesk_notifications', []);
        Components.toast('Notificaciones eliminadas', 'success');
        Router.navigate('notifications');
    },

    sendTest(type) {
        const messages = {
            info: { title: 'Información', message: 'Esta es una notificación de prueba.' },
            success: { title: 'Éxito', message: 'Operación completada correctamente.' },
            warning: { title: 'Advertencia', message: 'Productos con stock bajo.' },
            error: { title: 'Error', message: 'Ha ocurrido un error.' }
        };
        this.add(type, messages[type].title, messages[type].message);
        Router.navigate('notifications');
    },

    add(type, title, message) {
        const notifications = Store.get('stockdesk_notifications') || [];
        notifications.push({
            id: Date.now().toString(),
            type, title, message,
            date: new Date().toISOString(),
            read: false
        });
        Store.set('stockdesk_notifications', notifications.slice(-100));
    }
};

function addNotification(type, title, message) {
    NotificationsCenter.add(type, title, message);
}
