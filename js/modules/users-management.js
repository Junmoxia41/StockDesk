/**
 * Users Management Module - Users and Roles
 * Stock Desk Application
 */

const UsersManagement = {
    defaultRoles: [
        { id: 1, name: 'Administrador', permissions: ['all'], color: 'red' },
        { id: 2, name: 'Gerente', permissions: ['products', 'sales', 'reports'], color: 'purple' },
        { id: 3, name: 'Cajero', permissions: ['sales'], color: 'blue' },
        { id: 4, name: 'Inventario', permissions: ['products', 'inventory'], color: 'green' }
    ],

    // Permission definitions for the UI
    availablePermissions: [
        { id: 'all', label: 'Acceso Total (Admin)', group: 'General' },
        { id: 'sales', label: 'Realizar Ventas (POS)', group: 'Ventas' },
        { id: 'sales.discount', label: 'Aplicar Descuentos', group: 'Ventas' },
        { id: 'products', label: 'Ver Productos', group: 'Inventario' },
        { id: 'products.create', label: 'Crear/Editar Productos', group: 'Inventario' },
        { id: 'products.delete', label: 'Eliminar Productos', group: 'Inventario' },
        { id: 'inventory', label: 'Gestión Avanzada (Kardex/Almacenes)', group: 'Inventario' },
        { id: 'reports', label: 'Ver Reportes', group: 'Admin' },
        { id: 'users', label: 'Gestionar Usuarios', group: 'Admin' },
        { id: 'settings', label: 'Configuración Global', group: 'Admin' }
    ],

    renderUsers() {
        const users = Store.get('stockdesk_users') || [
            { id: 1, name: 'Administrador', username: 'admin', role: 'Administrador', status: 'active' }
        ];

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Usuarios del Sistema</h3>
                    <button onclick="UsersManagement.addUser()" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
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
                            <div class="text-sm mb-4">
                                <span class="text-slate-500">Rol:</span>
                                <span class="font-medium text-slate-900 ml-1">${user.role}</span>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="UsersManagement.editUser(${user.id})" class="flex-1 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg">Editar</button>
                                ${user.id !== 1 ? `<button onclick="UsersManagement.toggleStatus(${user.id})" class="px-3 py-2 text-sm ${user.status === 'active' ? 'text-red-500' : 'text-green-500'} hover:bg-slate-100 rounded-lg">${user.status === 'active' ? 'Desactivar' : 'Activar'}</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderRoles() {
        const roles = Store.get('stockdesk_roles') || this.defaultRoles;

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Roles y Permisos</h3>
                    <button onclick="UsersManagement.addRole()" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
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
                                <button onclick="UsersManagement.deleteRole(${role.id})" class="text-slate-400 hover:text-red-500 p-2">
                                    ${Components.icons.trash}
                                </button>
                            </div>
                            <div class="p-5">
                                <p class="text-sm font-medium text-slate-700 mb-3">Permisos:</p>
                                <div class="flex flex-wrap gap-2">
                                    ${role.permissions.includes('all') ? '<span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Acceso Total</span>' : 
                                      role.permissions.slice(0, 5).map(p => `<span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">${this.getPermissionLabel(p)}</span>`).join('')}
                                    ${role.permissions.length > 5 ? `<span class="text-xs text-slate-400">+${role.permissions.length - 5} más</span>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    getPermissionLabel(code) {
        const perm = this.availablePermissions.find(p => p.id === code);
        return perm ? perm.label : code;
    },

    addUser() {
        const roles = Store.get('stockdesk_roles') || this.defaultRoles;
        Components.modal({
            title: 'Nuevo Usuario',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="user-name" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                        <input type="text" id="user-username" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                        <input type="password" id="user-password" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                        <select id="user-role" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            ${roles.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Crear',
            onConfirm: () => {
                const users = Store.get('stockdesk_users') || [];
                users.push({
                    id: Date.now(),
                    name: document.getElementById('user-name').value,
                    username: document.getElementById('user-username').value,
                    role: document.getElementById('user-role').value,
                    status: 'active',
                    createdAt: new Date().toISOString()
                });
                Store.set('stockdesk_users', users);
                // Log action
                if(window.addAuditLog) addAuditLog('Crear', 'Usuarios', 'Usuario creado');
                Components.toast('Usuario creado', 'success');
                Router.navigate('users');
            }
        });
    },

    editUser(id) {
        const users = Store.get('stockdesk_users') || [];
        const user = users.find(u => u.id === id);
        if (!user) return;

        Components.modal({
            title: 'Editar Usuario',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="user-name" value="${user.name}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                        <select id="user-role" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            ${(Store.get('stockdesk_roles') || this.defaultRoles).map(r => `<option value="${r.name}" ${user.role === r.name ? 'selected' : ''}>${r.name}</option>`).join('')}
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Guardar',
            onConfirm: () => {
                const idx = users.findIndex(u => u.id === id);
                if (idx !== -1) {
                    users[idx].name = document.getElementById('user-name').value;
                    users[idx].role = document.getElementById('user-role').value;
                    Store.set('stockdesk_users', users);
                    if(window.addAuditLog) addAuditLog('Editar', 'Usuarios', `Usuario ${users[idx].username} editado`);
                    Components.toast('Usuario actualizado', 'success');
                }
                Router.navigate('users');
            }
        });
    },

    toggleStatus(id) {
        const users = Store.get('stockdesk_users') || [];
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
            users[idx].status = users[idx].status === 'active' ? 'inactive' : 'active';
            Store.set('stockdesk_users', users);
            Components.toast(`Usuario ${users[idx].status === 'active' ? 'activado' : 'desactivado'}`, 'success');
            Router.navigate('users');
        }
    },

    addRole() {
        // Group permissions
        const permsByGroup = {};
        this.availablePermissions.forEach(p => {
            if (!permsByGroup[p.group]) permsByGroup[p.group] = [];
            permsByGroup[p.group].push(p);
        });

        let permsHTML = '';
        Object.keys(permsByGroup).forEach(group => {
            permsHTML += `<div class="mb-3"><p class="text-xs font-bold text-slate-500 uppercase mb-2">${group}</p><div class="space-y-2">`;
            permsByGroup[group].forEach(p => {
                permsHTML += `
                    <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" value="${p.id}" class="perm-check accent-orange-500 w-4 h-4 rounded">
                        ${p.label}
                    </label>
                `;
            });
            permsHTML += `</div></div>`;
        });

        Components.modal({
            title: 'Nuevo Rol Personalizado',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Rol</label>
                        <input type="text" id="role-name" placeholder="Ej: Supervisor" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Color</label>
                            <select id="role-color" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                                <option value="blue">Azul</option>
                                <option value="green">Verde</option>
                                <option value="purple">Púrpura</option>
                                <option value="orange">Naranja</option>
                                <option value="red">Rojo</option>
                            </select>
                        </div>
                    </div>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                        ${permsHTML}
                    </div>
                </form>
            `,
            confirmText: 'Crear Rol',
            onConfirm: () => {
                const name = document.getElementById('role-name').value;
                if (!name) { Components.toast('El nombre es requerido', 'error'); return false; }

                const checkboxes = document.querySelectorAll('.perm-check:checked');
                const permissions = Array.from(checkboxes).map(cb => cb.value);

                const roles = Store.get('stockdesk_roles') || this.defaultRoles;
                roles.push({
                    id: Date.now(),
                    name: name,
                    color: document.getElementById('role-color').value,
                    permissions: permissions
                });
                Store.set('stockdesk_roles', roles);
                Components.toast('Rol creado correctamente', 'success');
                Router.navigate('users');
            }
        });
    },

    deleteRole(id) {
        Components.modal({
            title: 'Eliminar Rol',
            content: '<p>¿Estás seguro? Los usuarios con este rol perderán sus permisos.</p>',
            confirmText: 'Eliminar',
            type: 'danger',
            onConfirm: () => {
                const roles = Store.get('stockdesk_roles') || [];
                const newRoles = roles.filter(r => r.id !== id);
                Store.set('stockdesk_roles', newRoles);
                Components.toast('Rol eliminado', 'success');
                Router.navigate('users');
            }
        });
    }
};
