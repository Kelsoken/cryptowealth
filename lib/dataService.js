// Data service for fetching market data from the data hub
class DataService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_DATA_HUB_URL || '/api/data';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetchWithCache(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = new URL(endpoint, this.baseUrl);
      Object.keys(options).forEach(key => {
        if (options[key] !== undefined) {
          url.searchParams.append(key, options[key]);
        }
      });

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  // Market data methods
  async getMarketPrices(limit = 100) {
    return this.fetchWithCache('/market-prices', { limit });
  }

  async getCoinData(symbol) {
    return this.fetchWithCache(`/coin/${symbol.toUpperCase()}`);
  }

  async searchCoins(query) {
    return this.fetchWithCache('/search', { q: query });
  }

  // Staking data methods
  async getStakingData(symbols = null) {
    const options = {};
    if (symbols) {
      options.symbols = Array.isArray(symbols) ? symbols.join(',') : symbols;
    }
    return this.fetchWithCache('/staking-data', options);
  }

  async getTopStaking(limit = 20) {
    return this.fetchWithCache('/top-staking', { limit });
  }

  // DeFi data methods
  async getDeFiData(limit = 50, category = null) {
    const options = { limit };
    if (category) {
      options.category = category;
    }
    return this.fetchWithCache('/defi-data', options);
  }

  // System methods
  async getMarketSummary() {
    return this.fetchWithCache('/market-summary');
  }

  async getHealthStatus() {
    return this.fetchWithCache('/health');
  }

  // Utility methods
  clearCache() {
    this.cache.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;

// React hooks for data fetching
export const useMarketData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const marketData = await dataService.getMarketPrices();
        setData(marketData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useStakingData = (symbols = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stakingData = await dataService.getStakingData(symbols);
        setData(stakingData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbols]);

  return { data, loading, error };
};

export const useCoinData = (symbol) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const coinData = await dataService.getCoinData(symbol);
        setData(coinData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  return { data, loading, error };
};
