/**
 * Donations Module
 * Stock Desk Application
 * Manejo de donaciones para Cuba e Internacional
 */

const DonationsModule = {
    // DATOS DE DONACIÓN
    config: {
        cuba: {
            transfermovil: '9205069994031473',
            phone: '+53 52678747'
        },
        international: {
            qvapay_user: 'stockdeskoficial',
            qvapay_link: 'https://qvapay.com/payme/stockdeskoficial'
        }
    },

    openModal() {
        Components.modal({
            title: 'Apoyar el Desarrollo 🇨🇺',
            content: this.renderContent(),
            confirmText: 'Entendido',
            cancelText: 'Cerrar', // Botón visible
            onConfirm: () => true
        });
        setTimeout(() => this.setupTabs(), 100);
    },

    renderContent() {
        return `
            <div class="space-y-5">
                <p class="text-slate-600 text-sm">
                    Soy un desarrollador independiente. Tu aporte ayuda a mantener Stock Desk <strong>gratuito</strong> y libre de anuncios.
                </p>

                <!-- Tabs Estilizados -->
                <div class="flex bg-slate-100 p-1 rounded-xl mb-4">
                    <button id="tab-cuba" onclick="DonationsModule.switchTab('cuba')" 
                            class="flex-1 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-white/50 transition">
                        🇨🇺 Cuba
                    </button>
                    <button id="tab-intl" onclick="DonationsModule.switchTab('intl')" 
                            class="flex-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition">
                        🌍 Internacional
                    </button>
                </div>

                <!-- Content Cuba -->
                <div id="content-cuba" class="space-y-4 animate-fade-in">
                    
                    <!-- Tarjeta Visual -->
                    <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 text-white shadow-lg shadow-blue-500/30 group cursor-pointer transition-transform transform hover:scale-[1.02]"
                         onclick="DonationsModule.copyToClipboard('${this.config.cuba.transfermovil}')">
                        <div class="absolute top-0 right-0 p-4 opacity-10">
                            <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10h16v10H4zM4 6h16v2H4z"></path></svg>
                        </div>
                        <div class="relative z-10">
                            <div class="flex justify-between items-start mb-6">
                                <div class="opacity-80 text-xs tracking-widest font-bold">BANDEC / CUP</div>
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div class="font-mono text-xl tracking-widest mb-4 flex items-center gap-2">
                                <span>${this.formatCard(this.config.cuba.transfermovil)}</span>
                                <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </div>
                            <div class="flex justify-between items-end">
                                <div>
                                    <p class="text-[10px] opacity-70">TITULAR</p>
                                    <p class="text-sm font-medium">STOCK DESK DEV</p>
                                </div>
                                <div class="text-[10px] bg-white/20 px-2 py-1 rounded">SOLO DEPÓSITOS</div>
                            </div>
                        </div>
                    </div>

                    <!-- Opción Móvil -->
                    <div class="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-orange-300 transition group"
                         onclick="DonationsModule.copyToClipboard('${this.config.cuba.phone}')">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <p class="font-bold text-slate-900">Recarga Móvil</p>
                                <p class="text-xs text-slate-500 font-mono">${this.config.cuba.phone}</p>
                            </div>
                        </div>
                        <button class="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">Copiar</button>
                    </div>
                </div>

                <!-- Content Internacional -->
                <div id="content-intl" class="space-y-4 hidden animate-fade-in">
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div class="flex items-center gap-3 mb-3">
                            <!-- SVG reemplaza al emoji -->
                            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <p class="font-bold text-slate-900">QvaPay</p>
                                <p class="text-xs text-slate-500">Pasarela de pagos cripto</p>
                            </div>
                        </div>
                        <a href="${this.config.international.qvapay_link}" target="_blank" 
                           class="block w-full py-2 bg-slate-900 text-white text-center rounded-lg hover:bg-slate-800 transition mb-2">
                            Pagar con QvaPay
                        </a>
                        <p class="text-xs text-center text-slate-400">Usuario: @${this.config.international.qvapay_user}</p>
                    </div>
                </div>
            </div>
        `;
    },

    formatCard(number) {
        return number.replace(/(\d{4})/g, '$1 ').trim();
    },

    switchTab(tab) {
        const contentCuba = document.getElementById('content-cuba');
        const contentIntl = document.getElementById('content-intl');
        const tabCuba = document.getElementById('tab-cuba');
        const tabIntl = document.getElementById('tab-intl');

        const activeClass = ['bg-white', 'text-slate-900', 'shadow-sm'];
        const inactiveClass = ['text-slate-500', 'hover:text-slate-700'];

        if (tab === 'cuba') {
            contentCuba.classList.remove('hidden');
            contentIntl.classList.add('hidden');
            
            tabCuba.classList.add(...activeClass);
            tabCuba.classList.remove(...inactiveClass);
            
            tabIntl.classList.remove(...activeClass);
            tabIntl.classList.add(...inactiveClass);
        } else {
            contentCuba.classList.add('hidden');
            contentIntl.classList.remove('hidden');
            
            tabIntl.classList.add(...activeClass);
            tabIntl.classList.remove(...inactiveClass);
            
            tabCuba.classList.remove(...activeClass);
            tabCuba.classList.add(...inactiveClass);
        }
    },

    setupTabs() {
        // Asegurar que el estado inicial visual sea correcto
        this.switchTab('cuba');
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            Components.toast('Copiado al portapapeles', 'success');
        }).catch(() => {
            Components.toast('Error al copiar', 'error');
        });
    },

    // --- LÓGICA DE SOLICITUD INTELIGENTE ---

    tryShowSupportModal() {
        // 1. Verificar si ya donó o si lo pospuso recientemente
        const status = Store.get('stockdesk_support_status') || { donated: false, lastPrompt: 0 };
        
        if (status.donated) return; // Ya es un héroe, no molestar

        // Verificar tiempo (ej: no mostrar más de una vez cada 3 días)
        const now = Date.now();
        const daysInMs = 3 * 24 * 60 * 60 * 1000; 
        if (now - status.lastPrompt < daysInMs) return;

        // 2. Verificar Impacto (¿Está usando la app?)
        const products = Store.products.getAll().length;
        const sales = Store.sales.getAll().length;

        // Solo mostrar si tiene > 5 productos o > 2 ventas (Usuario activo)
        if (products > 5 || sales > 2) {
            this.showPersuasiveModal();
            
            // Guardar que ya se mostró hoy
            status.lastPrompt = now;
            Store.set('stockdesk_support_status', status);
        }
    },

    showPersuasiveModal() {
        // Un modal diferente, más emocional y bonito
        const content = `
            <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/30 animate-pulse-custom">
                    <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                
                <h3 class="text-2xl font-bold text-slate-900 mb-3">¿Te está siendo útil Stock Desk?</h3>
                
                <p class="text-slate-600 mb-6 leading-relaxed">
                    Hola, soy el desarrollador detrás de esta herramienta. He creado Stock Desk para ayudar a negocios como el tuyo a crecer, 
                    <strong>totalmente gratis y sin publicidad</strong>.
                </p>

                <div class="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6 text-left">
                    <p class="text-sm text-orange-800 font-medium mb-1">💡 Realidad de Desarrollo:</p>
                    <p class="text-sm text-orange-700">
                        Mantener actualizaciones y soporte requiere tiempo completo. Como desarrollador independiente en Cuba 🇨🇺, 
                        tu apoyo directo es lo único que mantiene este proyecto vivo.
                    </p>
                </div>

                <p class="text-slate-600 text-sm mb-6">
                    Si has logrado organizar tu inventario o mejorar tus ventas gracias a la app, 
                    ¿considerarías invitarme un café (o una recarga)?
                </p>

                <div class="flex flex-col gap-3">
                    <button id="btn-donate-now" class="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition transform hover:scale-[1.02]">
                        ¡Sí, quiero apoyar! ❤️
                    </button>
                    <button id="btn-maybe-later" class="w-full py-3 bg-white text-slate-400 hover:text-slate-600 font-medium text-sm transition">
                        Ahora no, quizás después
                    </button>
                </div>
            </div>
        `;

        // Usamos Components.modal pero personalizamos los botones
        const container = document.getElementById('modal-container');
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade-in';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden relative">
                <div class="p-6 md:p-8">
                    ${content}
                </div>
            </div>
        `;

        container.appendChild(modal);

        // Eventos manuales para este modal personalizado
        document.getElementById('btn-donate-now').addEventListener('click', () => {
            modal.remove();
            this.openModal(); // Abre el modal de pago real
        });

        document.getElementById('btn-maybe-later').addEventListener('click', () => {
            modal.remove();
            Components.toast('Entendido. ¡Gracias por usar Stock Desk!', 'info');
        });
    }
};
