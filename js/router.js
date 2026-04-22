/**
 * Router Module - Client-side Routing
 * Stock Desk Application
 */
const Router = {
  currentRoute: null,
  routes: {},

  // Rutas públicas que no requieren verificación de seguridad
  publicRoutes: ['splash', 'landing', 'login', 'device-setup'],

  // Variable para evitar bucles de redirección
  redirectAttempts: 0,

  // Register a route
  register(path, handler) {
    this.routes[path] = handler;
  },

  // Navigate to a route
  // options.push = false evita pushState (necesario para popstate/back)
  navigate(path, params = {}, options = { push: true }) {
    // --- MIDDLEWARE DE SEGURIDAD (Global y Roles) ---
    if (!this.publicRoutes.includes(path)) {
      const user = Store.get(Store.KEYS.USER);

      // 1. Verificar Login
      if (!user || !user.loggedIn) {
        this.navigate('login', {}, { push: options.push });
        return;
      }

      // 2. Verificar Permisos de Rol (RBAC)
      const roleName = user.role;

      // CORRECCIÓN: Obtener roles y validar si está vacío
      let allRoles = Store.get('stockdesk_roles');

      // Si es null, undefined o array vacío, usar defaults
      if (!allRoles || allRoles.length === 0) {
        allRoles = [
          { name: 'Administrador', permissions: ['all'] },
          { name: 'Gerente', permissions: ['products', 'sales', 'reports', 'users'] },
          // CORRECCIÓN: Añadimos 'reports' al cajero por defecto también
          { name: 'Cajero', permissions: ['sales', 'reports'] }
        ];
      }

      const userRoleConfig = allRoles.find(r => r.name === roleName);
      const permissions = userRoleConfig ? userRoleConfig.permissions : [];

      // Reglas de acceso
      const routePermissions = {
        'products': ['all', 'products', 'products.view'],
        'inventory': ['all', 'inventory'],
        'settings': ['all', 'settings'],
        // CORRECCIÓN: Añadimos 'sales' para que el cajero pueda ver 'reports'
        'reports': ['all', 'reports', 'sales'],
        'users': ['all', 'users'],
        'finance': ['all'],
        'sales': ['all', 'sales'],
        'security': ['all'],
        'customization': ['all'],
        'suppliers': ['all'],
        'dashboards': ['all'],
        'catalog': ['all'],
        'guide': ['all', 'sales', 'reports', 'products', 'inventory', 'users', 'settings'] // guía visible a casi todos
      };

      // Si la ruta requiere permisos
      if (routePermissions[path]) {
        const required = routePermissions[path];
        const hasPermission = required.some(req => permissions.includes(req));

        if (!hasPermission) {
          console.warn(`Acceso denegado a ${path}. Permisos insuficientes.`);

          // CORRECCIÓN: Limitar intentos para evitar bucle infinito
          if (this.redirectAttempts < 1) {
            this.redirectAttempts++;
            Components.toast(
              ` Acceso denegado: Rol ${roleName} sin permisos para esta sección.`,
              'error',
              4000
            );

            // Redirigir a zona segura
            const safeRoute = (path !== 'sales') ? 'sales' : 'dashboard';
            setTimeout(() => this.navigate(safeRoute, {}, { push: true }), 100);
          }
          return;
        }
      }

      // Resetear contador de intentos si el acceso fue exitoso
      this.redirectAttempts = 0;

      // 3. Verificar Seguridad (Horarios, IP)
      if (typeof SecurityAccess !== 'undefined') {
        const access = SecurityAccess.checkAccess();
        if (!access.allowed) {
          Components.toast(` ${access.reason}`, 'error', 4000);
          if (this.currentRoute !== 'login') setTimeout(() => this.navigate('login', {}, { push: true }), 100);
          return;
        }
      }
    }
    // -------------------------------

    if (this.routes[path]) {
      this.currentRoute = path;

      if (options.push) {
        window.history.pushState({ path, params }, '', `#${path}`);
      }

      this.render(path, params);
    } else {
      console.warn(`Ruta no encontrada: ${path}.`);
      const user = Store.get(Store.KEYS.USER);
      if (user && user.loggedIn) {
        this.navigate('dashboard', {}, { push: options.push });
      } else {
        this.navigate('login', {}, { push: options.push });
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

      this.executeAfterRender(path);
    }
  },

  afterRenderCallbacks: {},
  onAfterRender(path, callback) {
    this.afterRenderCallbacks[path] = callback;
  },
  executeAfterRender(path) {
    if (this.afterRenderCallbacks[path]) {
      setTimeout(() => this.afterRenderCallbacks[path](), 0);
    }
  },

  init() {
    // FIX: No usar navigate() con pushState dentro del popstate (duplica historial)
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.path) {
        this.navigate(e.state.path, e.state.params, { push: false });
      }
    });

    const hash = window.location.hash.slice(1);
    if (hash && this.routes[hash]) {
      this.navigate(hash, {}, { push: true });
    }
  },

  getCurrentRoute() {
    return this.currentRoute;
  }
};
