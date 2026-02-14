/**
 * Customization Tickets Module
 * Stock Desk Application
 */

const CustomizationTickets = {
    render() {
        const ticketConfig = Store.get('stockdesk_ticket_config') || {
            showLogo: true,
            showDate: true,
            showCashier: true,
            header: 'Stock Desk',
            footer: 'Gracias por su compra',
            width: '80mm'
        };

        return `
            <div class="grid lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 class="font-semibold text-slate-900 mb-4">Configuración del Ticket</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Encabezado</label>
                                <input type="text" id="ticket-header" value="${ticketConfig.header}" 
                                       class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Pie de Ticket</label>
                                <textarea id="ticket-footer" rows="2" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">${ticketConfig.footer}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Ancho del Papel</label>
                                <select id="ticket-width" class="w-full px-4 py-2.5 rounded-lg border border-slate-200">
                                    <option value="58mm" ${ticketConfig.width === '58mm' ? 'selected' : ''}>58mm</option>
                                    <option value="80mm" ${ticketConfig.width === '80mm' ? 'selected' : ''}>80mm</option>
                                    <option value="A4" ${ticketConfig.width === 'A4' ? 'selected' : ''}>A4</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 class="font-semibold text-slate-900 mb-4">Elementos a Mostrar</h3>
                        <div class="space-y-3">
                            ${this.renderToggle('show-logo', 'Mostrar Logo', ticketConfig.showLogo)}
                            ${this.renderToggle('show-date', 'Mostrar Fecha y Hora', ticketConfig.showDate)}
                            ${this.renderToggle('show-cashier', 'Mostrar Cajero', ticketConfig.showCashier)}
                            ${this.renderToggle('show-customer', 'Mostrar Cliente', false)}
                            ${this.renderToggle('show-barcode', 'Código de Barras', false)}
                        </div>
                    </div>

                    <button onclick="CustomizationTickets.save()" class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl">
                        Guardar Configuración
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 class="font-semibold text-slate-900 mb-4">Vista Previa</h3>
                    <div class="flex justify-center">
                        <div class="bg-white border-2 border-dashed border-slate-300 p-4 w-64 font-mono text-xs">
                            <div class="text-center mb-3">
                                <p class="font-bold text-sm">${ticketConfig.header}</p>
                                <p class="text-slate-500">RFC: XXXX000000XXX</p>
                            </div>
                            <div class="border-t border-dashed border-slate-300 my-2"></div>
                            <div class="mb-2">
                                <p>Fecha: ${new Date().toLocaleDateString('es')}</p>
                                <p>Hora: ${new Date().toLocaleTimeString('es')}</p>
                                <p>Cajero: Usuario</p>
                                <p>Ticket: #000001</p>
                            </div>
                            <div class="border-t border-dashed border-slate-300 my-2"></div>
                            <div class="space-y-1 mb-2">
                                <div class="flex justify-between">
                                    <span>Producto 1</span>
                                    <span>$50.00</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Producto 2</span>
                                    <span>$35.00</span>
                                </div>
                            </div>
                            <div class="border-t border-dashed border-slate-300 my-2"></div>
                            <div class="flex justify-between font-bold">
                                <span>TOTAL:</span>
                                <span>$85.00</span>
                            </div>
                            <div class="border-t border-dashed border-slate-300 my-2"></div>
                            <div class="text-center">
                                <p>${ticketConfig.footer}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderToggle(id, label, checked) {
        return `
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span class="text-sm font-medium text-slate-700">${label}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
            </div>
        `;
    },

    save() {
        const config = {
            header: document.getElementById('ticket-header')?.value || 'Stock Desk',
            footer: document.getElementById('ticket-footer')?.value || 'Gracias',
            width: document.getElementById('ticket-width')?.value || '80mm',
            showLogo: document.getElementById('show-logo')?.checked ?? true,
            showDate: document.getElementById('show-date')?.checked ?? true,
            showCashier: document.getElementById('show-cashier')?.checked ?? true
        };
        Store.set('stockdesk_ticket_config', config);
        Components.toast('Configuración guardada', 'success');
    }
};
