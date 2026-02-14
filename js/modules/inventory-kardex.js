/**
 * Inventory Kardex Module
 * Stock Desk Application
 */

const InventoryKardex = {
    selectedProduct: null,

    render() {
        const products = Store.products.getAll();
        const kardex = this.selectedProduct 
            ? Store.kardex.getByProduct(this.selectedProduct) 
            : Store.kardex.getAll();

        return `
            <div class="space-y-4">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 class="font-semibold text-slate-900">Kardex - Movimientos de Inventario</h3>
                    <div class="flex gap-2">
                        <select id="kardex-filter" onchange="InventoryKardex.filterByProduct(this.value)"
                                class="px-4 py-2 rounded-lg border border-slate-200 focus:border-orange-500 text-sm">
                            <option value="">Todos los productos</option>
                            ${products.map(p => `<option value="${p.id}" ${this.selectedProduct === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                        </select>
                        <button onclick="InventoryKardex.exportKardex()" 
                                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-2 text-sm">
                            ${Components.icons.clipboard}
                            Exportar
                        </button>
                    </div>
                </div>

                ${kardex.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50">
                                    <tr class="text-left text-sm text-slate-600">
                                        <th class="px-4 py-3 font-semibold">Fecha</th>
                                        <th class="px-4 py-3 font-semibold">Producto</th>
                                        <th class="px-4 py-3 font-semibold">Tipo</th>
                                        <th class="px-4 py-3 font-semibold">Cantidad</th>
                                        <th class="px-4 py-3 font-semibold">Saldo</th>
                                        <th class="px-4 py-3 font-semibold">Motivo</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${kardex.slice().reverse().slice(0, 50).map(k => `
                                        <tr class="table-row-hover">
                                            <td class="px-4 py-3 text-sm text-slate-600">${new Date(k.date).toLocaleString('es')}</td>
                                            <td class="px-4 py-3 text-sm font-medium text-slate-900">${k.productName}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 text-xs rounded-full ${
                                                    k.type === 'entrada' ? 'bg-green-100 text-green-600' : 
                                                    k.type === 'salida' ? 'bg-red-100 text-red-600' : 
                                                    'bg-blue-100 text-blue-600'
                                                }">
                                                    ${k.type.charAt(0).toUpperCase() + k.type.slice(1)}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3 text-sm font-semibold ${k.type === 'entrada' ? 'text-green-600' : 'text-red-600'}">
                                                ${k.type === 'entrada' ? '+' : '-'}${k.quantity}
                                            </td>
                                            <td class="px-4 py-3 text-sm text-slate-900">${k.balance}</td>
                                            <td class="px-4 py-3 text-sm text-slate-500">${k.reason}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-8 text-center">
                        ${Components.icons.clipboard.replace('w-6 h-6', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                        <p class="text-slate-500">No hay movimientos registrados</p>
                    </div>
                `}
            </div>
        `;
    },

    filterByProduct(productId) {
        this.selectedProduct = productId ? parseInt(productId) : null;
        Router.navigate('inventory');
    },

    exportKardex() {
        const kardex = this.selectedProduct 
            ? Store.kardex.getByProduct(this.selectedProduct) 
            : Store.kardex.getAll();
        
        const csv = 'Fecha,Producto,Tipo,Cantidad,Saldo,Motivo\n' + 
            kardex.map(k => `${k.date},${k.productName},${k.type},${k.quantity},${k.balance},"${k.reason}"`).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kardex-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        Components.toast('Kardex exportado', 'success');
    }
};

const InventoryCounts = {
    render() {
        const counts = Store.inventoryCounts.getAll();
        const products = Store.products.getAll();

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Conteo Físico de Inventario</h3>
                    <button onclick="InventoryCounts.startCount()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press flex items-center gap-2">
                        ${Components.icons.box}
                        <span>Nuevo Conteo</span>
                    </button>
                </div>

                <!-- Quick Count -->
                <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <h4 class="font-medium text-slate-900 mb-4">Conteo Rápido</h4>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Producto</label>
                            <select id="count-product" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                                <option value="">Seleccionar...</option>
                                ${products.map(p => `<option value="${p.id}">${p.name} (Sistema: ${p.stock})</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Cantidad Real</label>
                            <input type="number" id="count-qty" min="0" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                        <div class="flex items-end">
                            <button onclick="InventoryCounts.quickCount()" 
                                    class="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition">
                                Registrar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- History -->
                ${counts.length > 0 ? `
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="px-4 py-3 border-b border-slate-100">
                            <h4 class="font-medium text-slate-900">Historial de Conteos</h4>
                        </div>
                        <div class="divide-y divide-slate-100">
                            ${counts.slice().reverse().slice(0, 10).map(c => `
                                <div class="px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p class="font-medium text-slate-900">${c.productName}</p>
                                        <p class="text-xs text-slate-500">${new Date(c.date).toLocaleString('es')}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm">Sistema: ${c.systemStock} / Real: ${c.realStock}</p>
                                        <span class="text-xs ${c.difference === 0 ? 'text-green-600' : 'text-red-600'}">
                                            Diferencia: ${c.difference > 0 ? '+' : ''}${c.difference}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    quickCount() {
        const productId = parseInt(document.getElementById('count-product').value);
        const realQty = parseInt(document.getElementById('count-qty').value);

        if (!productId || isNaN(realQty)) {
            Components.toast('Completa todos los campos', 'warning');
            return;
        }

        const product = Store.products.getById(productId);
        const difference = realQty - product.stock;

        Store.inventoryCounts.add({
            productId,
            productName: product.name,
            systemStock: product.stock,
            realStock: realQty,
            difference
        });

        if (difference !== 0) {
            Store.products.update(productId, { stock: realQty });
            Store.kardex.add(productId, difference > 0 ? 'entrada' : 'salida', Math.abs(difference), 'Ajuste por conteo físico');
        }

        Components.toast(`Conteo registrado. Diferencia: ${difference}`, difference === 0 ? 'success' : 'warning');
        Router.navigate('inventory');
    },

    startCount() {
        Components.toast('Función de conteo masivo próximamente', 'info');
    }
};
