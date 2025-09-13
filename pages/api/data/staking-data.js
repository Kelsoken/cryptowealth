// Next.js API route for staking data
export default async function handler(req, res) {
  try {
    // Forward request to data hub
    const response = await fetch(`${process.env.DATA_HUB_URL || 'http://localhost:5000'}/api/data/staking-data?${new URLSearchParams(req.query)}`);
    
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
    console.error('Error fetching staking data:', error);
    
    // Fallback staking data
    const fallbackData = {
      data: [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          current_price: 2650,
          market_cap: 320000000000,
          staking_apy: 5.2,
          last_updated: new Date().toISOString()
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          current_price: 0.485,
          market_cap: 17000000000,
          staking_apy: 4.8,
          last_updated: new Date().toISOString()
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          current_price: 98.50,
          market_cap: 45000000000,
          staking_apy: 7.1,
          last_updated: new Date().toISOString()
        },
        {
          symbol: 'DOT',
          name: 'Polkadot',
          current_price: 7.25,
          market_cap: 9000000000,
          staking_apy: 12.5,
          last_updated: new Date().toISOString()
        }
      ],
      count: 4,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    };
    
    res.status(200).json(fallbackData);
  }
}
