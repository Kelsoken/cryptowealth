/**
 * Configuration file for Crypto Staking Comparison App
 * Contains API endpoints, settings, and default values
 */

const CONFIG = {
    // API Configuration
    APIs: {
        coinGecko: {
            enabled: true,
            baseUrl: 'https://api.coingecko.com/api/v3',
            endpoints: {
                coins: '/coins/markets',
                coin: '/coins',
                global: '/global',
                trending: '/search/trending'
            },
            rateLimit: {
                requests: 50,
                interval: 60000, // 1 minute
                burst: 10
            },
            requiresKey: false,
            key: ''
        },
        coinMarketCap: {
            enabled: true,
            baseUrl: 'https://pro-api.coinmarketcap.com/v1',
            endpoints: {
                listings: '/cryptocurrency/listings/latest',
                quotes: '/cryptocurrency/quotes/latest',
                global: '/global-metrics/quotes/latest'
            },
            rateLimit: {
                requests: 30,
                interval: 60000, // 1 minute
                burst: 5
            },
            requiresKey: true,
            key: 'demo_key'
        },
        stakingRewards: {
            enabled: false,
            baseUrl: 'https://api.stakingrewards.com/v1',
            endpoints: {
                assets: '/assets',
                staking: '/staking',
                providers: '/providers'
            },
            rateLimit: {
                requests: 10,
                interval: 60000, // 1 minute
                burst: 20
            },
            requiresKey: true,
            key: ''
        },
        deFiLlama: {
            enabled: false,
            baseUrl: 'https://yields.llama.fi',
            endpoints: {
                protocols: '/protocols',
                tvl: '/tvl',
                chains: '/chains'
            },
            rateLimit: {
                requests: 300,
                interval: 60000, // 1 minute
                burst: 50
            },
            requiresKey: false,
            key: ''
        }
    },

    // Exchange Configuration
    exchanges: {
        bitvavo: {
            name: 'Bitvavo',
            color: '#f8f9fa',
            textColor: '#495057',
            stakingSupported: true,
            minStake: 0.001,
            fees: 0.25
        },
        coinbase: {
            name: 'Coinbase',
            color: '#0052ff',
            textColor: '#ffffff',
            stakingSupported: true,
            minStake: 0.01,
            fees: 0.5
        },
        binance: {
            name: 'Binance',
            color: '#f0b90b',
            textColor: '#000000',
            stakingSupported: true,
            minStake: 0.001,
            fees: 0.1
        },
        kraken: {
            name: 'Kraken',
            color: '#5841a8',
            textColor: '#ffffff',
            stakingSupported: true,
            minStake: 0.01,
            fees: 0.25
        }
    },

    // App Settings
    app: {
        name: 'Crypto Staking Vergelijking',
        version: '1.0.0',
        defaultCurrency: 'eur',
        defaultLanguage: 'nl',
        itemsPerPage: 20,
        maxItems: 100,
        refreshInterval: 300000, // 5 minutes
        cacheTimeout: 300000, // 5 minutes
        theme: 'light',
        requestLimit: 10,
        intervalSeconds: 90,
        requestsMade: 3,
        lastRequestTime: Date.now()
    },

    // Staking Configuration
    staking: {
        minApy: 0.1, // 0.1%
        maxApy: 50, // 50%
        defaultStakeAmount: 1000, // €1000
        supportedCoins: [
            'bitcoin', 'ethereum', 'cardano', 'polkadot', 'solana',
            'avalanche', 'polygon', 'chainlink', 'uniswap', 'aave',
            'compound', 'maker', 'yearn-finance', 'sushi', 'curve-dao-token',
            'algorand', 'tezos', 'cosmos', 'near', 'fantom',
            'harmony', 'elrond', 'zilliqa', 'vechain', 'icon',
            'ontology', 'qtum', 'nano', 'decred', 'dash',
            'zcash', 'monero', 'litecoin', 'bitcoin-cash', 'ethereum-classic',
            'stellar', 'ripple', 'tron', 'eos', 'neo',
            'waves', 'nxt', 'ardor', 'nem', 'iota'
        ],
        stakingTypes: {
            'proof-of-stake': 'Proof of Stake',
            'delegated-proof-of-stake': 'Delegated Proof of Stake',
            'liquid-staking': 'Liquid Staking',
            'yield-farming': 'Yield Farming',
            'lending': 'Lending'
        }
    },

    // UI Configuration
    ui: {
        animations: true,
        darkMode: false,
        compactMode: false,
        showAdvanced: false,
        autoRefresh: true,
        notifications: true,
        soundEffects: false
    },

    // Cache Configuration
    cache: {
        enabled: true,
        maxSize: 100, // MB
        defaultTTL: 300000, // 5 minutes
        strategies: {
            'api': 300000, // 5 minutes
            'ui': 60000, // 1 minute
            'config': 3600000 // 1 hour
        }
    },

    // Error Handling
    errorHandling: {
        maxRetries: 3,
        retryDelay: 1000, // 1 second
        timeout: 10000, // 10 seconds
        showUserFriendlyErrors: true,
        logErrors: true
    },

    // Development Settings
    development: {
        debug: false,
        mockData: false,
        verboseLogging: false,
        apiLogging: false
    }
};

// Local Storage Keys
const STORAGE_KEYS = {
    API_KEYS: 'crypto_staking_api_keys',
    SETTINGS: 'crypto_staking_settings',
    CACHE: 'crypto_staking_cache',
    PREFERENCES: 'crypto_staking_preferences',
    LAST_UPDATE: 'crypto_staking_last_update'
};

// Default Settings
const DEFAULT_SETTINGS = {
    apiKeys: {
        coinGecko: null,
        coinMarketCap: 'demo_key',
        stakingRewards: null,
        defiLlama: null
    },
    preferences: {
        currency: 'eur',
        language: 'nl',
        theme: 'light',
        autoRefresh: true,
        notifications: true,
        compactMode: false
    },
    rateLimits: {
        requests: 10,
        interval: 90000 // 90 seconds
    }
};

// Mock Data for Development
const MOCK_DATA = {
    cryptocurrencies: (() => {
        const cryptoData = [];
        // Genereer 50 cryptocurrencies
        for (let i = 1; i <= 50; i++) {
            const baseApy = Math.random() * 15 + 1;
            cryptoData.push({
                id: i,
                name: `Crypto ${i}`,
                symbol: `CR${i}`,
                logo: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@bea1a9722a8c63169dcc6e1d2cf3dffd2e786ddf/128/color/generic.png",
                rank: i,
                current_price: Math.random() * 1000 + 1,
                market_cap: Math.random() * 100000000000 + 1000000000,
                total_volume: Math.random() * 10000000000 + 100000000,
                price_change_percentage_24h: (Math.random() - 0.5) * 20,
                exchanges: [
                    { name: "Bitvavo", apy: parseFloat((baseApy * (0.9 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4 + Math.random() * 0.8).toFixed(1)) },
                    { name: "Coinbase", apy: parseFloat((baseApy * (0.8 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4 + Math.random() * 0.7).toFixed(1)) },
                    { name: "Binance", apy: parseFloat((baseApy * (1.0 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)) },
                    { name: "Kraken", apy: parseFloat((baseApy * (0.85 + Math.random() * 0.2)).toFixed(1)), rating: parseFloat((4 + Math.random() * 0.7).toFixed(1)) }
                ]
            });
        }
        return cryptoData;
    })(),
    global: {
        active_cryptocurrencies: 5000,
        total_market_cap: { eur: 1200000000000 },
        total_volume: { eur: 50000000000 },
        market_cap_percentage: {
            btc: 45.2,
            eth: 18.5
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, STORAGE_KEYS, DEFAULT_SETTINGS, MOCK_DATA };
} else {
    window.CONFIG = CONFIG;
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
    window.MOCK_DATA = MOCK_DATA;
}
