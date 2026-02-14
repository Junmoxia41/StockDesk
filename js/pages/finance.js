/**
 * Finance Page - Main Financial Module
 * Stock Desk Application
 */

const FinancePage = {
    activeTab: 'cashflow',

    tabs: [
        { id: 'cashflow', label: 'Flujo de Caja', icon: 'wallet' },
        { id: 'ledger', label: 'Libro Contable', icon: 'clipboard' },
        { id: 'expenses', label: 'Gastos', icon: 'receipt' },
        { id: 'payroll', label: 'Nómina', icon: 'users' },
        { id: 'budgets', label: 'Presupuestos', icon: 'trending' }
    ],

    render() {
        const content = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Módulo Financiero</h1>
                    <p class="text-slate-500 text-sm mt-1">Control completo de finanzas, gastos y presupuestos</p>
                </div>

                <!-- Tabs -->
                <div class="flex gap-2 overflow-x-auto pb-2 mb-6">
                    ${this.tabs.map(tab => `
                        <button onclick="FinancePage.setTab('${tab.id}')" 
                                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition
                                       ${this.activeTab === tab.id 
                                           ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                           : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'}">
                            ${Components.icons[tab.icon] || Components.icons.dollar}
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Tab Content -->
                <div id="finance-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
        return LayoutComponents.layout(content, 'finance');
    },

    setTab(tab) {
        this.activeTab = tab;
        Router.navigate('finance');
    },

    renderTabContent() {
        switch(this.activeTab) {
            case 'cashflow': return FinanceCashFlow.render();
            case 'ledger': return FinanceLedger.render();
            case 'expenses': return FinanceExpenses.render();
            case 'payroll': return FinancePayroll.render();
            case 'budgets': return FinanceBudgets.render();
            default: return FinanceCashFlow.render();
        }
    }
};

Router.register('finance', () => FinancePage.render());
