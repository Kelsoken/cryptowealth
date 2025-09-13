// Portfolio Module - Asset Management and Tracking
console.log('💼 Portfolio module loaded');

// Portfolio management functions
class PortfolioManager {
    constructor() {
        this.userId = 1; // In production zou dit uit authentication komen
        this.portfolioData = {};
        this.isLoading = false;
        this.lastUpdate = null;
        
        console.log('🔄 Portfolio Manager geïnitialiseerd');
    }
    
    async initializePortfolio() {
        console.log('🔄 Initializing portfolio...');
        
        try {
            // Laad portfolio data van alle gekoppelde exchanges
            await this.loadPortfolioData();
            this.updatePortfolioDisplay();
            
        } catch (error) {
            console.error('❌ Fout bij initialiseren portfolio:', error);
            this.showError('Kon portfolio niet laden');
        }
    }
    
    async loadPortfolioData() {
        if (this.isLoading) {
            console.log('⏳ Portfolio wordt al geladen...');
            return;
        }
        
        this.isLoading = true;
        this.showLoadingState();
        
        try {
            // Haal portfolio data op via de centrale API Manager
            const response = await fetch('/api/portfolio/load', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.userId,
                    module_id: 'portfolio'
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.portfolioData = data;
                this.lastUpdate = new Date();
                console.log('✅ Portfolio data geladen:', data);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('❌ Fout bij laden portfolio data:', error);
            this.showError('Kon portfolio data niet laden');
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }
    
    updatePortfolioDisplay() {
        console.log('📊 Updating portfolio display:', this.portfolioData);
        
        // Update portfolio widget op dashboard
        this.updatePortfolioWidget();
        
        // Update portfolio pagina als die open is
        this.updatePortfolioPage();
    }
    
    updatePortfolioWidget() {
        const portfolioWidget = document.getElementById('portfolioWidget');
        if (!portfolioWidget) return;
        
        if (this.portfolioData.totalValue !== undefined) {
            const totalValueElement = portfolioWidget.querySelector('.total-value');
            if (totalValueElement) {
                totalValueElement.textContent = `€${this.portfolioData.totalValue.toFixed(2)}`;
            }
        }
        
        if (this.portfolioData.connectedExchanges) {
            const exchangesElement = portfolioWidget.querySelector('.connected-exchanges');
            if (exchangesElement) {
                exchangesElement.textContent = this.portfolioData.connectedExchanges.length;
            }
        }
    }
    
    updatePortfolioPage() {
        // Update portfolio pagina als die open is
        const portfolioPage = document.getElementById('portfolioPage');
        if (!portfolioPage) return;
        
        // Update portfolio tabel
        this.updatePortfolioTable();
        
        // Update charts
        this.updatePortfolioCharts();
    }
    
    updatePortfolioTable() {
        const portfolioTable = document.getElementById('portfolioTable');
        if (!portfolioTable || !this.portfolioData.assets) return;
        
        const tbody = portfolioTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.portfolioData.assets.forEach(asset => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.symbol}</td>
                <td>${asset.amount}</td>
                <td>€${asset.value.toFixed(2)}</td>
                <td>${asset.exchange}</td>
                <td class="text-${asset.change >= 0 ? 'success' : 'danger'}">
                    ${asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}%
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    updatePortfolioCharts() {
        // Update portfolio charts als ze bestaan
        if (window.Chart && this.portfolioData.assets) {
            this.updateAllocationChart();
            this.updatePerformanceChart();
        }
    }
    
    updateAllocationChart() {
        const chartCanvas = document.getElementById('allocationChart');
        if (!chartCanvas) return;
        
        // Update allocation chart
        console.log('📊 Updating allocation chart...');
    }
    
    updatePerformanceChart() {
        const chartCanvas = document.getElementById('performanceChart');
        if (!chartCanvas) return;
        
        // Update performance chart
        console.log('📈 Updating performance chart...');
    }
    
    showLoadingState() {
        const loadingElement = document.getElementById('portfolioLoading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }
    
    hideLoadingState() {
        const loadingElement = document.getElementById('portfolioLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
    
    showError(message) {
        console.error('❌ Portfolio Error:', message);
        
        // Toon error in UI
        const errorElement = document.getElementById('portfolioError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    async refreshPortfolio() {
        console.log('🔄 Refreshing portfolio...');
        await this.loadPortfolioData();
        this.updatePortfolioDisplay();
    }
}

// Initialize portfolio manager
const portfolioManager = new PortfolioManager();

// Export functions for global use
window.PortfolioModule = {
    initializePortfolio: () => portfolioManager.initializePortfolio(),
    updatePortfolioDisplay: () => portfolioManager.updatePortfolioDisplay(),
    refreshPortfolio: () => portfolioManager.refreshPortfolio(),
    getPortfolioData: () => portfolioManager.portfolioData
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM ready - initializing portfolio...');
    portfolioManager.initializePortfolio();
});
