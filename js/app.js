/**
 * Main Application Entry Point
 * Stock Desk Application
 */

const App = {
    init() {
        console.log('Stock Desk v2026 - Starting...');
        
        // Initialize store
        Store.init();
        
        // Load saved theme
        this.loadSavedTheme();
        
        // Initialize router
        Router.init();
        
        // Initialize AI Assistant (after a delay to not block main thread)
        setTimeout(() => {
            if (typeof AIAssistant !== 'undefined') {
                AIAssistant.init();
                console.log('AI Assistant initialized');
            }
        }, 1000);

        // Register PWA service worker (app shell only, ver service-worker.js)
        this.registerServiceWorker();

        // Start the application
        this.start();
    },

    /**
     * PWA: registra el service worker y expone el flujo de actualización
     * "Nueva versión disponible" pedido en la auditoría de producción.
     * No cachea datos de negocio (viven en localStorage), solo el app shell.
     */
    registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;

        // file:// y otros esquemas no soportan Service Workers.
        if (window.location.protocol === 'file:') return;

        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').then((registration) => {
                // Ya hay un SW en espera al registrar (poco común, pero posible)
                if (registration.waiting) {
                    this.notifyUpdateAvailable(registration);
                }

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.notifyUpdateAvailable(registration);
                        }
                    });
                });
            }).catch((err) => {
                console.warn('No se pudo registrar el Service Worker (la app seguirá funcionando sin modo offline):', err);
            });

            // Evita recargar en bucle si varias pestañas actualizan a la vez.
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });
        });
    },

    notifyUpdateAvailable(registration) {
        if (typeof Components === 'undefined' || !Components.toast) return;
        Components.toast('Nueva versión de StockDesk disponible. Toca para actualizar.', 'info', 8000);

        // Actualiza al hacer clic en cualquier parte del toast más reciente.
        const container = document.getElementById('toast-container');
        if (container && container.lastElementChild) {
            container.lastElementChild.style.cursor = 'pointer';
            container.lastElementChild.addEventListener('click', () => {
                if (registration.waiting) {
                    registration.waiting.postMessage('SKIP_WAITING');
                }
            });
        }
    },

    loadSavedTheme() {
        const themeId = Store.get('stockdesk_theme') || 'orange';
        const customColors = Store.get('stockdesk_custom_colors');
        
        if (themeId === 'custom' && customColors) {
            document.documentElement.style.setProperty('--color-primary', customColors.primary);
            document.documentElement.style.setProperty('--color-secondary', customColors.secondary);
        } else {
            // Import CustomizationThemes module functionality directly here if module is not yet loaded
            // or rely on CSS defaults for 'orange' and handle others via Store check
            const themes = {
                orange: { primary: '#f97316', secondary: '#ea580c' },
                blue: { primary: '#3b82f6', secondary: '#2563eb' },
                green: { primary: '#22c55e', secondary: '#16a34a' },
                purple: { primary: '#a855f7', secondary: '#9333ea' },
                red: { primary: '#ef4444', secondary: '#dc2626' },
                teal: { primary: '#14b8a6', secondary: '#0d9488' }
            };
            const theme = themes[themeId] || themes.orange;
            document.documentElement.style.setProperty('--color-primary', theme.primary);
            document.documentElement.style.setProperty('--color-secondary', theme.secondary);
        }
    },

    start() {
        const hash = window.location.hash.slice(1);
        const device = Store.device.get();
        
        // Check if device is configured
        if (!device) {
            Router.navigate('device-setup');
            return;
        }
        
        // Check for valid hash route
        if (hash && Router.routes[hash]) {
            Router.navigate(hash);
        } else {
            Router.navigate('splash');
        }
    },

    formatCurrency(amount) {
        const settings = Store.settings.get();
        const symbols = { USD: '$', MXN: '$', EUR: '€', COP: '$' };
        return `${symbols[settings.currency] || '$'}${amount.toFixed(2)}`;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

// Expose for debugging
window.App = App;
window.Store = Store;
window.Router = Router;
