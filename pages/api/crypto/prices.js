import axios from 'axios';

// Real-time crypto data from CoinGecko API
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Cache for API responses
let cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes
};

// Fallback mock data
const mockCryptoData = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    current_price: 43250.50,
    price_change_percentage_24h: 2.45,
    market_cap: 847500000000,
    total_volume: 28500000000,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    sparkline_in_7d: {
      price: [42000, 42500, 43000, 42800, 43200, 43500, 43250]
    }
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    current_price: 2650.75,
    price_change_percentage_24h: 1.85,
    market_cap: 318000000000,
    total_volume: 15200000000,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    sparkline_in_7d: {
      price: [2600, 2620, 2640, 2630, 2650, 2670, 2650]
    }
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    current_price: 315.20,
    price_change_percentage_24h: -0.75,
    market_cap: 48500000000,
    total_volume: 1200000000,
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    sparkline_in_7d: {
      price: [320, 318, 315, 317, 314, 316, 315]
    }
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    current_price: 0.485,
    price_change_percentage_24h: 3.25,
    market_cap: 17100000000,
    total_volume: 450000000,
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    sparkline_in_7d: {
      price: [0.47, 0.48, 0.49, 0.48, 0.485, 0.49, 0.485]
    }
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    current_price: 98.50,
    price_change_percentage_24h: 4.15,
    market_cap: 42500000000,
    total_volume: 2100000000,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    sparkline_in_7d: {
      price: [95, 96, 97, 96.5, 98, 99, 98.5]
    }
  }
];

async function fetchRealTimeData() {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h'
      },
      timeout: 10000 // 10 second timeout
    });

    return response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      image: coin.image,
      sparkline_in_7d: {
        price: coin.sparkline_in_7d?.price || []
      }
    }));
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.ttl) {
      return res.status(200).json({
        success: true,
        data: cache.data,
        pagination: {
          page: 1,
          limit: 50,
          total: cache.data.length,
          totalPages: 1
        },
        source: 'cache',
        timestamp: new Date(cache.timestamp).toISOString()
      });
    }

    // Try to fetch real-time data
    const realTimeData = await fetchRealTimeData();
    
    if (realTimeData && realTimeData.length > 0) {
      // Update cache
      cache.data = realTimeData;
      cache.timestamp = now;
      
      return res.status(200).json({
        success: true,
        data: realTimeData,
        pagination: {
          page: 1,
          limit: 50,
          total: realTimeData.length,
          totalPages: 1
        },
        source: 'coingecko',
        timestamp: new Date().toISOString()
      });
    }

    // Fallback to mock data
    return res.status(200).json({
      success: true,
      data: mockCryptoData,
      pagination: {
        page: 1,
        limit: 50,
        total: mockCryptoData.length,
        totalPages: 1
      },
      source: 'mock',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in crypto prices API:', error);
    
    // Return mock data as fallback
    return res.status(200).json({
      success: true,
      data: mockCryptoData,
      pagination: {
        page: 1,
        limit: 50,
        total: mockCryptoData.length,
        totalPages: 1
      },
      source: 'fallback',
      timestamp: new Date().toISOString(),
      error: 'Using fallback data due to API error'
    });
  }
}
