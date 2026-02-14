/**
 * Sales Page - Point of Sale (POS)
 * Stock Desk Application
 */

const SalesPage = {
    cart: [],
    searchQuery: '',

    render() {
        const products = this.searchQuery ? Store.products.search(this.searchQuery) : Store.products.getAll();
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const device = Store.device.get();
        const isMobile = device === 'mobile';

        // Check user role for UI adjustments
        const user = Store.get(Store.KEYS.USER);
        const isAdmin = user && (user.role === 'Administrador' || user.role === 'Gerente');

        const content = isMobile ? this.renderMobile(products, total, isAdmin) : this.renderDesktop(products, total, isAdmin);
        return LayoutComponents.layout(content, 'sales');
    },

    renderDesktop(products, total, isAdmin) {
        return `
            <div class="animate-fade-in h-[calc(100vh-4rem)]">
                <div class="mb-4">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Punto de Venta</h1>
                    <p class="text-slate-500 text-sm">Procesa ventas rápidamente</p>
                </div>
                <div class="grid lg:grid-cols-2 gap-4 h-[calc(100%-5rem)]">
                    ${this.renderProductsPanel(products, isAdmin)}
                    ${this.renderCartPanel(total)}
                </div>
            </div>
        `;
    },

    renderMobile(products, total, isAdmin) {
        return `
            <div class="animate-fade-in pb-32">
                <div class="mb-4">
                    <h1 class="text-2xl font-bold text-slate-900">Punto de Venta</h1>
                </div>
                ${this.renderProductsPanel(products, isAdmin)}
                ${this.cart.length > 0 ? `
                    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-30">
                        <div class="flex items-center justify-between mb-3">
                            <span class="font-bold text-slate-900">${this.cart.length} items</span>
                            <span class="font-bold text-xl text-orange-600">$${total.toFixed(2)}</span>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="SalesPage.showCartModal()" class="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl transition btn-press">
                                Ver Carrito
                            </button>
                            <button onclick="SalesPage.checkout()" class="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-lg transition btn-press">
                                Cobrar
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    renderProductsPanel(products, isAdmin) {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                <div class="p-3 md:p-4 border-b border-slate-100">
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">${Components.icons.search}</span>
                        <input type="text" placeholder="Buscar producto..." value="${this.searchQuery}"
                               oninput="SalesPage.handleSearch(this.value)"
                               class="w-full pl-12 pr-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-orange-500 transition">
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto p-3 md:p-4">
                    ${products.length > 0 ? `
                        <div class="grid grid-cols-2 gap-2 md:gap-3">
                            ${products.map(p => `
                                <button onclick="SalesPage.addToCart(${p.id})" 
                                        class="pos-product-card p-3 md:p-4 rounded-xl border border-slate-200 text-left ${p.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                        ${p.stock === 0 ? 'disabled' : ''}>
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                                            ${p.name.charAt(0)}
                                        </div>
                                        <span class="text-xs px-1.5 py-0.5 ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full">
                                            ${p.stock}
                                        </span>
                                    </div>
                                    <h4 class="font-medium text-slate-900 text-xs md:text-sm mb-1 truncate">${p.name}</h4>
                                    <p class="text-orange-600 font-bold text-sm md:text-base">$${p.price.toFixed(2)}</p>
                                </button>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                            ${Components.icons.package.replace('w-5 h-5', 'w-12 h-12 mb-3 opacity-50')}
                            <p>No hay productos disponibles</p>
                            ${isAdmin ? `
                                <button onclick="Router.navigate('products')" class="mt-2 text-orange-600 text-sm font-medium hover:underline">
                                    Agregar productos
                                </button>
                            ` : `
                                <p class="text-xs mt-2 text-slate-500">Contacte al administrador para surtir stock</p>
                            `}
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    renderCartPanel(total) {
        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                <div class="p-3 md:p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="font-semibold text-slate-900 flex items-center gap-2">
                        ${Components.icons.cart.replace('w-5 h-5', 'w-5 h-5 text-orange-500')}
                        Carrito
                    </h3>
                    ${this.cart.length > 0 ? `
                        <button onclick="SalesPage.clearCart()" class="text-sm text-red-500 hover:text-red-600">Vaciar</button>
                    ` : ''}
                </div>
                <div class="flex-1 overflow-y-auto p-3 md:p-4">
                    ${this.cart.length > 0 ? `
                        <div class="space-y-2 md:space-y-3">
                            ${this.cart.map((item, index) => `
                                <div class="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-50 rounded-xl">
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-medium text-slate-900 text-sm truncate">${item.name}</h4>
                                        <p class="text-xs text-slate-500">$${item.price.toFixed(2)} c/u</p>
                                    </div>
                                    <div class="flex items-center gap-1 md:gap-2">
                                        <button onclick="SalesPage.updateQuantity(${index}, -1)" class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">
                                            ${Components.icons.minus}
                                        </button>
                                        <span class="w-6 md:w-8 text-center font-semibold text-sm">${item.quantity}</span>
                                        <button onclick="SalesPage.updateQuantity(${index}, 1)" class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">
                                            ${Components.icons.plus.replace('w-5 h-5', 'w-4 h-4')}
                                        </button>
                                    </div>
                                    <div class="text-right w-16 md:w-20">
                                        <p class="font-bold text-slate-900 text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button onclick="SalesPage.removeFromCart(${index})" class="p-1 text-slate-400 hover:text-red-500 transition">
                                        ${Components.icons.close.replace('w-6 h-6', 'w-5 h-5')}
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="h-full flex flex-col items-center justify-center text-slate-400">
                            ${Components.icons.cart.replace('w-5 h-5', 'w-14 h-14 mb-4 opacity-30')}
                            <p>El carrito está vacío</p>
                            <p class="text-sm">Agrega productos para comenzar</p>
                        </div>
                    `}
                </div>
                <div class="p-3 md:p-4 border-t border-slate-100 bg-slate-50">
                    <div class="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">Cliente</label>
                            <div class="flex">
                                <input type="text" id="pos-customer" placeholder="Público General" class="w-full px-2 py-1.5 rounded-l-lg border border-slate-200 text-sm">
                                <button class="px-2 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg hover:bg-slate-200">
                                    ${Components.icons.users.replace('w-5 h-5', 'w-4 h-4')}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">Descuento (%)</label>
                            <input type="number" id="pos-discount" min="0" max="100" value="0" 
                                   onchange="SalesPage.updateTotal()"
                                   class="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm">
                        </div>
                    </div>
                    <div class="flex items-center justify-between mb-1 text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span id="pos-subtotal">$${total.toFixed(2)}</span>
                    </div>
                    <div class="flex items-center justify-between mb-3 md:mb-4 text-lg">
                        <span class="font-bold text-slate-900">TOTAL</span>
                        <span class="font-bold text-xl md:text-2xl text-orange-600" id="pos-total-display">$${total.toFixed(2)}</span>
                    </div>
                    <button onclick="SalesPage.checkout()" 
                            class="w-full py-3 md:py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition btn-press flex items-center justify-center gap-2"
                            ${this.cart.length === 0 ? 'disabled' : ''}>
                        ${Components.icons.dollar} Cobrar
                    </button>
                </div>
            </div>
        `;
    },

    handleSearch(query) {
        this.searchQuery = query;
        Router.navigate('sales');
    },

    addToCart(productId) {
        const product = Store.products.getById(productId);
        if (!product || product.stock === 0) return;

        const existingIndex = this.cart.findIndex(item => item.id === productId);
        if (existingIndex >= 0) {
            if (this.cart[existingIndex].quantity < product.stock) {
                this.cart[existingIndex].quantity++;
            } else {
                Components.toast('Stock insuficiente', 'warning');
                return;
            }
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        Components.toast(`${product.name} agregado`, 'success');
        Router.navigate('sales');
    },

    updateQuantity(index, delta) {
        const item = this.cart[index];
        const product = Store.products.getById(item.id);
        const newQty = item.quantity + delta;

        if (newQty <= 0) {
            this.removeFromCart(index);
        } else if (newQty <= product.stock) {
            this.cart[index].quantity = newQty;
            Router.navigate('sales');
        } else {
            Components.toast('Stock insuficiente', 'warning');
        }
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        Router.navigate('sales');
    },

    clearCart() {
        this.cart = [];
        Router.navigate('sales');
    },

    showCartModal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        Components.modal({
            title: `Carrito (${this.cart.length} items)`,
            content: `
                <div class="max-h-60 overflow-y-auto space-y-2 mb-4">
                    ${this.cart.map((item, i) => `
                        <div class="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                            <span class="text-sm">${item.name} x${item.quantity}</span>
                            <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="text-right font-bold text-xl text-orange-600">Total: $${total.toFixed(2)}</div>
            `,
            confirmText: 'Cerrar',
            cancelText: 'Vaciar',
            onCancel: () => this.clearCart()
        });
    },

    updateTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountPercent = parseFloat(document.getElementById('pos-discount')?.value) || 0;
        
        // Validación 0-100%
        if (discountPercent < 0) { discountPercent = 0; document.getElementById('pos-discount').value = 0; }
        if (discountPercent > 100) { discountPercent = 100; document.getElementById('pos-discount').value = 100; }
        
        const discountAmount = subtotal * (discountPercent / 100);
        const total = Math.max(0, subtotal - discountAmount);
        
        const totalEl = document.getElementById('pos-total-display');
        const subtotalEl = document.getElementById('pos-subtotal');
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    },

    checkout() {
        if (this.cart.length === 0) return;
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountPercent = parseFloat(document.getElementById('pos-discount')?.value) || 0;
        const discountAmount = subtotal * (discountPercent / 100);
        const total = Math.max(0, subtotal - discountAmount);
        const customer = document.getElementById('pos-customer')?.value || 'Público General';
        
        Components.modal({
            title: 'Confirmar Venta',
            content: `
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">${customer}</p>
                    <p class="text-3xl font-bold text-orange-600 mb-2">$${total.toFixed(2)}</p>
                    ${discountPercent > 0 ? `<p class="text-xs text-green-600 mb-2">Descuento: ${discountPercent}% (-$${discountAmount.toFixed(2)})</p>` : ''}
                    <p class="text-sm text-slate-500">${this.cart.length} productos</p>
                </div>
            `,
            confirmText: 'Confirmar',
            onConfirm: () => {
                // Actualizar stock
                this.cart.forEach(item => Store.products.updateStock(item.id, item.quantity));
                
                // Guardar venta
                Store.sales.add({
                    items: this.cart.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
                    subtotal: subtotal,
                    discount: discountAmount,
                    total: total,
                    customer: customer
                });
                
                this.cart = [];
                Components.toast('Venta realizada con éxito', 'success');
                Router.navigate('sales');
            }
        });
    }
};

Router.register('sales', () => SalesPage.render());
