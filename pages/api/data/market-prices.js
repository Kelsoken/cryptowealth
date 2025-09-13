// Next.js API route for market prices
export default async function handler(req, res) {
  try {
    // Forward request to data hub
    const response = await fetch(`${process.env.DATA_HUB_URL || 'http://localhost:5000'}/api/data/market-prices?${new URLSearchParams(req.query)}`);
    
    if (!response.ok) {
      throw new Error(`Data hub responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    
    // Fallback data if data hub is unavailable
    const fallbackData = {
      data: [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          current_price: 43250,
          market_cap: 850000000000,
          market_cap_rank: 1,
          total_volume: 25000000000,
          price_change_1h: 0.5,
          price_change_24h: 2.3,
          price_change_7d: 8.7,
          last_updated: new Date().toISOString()
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          current_price: 2650,
          market_cap: 320000000000,
          market_cap_rank: 2,
          total_volume: 15000000000,
          price_change_1h: 0.8,
          price_change_24h: 1.9,
          price_change_7d: 12.4,
          last_updated: new Date().toISOString()
        }
      ],
      count: 2,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    };
    
    res.status(200).json(fallbackData);
  }
}
