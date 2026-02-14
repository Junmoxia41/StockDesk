/**
 * Notifications Page - Notifications Module
 * Stock Desk Application
 */

const NotificationsPage = {
    activeTab: 'center',

    tabs: [
        { id: 'center', label: 'Centro', icon: 'info' },
        { id: 'alerts', label: 'Alertas', icon: 'warning' },
        { id: 'channels', label: 'Canales', icon: 'settings' }
    ],

    render() {
        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Notificaciones</h1>
                    <p class="text-slate-500 text-sm mt-1">Gestiona alertas y notificaciones</p>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.tabs.map(tab => `
                        <button onclick="NotificationsPage.setTab('${tab.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeTab === tab.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[tab.icon] || Components.icons.info}
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <div id="notifications-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'notifications');
    },

    setTab(tab) {
        this.activeTab = tab;
        Router.navigate('notifications');
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'center': return NotificationsCenter.render();
            case 'alerts': return NotificationsAlerts.render();
            case 'channels': return this.renderChannels();
            default: return NotificationsCenter.render();
        }
    },

    renderChannels() {
        // Carga segura con valores por defecto
        const defaultChannels = { email: false, sms: false, whatsapp: false, push: true };
        const savedChannels = Store.get('stockdesk_channels') || {};
        const channels = { ...defaultChannels, ...savedChannels };

        return `
            <div class="space-y-4">
                <h3 class="font-semibold text-slate-900">Canales de Notificación</h3>
                
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                ${Components.icons.info}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Email</h4>
                                <p class="text-sm text-slate-500">Recibe notificaciones por correo</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${channels.email ? 'checked' : ''} onchange="NotificationsPage.toggleChannel('email', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    ${channels.email ? '<input type="email" placeholder="correo@ejemplo.com" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 animate-fade-in">' : ''}
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                ${Components.icons.info}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">SMS</h4>
                                <p class="text-sm text-slate-500">Alertas por mensaje de texto</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${channels.sms ? 'checked' : ''} onchange="NotificationsPage.toggleChannel('sms', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                ${Components.icons.info}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">WhatsApp</h4>
                                <p class="text-sm text-slate-500">Notificaciones por WhatsApp</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${channels.whatsapp ? 'checked' : ''} onchange="NotificationsPage.toggleChannel('whatsapp', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                ${Components.icons.info}
                            </div>
                            <div>
                                <h4 class="font-semibold text-slate-900">Push</h4>
                                <p class="text-sm text-slate-500">Notificaciones en el navegador</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${channels.push ? 'checked' : ''} onchange="NotificationsPage.toggleChannel('push', this.checked)" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        `;
    },

    toggleChannel(channel, enabled) {
        // Carga segura, actualiza y guarda
        const defaultChannels = { email: false, sms: false, whatsapp: false, push: true };
        const savedChannels = Store.get('stockdesk_channels') || {};
        const channels = { ...defaultChannels, ...savedChannels };
        
        channels[channel] = enabled;
        Store.set('stockdesk_channels', channels);
        
        Components.toast(`Canal ${enabled ? 'activado' : 'desactivado'}`, 'success');
        
        // Re-renderizar la vista actual para reflejar cambios (ej: mostrar input de email)
        Router.render('notifications');
    }
};

Router.register('notifications', () => NotificationsPage.render());
