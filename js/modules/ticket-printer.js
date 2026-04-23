/**
 * TicketPrinter - Ticket profesional (58/80/A4) con Pago/Cambio
 * FIX: usa Blob URL (evita que se muestre código fuente por error).
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
      autoPrint: cfg.autoPrint ?? false,
      showUnitPrice: cfg.showUnitPrice ?? true,
      showPayment: cfg.showPayment ?? true
    };
  },

  currency(amount) {
    const settings = Store.settings.get();
    const symbols = {
      USD: '$', MXN: '$', EUR: '€', COP: '$', CUP: '$', MLC: '$',
      ARS: '$', CLP: '$', PEN: 'S/', VES: 'Bs', BRL: 'R$', CAD: '$'
    };
    const sym = symbols[settings.currency] || '$';
    return `${sym}${Number(amount || 0).toFixed(2)}`;
  },

  _escapeHtml(str = '') {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  },

  _paymentLabel(method) {
    const map = { cash: 'Efectivo', card: 'Tarjeta', transfer: 'Transferencia', other: 'Otro' };
    return map[method] || 'Efectivo';
  },

  buildTicketHTML(sale, { autoPrint = true, widthOverride = null } = {}) {
    const settings = Store.settings.get();
    const user = Store.get(Store.KEYS.USER) || {};
    const cfg = this.getConfig();

    const width = widthOverride || cfg.width; // 58mm | 80mm | A4
    const is58 = width === '58mm';
    const is80 = width === '80mm';

    const pageWidthCss = is58 ? '58mm' : is80 ? '80mm' : '210mm';
    const baseFont = is58 ? 10 : is80 ? 11 : 12;
    const titleFont = is58 ? 12 : is80 ? 14 : 16;

    const logoHTML = (cfg.showLogo && settings.logo)
      ? `<img src="${settings.logo}" class="logo" alt="Logo">`
      : '';

    const dateHTML = cfg.showDate
      ? `<div class="row"><span>Fecha</span><span class="r">${new Date(sale.date).toLocaleString('es')}</span></div>`
      : '';

    const cashierHTML = cfg.showCashier
      ? `<div class="row"><span>Cajero</span><span class="r">${this._escapeHtml(user.username || user.name || 'Usuario')}</span></div>`
      : '';

    const customerHTML = (cfg.showCustomer && sale.customer)
      ? `<div class="row"><span>Cliente</span><span class="r">${this._escapeHtml(sale.customer)}</span></div>`
      : '';

    const items = sale.items || [];
    const subtotal = Number(sale.subtotal ?? items.reduce((s, i) => s + (Number(i.price) * Number(i.qty)), 0));
    const discount = Number(sale.discount ?? 0);
    const total = Number(sale.total ?? Math.max(0, subtotal - discount));

    // Pago/cambio
    const method = sale.paymentMethod || 'cash';
    const paidAmount = Number(sale.paidAmount ?? total);
    const change = Number(sale.change ?? Math.max(0, paidAmount - total));

    const paymentHTML = cfg.showPayment ? `
<div class="line"></div>
<div class="row"><span>Pago</span><span class="r">${this._paymentLabel(method)}</span></div>
${method === 'cash' ? `
  <div class="row"><span>Recibido</span><span class="r">${this.currency(paidAmount)}</span></div>
  <div class="row"><span>Cambio</span><span class="r">${this.currency(change)}</span></div>
` : ''}
` : '';

    // Items
    let itemsHTML = '';
    if (is58) {
      itemsHTML = items.map(i => {
        const name = this._escapeHtml(i.name || '').trim();
        const qty = Number(i.qty || 0);
        const price = Number(i.price || 0);
        const lineTotal = price * qty;
        return `
<div class="item58">
  <div class="name">${name}</div>
  <div class="meta">
    <span>${qty} x ${this.currency(price)}</span>
    <span class="r">${this.currency(lineTotal)}</span>
  </div>
</div>
`;
      }).join('');
    } else {
      const showUnitPrice = !!cfg.showUnitPrice;
      const tableHeader = showUnitPrice
        ? `<tr><th>Producto</th><th class="r">Cant</th><th class="r">P.Unit</th><th class="r">Importe</th></tr>`
        : `<tr><th>Producto</th><th class="r">Cant</th><th class="r">Importe</th></tr>`;

      const rows = items.map(i => {
        const name = this._escapeHtml(i.name || '');
        const qty = Number(i.qty || 0);
        const price = Number(i.price || 0);
        const lineTotal = price * qty;
        return showUnitPrice
          ? `
<tr>
  <td class="wrap">${name}</td>
  <td class="r nowrap">${qty}</td>
  <td class="r nowrap">${this.currency(price)}</td>
  <td class="r nowrap">${this.currency(lineTotal)}</td>
</tr>`
          : `
<tr>
  <td class="wrap">${name}</td>
  <td class="r nowrap">${qty}</td>
  <td class="r nowrap">${this.currency(lineTotal)}</td>
</tr>`;
      }).join('');

      itemsHTML = `<table><thead>${tableHeader}</thead><tbody>${rows}</tbody></table>`;
    }

    // IMPORTANTE: SIEMPRE empezar con <!doctype html>
    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Ticket</title>
<style>
  @page { margin: 0; }
  body {
    margin: 0;
    background: #fff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
    font-size: ${baseFont}px;
    line-height: 1.25;
  }
  .ticket { width: ${pageWidthCss}; padding: 10px 10px; box-sizing: border-box; }
  .center { text-align: center; }
  .logo { max-width: 130px; max-height: 80px; object-fit: contain; display:block; margin: 0 auto 6px; }
  h1 { font-size: ${titleFont}px; margin: 0 0 4px; }
  .muted { color: #444; font-size: ${baseFont - 1}px; }
  .line { border-top: 1px dashed #000; margin: 8px 0; }
  .row { display:flex; justify-content: space-between; gap: 10px; margin: 2px 0; }
  .r { text-align:right; }
  .nowrap { white-space: nowrap; }
  .wrap { word-break: break-word; overflow-wrap: anywhere; }
  table { width:100%; border-collapse: collapse; }
  th, td { padding: 4px 0; vertical-align: top; }
  th { text-align:left; border-bottom: 1px dashed #000; }
  th.r, td.r { text-align:right; }
  .totals { margin-top: 6px; }
  .big { font-weight: 800; font-size: ${baseFont + 2}px; }
  .footer { margin-top: 10px; font-size: ${baseFont}px; }
  .item58 { margin: 6px 0; }
  .item58 .name { font-weight: 600; word-break: break-word; overflow-wrap: anywhere; }
  .item58 .meta { display:flex; justify-content: space-between; gap: 8px; margin-top: 2px; }
  @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="ticket">
    <div class="center">
      ${logoHTML}
      <h1>${this._escapeHtml(cfg.header || settings.businessName || 'Mi Negocio')}</h1>
      ${settings.businessName ? `<div class="muted">${this._escapeHtml(settings.businessName)}</div>` : ''}
    </div>

    <div class="line"></div>

    <div class="row"><span>Ticket</span><span class="r nowrap">#${String(sale.id).slice(-6)}</span></div>
    ${dateHTML}
    ${cashierHTML}
    ${customerHTML}

    <div class="line"></div>

    ${itemsHTML}

    <div class="line"></div>

    <div class="totals">
      <div class="row"><span>Subtotal</span><span class="r">${this.currency(subtotal)}</span></div>
      ${discount > 0 ? `<div class="row"><span>Descuento</span><span class="r">- ${this.currency(discount)}</span></div>` : ''}
      <div class="row big"><span>TOTAL</span><span class="r">${this.currency(total)}</span></div>
    </div>

    ${paymentHTML}

    <div class="line"></div>
    <div class="center footer">${this._escapeHtml(cfg.footer || 'Gracias por su compra')}</div>
  </div>

<script>
  const AUTO = ${autoPrint ? 'true' : 'false'};
  if (AUTO) {
    setTimeout(() => { window.focus(); window.print(); }, 250);
  }
</script>
</body>
</html>`;
  },

  // FIX: abrir como Blob URL para que SIEMPRE sea HTML válido
  _openHtmlAsBlob(html) {
    if (typeof html !== 'string' || !html.trim().toLowerCase().startsWith('<!doctype html')) {
      console.error('Ticket HTML inválido. Inicio:', String(html).slice(0, 80));
      Components.toast('Error generando ticket (HTML inválido). Reemplaza ticket-printer.js y limpia caché.', 'error', 5000);
      return null;
    }

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const w = window.open(url, '_blank', 'noopener,noreferrer,width=420,height=720');
    if (!w) {
      URL.revokeObjectURL(url);
      Components.toast('Bloqueo de popups: permite ventanas emergentes para imprimir', 'error');
      return null;
    }

    // liberar URL luego
    setTimeout(() => URL.revokeObjectURL(url), 15000);
    return w;
  },

  printSale(sale, { auto = true } = {}) {
    const html = this.buildTicketHTML(sale, { autoPrint: auto });
    this._openHtmlAsBlob(html);
  },

  printTest() {
    const dummy = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: 'Público General',
      items: [
        { name: 'Producto largo para probar que NO se corte en 58mm y que se reorganice', qty: 2, price: 10 },
        { name: 'Otro producto', qty: 1, price: 5.5 }
      ],
      subtotal: 25.5,
      discount: 0,
      total: 25.5,
      paymentMethod: 'cash',
      paidAmount: 30,
      change: 4.5
    };
    this.printSale(dummy, { auto: true });
  }
};
