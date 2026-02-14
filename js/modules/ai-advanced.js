/**
 * AI Advanced Module - Predictions, Recommendations & Analytics
 * Stock Desk Application
 */

const AIAdvanced = {
    // Prediction of demand based on historical sales
    predictDemand(productId = null) {
        const sales = Store.sales.getAll();
        const products = Store.products.getAll();
        
        if (productId) {
            return this.predictProductDemand(productId, sales);
        }

        // General predictions for all products
        const predictions = products.map(p => ({
            ...p,
            prediction: this.predictProductDemand(p.id, sales)
        }));

        return predictions.sort((a, b) => b.prediction.nextWeekDemand - a.prediction.nextWeekDemand);
    },

    predictProductDemand(productId, sales) {
        const productSales = [];
        sales.forEach(s => {
            s.items.forEach(item => {
                if (item.id === productId) {
                    productSales.push({ date: s.date, qty: item.qty });
                }
            });
        });

        // Calculate weekly averages
        const weeklySales = this.groupByWeek(productSales);
        const avgWeekly = weeklySales.length > 0 
            ? weeklySales.reduce((s, w) => s + w.total, 0) / weeklySales.length 
            : 0;

        // Simple trend analysis
        const trend = weeklySales.length >= 2 
            ? (weeklySales[weeklySales.length - 1]?.total || 0) - (weeklySales[0]?.total || 0) 
            : 0;

        return {
            avgWeekly: avgWeekly.toFixed(1),
            nextWeekDemand: Math.max(0, avgWeekly + (trend * 0.1)).toFixed(1),
            trend: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
            confidence: Math.min(weeklySales.length * 10, 90)
        };
    },

    groupByWeek(sales) {
        const weeks = {};
        sales.forEach(s => {
            const date = new Date(s.date);
            const week = this.getWeekNumber(date);
            const key = `${date.getFullYear()}-W${week}`;
            weeks[key] = (weeks[key] || 0) + s.qty;
        });
        return Object.entries(weeks).map(([week, total]) => ({ week, total }));
    },

    getWeekNumber(date) {
        const firstDay = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
    },

    // Purchase recommendations
    getRecommendations() {
        const products = Store.products.getAll();
        const predictions = this.predictDemand();
        const recommendations = [];

        predictions.forEach(p => {
            const daysOfStock = p.prediction.nextWeekDemand > 0 
                ? (p.stock / (p.prediction.nextWeekDemand / 7)).toFixed(0) 
                : 999;

            if (parseInt(daysOfStock) < 14) {
                recommendations.push({
                    product: p.name,
                    currentStock: p.stock,
                    daysRemaining: daysOfStock,
                    suggestedOrder: Math.ceil(p.prediction.nextWeekDemand * 2),
                    priority: daysOfStock < 7 ? 'high' : 'medium',
                    reason: `Stock para ${daysOfStock} días. Demanda semanal: ${p.prediction.avgWeekly}`
                });
            }
        });

        return recommendations.sort((a, b) => a.daysRemaining - b.daysRemaining);
    },

    // Anomaly detection
    detectAnomalies() {
        const sales = Store.sales.getAll();
        const transactions = Store.transactions.getAll();
        const anomalies = [];

        // Detect unusual sales amounts
        const salesAmounts = sales.map(s => s.total);
        const avgSale = salesAmounts.reduce((a, b) => a + b, 0) / (salesAmounts.length || 1);
        const stdDev = Math.sqrt(salesAmounts.reduce((s, v) => s + Math.pow(v - avgSale, 2), 0) / (salesAmounts.length || 1));

        sales.forEach(s => {
            if (Math.abs(s.total - avgSale) > stdDev * 2) {
                anomalies.push({
                    type: 'sale',
                    date: s.date,
                    value: s.total,
                    description: s.total > avgSale ? 'Venta inusualmente alta' : 'Venta inusualmente baja',
                    severity: Math.abs(s.total - avgSale) > stdDev * 3 ? 'high' : 'medium'
                });
            }
        });

        // Detect unusual expenses
        const expensesByCategory = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            if (!expensesByCategory[t.category]) expensesByCategory[t.category] = [];
            expensesByCategory[t.category].push(t.amount);
        });

        Object.entries(expensesByCategory).forEach(([cat, amounts]) => {
            const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
            amounts.forEach((amount, i) => {
                if (amount > avg * 2) {
                    anomalies.push({
                        type: 'expense',
                        category: cat,
                        value: amount,
                        description: `Gasto de ${cat} inusualmente alto`,
                        severity: amount > avg * 3 ? 'high' : 'medium'
                    });
                }
            });
        });

        return anomalies;
    },

    // Price optimization suggestions
    suggestPricing() {
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const suggestions = [];

        products.forEach(p => {
            const productSales = sales.flatMap(s => s.items.filter(i => i.id === p.id));
            const totalSold = productSales.reduce((s, i) => s + i.qty, 0);
            const avgPrice = productSales.length > 0 
                ? productSales.reduce((s, i) => s + i.price, 0) / productSales.length 
                : p.price;

            // High stock + low sales = suggest discount
            if (p.stock > 50 && totalSold < 5) {
                suggestions.push({
                    product: p.name,
                    currentPrice: p.price,
                    suggestedPrice: (p.price * 0.85).toFixed(2),
                    action: 'discount',
                    reason: 'Alto stock con baja rotación',
                    impact: 'Aumentar rotación de inventario'
                });
            }
            // Low stock + high sales = can increase price
            else if (p.stock < 10 && totalSold > 20) {
                suggestions.push({
                    product: p.name,
                    currentPrice: p.price,
                    suggestedPrice: (p.price * 1.1).toFixed(2),
                    action: 'increase',
                    reason: 'Alta demanda con stock limitado',
                    impact: 'Maximizar margen de ganancia'
                });
            }
        });

        return suggestions;
    },

    // Generate AI report
    generateReport(type = 'general') {
        const products = Store.products.getAll();
        const sales = Store.sales.getAll();
        const transactions = Store.transactions.getAll();
        
        const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const profit = totalRevenue - totalExpenses;

        const recommendations = this.getRecommendations();
        const anomalies = this.detectAnomalies();
        const pricing = this.suggestPricing();

        return {
            summary: {
                totalProducts: products.length,
                totalSales: sales.length,
                revenue: totalRevenue,
                expenses: totalExpenses,
                profit: profit,
                profitMargin: totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0
            },
            insights: [
                recommendations.length > 0 ? `${recommendations.length} productos necesitan reabastecimiento` : 'Inventario en buen estado',
                anomalies.filter(a => a.severity === 'high').length > 0 ? `${anomalies.filter(a => a.severity === 'high').length} anomalías detectadas` : 'Sin anomalías críticas',
                pricing.length > 0 ? `${pricing.length} sugerencias de ajuste de precios` : 'Precios óptimos'
            ],
            recommendations: recommendations.slice(0, 5),
            anomalies: anomalies.slice(0, 5),
            pricingSuggestions: pricing.slice(0, 5),
            generatedAt: new Date().toISOString()
        };
    },

    // Automation rules
    automationRules: [],

    addAutomationRule(rule) {
        this.automationRules.push({
            id: Date.now(),
            ...rule,
            enabled: true,
            createdAt: new Date().toISOString()
        });
        Store.set('stockdesk_automation_rules', this.automationRules);
    },

    executeAutomations() {
        const products = Store.products.getAll();
        const executed = [];

        this.automationRules.filter(r => r.enabled).forEach(rule => {
            if (rule.trigger === 'low_stock') {
                products.filter(p => p.stock < (rule.threshold || 10)).forEach(p => {
                    executed.push({
                        rule: rule.name,
                        product: p.name,
                        action: rule.action,
                        timestamp: new Date().toISOString()
                    });
                });
            }
        });

        return executed;
    }
};

// Extend AI Assistant with advanced features
if (typeof AIAssistant !== 'undefined') {
    AIAssistant.getAdvancedResponse = function(query) {
        const q = query.toLowerCase();

        if (q.includes('predicción') || q.includes('demanda') || q.includes('predecir')) {
            const predictions = AIAdvanced.predictDemand().slice(0, 5);
            if (predictions.length === 0) return 'No hay suficientes datos para hacer predicciones.';
            return `Predicciones de demanda:\n\n${predictions.map(p => 
                `• ${p.name}: ~${p.prediction.nextWeekDemand} uds/semana (${p.prediction.trend === 'up' ? '↑' : p.prediction.trend === 'down' ? '↓' : '→'})`
            ).join('\n')}`;
        }

        if (q.includes('recomendación') || q.includes('comprar') || q.includes('reabastecer')) {
            const recs = AIAdvanced.getRecommendations();
            if (recs.length === 0) return 'No hay recomendaciones de compra. Tu inventario está bien.';
            return `Recomendaciones de compra:\n\n${recs.slice(0, 5).map(r => 
                `• ${r.product}: Ordenar ${r.suggestedOrder} uds (${r.priority === 'high' ? '⚠️ URGENTE' : 'Media prioridad'})`
            ).join('\n')}`;
        }

        if (q.includes('anomalía') || q.includes('irregular') || q.includes('raro')) {
            const anomalies = AIAdvanced.detectAnomalies();
            if (anomalies.length === 0) return 'No se detectaron anomalías. Todo parece normal.';
            return `Anomalías detectadas:\n\n${anomalies.slice(0, 5).map(a => 
                `• ${a.description}: $${a.value.toFixed(2)} (${a.severity === 'high' ? '⚠️ Alta' : 'Media'})`
            ).join('\n')}`;
        }

        if (q.includes('precio') || q.includes('ajustar') || q.includes('descuento')) {
            const pricing = AIAdvanced.suggestPricing();
            if (pricing.length === 0) return 'Los precios actuales parecen óptimos.';
            return `Sugerencias de precios:\n\n${pricing.map(p => 
                `• ${p.product}: ${p.action === 'discount' ? '↓' : '↑'} $${p.currentPrice} → $${p.suggestedPrice}\n  Razón: ${p.reason}`
            ).join('\n')}`;
        }

        if (q.includes('reporte') || q.includes('análisis') || q.includes('informe')) {
            const report = AIAdvanced.generateReport();
            return `📊 Reporte de IA:\n\n` +
                `Ingresos: $${report.summary.revenue.toFixed(2)}\n` +
                `Gastos: $${report.summary.expenses.toFixed(2)}\n` +
                `Ganancia: $${report.summary.profit.toFixed(2)} (${report.summary.profitMargin}%)\n\n` +
                `Insights:\n${report.insights.map(i => `• ${i}`).join('\n')}`;
        }

        return null;
    };
}
