/**
 * Splash Screen Page
 * Stock Desk Application
 */

const SplashPage = {
    render() {
        return `
            <div class="splash-gradient fixed inset-0 flex items-center justify-center z-50">
                <div class="text-center animate-scale-in">
                    <div class="mb-8">
                        <div class="w-24 h-24 mx-auto bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center shadow-2xl">
                            <svg class="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 class="text-5xl font-bold text-white mb-4 drop-shadow-lg">Stock Desk</h1>
                    <p class="text-white/80 text-lg mb-8">Gestión de Inventario Inteligente</p>
                    <div class="loader mx-auto border-white/30 border-t-white"></div>
                </div>
            </div>
        `;
    },

    afterRender() {
        setTimeout(() => {
            const splash = document.querySelector('.splash-gradient');
            if (splash) {
                splash.style.transition = 'opacity 0.5s ease-out';
                splash.style.opacity = '0';
                setTimeout(() => Router.navigate('landing'), 500);
            }
        }, 2500);
    }
};

Router.register('splash', () => SplashPage.render());
Router.onAfterRender('splash', () => SplashPage.afterRender());
