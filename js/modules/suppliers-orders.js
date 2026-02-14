/**
 * Suppliers Orders Module
 * Stock Desk Application
 */

const SuppliersOrders = {
    render() {
        const orders = Store.get('stockdesk_purchase_orders') || [];

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Órdenes de Compra</h3>
                    <button onclick="SuppliersOrders.create()" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
                        ${Components.icons.plus} Nueva Orden
                    </button>
                </div>

                ${orders.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50">
                                    <tr class="text-left text-sm text-slate-600">
                                        <th class="px-4 py-3 font-semibold">Orden</th>
                                        <th class="px-4 py-3 font-semibold">Proveedor</th>
                                        <th class="px-4 py-3 font-semibold">Fecha</th>
                                        <th class="px-4 py-3 font-semibold">Total</th>
                                        <th class="px-4 py-3 font-semibold">Estado</th>
                                        <th class="px-4 py-3 font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${orders.slice().reverse().map(o => `
                                        <tr class="table-row-hover">
                                            <td class="px-4 py-3 text-sm font-medium">#${o.id}</td>
                                            <td class="px-4 py-3 text-sm">${o.supplierName}</td>
                                            <td class="px-4 py-3 text-sm">${new Date(o.date).toLocaleDateString('es')}</td>
                                            <td class="px-4 py-3 text-sm font-semibold">$${o.total.toFixed(2)}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs rounded-full ${this.getStatusStyle(o.status)}">
                                                    ${this.getStatusLabel(o.status)}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3">
                                                <div class="flex gap-1">
                                                    <button onclick="SuppliersOrders.view(${o.id})" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                        ${Components.icons.info}
                                                    </button>
                                                    ${o.status === 'pending' ? `
                                                        <button onclick="SuppliersOrders.receive(${o.id})" class="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                                            ${Components.icons.check}
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${Components.icons.clipboard.replace('w-6 h-6', 'w-8 h-8 text-slate-400')}
                        </div>
                        <h4 class="font-semibold text-slate-900 mb-2">No hay órdenes</h4>
                        <p class="text-slate-500 mb-4">Crea órdenes de compra para reabastecer</p>
                        <button onclick="SuppliersOrders.create()" class="px-4 py-2 bg-orange-500 text-white rounded-lg">Nueva Orden</button>
                    </div>
                `}
            </div>
        `;
    },

    getStatusStyle(status) {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-600',
            received: 'bg-green-100 text-green-600',
            cancelled: 'bg-red-100 text-red-600'
        };
        return styles[status] || styles.pending;
    },

    getStatusLabel(status) {
        const labels = { pending: 'Pendiente', received: 'Recibida', cancelled: 'Cancelada' };
        return labels[status] || status;
    },

    create() {
        const suppliers = Store.get('stockdesk_suppliers') || [];
        const products = Store.products.getAll();

        if (suppliers.length === 0) {
            Components.toast('Primero agrega proveedores', 'warning');
            return;
        }

        Components.modal({
            title: 'Nueva Orden de Compra',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
                        <select id="order-supplier" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            ${suppliers.map(s => `<option value="${s.id}" data-name="${s.name}">${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Producto</label>
                        <select id="order-product" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            <option value="">Seleccionar...</option>
                            ${products.map(p => `<option value="${p.id}" data-name="${p.name}" data-price="${p.price}">${p.name} - $${p.price}</option>`).join('')}
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
                            <input type="number" id="order-qty" min="1" value="1" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Precio Unitario</label>
                            <input type="number" id="order-price" step="0.01" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Fecha de Vencimiento</label>
                        <input type="date" id="order-due" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                        <textarea id="order-notes" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-200"></textarea>
                    </div>
                </form>
            `,
            confirmText: 'Crear Orden',
            onConfirm: () => {
                const orders = Store.get('stockdesk_purchase_orders') || [];
                const supplierSelect = document.getElementById('order-supplier');
                const qty = parseInt(document.getElementById('order-qty').value) || 1;
                const price = parseFloat(document.getElementById('order-price').value) || 0;

                orders.push({
                    id: Date.now(),
                    supplierId: parseInt(supplierSelect.value),
                    supplierName: supplierSelect.options[supplierSelect.selectedIndex].dataset.name,
                    productId: document.getElementById('order-product').value,
                    quantity: qty,
                    unitPrice: price,
                    total: qty * price,
                    dueDate: document.getElementById('order-due').value,
                    notes: document.getElementById('order-notes').value,
                    date: new Date().toISOString(),
                    status: 'pending',
                    paymentStatus: 'pending'
                });
                Store.set('stockdesk_purchase_orders', orders);

                // Incrementar contador de órdenes del proveedor
                const suppliers = Store.get('stockdesk_suppliers') || [];
                const supIdx = suppliers.findIndex(s => s.id === parseInt(supplierSelect.value));
                if (supIdx !== -1) {
                    suppliers[supIdx].orders = (suppliers[supIdx].orders || 0) + 1;
                    Store.set('stockdesk_suppliers', suppliers);
                }

                Components.toast('Orden creada', 'success');
                Router.navigate('suppliers');
            }
        });
    },

    createOrder(supplierId) {
        const suppliers = Store.get('stockdesk_suppliers') || [];
        const supplier = suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        // Crear orden directamente para este proveedor
        this.create();
        setTimeout(() => {
            const select = document.getElementById('order-supplier');
            if (select) select.value = supplierId;
        }, 100);
    },

    view(id) {
        const orders = Store.get('stockdesk_purchase_orders') || [];
        const order = orders.find(o => o.id === id);
        if (!order) return;

        Components.modal({
            title: `Orden #${order.id}`,
            content: `
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-slate-500">Proveedor</p>
                            <p class="font-semibold">${order.supplierName}</p>
                        </div>
                        <div>
                            <p class="text-sm text-slate-500">Fecha</p>
                            <p class="font-semibold">${new Date(order.date).toLocaleDateString('es')}</p>
                        </div>
                        <div>
                            <p class="text-sm text-slate-500">Cantidad</p>
                            <p class="font-semibold">${order.quantity}</p>
                        </div>
                        <div>
                            <p class="text-sm text-slate-500">Total</p>
                            <p class="font-semibold text-orange-600">$${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                    ${order.notes ? `<div><p class="text-sm text-slate-500">Notas</p><p>${order.notes}</p></div>` : ''}
                </div>
            `,
            confirmText: 'Cerrar',
            cancelText: ''
        });
    },

    receive(id) {
        Components.modal({
            title: 'Recibir Orden',
            content: '<p>¿Confirmar recepción de la orden? Esto actualizará el inventario.</p>',
            confirmText: 'Confirmar',
            onConfirm: () => {
                const orders = Store.get('stockdesk_purchase_orders') || [];
                const idx = orders.findIndex(o => o.id === id);
                if (idx !== -1) {
                    orders[idx].status = 'received';
                    orders[idx].receivedDate = new Date().toISOString();
                    Store.set('stockdesk_purchase_orders', orders);

                    // Actualizar stock del producto
                    if (orders[idx].productId) {
                        const product = Store.products.getById(parseInt(orders[idx].productId));
                        if (product) {
                            Store.products.update(product.id, { stock: product.stock + orders[idx].quantity });
                        }
                    }

                    Components.toast('Orden recibida', 'success');
                }
                Router.navigate('suppliers');
            }
        });
    }
};
