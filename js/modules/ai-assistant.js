/**
 * AI Assistant Module - ChatGLM Integration
 * Stock Desk Application
 */

const AIAssistant = {
    isOpen: false,
    messages: [],
    isLoading: false,
    
    // API Configuration (GLM/ZhipuAI)
    config: {
        apiKey: '', // Se configura en settings
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        model: 'glm-4-flash',
        maxTokens: 1024
    },

    init() {
        this.messages = Store.get('stockdesk_ai_messages') || [];
        this.config.apiKey = Store.get('stockdesk_ai_apikey') || '';
        this.injectStyles();
        this.render();
    },

    injectStyles() {
        if (document.getElementById('ai-styles')) return;
        const style = document.createElement('style');
        style.id = 'ai-styles';
        style.textContent = `
            .ai-fab { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
            .ai-panel { position: fixed; bottom: 100px; right: 24px; width: 380px; max-width: calc(100vw - 48px); 
                        height: 500px; max-height: calc(100vh - 150px); z-index: 1000; display: none; }
            .ai-panel.open { display: flex; }
            .ai-messages { flex: 1; overflow-y: auto; }
            .ai-message { max-width: 85%; }
            .ai-typing { display: inline-flex; gap: 4px; }
            .ai-typing span { width: 8px; height: 8px; background: #f97316; border-radius: 50%; 
                             animation: typing 1.4s infinite; }
            .ai-typing span:nth-child(2) { animation-delay: 0.2s; }
            .ai-typing span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
            @media (max-width: 768px) {
                .ai-panel { bottom: 0; right: 0; left: 0; width: 100%; max-width: 100%; 
                           height: 70vh; border-radius: 1rem 1rem 0 0; }
                .ai-fab { bottom: 80px; }
            }
        `;
        document.head.appendChild(style);
    },

    render() {
        const container = document.getElementById('ai-container') || this.createContainer();
        container.innerHTML = this.getHTML();
        this.bindEvents();
    },

    createContainer() {
        const container = document.createElement('div');
        container.id = 'ai-container';
        document.body.appendChild(container);
        return container;
    },

    getHTML() {
        return `
            <!-- FAB Button -->
            <button id="ai-fab" class="ai-fab w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 
                    rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center 
                    hover:scale-110 transition-transform" title="Asistente IA">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.5"></path>
                </svg>
            </button>

            <!-- Chat Panel -->
            <div id="ai-panel" class="ai-panel ${this.isOpen ? 'open' : ''} flex-col bg-white rounded-2xl 
                 shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
                ${this.renderHeader()}
                ${this.renderMessages()}
                ${this.renderInput()}
            </div>
        `;
    },

    renderHeader() {
        return `
            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold">Asistente Stock Desk</h3>
                        <p class="text-xs text-orange-100">Powered by GLM AI</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button id="ai-clear" class="p-2 hover:bg-white/20 rounded-lg transition" title="Limpiar chat">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                    <button id="ai-close" class="p-2 hover:bg-white/20 rounded-lg transition" title="Cerrar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    },

    renderMessagesUI() {
        const messagesContainer = document.getElementById('ai-messages');
        if (messagesContainer) {
            const messagesHTML = this.messages.length > 0 
                ? this.messages.map(m => this.renderMessage(m)).join('')
                : this.renderWelcome();
            messagesContainer.innerHTML = messagesHTML + (this.isLoading ? this.renderTyping() : '');
        }
        
        const input = document.getElementById('ai-input');
        const btn = document.querySelector('#ai-form button');
        if (input) input.disabled = this.isLoading;
        if (btn) btn.disabled = this.isLoading;
    },

    renderMessages() {
        const messagesHTML = this.messages.length > 0 
            ? this.messages.map(m => this.renderMessage(m)).join('')
            : this.renderWelcome();

        return `
            <div id="ai-messages" class="ai-messages p-4 space-y-4 bg-slate-50">
                ${messagesHTML}
                ${this.isLoading ? this.renderTyping() : ''}
            </div>
        `;
    },

    renderWelcome() {
        return `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5"></path>
                    </svg>
                </div>
                <h4 class="font-semibold text-slate-900 mb-2">Hola, soy tu asistente</h4>
                <p class="text-sm text-slate-500 mb-4">Puedo ayudarte con:</p>
                <div class="space-y-2">
                    ${this.renderSuggestion('¿Cómo agrego un producto?')}
                    ${this.renderSuggestion('¿Cuáles son mis ventas de hoy?')}
                    ${this.renderSuggestion('¿Qué productos tienen stock bajo?')}
                    ${this.renderSuggestion('Genera un reporte de ventas')}
                </div>
            </div>
        `;
    },

    renderSuggestion(text) {
        return `
            <button onclick="AIAssistant.sendMessage('${text}')" 
                    class="w-full p-2 text-sm text-left bg-white border border-slate-200 rounded-lg 
                           hover:border-orange-300 hover:bg-orange-50 transition">
                ${text}
            </button>
        `;
    },

    renderMessage(msg) {
        const isUser = msg.role === 'user';
        return `
            <div class="flex ${isUser ? 'justify-end' : 'justify-start'}">
                <div class="ai-message ${isUser ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-700'} 
                            px-4 py-3 rounded-2xl ${isUser ? 'rounded-br-md' : 'rounded-bl-md'} shadow-sm">
                    <p class="text-sm whitespace-pre-wrap">${msg.content}</p>
                </div>
            </div>
        `;
    },

    renderTyping() {
        return `
            <div class="flex justify-start">
                <div class="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div class="ai-typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
    },

    renderInput() {
        return `
            <div class="p-4 bg-white border-t border-slate-100">
                <form id="ai-form" class="flex gap-2">
                    <input type="text" id="ai-input" placeholder="Escribe tu mensaje..." 
                           class="flex-1 px-4 py-3 bg-slate-100 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 
                                  text-sm" ${this.isLoading ? 'disabled' : ''}>
                    <button type="submit" class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl 
                            transition disabled:opacity-50" ${this.isLoading ? 'disabled' : ''}>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </form>
            </div>
        `;
    },

    bindEvents() {
        const fab = document.getElementById('ai-fab');
        if (fab) {
            // Drag & Drop Logic
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;
            let hasMoved = false;

            const startDrag = (e) => {
                isDragging = true;
                hasMoved = false;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                
                const rect = fab.getBoundingClientRect();
                startX = clientX;
                startY = clientY;
                initialLeft = rect.left;
                initialTop = rect.top;

                // Remove bottom/right positioning and use left/top
                fab.style.bottom = 'auto';
                fab.style.right = 'auto';
                fab.style.left = `${initialLeft}px`;
                fab.style.top = `${initialTop}px`;
                
                fab.style.cursor = 'grabbing';
            };

            const doDrag = (e) => {
                if (!isDragging) return;
                e.preventDefault(); // Prevent scrolling on touch
                
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                
                const dx = clientX - startX;
                const dy = clientY - startY;

                // Threshold to detect drag vs click
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    hasMoved = true;
                }

                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;

                // Boundary checks
                const maxX = window.innerWidth - fab.offsetWidth;
                const maxY = window.innerHeight - fab.offsetHeight;

                newLeft = Math.max(0, Math.min(newLeft, maxX));
                newTop = Math.max(0, Math.min(newTop, maxY));

                fab.style.left = `${newLeft}px`;
                fab.style.top = `${newTop}px`;
            };

            const endDrag = () => {
                isDragging = false;
                fab.style.cursor = 'pointer';
            };

            // Mouse events
            fab.addEventListener('mousedown', startDrag);
            window.addEventListener('mousemove', doDrag);
            window.addEventListener('mouseup', endDrag);

            // Touch events
            fab.addEventListener('touchstart', startDrag, { passive: false });
            window.addEventListener('touchmove', doDrag, { passive: false });
            window.addEventListener('touchend', endDrag);

            // Click handling (only if not dragged)
            fab.addEventListener('click', (e) => {
                if (!hasMoved) {
                    this.toggle();
                }
            });
        }

        document.getElementById('ai-close')?.addEventListener('click', () => this.toggle());
        document.getElementById('ai-clear')?.addEventListener('click', () => this.clearChat());
        document.getElementById('ai-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('ai-input');
            if (input?.value.trim()) {
                this.sendMessage(input.value.trim());
                input.value = '';
            }
        });
    },

    toggle() {
        this.isOpen = !this.isOpen;
        // Re-render only updates innerHTML, preserving the button would be better but simpler here to re-render panel
        // We need to be careful not to destroy the button if we are just toggling the panel visibility
        // Actually render() recreates the container HTML. We should split render logic or just toggle CSS class.
        
        // Improved toggle: just toggle class on panel instead of re-rendering everything
        const panel = document.getElementById('ai-panel');
        if (panel) {
            panel.classList.toggle('open', this.isOpen);
            if (this.isOpen) {
                setTimeout(() => this.scrollToBottom(), 100);
                // Also update header/messages if needed, but they are static for now mostly
            }
        } else {
            // Initial render if not exists
            this.render();
        }
    },

    scrollToBottom() {
        const container = document.getElementById('ai-messages');
        if (container) container.scrollTop = container.scrollHeight;
    }
};
