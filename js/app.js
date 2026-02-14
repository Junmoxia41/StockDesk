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
        
        // Start the application
        this.start();
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
