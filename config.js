/**
 * Configuration file for Crypto Staking Comparison App
 * Contains API endpoints, settings, and default values
 */

const CONFIG = {
    // API Configuration
    APIs: {
        coinGecko: {
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
            key: null
        },
        coinMarketCap: {
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
            key: 'demo_key' // Default demo key
        },
        stakingRewards: {
            baseUrl: 'https://api.stakingrewards.com/public/v1',
            endpoints: {
                assets: '/assets',
                staking: '/staking',
                providers: '/providers'
            },
            rateLimit: {
                requests: 100,
                interval: 60000, // 1 minute
                burst: 20
            },
            requiresKey: true,
            key: null
        },
        defiLlama: {
            baseUrl: 'https://api.llama.fi',
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
            key: null
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
        theme: 'light'
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
    cryptocurrencies: [
        {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            rank: 2,
            current_price: 2500,
            market_cap: 300000000000,
            total_volume: 15000000000,
            price_change_percentage_24h: 2.5,
            staking: {
                apy: 5.2,
                minStake: 32,
                type: 'proof-of-stake',
                exchanges: ['coinbase', 'kraken', 'binance']
            }
        },
        {
            id: 'cardano',
            name: 'Cardano',
            symbol: 'ADA',
            rank: 8,
            current_price: 0.45,
            market_cap: 15000000000,
            total_volume: 500000000,
            price_change_percentage_24h: -1.2,
            staking: {
                apy: 4.8,
                minStake: 10,
                type: 'delegated-proof-of-stake',
                exchanges: ['bitvavo', 'binance', 'kraken']
            }
        },
        {
            id: 'polkadot',
            name: 'Polkadot',
            symbol: 'DOT',
            rank: 12,
            current_price: 6.5,
            market_cap: 8000000000,
            total_volume: 300000000,
            price_change_percentage_24h: 3.1,
            staking: {
                apy: 12.5,
                minStake: 1,
                type: 'nominated-proof-of-stake',
                exchanges: ['kraken', 'binance', 'coinbase']
            }
        }
    ],
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
