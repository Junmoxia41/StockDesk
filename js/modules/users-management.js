/**
 * Users Management Module - Users and Roles (RBAC)
 * Stock Desk Application
 */
const UsersManagement = {
  defaultRoles: [
    { id: 1, name: 'Administrador', permissions: ['all'], color: 'red' },
    { id: 2, name: 'Gerente', permissions: ['products', 'inventory', 'sales', 'sales.discount', 'reports', 'users', 'settings', 'finance', 'security', 'suppliers', 'notifications', 'dashboards'], color: 'purple' },
    { id: 3, name: 'Cajero', permissions: ['sales', 'reports', 'notifications'], color: 'blue' },
    { id: 4, name: 'Inventario', permissions: ['products.view', 'products.edit', 'inventory', 'reports'], color: 'green' }
  ],

  availablePermissions: [
    { id: 'sales', label: 'Ventas (POS)', group: 'Ventas' },
    { id: 'sales.discount', label: 'Aplicar descuentos', group: 'Ventas' },
    { id: 'reports', label: 'Ver reportes', group: 'Reportes' },

    { id: 'products.view', label: 'Ver productos', group: 'Inventario' },
    { id: 'products.create', label: 'Crear productos', group: 'Inventario' },
    { id: 'products.edit', label: 'Editar productos', group: 'Inventario' },
    { id: 'products.delete', label: 'Eliminar productos', group: 'Inventario' },
    { id: 'inventory', label: 'Inventario avanzado (kardex/almacenes)', group: 'Inventario' },

    { id: 'suppliers', label: 'Proveedores', group: 'Compras' },

    { id: 'finance', label: 'Finanzas', group: 'Finanzas' },

    { id: 'users', label: 'Gestionar usuarios/roles', group: 'Administración' },
    { id: 'settings', label: 'Ajustes/Personalización', group: 'Administración' },
    { id: 'security', label: 'Seguridad', group: 'Administración' },
    { id: 'notifications', label: 'Notificaciones', group: 'Administración' },
    { id: 'dashboards', label: 'Dashboards', group: 'Administración' },

    { id: 'all', label: 'Acceso total (Admin)', group: 'General' }
  ],

  _getRoles() {
    return Store.get(Store.KEYS.ROLES) || this.defaultRoles;
  },

  _saveRoles(roles) {
    Store.set(Store.KEYS.ROLES, roles);
  },

  _getUsers() {
    return Store.get(Store.KEYS.USERS) || [
      { id: 1, name: 'Administrador', username: 'admin', role: 'Administrador', status: 'active' }
    ];
  },

  _saveUsers(users) {
    Store.set(Store.KEYS.USERS, users);
  },

  getPermissionLabel(code) {
    const perm = this.availablePermissions.find(p => p.id === code);
    return perm ? perm.label : code;
  },

  renderUsers() {
    const users = this._getUsers();
    const roles = this._getRoles();

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
          ${user.username !== 'admin' ? `
            <button onclick="UsersManagement.toggleStatus(${user.id})"
              class="px-3 py-2 text-sm ${user.status === 'active' ? 'text-red-500' : 'text-green-500'} hover:bg-slate-100 rounded-lg">
              ${user.status === 'active' ? 'Desactivar' : 'Activar'}
            </button>
          ` : ''}
        </div>

        ${!user.password ? `<p class="text-xs text-orange-600 mt-3">Este usuario no tiene contraseña configurada.</p>` : ''}
      </div>
    `).join('')}
  </div>
</div>
`;
  },

  renderRoles() {
    const roles = this._getRoles();

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

          ${role.id > 4 ? `
            <button onclick="UsersManagement.deleteRole(${role.id})" class="text-slate-400 hover:text-red-500 p-2">
              ${Components.icons.trash}
            </button>
          ` : ''}
        </div>

        <div class="p-5">
          <p class="text-sm font-medium text-slate-700 mb-3">Permisos:</p>
          <div class="flex flex-wrap gap-2">
            ${role.permissions.includes('all')
              ? '<span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Acceso Total</span>'
              : (role.permissions.length ? role.permissions.map(p => `
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">${this.getPermissionLabel(p)}</span>
              `).join('') : '<span class="text-xs text-slate-400">Sin permisos</span>')
            }
          </div>
        </div>
      </div>
    `).join('')}
  </div>
</div>
`;
  },

  async addUser() {
    const roles = this._getRoles();

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
    <p class="text-xs text-slate-500 mt-1">Se guardará en formato hasheado (cliente).</p>
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
      onConfirm: async () => {
        const name = document.getElementById('user-name').value.trim();
        const username = document.getElementById('user-username').value.trim();
        const pass = document.getElementById('user-password').value;

        if (!name || !username || !pass) {
          Components.toast('Completa nombre, usuario y contraseña', 'warning');
          return false;
        }

        const users = this._getUsers();
        if (users.find(u => u.username === username)) {
          Components.toast('El usuario ya existe', 'error');
          return false;
        }

        const hash = await AuthUtils.hashPassword(pass);

        users.push({
          id: Date.now(),
          name,
          username,
          password: hash,
          role: document.getElementById('user-role').value,
          status: 'active',
          createdAt: new Date().toISOString()
        });

        this._saveUsers(users);

        if (window.addAuditLog) addAuditLog('Crear', 'Usuarios', `Usuario ${username} creado`);
        Components.toast('Usuario creado', 'success');
        Router.navigate('users', {}, { push: false });
        return true;
      }
    });
  },

  editUser(id) {
    const users = this._getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return;

    const roles = this._getRoles();

    Components.modal({
      title: 'Editar Usuario',
      content: `
<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
    <input type="text" id="edit-name" value="${user.name}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
  </div>

  <div>
    <label class="block text-sm font-medium text-slate-700 mb-1">Rol</label>
    <select id="edit-role" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
      ${roles.map(r => `<option value="${r.name}" ${user.role === r.name ? 'selected' : ''}>${r.name}</option>`).join('')}
    </select>
  </div>

  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
    <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
      <input type="checkbox" id="change-pass-toggle" class="accent-orange-500 w-4 h-4">
      Cambiar contraseña
    </label>
    <div id="change-pass-area" class="hidden mt-3 space-y-2">
      <input type="password" id="edit-pass" placeholder="Nueva contraseña" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
      <input type="password" id="edit-pass2" placeholder="Confirmar" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
    </div>
    <script>
      setTimeout(() => {
        const t = document.getElementById('change-pass-toggle');
        const a = document.getElementById('change-pass-area');
        if (t && a) t.addEventListener('change', () => a.classList.toggle('hidden', !t.checked));
      }, 0);
    </script>
  </div>
</form>
`,
      confirmText: 'Guardar',
      onConfirm: async () => {
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return false;

        const newName = document.getElementById('edit-name').value.trim();
        const newRole = document.getElementById('edit-role').value;

        if (!newName) {
          Components.toast('Nombre requerido', 'warning');
          return false;
        }

        users[idx].name = newName;
        users[idx].role = newRole;

        const changePass = document.getElementById('change-pass-toggle')?.checked;
        if (changePass) {
          const p1 = document.getElementById('edit-pass').value;
          const p2 = document.getElementById('edit-pass2').value;
          if (!p1 || p1 !== p2) {
            Components.toast('Contraseñas no coinciden', 'error');
            return false;
          }
          users[idx].password = await AuthUtils.hashPassword(p1);
        }

        this._saveUsers(users);

        if (window.addAuditLog) addAuditLog('Editar', 'Usuarios', `Usuario ${users[idx].username} editado`);
        Components.toast('Usuario actualizado', 'success');
        Router.navigate('users', {}, { push: false });
        return true;
      }
    });
  },

  toggleStatus(id) {
    const users = this._getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return;

    users[idx].status = users[idx].status === 'active' ? 'inactive' : 'active';
    this._saveUsers(users);

    if (window.addAuditLog) addAuditLog('Editar', 'Usuarios', `Usuario ${users[idx].username} ${users[idx].status}`);
    Components.toast(`Usuario ${users[idx].status === 'active' ? 'activado' : 'desactivado'}`, 'success');
    Router.navigate('users', {}, { push: false });
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
  <div>
    <label class="block text-sm font-medium text-slate-700 mb-1">Color</label>
    <select id="role-color" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
      <option value="blue">Azul</option>
      <option value="green">Verde</option>
      <option value="purple">Púrpura</option>
      <option value="orange">Naranja</option>
      <option value="red">Rojo</option>
      <option value="teal">Turquesa</option>
    </select>
  </div>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
    ${permsHTML}
  </div>
</form>
`,
      confirmText: 'Crear Rol',
      onConfirm: () => {
        const name = document.getElementById('role-name').value.trim();
        if (!name) { Components.toast('El nombre es requerido', 'error'); return false; }

        const checkboxes = document.querySelectorAll('.perm-check:checked');
        const permissions = Array.from(checkboxes).map(cb => cb.value);

        const roles = this._getRoles();
        roles.push({
          id: Date.now(),
          name,
          color: document.getElementById('role-color').value,
          permissions
        });

        this._saveRoles(roles);
        Components.toast('Rol creado correctamente', 'success');
        Router.navigate('users', {}, { push: false });
        return true;
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
        const roles = this._getRoles().filter(r => r.id !== id);
        this._saveRoles(roles);
        Components.toast('Rol eliminado', 'success');
        Router.navigate('users', {}, { push: false });
        return true;
      }
    });
  }
};
