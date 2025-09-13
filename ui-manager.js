/**
 * UI Manager for Crypto Staking Comparison App
 * Handles all UI interactions, display logic, and user interface updates
 */

class UIManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = CONFIG.app.itemsPerPage;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.sortBy = 'market_cap';
        this.sortOrder = 'desc';
        this.cryptoData = [];
        this.filteredData = [];
        this.isLoading = false;
        
        this.initializeEventListeners();
        this.setupAutoRefresh();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Filter and search
        document.getElementById('exchangeFilter')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.applyFilters();
        });

        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Sort button
        document.getElementById('sortApy')?.addEventListener('click', () => {
            this.toggleSort();
        });

        // Refresh button
        document.getElementById('refreshData')?.addEventListener('click', () => {
            this.refreshData();
        });

        // Pagination
        this.setupPaginationListeners();

        // Tab switching
        this.setupTabListeners();
    }

    /**
     * Setup pagination event listeners
     */
    setupPaginationListeners() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        pagination.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (e.target.classList.contains('page-link')) {
                const text = e.target.textContent.trim();
                
                if (text === 'Vorige' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (text === 'Volgende' && this.currentPage < this.getTotalPages()) {
                    this.currentPage++;
                } else if (!isNaN(text)) {
                    this.currentPage = parseInt(text);
                }
                
                this.updateDisplay();
            }
        });
    }

    /**
     * Setup tab event listeners
     */
    setupTabListeners() {
        const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
        tabButtons.forEach(button => {
            button.addEventListener('shown.bs.tab', (e) => {
                const target = e.target.getAttribute('data-bs-target');
                if (target === '#staking') {
                    this.refreshData();
                }
            });
        });
    }

    /**
     * Setup auto-refresh functionality
     */
    setupAutoRefresh() {
        if (CONFIG.app.refreshInterval > 0) {
            setInterval(() => {
                if (!this.isLoading && document.visibilityState === 'visible') {
                    this.refreshData(true); // Silent refresh
                }
            }, CONFIG.app.refreshInterval);
        }
    }

    /**
     * Load and display cryptocurrency data
     */
    async loadData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            // Load global data
            const globalData = await apiManager.getGlobalData();
            this.updateGlobalStats(globalData);

            // Load cryptocurrency data
            const cryptoData = await apiManager.getCryptocurrencies(this.itemsPerPage, this.currentPage);
            
            // Enhance with staking data
            const enhancedData = await this.enhanceWithStakingData(cryptoData);
            
            this.cryptoData = enhancedData;
            this.applyFilters();
            
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showError('Failed to load cryptocurrency data. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Enhance cryptocurrency data with staking information
     */
    async enhanceWithStakingData(cryptoData) {
        const enhancedData = [];
        
        for (const crypto of cryptoData) {
            try {
                const stakingInfo = await apiManager.getStakingInfo(crypto.id);
                enhancedData.push({
                    ...crypto,
                    staking: stakingInfo
                });
            } catch (error) {
                console.warn(`Failed to get staking info for ${crypto.id}:`, error);
                enhancedData.push({
                    ...crypto,
                    staking: apiManager.getDefaultStakingInfo(crypto.id)
                });
            }
        }
        
        return enhancedData;
    }

    /**
     * Apply filters and search
     */
    applyFilters() {
        let filtered = [...this.cryptoData];

        // Apply exchange filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(crypto => 
                crypto.staking?.exchanges?.includes(this.currentFilter.toLowerCase())
            );
        }

        // Apply search filter
        if (this.currentSearch) {
            filtered = filtered.filter(crypto => 
                crypto.name.toLowerCase().includes(this.currentSearch) ||
                crypto.symbol.toLowerCase().includes(this.currentSearch)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            if (this.sortBy === 'apy') {
                aValue = a.staking?.apy || 0;
                bValue = b.staking?.apy || 0;
            } else {
                aValue = a[this.sortBy] || 0;
                bValue = b[this.sortBy] || 0;
            }

            if (this.sortOrder === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });

        this.filteredData = filtered;
        this.currentPage = 1; // Reset to first page
        this.updateDisplay();
    }

    /**
     * Toggle sort order
     */
    toggleSort() {
        if (this.sortBy === 'apy') {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = 'apy';
            this.sortOrder = 'desc';
        }
        
        this.applyFilters();
        this.updateSortButton();
    }

    /**
     * Update sort button text and icon
     */
    updateSortButton() {
        const sortButton = document.getElementById('sortApy');
        if (!sortButton) return;

        const icon = sortButton.querySelector('i');
        const text = sortButton.querySelector('span') || sortButton;
        
        if (this.sortBy === 'apy') {
            if (this.sortOrder === 'desc') {
                icon.className = 'fas fa-sort-amount-down-alt me-1';
                text.textContent = ' Sorteer op APY (Hoog-Laag)';
            } else {
                icon.className = 'fas fa-sort-amount-up-alt me-1';
                text.textContent = ' Sorteer op APY (Laag-Hoog)';
            }
        } else {
            icon.className = 'fas fa-sort-amount-down-alt me-1';
            text.textContent = ' Sorteer op APY';
        }
    }

    /**
     * Update the main display
     */
    updateDisplay() {
        this.updateCryptoList();
        this.updatePagination();
        this.updateStats();
    }

    /**
     * Update cryptocurrency list display
     */
    updateCryptoList() {
        const container = document.getElementById('cryptoList');
        if (!container) return;

        if (this.filteredData.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">Geen cryptocurrencies gevonden</h4>
                    <p class="text-muted">Probeer een andere zoekterm of filter.</p>
                </div>
            `;
            return;
        }

        const html = this.filteredData.map(crypto => this.createCryptoCard(crypto)).join('');
        container.innerHTML = html;

        // Add animation classes
        if (CONFIG.ui.animations) {
            container.querySelectorAll('.crypto-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('fade-in');
            });
        }
    }

    /**
     * Create HTML for a cryptocurrency card
     */
    createCryptoCard(crypto) {
        const staking = crypto.staking || {};
        const apy = staking.apy || 0;
        const apyClass = this.getApyClass(apy);
        const exchanges = staking.exchanges || [];
        
        return `
            <div class="col-lg-6 col-xl-4">
                <div class="crypto-card">
                    <div class="crypto-header">
                        <div class="crypto-info">
                            <div class="crypto-icon">
                                ${crypto.symbol.charAt(0)}
                            </div>
                            <div>
                                <div class="crypto-name">${crypto.name}</div>
                                <div class="crypto-symbol">${crypto.symbol.toUpperCase()}</div>
                            </div>
                        </div>
                        <div class="crypto-rank">#${crypto.market_cap_rank || 'N/A'}</div>
                    </div>
                    
                    <div class="crypto-stats">
                        <div class="stat-item">
                            <div class="stat-value">€${this.formatNumber(crypto.current_price)}</div>
                            <div class="stat-label">Prijs</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value ${apyClass}">${apy.toFixed(2)}%</div>
                            <div class="stat-label">APY</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">€${this.formatNumber(crypto.market_cap)}</div>
                            <div class="stat-label">Market Cap</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value ${crypto.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger'}">
                                ${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                            </div>
                            <div class="stat-label">24h Change</div>
                        </div>
                    </div>
                    
                    ${exchanges.length > 0 ? `
                        <div class="exchange-badges">
                            ${exchanges.map(exchange => `
                                <span class="exchange-badge exchange-${exchange}">${CONFIG.exchanges[exchange]?.name || exchange}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Get CSS class for APY value
     */
    getApyClass(apy) {
        if (apy >= 10) return 'apy-high';
        if (apy >= 5) return 'apy-medium';
        return 'apy-low';
    }

    /**
     * Update pagination display
     */
    updatePagination() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        const totalPages = this.getTotalPages();
        const currentPage = this.currentPage;
        
        let html = '';
        
        // Previous button
        html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#">Vorige</a>
            </li>
        `;
        
        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `;
        }
        
        // Next button
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#">Volgende</a>
            </li>
        `;
        
        pagination.innerHTML = html;
    }

    /**
     * Get total number of pages
     */
    getTotalPages() {
        return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }

    /**
     * Update global statistics
     */
    updateGlobalStats(globalData) {
        const totalCrypto = document.getElementById('total-crypto');
        const avgApy = document.getElementById('avg-apy');
        const apiStatus = document.getElementById('api-status');

        if (totalCrypto && globalData.active_cryptocurrencies) {
            totalCrypto.textContent = globalData.active_cryptocurrencies.toLocaleString();
        }

        if (avgApy && this.cryptoData.length > 0) {
            const avg = this.cryptoData.reduce((sum, crypto) => 
                sum + (crypto.staking?.apy || 0), 0) / this.cryptoData.length;
            avgApy.textContent = `${avg.toFixed(2)}%`;
        }

        if (apiStatus) {
            apiStatus.textContent = 'Actief';
            apiStatus.className = 'text-success';
        }
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const totalCrypto = document.getElementById('total-crypto');
        const avgApy = document.getElementById('avg-apy');

        if (totalCrypto) {
            totalCrypto.textContent = this.filteredData.length;
        }

        if (avgApy && this.filteredData.length > 0) {
            const avg = this.filteredData.reduce((sum, crypto) => 
                sum + (crypto.staking?.apy || 0), 0) / this.filteredData.length;
            avgApy.textContent = `${avg.toFixed(2)}%`;
        }
    }

    /**
     * Show loading spinner
     */
    showLoading() {
        const container = document.getElementById('cryptoList');
        if (!container) return;

        container.innerHTML = `
            <div class="col-12">
                <div class="loading-spinner">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Laden...</span>
                    </div>
                    <p class="mt-3 text-muted">Cryptocurrency data laden...</p>
                </div>
            </div>
        `;
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        // Loading will be replaced by updateCryptoList()
    }

    /**
     * Show error message
     */
    showError(message) {
        const container = document.getElementById('cryptoList');
        if (!container) return;

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h4>Fout bij laden van data</h4>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="uiManager.refreshData()">
                        <i class="fas fa-sync-alt me-1"></i> Opnieuw proberen
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Refresh data
     */
    async refreshData(silent = false) {
        if (!silent) {
            this.showNotification('Data wordt vernieuwd...', 'info');
        }
        
        await this.loadData();
        
        if (!silent) {
            this.showNotification('Data succesvol vernieuwd!', 'success');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    /**
     * Format number for display
     */
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    }

    /**
     * Update exchange filter options
     */
    updateExchangeFilter() {
        const filter = document.getElementById('exchangeFilter');
        if (!filter) return;

        // Get unique exchanges from current data
        const exchanges = new Set();
        this.cryptoData.forEach(crypto => {
            if (crypto.staking?.exchanges) {
                crypto.staking.exchanges.forEach(exchange => exchanges.add(exchange));
            }
        });

        // Update filter options
        const currentValue = filter.value;
        filter.innerHTML = '<option value="all">Alle Exchanges</option>';
        
        exchanges.forEach(exchange => {
            const exchangeConfig = CONFIG.exchanges[exchange];
            if (exchangeConfig) {
                const option = document.createElement('option');
                option.value = exchange;
                option.textContent = exchangeConfig.name;
                filter.appendChild(option);
            }
        });

        // Restore previous selection
        filter.value = currentValue;
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.currentPage = 1;
        
        document.getElementById('exchangeFilter').value = 'all';
        document.getElementById('searchInput').value = '';
        
        this.applyFilters();
    }

    /**
     * Export data to CSV
     */
    exportToCSV() {
        if (this.filteredData.length === 0) {
            this.showNotification('Geen data om te exporteren', 'warning');
            return;
        }

        const headers = ['Name', 'Symbol', 'Price (EUR)', 'Market Cap', 'APY', '24h Change', 'Exchanges'];
        const rows = this.filteredData.map(crypto => [
            crypto.name,
            crypto.symbol,
            crypto.current_price,
            crypto.market_cap,
            crypto.staking?.apy || 0,
            crypto.price_change_percentage_24h || 0,
            (crypto.staking?.exchanges || []).join(', ')
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crypto-staking-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data geëxporteerd naar CSV', 'success');
    }
}

// Initialize UI Manager
const uiManager = new UIManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
} else {
    window.uiManager = uiManager;
}
