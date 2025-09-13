export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Mock portfolio data - in production, this would come from a database
    const portfolioData = {
      totalValue: 125000.50,
      totalChange24h: 2850.75,
      totalChangePercentage: 2.33,
      assets: [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 2.5,
          currentPrice: 43250.50,
          value: 108126.25,
          change24h: 2643.75,
          changePercentage: 2.50,
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          amount: 5.0,
          currentPrice: 2650.75,
          value: 13253.75,
          change24h: 243.75,
          changePercentage: 1.87,
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
        },
        {
          id: 'cardano',
          symbol: 'ADA',
          name: 'Cardano',
          amount: 10000,
          currentPrice: 0.485,
          value: 4850.00,
          change24h: 152.50,
          changePercentage: 3.25,
          image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
        }
      ],
      performance: {
        daily: [
          { date: '2024-01-01', value: 120000 },
          { date: '2024-01-02', value: 121500 },
          { date: '2024-01-03', value: 119800 },
          { date: '2024-01-04', value: 122300 },
          { date: '2024-01-05', value: 123500 },
          { date: '2024-01-06', value: 124200 },
          { date: '2024-01-07', value: 125000 }
        ],
        weekly: [
          { date: '2024-01-01', value: 120000 },
          { date: '2024-01-08', value: 121500 },
          { date: '2024-01-15', value: 119800 },
          { date: '2024-01-22', value: 122300 },
          { date: '2024-01-29', value: 123500 }
        ],
        monthly: [
          { date: '2024-01-01', value: 120000 },
          { date: '2024-02-01', value: 121500 },
          { date: '2024-03-01', value: 119800 },
          { date: '2024-04-01', value: 122300 },
          { date: '2024-05-01', value: 123500 }
        ]
      },
      allocation: [
        { symbol: 'BTC', percentage: 86.5, value: 108126.25 },
        { symbol: 'ETH', percentage: 10.6, value: 13253.75 },
        { symbol: 'ADA', percentage: 2.9, value: 4850.00 }
      ]
    };

    return res.status(200).json({
      success: true,
      data: portfolioData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in portfolio overview API:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
