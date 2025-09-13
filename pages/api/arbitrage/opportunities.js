export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Mock arbitrage opportunities data
    const arbitrageData = [
      {
        id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        buyExchange: 'Binance',
        sellExchange: 'Coinbase',
        buyPrice: 43200.00,
        sellPrice: 43280.00,
        priceDifference: 80.00,
        profitPercentage: 0.19,
        volume: 0.5,
        estimatedProfit: 40.00,
        risk: 'low',
        timestamp: new Date().toISOString(),
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      },
      {
        id: 2,
        symbol: 'ETH',
        name: 'Ethereum',
        buyExchange: 'Kraken',
        sellExchange: 'Bitvavo',
        buyPrice: 2645.00,
        sellPrice: 2665.00,
        priceDifference: 20.00,
        profitPercentage: 0.76,
        volume: 2.0,
        estimatedProfit: 40.00,
        risk: 'medium',
        timestamp: new Date().toISOString(),
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 3,
        symbol: 'ADA',
        name: 'Cardano',
        buyExchange: 'Binance',
        sellExchange: 'Kraken',
        buyPrice: 0.482,
        sellPrice: 0.488,
        priceDifference: 0.006,
        profitPercentage: 1.24,
        volume: 5000,
        estimatedProfit: 30.00,
        risk: 'low',
        timestamp: new Date().toISOString(),
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
      },
      {
        id: 4,
        symbol: 'SOL',
        name: 'Solana',
        buyExchange: 'Coinbase',
        sellExchange: 'Binance',
        buyPrice: 98.20,
        sellPrice: 98.80,
        priceDifference: 0.60,
        profitPercentage: 0.61,
        volume: 10,
        estimatedProfit: 6.00,
        risk: 'low',
        timestamp: new Date().toISOString(),
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      }
    ];

    // Calculate summary statistics
    const totalOpportunities = arbitrageData.length;
    const totalEstimatedProfit = arbitrageData.reduce((sum, opp) => sum + opp.estimatedProfit, 0);
    const averageProfitPercentage = arbitrageData.reduce((sum, opp) => sum + opp.profitPercentage, 0) / totalOpportunities;
    const lowRiskOpportunities = arbitrageData.filter(opp => opp.risk === 'low').length;

    return res.status(200).json({
      success: true,
      data: arbitrageData,
      summary: {
        totalOpportunities,
        totalEstimatedProfit,
        averageProfitPercentage: averageProfitPercentage.toFixed(2),
        lowRiskOpportunities,
        highProfitOpportunities: arbitrageData.filter(opp => opp.profitPercentage > 1.0).length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in arbitrage opportunities API:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
