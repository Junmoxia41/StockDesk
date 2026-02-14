/**
 * Login Page - Complete Rewrite with Admin Registration
 * Flow: Mode Selection -> Auth (Login/Register) -> Dashboard/POS
 */

const LoginPage = {
    state: {
        view: 'selection', // 'selection', 'admin-login', 'admin-register', 'cashier-select'
        selectedCashier: null
    },

    init() {
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-6">
                <div class="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-scale-in">
                    
                    <!-- Left Panel: Context & Visuals -->
                    <div class="md:w-5/12 bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
                        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
                        
                        <div class="relative z-10">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                </div>
                                <span class="text-xl font-bold tracking-tight">Stock Desk</span>
                            </div>
                            <h2 class="text-3xl font-bold leading-tight mb-4">
                                ${this.getLeftTitle()}
                            </h2>
                            <p class="text-slate-400">
                                ${this.getLeftDescription()}
                            </p>
                        </div>

                        <div class="relative z-10 text-xs text-slate-500">
                            System v2026.4 • Secure Access
                        </div>
                    </div>

                    <!-- Right Panel: Interactive Forms -->
                    <div class="md:w-7/12 bg-white p-8 md:p-12 flex flex-col justify-center relative">
                        ${this.renderRightContent()}
                    </div>
                </div>
            </div>
        `;
    },

    getLeftTitle() {
        switch(this.state.view) {
            case 'selection': return 'Bienvenido al Sistema';
            case 'admin-login': return 'Panel de Control';
            case 'admin-register': return 'Nuevo Administrador';
            case 'cashier-select': return 'Terminal de Venta';
            default: return 'Gestión de Negocio';
        }
    },

    getLeftDescription() {
        switch(this.state.view) {
            case 'selection': return 'Selecciona tu perfil de acceso para comenzar a trabajar. El sistema adaptará la interfaz según tus permisos.';
            case 'admin-login': return 'Acceso exclusivo para propietarios y gerentes. Configuración, reportes financieros y gestión de personal.';
            case 'admin-register': return 'Crea una cuenta maestra con control total sobre el inventario, finanzas y seguridad del sistema.';
            case 'cashier-select': return 'Interfaz optimizada para ventas rápidas. Selecciona tu usuario asignado por el administrador.';
            default: return 'Plataforma integral de gestión.';
        }
    },

    renderRightContent() {
        if (this.state.view === 'selection') return this.renderModeSelection();
        if (this.state.view === 'admin-login') return this.renderAdminForm();
        if (this.state.view === 'admin-register') return this.renderAdminRegister();
        if (this.state.view === 'cashier-select') return this.renderCashierList();
        return '';
    },

    // --- VISTA 1: SELECCIÓN DE MODO ---
    renderModeSelection() {
        return `
            <div class="space-y-6 animate-fade-in-up">
                <div class="text-center mb-8">
                    <h3 class="text-2xl font-bold text-slate-900">¿Cómo deseas ingresar?</h3>
                    <p class="text-slate-500">Elige el modo de operación</p>
                </div>

                <button onclick="LoginPage.setView('admin-login')" 
                        class="w-full p-6 bg-white border-2 border-slate-100 hover:border-orange-500 rounded-2xl flex items-center gap-6 transition-all group shadow-sm hover:shadow-xl btn-press text-left">
                    <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Administración</h4>
                        <p class="text-sm text-slate-500 mt-1">Configuración, Inventario, Finanzas y Seguridad.</p>
                    </div>
                </button>

                <button onclick="LoginPage.setView('cashier-select')" 
                        class="w-full p-6 bg-white border-2 border-slate-100 hover:border-blue-500 rounded-2xl flex items-center gap-6 transition-all group shadow-sm hover:shadow-xl btn-press text-left">
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Modo Cajero / Venta</h4>
                        <p class="text-sm text-slate-500 mt-1">Solo para empleados registrados por el Admin.</p>
                    </div>
                </button>
            </div>
        `;
    },

    // --- VISTA 2: LOGIN ADMIN ---
    renderAdminForm() {
        return `
            <div class="animate-fade-in-up">
                <button onclick="LoginPage.setView('selection')" class="mb-6 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver
                </button>

                <h3 class="text-2xl font-bold text-slate-900 mb-6">Acceso Administrativo</h3>

                <form onsubmit="LoginPage.handleAdminLogin(event)" class="space-y-5">
                    <input type="text" name="website_url" style="display:none" autocomplete="off"> <!-- Honeypot -->
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Usuario</label>
                        <input type="text" id="admin-user" class="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition bg-slate-50 focus:bg-white" placeholder="Ej: admin">
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Contraseña</label>
                        <input type="password" id="admin-pass" class="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition bg-slate-50 focus:bg-white" placeholder="••••••••">
                    </div>

                    <button type="submit" class="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition transform hover:scale-[1.02]">
                        Entrar al Sistema
                    </button>
                </form>

                <div class="mt-6 flex items-center justify-between text-sm">
                    <span class="text-slate-400">¿Eres nuevo aquí?</span>
                    <button onclick="LoginPage.setView('admin-register')" class="text-orange-600 font-bold hover:underline">
                        Crear cuenta de Admin
                    </button>
                </div>
                
                <p class="text-center text-xs text-slate-300 mt-8">
                    Credencial por defecto: admin / admin
                </p>
            </div>
        `;
    },

    // --- VISTA 2.5: REGISTRO ADMIN ---
    renderAdminRegister() {
        return `
            <div class="animate-fade-in-up">
                <button onclick="LoginPage.setView('admin-login')" class="mb-4 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver al Login
                </button>

                <h3 class="text-2xl font-bold text-slate-900 mb-2">Nuevo Administrador</h3>
                <p class="text-slate-500 mb-6">Registra una cuenta con privilegios totales.</p>

                <form onsubmit="LoginPage.handleAdminRegister(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                        <input type="text" id="reg-name" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition bg-slate-50" placeholder="Ej: Juan Pérez">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Usuario</label>
                        <input type="text" id="reg-user" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition bg-slate-50" placeholder="Ej: juanp">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
                            <input type="password" id="reg-pass" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition bg-slate-50" placeholder="••••">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Confirmar</label>
                            <input type="password" id="reg-confirm" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition bg-slate-50" placeholder="••••">
                        </div>
                    </div>

                    <button type="submit" class="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-[1.02]">
                        Registrar Administrador
                    </button>
                </form>
            </div>
        `;
    },

    // --- VISTA 3: SELECCIÓN CAJERO (FILTRADA) ---
    renderCashierList() {
        const users = Store.get('stockdesk_users') || [];
        
        // FILTRO CRÍTICO: SOLO CAJEROS/EMPLEADOS (NO ADMINS)
        const cashiers = users.filter(u => u.role !== 'Administrador' && u.role !== 'Gerente');
        
        const hasCashiers = cashiers.length > 0;

        return `
            <div class="animate-fade-in-up h-full flex flex-col">
                <button onclick="LoginPage.setView('selection')" class="mb-4 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver
                </button>

                <h3 class="text-2xl font-bold text-slate-900 mb-2">Selecciona tu Usuario</h3>
                <p class="text-slate-500 mb-6">Inicia tu turno de venta.</p>

                <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[400px]">
                    ${hasCashiers ? cashiers.map(c => `
                        <button onclick="LoginPage.handleCashierLogin('${c.username}')" 
                                class="w-full p-4 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex items-center gap-4 transition group text-left">
                            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                ${c.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">${c.name}</h4>
                                <span class="text-xs px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-500">${c.role}</span>
                            </div>
                        </button>
                    `).join('') : `
                        <div class="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <p class="text-slate-900 font-medium mb-1">No hay cajeros registrados</p>
                            <p class="text-xs text-slate-500 max-w-xs mx-auto">Ingresa como Administrador y ve a la sección "Usuarios" para crear cuentas de empleados.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // --- LOGICA ---

    setView(viewName) {
        this.state.view = viewName;
        this.render();
    },

    handleAdminLogin(e) {
        e.preventDefault();
        const user = document.getElementById('admin-user').value;
        const pass = document.getElementById('admin-pass').value;

        // Admin Backdoor for first run
        if (user === 'admin' && pass === 'admin') {
            this.loginSuccess({ 
                username: 'admin', 
                name: 'Administrador Principal', 
                role: 'Administrador' 
            });
            return;
        }

        const users = Store.get('stockdesk_users') || [];
        const found = users.find(u => u.username === user && (u.password === pass));

        if (found && (found.role === 'Administrador' || found.role === 'Gerente')) {
            this.loginSuccess(found);
        } else {
            Components.toast('Acceso denegado o credenciales incorrectas', 'error');
        }
    },

    handleAdminRegister(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const user = document.getElementById('reg-user').value;
        const pass = document.getElementById('reg-pass').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (pass !== confirm) {
            Components.toast('Las contraseñas no coinciden', 'error');
            return;
        }

        const users = Store.get('stockdesk_users') || [];
        if (users.find(u => u.username === user)) {
            Components.toast('El nombre de usuario ya existe', 'warning');
            return;
        }

        const newAdmin = {
            id: Date.now(),
            name: name,
            username: user,
            password: pass,
            role: 'Administrador',
            status: 'active',
            createdAt: new Date().toISOString()
        };

        users.push(newAdmin);
        Store.set('stockdesk_users', users);
        
        if (Store.security && Store.security.addLog) {
            Store.security.addLog(`Nuevo administrador registrado: ${user}`, 'auth');
        }

        Components.toast('Administrador creado con éxito', 'success');
        this.loginSuccess(newAdmin);
    },

    handleCashierLogin(username) {
        const users = Store.get('stockdesk_users') || [];
        const found = users.find(u => u.username === username);
        if (found) {
            // En un sistema real pediría contraseña aquí también
            this.loginSuccess(found);
        }
    },

    loginSuccess(user) {
        // 1. Guardar Sesión
        Store.set(Store.KEYS.USER, {
            ...user,
            loggedIn: true,
            loginTime: new Date().toISOString()
        });

        // 2. Registrar Log de Seguridad
        if (Store.security && Store.security.addLog) {
            Store.security.addLog(`Inicio de sesión: ${user.username} (${user.role})`, 'auth');
        }

        // 3. Feedback y Redirección
        Components.toast(`Bienvenido, ${user.name}`, 'success');
        
        // Redirigir según rol
        if (user.role === 'Cajero' || user.role === 'Vendedor') {
            Router.navigate('sales');
        } else {
            Router.navigate('dashboard');
        }
    }
};

// Auto-init if called directly by Router
Router.register('login', () => {
    setTimeout(() => LoginPage.init(), 0);
    return '<div id="login-placeholder"></div>';
});
