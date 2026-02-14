/**
 * Landing Page - Enhanced with more content
 * Stock Desk Application
 */

const LandingPage = {
    currentSlide: 0,
    
    render() {
        return `
            <div class="min-h-screen bg-white">
                ${this.renderNav()}
                ${this.renderHero()}
                ${this.renderFeatures()}
                ${this.renderHowItWorks()}
                ${this.renderScreenshots()}
                ${this.renderPricing()}
                ${this.renderFAQ()}
                ${this.renderFooter()}
            </div>
        `;
    },

    renderNav() {
        return `
            <nav class="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-slate-100 z-40">
                <div class="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            ${Components.icons.package.replace('w-5 h-5', 'w-5 h-5 text-white')}
                        </div>
                        <span class="text-xl font-bold gradient-text">Stock Desk</span>
                    </div>
                    <div class="hidden md:flex items-center gap-6">
                        <a href="#features" class="text-slate-600 hover:text-orange-600 transition">Características</a>
                        <a href="#how-it-works" class="text-slate-600 hover:text-orange-600 transition">Cómo Funciona</a>
                        <a href="#pricing" class="text-slate-600 hover:text-orange-600 transition">Planes</a>
                    </div>
                    <button onclick="Router.navigate('login')" class="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition btn-press">
                        Iniciar Sesión
                    </button>
                </div>
            </nav>
        `;
    },

    renderHero() {
        return `
            <section class="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6">
                <div class="max-w-6xl mx-auto">
                    <div class="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div class="animate-fade-in-up text-center lg:text-left">
                            <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Nueva Versión 2026
                            </span>
                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                                Gestiona tu negocio con <span class="gradient-text">Stock Desk</span>
                            </h1>
                            <p class="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                                La solución moderna y gratuita para el control de inventario y punto de venta. 
                                Diseñada para emprendedores que buscan simplicidad y eficiencia.
                            </p>
                            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button onclick="Router.navigate('login')" class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition transform hover:scale-105 btn-press">
                                    Comenzar Gratis
                                </button>
                                <a href="#how-it-works" class="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition btn-press text-center">
                                    Ver Cómo Funciona
                                </a>
                            </div>
                        </div>
                        <div class="animate-fade-in hidden lg:block">
                            ${this.renderDevicePreview()}
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    renderDevicePreview() {
        return `
            <div class="relative">
                <div class="device-frame mx-auto" style="max-width: 320px;">
                    <div class="device-screen aspect-[9/16] flex flex-col">
                        <div class="bg-orange-500 p-3 flex items-center gap-2">
                            <div class="w-6 h-6 bg-white/20 rounded"></div>
                            <span class="text-white font-semibold text-sm">Stock Desk</span>
                        </div>
                        <div class="flex-1 bg-slate-50 p-3">
                            <div class="grid grid-cols-2 gap-2 mb-3">
                                <div class="bg-white p-2 rounded-lg shadow-sm">
                                    <div class="w-6 h-6 bg-green-100 rounded mb-1"></div>
                                    <div class="h-2 bg-slate-200 rounded w-full mb-1"></div>
                                    <div class="h-3 bg-green-500 rounded w-2/3"></div>
                                </div>
                                <div class="bg-white p-2 rounded-lg shadow-sm">
                                    <div class="w-6 h-6 bg-orange-100 rounded mb-1"></div>
                                    <div class="h-2 bg-slate-200 rounded w-full mb-1"></div>
                                    <div class="h-3 bg-orange-500 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div class="bg-white rounded-lg p-2 shadow-sm">
                                <div class="flex items-center gap-2 mb-2">
                                    <div class="w-8 h-8 bg-orange-100 rounded"></div>
                                    <div class="flex-1">
                                        <div class="h-2 bg-slate-200 rounded w-3/4 mb-1"></div>
                                        <div class="h-2 bg-slate-100 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 bg-blue-100 rounded"></div>
                                    <div class="flex-1">
                                        <div class="h-2 bg-slate-200 rounded w-2/3 mb-1"></div>
                                        <div class="h-2 bg-slate-100 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
                <div class="absolute -top-4 -left-4 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-30"></div>
            </div>
        `;
    },

    renderFeatures() {
        const features = [
            { icon: 'package', title: 'Control de Inventario', desc: 'Administra productos, precios y existencias en tiempo real con alertas de stock bajo.' },
            { icon: 'cart', title: 'Punto de Venta', desc: 'Interfaz rápida e intuitiva para procesar ventas en segundos.' },
            { icon: 'chart', title: 'Reportes Detallados', desc: 'Visualiza ventas, productos más vendidos y tendencias de tu negocio.' },
            { icon: 'dollar', title: 'Sin Costos Ocultos', desc: '100% gratuito. Tus datos se guardan localmente en tu dispositivo.' },
            { icon: 'clipboard', title: 'Multiplataforma', desc: 'Funciona en escritorio, tablet y móvil. Lleva tu negocio donde vayas.' },
            { icon: 'star', title: 'Fácil de Usar', desc: 'Diseño intuitivo que no requiere capacitación. Empieza en minutos.' }
        ];

        return `
            <section id="features" class="py-16 md:py-20 px-4 md:px-6 bg-slate-50">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-12 md:mb-16">
                        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Todo lo que necesitas</h2>
                        <p class="text-slate-600 text-lg max-w-2xl mx-auto">Herramientas poderosas y fáciles de usar para gestionar tu negocio de forma eficiente</p>
                    </div>
                    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${features.map(f => `
                            <div class="feature-card bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                                <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-5">
                                    ${Components.icons[f.icon]}
                                </div>
                                <h3 class="text-xl font-semibold text-slate-900 mb-3">${f.title}</h3>
                                <p class="text-slate-600">${f.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    },

    renderHowItWorks() {
        const steps = [
            { num: '01', title: 'Configura tu Negocio', desc: 'Ingresa el nombre de tu negocio y selecciona tu moneda preferida.' },
            { num: '02', title: 'Agrega Productos', desc: 'Registra tus productos con nombre, precio, stock y categoría.' },
            { num: '03', title: 'Realiza Ventas', desc: 'Usa el punto de venta para procesar ventas rápidamente.' },
            { num: '04', title: 'Analiza Resultados', desc: 'Revisa reportes para tomar mejores decisiones de negocio.' }
        ];

        return `
            <section id="how-it-works" class="py-16 md:py-20 px-4 md:px-6">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-12 md:mb-16">
                        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cómo Funciona</h2>
                        <p class="text-slate-600 text-lg">Empieza a usar Stock Desk en 4 simples pasos</p>
                    </div>
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        ${steps.map((s, i) => `
                            <div class="relative text-center">
                                <div class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg shadow-orange-500/30">${s.num}</div>
                                ${i < steps.length - 1 ? '<div class="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-orange-200"></div>' : ''}
                                <h3 class="text-lg font-semibold text-slate-900 mb-2">${s.title}</h3>
                                <p class="text-slate-600 text-sm">${s.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    },

    renderScreenshots() {
        return `
            <section class="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-slate-50 to-white">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Vista Previa de la Aplicación</h2>
                        <p class="text-slate-600 text-lg">Conoce las principales pantallas de Stock Desk</p>
                    </div>
                    ${this.renderCarousel()}
                </div>
            </section>
        `;
    },

    renderCarousel() {
        const slides = [
            { title: 'Dashboard', desc: 'Panel principal con estadísticas de ventas, productos y alertas de stock bajo.' },
            { title: 'Productos', desc: 'Gestiona tu inventario: agrega, edita y elimina productos fácilmente.' },
            { title: 'Punto de Venta', desc: 'Interfaz dividida para agregar productos al carrito y procesar ventas.' },
            { title: 'Reportes', desc: 'Análisis de ventas por período con gráficos y estadísticas detalladas.' }
        ];

        return `
            <div class="relative">
                <div class="carousel-container rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                    <div id="carousel-track" class="carousel-track">
                        ${slides.map((s, i) => `
                            <div class="carousel-slide">
                                <div class="bg-slate-800 p-4 md:p-8">
                                    <div class="bg-slate-50 rounded-xl aspect-video flex items-center justify-center">
                                        <div class="text-center p-8">
                                            <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                                                ${Components.icons[['home', 'package', 'cart', 'chart'][i]]}
                                            </div>
                                            <h3 class="text-2xl font-bold text-slate-900 mb-2">${s.title}</h3>
                                            <p class="text-slate-600 max-w-md mx-auto">${s.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="flex justify-center gap-2 mt-6">
                    ${slides.map((_, i) => `<button onclick="LandingPage.goToSlide(${i})" class="carousel-dot w-3 h-3 rounded-full ${i === 0 ? 'bg-orange-500' : 'bg-slate-300'} transition"></button>`).join('')}
                </div>
            </div>
        `;
    },

    goToSlide(index) {
        this.currentSlide = index;
        const track = document.getElementById('carousel-track');
        if (track) {
            track.style.transform = `translateX(-${index * 100}%)`;
        }
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('bg-orange-500', i === index);
            dot.classList.toggle('bg-slate-300', i !== index);
        });
    },

    renderPricing() {
        return `
            <section id="pricing" class="py-16 md:py-20 px-4 md:px-6">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Totalmente Gratis</h2>
                    <p class="text-slate-600 text-lg mb-10">Sin trucos. Sin suscripciones. Sin límites.</p>
                    <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-orange-500/30">
                        <div class="text-6xl font-bold mb-2">$0</div>
                        <p class="text-orange-100 mb-8">Para siempre</p>
                        <ul class="space-y-4 text-left max-w-md mx-auto mb-8">
                            <li class="flex items-center gap-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Productos ilimitados</li>
                            <li class="flex items-center gap-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Ventas ilimitadas</li>
                            <li class="flex items-center gap-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Reportes completos</li>
                            <li class="flex items-center gap-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Datos guardados localmente</li>
                            <li class="flex items-center gap-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Sin conexión a internet requerida</li>
                        </ul>
                        <button onclick="Router.navigate('login')" class="px-10 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition btn-press shadow-lg">
                            Comenzar Ahora
                        </button>
                    </div>
                </div>
            </section>
        `;
    },

    renderFAQ() {
        const faqs = [
            { q: '¿Necesito internet para usar Stock Desk?', a: 'No. Stock Desk funciona completamente offline. Tus datos se guardan en tu navegador.' },
            { q: '¿Puedo perder mis datos?', a: 'Los datos están en tu navegador. Puedes exportarlos desde Configuración para hacer respaldos.' },
            { q: '¿Funciona en mi teléfono?', a: 'Sí. Stock Desk está optimizado para escritorio, tablet y móvil.' }
        ];

        return `
            <section class="py-16 md:py-20 px-4 md:px-6 bg-slate-50">
                <div class="max-w-3xl mx-auto">
                    <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">Preguntas Frecuentes</h2>
                    <div class="space-y-4">
                        ${faqs.map(f => `
                            <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                <h3 class="font-semibold text-slate-900 mb-2">${f.q}</h3>
                                <p class="text-slate-600">${f.a}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    },

    renderFooter() {
        return `
            <footer class="py-8 px-4 md:px-6 bg-white border-t border-slate-100">
                <div class="max-w-6xl mx-auto text-center text-slate-500">
                    <p>© 2026 Stock Desk. Todos los derechos reservados.</p>
                </div>
            </footer>
        `;
    }
};

Router.register('landing', () => LandingPage.render());
