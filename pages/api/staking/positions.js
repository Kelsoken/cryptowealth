export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Mock staking positions data
    const stakingData = [
      {
        id: 1,
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 5.0,
        apy: 5.2,
        platform: 'Coinbase',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        status: 'active',
        rewards: 0.65,
        totalValue: 13253.75,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 2,
        symbol: 'ADA',
        name: 'Cardano',
        amount: 10000,
        apy: 4.8,
        platform: 'Binance',
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        status: 'active',
        rewards: 192.0,
        totalValue: 4850.00,
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
      },
      {
        id: 3,
        symbol: 'SOL',
        name: 'Solana',
        amount: 25.0,
        apy: 7.2,
        platform: 'Kraken',
        startDate: '2024-01-20',
        endDate: '2024-04-20',
        status: 'active',
        rewards: 4.5,
        totalValue: 2462.50,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      }
    ];

    // Calculate total staking value and rewards
    const totalValue = stakingData.reduce((sum, position) => sum + position.totalValue, 0);
    const totalRewards = stakingData.reduce((sum, position) => sum + position.rewards, 0);
    const averageAPY = stakingData.reduce((sum, position) => sum + position.apy, 0) / stakingData.length;

    return res.status(200).json({
      success: true,
      data: stakingData,
      summary: {
        totalPositions: stakingData.length,
        totalValue,
        totalRewards,
        averageAPY: averageAPY.toFixed(2)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in staking positions API:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
