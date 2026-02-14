/**
 * Layout Components - Sidebar and Main Layout
 * Stock Desk Application
 */

const LayoutComponents = {
    isMobile: () => window.innerWidth < 769,
    
    sidebar(activeRoute = 'dashboard') {
        const device = Store.device.get();
        const isMobile = device === 'mobile' || device === 'tablet';
        
        // Obtener rol del usuario para filtrar menú
        const user = Store.get(Store.KEYS.USER);
        const role = user?.role || 'guest';
        
        let links = [];

        // --- DEFINICIÓN DE MENÚS POR ROL ---

        // 1. MENÚ COMPLETO (Administradores y Gerentes)
        if (role === 'Administrador' || role === 'Gerente') {
            links = [
                { id: 'dashboard', icon: 'home', label: 'Inicio' },
                { id: 'guide', icon: 'brain', label: 'Guía' },
                { id: 'catalog', icon: 'grid', label: 'Catálogo' },
                { id: 'dashboards', icon: 'chart', label: 'Dashboards' },
                { id: 'products', icon: 'package', label: 'Productos' },
                { id: 'inventory', icon: 'warehouse', label: 'Inventario' },
                { id: 'sales', icon: 'cart', label: 'Ventas' },
                { id: 'suppliers', icon: 'users', label: 'Proveedores' },
                { id: 'finance', icon: 'dollar', label: 'Finanzas' },
                { id: 'reports', icon: 'chart', label: 'Reportes' },
                { id: 'users', icon: 'users', label: 'Usuarios' },
                { id: 'notifications', icon: 'info', label: 'Notificaciones' },
                { id: 'customization', icon: 'star', label: 'Personalización' },
                { id: 'security', icon: 'lock', label: 'Seguridad' },
                { id: 'settings', icon: 'settings', label: 'Ajustes' }
            ];
        } 
        // 2. MENÚ CAJERO (Limitado pero CON Guía)
        else if (role === 'Cajero') {
            links = [
                { id: 'sales', icon: 'cart', label: 'Ventas' },
                { id: 'dashboard', icon: 'home', label: 'Resumen' },
                { id: 'reports', icon: 'chart', label: 'Mis Ventas' },
                { id: 'notifications', icon: 'info', label: 'Avisos' },
                { id: 'guide', icon: 'brain', label: 'Ayuda' } // <--- AQUÍ ESTÁ EL CAMBIO
            ];
        } 
        // 3. OTROS ROLES (Por defecto, siempre con Guía)
        else {
            links = [
                { id: 'sales', icon: 'cart', label: 'Ventas' },
                { id: 'guide', icon: 'brain', label: 'Guía' }, // <--- Visible para cualquiera
                { id: 'notifications', icon: 'info', label: 'Notificaciones' }
            ];
        }

        // --- RENDERIZADO DEL MENÚ ---

        if (isMobile) {
            return `
                <header class="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40 px-4 py-3 flex items-center justify-between">
                    <button onclick="LayoutComponents.toggleMobileMenu()" class="p-2 rounded-lg hover:bg-slate-100">
                        ${Components.icons.menu}
                    </button>
                    <h1 class="text-lg font-bold gradient-text">Stock Desk</h1>
                    <div class="w-10"></div>
                </header>
                <div id="mobile-menu" class="mobile-menu fixed inset-0 z-50 bg-white">
                    <div class="flex items-center justify-between p-4 border-b border-slate-100">
                        <h1 class="text-xl font-bold gradient-text">Stock Desk</h1>
                        <button onclick="LayoutComponents.toggleMobileMenu()" class="p-2 rounded-lg hover:bg-slate-100">
                            ${Components.icons.close}
                        </button>
                    </div>
                    <nav class="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
                        <ul class="space-y-2">
                            ${links.map(link => `
                                <li>
                                    <a href="#" onclick="LayoutComponents.toggleMobileMenu(); Router.navigate('${link.id}'); return false;" 
                                       class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition ${activeRoute === link.id ? 'active' : ''}">
                                        <span class="sidebar-icon">${Components.icons[link.icon]}</span>
                                        <span class="font-medium">${link.label}</span>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </nav>
                    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
                        <button onclick="Router.navigate('landing')" class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition w-full">
                            ${Components.icons.logout}
                            <span class="font-medium">Salir</span>
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <aside class="sidebar-desktop w-16 hover:w-52 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 group z-30 overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center gap-3 min-w-max">
                    <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        ${Components.icons.package.replace('w-5 h-5', 'w-5 h-5 text-white')}
                    </div>
                    <span class="text-lg font-bold gradient-text opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Stock Desk</span>
                </div>
                <nav class="flex-1 p-2 overflow-y-auto">
                    <ul class="space-y-1">
                        ${links.map(link => `
                            <li>
                                <a href="#" onclick="Router.navigate('${link.id}'); return false;" 
                                   class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition ${activeRoute === link.id ? 'active' : ''}" title="${link.label}">
                                    <span class="sidebar-icon flex-shrink-0">${Components.icons[link.icon]}</span>
                                    <span class="font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${link.label}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
                <div class="p-2 border-t border-slate-100">
                    <button onclick="Router.navigate('landing')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition w-full" title="Salir">
                        ${Components.icons.logout}
                        <span class="font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Salir</span>
                    </button>
                </div>
            </aside>
        `;
    },

    layout(content, activeRoute) {
        const device = Store.device.get();
        const isMobile = device === 'mobile' || device === 'tablet';
        
        if (isMobile) {
            return `
                <div class="min-h-screen bg-slate-50">
                    ${this.sidebar(activeRoute)}
                    <main class="pt-16 p-4 bg-slate-50 min-h-screen">
                        ${content}
                    </main>
                </div>
            `;
        }
        
        return `
            <div class="flex min-h-screen">
                ${this.sidebar(activeRoute)}
                <main class="flex-1 ml-16 p-6 bg-slate-50">
                    ${content}
                </main>
            </div>
        `;
    },

    toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (menu) {
            menu.classList.toggle('open');
        }
    }
};
