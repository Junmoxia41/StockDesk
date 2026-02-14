/**
 * Suppliers Directory Module
 * Stock Desk Application
 */

const SuppliersDirectory = {
    render() {
        const suppliers = Store.get('stockdesk_suppliers') || [];

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-slate-900">Directorio de Proveedores</h3>
                    <button onclick="SuppliersDirectory.add()" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2">
                        ${Components.icons.plus} Nuevo Proveedor
                    </button>
                </div>

                ${suppliers.length > 0 ? `
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${suppliers.map(s => `
                            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div class="p-5">
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">
                                                ${s.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-slate-900">${s.name}</h4>
                                                <p class="text-sm text-slate-500">${s.category || 'General'}</p>
                                            </div>
                                        </div>
                                        ${this.renderRating(s.rating || 0)}
                                    </div>
                                    <div class="space-y-2 text-sm">
                                        ${s.contact ? `<p class="text-slate-600">${Components.icons.users.replace('w-5 h-5', 'w-4 h-4 inline mr-1')} ${s.contact}</p>` : ''}
                                        ${s.phone ? `<p class="text-slate-600">${Components.icons.info.replace('w-5 h-5', 'w-4 h-4 inline mr-1')} ${s.phone}</p>` : ''}
                                        ${s.email ? `<p class="text-slate-600 truncate">${Components.icons.info.replace('w-5 h-5', 'w-4 h-4 inline mr-1')} ${s.email}</p>` : ''}
                                    </div>
                                    <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
                                        <div>
                                            <p class="text-xs text-slate-500">Tiempo Entrega</p>
                                            <p class="font-semibold">${s.deliveryTime || '?'} días</p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-500">Pedidos</p>
                                            <p class="font-semibold">${s.orders || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="px-5 py-3 bg-slate-50 flex gap-2">
                                    <button onclick="SuppliersDirectory.edit(${s.id})" class="flex-1 py-2 text-sm bg-white border border-slate-200 hover:bg-slate-100 rounded-lg">Editar</button>
                                    <button onclick="SuppliersOrders.createOrder(${s.id})" class="flex-1 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Ordenar</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${Components.icons.users.replace('w-5 h-5', 'w-8 h-8 text-slate-400')}
                        </div>
                        <h4 class="font-semibold text-slate-900 mb-2">No hay proveedores</h4>
                        <p class="text-slate-500 mb-4">Agrega proveedores para gestionar compras</p>
                        <button onclick="SuppliersDirectory.add()" class="px-4 py-2 bg-orange-500 text-white rounded-lg">Agregar</button>
                    </div>
                `}
            </div>
        `;
    },

    renderRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<svg class="w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-slate-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
        }
        return `<div class="flex">${stars}</div>`;
    },

    add() {
        Components.modal({
            title: 'Nuevo Proveedor',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="sup-name" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                            <select id="sup-category" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                                <option value="General">General</option>
                                <option value="Alimentos">Alimentos</option>
                                <option value="Bebidas">Bebidas</option>
                                <option value="Electrónica">Electrónica</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Tiempo Entrega</label>
                            <input type="number" id="sup-delivery" min="1" placeholder="días" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Contacto</label>
                        <input type="text" id="sup-contact" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                            <input type="tel" id="sup-phone" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" id="sup-email" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                    </div>
                </form>
            `,
            confirmText: 'Crear',
            onConfirm: () => {
                const suppliers = Store.get('stockdesk_suppliers') || [];
                suppliers.push({
                    id: Date.now(),
                    name: document.getElementById('sup-name').value,
                    category: document.getElementById('sup-category').value,
                    deliveryTime: parseInt(document.getElementById('sup-delivery').value) || 0,
                    contact: document.getElementById('sup-contact').value,
                    phone: document.getElementById('sup-phone').value,
                    email: document.getElementById('sup-email').value,
                    rating: 0,
                    orders: 0,
                    createdAt: new Date().toISOString()
                });
                Store.set('stockdesk_suppliers', suppliers);
                Components.toast('Proveedor creado', 'success');
                Router.navigate('suppliers');
            }
        });
    },

    edit(id) {
        const suppliers = Store.get('stockdesk_suppliers') || [];
        const s = suppliers.find(sup => sup.id === id);
        if (!s) return;

        Components.modal({
            title: 'Editar Proveedor',
            content: `
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" id="sup-name" value="${s.name}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Contacto</label>
                            <input type="text" id="sup-contact" value="${s.contact || ''}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                            <input type="tel" id="sup-phone" value="${s.phone || ''}" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Calificación</label>
                        <select id="sup-rating" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            ${[0,1,2,3,4,5].map(r => `<option value="${r}" ${s.rating === r ? 'selected' : ''}>${r} estrella${r !== 1 ? 's' : ''}</option>`).join('')}
                        </select>
                    </div>
                </form>
            `,
            confirmText: 'Guardar',
            onConfirm: () => {
                const idx = suppliers.findIndex(sup => sup.id === id);
                if (idx !== -1) {
                    suppliers[idx].name = document.getElementById('sup-name').value;
                    suppliers[idx].contact = document.getElementById('sup-contact').value;
                    suppliers[idx].phone = document.getElementById('sup-phone').value;
                    suppliers[idx].rating = parseInt(document.getElementById('sup-rating').value);
                    Store.set('stockdesk_suppliers', suppliers);
                    Components.toast('Proveedor actualizado', 'success');
                }
                Router.navigate('suppliers');
            }
        });
    }
};
