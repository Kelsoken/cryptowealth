/**
 * Centralized State Manager for Crypto Platform
 * Handles data fetching, caching, error handling, and state synchronization
 */

class StateManager {
    constructor() {
        this.state = {
            marketData: null,
            stakingData: null,
            portfolioData: null,
            userPreferences: null,
            loading: {},
            errors: {},
            lastUpdated: {}
        };
        
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.abortControllers = new Map();
        this.subscribers = new Map();
        
        // Initialize from localStorage
        this.loadFromStorage();
        
        console.log('🔄 StateManager initialized');
    }
    
    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.get(key)?.delete(callback);
        };
    }
    
    // Notify subscribers of state changes
    notify(key, data) {
        const callbacks = this.subscribers.get(key);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in state subscriber:', error);
                }
            });
        }
    }
    
    // Set loading state
    setLoading(key, isLoading) {
        this.state.loading[key] = isLoading;
        this.notify(`${key}_loading`, isLoading);
        this.saveToStorage();
    }
    
    // Set error state
    setError(key, error) {
        this.state.errors[key] = error;
        this.notify(`${key}_error`, error);
        this.saveToStorage();
    }
    
    // Clear error state
    clearError(key) {
        delete this.state.errors[key];
        this.notify(`${key}_error`, null);
        this.saveToStorage();
    }
    
    // Set data state
    setData(key, data) {
        this.state[key] = data;
        this.state.lastUpdated[key] = Date.now();
        this.notify(key, data);
        this.saveToStorage();
        
        // Update cache
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    // Get data with cache check
    getData(key) {
        // Check cache first
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.data;
        }
        
        // Return state data
        return this.state[key];
    }
    
    // Check if data is stale
    isStale(key, maxAge = this.cacheTimeout) {
        const lastUpdated = this.state.lastUpdated[key];
        if (!lastUpdated) return true;
        return (Date.now() - lastUpdated) > maxAge;
    }
    
    // Fetch data with proper error handling and caching
    async fetchData(key, url, options = {}) {
        // Cancel previous request if exists
        if (this.abortControllers.has(key)) {
            this.abortControllers.get(key).abort();
        }
        
        // Create new abort controller
        const abortController = new AbortController();
        this.abortControllers.set(key, abortController);
        
        // Set loading state
        this.setLoading(key, true);
        this.clearError(key);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: abortController.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Validate response
            if (!data) {
                throw new Error('Empty response received');
            }
            
            // Set data and clear loading
            this.setData(key, data);
            this.setLoading(key, false);
            
            return data;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Request for ${key} was aborted`);
                return null;
            }
            
            console.error(`Error fetching ${key}:`, error);
            this.setError(key, error.message);
            this.setLoading(key, false);
            
            // Return cached data if available
            const cached = this.cache.get(key);
            if (cached) {
                console.log(`Returning cached data for ${key}`);
                return cached.data;
            }
            
            throw error;
        } finally {
            // Clean up abort controller
            this.abortControllers.delete(key);
        }
    }
    
    // Fetch market data
    async fetchMarketData(limit = 50) {
        return this.fetchData('marketData', `/api/data/market-prices?limit=${limit}`);
    }
    
    // Fetch staking data
    async fetchStakingData() {
        return this.fetchData('stakingData', '/api/data/staking-data');
    }
    
    // Fetch portfolio data
    async fetchPortfolioData() {
        return this.fetchData('portfolioData', '/api/portfolio/overview');
    }
    
    // Refresh data (force refresh)
    async refreshData(key, url, options = {}) {
        // Clear cache
        this.cache.delete(key);
        this.state.lastUpdated[key] = 0;
        
        return this.fetchData(key, url, options);
    }
    
    // Batch fetch multiple endpoints
    async fetchBatch(requests) {
        const promises = requests.map(({ key, url, options }) => 
            this.fetchData(key, url, options)
        );
        
        try {
            const results = await Promise.allSettled(promises);
            return results.map((result, index) => ({
                key: requests[index].key,
                success: result.status === 'fulfilled',
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason : null
            }));
        } catch (error) {
            console.error('Batch fetch error:', error);
            throw error;
        }
    }
    
    // Save state to localStorage
    saveToStorage() {
        try {
            const stateToSave = {
                marketData: this.state.marketData,
                stakingData: this.state.stakingData,
                portfolioData: this.state.portfolioData,
                userPreferences: this.state.userPreferences,
                lastUpdated: this.state.lastUpdated
            };
            
            localStorage.setItem('crypto_platform_state', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving state to storage:', error);
        }
    }
    
    // Load state from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('crypto_platform_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(this.state, parsed);
                
                // Restore cache
                Object.keys(parsed).forEach(key => {
                    if (parsed[key] && parsed.lastUpdated[key]) {
                        this.cache.set(key, {
                            data: parsed[key],
                            timestamp: parsed.lastUpdated[key]
                        });
                    }
                });
                
                console.log('📦 State loaded from storage');
            }
        } catch (error) {
            console.error('Error loading state from storage:', error);
        }
    }
    
    // Clear all data
    clearAll() {
        this.state = {
            marketData: null,
            stakingData: null,
            portfolioData: null,
            userPreferences: null,
            loading: {},
            errors: {},
            lastUpdated: {}
        };
        
        this.cache.clear();
        this.abortControllers.forEach(controller => controller.abort());
        this.abortControllers.clear();
        
        localStorage.removeItem('crypto_platform_state');
        
        console.log('🗑️ All state cleared');
    }
    
    // Get loading state
    isLoading(key) {
        return this.state.loading[key] || false;
    }
    
    // Get error state
    getError(key) {
        return this.state.errors[key] || null;
    }
    
    // Get last updated time
    getLastUpdated(key) {
        return this.state.lastUpdated[key] || null;
    }
    
    // Health check
    getHealthStatus() {
        const now = Date.now();
        const staleThreshold = 10 * 60 * 1000; // 10 minutes
        
        return {
            marketData: {
                available: !!this.state.marketData,
                stale: this.isStale('marketData', staleThreshold),
                lastUpdated: this.state.lastUpdated.marketData
            },
            stakingData: {
                available: !!this.state.stakingData,
                stale: this.isStale('stakingData', staleThreshold),
                lastUpdated: this.state.lastUpdated.stakingData
            },
            portfolioData: {
                available: !!this.state.portfolioData,
                stale: this.isStale('portfolioData', staleThreshold),
                lastUpdated: this.state.lastUpdated.portfolioData
            },
            errors: Object.keys(this.state.errors).length,
            loading: Object.keys(this.state.loading).filter(key => this.state.loading[key]).length
        };
    }
}

// Create global instance
window.stateManager = new StateManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}
