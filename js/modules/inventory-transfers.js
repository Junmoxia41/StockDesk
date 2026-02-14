/**
 * Inventory Transfers Module
 * Stock Desk Application
 */

const InventoryTransfers = {
    render() {
        const transfers = Store.transfers.getAll();
        const warehouses = Store.warehouses.getAll();

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Transferencias entre Almacenes</h3>
                    <button onclick="InventoryTransfers.openModal()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press flex items-center gap-2">
                        ${Components.icons.transfer}
                        <span>Nueva Transferencia</span>
                    </button>
                </div>

                ${transfers.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50">
                                    <tr class="text-left text-sm text-slate-600">
                                        <th class="px-4 py-3 font-semibold">Fecha</th>
                                        <th class="px-4 py-3 font-semibold">Producto</th>
                                        <th class="px-4 py-3 font-semibold">Origen</th>
                                        <th class="px-4 py-3 font-semibold">Destino</th>
                                        <th class="px-4 py-3 font-semibold">Cantidad</th>
                                        <th class="px-4 py-3 font-semibold">Estado</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${transfers.slice().reverse().map(t => {
                                        const fromWh = warehouses.find(w => w.id === t.fromWarehouse);
                                        const toWh = warehouses.find(w => w.id === t.toWarehouse);
                                        return `
                                            <tr class="table-row-hover">
                                                <td class="px-4 py-3 text-sm text-slate-600">${new Date(t.date).toLocaleDateString('es')}</td>
                                                <td class="px-4 py-3 text-sm font-medium text-slate-900">${t.productName}</td>
                                                <td class="px-4 py-3 text-sm text-slate-600">${fromWh?.name || 'N/A'}</td>
                                                <td class="px-4 py-3 text-sm text-slate-600">${toWh?.name || 'N/A'}</td>
                                                <td class="px-4 py-3 text-sm font-semibold text-slate-900">${t.quantity}</td>
                                                <td class="px-4 py-3">
                                                    <span class="px-2 py-1 text-xs rounded-full ${t.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}">
                                                        ${t.status === 'completed' ? 'Completada' : 'Pendiente'}
                                                    </span>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-8 text-center">
                        ${Components.icons.transfer.replace('w-5 h-5', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                        <p class="text-slate-500">No hay transferencias registradas</p>
                    </div>
                `}
            </div>
        `;
    },

    openModal() {
        const warehouses = Store.warehouses.getAll();
        const products = Store.products.getAll();

        if (warehouses.length < 2) {
            Components.toast('Necesitas al menos 2 almacenes para transferir', 'warning');
            return;
        }

        if (products.length === 0) {
            Components.toast('No hay productos para transferir', 'warning');
            return;
        }

        Components.modal({
            title: 'Nueva Transferencia',
            content: `
                <form id="transfer-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Producto</label>
                        <select id="tf-product" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                            <option value="">Seleccionar producto...</option>
                            ${products.map(p => `<option value="${p.id}" data-stock="${p.stock}" data-warehouse="${p.warehouseId}">${p.name} (Stock: ${p.stock})</option>`).join('')}
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Origen</label>
                            <select id="tf-from" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Destino</label>
                            <select id="tf-to" required class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
                        <input type="number" id="tf-qty" min="1" required
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                        <textarea id="tf-notes" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500"></textarea>
                    </div>
                </form>
            `,
            confirmText: 'Transferir',
            onConfirm: () => {
                const productId = parseInt(document.getElementById('tf-product').value);
                const fromWarehouse = parseInt(document.getElementById('tf-from').value);
                const toWarehouse = parseInt(document.getElementById('tf-to').value);
                const quantity = parseInt(document.getElementById('tf-qty').value);
                const notes = document.getElementById('tf-notes').value;

                if (fromWarehouse === toWarehouse) {
                    Components.toast('Origen y destino no pueden ser iguales', 'error');
                    return;
                }

                const product = Store.products.getById(productId);
                if (quantity > product.stock) {
                    Components.toast('Stock insuficiente', 'error');
                    return;
                }

                // Update product warehouse and register transfer
                Store.products.update(productId, { warehouseId: toWarehouse });
                Store.transfers.add({
                    productId,
                    productName: product.name,
                    fromWarehouse,
                    toWarehouse,
                    quantity,
                    notes
                });
                Store.kardex.add(productId, 'transferencia', quantity, `Transferencia a almacén ${toWarehouse}`);

                Components.toast('Transferencia realizada', 'success');
                Router.navigate('inventory');
            }
        });
    }
};
