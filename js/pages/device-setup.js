/**
 * Device Setup Page - Initial Configuration
 * Stock Desk Application
 */

const DeviceSetupPage = {
    render() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-6">
                <div class="w-full max-w-2xl animate-fade-in-up">
                    <div class="text-center mb-10">
                        <div class="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                            ${Components.icons.package.replace('w-5 h-5', 'w-10 h-10 text-white')}
                        </div>
                        <h1 class="text-3xl font-bold text-slate-900 mb-3">Bienvenido a Stock Desk</h1>
                        <p class="text-slate-500 text-lg">Selecciona el dispositivo que estás usando para optimizar tu experiencia</p>
                    </div>

                    <div class="grid md:grid-cols-3 gap-4 mb-8">
                        <!-- Desktop -->
                        <button onclick="DeviceSetupPage.selectDevice('desktop')" 
                                class="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all card-hover">
                            <div class="mb-4 flex justify-center">
                                <svg class="w-20 h-16 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 class="font-semibold text-slate-900 text-lg mb-2">Escritorio</h3>
                            <p class="text-sm text-slate-500">PC o Laptop con pantalla grande</p>
                        </button>

                        <!-- Tablet -->
                        <button onclick="DeviceSetupPage.selectDevice('tablet')" 
                                class="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all card-hover">
                            <div class="mb-4 flex justify-center">
                                <svg class="w-16 h-16 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 class="font-semibold text-slate-900 text-lg mb-2">Tablet</h3>
                            <p class="text-sm text-slate-500">iPad o tablet Android</p>
                        </button>

                        <!-- Mobile -->
                        <button onclick="DeviceSetupPage.selectDevice('mobile')" 
                                class="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all card-hover">
                            <div class="mb-4 flex justify-center">
                                <svg class="w-12 h-16 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 class="font-semibold text-slate-900 text-lg mb-2">Móvil</h3>
                            <p class="text-sm text-slate-500">Smartphone iOS o Android</p>
                        </button>
                    </div>

                    <div class="text-center">
                        <p class="text-sm text-slate-400">Puedes cambiar esto más tarde en Configuración</p>
                    </div>
                </div>
            </div>
        `;
    },

    selectDevice(device) {
        Store.device.set(device);
        Components.toast(`Configurado para ${device === 'desktop' ? 'Escritorio' : device === 'tablet' ? 'Tablet' : 'Móvil'}`, 'success');
        setTimeout(() => Router.navigate('splash'), 300);
    }
};

Router.register('device-setup', () => DeviceSetupPage.render());
