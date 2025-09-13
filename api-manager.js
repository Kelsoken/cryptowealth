/**
 * API Manager for Crypto Staking Comparison App
 * Handles all API calls, rate limiting, caching, and error handling
 */

class APIManager {
    constructor() {
        this.cache = new Map();
        this.rateLimiters = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.settings = this.loadSettings();
        
        this.initializeRateLimiters();
        this.setupErrorHandling();
    }

    /**
     * Initialize rate limiters for each API
     */
    initializeRateLimiters() {
        Object.keys(CONFIG.APIs).forEach(apiName => {
            const api = CONFIG.APIs[apiName];
            this.rateLimiters.set(apiName, {
                requests: 0,
                lastReset: Date.now(),
                queue: [],
                maxRequests: api.rateLimit.requests,
                interval: api.rateLimit.interval
            });
        });
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    /**
     * Check if API call is within rate limits
     */
    checkRateLimit(apiName) {
        const limiter = this.rateLimiters.get(apiName);
        if (!limiter) return true;

        const now = Date.now();
        
        // Reset counter if interval has passed
        if (now - limiter.lastReset > limiter.interval) {
            limiter.requests = 0;
            limiter.lastReset = now;
        }

        return limiter.requests < limiter.maxRequests;
    }

    /**
     * Increment rate limit counter
     */
    incrementRateLimit(apiName) {
        const limiter = this.rateLimiters.get(apiName);
        if (limiter) {
            limiter.requests++;
        }
    }

    /**
     * Get cached data if available and not expired
     */
    getCachedData(key) {
        if (!CONFIG.cache.enabled) return null;

        const cached = this.cache.get(key);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > CONFIG.cache.defaultTTL) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    /**
     * Cache data with timestamp
     */
    setCachedData(key, data) {
        if (!CONFIG.cache.enabled) return;

        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    /**
     * Make HTTP request with error handling and retries
     */
    async makeRequest(url, options = {}, retries = CONFIG.errorHandling.maxRetries) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.errorHandling.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);

            if (retries > 0 && this.shouldRetry(error)) {
                await this.delay(CONFIG.errorHandling.retryDelay);
                return this.makeRequest(url, options, retries - 1);
            }

            throw error;
        }
    }

    /**
     * Determine if request should be retried
     */
    shouldRetry(error) {
        if (error.name === 'AbortError') return false;
        if (error.message.includes('404')) return false;
        if (error.message.includes('401')) return false;
        return true;
    }

    /**
     * Delay execution
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get cryptocurrency data from CoinGecko
     */
    async getCryptocurrencies(limit = 50, page = 1) {
        const cacheKey = `crypto_${limit}_${page}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        if (!this.checkRateLimit('coinGecko')) {
            throw new Error('Rate limit exceeded for CoinGecko API');
        }

        try {
            const params = new URLSearchParams({
                vs_currency: this.settings.preferences.currency,
                order: 'market_cap_desc',
                per_page: limit,
                page: page,
                sparkline: false,
                price_change_percentage: '24h'
            });

            const url = `${CONFIG.APIs.coinGecko.baseUrl}${CONFIG.APIs.coinGecko.endpoints.coins}?${params}`;
            const data = await this.makeRequest(url);
            
            this.incrementRateLimit('coinGecko');
            this.setCachedData(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('Failed to fetch cryptocurrencies:', error);
            throw new Error('Failed to fetch cryptocurrency data');
        }
    }

    /**
     * Get staking information for a specific cryptocurrency
     */
    async getStakingInfo(coinId) {
        const cacheKey = `staking_${coinId}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            // Try multiple sources for staking data
            const stakingData = await Promise.allSettled([
                this.getStakingFromCoinGecko(coinId),
                this.getStakingFromStakingRewards(coinId),
                this.getStakingFromDeFiLlama(coinId)
            ]);

            const validData = stakingData
                .filter(result => result.status === 'fulfilled' && result.value)
                .map(result => result.value);

            if (validData.length === 0) {
                return this.getDefaultStakingInfo(coinId);
            }

            // Merge data from different sources
            const mergedData = this.mergeStakingData(validData);
            this.setCachedData(cacheKey, mergedData);
            
            return mergedData;
        } catch (error) {
            console.error(`Failed to fetch staking info for ${coinId}:`, error);
            return this.getDefaultStakingInfo(coinId);
        }
    }

    /**
     * Get staking data from CoinGecko
     */
    async getStakingFromCoinGecko(coinId) {
        if (!this.checkRateLimit('coinGecko')) return null;

        try {
            const url = `${CONFIG.APIs.coinGecko.baseUrl}${CONFIG.APIs.coinGecko.endpoints.coin}/${coinId}`;
            const data = await this.makeRequest(url);
            
            this.incrementRateLimit('coinGecko');

            // Extract staking information if available
            if (data.staking_data) {
                return {
                    source: 'coingecko',
                    apy: data.staking_data.apy || 0,
                    minStake: data.staking_data.min_stake || 0,
                    type: data.staking_data.type || 'unknown',
                    exchanges: data.staking_data.exchanges || []
                };
            }

            return null;
        } catch (error) {
            console.warn(`CoinGecko staking data not available for ${coinId}:`, error);
            return null;
        }
    }

    /**
     * Get staking data from StakingRewards
     */
    async getStakingFromStakingRewards(coinId) {
        if (!this.settings.apiKeys.stakingRewards || !this.checkRateLimit('stakingRewards')) {
            return null;
        }

        try {
            const url = `${CONFIG.APIs.stakingRewards.baseUrl}${CONFIG.APIs.stakingRewards.endpoints.assets}`;
            const data = await this.makeRequest(url, {
                headers: {
                    'Authorization': `Bearer ${this.settings.apiKeys.stakingRewards}`
                }
            });
            
            this.incrementRateLimit('stakingRewards');

            // Find asset data for the coin
            const asset = data.find(item => item.symbol.toLowerCase() === coinId.toLowerCase());
            if (asset && asset.staking_data) {
                return {
                    source: 'stakingrewards',
                    apy: asset.staking_data.apy || 0,
                    minStake: asset.staking_data.min_stake || 0,
                    type: asset.staking_data.type || 'unknown',
                    exchanges: asset.staking_data.exchanges || []
                };
            }

            return null;
        } catch (error) {
            console.warn(`StakingRewards data not available for ${coinId}:`, error);
            return null;
        }
    }

    /**
     * Get staking data from DeFiLlama
     */
    async getStakingFromDeFiLlama(coinId) {
        if (!this.checkRateLimit('defiLlama')) return null;

        try {
            const url = `${CONFIG.APIs.defiLlama.baseUrl}${CONFIG.APIs.defiLlama.endpoints.protocols}`;
            const data = await this.makeRequest(url);
            
            this.incrementRateLimit('defiLlama');

            // Find protocol data for the coin
            const protocol = data.find(item => 
                item.name.toLowerCase().includes(coinId.toLowerCase()) ||
                item.symbol?.toLowerCase() === coinId.toLowerCase()
            );

            if (protocol && protocol.staking_data) {
                return {
                    source: 'defillama',
                    apy: protocol.staking_data.apy || 0,
                    minStake: protocol.staking_data.min_stake || 0,
                    type: protocol.staking_data.type || 'unknown',
                    exchanges: protocol.staking_data.exchanges || []
                };
            }

            return null;
        } catch (error) {
            console.warn(`DeFiLlama data not available for ${coinId}:`, error);
            return null;
        }
    }

    /**
     * Get default staking information when no data is available
     */
    getDefaultStakingInfo(coinId) {
        // Return mock staking data based on coin type
        const mockData = {
            source: 'default',
            apy: Math.random() * 10 + 1, // 1-11% APY
            minStake: Math.random() * 100 + 1, // 1-101 minimum stake
            type: 'proof-of-stake',
            exchanges: ['bitvavo', 'coinbase', 'binance', 'kraken']
        };

        return mockData;
    }

    /**
     * Merge staking data from multiple sources
     */
    mergeStakingData(dataArray) {
        if (dataArray.length === 1) return dataArray[0];

        // Calculate average APY
        const avgApy = dataArray.reduce((sum, data) => sum + (data.apy || 0), 0) / dataArray.length;
        
        // Get minimum stake requirement
        const minStake = Math.min(...dataArray.map(data => data.minStake || 0));
        
        // Combine all exchanges
        const allExchanges = [...new Set(dataArray.flatMap(data => data.exchanges || []))];
        
        // Determine most common type
        const types = dataArray.map(data => data.type).filter(Boolean);
        const mostCommonType = types.length > 0 ? 
            types.sort((a, b) => 
                types.filter(v => v === a).length - types.filter(v => v === b).length
            ).pop() : 'unknown';

        return {
            source: 'merged',
            apy: avgApy,
            minStake: minStake,
            type: mostCommonType,
            exchanges: allExchanges,
            sources: dataArray.map(data => data.source)
        };
    }

    /**
     * Get global cryptocurrency market data
     */
    async getGlobalData() {
        const cacheKey = 'global_data';
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const url = `${CONFIG.APIs.coinGecko.baseUrl}${CONFIG.APIs.coinGecko.endpoints.global}`;
            const data = await this.makeRequest(url);
            
            this.incrementRateLimit('coinGecko');
            this.setCachedData(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('Failed to fetch global data:', error);
            // Return mock data as fallback
            return MOCK_DATA.global;
        }
    }

    /**
     * Test API connections
     */
    async testAPIConnections() {
        const results = {};

        // Test CoinGecko
        try {
            const url = `${CONFIG.APIs.coinGecko.baseUrl}/ping`;
            await this.makeRequest(url);
            results.coinGecko = { status: 'success', message: 'Connection successful' };
        } catch (error) {
            results.coinGecko = { status: 'error', message: error.message };
        }

        // Test CoinMarketCap (if key is available)
        if (this.settings.apiKeys.coinMarketCap && this.settings.apiKeys.coinMarketCap !== 'demo_key') {
            try {
                const url = `${CONFIG.APIs.coinMarketCap.baseUrl}${CONFIG.APIs.coinMarketCap.endpoints.global}`;
                await this.makeRequest(url, {
                    headers: {
                        'X-CMC_PRO_API_KEY': this.settings.apiKeys.coinMarketCap
                    }
                });
                results.coinMarketCap = { status: 'success', message: 'Connection successful' };
            } catch (error) {
                results.coinMarketCap = { status: 'error', message: error.message };
            }
        } else {
            results.coinMarketCap = { status: 'warning', message: 'No API key provided' };
        }

        // Test StakingRewards (if key is available)
        if (this.settings.apiKeys.stakingRewards) {
            try {
                const url = `${CONFIG.APIs.stakingRewards.baseUrl}${CONFIG.APIs.stakingRewards.endpoints.assets}`;
                await this.makeRequest(url, {
                    headers: {
                        'Authorization': `Bearer ${this.settings.apiKeys.stakingRewards}`
                    }
                });
                results.stakingRewards = { status: 'success', message: 'Connection successful' };
            } catch (error) {
                results.stakingRewards = { status: 'error', message: error.message };
            }
        } else {
            results.stakingRewards = { status: 'warning', message: 'No API key provided' };
        }

        // Test DeFiLlama
        try {
            const url = `${CONFIG.APIs.defiLlama.baseUrl}${CONFIG.APIs.defiLlama.endpoints.protocols}`;
            await this.makeRequest(url);
            results.defiLlama = { status: 'success', message: 'Connection successful' };
        } catch (error) {
            results.defiLlama = { status: 'error', message: error.message };
        }

        return results;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        localStorage.removeItem(STORAGE_KEYS.CACHE);
    }

    /**
     * Update API keys
     */
    updateAPIKeys(keys) {
        this.settings.apiKeys = { ...this.settings.apiKeys, ...keys };
        this.saveSettings();
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (CONFIG.errorHandling.logErrors) {
                // Log error to external service if needed
            }
        });
    }

    /**
     * Get rate limit status for all APIs
     */
    getRateLimitStatus() {
        const status = {};
        
        Object.keys(CONFIG.APIs).forEach(apiName => {
            const limiter = this.rateLimiters.get(apiName);
            if (limiter) {
                status[apiName] = {
                    requests: limiter.requests,
                    maxRequests: limiter.maxRequests,
                    remaining: limiter.maxRequests - limiter.requests,
                    resetTime: limiter.lastReset + limiter.interval
                };
            }
        });

        return status;
    }

    /**
     * Fetch data from CoinGecko API
     */
    async fetchFromCoinGecko() {
        if (!CONFIG.APIs.coinGecko.enabled) return null;
        
        if (!this.checkRateLimit('coinGecko')) {
            throw new Error('Rate limit bereikt. Wacht even voordat je nieuwe data ophaalt.');
        }
        
        try {
            const url = `${CONFIG.APIs.coinGecko.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;
            const response = await fetch(url);
            this.incrementRateLimit('coinGecko');
            this.updateRateLimitDisplay();
            
            if (!response.ok) {
                throw new Error(`CoinGecko API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fout bij ophalen CoinGecko data:', error);
            return null;
        }
    }

    /**
     * Fetch data from CoinMarketCap API
     */
    async fetchFromCoinMarketCap() {
        if (!CONFIG.APIs.coinMarketCap.enabled) return null;
        
        if (!this.checkRateLimit('coinMarketCap')) {
            throw new Error('Rate limit bereikt. Wacht even voordat je nieuwe data ophaalt.');
        }
        
        try {
            const url = `${CONFIG.APIs.coinMarketCap.baseUrl}/cryptocurrency/listings/latest?limit=50`;
            const response = await fetch(url, {
                headers: {
                    'X-CMC_PRO_API_KEY': CONFIG.APIs.coinMarketCap.key
                }
            });
            this.incrementRateLimit('coinMarketCap');
            this.updateRateLimitDisplay();
            
            if (!response.ok) {
                throw new Error(`CoinMarketCap API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Fout bij ophalen CoinMarketCap data:', error);
            return null;
        }
    }

    /**
     * Fetch data from StakingRewards API
     */
    async fetchFromStakingRewards() {
        if (!CONFIG.APIs.stakingRewards.enabled || !CONFIG.APIs.stakingRewards.key) return null;
        
        if (!this.checkRateLimit('stakingRewards')) {
            throw new Error('Rate limit bereikt. Wacht even voordat je nieuwe data ophaalt.');
        }
        
        try {
            const url = `${CONFIG.APIs.stakingRewards.baseUrl}/assets?limit=50`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${CONFIG.APIs.stakingRewards.key}`
                }
            });
            this.incrementRateLimit('stakingRewards');
            this.updateRateLimitDisplay();
            
            if (!response.ok) {
                throw new Error(`StakingRewards API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fout bij ophalen StakingRewards data:', error);
            return null;
        }
    }

    /**
     * Fetch data from DeFiLlama API
     */
    async fetchFromDeFiLlama() {
        if (!CONFIG.APIs.deFiLlama.enabled) return null;
        
        if (!this.checkRateLimit('deFiLlama')) {
            throw new Error('Rate limit bereikt. Wacht even voordat je nieuwe data ophaalt.');
        }
        
        try {
            const url = `${CONFIG.APIs.deFiLlama.baseUrl}/pools`;
            const response = await fetch(url);
            this.incrementRateLimit('deFiLlama');
            this.updateRateLimitDisplay();
            
            if (!response.ok) {
                throw new Error(`DeFiLlama API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fout bij ophalen DeFiLlama data:', error);
            return null;
        }
    }

    /**
     * Fetch all data from enabled APIs
     */
    async fetchAllData() {
        if (!this.checkGlobalRateLimit()) {
            throw new Error('Rate limit bereikt. Wacht even voordat je nieuwe data ophaalt.');
        }
        
        try {
            const [coinGeckoData, coinMarketCapData, stakingRewardsData, deFiLlamaData] = await Promise.all([
                this.fetchFromCoinGecko(),
                this.fetchFromCoinMarketCap(),
                this.fetchFromStakingRewards(),
                this.fetchFromDeFiLlama()
            ]);
            
            // Combineer en verwerk de data
            return this.processData(coinGeckoData, coinMarketCapData, stakingRewardsData, deFiLlamaData);
        } catch (error) {
            console.error('Fout bij ophalen data:', error);
            throw error;
        }
    }

    /**
     * Process and combine data from different sources
     */
    processData(coinGeckoData, coinMarketCapData, stakingRewardsData, deFiLlamaData) {
        let processedData = [];
        
        // Gebruik CoinGecko data als primaire bron
        if (coinGeckoData && coinGeckoData.length > 0) {
            processedData = coinGeckoData.map(item => {
                // Zoek aanvullende data uit andere bronnen
                const marketCapItem = coinMarketCapData ? 
                    coinMarketCapData.find(mc => mc.symbol.toLowerCase() === item.symbol.toLowerCase()) : null;
                
                const stakingItem = stakingRewardsData ? 
                    stakingRewardsData.find(sr => sr.symbol.toLowerCase() === item.symbol.toLowerCase()) : null;
                
                const llamaItem = deFiLlamaData ? 
                    deFiLlamaData.data?.find(ll => ll.symbol.toLowerCase() === item.symbol.toLowerCase()) : null;
                
                return {
                    id: item.id,
                    name: item.name,
                    symbol: item.symbol,
                    logo: item.image,
                    rank: item.market_cap_rank,
                    current_price: item.current_price,
                    market_cap: item.market_cap,
                    price_change_percentage_24h: item.price_change_percentage_24h,
                    // Voeg staking data toe indien beschikbaar
                    staking_apy: stakingItem ? stakingItem.staking_apy : (llamaItem ? llamaItem.apy : null),
                    exchanges: this.getExchangesForCrypto(item.symbol)
                };
            });
        }
        
        return processedData;
    }

    /**
     * Get exchanges for a specific cryptocurrency
     */
    getExchangesForCrypto(symbol) {
        // Simuleer exchange data voor demo doeleinden
        const baseApy = Math.random() * 15 + 1;
        return [
            { name: "Bitvavo", apy: parseFloat((baseApy * (0.9 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4 + Math.random() * 0.8).toFixed(1)) },
            { name: "Coinbase", apy: parseFloat((baseApy * (0.8 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4 + Math.random() * 0.7).toFixed(1)) },
            { name: "Binance", apy: parseFloat((baseApy * (1.0 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)) },
            { name: "Kraken", apy: parseFloat((baseApy * (0.85 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4 + Math.random() * 0.7).toFixed(1)) }
        ];
    }

    /**
     * Check global rate limit
     */
    checkGlobalRateLimit() {
        const now = Date.now();
        const timeDiff = (now - CONFIG.app.lastRequestTime) / 1000;
        
        if (timeDiff > CONFIG.app.intervalSeconds) {
            // Interval is verstreken, reset teller
            CONFIG.app.requestsMade = 0;
            CONFIG.app.lastRequestTime = now;
            return true;
        }
        
        if (CONFIG.app.requestsMade < CONFIG.app.requestLimit) {
            return true;
        }
        
        return false;
    }

    /**
     * Update rate limit display
     */
    updateRateLimitDisplay() {
        const progressPercent = (CONFIG.app.requestsMade / CONFIG.app.requestLimit) * 100;
        const rateLimitProgress = document.getElementById('rateLimitProgress');
        if (rateLimitProgress) {
            rateLimitProgress.style.width = `${progressPercent}%`;
        }
        
        // Update status tekst
        const apiStatus = document.getElementById('api-status');
        if (apiStatus) {
            if (progressPercent < 70) {
                apiStatus.textContent = 'Actief';
                apiStatus.className = 'stats-number positive';
            } else if (progressPercent < 90) {
                apiStatus.textContent = 'Waarschuwing';
                apiStatus.className = 'stats-number text-warning';
            } else {
                apiStatus.textContent = 'Bijna vol';
                apiStatus.className = 'stats-number negative';
            }
        }
    }
}

// Initialize API Manager
const apiManager = new APIManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIManager;
} else {
    window.apiManager = apiManager;
}
