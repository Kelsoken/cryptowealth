/**
 * Enhanced API Client with State Management and Error Handling
 * Provides consistent API interactions across the application
 */

class APIClient {
    constructor() {
        this.baseURL = window.location.origin;
        this.timeout = 30000; // 30 seconds
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        
        // Ensure dependencies are available
        if (!window.stateManager) {
            console.error('StateManager not found. Please load state-manager.js first.');
        }
        if (!window.errorHandler) {
            console.error('ErrorHandler not found. Please load error-handler.js first.');
        }
        
        console.log('🌐 APIClient initialized');
    }
    
    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const requestOptions = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                ...options.headers
            },
            ...options
        };
        
        // Add CSRF token if available
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            requestOptions.headers['X-CSRF-Token'] = csrfToken;
        }
        
        try {
            const response = await window.errorHandler.fetchWithRetry(
                url, 
                requestOptions, 
                `API Request: ${endpoint}`
            );
            
            return response;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }
    
    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, { method: 'GET' });
    }
    
    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    // Market Data API
    async getMarketData(limit = 50, symbols = []) {
        const params = { limit };
        if (symbols.length > 0) {
            params.symbols = symbols.join(',');
        }
        
        return window.stateManager.fetchData(
            'marketData',
            `/api/data/market-prices`,
            { method: 'GET', params }
        );
    }
    
    // Staking Data API
    async getStakingData(symbols = [], exchanges = []) {
        const params = {};
        if (symbols.length > 0) {
            params.symbols = symbols.join(',');
        }
        if (exchanges.length > 0) {
            params.exchanges = exchanges.join(',');
        }
        
        return window.stateManager.fetchData(
            'stakingData',
            `/api/data/staking-data`,
            { method: 'GET', params }
        );
    }
    
    // Portfolio Data API
    async getPortfolioData() {
        return window.stateManager.fetchData(
            'portfolioData',
            `/api/portfolio/overview`,
            { method: 'GET' }
        );
    }
    
    // AI Analysis API
    async getAIAnalysis(preferences = {}) {
        const params = {
            preferences: JSON.stringify(preferences)
        };
        
        return this.get('/api/staking/ai-recommendations', params);
    }
    
    // Exchange Management API
    async getExchangeConnections() {
        return this.get('/api/exchange/connections');
    }
    
    async connectExchange(exchangeData) {
        return this.post('/api/exchange/save-connection', exchangeData);
    }
    
    async syncExchange(exchangeId) {
        return this.post(`/api/exchange/sync-connection/${exchangeId}`);
    }
    
    async disconnectExchange(exchangeId) {
        return this.delete(`/api/exchange/disconnect-connection/${exchangeId}`);
    }
    
    // Health Check API
    async getHealthStatus() {
        return this.get('/api/data/health');
    }
    
    // Cache Management API
    async clearCache() {
        return this.post('/api/data/cache/clear');
    }
    
    async getCacheStats() {
        return this.get('/api/data/cache/stats');
    }
    
    // Batch Operations
    async refreshAllData() {
        const operations = [
            { key: 'marketData', url: '/api/data/market-prices?limit=50' },
            { key: 'stakingData', url: '/api/data/staking-data' },
            { key: 'portfolioData', url: '/api/portfolio/overview' }
        ];
        
        return window.stateManager.fetchBatch(operations);
    }
    
    // Real-time Data Updates
    async subscribeToUpdates(callback) {
        // Subscribe to state changes
        const unsubscribeMarket = window.stateManager.subscribe('marketData', callback);
        const unsubscribeStaking = window.stateManager.subscribe('stakingData', callback);
        const unsubscribePortfolio = window.stateManager.subscribe('portfolioData', callback);
        
        // Return unsubscribe function
        return () => {
            unsubscribeMarket();
            unsubscribeStaking();
            unsubscribePortfolio();
        };
    }
    
    // Data Validation
    validateMarketData(data) {
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid market data format');
        }
        
        const requiredFields = ['symbol', 'current_price', 'market_cap'];
        const invalidItems = data.filter(item => 
            !requiredFields.every(field => field in item)
        );
        
        if (invalidItems.length > 0) {
            console.warn(`Found ${invalidItems.length} items with missing required fields`);
        }
        
        return data;
    }
    
    validateStakingData(data) {
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid staking data format');
        }
        
        const requiredFields = ['symbol', 'staking_apy', 'exchange'];
        const invalidItems = data.filter(item => 
            !requiredFields.every(field => field in item)
        );
        
        if (invalidItems.length > 0) {
            console.warn(`Found ${invalidItems.length} items with missing required fields`);
        }
        
        return data;
    }
    
    // Error Recovery
    async recoverFromError(error, context) {
        console.log(`Attempting to recover from error in ${context}:`, error);
        
        // Try to get cached data
        const cachedData = window.stateManager.getData(context);
        if (cachedData) {
            console.log(`Using cached data for ${context}`);
            return cachedData;
        }
        
        // Try alternative endpoints
        if (context === 'marketData') {
            try {
                return await this.get('/api/data/market-prices?limit=10');
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
        
        throw error;
    }
    
    // Performance Monitoring
    async measurePerformance(operation, fn) {
        const startTime = performance.now();
        
        try {
            const result = await fn();
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            console.log(`Operation ${operation} completed in ${duration.toFixed(2)}ms`);
            
            // Log slow operations
            if (duration > 5000) {
                console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
            }
            
            return result;
        } catch (error) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.error(`Operation ${operation} failed after ${duration.toFixed(2)}ms:`, error);
            throw error;
        }
    }
    
    // Connection Status
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseURL}/api/data/health`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Auto-retry with exponential backoff
    async withRetry(fn, maxAttempts = 3, baseDelay = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt < maxAttempts) {
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
    }
}

// Create global instance
window.apiClient = new APIClient();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}
