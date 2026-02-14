/**
 * Inventory Kits Module - Product Bundles/Combos
 * Stock Desk Application
 */

const InventoryKits = {
    render() {
        const kits = Store.kits.getAll();
        const products = Store.products.getAll();

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-semibold text-slate-900">Productos Compuestos (Kits)</h3>
                        <p class="text-sm text-slate-500">Agrupa productos para vender como paquete</p>
                    </div>
                    <button onclick="InventoryKits.openModal()" 
                            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press flex items-center gap-2">
                        ${Components.icons.plus}
                        <span>Nuevo Kit</span>
                    </button>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${kits.map(kit => {
                        const kitProducts = kit.components.map(c => {
                            const prod = products.find(p => p.id === c.productId);
                            return { ...c, product: prod };
                        });
                        const totalCost = kitProducts.reduce((sum, c) => sum + ((c.product?.price || 0) * c.quantity), 0);
                        const margin = kit.price - totalCost;

                        return `
                            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                        ${Components.icons.package}
                                    </div>
                                    <button onclick="InventoryKits.delete(${kit.id})" 
                                            class="p-2 text-slate-400 hover:text-red-500 rounded-lg transition">
                                        ${Components.icons.trash}
                                    </button>
                                </div>
                                <h4 class="font-semibold text-slate-900 mb-1">${kit.name}</h4>
                                <p class="text-sm text-slate-500 mb-3">${kit.description || 'Sin descripción'}</p>
                                
                                <div class="space-y-2 mb-4">
                                    <p class="text-xs font-medium text-slate-600">Componentes:</p>
                                    ${kitProducts.map(c => `
                                        <div class="flex justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
                                            <span class="text-slate-700">${c.product?.name || 'Producto eliminado'}</span>
                                            <span class="text-slate-500">x${c.quantity}</span>
                                        </div>
                                    `).join('')}
                                </div>

                                <div class="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                                    <div>
                                        <p class="text-xs text-slate-500">Costo</p>
                                        <p class="font-semibold text-slate-700">$${totalCost.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500">Precio</p>
                                        <p class="font-bold text-orange-600">$${kit.price.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500">Margen</p>
                                        <p class="font-semibold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}">$${margin.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${kits.length === 0 ? `
                    <div class="bg-white rounded-xl p-8 text-center">
                        ${Components.icons.package.replace('w-5 h-5', 'w-12 h-12 mx-auto text-slate-300 mb-3')}
                        <p class="text-slate-500 mb-2">No hay kits creados</p>
                        <p class="text-sm text-slate-400">Crea combos de productos para vender como paquete</p>
                    </div>
                ` : ''}
            </div>
        `;
    },

    openModal() {
        const products = Store.products.getAll();

        if (products.length < 2) {
            Components.toast('Necesitas al menos 2 productos para crear un kit', 'warning');
            return;
        }

        Components.modal({
            title: 'Nuevo Kit / Combo',
            content: `
                <form id="kit-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Kit</label>
                        <input type="text" id="kit-name" required placeholder="Ej: Combo Familiar"
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Precio de Venta</label>
                        <input type="number" id="kit-price" step="0.01" required
                               class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <textarea id="kit-desc" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-orange-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Componentes</label>
                        <div id="kit-components" class="space-y-2">
                            <div class="flex gap-2">
                                <select class="kit-product flex-1 px-3 py-2 rounded-lg border border-slate-200">
                                    <option value="">Seleccionar producto...</option>
                                    ${products.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                                </select>
                                <input type="number" class="kit-qty w-20 px-3 py-2 rounded-lg border border-slate-200" placeholder="Cant" min="1" value="1">
                            </div>
                        </div>
                        <button type="button" onclick="InventoryKits.addComponent()" 
                                class="mt-2 text-sm text-orange-600 hover:text-orange-700">+ Agregar otro producto</button>
                    </div>
                </form>
            `,
            confirmText: 'Crear Kit',
            onConfirm: () => {
                const name = document.getElementById('kit-name').value;
                const price = parseFloat(document.getElementById('kit-price').value);
                const description = document.getElementById('kit-desc').value;
                
                const componentRows = document.querySelectorAll('#kit-components > div');
                const components = [];
                
                componentRows.forEach(row => {
                    const productId = parseInt(row.querySelector('.kit-product').value);
                    const quantity = parseInt(row.querySelector('.kit-qty').value);
                    if (productId && quantity > 0) {
                        components.push({ productId, quantity });
                    }
                });

                if (components.length < 2) {
                    Components.toast('Agrega al menos 2 productos al kit', 'warning');
                    return;
                }

                Store.kits.add({ name, price, description, components });
                Components.toast('Kit creado exitosamente', 'success');
                Router.navigate('inventory');
            }
        });
    },

    addComponent() {
        const products = Store.products.getAll();
        const container = document.getElementById('kit-components');
        const div = document.createElement('div');
        div.className = 'flex gap-2';
        div.innerHTML = `
            <select class="kit-product flex-1 px-3 py-2 rounded-lg border border-slate-200">
                <option value="">Seleccionar producto...</option>
                ${products.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
            </select>
            <input type="number" class="kit-qty w-20 px-3 py-2 rounded-lg border border-slate-200" placeholder="Cant" min="1" value="1">
            <button type="button" onclick="this.parentElement.remove()" class="px-2 text-red-500 hover:bg-red-50 rounded">×</button>
        `;
        container.appendChild(div);
    },

    delete(id) {
        Components.modal({
            title: 'Eliminar Kit',
            content: '<p>¿Deseas eliminar este kit?</p>',
            confirmText: 'Eliminar',
            type: 'danger',
            onConfirm: () => {
                Store.kits.delete(id);
                Components.toast('Kit eliminado', 'success');
                Router.navigate('inventory');
            }
        });
    }
};
