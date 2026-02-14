/**
 * Security Page - Main Security Module
 * Stock Desk Application
 */

const SecurityPage = {
    activeTab: 'auth',

    tabs: [
        { id: 'auth', label: 'Autenticación', icon: 'lock' },
        { id: 'access', label: 'Acceso', icon: 'users' },
        { id: 'protection', label: 'Protección', icon: 'lock' },
        { id: 'threats', label: 'Amenazas', icon: 'warning' },
        { id: 'backup', label: 'Respaldos', icon: 'database' },
        { id: 'sessions', label: 'Sesiones', icon: 'monitor' },
        { id: 'logs', label: 'Registros', icon: 'fileText' }
    ],

    render() {
        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Seguridad</h1>
                    <p class="text-slate-500 text-sm mt-1">Protege tu información y gestiona accesos</p>
                </div>

                <!-- Security Score -->
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-sm mb-1">Nivel de Seguridad</p>
                            <p class="text-4xl font-bold">${this.getSecurityScore()}%</p>
                            <p class="text-green-100 text-sm mt-2">${this.getSecurityStatus()}</p>
                        </div>
                        <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            ${Components.icons.lock.replace('w-5 h-5', 'w-10 h-10')}
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.tabs.map(tab => `
                        <button onclick="SecurityPage.setTab('${tab.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeTab === tab.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[tab.icon] || Components.icons.lock}
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Tab Content -->
                <div id="security-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'security');
    },

    setTab(tab) {
        this.activeTab = tab;
        Router.navigate('security');
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'auth': return SecurityAuth.render();
            case 'access': return SecurityAccess.render();
            case 'protection': return SecurityProtection.render();
            case 'threats': return SecurityThreats.render();
            case 'backup': return SecurityBackup.render();
            case 'sessions': return SecuritySessions.render();
            case 'logs': return SecurityLogs.render();
            default: return SecurityAuth.render();
        }
    },

    getSecurityScore() {
        const security = Store.security.get();
        let score = 50; // Base score
        if (security.twoFactorEnabled) score += 20;
        if (security.autoBackup) score += 15;
        if (security.encryptionEnabled) score += 15;
        return Math.min(score, 100);
    },

    getSecurityStatus() {
        const score = this.getSecurityScore();
        if (score >= 90) return 'Excelente protección';
        if (score >= 70) return 'Buena protección';
        if (score >= 50) return 'Protección básica';
        return 'Necesita mejoras';
    }
};

Router.register('security', () => SecurityPage.render());
