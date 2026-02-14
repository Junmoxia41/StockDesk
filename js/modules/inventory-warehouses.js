/**
 * Inventory Warehouses Module
 * Stock Desk Application
 */

const InventoryWarehouses = {
    render() {
        const warehouses = Store.warehouses.getAll();
        const products = Store.products.getAll();

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Almacenes / Bodegas</h3>
                    <button onclick="InventoryWarehouses.openModal()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press flex items-center gap-2">
                        ${Components.icons.plus}
                        <span>Nuevo Almacén</span>
                    </button>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${warehouses.map(w => {
                        const warehouseProducts = products.filter(p => p.warehouseId === w.id);
                        const totalValue = warehouseProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                        return `
                            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                        ${Components.icons.warehouse}
                                    </div>
                                    ${w.isDefault ? '<span class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Principal</span>' : ''}
                                </div>
                                <h4 class="font-semibold text-slate-900 mb-1">${w.name}</h4>
                                <p class="text-sm text-slate-500 mb-4">${w.location || 'Sin ubicación'}</p>
                                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                    <div>
                                        <p class="text-xs text-slate-500">Productos</p>
                                        <p class="font-bold text-slate-900">${warehouseProducts.length}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500">Valor Total</p>
                                        <p class="font-bold text-orange-600">$${totalValue.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div class="flex gap-2 mt-4">
                                    <button onclick="InventoryWarehouses.openModal(${w.id})" 
                                            class="flex-1 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                        Editar
                                    </button>
                                    ${!w.isDefault ? `
                                        <button onclick="InventoryWarehouses.delete(${w.id})" 
                                                class="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                            ${Components.icons.trash}
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${warehouses.length === 0 ? `
                    <div class="bg-white rounded-xl p-8 text-center">
                        ${Components.icons.warehouse.replace('w-5 h-5', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                        <p class="text-slate-500">No hay almacenes configurados</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    openModal(warehouseId = null) {
        const warehouse = warehouseId ? Store.warehouses.getById(warehouseId) : null;
        const isEdit = !!warehouse;

        Components.modal({
            title: isEdit ? 'Editar Almacén' : 'Nuevo Almacén',
            content: `
                <form id="warehouse-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="wh-name" value="${warehouse?.name || ''}" required
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                        <input type="text" id="wh-location" value="${warehouse?.location || ''}"
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <textarea id="wh-desc" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">${warehouse?.description || ''}</textarea>
                    </div>
                </form>
            `,
            confirmText: isEdit ? 'Guardar' : 'Crear',
            onConfirm: () => {
                const data = {
                    name: document.getElementById('wh-name').value,
                    location: document.getElementById('wh-location').value,
                    description: document.getElementById('wh-desc').value
                };
                if (isEdit) {
                    Store.warehouses.update(warehouseId, data);
                    Components.toast('Almacén actualizado', 'success');
                } else {
                    Store.warehouses.add(data);
                    Components.toast('Almacén creado', 'success');
                }
                Router.navigate('inventory');
            }
        });
    },

    delete(id) {
        const products = Store.products.getByWarehouse(id);
        if (products.length > 0) {
            Components.toast('No se puede eliminar: tiene productos asignados', 'error');
            return;
        }
        Components.modal({
            title: 'Eliminar Almacén',
            content: '<p>¿Está seguro de eliminar este almacén?</p>',
            confirmText: 'Eliminar',
            type: 'danger',
            onConfirm: () => {
                Store.warehouses.delete(id);
                Components.toast('Almacén eliminado', 'success');
                Router.navigate('inventory');
            }
        });
    }
};
