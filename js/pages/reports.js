/**
 * Reports Page - con Exportar PDF real (print)
 * Stock Desk Application
 */
const ReportsPage = {
  dateFrom: null,
  dateTo: null,

  init() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    this.dateFrom = weekAgo.toISOString().split('T')[0];
    this.dateTo = today.toISOString().split('T')[0];
  },

  render() {
    if (!this.dateFrom) this.init();

    const filteredSales = this.getFilteredSales();
    const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.total || 0), 0);
    const topProduct = this.getTopProduct(filteredSales);
    const dailySales = this.getDailySales(filteredSales);
    const maxDaily = Math.max(...Object.values(dailySales), 1);

    const content = `
<div class="animate-fade-in">
  <div class="mb-6">
    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Reportes</h1>
    <p class="text-slate-500 text-sm">Analiza el rendimiento de tu negocio</p>
  </div>

  <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-3 md:p-4 mb-4 md:mb-6">
    <div class="flex flex-wrap items-center gap-3 md:gap-4">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-slate-600">Desde:</label>
        <input type="date" value="${this.dateFrom}" onchange="ReportsPage.updateDateFrom(this.value)"
          class="px-3 py-2 rounded-lg border border-slate-200 focus:border-orange-500 transition text-sm">
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-slate-600">Hasta:</label>
        <input type="date" value="${this.dateTo}" onchange="ReportsPage.updateDateTo(this.value)"
          class="px-3 py-2 rounded-lg border border-slate-200 focus:border-orange-500 transition text-sm">
      </div>

      <button onclick="ReportsPage.resetDates()" class="px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition">
        Última semana
      </button>

      <div class="ml-auto flex gap-2">
        <button onclick="ReportsPage.exportCSV()"
          class="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-2">
          ${Components.icons.clipboard} CSV
        </button>
        <button onclick="ReportsPage.exportPDF()"
          class="px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition flex items-center gap-2">
          ${Components.icons.receipt} PDF
        </button>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6">
    ${Components.statCard('Ventas del Periodo', `$${totalRevenue.toFixed(2)}`, Components.icons.dollar, 'green')}
    ${Components.statCard('Transacciones', filteredSales.length.toString(), Components.icons.clipboard, 'blue')}
    ${Components.statCard('Producto Top', topProduct || 'N/A', Components.icons.star, 'orange')}
  </div>

  <div class="grid lg:grid-cols-2 gap-4 md:gap-6">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
      <h3 class="font-semibold text-slate-900 mb-4 md:mb-6">Ventas por Día</h3>
      <div class="space-y-3 md:space-y-4">
        ${Object.entries(dailySales).slice(-7).map(([date, amount]) => {
          const percentage = (amount / maxDaily) * 100;
          return `
          <div class="flex items-center gap-3 md:gap-4">
            <span class="text-xs md:text-sm text-slate-500 w-16 md:w-24">${this.formatDate(date)}</span>
            <div class="flex-1 h-6 md:h-8 bg-slate-100 rounded-lg overflow-hidden">
              <div class="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg"
                style="width: ${percentage}%"></div>
            </div>
            <span class="text-xs md:text-sm font-semibold text-slate-700 w-16 md:w-20 text-right">$${amount.toFixed(2)}</span>
          </div>`;
        }).join('') || `<div class="text-center py-8 text-slate-400"><p>No hay datos</p></div>`}
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
      <h3 class="font-semibold text-slate-900 mb-4 md:mb-6">Historial de Ventas</h3>
      <div class="max-h-72 md:max-h-96 overflow-y-auto">
        ${filteredSales.length > 0 ? `
        <div class="space-y-2 md:space-y-3">
          ${filteredSales.slice().reverse().slice(0, 20).map(sale => `
          <div class="flex items-center justify-between p-2 md:p-3 bg-slate-50 rounded-lg">
            <div>
              <p class="font-medium text-slate-900 text-sm">#${sale.id.toString().slice(-6)}</p>
              <p class="text-xs text-slate-500">${new Date(sale.date).toLocaleString('es')}</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-right mr-2">
                <p class="font-bold text-orange-600 text-sm md:text-base">$${(sale.total || 0).toFixed(2)}</p>
                <p class="text-xs text-slate-500">${sale.customer || 'Público General'}</p>
              </div>
              <button onclick="ReportsPage.printSale(${sale.id})"
                class="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg" title="Imprimir">
                ${Components.icons.receipt}
              </button>
            </div>
          </div>
          `).join('')}
        </div>` : `<div class="p-8 text-center text-slate-400">No hay ventas</div>`}
      </div>
    </div>
  </div>
</div>
`;
    return LayoutComponents.layout(content, 'reports');
  },

  getFilteredSales() {
    const sales = Store.sales.getAll();
    const from = new Date(this.dateFrom); from.setHours(0, 0, 0, 0);
    const to = new Date(this.dateTo); to.setHours(23, 59, 59, 999);
    return sales.filter(s => {
      const d = new Date(s.date);
      return d >= from && d <= to;
    });
  },

  getTopProduct(sales) {
    const counts = {};
    sales.forEach(s => (s.items || []).forEach(i => {
      counts[i.name] = (counts[i.name] || 0) + (i.qty || 0);
    }));
    let top = null, max = 0;
    Object.entries(counts).forEach(([name, qty]) => {
      if (qty > max) { max = qty; top = name; }
    });
    return top;
  },

  getDailySales(sales) {
    const daily = {};
    sales.forEach(s => {
      const key = s.date.split('T')[0];
      daily[key] = (daily[key] || 0) + (s.total || 0);
    });
    return daily;
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es', { day: '2-digit', month: 'short' });
  },

  updateDateFrom(v) { this.dateFrom = v; Router.navigate('reports', {}, { push: false }); },
  updateDateTo(v) { this.dateTo = v; Router.navigate('reports', {}, { push: false }); },
  resetDates() { this.init(); Router.navigate('reports', {}, { push: false }); },

  exportCSV() {
    const sales = this.getFilteredSales();
    const csv = [
      'ID,Fecha,Cliente,Subtotal,Descuento,Total,Items',
      ...sales.map(s => {
        const items = (s.items || []).reduce((acc, i) => acc + (i.qty || 0), 0);
        return `"${String(s.id).slice(-6)}","${s.date}","${(s.customer || '').replaceAll('"', '""')}","${(s.subtotal || 0)}","${(s.discount || 0)}","${(s.total || 0)}","${items}"`;
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas-${this.dateFrom}-${this.dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    Components.toast('CSV exportado', 'success');
  },

  exportPDF() {
    const sales = this.getFilteredSales();
    const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
    const business = Store.settings.get().businessName || 'Mi Negocio';

    const html = `
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Reporte</title>
<style>
  body { font-family: Inter, Arial, sans-serif; margin: 20px; color: #111; }
  h1 { margin: 0 0 6px; }
  .muted { color: #555; font-size: 12px; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 14px; }
  th, td { border-bottom: 1px solid #eee; padding: 8px; font-size: 12px; text-align: left; }
  th { background: #f5f5f5; }
  .r { text-align: right; }
  .kpi { display:flex; gap:12px; margin-top:12px; }
  .card { border:1px solid #eee; padding:10px; border-radius:10px; flex:1; }
  .big { font-size: 18px; font-weight: 700; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>Reporte de Ventas</h1>
  <div class="muted">${business} • Periodo: ${this.dateFrom} a ${this.dateTo} • Generado: ${new Date().toLocaleString('es')}</div>

  <div class="kpi">
    <div class="card"><div class="muted">Total ventas</div><div class="big">${sales.length}</div></div>
    <div class="card"><div class="muted">Ingresos</div><div class="big">$${totalRevenue.toFixed(2)}</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th class="r">Total</th>
      </tr>
    </thead>
    <tbody>
      ${sales.slice().reverse().map(s => `
        <tr>
          <td>#${String(s.id).slice(-6)}</td>
          <td>${new Date(s.date).toLocaleString('es')}</td>
          <td>${(s.customer || 'Público General')}</td>
          <td class="r">$${Number(s.total || 0).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

<script>
  setTimeout(() => { window.focus(); window.print(); }, 200);
</script>
</body>
</html>
`;
    const w = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
    if (!w) {
      Components.toast('Permite popups para exportar PDF', 'error');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  },

  printSale(id) {
    const sale = Store.sales.getAll().find(s => s.id === id);
    if (!sale) return;
    if (!window.TicketPrinter) return Components.toast('TicketPrinter no está cargado', 'error');
    TicketPrinter.printSale(sale, { auto: true });
  }
};

Router.register('reports', () => ReportsPage.render());
