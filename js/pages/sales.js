/**
 * Sales Page - Point of Sale (POS) - Pro (Pago + Cambio + Reimpresión)
 * Stock Desk Application
 */
const SalesPage = {
  cart: [],
  searchQuery: '',

  _getPermissions() {
    const user = Store.get(Store.KEYS.USER);
    if (!user?.role) return [];
    let roles = Store.get(Store.KEYS.ROLES);
    if (!roles || roles.length === 0) {
      roles = [
        { name: 'Administrador', permissions: ['all'] },
        { name: 'Gerente', permissions: ['sales', 'sales.discount'] },
        { name: 'Cajero', permissions: ['sales'] }
      ];
    }
    const role = roles.find(r => r.name === user.role);
    const perms = role?.permissions || [];
    const set = new Set(perms);
    if (set.has('all')) return ['all'];
    if (set.has('sales')) set.add('sales.discount'); // compat
    return Array.from(set);
  },

  rerender() {
    Router.navigate('sales', {}, { push: false });
  },

  render() {
    const products = this.searchQuery ? Store.products.search(this.searchQuery) : Store.products.getAll();
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const device = Store.device.get();
    const isMobile = device === 'mobile';
    const perms = this._getPermissions();
    const canDiscount = perms.includes('all') || perms.includes('sales.discount');

    const content = isMobile
      ? this.renderMobile(products, total, canDiscount)
      : this.renderDesktop(products, total, canDiscount);

    return LayoutComponents.layout(content, 'sales');
  },

  renderHeaderActions() {
    return `
<div class="flex gap-2">
  <button onclick="SalesPage.showRecentSalesModal()"
    class="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center gap-2">
    ${Components.icons.clipboard} Ventas recientes
  </button>
</div>`;
  },

  renderDesktop(products, total, canDiscount) {
    return `
<div class="animate-fade-in h-[calc(100vh-4rem)]">
  <div class="flex items-start justify-between gap-3 mb-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Punto de Venta</h1>
      <p class="text-slate-500 text-sm">Procesa ventas rápidamente</p>
    </div>
    ${this.renderHeaderActions()}
  </div>

  <div class="grid lg:grid-cols-2 gap-4 h-[calc(100%-5rem)]">
    ${this.renderProductsPanel(products)}
    ${this.renderCartPanel(total, canDiscount)}
  </div>
</div>
`;
  },

  renderMobile(products, total, canDiscount) {
    return `
<div class="animate-fade-in pb-32">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold text-slate-900">Punto de Venta</h1>
    <button onclick="SalesPage.showRecentSalesModal()"
      class="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">
      Recientes
    </button>
  </div>

  ${this.renderProductsPanel(products)}

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
      <button onclick="SalesPage.checkout(${canDiscount})" class="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-lg transition btn-press">
        Cobrar
      </button>
    </div>
  </div>
  ` : ''}
</div>
`;
  },

  renderProductsPanel(products) {
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
    </div>
    `}
  </div>
</div>
`;
  },

  renderCartPanel(total, canDiscount) {
    return `
<div class="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
  <div class="p-3 md:p-4 border-b border-slate-100 flex items-center justify-between">
    <h3 class="font-semibold text-slate-900 flex items-center gap-2">
      ${Components.icons.cart.replace('w-5 h-5', 'w-5 h-5 text-orange-500')}
      Carrito
    </h3>
    ${this.cart.length > 0 ? `<button onclick="SalesPage.clearCart()" class="text-sm text-red-500 hover:text-red-600">Vaciar</button>` : ''}
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
          <button onclick="SalesPage.updateQuantity(${index}, -1)" class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">${Components.icons.minus}</button>
          <span class="w-6 md:w-8 text-center font-semibold text-sm">${item.quantity}</span>
          <button onclick="SalesPage.updateQuantity(${index}, 1)" class="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">${Components.icons.plus.replace('w-5 h-5', 'w-4 h-4')}</button>
        </div>

        <div class="text-right w-16 md:w-20">
          <p class="font-bold text-slate-900 text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>

        <button onclick="SalesPage.removeFromCart(${index})" class="p-1 text-slate-400 hover:text-red-500 transition">${Components.icons.close.replace('w-6 h-6', 'w-5 h-5')}</button>
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
        <input type="text" id="pos-customer" placeholder="Público General" class="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm">
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-500 mb-1">Descuento (%)</label>
        <input type="number" id="pos-discount" min="0" max="100" value="0"
          ${canDiscount ? 'onchange="SalesPage.updateTotal()"' : 'disabled'}
          class="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm ${canDiscount ? '' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}">
        ${!canDiscount ? `<p class="text-[11px] text-slate-400 mt-1">Sin permiso para descuentos</p>` : ''}
      </div>
    </div>

    <div class="flex items-center justify-between mb-1 text-sm text-slate-500">
      <span>Subtotal</span>
      <span id="pos-subtotal">$${total.toFixed(2)}</span>
    </div>

    <div class="flex items-center justify-between mb-3 text-lg">
      <span class="font-bold text-slate-900">TOTAL</span>
      <span class="font-bold text-xl text-orange-600" id="pos-total-display">$${total.toFixed(2)}</span>
    </div>

    <button onclick="SalesPage.checkout(${canDiscount})"
      class="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition btn-press flex items-center justify-center gap-2"
      ${this.cart.length === 0 ? 'disabled' : ''}>
      ${Components.icons.dollar} Cobrar
    </button>
  </div>
</div>
`;
  },

  handleSearch(query) {
    this.searchQuery = query;
    this.rerender();
  },

  addToCart(productId) {
    const product = Store.products.getById(productId);
    if (!product || product.stock === 0) return;

    const idx = this.cart.findIndex(i => i.id === productId);
    if (idx >= 0) {
      if (this.cart[idx].quantity < product.stock) this.cart[idx].quantity++;
      else return Components.toast('Stock insuficiente', 'warning');
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.rerender();
  },

  updateQuantity(index, delta) {
    const item = this.cart[index];
    const product = Store.products.getById(item.id);
    const newQty = item.quantity + delta;
    if (newQty <= 0) return this.removeFromCart(index);
    if (newQty > product.stock) return Components.toast('Stock insuficiente', 'warning');
    this.cart[index].quantity = newQty;
    this.rerender();
  },

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.rerender();
  },

  clearCart() {
    this.cart = [];
    this.rerender();
  },

  showCartModal() {
    const total = this.cart.reduce((s, it) => s + (it.price * it.quantity), 0);
    Components.modal({
      title: `Carrito (${this.cart.length} items)`,
      content: `
<div class="max-h-60 overflow-y-auto space-y-2 mb-4">
  ${this.cart.map(item => `
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
    if (discountPercent < 0) discountPercent = 0;
    if (discountPercent > 100) discountPercent = 100;

    const discountAmount = subtotal * (discountPercent / 100);
    const total = Math.max(0, subtotal - discountAmount);

    const totalEl = document.getElementById('pos-total-display');
    const subtotalEl = document.getElementById('pos-subtotal');
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  },

  toggleCashFields(method) {
    const cashBox = document.getElementById('cash-fields');
    if (!cashBox) return;
    cashBox.classList.toggle('hidden', method !== 'cash');
  },

  checkout(canDiscount = true) {
    if (this.cart.length === 0) return;

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountPercent = canDiscount ? (parseFloat(document.getElementById('pos-discount')?.value) || 0) : 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = Math.max(0, subtotal - discountAmount);
    const customer = document.getElementById('pos-customer')?.value || 'Público General';
    const ticketCfg = Store.get(Store.KEYS.TICKET_CONFIG) || {};

    Components.modal({
      title: 'Confirmar Venta',
      content: `
<div class="space-y-4">
  <div class="text-center">
    <p class="text-sm text-slate-500 mb-1">${customer}</p>
    <p class="text-3xl font-bold text-orange-600 mb-2">$${total.toFixed(2)}</p>
    ${discountPercent > 0 ? `<p class="text-xs text-green-600 mb-2">Descuento: ${discountPercent}% (-$${discountAmount.toFixed(2)})</p>` : ''}
    <p class="text-sm text-slate-500">${this.cart.length} productos</p>
  </div>

  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Método de pago</label>
      <select id="pay-method" onchange="SalesPage.toggleCashFields(this.value)"
        class="w-full px-3 py-2 rounded-lg border border-slate-200">
        <option value="cash">Efectivo</option>
        <option value="card">Tarjeta</option>
        <option value="transfer">Transferencia</option>
        <option value="other">Otro</option>
      </select>
    </div>

    <div id="cash-fields" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Efectivo recibido</label>
        <input type="number" id="cash-received" step="0.01" value="${total.toFixed(2)}"
          class="w-full px-3 py-2 rounded-lg border border-slate-200">
        <p class="text-xs text-slate-500 mt-1">Si el cliente paga exacto, deja el mismo total.</p>
      </div>
    </div>
  </div>
</div>
`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        const method = document.getElementById('pay-method')?.value || 'cash';

        let paidAmount = total;
        let change = 0;

        if (method === 'cash') {
          paidAmount = parseFloat(document.getElementById('cash-received')?.value || '0') || 0;
          if (paidAmount < total) {
            Components.toast('Efectivo insuficiente', 'error');
            return false;
          }
          change = paidAmount - total;
        }

        // Actualizar stock
        this.cart.forEach(item => Store.products.updateStock(item.id, item.quantity));

        // Guardar venta con info de pago
        const sale = Store.sales.add({
          items: this.cart.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
          subtotal,
          discount: discountAmount,
          total,
          customer,
          paymentMethod: method,
          paidAmount,
          change
        });

        this.cart = [];
        this.rerender();
        Components.toast('Venta realizada', 'success');

        // Impresión
        if (window.TicketPrinter) {
          if (ticketCfg.autoPrint) {
            TicketPrinter.printSale(sale, { auto: true });
          } else {
            Components.modal({
              title: 'Ticket',
              content: `
<p class="text-slate-600 text-sm mb-2">¿Deseas imprimir el ticket de esta venta?</p>
<div class="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
  <div class="flex justify-between"><span>Ticket</span><span>#${String(sale.id).slice(-6)}</span></div>
  <div class="flex justify-between"><span>Pago</span><span>${SalesPage._paymentLabel(sale.paymentMethod)}</span></div>
  <div class="flex justify-between font-bold text-orange-600"><span>Total</span><span>$${sale.total.toFixed(2)}</span></div>
  ${sale.paymentMethod === 'cash' ? `<div class="flex justify-between"><span>Cambio</span><span>$${sale.change.toFixed(2)}</span></div>` : ''}
</div>
`,
              confirmText: 'Imprimir',
              cancelText: 'No imprimir',
              onConfirm: () => TicketPrinter.printSale(sale, { auto: true })
            });
          }
        }

        return true;
      }
    });

    // Asegurar estado inicial correcto
    setTimeout(() => this.toggleCashFields('cash'), 0);
  },

  _paymentLabel(method) {
    const map = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      other: 'Otro'
    };
    return map[method] || 'Efectivo';
  },

  showRecentSalesModal() {
    const sales = Store.sales.getAll().slice(-15).reverse();
    if (!sales.length) {
      Components.toast('No hay ventas aún', 'info');
      return;
    }

    Components.modal({
      title: 'Ventas recientes',
      content: `
<div class="space-y-2 max-h-64 overflow-y-auto">
  ${sales.map(s => `
  <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
    <div>
      <p class="text-sm font-semibold text-slate-900">
        #${String(s.id).slice(-6)}
        <span class="text-xs text-slate-400">(${new Date(s.date).toLocaleString('es')})</span>
      </p>
      <p class="text-xs text-slate-500">
        ${(s.customer || 'Público General')} • ${(s.items||[]).reduce((a,i)=>a+(i.qty||0),0)} items • ${SalesPage._paymentLabel(s.paymentMethod || 'cash')}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <span class="font-bold text-orange-600">$${Number(s.total||0).toFixed(2)}</span>
      <button onclick="SalesPage.printSaleById(${s.id})" class="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg" title="Imprimir">
        ${Components.icons.receipt}
      </button>
    </div>
  </div>
  `).join('')}
</div>
`,
      confirmText: 'Cerrar',
      cancelText: ''
    });
  },

  printSaleById(id) {
    const sale = Store.sales.getAll().find(s => s.id === id);
    if (!sale) return;
    if (!window.TicketPrinter) return Components.toast('TicketPrinter no está cargado', 'error');
    TicketPrinter.printSale(sale, { auto: true });
  }
};

Router.register('sales', () => SalesPage.render());
