/**
 * Products Page - Inventory Management
 * Stock Desk Application
 */
const ProductsPage = {
  searchQuery: '',

  _getPermissions() {
    const user = Store.get(Store.KEYS.USER);
    if (!user?.role) return [];

    let roles = Store.get(Store.KEYS.ROLES);
    if (!roles || roles.length === 0) {
      roles = [
        { name: 'Administrador', permissions: ['all'] },
        { name: 'Gerente', permissions: ['products'] },
        { name: 'Cajero', permissions: ['sales', 'reports'] }
      ];
    }
    const role = roles.find(r => r.name === user.role);
    const perms = role?.permissions || [];
    const set = new Set(perms);
    if (set.has('all')) return ['all'];
    if (set.has('products')) {
      set.add('products.view');
      set.add('products.create');
      set.add('products.edit');
      set.add('products.delete');
    }
    if (set.has('products.edit')) set.add('products.view');
    if (set.has('products.create')) set.add('products.view');
    if (set.has('products.delete')) set.add('products.view');
    return Array.from(set);
  },

  _canManage(perms) {
    return perms.includes('all') || perms.includes('products.create') || perms.includes('products.edit') || perms.includes('products.delete');
  },

  render() {
    const perms = this._getPermissions();
    const canManage = this._canManage(perms);
    const canView = perms.includes('all') || perms.includes('products.view') || perms.includes('products');

    const products = this.searchQuery ? Store.products.search(this.searchQuery) : Store.products.getAll();
    const device = Store.device.get();
    const isMobile = device === 'mobile' || device === 'tablet';

    const content = `
<div class="animate-fade-in">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Productos</h1>
      <p class="text-slate-500 mt-1 text-sm">Gestiona tu inventario</p>
    </div>

    ${canManage ? `
    <button onclick="ProductsPage.openModal()"
      class="px-4 md:px-6 py-2.5 md:py-3 bg-orange-500 hover:bg-orange-600 text-white
      font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition btn-press flex items-center gap-2 justify-center">
      ${Components.icons.plus}
      <span>Nuevo Producto</span>
    </button>
    ` : ''}
  </div>

  <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">${Components.icons.search}</span>
        <input type="text" id="search-products" placeholder="Buscar productos..."
          value="${this.searchQuery}"
          oninput="ProductsPage.handleSearch(this.value)"
          class="w-full pl-12 pr-4 py-2.5 md:py-3 rounded-xl border border-slate-200
          focus:border-orange-500 transition text-sm md:text-base">
      </div>
      <div class="text-sm text-slate-500 flex items-center">${products.length} productos</div>
    </div>
  </div>

  ${canView ? (isMobile ? this.renderMobileList(products, canManage) : this.renderTable(products, canManage))
            : `<div class="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-100">No tienes permisos para ver productos.</div>`}
</div>
`;
    return LayoutComponents.layout(content, 'products');
  },

  renderTable(products, canManage) {
    return `
<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-slate-50">
        <tr class="text-left text-sm text-slate-600">
          <th class="px-4 md:px-6 py-3 md:py-4 font-semibold">Producto</th>
          <th class="px-4 md:px-6 py-3 md:py-4 font-semibold">Categoría</th>
          <th class="px-4 md:px-6 py-3 md:py-4 font-semibold">Precio</th>
          <th class="px-4 md:px-6 py-3 md:py-4 font-semibold">Stock</th>
          <th class="px-4 md:px-6 py-3 md:py-4 font-semibold text-right">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${products.length > 0 ? products.map(p => `
        <tr class="table-row-hover">
          <td class="px-4 md:px-6 py-3 md:py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-semibold text-sm">
                ${p.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span class="font-medium text-slate-900 text-sm md:text-base block">${p.name}</span>
                ${p.barcode ? `<span class="text-xs text-slate-400">${p.barcode}</span>` : ''}
              </div>
            </div>
          </td>
          <td class="px-4 md:px-6 py-3 md:py-4">
            <span class="px-2 md:px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs md:text-sm">${p.category}</span>
          </td>
          <td class="px-4 md:px-6 py-3 md:py-4 font-semibold text-slate-900 text-sm md:text-base">$${p.price.toFixed(2)}</td>
          <td class="px-4 md:px-6 py-3 md:py-4">
            <span class="px-2 md:px-3 py-1 ${p.stock < (p.minStock || 10) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full text-xs md:text-sm font-medium">
              ${p.stock} uds
            </span>
          </td>
          <td class="px-4 md:px-6 py-3 md:py-4 text-right">
            <div class="flex justify-end gap-1 md:gap-2">
              ${canManage ? `
              <button onclick="ProductsPage.openModal(${p.id})" class="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition" title="Editar">
                ${Components.icons.edit}
              </button>
              <button onclick="ProductsPage.deleteProduct(${p.id})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                ${Components.icons.trash}
              </button>
              ` : '<span class="text-xs text-slate-300">Solo lectura</span>'}
            </div>
          </td>
        </tr>
        `).join('') : `
        <tr>
          <td colspan="5" class="px-6 py-12 text-center text-slate-400">
            ${Components.icons.package.replace('w-5 h-5', 'w-12 h-12 mx-auto mb-3 opacity-50')}
            <p>No hay productos registrados</p>
          </td>
        </tr>
        `}
      </tbody>
    </table>
  </div>
</div>
`;
  },

  renderMobileList(products, canManage) {
    return `
<div class="space-y-3">
  ${products.length > 0 ? products.map(p => `
  <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-semibold">
          ${p.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 class="font-medium text-slate-900">${p.name}</h4>
          <span class="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">${p.category}</span>
        </div>
      </div>
      <div class="flex gap-1">
        ${canManage ? `
        <button onclick="ProductsPage.openModal(${p.id})" class="p-2 text-slate-400 hover:text-orange-600 rounded-lg">
          ${Components.icons.edit}
        </button>
        <button onclick="ProductsPage.deleteProduct(${p.id})" class="p-2 text-slate-400 hover:text-red-600 rounded-lg">
          ${Components.icons.trash}
        </button>
        ` : ''}
      </div>
    </div>
    <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
      <span class="font-bold text-orange-600">$${p.price.toFixed(2)}</span>
      <span class="px-2 py-1 ${p.stock < (p.minStock || 10) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full text-xs font-medium">
        ${p.stock} unidades
      </span>
    </div>
  </div>
  `).join('') : `
  <div class="bg-white rounded-xl p-8 text-center text-slate-400">
    ${Components.icons.package.replace('w-5 h-5', 'w-12 h-12 mx-auto mb-3 opacity-50')}
    <p>No hay productos</p>
  </div>
  `}
</div>
`;
  },

  handleSearch(query) {
    this.searchQuery = query;
    Router.render('products');
  },

  openModal(productId = null) {
    const perms = this._getPermissions();
    const canManage = this._canManage(perms);
    if (!canManage) {
      Components.toast('Acceso denegado: permisos insuficientes', 'error');
      return;
    }

    const product = productId ? Store.products.getById(productId) : null;
    const isEdit = !!product;
    const warehouses = Store.warehouses.getAll();

    const modalContent = `
<form id="product-form" class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
    <input type="text" id="prod-name" value="${product?.name || ''}"
      class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Precio *</label>
      <input type="number" id="prod-price" value="${product?.price || ''}" step="0.01" min="0"
        class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
      <input type="number" id="prod-stock" value="${product?.stock ?? ''}" min="0"
        class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
    </div>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
      <input type="text" id="prod-category" value="${product?.category || ''}"
        class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Almacén</label>
      <select id="prod-warehouse" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
        ${warehouses.map(w => `<option value="${w.id}" ${product?.warehouseId === w.id ? 'selected' : ''}>${w.name}</option>`).join('')}
      </select>
    </div>
  </div>
</form>
`;

    Components.modal({
      title: isEdit ? 'Editar Producto' : 'Nuevo Producto',
      content: modalContent,
      confirmText: isEdit ? 'Guardar' : 'Crear',
      onConfirm: () => {
        const name = document.getElementById('prod-name').value.trim();
        const price = parseFloat(document.getElementById('prod-price').value);
        const stock = parseInt(document.getElementById('prod-stock').value);
        const category = document.getElementById('prod-category').value.trim();

        if (!name || isNaN(price) || isNaN(stock) || !category) {
          Components.toast('Completa los campos requeridos', 'warning');
          return false;
        }

        const data = {
          name,
          price,
          stock,
          category,
          warehouseId: parseInt(document.getElementById('prod-warehouse').value || 1)
        };

        if (isEdit) Store.products.update(productId, data);
        else Store.products.add(data);

        Components.toast(isEdit ? 'Producto actualizado' : 'Producto creado', 'success');
        Router.navigate('products', {}, { push: false });
        return true;
      }
    });
  },

  deleteProduct(id) {
    const perms = this._getPermissions();
    const canDelete = perms.includes('all') || perms.includes('products.delete');
    if (!canDelete) {
      Components.toast('Acceso denegado: no puedes eliminar productos', 'error');
      return;
    }

    const product = Store.products.getById(id);
    Components.modal({
      title: 'Eliminar Producto',
      content: `<p>¿Eliminar "<strong>${product.name}</strong>"? Esta acción no se puede deshacer.</p>`,
      confirmText: 'Eliminar',
      type: 'danger',
      onConfirm: () => {
        Store.products.delete(id);
        Components.toast('Producto eliminado', 'success');
        Router.navigate('products', {}, { push: false });
      }
    });
  }
};

Router.register('products', () => ProductsPage.render());
