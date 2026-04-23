/**
 * Router Module - Client-side Routing
 * Stock Desk Application
 */
const Router = {
  currentRoute: null,
  routes: {},

  publicRoutes: ['splash', 'landing', 'login', 'device-setup'],
  redirectAttempts: 0,

  register(path, handler) {
    this.routes[path] = handler;
  },

  // Expande permisos “viejos” para no romper roles existentes
  expandPermissions(perms = []) {
    const set = new Set(perms);

    // Compatibilidad: "products" implica CRUD
    if (set.has('products')) {
      set.add('products.view');
      set.add('products.create');
      set.add('products.edit');
      set.add('products.delete');
    }

    // Compatibilidad: "sales" implica descuentos
    if (set.has('sales')) {
      set.add('sales.discount');
    }

    return Array.from(set);
  },

  hasAnyPermission(userPerms, required) {
    if (!required || required.length === 0) return true;
    const perms = this.expandPermissions(userPerms || []);
    if (perms.includes('all')) return true;
    return required.some(r => perms.includes(r));
  },

  navigate(path, params = {}, options = { push: true }) {
    // --- MIDDLEWARE DE SEGURIDAD (Global y Roles) ---
    if (!this.publicRoutes.includes(path)) {
      const user = Store.get(Store.KEYS.USER);

      // 1) Login
      if (!user || !user.loggedIn) {
        this.navigate('login', {}, { push: options.push });
        return;
      }

      // 2) RBAC
      const roleName = user.role;
      let allRoles = Store.get(Store.KEYS.ROLES);

      if (!allRoles || allRoles.length === 0) {
        // Defaults de emergencia
        allRoles = [
          { name: 'Administrador', permissions: ['all'] },
          { name: 'Gerente', permissions: ['products', 'sales', 'reports', 'users', 'settings'] },
          { name: 'Cajero', permissions: ['sales', 'reports'] }
        ];
      }

      const role = allRoles.find(r => r.name === roleName);
      const permissions = role?.permissions || [];

      // Permisos por ruta (fino)
      const routePermissions = {
        dashboard: ['sales', 'reports', 'products.view', 'inventory', 'finance'],
        products: ['products.view', 'products'],
        inventory: ['inventory'],
        sales: ['sales'],
        reports: ['reports', 'sales'],
        finance: ['finance'],
        users: ['users'],
        settings: ['settings'],
        customization: ['settings'],
        security: ['security'],
        suppliers: ['suppliers'],
        notifications: ['notifications'],
        dashboards: ['reports', 'sales', 'finance', 'inventory'],
        guide: [] // guía para todos los logueados
      };

      if (routePermissions[path]) {
        const required = routePermissions[path];
        const ok = this.hasAnyPermission(permissions, required);

        if (!ok) {
          if (this.redirectAttempts < 1) {
            this.redirectAttempts++;
            Components.toast(`Acceso denegado: Rol ${roleName} sin permisos para "${path}".`, 'error', 4000);
            const safeRoute = (path !== 'sales') ? 'sales' : 'dashboard';
            setTimeout(() => this.navigate(safeRoute, {}, { push: true }), 100);
          }
          return;
        }
      }

      this.redirectAttempts = 0;

      // 3) Seguridad de acceso (horario/IP) - si está presente
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
      if (user && user.loggedIn) this.navigate('dashboard', {}, { push: options.push });
      else this.navigate('login', {}, { push: options.push });
    }
  },

  render(path, params = {}) {
    const app = document.getElementById('app');
    if (!this.routes[path]) return;

    app.innerHTML = '';
    const content = this.routes[path](params);

    if (typeof content === 'string') app.innerHTML = content;
    else if (content instanceof HTMLElement) app.appendChild(content);

    this.executeAfterRender(path);
  },

  afterRenderCallbacks: {},
  onAfterRender(path, callback) {
    this.afterRenderCallbacks[path] = callback;
  },
  executeAfterRender(path) {
    if (this.afterRenderCallbacks[path]) setTimeout(() => this.afterRenderCallbacks[path](), 0);
  },

  init() {
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.path) {
        this.navigate(e.state.path, e.state.params, { push: false });
      }
    });

    const hash = window.location.hash.slice(1);
    if (hash && this.routes[hash]) this.navigate(hash, {}, { push: true });
  },

  getCurrentRoute() {
    return this.currentRoute;
  }
};
