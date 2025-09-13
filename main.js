/**
 * Main Application Controller for Crypto Staking Comparison App
 * Initializes and coordinates all application modules
 */

class CryptoStakingApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        this.startTime = Date.now();
        
        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    async initializeApp() {
        try {
            console.log('🚀 Initializing Crypto Staking Comparison App...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.startInitialization());
            } else {
                this.startInitialization();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Start the initialization process
     */
    async startInitialization() {
        try {
            // Initialize modules
            await this.initializeModules();
            
            // Setup global error handling
            this.setupGlobalErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Load initial data
            await this.loadInitialData();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Show success message
            this.showInitializationSuccess();
            
            console.log('✅ App initialized successfully');
            
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Initialize all application modules
     */
    async initializeModules() {
        console.log('📦 Initializing modules...');
        
        // Check if all required modules are available
        const requiredModules = ['apiManager', 'uiManager', 'backofficeManager'];
        const missingModules = requiredModules.filter(module => !window[module]);
        
        if (missingModules.length > 0) {
            throw new Error(`Missing required modules: ${missingModules.join(', ')}`);
        }
        
        // Store module references
        this.modules = {
            api: window.apiManager,
            ui: window.uiManager,
            backoffice: window.backofficeManager
        };
        
        // Initialize module connections
        this.setupModuleConnections();
        
        console.log('✅ All modules initialized');
    }

    /**
     * Setup connections between modules
     */
    setupModuleConnections() {
        // Connect API manager with UI manager
        if (this.modules.api && this.modules.ui) {
            // API manager will provide data to UI manager
            console.log('🔗 Connected API and UI managers');
        }
        
        // Connect backoffice with API manager
        if (this.modules.backoffice && this.modules.api) {
            // Backoffice will manage API settings
            console.log('🔗 Connected backoffice and API managers');
        }
        
        // Setup cross-module communication
        this.setupCrossModuleCommunication();
    }

    /**
     * Setup cross-module communication
     */
    setupCrossModuleCommunication() {
        // Create event system for module communication
        this.eventBus = new EventTarget();
        
        // Listen for settings changes
        this.eventBus.addEventListener('settingsChanged', (event) => {
            this.handleSettingsChange(event.detail);
        });
        
        // Listen for data refresh requests
        this.eventBus.addEventListener('refreshData', (event) => {
            this.handleDataRefresh(event.detail);
        });
        
        // Listen for error events
        this.eventBus.addEventListener('error', (event) => {
            this.handleError(event.detail);
        });
    }

    /**
     * Load initial application data
     */
    async loadInitialData() {
        console.log('📊 Loading initial data...');
        
        try {
            // Load cryptocurrency data
            await this.modules.ui.loadData();
            
            // Update statistics
            this.updateAppStatistics();
            
            console.log('✅ Initial data loaded');
        } catch (error) {
            console.warn('Failed to load initial data:', error);
            // Continue with app initialization even if data loading fails
        }
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError({
                type: 'unhandledRejection',
                error: event.reason,
                message: 'An unexpected error occurred'
            });
        });
        
        // Handle global JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError({
                type: 'globalError',
                error: event.error,
                message: 'A JavaScript error occurred'
            });
        });
        
        // Handle network errors
        window.addEventListener('online', () => {
            this.showNotification('Internetverbinding hersteld', 'success');
            this.modules.ui?.refreshData(true);
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('Internetverbinding verloren', 'warning');
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = Date.now() - this.startTime;
            console.log(`📈 Page loaded in ${loadTime}ms`);
            
            // Report performance metrics
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`📊 Total load time: ${loadTime}ms`);
            }
        });
        
        // Monitor memory usage (if available)
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                const memory = window.performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
                
                if (usedMB > 50) { // Warn if using more than 50MB
                    console.warn(`⚠️ High memory usage: ${usedMB}MB / ${totalMB}MB`);
                }
            }, 30000); // Check every 30 seconds
        }
    }

    /**
     * Handle settings changes
     */
    handleSettingsChange(settings) {
        console.log('⚙️ Settings changed:', settings);
        
        // Update API manager with new settings
        if (this.modules.api) {
            this.modules.api.updateSettings(settings);
        }
        
        // Refresh data if needed
        if (settings.refreshData) {
            this.modules.ui?.refreshData();
        }
    }

    /**
     * Handle data refresh requests
     */
    async handleDataRefresh(options = {}) {
        console.log('🔄 Refreshing data...');
        
        try {
            if (this.modules.ui) {
                await this.modules.ui.refreshData(options.silent);
            }
            
            this.updateAppStatistics();
        } catch (error) {
            console.error('Data refresh failed:', error);
            this.handleError({
                type: 'dataRefresh',
                error: error,
                message: 'Failed to refresh data'
            });
        }
    }

    /**
     * Handle application errors
     */
    handleError(errorInfo) {
        console.error('🚨 Application error:', errorInfo);
        
        // Show user-friendly error message
        const message = errorInfo.message || 'An unexpected error occurred';
        this.showNotification(message, 'danger');
        
        // Log error details for debugging
        if (CONFIG.development.debug) {
            console.error('Error details:', errorInfo);
        }
        
        // Report error to external service if configured
        this.reportError(errorInfo);
    }

    /**
     * Report error to external service
     */
    reportError(errorInfo) {
        // In a production app, you would send this to an error reporting service
        // like Sentry, LogRocket, or similar
        if (CONFIG.errorHandling.logErrors) {
            // Example: send to error reporting service
            console.log('📤 Reporting error to external service:', errorInfo);
        }
    }

    /**
     * Update application statistics
     */
    updateAppStatistics() {
        // Update total cryptocurrencies count
        const totalCrypto = document.getElementById('total-crypto');
        if (totalCrypto && this.modules.ui) {
            const count = this.modules.ui.filteredData?.length || 0;
            totalCrypto.textContent = count.toLocaleString();
        }
        
        // Update API status
        const apiStatus = document.getElementById('api-status');
        if (apiStatus) {
            apiStatus.textContent = 'Actief';
            apiStatus.className = 'text-success';
        }
        
        // Update last refresh time
        this.updateLastRefreshTime();
    }

    /**
     * Update last refresh time display
     */
    updateLastRefreshTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('nl-NL');
        
        // You could add a last refresh indicator to the UI
        console.log(`🕐 Last refresh: ${timeString}`);
    }

    /**
     * Show initialization success message
     */
    showInitializationSuccess() {
        const loadTime = Date.now() - this.startTime;
        this.showNotification(
            `App succesvol geladen in ${loadTime}ms`, 
            'success', 
            2000
        );
    }

    /**
     * Show initialization error
     */
    showInitializationError(error) {
        const errorMessage = error.message || 'Failed to initialize application';
        
        // Show error in UI
        const container = document.getElementById('cryptoList');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                        <h4>Initialisatie Fout</h4>
                        <p>${errorMessage}</p>
                        <button class="btn btn-primary" onclick="location.reload()">
                            <i class="fas fa-sync-alt me-1"></i> Pagina Herladen
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Show notification
        this.showNotification('App initialisatie mislukt', 'danger');
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after specified duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            modules: Object.keys(this.modules),
            uptime: Date.now() - this.startTime,
            memory: window.performance?.memory ? {
                used: Math.round(window.performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(window.performance.memory.totalJSHeapSize / 1048576)
            } : null
        };
    }

    /**
     * Restart the application
     */
    restart() {
        console.log('🔄 Restarting application...');
        location.reload();
    }

    /**
     * Export application data
     */
    exportData() {
        const data = {
            status: this.getStatus(),
            settings: this.modules.backoffice?.getSettings(),
            rateLimits: this.modules.api?.getRateLimitStatus(),
            cryptoData: this.modules.ui?.filteredData || [],
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crypto-staking-app-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('App data geëxporteerd', 'success');
    }

    /**
     * Get application version and info
     */
    getAppInfo() {
        return {
            name: CONFIG.app.name,
            version: CONFIG.app.version,
            environment: CONFIG.development.debug ? 'development' : 'production',
            buildDate: new Date().toISOString(),
            features: {
                animations: CONFIG.ui.animations,
                darkMode: CONFIG.ui.darkMode,
                autoRefresh: CONFIG.ui.autoRefresh,
                notifications: CONFIG.ui.notifications
            }
        };
    }
}

// Initialize the application when the script loads
const cryptoStakingApp = new CryptoStakingApp();

// Make app available globally for debugging and external access
window.cryptoStakingApp = cryptoStakingApp;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoStakingApp;
} else {
    window.CryptoStakingApp = CryptoStakingApp;
}

// Add some global utility functions
window.utils = {
    /**
     * Format currency
     */
    formatCurrency: (amount, currency = 'EUR') => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    /**
     * Format percentage
     */
    formatPercentage: (value, decimals = 2) => {
        return `${value.toFixed(decimals)}%`;
    },
    
    /**
     * Format large numbers
     */
    formatNumber: (num) => {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    },
    
    /**
     * Debounce function
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

console.log('🎉 Crypto Staking Comparison App loaded successfully!');
