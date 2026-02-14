/**
 * Users Roles Module
 * Stock Desk Application
 */

const UsersRoles = {
    defaultRoles: [
        { id: 1, name: 'Administrador', permissions: ['all'], color: 'red' },
        { id: 2, name: 'Gerente', permissions: ['products', 'sales', 'reports', 'users'], color: 'purple' },
        { id: 3, name: 'Cajero', permissions: ['sales', 'products.view'], color: 'blue' },
        { id: 4, name: 'Inventario', permissions: ['products', 'inventory'], color: 'green' }
    ],

    renderUsers() {
        const users = Store.get('stockdesk_users') || [
            { id: 1, name: 'Administrador', username: 'admin', role: 'Administrador', status: 'active', lastLogin: new Date().toISOString() }
        ];

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Usuarios del Sistema</h3>
                    <button onclick="UsersRoles.addUser()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition flex items-center gap-2">
                        ${Components.icons.plus} Nuevo Usuario
                    </button>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${users.map(user => `
                        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                                        ${user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-slate-900">${user.name}</h4>
                                        <p class="text-sm text-slate-500">@${user.username}</p>
                                    </div>
                                </div>
                                <span class="px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}">
                                    ${user.status === 'active' ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Rol:</span>
                                    <span class="font-medium text-slate-900">${user.role}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Último acceso:</span>
                                    <span class="text-slate-700">${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es') : 'Nunca'}</span>
                                </div>
                            </div>
                            <div class="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button onclick="UsersRoles.editUser(${user.id})" 
                                        class="flex-1 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                    Editar
                                </button>
                                ${user.id !== 1 ? `
                                    <button onclick="UsersRoles.toggleUserStatus(${user.id})" 
                                            class="px-3 py-2 text-sm ${user.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} rounded-lg transition">
                                        ${user.status === 'active' ? 'Desactivar' : 'Activar'}
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderRoles() {
        const roles = Store.get('stockdesk_roles') || this.defaultRoles;
        const allPermissions = [
            { id: 'dashboard', name: 'Dashboard' },
            { id: 'products', name: 'Productos' },
            { id: 'products.view', name: 'Ver Productos' },
            { id: 'products.edit', name: 'Editar Productos' },
            { id: 'inventory', name: 'Inventario' },
            { id: 'sales', name: 'Ventas' },
            { id: 'finance', name: 'Finanzas' },
            { id: 'reports', name: 'Reportes' },
            { id: 'users', name: 'Usuarios' },
            { id: 'settings', name: 'Configuración' }
        ];

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Roles y Permisos</h3>
                    <button onclick="UsersRoles.addRole()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition flex items-center gap-2">
                        ${Components.icons.plus} Nuevo Rol
                    </button>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    ${roles.map(role => `
                        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-${role.color}-100 rounded-lg flex items-center justify-center text-${role.color}-600">
                                        ${Components.icons.lock}
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-slate-900">${role.name}</h4>
                                        <p class="text-xs text-slate-500">${role.permissions.length} permisos</p>
                                    </div>
                                </div>
                                ${role.id > 4 ? `
                                    <button onclick="UsersRoles.deleteRole(${role.id})" class="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                        ${Components.icons.trash}
                                    </button>
                                ` : ''}
                            </div>
                            <div class="p-5">
                                <p class="text-sm font-medium text-slate-700 mb-3">Permisos:</p>
                                <div class="flex flex-wrap gap-2">
                                    ${role.permissions.includes('all') ? `
                                        <span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                            Acceso Total
                                        </span>
                                    ` : role.permissions.map(p => `
                                        <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                                            ${allPermissions.find(ap => ap.id === p)?.name || p}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    addUser() {
        const roles = Store.get('stockdesk_roles') || this.defaultRoles;
        Components.modal({
            title: 'Nuevo Usuario',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input type="text" id="user-name" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                        <input type="text" id="user-username" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                        <input type="password" id="user-password" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                        <select id="user-role" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            ${roles.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" id="user-email" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Crear Usuario',
            onConfirm: () => {
                const users = Store.get('stockdesk_users') || [];
                const newUser = {
                    id: Date.now(),
                    name: document.getElementById('user-name').value,
                    username: document.getElementById('user-username').value,
                    role: document.getElementById('user-role').value,
                    email: document.getElementById('user-email').value,
                    status: 'active',
                    createdAt: new Date().toISOString()
                };
                users.push(newUser);
                Store.set('stockdesk_users', users);
                addAuditLog('Crear', 'Usuarios', `Usuario ${newUser.username} creado`);
                Components.toast('Usuario creado', 'success');
                Router.navigate('users');
            }
        });
    },

    editUser(id) {
        const users = Store.get('stockdesk_users') || [];
        const user = users.find(u => u.id === id);
        if (!user) return;

        const roles = Store.get('stockdesk_roles') || this.defaultRoles;
        Components.modal({
            title: 'Editar Usuario',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input type="text" id="user-name" value="${user.name}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                        <select id="user-role" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            ${roles.map(r => `<option value="${r.name}" ${user.role === r.name ? 'selected' : ''}>${r.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" id="user-email" value="${user.email || ''}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                </form>
            `,
            confirmText: 'Guardar',
            onConfirm: () => {
                const idx = users.findIndex(u => u.id === id);
                if (idx !== -1) {
                    users[idx].name = document.getElementById('user-name').value;
                    users[idx].role = document.getElementById('user-role').value;
                    users[idx].email = document.getElementById('user-email').value;
                    Store.set('stockdesk_users', users);
                    addAuditLog('Editar', 'Usuarios', `Usuario ${users[idx].username} editado`);
                    Components.toast('Usuario actualizado', 'success');
                }
                Router.navigate('users');
            }
        });
    },

    toggleUserStatus(id) {
        const users = Store.get('stockdesk_users') || [];
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
            users[idx].status = users[idx].status === 'active' ? 'inactive' : 'active';
            Store.set('stockdesk_users', users);
            addAuditLog('Editar', 'Usuarios', `Usuario ${users[idx].username} ${users[idx].status}`);
            Components.toast(`Usuario ${users[idx].status === 'active' ? 'activado' : 'desactivado'}`, 'success');
            Router.navigate('users');
        }
    },

    addRole() {
        Components.modal({
            title: 'Nuevo Rol',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Rol</label>
                        <input type="text" id="role-name" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Color</label>
                        <select id="role-color" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="blue">Azul</option>
                            <option value="green">Verde</option>
                            <option value="purple">Púrpura</option>
                            <option value="orange">Naranja</option>
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Crear',
            onConfirm: () => {
                const roles = Store.get('stockdesk_roles') || this.defaultRoles;
                roles.push({
                    id: Date.now(),
                    name: document.getElementById('role-name').value,
                    color: document.getElementById('role-color').value,
                    permissions: []
                });
                Store.set('stockdesk_roles', roles);
                Components.toast('Rol creado', 'success');
                Router.navigate('users');
            }
        });
    },

    deleteRole(id) {
        Components.modal({
            title: 'Eliminar Rol',
            content: '<p>¿Estás seguro de eliminar este rol?</p>',
            confirmText: 'Eliminar',
            type: 'danger',
            onConfirm: () => {
                const roles = (Store.get('stockdesk_roles') || []).filter(r => r.id !== id);
                Store.set('stockdesk_roles', roles);
                Components.toast('Rol eliminado', 'success');
                Router.navigate('users');
            }
        });
    }
};
