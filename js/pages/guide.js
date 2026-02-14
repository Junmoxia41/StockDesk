/**
 * Guide Page - Interactive Help Center
 * Stock Desk Application
 */

const GuidePage = {
    activeCategory: 'all',
    searchQuery: '',

    render() {
        const guides = this.filterGuides();
        const categories = GuideContent.categories;

        const content = `
            <div class="animate-fade-in">
                <!-- Header -->
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Centro de Guía</h1>
                    <p class="text-slate-500 text-sm mt-1">Aprende a sacar el máximo provecho de Stock Desk</p>
                </div>

                <!-- Search & Filters -->
                <div class="flex flex-col md:flex-row gap-4 mb-6">
                    <div class="relative flex-1">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            ${Components.icons.search}
                        </span>
                        <input type="text" placeholder="Buscar guía (ej: venta, stock, seguridad)..." 
                               value="${this.searchQuery}"
                               oninput="GuidePage.handleSearch(this.value)"
                               class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 transition shadow-sm">
                    </div>
                </div>

                <!-- Categories -->
                <div class="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                    ${categories.map(cat => `
                        <button onclick="GuidePage.setCategory('${cat.id}')" 
                                class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeCategory === cat.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50'}">
                            ${Components.icons[cat.icon] || Components.icons.grid}
                            ${cat.name}
                        </button>
                    `).join('')}
                </div>

                <!-- Guides Grid -->
                ${guides.length > 0 ? `
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                        ${guides.map(g => this.renderGuideCard(g)).join('')}
                    </div>
                ` : `
                    <div class="bg-white rounded-xl p-12 text-center border border-slate-100">
                        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            ${Components.icons.search.replace('w-5 h-5', 'w-8 h-8 text-slate-400')}
                        </div>
                        <h3 class="text-lg font-semibold text-slate-900">No se encontraron guías</h3>
                        <p class="text-slate-500">Intenta con otra búsqueda o categoría</p>
                        <button onclick="GuidePage.resetFilters()" class="mt-4 text-orange-600 font-medium hover:underline">
                            Ver todas las guías
                        </button>
                    </div>
                `}
            </div>
        `;

        return LayoutComponents.layout(content, 'guide'); // 'guide' is the active menu ID
    },

    renderGuideCard(guide) {
        // Icon mapping based on category or specific logic
        const icon = GuideContent.categories.find(c => c.id === guide.category)?.icon || 'fileText';
        const colorClass = this.getCategoryColor(guide.category);

        return `
            <div onclick="GuidePage.openGuide('${guide.id}')" 
                 class="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
                
                <!-- Decorative Background -->
                <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-opacity group-hover:opacity-20"></div>

                <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform ${colorClass.replace('from-', 'text-').split(' ')[0]} bg-opacity-10">
                        ${Components.icons[icon] || Components.icons.fileText}
                    </div>
                    <span class="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                        ${GuideContent.categories.find(c => c.id === guide.category)?.name}
                    </span>
                </div>

                <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    ${guide.title}
                </h3>
                <p class="text-sm text-slate-500 line-clamp-2">
                    ${guide.desc}
                </p>

                <div class="mt-4 flex items-center text-sm font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    Leer guía <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
            </div>
        `;
    },

    getCategoryColor(cat) {
        const map = {
            start: 'from-blue-500 to-indigo-500',
            inventory: 'from-orange-500 to-amber-500',
            pos: 'from-green-500 to-emerald-500',
            finance: 'from-purple-500 to-violet-500',
            security: 'from-red-500 to-rose-500',
            ai: 'from-cyan-500 to-blue-500'
        };
        return map[cat] || 'from-slate-500 to-gray-500';
    },

    filterGuides() {
        let guides = GuideContent.guides;

        if (this.activeCategory !== 'all') {
            guides = guides.filter(g => g.category === this.activeCategory);
        }

        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            guides = guides.filter(g => 
                g.title.toLowerCase().includes(q) || 
                g.desc.toLowerCase().includes(q)
            );
        }

        return guides;
    },

    handleSearch(query) {
        this.searchQuery = query;
        Router.render('guide'); // Re-render content only without full navigation if optimized, but here Router.render works
    },

    setCategory(cat) {
        this.activeCategory = cat;
        Router.navigate('guide');
    },

    resetFilters() {
        this.activeCategory = 'all';
        this.searchQuery = '';
        Router.navigate('guide');
    },

    openGuide(id) {
        const guide = GuideContent.guides.find(g => g.id === id);
        if (!guide) return;

        const icon = GuideContent.categories.find(c => c.id === guide.category)?.icon || 'star';

        const content = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        ${Components.icons[icon]}
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900">${guide.title}</h3>
                        <p class="text-slate-500 text-sm">${guide.desc}</p>
                    </div>
                </div>

                <!-- Steps -->
                <div>
                    <h4 class="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        ${Components.icons.check} Paso a Paso
                    </h4>
                    <div class="space-y-3">
                        ${guide.steps.map((step, i) => `
                            <div class="flex gap-3">
                                <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">
                                    ${i + 1}
                                </div>
                                <p class="text-slate-700 text-sm leading-relaxed">${step}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Pro Tip -->
                <div class="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
                    <div class="text-yellow-600 mt-0.5">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    </div>
                    <div>
                        <h5 class="font-bold text-yellow-800 text-sm mb-1">Pro Tip</h5>
                        <p class="text-yellow-700 text-sm">${guide.tip}</p>
                    </div>
                </div>
            </div>
        `;

        Components.modal({
            title: '',
            content: content,
            confirmText: 'Entendido',
            cancelText: 'Cerrar'
        });
    }
};

Router.register('guide', () => GuidePage.render());
