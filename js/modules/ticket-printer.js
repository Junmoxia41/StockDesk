/**
 * TicketPrinter - impresión profesional adaptable (58mm / 80mm / A4)
 * Stock Desk Application (static / GitHub Pages)
 */
window.TicketPrinter = {
  getConfig() {
    const cfg = Store.get(Store.KEYS.TICKET_CONFIG) || {};
    return {
      header: cfg.header ?? 'Stock Desk',
      footer: cfg.footer ?? 'Gracias por su compra',
      width: cfg.width ?? '80mm',          // recomendado
      showLogo: cfg.showLogo ?? true,
      showDate: cfg.showDate ?? true,
      showCashier: cfg.showCashier ?? true,
      showCustomer: cfg.showCustomer ?? false,
      autoPrint: cfg.autoPrint ?? false
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

  buildTicketHTML(sale, options = {}) {
    const settings = Store.settings.get();
    const user = Store.get(Store.KEYS.USER) || {};
    const cfg = this.getConfig();

    const width = options.width || cfg.width; // 58mm | 80mm | A4
    const is58 = width === '58mm';
    const is80 = width === '80mm';
    const isA4 = width === 'A4';

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

    // Render items: 58mm usa layout por líneas; 80mm/A4 usa tabla
    const itemsHTML = is58
      ? items.map(i => {
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
        }).join('')
      : `
<table>
  <thead>
    <tr>
      <th>Producto</th>
      <th class="r">Cant</th>
      <th class="r">Importe</th>
    </tr>
  </thead>
  <tbody>
    ${items.map(i => {
      const name = this._escapeHtml(i.name || '');
      const qty = Number(i.qty || 0);
      const price = Number(i.price || 0);
      return `
<tr>
  <td class="wrap">${name}</td>
  <td class="r nowrap">${qty}</td>
  <td class="r nowrap">${this.currency(price * qty)}</td>
</tr>`;
    }).join('')}
  </tbody>
</table>
`;

    const content = `
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
    background: #fff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: ${baseFont}px;
    line-height: 1.25;
  }
  .ticket {
    width: ${pageWidthCss};
    padding: ${isA4 ? '16px 18px' : '10px 10px'};
    box-sizing: border-box;
  }
  .center { text-align: center; }
  .logo { max-width: ${is58 ? '90px' : '130px'}; max-height: 80px; object-fit: contain; display:block; margin: 0 auto 6px; }
  h1 { font-size: ${titleFont}px; margin: 0 0 4px; }
  .muted { color: #444; font-size: ${baseFont - 1}px; }
  .line { border-top: 1px dashed #000; margin: 8px 0; }
  .row { display: flex; justify-content: space-between; gap: 10px; margin: 2px 0; }
  .r { text-align: right; }
  .nowrap { white-space: nowrap; }
  .wrap { word-break: break-word; overflow-wrap: anywhere; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 4px 0; vertical-align: top; }
  th { text-align: left; border-bottom: 1px dashed #000; }
  th.r, td.r { text-align: right; }
  .totals { margin-top: 6px; }
  .big { font-weight: 800; font-size: ${baseFont + 2}px; }
  .footer { margin-top: 10px; font-size: ${baseFont}px; }
  /* Layout especial 58mm: evita corte y reorganiza */
  .item58 { margin: 6px 0; }
  .item58 .name { font-weight: 600; word-break: break-word; overflow-wrap: anywhere; }
  .item58 .meta { display:flex; justify-content: space-between; gap: 8px; margin-top: 2px; }
  /* Impresión: evita fondos extra */
  @media print {
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { background: #fff !important; }
  }
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

    <div class="row">
      <span>Ticket</span><span class="r nowrap">#${String(sale.id).slice(-6)}</span>
    </div>
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

    <div class="line"></div>
    <div class="center footer">${this._escapeHtml(cfg.footer || 'Gracias por su compra')}</div>
  </div>

<script>
  const AUTO_PRINT = ${options.autoPrint ? 'true' : 'false'};
  const AUTO_CLOSE = ${options.autoClose ? 'true' : 'false'};

  if (AUTO_PRINT) {
    setTimeout(() => {
      window.focus();
      window.print();
    }, 250);

    window.onafterprint = () => {
      if (AUTO_CLOSE) {
        setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
      }
    };
  }
</script>
</body>
</html>
`;
    return content;
  },

  openTicketWindow(html) {
    const w = window.open('', '_blank', 'noopener,noreferrer,width=420,height=720');
    if (!w) {
      Components.toast('Bloqueo de popups: permite ventanas emergentes para imprimir', 'error');
      return null;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    return w;
  },

  printSale(sale, { auto = true } = {}) {
    const cfg = this.getConfig();
    const html = this.buildTicketHTML(sale, {
      autoPrint: auto,
      autoClose: auto,        // intentamos cerrar
      width: cfg.width
    });

    const w = this.openTicketWindow(html);
    if (!w) return;

    if (!auto) w.focus();
  },

  previewSale(sale) {
    const cfg = this.getConfig();
    const html = this.buildTicketHTML(sale, {
      autoPrint: false,
      autoClose: false,
      width: cfg.width
    });
    const w = this.openTicketWindow(html);
    if (w) w.focus();
  },

  printTest() {
    const dummy = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: 'Público General',
      items: [
        { name: 'Producto con nombre largo para probar que NO se corte en 58mm', qty: 2, price: 10 },
        { name: 'Otro producto', qty: 1, price: 5.5 }
      ],
      subtotal: 25.5,
      discount: 0,
      total: 25.5
    };
    this.printSale(dummy, { auto: true });
  }
};
