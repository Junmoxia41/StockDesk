/**
 * Router Module - Client-side Routing
 * Stock Desk Application
 */

const Router = {
    currentRoute: null,
    routes: {},
    
    // Rutas públicas que no requieren verificación de seguridad
    publicRoutes: ['splash', 'landing', 'login', 'device-setup'],

    // Register a route
    register(path, handler) {
        this.routes[path] = handler;
    },

    // Navigate to a route
    navigate(path, params = {}) {
        // --- MIDDLEWARE DE SEGURIDAD (Global y Roles) ---
        if (!this.publicRoutes.includes(path)) {
            const user = Store.get(Store.KEYS.USER);
            
            // 1. Verificar Login
            if (!user || !user.loggedIn) {
                this.navigate('login');
                return;
            }

            // 2. Verificar Permisos de Rol (RBAC)
            const roleName = user.role;
            const allRoles = Store.get('stockdesk_roles') || [
                { name: 'Administrador', permissions: ['all'] },
                { name: 'Cajero', permissions: ['sales'] }
            ];
            
            const userRoleConfig = allRoles.find(r => r.name === roleName);
            const permissions = userRoleConfig ? userRoleConfig.permissions : [];

            // Reglas de acceso basadas en permisos dinámicos
            const routePermissions = {
                'products': ['all', 'products', 'products.view'],
                'inventory': ['all', 'inventory'],
                'settings': ['all', 'settings'],
                'reports': ['all', 'reports'],
                'users': ['all', 'users'],
                'finance': ['all'],
                'sales': ['all', 'sales'] // Casi todos pueden vender
            };

            // Si la ruta requiere permisos y el usuario NO tiene ninguno de los requeridos
            if (routePermissions[path]) {
                const required = routePermissions[path];
                const hasPermission = required.some(req => permissions.includes(req));
                
                if (!hasPermission) {
                    console.warn(`Acceso denegado a ${path}. Permisos insuficientes.`);
                    Components.toast(`⛔ Acceso denegado: Rol ${roleName} sin permisos.`, 'error');
                    
                    // Redirigir a zona segura
                    if (this.currentRoute !== 'sales') {
                        setTimeout(() => this.navigate('sales'), 100);
                    }
                    return;
                }
            }

            // 3. Verificar Seguridad (Horarios, IP) - Solo si pasa lo anterior
            if (typeof SecurityAccess !== 'undefined') {
                const access = SecurityAccess.checkAccess();
                if (!access.allowed) {
                    Components.toast(`🚫 ${access.reason}`, 'error', 4000);
                    if (this.currentRoute !== 'login') setTimeout(() => this.navigate('login'), 100);
                    return;
                }
            }
        }
        // -------------------------------

        if (this.routes[path]) {
            this.currentRoute = path;
            window.history.pushState({ path, params }, '', `#${path}`);
            this.render(path, params);
        } else {
            // Manejo de 404
            console.warn(`Ruta no encontrada: ${path}.`);
            const user = Store.get(Store.KEYS.USER);
            if (user && user.loggedIn) {
                this.navigate('dashboard');
            } else {
                this.navigate('login');
            }
        }
    },

    // Render the current route
    render(path, params = {}) {
        const app = document.getElementById('app');
        if (this.routes[path]) {
            app.innerHTML = '';
            const content = this.routes[path](params);
            if (typeof content === 'string') {
                app.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                app.appendChild(content);
            }
            // Execute after render callbacks
            this.executeAfterRender(path);
        }
    },

    // After render callbacks storage
    afterRenderCallbacks: {},

    // Register after render callback
    onAfterRender(path, callback) {
        this.afterRenderCallbacks[path] = callback;
    },

    // Execute after render
    executeAfterRender(path) {
        if (this.afterRenderCallbacks[path]) {
            setTimeout(() => this.afterRenderCallbacks[path](), 0);
        }
    },

    // Handle browser back/forward
    init() {
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.navigate(e.state.path, e.state.params);
            }
        });

        // Check initial hash
        const hash = window.location.hash.slice(1);
        if (hash && this.routes[hash]) {
            this.navigate(hash);
        }
    },

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }
};
