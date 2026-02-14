/**
 * Catalog Page - Feature Catalog with Categories
 * Stock Desk Application
 */

const CatalogPage = {
    activeCategory: 'all',

    categories: [
        { id: 'all', name: 'Todos', icon: 'grid', color: 'orange' },
        { id: 'inventory', name: 'Inventario', icon: 'package', color: 'blue' },
        { id: 'finance', name: 'Finanzas', icon: 'dollar', color: 'green' },
        { id: 'sales', name: 'Ventas', icon: 'cart', color: 'purple' },
        { id: 'users', name: 'Usuarios', icon: 'users', color: 'pink' },
        { id: 'ai', name: 'IA', icon: 'brain', color: 'cyan' },
        { id: 'security', name: 'Seguridad', icon: 'lock', color: 'red' },
        { id: 'config', name: 'Configuración', icon: 'settings', color: 'slate' },
        { id: 'notifications', name: 'Notificaciones', icon: 'info', color: 'yellow' },
        { id: 'suppliers', name: 'Proveedores', icon: 'users', color: 'teal' }
    ],

    features: [
        // Inventario
        { name: 'Gestión de Productos', desc: 'CRUD completo', category: 'inventory', status: 'active' },
        { name: 'Múltiples Almacenes', desc: 'Gestión de bodegas', category: 'inventory', status: 'active' },
        { name: 'Transferencias', desc: 'Entre almacenes', category: 'inventory', status: 'active' },
        { name: 'Kardex Detallado', desc: 'Historial movimientos', category: 'inventory', status: 'active' },
        { name: 'Conteo Físico', desc: 'Ajustes de inventario', category: 'inventory', status: 'active' },
        { name: 'Kits/Combos', desc: 'Productos compuestos', category: 'inventory', status: 'active' },
        { name: 'Códigos de Barras', desc: 'Soporte integrado', category: 'inventory', status: 'active' },
        { name: 'Lotes y Vencimiento', desc: 'Control de fechas', category: 'inventory', status: 'active' },
        { name: 'Unidades de Medida', desc: 'Múltiples unidades', category: 'inventory', status: 'active' },

        // Finanzas
        { name: 'Flujo de Caja', desc: 'Ingresos y egresos', category: 'finance', status: 'active' },
        { name: 'Libro Contable', desc: 'Registro completo', category: 'finance', status: 'active' },
        { name: 'Gastos Operativos', desc: 'Control de gastos', category: 'finance', status: 'active' },
        { name: 'Nómina Básica', desc: 'Empleados y pagos', category: 'finance', status: 'active' },
        { name: 'Presupuestos', desc: 'Control presupuestal', category: 'finance', status: 'active' },
        { name: 'Proyecciones', desc: 'Análisis a futuro', category: 'finance', status: 'active' },
        { name: 'Conciliación Bancaria', desc: 'Registro de bancos', category: 'finance', status: 'active' },
        { name: 'Impuestos', desc: 'Control tributario', category: 'finance', status: 'active' },

        // Ventas (POS)
        { name: 'Punto de Venta', desc: 'Interfaz rápida', category: 'sales', status: 'active' },
        { name: 'Carrito Interactivo', desc: 'Control total', category: 'sales', status: 'active' },
        { name: 'Descuentos', desc: 'Aplicar descuentos', category: 'sales', status: 'active' },
        { name: 'Clientes', desc: 'Asignar venta', category: 'sales', status: 'active' },
        { name: 'Historial de Ventas', desc: 'Registro detallado', category: 'sales', status: 'active' },
        { name: 'Reportes de Ventas', desc: 'Gráficos y KPIs', category: 'sales', status: 'active' },

        // Usuarios
        { name: 'Multi-Usuario', desc: 'Gestión de acceso', category: 'users', status: 'active' },
        { name: 'Roles y Permisos', desc: 'Control granular', category: 'users', status: 'active' },
        { name: 'Turnos de Caja', desc: 'Apertura y cierre', category: 'users', status: 'active' },
        { name: 'Múltiples Cajas', desc: 'Puntos de venta', category: 'users', status: 'active' },
        { name: 'Auditoría', desc: 'Log de cambios', category: 'users', status: 'active' },

        // IA
        { name: 'Asistente Virtual', desc: 'ChatBot GLM', category: 'ai', status: 'active' },
        { name: 'Predicción Demanda', desc: 'Análisis futuro', category: 'ai', status: 'active' },
        { name: 'Recomendaciones', desc: 'Compras sugeridas', category: 'ai', status: 'active' },
        { name: 'Detección Anomalías', desc: 'Alertas inteligentes', category: 'ai', status: 'active' },
        { name: 'Optimización Precios', desc: 'Sugerencias', category: 'ai', status: 'active' },
        { name: 'Reportes IA', desc: 'Generación auto', category: 'ai', status: 'active' },
        { name: 'Automatización', desc: 'Reglas de negocio', category: 'ai', status: 'active' },

        // Seguridad
        { name: 'Autenticación 2FA', desc: 'Doble factor', category: 'security', status: 'active' },
        { name: 'Copias Seguridad', desc: 'Backup auto', category: 'security', status: 'active' },
        { name: 'Restauración', desc: 'Recuperar datos', category: 'security', status: 'active' },
        { name: 'Logs Seguridad', desc: 'Registro eventos', category: 'security', status: 'active' },
        { name: 'Sesiones Activas', desc: 'Control dispositivos', category: 'security', status: 'active' },
        { name: 'Encriptación', desc: 'Datos seguros', category: 'security', status: 'active' },

        // Configuración / Personalización
        { name: 'Temas de Colores', desc: 'Personalizable', category: 'config', status: 'active' },
        { name: 'Logo Personalizado', desc: 'Branding', category: 'config', status: 'active' },
        { name: 'Tickets Custom', desc: 'Diseño recibos', category: 'config', status: 'active' },
        { name: 'Campos Custom', desc: 'Datos extra', category: 'config', status: 'active' },
        { name: 'Categorías Ilimitadas', desc: 'Organización', category: 'config', status: 'active' },
        { name: 'Atajos Teclado', desc: 'Productividad', category: 'config', status: 'active' },
        { name: 'Multi-Dispositivo', desc: 'Responsive', category: 'config', status: 'active' },

        // Notificaciones
        { name: 'Centro Alertas', desc: 'Hub central', category: 'notifications', status: 'active' },
        { name: 'Stock Bajo', desc: 'Avisos inventario', category: 'notifications', status: 'active' },
        { name: 'Resumen Diario', desc: 'Reporte auto', category: 'notifications', status: 'active' },
        { name: 'Multi-Canal', desc: 'Email, Push, SMS', category: 'notifications', status: 'active' },

        // Proveedores
        { name: 'Directorio', desc: 'Gestión contactos', category: 'suppliers', status: 'active' },
        { name: 'Órdenes Compra', desc: 'Pedidos', category: 'suppliers', status: 'active' },
        { name: 'Cuentas x Pagar', desc: 'Deudas', category: 'suppliers', status: 'active' },
        { name: 'Recepción', desc: 'Entrada almacén', category: 'suppliers', status: 'active' }
    ],

    render() {
        const filtered = this.activeCategory === 'all' 
            ? this.features 
            : this.features.filter(f => f.category === this.activeCategory);
        
        const activeCount = this.features.filter(f => f.status === 'active').length;

        const content = `
            <div class="animate-fade-in">
                <!-- Header -->
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Catálogo de Funcionalidades</h1>
                    <p class="text-slate-500 text-sm mt-1">Explora todas las características integradas en Stock Desk</p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    ${this.renderStatCard('Total Funciones', this.features.length, 'grid', 'orange')}
                    ${this.renderStatCard('Integradas', activeCount, 'check', 'green')}
                    ${this.renderStatCard('Módulos', this.categories.length - 1, 'box', 'blue')}
                    ${this.renderStatCard('Versión', '2026.4', 'star', 'purple')}
                </div>

                <!-- Category Filters -->
                <div class="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
                    ${this.categories.map(cat => `
                        <button onclick="CatalogPage.setCategory('${cat.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeCategory === cat.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[cat.icon] || Components.icons.grid}
                            ${cat.name}
                            <span class="px-1.5 py-0.5 rounded-full text-xs ${this.activeCategory === cat.id ? 'bg-white/20' : 'bg-slate-100'}">
                                ${cat.id === 'all' ? this.features.length : this.features.filter(f => f.category === cat.id).length}
                            </span>
                        </button>
                    `).join('')}
                </div>

                <!-- Features Grid -->
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                    ${filtered.map(f => this.renderFeatureCard(f)).join('')}
                </div>
            </div>
        `;

        return LayoutComponents.layout(content, 'catalog');
    },

    renderStatCard(title, value, icon, color) {
        const colors = {
            orange: 'bg-orange-100 text-orange-600',
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600'
        };
        
        return `
            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center">
                        ${Components.icons[icon] || Components.icons.grid}
                    </div>
                    <div>
                        <p class="text-xl md:text-2xl font-bold text-slate-900">${value}</p>
                        <p class="text-xs text-slate-500">${title}</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderFeatureCard(feature) {
        const catColors = {
            inventory: 'bg-blue-100 text-blue-600',
            finance: 'bg-green-100 text-green-600',
            sales: 'bg-purple-100 text-purple-600',
            users: 'bg-pink-100 text-pink-600',
            ai: 'bg-cyan-100 text-cyan-600',
            security: 'bg-red-100 text-red-600',
            config: 'bg-slate-100 text-slate-600',
            notifications: 'bg-yellow-100 text-yellow-600',
            suppliers: 'bg-teal-100 text-teal-600'
        };

        return `
            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all card-hover group">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-10 h-10 ${catColors[feature.category] || 'bg-slate-100 text-slate-600'} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        ${Components.icons[this.getCategoryIcon(feature.category)] || Components.icons.check}
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Activo
                    </span>
                </div>
                <h4 class="font-semibold text-slate-900 mb-1">${feature.name}</h4>
                <p class="text-sm text-slate-500">${feature.desc}</p>
            </div>
        `;
    },

    getCategoryIcon(category) {
        const icons = {
            inventory: 'package',
            finance: 'dollar',
            sales: 'cart',
            users: 'users',
            ai: 'brain',
            security: 'lock',
            config: 'settings',
            notifications: 'info',
            suppliers: 'users'
        };
        return icons[category] || 'check';
    },

    setCategory(category) {
        this.activeCategory = category;
        Router.navigate('catalog');
    }
};

Router.register('catalog', () => CatalogPage.render());