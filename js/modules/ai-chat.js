/**
 * AI Chat Logic - Message Processing & API Communication
 * Stock Desk Application
 */

// Extend AIAssistant with chat functionality
Object.assign(AIAssistant, {
    
    async sendMessage(content) {
        if (this.isLoading || !content.trim()) return;

        // Add user message
        this.messages.push({ role: 'user', content });
        this.isLoading = true;
        if (typeof this.renderMessagesUI === 'function') {
            this.renderMessagesUI();
        } else {
            this.render();
        }
        this.scrollToBottom();

        try {
            const response = await this.getAIResponse(content);
            this.messages.push({ role: 'assistant', content: response });
            this.saveMessages();
        } catch (error) {
            console.error('AI Error:', error);
            this.messages.push({ 
                role: 'assistant', 
                content: this.handleError(error)
            });
        }

        this.isLoading = false;
        if (typeof this.renderMessagesUI === 'function') {
            this.renderMessagesUI();
        } else {
            this.render();
        }
        this.scrollToBottom();
    },

    async getAIResponse(userMessage) {
        // First check if it's a local query we can handle
        const localResponse = this.handleLocalQuery(userMessage);
        if (localResponse) return localResponse;

        // Then check the advanced analytics module (predictions,
        // recommendations, anomalies, pricing, reports), if loaded.
        if (typeof this.getAdvancedResponse === 'function') {
            const advancedResponse = this.getAdvancedResponse(userMessage);
            if (advancedResponse) return advancedResponse;
        }

        // Check if API key is configured
        if (!this.config.apiKey) {
            return this.getOfflineResponse(userMessage);
        }

        // Call GLM API
        return await this.callGLMAPI(userMessage);
    },

    handleLocalQuery(query) {
        const q = query.toLowerCase();
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const todaySales = Store.sales.getTodaySales();

        // Stock bajo
        if (q.includes('stock bajo') || q.includes('poco stock')) {
            const lowStock = products.filter(p => p.stock < 10);
            if (lowStock.length === 0) return 'No hay productos con stock bajo. ¡Tu inventario está bien abastecido!';
            return `Tienes ${lowStock.length} producto(s) con stock bajo:\n\n${lowStock.map(p => `• ${p.name}: ${p.stock} unidades`).join('\n')}`;
        }

        // Ventas de hoy
        if (q.includes('ventas de hoy') || q.includes('vendido hoy')) {
            const total = todaySales.reduce((sum, s) => sum + s.total, 0);
            return `Hoy has realizado ${todaySales.length} venta(s) por un total de $${total.toFixed(2)}`;
        }

        // Total productos
        if (q.includes('cuántos productos') || q.includes('total de productos')) {
            return `Tienes ${products.length} producto(s) registrados en tu inventario.`;
        }

        // Producto más vendido
        if (q.includes('más vendido') || q.includes('producto top')) {
            const productCounts = {};
            sales.forEach(sale => {
                sale.items.forEach(item => {
                    productCounts[item.name] = (productCounts[item.name] || 0) + item.qty;
                });
            });
            const sorted = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);
            if (sorted.length === 0) return 'Aún no hay ventas registradas para determinar el producto más vendido.';
            return `El producto más vendido es "${sorted[0][0]}" con ${sorted[0][1]} unidades vendidas.`;
        }

        // Resumen general
        if (q.includes('resumen') || q.includes('estadísticas')) {
            const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
            const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
            return `📊 Resumen de tu negocio:\n\n• Productos: ${products.length}\n• Ventas totales: $${totalRevenue.toFixed(2)}\n• Ventas hoy: $${todayRevenue.toFixed(2)}\n• Transacciones hoy: ${todaySales.length}\n• Stock bajo: ${products.filter(p => p.stock < 10).length} productos`;
        }

        return null; // No local match
    },

    getOfflineResponse(query) {
        const q = query.toLowerCase();
        
        // Ayuda con productos
        if (q.includes('agregar') || q.includes('añadir') || q.includes('crear producto')) {
            return 'Para agregar un producto:\n\n1. Ve a la sección "Productos" en el menú\n2. Haz clic en "Nuevo Producto"\n3. Completa nombre, precio, stock y categoría\n4. Guarda el producto\n\n¿Necesitas ayuda con algo más?';
        }

        // Ayuda con ventas
        if (q.includes('venta') || q.includes('vender') || q.includes('cobrar')) {
            return 'Para realizar una venta:\n\n1. Ve a "Ventas" (Punto de Venta)\n2. Busca o selecciona productos\n3. Ajusta cantidades con + y -\n4. Presiona "Cobrar" para finalizar\n\nEl stock se descuenta automáticamente.';
        }

        // Ayuda con reportes
        if (q.includes('reporte') || q.includes('informe')) {
            return 'Para ver reportes:\n\n1. Ve a la sección "Reportes"\n2. Selecciona el rango de fechas\n3. Verás ventas totales, producto top y gráfico de ventas\n\nPuedes exportar los datos desde Configuración.';
        }

        // Configuración de IA
        if (q.includes('api') || q.includes('configurar ia') || q.includes('glm')) {
            return 'Para habilitar respuestas avanzadas con IA:\n\n1. Ve a Configuración\n2. En "Asistente IA", ingresa tu API Key de GLM\n3. Guarda los cambios\n\nObtén tu API Key en: open.bigmodel.cn';
        }

        // Default
        return `Entiendo tu consulta sobre "${query}".\n\nActualmente estoy funcionando en modo offline. Para respuestas más avanzadas, configura la API de GLM en Configuración.\n\nPuedo ayudarte con:\n• Información de tu inventario\n• Ventas del día\n• Productos con stock bajo\n• Cómo usar la aplicación`;
    },

    async callGLMAPI(userMessage) {
        const systemPrompt = this.buildSystemPrompt();
        
        const response = await fetch(this.config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...this.messages.slice(-10) // Last 10 messages for context
                ],
                max_tokens: this.config.maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No pude generar una respuesta.';
    },

    buildSystemPrompt() {
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const settings = Store.settings.get();
        const todaySales = Store.sales.getTodaySales();

        return `Eres el asistente de IA de Stock Desk, una aplicación de gestión de inventario y punto de venta.

CONTEXTO DEL NEGOCIO:
- Nombre: ${settings.businessName || 'Mi Negocio'}
- Moneda: ${settings.currency || 'USD'}
- Total productos: ${products.length}
- Ventas totales: ${sales.length}
- Ventas hoy: ${todaySales.length}
- Ingresos hoy: $${todaySales.reduce((s, v) => s + v.total, 0).toFixed(2)}

PRODUCTOS CON STOCK BAJO (menos de 10):
${products.filter(p => p.stock < 10).map(p => `- ${p.name}: ${p.stock} uds`).join('\n') || 'Ninguno'}

TOP 5 PRODUCTOS:
${products.slice(0, 5).map(p => `- ${p.name}: $${p.price} (${p.stock} uds)`).join('\n') || 'Sin productos'}

INSTRUCCIONES:
- Responde en español, de forma concisa y útil
- Ayuda con gestión de inventario, ventas y reportes
- Puedes dar consejos de negocio basados en los datos
- Si no sabes algo, sugiere usar las funciones de la app`;
    },

    handleError(error) {
        if (error.message.includes('401')) {
            return 'Error de autenticación. Verifica tu API Key en Configuración.';
        }
        if (error.message.includes('429')) {
            return 'Has excedido el límite de solicitudes. Espera un momento e intenta de nuevo.';
        }
        if (error.message.includes('fetch')) {
            return 'Error de conexión. Verifica tu internet e intenta de nuevo.';
        }
        return `Ocurrió un error: ${error.message}. Intenta de nuevo.`;
    },

    clearChat() {
        Components.modal({
            title: 'Limpiar conversación',
            content: '¿Deseas eliminar todo el historial de chat?',
            confirmText: 'Limpiar',
            type: 'danger',
            onConfirm: () => {
                this.messages = [];
                this.saveMessages();
                this.render();
                Components.toast('Conversación limpiada', 'success');
            }
        });
    },

    saveMessages() {
        // Keep only last 50 messages
        if (this.messages.length > 50) {
            this.messages = this.messages.slice(-50);
        }
        Store.set('stockdesk_ai_messages', this.messages);
    },

    setApiKey(key) {
        this.config.apiKey = key;
        Store.set('stockdesk_ai_apikey', key);
    }
});
