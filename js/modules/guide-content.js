/**
 * Guide Content Module - Knowledge Base
 * Stock Desk Application
 */

const GuideContent = {
    categories: [
        { id: 'all', name: 'Todos', icon: 'grid' },
        { id: 'start', name: 'Primeros Pasos', icon: 'flag' },
        { id: 'inventory', name: 'Inventario', icon: 'package' },
        { id: 'pos', name: 'Punto de Venta', icon: 'cart' },
        { id: 'finance', name: 'Finanzas', icon: 'dollar' },
        { id: 'security', name: 'Seguridad', icon: 'lock' },
        { id: 'ai', name: 'Inteligencia Artificial', icon: 'brain' }
    ],

    guides: [
        // Primeros Pasos
        {
            id: 'setup-business',
            title: 'Configura tu Negocio',
            category: 'start',
            desc: 'Ajusta moneda, logo y datos básicos.',
            steps: [
                'Ve al menú "Ajustes" en la barra lateral.',
                'En "Configuración General", ingresa el nombre de tu negocio.',
                'Selecciona tu moneda (USD, MXN, COP, etc.).',
                'Ve a la pestaña "Personalización" para subir tu Logo.',
                '¡Listo! Estos datos aparecerán en tus tickets y reportes.'
            ],
            tip: 'Puedes cambiar el tema de colores en Personalización > Temas para que coincida con tu marca.'
        },
        {
            id: 'setup-device',
            title: 'Elegir Dispositivo',
            category: 'start',
            desc: 'Optimiza la vista para Móvil o PC.',
            steps: [
                'Ve a "Ajustes".',
                'Busca la opción "Dispositivo".',
                'Elige entre Escritorio, Tablet o Móvil.',
                'La interfaz se recargará para adaptarse a tu pantalla.'
            ],
            tip: 'En modo Móvil, el menú se oculta automáticamente para darte más espacio.'
        },

        // Inventario
        {
            id: 'create-product',
            title: 'Crear Producto',
            category: 'inventory',
            desc: 'Agrega nuevos ítems a tu catálogo.',
            steps: [
                'Ve al módulo "Productos".',
                'Haz clic en el botón naranja "Nuevo Producto".',
                'Llena los campos obligatorios: Nombre, Precio, Stock y Categoría.',
                'Opcional: Agrega Código de Barras, SKU o Ubicación.',
                'Haz clic en "Crear Producto".'
            ],
            tip: 'Usa el botón de escáner en el campo "Código de Barras" si tienes un lector conectado.'
        },
        {
            id: 'inventory-transfers',
            title: 'Transferencias entre Almacenes',
            category: 'inventory',
            desc: 'Mueve stock de una bodega a otra.',
            steps: [
                'Ve a "Inventario" > Pestaña "Transferencias".',
                'Clic en "Nueva Transferencia".',
                'Selecciona el Producto y la cantidad a mover.',
                'Elige el Almacén Origen y el Destino.',
                'Confirma la operación.'
            ],
            tip: 'El sistema valida que tengas stock suficiente en el origen antes de permitir el movimiento.'
        },
        {
            id: 'create-kit',
            title: 'Crear Kits / Combos',
            category: 'inventory',
            desc: 'Vende paquetes de productos juntos.',
            steps: [
                'Ve a "Inventario" > Pestaña "Kits".',
                'Clic en "Nuevo Kit".',
                'Asigna un nombre y precio de venta al kit.',
                'Agrega los productos que componen el kit y sus cantidades.',
                'Guarda el kit.'
            ],
            tip: 'Al vender un kit, se descuenta automáticamente el stock de cada componente individual.'
        },

        // POS
        {
            id: 'make-sale',
            title: 'Realizar una Venta',
            category: 'pos',
            desc: 'Procesa ventas rápidas en mostrador.',
            steps: [
                'Ve al módulo "Ventas".',
                'Busca productos por nombre o escanea el código.',
                'Haz clic en el producto para agregarlo al carrito.',
                'Ajusta las cantidades con los botones + y -.',
                'Haz clic en "Cobrar".',
                'Confirma el total y el método de pago.'
            ],
            tip: 'Puedes asignar un Cliente específico antes de cobrar para llevar un historial personalizado.'
        },
        {
            id: 'apply-discount',
            title: 'Aplicar Descuentos',
            category: 'pos',
            desc: 'Rebajas porcentuales en el total.',
            steps: [
                'En el módulo de Ventas, con productos en el carrito.',
                'Busca el campo "Descuento (%)" en el panel de cobro.',
                'Ingresa el porcentaje (ej: 10 para 10%).',
                'El total se actualizará automáticamente.'
            ],
            tip: 'El descuento se aplica al subtotal de la venta completa.'
        },

        // Finanzas
        {
            id: 'register-expense',
            title: 'Registrar Gasto',
            category: 'finance',
            desc: 'Controla las salidas de dinero.',
            steps: [
                'Ve a "Finanzas" > Pestaña "Gastos".',
                'Clic en "Nuevo Gasto".',
                'Selecciona la categoría (Alquiler, Servicios, etc.).',
                'Ingresa el monto y una descripción.',
                'Guarda el gasto.'
            ],
            tip: 'Registrar todos los gastos te permite ver tu Ganancia Neta real en el Dashboard.'
        },
        {
            id: 'payroll',
            title: 'Pago de Nómina',
            category: 'finance',
            desc: 'Gestiona pagos a empleados.',
            steps: [
                'Ve a "Finanzas" > Pestaña "Nómina".',
                'Primero agrega tus empleados con "Agregar Empleado".',
                'Para pagar, busca al empleado y clic en "Pagar".',
                'Ingresa el monto, concepto (Salario/Adelanto) y notas.',
                'El pago se registrará como un egreso.'
            ],
            tip: 'Puedes ver el historial de pagos de cada empleado en la misma pantalla.'
        },

        // Seguridad
        {
            id: 'setup-2fa',
            title: 'Activar 2FA',
            category: 'security',
            desc: 'Protege tu cuenta con doble factor.',
            steps: [
                'Ve a "Seguridad" > Pestaña "Autenticación".',
                'Clic en "Configurar 2FA".',
                'Copia el código secreto o escanea el QR (simulado).',
                'Ingresa el código de verificación.',
                '¡Tu cuenta ahora es más segura!'
            ],
            tip: 'Guarda los códigos de recuperación en un lugar seguro por si pierdes acceso.'
        },
        {
            id: 'backups',
            title: 'Copias de Seguridad',
            category: 'security',
            desc: 'Respalda tus datos localmente.',
            steps: [
                'Ve a "Seguridad" > Pestaña "Respaldos".',
                'Activa "Copia automática" si deseas.',
                'Para un respaldo manual, clic en "Crear Respaldo Ahora".',
                'Puedes descargar el archivo .json para guardarlo en otro lugar.'
            ],
            tip: 'Se recomienda descargar un respaldo al menos una vez a la semana.'
        },

        // IA
        {
            id: 'ai-chat',
            title: 'Usar Asistente IA',
            category: 'ai',
            desc: 'Consulta tu inventario con lenguaje natural.',
            steps: [
                'Haz clic en el botón flotante naranja (abajo derecha).',
                'Escribe preguntas como "¿Qué se vendió hoy?" o "¿Stock bajo?".',
                'La IA analizará tus datos locales y responderá.',
                'Puedes configurar una API Key en Ajustes para respuestas más avanzadas.'
            ],
            tip: 'El botón del chat se puede arrastrar a cualquier parte de la pantalla si te estorba.'
        }
    ]
};
