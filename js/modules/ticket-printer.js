/**
 * TicketPrinter - impresión real con window.print()
 * Funciona en GitHub Pages (estático).
 */
window.TicketPrinter = {
  getConfig() {
    const cfg = Store.get(Store.KEYS.TICKET_CONFIG) || {};
    return {
      header: cfg.header ?? 'Stock Desk',
      footer: cfg.footer ?? 'Gracias por su compra',
      width: cfg.width ?? '80mm',
      showLogo: cfg.showLogo ?? true,
      showDate: cfg.showDate ?? true,
      showCashier: cfg.showCashier ?? true,
      showCustomer: cfg.showCustomer ?? false,
      autoPrint: cfg.autoPrint ?? false
    };
  },

  currency(amount) {
    // No dependemos de App.formatCurrency aquí
    const settings = Store.settings.get();
    const symbols = { USD: '$', MXN: '$', EUR: '€', COP: '$', CUP: '$', MLC: '$' };
    const sym = symbols[settings.currency] || '$';
    return `${sym}${Number(amount || 0).toFixed(2)}`;
  },

  buildTicketHTML(sale, options = {}) {
    const settings = Store.settings.get();
    const user = Store.get(Store.KEYS.USER) || {};
    const cfg = this.getConfig();

    const width = options.width || cfg.width; // "58mm" | "80mm" | "A4"
    const pageWidthCss =
      width === '58mm' ? '58mm' :
      width === '80mm' ? '80mm' :
      '210mm';

    const logoHTML = (cfg.showLogo && settings.logo)
      ? `<img src="${settings.logo}" class="logo" alt="Logo">`
      : '';

    const dateHTML = cfg.showDate
      ? `<div class="row"><span>Fecha:</span><span>${new Date(sale.date).toLocaleString('es')}</span></div>`
      : '';

    const cashierHTML = cfg.showCashier
      ? `<div class="row"><span>Cajero:</span><span>${user.username || user.name || 'Usuario'}</span></div>`
      : '';

    const customerHTML = (cfg.showCustomer && sale.customer)
      ? `<div class="row"><span>Cliente:</span><span>${sale.customer}</span></div>`
      : '';

    const items = sale.items || [];
    const subtotal = sale.subtotal ?? items.reduce((s, i) => s + (i.price * i.qty), 0);
    const discount = sale.discount ?? 0;
    const total = sale.total ?? Math.max(0, subtotal - discount);

    return `
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Ticket</title>
<style>
  @page { margin: 0; }
  body {
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    background: #fff;
  }
  .ticket {
    width: ${pageWidthCss};
    padding: 10px 10px;
    box-sizing: border-box;
  }
  .center { text-align: center; }
  .logo { max-width: 120px; max-height: 80px; object-fit: contain; display:block; margin: 0 auto 6px; }
  h1 { font-size: 14px; margin: 0 0 6px; }
  .muted { color: #444; font-size: 11px; }
  .line { border-top: 1px dashed #000; margin: 8px 0; }
  .row { display: flex; justify-content: space-between; gap: 8px; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th, td { padding: 4px 0; vertical-align: top; }
  th { text-align: left; border-bottom: 1px dashed #000; }
  td.r, th.r { text-align: right; }
  .totals .row { font-size: 12px; }
  .big { font-weight: 700; font-size: 13px; }
  .footer { margin-top: 10px; font-size: 11px; }
  .nowrap { white-space: nowrap; }
  /* Para evitar que el navegador agregue headers/footers, el usuario debe desactivarlos en el diálogo de impresión */
</style>
</head>
<body>
  <div class="ticket">
    <div class="center">
      ${logoHTML}
      <h1>${cfg.header || (settings.businessName || 'Mi Negocio')}</h1>
      <div class="muted">${settings.businessName ? '' : 'Gestión de Inventario'}</div>
    </div>

    <div class="line"></div>

    <div class="row"><span>Ticket:</span><span class="nowrap">#${String(sale.id).slice(-6)}</span></div>
    ${dateHTML}
    ${cashierHTML}
    ${customerHTML}

    <div class="line"></div>

    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th class="r">Cant</th>
          <th class="r">Importe</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td>${(i.name || '').slice(0, 28)}</td>
            <td class="r">${i.qty}</td>
            <td class="r">${this.currency(i.price * i.qty)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="line"></div>

    <div class="totals">
      <div class="row"><span>Subtotal</span><span>${this.currency(subtotal)}</span></div>
      ${discount > 0 ? `<div class="row"><span>Descuento</span><span>- ${this.currency(discount)}</span></div>` : ''}
      <div class="row big"><span>TOTAL</span><span>${this.currency(total)}</span></div>
    </div>

    <div class="line"></div>

    <div class="center footer">${cfg.footer || 'Gracias por su compra'}</div>
  </div>

<script>
  // Auto imprimir si se solicita
  const AUTO = ${options.autoPrint ? 'true' : 'false'};
  if (AUTO) {
    setTimeout(() => {
      window.focus();
      window.print();
    }, 200);
  }
</script>
</body>
</html>
`;
  },

  printSale(sale, { auto = true } = {}) {
    const cfg = this.getConfig();
    const html = this.buildTicketHTML(sale, { autoPrint: auto });

    const w = window.open('', '_blank', 'noopener,noreferrer,width=420,height=720');
    if (!w) {
      Components.toast('Bloqueo de popups: permite ventanas emergentes para imprimir', 'error');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();

    if (!auto) {
      // Si no es auto, solo muestra el ticket (usuario imprime manualmente)
      w.focus();
    } else {
      // Intentar cerrar luego (algunos navegadores lo bloquean)
      setTimeout(() => {
        try { w.close(); } catch (_) {}
      }, 5000);
    }
  },

  printTest() {
    const dummy = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: 'Público General',
      items: [
        { name: 'Producto de prueba 1', qty: 2, price: 10 },
        { name: 'Producto de prueba 2', qty: 1, price: 5.5 }
      ],
      subtotal: 25.5,
      discount: 0,
      total: 25.5
    };
    this.printSale(dummy, { auto: true });
  }
};
