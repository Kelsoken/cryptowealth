import { useState, useEffect } from 'react';
import ProtectedRoute from '../lib/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

function StakingPage() {
  const { user } = useAuth();
  const [stakingData, setStakingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('apy');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Only fetch data on client side
    if (typeof window !== 'undefined') {
    fetchStakingData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStakingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data/staking-data');
      if (!response.ok) {
        throw new Error('Failed to fetch staking data');
      }
      const data = await response.json();
      setStakingData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching staking data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Top 50 Cryptocurrencies with Staking Data
  const fallbackData = {
    data: [
      // Top 10 for testing
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        current_price: 43250,
        market_cap: 850000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 2650,
        market_cap: 320000000000,
        staking_apy: 4.2,
        risk_level: 'low',
        staking_details: {
          min_stake: 32,
          validator_count: 900000,
          total_staked: 32000000,
          confidence: 'high',
          lock_period: 'Indefinite',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether',
        current_price: 1.00,
        market_cap: 95000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'bnb',
        symbol: 'BNB',
        name: 'BNB',
        current_price: 315,
        market_cap: 48000000000,
        staking_apy: 3.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 0.1,
          validator_count: 100,
          total_staked: 150000000,
          confidence: 'high',
          lock_period: '7 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        current_price: 95,
        market_cap: 42000000000,
        staking_apy: 6.5,
        risk_level: 'medium',
        staking_details: {
          min_stake: 0.1,
          validator_count: 2000,
          total_staked: 400000000,
          confidence: 'medium',
          lock_period: '2-3 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'xrp',
        symbol: 'XRP',
        name: 'XRP',
        current_price: 0.62,
        market_cap: 35000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'usd-coin',
        symbol: 'USDC',
        name: 'USD Coin',
        current_price: 1.00,
        market_cap: 28000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'staked-ether',
        symbol: 'STETH',
        name: 'Lido Staked ETH',
        current_price: 2650,
        market_cap: 25000000000,
        staking_apy: 4.1,
        risk_level: 'low',
        staking_details: {
          min_stake: 0.1,
          validator_count: 30000,
          total_staked: 9000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        current_price: 0.45,
        market_cap: 16000000000,
        staking_apy: 5.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 3000,
          total_staked: 24000000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'None'
        }
      },
      {
        id: 'avalanche-2',
        symbol: 'AVAX',
        name: 'Avalanche',
        current_price: 28,
        market_cap: 11000000000,
        staking_apy: 8.9,
        risk_level: 'medium',
        staking_details: {
          min_stake: 25,
          validator_count: 1200,
          total_staked: 250000000,
          confidence: 'high',
          lock_period: '14-21 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'dogecoin',
        symbol: 'DOGE',
        name: 'Dogecoin',
        current_price: 0.08,
        market_cap: 12000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'polkadot',
        symbol: 'DOT',
        name: 'Polkadot',
        current_price: 6.8,
        market_cap: 8500000000,
        staking_apy: 12.5,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 1000,
          total_staked: 600000000,
          confidence: 'high',
          lock_period: '28 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'chainlink',
        symbol: 'LINK',
        name: 'Chainlink',
        current_price: 14.5,
        market_cap: 8000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'polygon',
        symbol: 'MATIC',
        name: 'Polygon',
        current_price: 0.85,
        market_cap: 7800000000,
        staking_apy: 4.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 9000000000,
          confidence: 'high',
          lock_period: '3 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'litecoin',
        symbol: 'LTC',
        name: 'Litecoin',
        current_price: 72,
        market_cap: 5400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'cosmos',
        symbol: 'ATOM',
        name: 'Cosmos',
        current_price: 8.5,
        market_cap: 3200000000,
        staking_apy: 19.2,
        risk_level: 'high',
        staking_details: {
          min_stake: 0.1,
          validator_count: 150,
          total_staked: 200000000,
          confidence: 'medium',
          lock_period: '21 days',
          slashing_risk: 'High'
        }
      },
      {
        id: 'uniswap',
        symbol: 'UNI',
        name: 'Uniswap',
        current_price: 6.2,
        market_cap: 3700000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'ethereum-classic',
        symbol: 'ETC',
        name: 'Ethereum Classic',
        current_price: 18.5,
        market_cap: 2800000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'monero',
        symbol: 'XMR',
        name: 'Monero',
        current_price: 155,
        market_cap: 2800000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'stellar',
        symbol: 'XLM',
        name: 'Stellar',
        current_price: 0.12,
        market_cap: 3500000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'algorand',
        symbol: 'ALGO',
        name: 'Algorand',
        current_price: 0.18,
        market_cap: 1400000000,
        staking_apy: 4.5,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 7000000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'None'
        }
      },
      {
        id: 'vechain',
        symbol: 'VET',
        name: 'VeChain',
        current_price: 0.025,
        market_cap: 1800000000,
        staking_apy: 1.2,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 101,
          total_staked: 72000000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'None'
        }
      },
      {
        id: 'filecoin',
        symbol: 'FIL',
        name: 'Filecoin',
        current_price: 4.2,
        market_cap: 2000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'hedera-hashgraph',
        symbol: 'HBAR',
        name: 'Hedera',
        current_price: 0.045,
        market_cap: 1500000000,
        staking_apy: 6.5,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 39,
          total_staked: 33000000000,
          confidence: 'medium',
          lock_period: 'None',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'near',
        symbol: 'NEAR',
        name: 'NEAR Protocol',
        current_price: 1.8,
        market_cap: 1800000000,
        staking_apy: 8.2,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 1000000000,
          confidence: 'medium',
          lock_period: '1-3 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'fantom',
        symbol: 'FTM',
        name: 'Fantom',
        current_price: 0.35,
        market_cap: 1000000000,
        staking_apy: 4.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 2800000000,
          confidence: 'high',
          lock_period: '7 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'elrond-erd-2',
        symbol: 'EGLD',
        name: 'MultiversX',
        current_price: 45,
        market_cap: 1200000000,
        staking_apy: 11.2,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 3200,
          total_staked: 26000000,
          confidence: 'high',
          lock_period: '10 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'tezos',
        symbol: 'XTZ',
        name: 'Tezos',
        current_price: 0.95,
        market_cap: 900000000,
        staking_apy: 5.5,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 400,
          total_staked: 950000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'the-sandbox',
        symbol: 'SAND',
        name: 'The Sandbox',
        current_price: 0.42,
        market_cap: 950000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'decentraland',
        symbol: 'MANA',
        name: 'Decentraland',
        current_price: 0.38,
        market_cap: 700000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'chiliz',
        symbol: 'CHZ',
        name: 'Chiliz',
        current_price: 0.08,
        market_cap: 700000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'flow',
        symbol: 'FLOW',
        name: 'Flow',
        current_price: 0.65,
        market_cap: 650000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'apecoin',
        symbol: 'APE',
        name: 'ApeCoin',
        current_price: 1.8,
        market_cap: 650000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'klaytn',
        symbol: 'KLAY',
        name: 'Klaytn',
        current_price: 0.18,
        market_cap: 600000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'eos',
        symbol: 'EOS',
        name: 'EOS',
        current_price: 0.65,
        market_cap: 600000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'thorchain',
        symbol: 'RUNE',
        name: 'THORChain',
        current_price: 1.8,
        market_cap: 550000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'pancakeswap-token',
        symbol: 'CAKE',
        name: 'PancakeSwap',
        current_price: 2.1,
        market_cap: 500000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'compound-governance-token',
        symbol: 'COMP',
        name: 'Compound',
        current_price: 55,
        market_cap: 450000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'maker',
        symbol: 'MKR',
        name: 'Maker',
        current_price: 1200,
        market_cap: 1100000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'aave',
        symbol: 'AAVE',
        name: 'Aave',
        current_price: 85,
        market_cap: 1200000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'curve-dao-token',
        symbol: 'CRV',
        name: 'Curve DAO Token',
        current_price: 0.45,
        market_cap: 400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'synthetix-network-token',
        symbol: 'SNX',
        name: 'Synthetix',
        current_price: 2.8,
        market_cap: 400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'yearn-finance',
        symbol: 'YFI',
        name: 'yearn.finance',
        current_price: 6500,
        market_cap: 220000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: '1inch',
        symbol: '1INCH',
        name: '1inch',
        current_price: 0.35,
        market_cap: 400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'sushi',
        symbol: 'SUSHI',
        name: 'SushiSwap',
        current_price: 1.2,
        market_cap: 300000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'balancer',
        symbol: 'BAL',
        name: 'Balancer',
        current_price: 3.8,
        market_cap: 200000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'ren',
        symbol: 'REN',
        name: 'REN',
        current_price: 0.08,
        market_cap: 80000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'kyber-network-crystal',
        symbol: 'KNC',
        name: 'Kyber Network Crystal',
        current_price: 0.65,
        market_cap: 120000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'bancor',
        symbol: 'BNT',
        name: 'Bancor',
        current_price: 0.45,
        market_cap: 100000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      }
    ]
  };
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 2650,
        market_cap: 320000000000,
        staking_apy: 4.2,
        risk_level: 'low',
        staking_details: {
          min_stake: 32,
          validator_count: 900000,
          total_staked: 32000000,
          confidence: 'high',
          lock_period: 'Indefinite',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether',
        current_price: 1.00,
        market_cap: 95000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'bnb',
        symbol: 'BNB',
        name: 'BNB',
        current_price: 315,
        market_cap: 48000000000,
        staking_apy: 3.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 0.1,
          validator_count: 100,
          total_staked: 150000000,
          confidence: 'high',
          lock_period: '7 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        current_price: 95,
        market_cap: 42000000000,
        staking_apy: 6.5,
        risk_level: 'medium',
        staking_details: {
          min_stake: 0.1,
          validator_count: 2000,
          total_staked: 400000000,
          confidence: 'medium',
          lock_period: '2-3 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'xrp',
        symbol: 'XRP',
        name: 'XRP',
        current_price: 0.62,
        market_cap: 35000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'usd-coin',
        symbol: 'USDC',
        name: 'USD Coin',
        current_price: 1.00,
        market_cap: 28000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'staked-ether',
        symbol: 'STETH',
        name: 'Lido Staked ETH',
        current_price: 2650,
        market_cap: 25000000000,
        staking_apy: 4.1,
        risk_level: 'low',
        staking_details: {
          min_stake: 0.1,
          validator_count: 30000,
          total_staked: 9000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        current_price: 0.45,
        market_cap: 16000000000,
        staking_apy: 5.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 3000,
          total_staked: 24000000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'None'
        }
      },
      {
        id: 'avalanche-2',
        symbol: 'AVAX',
        name: 'Avalanche',
        current_price: 28,
        market_cap: 11000000000,
        staking_apy: 8.9,
        risk_level: 'medium',
        staking_details: {
          min_stake: 25,
          validator_count: 1200,
          total_staked: 250000000,
          confidence: 'high',
          lock_period: '14-21 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'dogecoin',
        symbol: 'DOGE',
        name: 'Dogecoin',
        current_price: 0.08,
        market_cap: 12000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'polkadot',
        symbol: 'DOT',
        name: 'Polkadot',
        current_price: 6.8,
        market_cap: 8500000000,
        staking_apy: 12.5,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 1000,
          total_staked: 600000000,
          confidence: 'high',
          lock_period: '28 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'chainlink',
        symbol: 'LINK',
        name: 'Chainlink',
        current_price: 14.5,
        market_cap: 8000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'polygon',
        symbol: 'MATIC',
        name: 'Polygon',
        current_price: 0.85,
        market_cap: 7800000000,
        staking_apy: 4.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 9000000000,
          confidence: 'high',
          lock_period: '3 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'litecoin',
        symbol: 'LTC',
        name: 'Litecoin',
        current_price: 72,
        market_cap: 5400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'cosmos',
        symbol: 'ATOM',
        name: 'Cosmos',
        current_price: 8.5,
        market_cap: 3200000000,
        staking_apy: 19.2,
        risk_level: 'high',
        staking_details: {
          min_stake: 0.1,
          validator_count: 150,
          total_staked: 200000000,
          confidence: 'medium',
          lock_period: '21 days',
          slashing_risk: 'High'
        }
      },
      {
        id: 'uniswap',
        symbol: 'UNI',
        name: 'Uniswap',
        current_price: 6.2,
        market_cap: 3700000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'ethereum-classic',
        symbol: 'ETC',
        name: 'Ethereum Classic',
        current_price: 18.5,
        market_cap: 2800000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'monero',
        symbol: 'XMR',
        name: 'Monero',
        current_price: 155,
        market_cap: 2800000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'stellar',
        symbol: 'XLM',
        name: 'Stellar',
        current_price: 0.12,
        market_cap: 3500000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'algorand',
        symbol: 'ALGO',
        name: 'Algorand',
        current_price: 0.18,
        market_cap: 1400000000,
        staking_apy: 4.5,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 7000000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'None'
        }
      },
      {
        id: 'vechain',
        symbol: 'VET',
        name: 'VeChain',
        current_price: 0.025,
        market_cap: 1800000000,
        staking_apy: 1.2,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 101,
          total_staked: 72000000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'None'
        }
      },
      {
        id: 'filecoin',
        symbol: 'FIL',
        name: 'Filecoin',
        current_price: 4.2,
        market_cap: 2000000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'hedera-hashgraph',
        symbol: 'HBAR',
        name: 'Hedera',
        current_price: 0.045,
        market_cap: 1500000000,
        staking_apy: 6.5,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 39,
          total_staked: 33000000000,
          confidence: 'medium',
          lock_period: 'None',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'near',
        symbol: 'NEAR',
        name: 'NEAR Protocol',
        current_price: 1.8,
        market_cap: 1800000000,
        staking_apy: 8.2,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 1000000000,
          confidence: 'medium',
          lock_period: '1-3 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'fantom',
        symbol: 'FTM',
        name: 'Fantom',
        current_price: 0.35,
        market_cap: 1000000000,
        staking_apy: 4.8,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 100,
          total_staked: 2800000000,
          confidence: 'high',
          lock_period: '7 days',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'elrond-erd-2',
        symbol: 'EGLD',
        name: 'MultiversX',
        current_price: 45,
        market_cap: 1200000000,
        staking_apy: 11.2,
        risk_level: 'medium',
        staking_details: {
          min_stake: 1,
          validator_count: 3200,
          total_staked: 26000000,
          confidence: 'high',
          lock_period: '10 days',
          slashing_risk: 'Medium'
        }
      },
      {
        id: 'tezos',
        symbol: 'XTZ',
        name: 'Tezos',
        current_price: 0.95,
        market_cap: 900000000,
        staking_apy: 5.5,
        risk_level: 'low',
        staking_details: {
          min_stake: 1,
          validator_count: 400,
          total_staked: 950000000,
          confidence: 'high',
          lock_period: 'None',
          slashing_risk: 'Low'
        }
      },
      {
        id: 'the-sandbox',
        symbol: 'SAND',
        name: 'The Sandbox',
        current_price: 0.42,
        market_cap: 950000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'decentraland',
        symbol: 'MANA',
        name: 'Decentraland',
        current_price: 0.38,
        market_cap: 700000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'chiliz',
        symbol: 'CHZ',
        name: 'Chiliz',
        current_price: 0.08,
        market_cap: 700000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'flow',
        symbol: 'FLOW',
        name: 'Flow',
        current_price: 0.65,
        market_cap: 650000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'apecoin',
        symbol: 'APE',
        name: 'ApeCoin',
        current_price: 1.8,
        market_cap: 650000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'klaytn',
        symbol: 'KLAY',
        name: 'Klaytn',
        current_price: 0.18,
        market_cap: 600000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'eos',
        symbol: 'EOS',
        name: 'EOS',
        current_price: 0.65,
        market_cap: 600000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'thorchain',
        symbol: 'RUNE',
        name: 'THORChain',
        current_price: 1.8,
        market_cap: 550000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'pancakeswap-token',
        symbol: 'CAKE',
        name: 'PancakeSwap',
        current_price: 2.1,
        market_cap: 500000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'compound-governance-token',
        symbol: 'COMP',
        name: 'Compound',
        current_price: 55,
        market_cap: 450000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'maker',
        symbol: 'MKR',
        name: 'Maker',
        current_price: 1200,
        market_cap: 1100000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'aave',
        symbol: 'AAVE',
        name: 'Aave',
        current_price: 85,
        market_cap: 1200000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'curve-dao-token',
        symbol: 'CRV',
        name: 'Curve DAO Token',
        current_price: 0.45,
        market_cap: 400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'synthetix-network-token',
        symbol: 'SNX',
        name: 'Synthetix',
        current_price: 2.8,
        market_cap: 400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'yearn-finance',
        symbol: 'YFI',
        name: 'yearn.finance',
        current_price: 6500,
        market_cap: 220000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: '1inch',
        symbol: '1INCH',
        name: '1inch',
        current_price: 0.35,
        market_cap: 400000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'sushi',
        symbol: 'SUSHI',
        name: 'SushiSwap',
        current_price: 1.2,
        market_cap: 300000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'balancer',
        symbol: 'BAL',
        name: 'Balancer',
        current_price: 3.8,
        market_cap: 200000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'ren',
        symbol: 'REN',
        name: 'REN',
        current_price: 0.08,
        market_cap: 80000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'kyber-network-crystal',
        symbol: 'KNC',
        name: 'Kyber Network Crystal',
        current_price: 0.65,
        market_cap: 120000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      },
      {
        id: 'bancor',
        symbol: 'BNT',
        name: 'Bancor',
        current_price: 0.45,
        market_cap: 100000000,
        staking_apy: 0,
        risk_level: 'none',
        staking_details: {
          min_stake: 0,
          validator_count: 0,
          total_staked: 0,
          confidence: 'none',
          lock_period: 'N/A',
          slashing_risk: 'N/A'
        }
      }
    ]
  };

  const displayData = stakingData || fallbackData;

  // Filter and sort data
  const allFilteredData = displayData.data?.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'low-risk' && coin.risk_level === 'low') ||
                         (filterBy === 'medium-risk' && coin.risk_level === 'medium') ||
                         (filterBy === 'high-risk' && coin.risk_level === 'high') ||
                         (filterBy === 'staking-only' && coin.staking_apy > 0);
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'apy':
        return (b.staking_apy || 0) - (a.staking_apy || 0);
      case 'market-cap':
        return (b.market_cap || 0) - (a.market_cap || 0);
      case 'price':
        return (b.current_price || 0) - (a.current_price || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(allFilteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredData = showAll ? allFilteredData : allFilteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, sortBy]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#4ade80';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'none': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const openStakingModal = (coin) => {
    setSelectedCoin(coin);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCoin(null);
  };

    return (
    <ProtectedRoute>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          marginBottom: '30px'
        }}>
          <div style={{
        display: 'flex',
            justifyContent: 'space-between',
        alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{
        color: 'white',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Staking Dashboard
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.1rem',
                margin: '8px 0 0 0'
              }}>
                Discover the best staking opportunities with real-time APY data
              </p>
            </div>
            <Link href="/dashboard" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}>
              ← Back to Dashboard
            </Link>
          </div>

          {/* Stats Cards */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '20px',
          backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Total Coins
              </div>
              <div style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                {filteredData.length}
              </div>
            </div>
          <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Avg APY
        </div>
              <div style={{ color: '#4ade80', fontSize: '2rem', fontWeight: 'bold' }}>
                {filteredData.length > 0 ? 
                  (filteredData.reduce((sum, coin) => sum + (coin.staking_apy || 0), 0) / filteredData.length).toFixed(1) + '%' 
                  : '0%'
                }
      </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Top APY
              </div>
              <div style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 'bold' }}>
                {filteredData.length > 0 ? 
                  Math.max(...filteredData.map(coin => coin.staking_apy || 0)).toFixed(1) + '%' 
                  : '0%'
                }
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Total Market Cap
              </div>
              <div style={{ color: '#8b5cf6', fontSize: '2rem', fontWeight: 'bold' }}>
                ${filteredData.length > 0 ? 
                  (filteredData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0) / 1e12).toFixed(1) + 'T' 
                  : '0T'
                }
              </div>
            </div>
          </div>

          {/* Analytics Section */}
      <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '30px'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 0 20px 0'
            }}>
              📊 Staking Analytics
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {/* APY Distribution Chart */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  margin: '0 0 16px 0'
                }}>
                  APY Distribution
                </h4>
                <div style={{
        display: 'flex',
        flexDirection: 'column',
                  gap: '8px'
                }}>
                  {filteredData.slice(0, 5).map((coin, index) => (
                    <div key={coin.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
        alignItems: 'center',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px'
      }}>
        <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: ['#4ade80', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index]
                        }}></div>
                        <span style={{ color: 'white', fontSize: '0.9rem' }}>
                          {coin.symbol}
                        </span>
        </div>
                      <span style={{
                        color: '#4ade80',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        {coin.staking_apy}%
                      </span>
      </div>
                  ))}
                </div>
              </div>

              {/* Risk Analysis */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  margin: '0 0 16px 0'
                }}>
                  Risk Analysis
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {['low', 'medium', 'high'].map(risk => {
                    const count = filteredData.filter(coin => coin.risk_level === risk).length;
                    const percentage = filteredData.length > 0 ? (count / filteredData.length * 100).toFixed(1) : 0;
  return (
                      <div key={risk} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
    <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: getRiskColor(risk)
                          }}></div>
                          <span style={{
      color: 'white',
                            fontSize: '0.9rem',
                            textTransform: 'capitalize'
    }}>
                            {risk} Risk
                          </span>
                        </div>
      <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '60px',
                            height: '6px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background: getRiskColor(risk),
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <span style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            minWidth: '40px'
                          }}>
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Market Cap vs APY */}
        <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  margin: '0 0 16px 0'
                }}>
                  Market Cap vs APY
                </h4>
          <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {filteredData.slice(0, 4).map((coin, index) => {
                    const marketCapB = (coin.market_cap / 1e9).toFixed(1);
                    const apy = coin.staking_apy || 0;
                    return (
                      <div key={coin.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <div style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}>
                            {coin.symbol}
          </div>
          <div style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.8rem'
                          }}>
                            ${marketCapB}B
                          </div>
          </div>
          <div style={{
                          textAlign: 'right'
                        }}>
                          <div style={{
                            color: '#4ade80',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}>
                            {apy}%
          </div>
          <div style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.8rem'
                          }}>
                            APY
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
          </div>
        </div>
      </div>

          {/* Filters and Search */}
      <div style={{
        display: 'flex',
        gap: '20px',
            marginBottom: '30px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{
                padding: '12px 16px',
              borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
              color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                minWidth: '150px'
              }}
            >
              <option value="all">All Cryptocurrencies</option>
              <option value="staking-only">Staking Only</option>
              <option value="low-risk">Low Risk</option>
              <option value="medium-risk">Medium Risk</option>
              <option value="high-risk">High Risk</option>
          </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                minWidth: '150px'
              }}
            >
              <option value="apy">Sort by APY</option>
              <option value="market-cap">Sort by Market Cap</option>
              <option value="price">Sort by Price</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: showAll ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              {showAll ? 'Show Pages' : 'Show All'}
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                color: 'white',
                fontSize: '1.2rem'
              }}>
                Loading staking data...
              </div>
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{
                color: '#ff6b6b',
                fontSize: '1.2rem',
                marginBottom: '20px'
              }}>
                Error loading data: {error}
              </div>
        <button
          onClick={fetchStakingData}
          style={{
                  background: 'rgba(255,255,255,0.2)',
            color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
                  fontSize: '1rem'
          }}
        >
                Retry
        </button>
      </div>
          ) : (
        <div style={{
          display: 'grid',
              gap: '24px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
        }}>
              {filteredData.map((coin) => (
            <div
                  key={coin.id}
              style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
                  onClick={() => coin.staking_apy > 0 ? openStakingModal(coin) : null}
            >
              {/* Coin Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                    marginBottom: '20px'
              }}>
                <div>
                  <h3 style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        margin: '0 0 4px 0'
                      }}>
                        {coin.name}
                  </h3>
                      <div style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1rem'
                      }}>
                        {coin.symbol}
                      </div>
                </div>
                <div style={{
                      textAlign: 'right'
                }}>
                  <div style={{
                        color: 'white',
                    fontSize: '1.2rem',
                        fontWeight: 'bold'
                  }}>
                        ${coin.current_price?.toLocaleString() || 'N/A'}
                  </div>
                  <div style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem'
                  }}>
                        ${(coin.market_cap / 1e9).toFixed(1)}B
                  </div>
                </div>
              </div>

                  {/* APY and Risk */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                        marginBottom: '4px'
                      }}>
                        Staking APY
                      </div>
                      <div style={{
                        color: '#4ade80',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}>
                        {coin.staking_apy || 'N/A'}%
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                        marginBottom: '4px'
                      }}>
                        Risk Level
                      </div>
                      <div style={{
                        color: getRiskColor(coin.risk_level),
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {coin.risk_level}
                      </div>
                    </div>
                  </div>

                  {/* Staking Details */}
                  {coin.staking_details && (
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px'
                    }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        fontSize: '0.9rem'
              }}>
                <div>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Min Stake:</span>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {coin.staking_details.min_stake} {coin.symbol}
                          </div>
                </div>
                <div>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Lock Period:</span>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {coin.staking_details.lock_period}
                          </div>
                </div>
                <div>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Validators:</span>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {coin.staking_details.validator_count?.toLocaleString() || 'N/A'}
                          </div>
                </div>
                <div>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Slashing Risk:</span>
                          <div style={{ 
                            color: coin.staking_details.slashing_risk === 'None' ? '#4ade80' : 
                                   coin.staking_details.slashing_risk === 'Low' ? '#f59e0b' : '#ef4444',
                            fontWeight: '500' 
                          }}>
                            {coin.staking_details.slashing_risk}
                </div>
              </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {coin.staking_apy > 0 ? (
                    <button style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                      color: 'white',
                      border: 'none',
                      padding: '14px 24px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                    >
                      Start Staking
                    </button>
                  ) : (
              <div style={{
                      width: '100%',
                      background: 'rgba(107, 114, 128, 0.3)',
                      color: 'rgba(255,255,255,0.6)',
                      padding: '14px 24px',
                      borderRadius: '8px',
                  fontSize: '1rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      border: '1px solid rgba(107, 114, 128, 0.3)'
                    }}>
                      No Staking Available
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!showAll && allFilteredData.length > itemsPerPage && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginTop: '30px',
              padding: '20px'
            }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                  color: currentPage === 1 ? 'rgba(255,255,255,0.5)' : 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Previous
              </button>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: currentPage === pageNum ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        minWidth: '40px'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                  color: currentPage === totalPages ? 'rgba(255,255,255,0.5)' : 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Next
              </button>
            </div>
          )}

          {/* Results Info */}
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem',
            marginTop: '20px'
          }}>
            {showAll ? (
              <>Showing all {allFilteredData.length} cryptocurrencies</>
            ) : (
              <>Showing {startIndex + 1}-{Math.min(endIndex, allFilteredData.length)} of {allFilteredData.length} cryptocurrencies</>
            )}
            <br />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
              Total coins in database: {displayData.data?.length || 0} | 
              Filter: {filterBy} | 
              Search: "{searchTerm}" | 
              Staking coins: {displayData.data?.filter(coin => coin.staking_apy > 0).length || 0}
            </span>
          </div>
        </div>

        {/* Staking Modal */}
        {showModal && selectedCoin && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  Stake {selectedCoin.name}
                </h2>
                <button
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Current Price
                    </div>
                    <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      ${selectedCoin.current_price?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Staking APY
                    </div>
                    <div style={{ color: '#4ade80', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {selectedCoin.staking_apy}%
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  color: 'white',
                  fontSize: '1rem',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Amount to Stake
                </label>
                <input
                  type="number"
                  placeholder={`Minimum: ${selectedCoin.staking_details?.min_stake || 1} ${selectedCoin.symbol}`}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Staking
                </button>
              </div>
            </div>
          </div>
        )}

          {/* Portfolio Tracking Section */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '30px'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 0 20px 0'
            }}>
              💼 Your Staking Portfolio
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {/* Portfolio Summary */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  margin: '0 0 16px 0'
                }}>
                  Portfolio Summary
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Total Staked Value
                    </span>
                    <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      $0.00
                    </span>
                  </div>
                <div style={{
                  display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Active Stakes
                    </span>
                    <span style={{ color: '#4ade80', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      0
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Estimated Monthly Rewards
                    </span>
                    <span style={{ color: '#f59e0b', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      $0.00
                  </span>
                </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                      Average APY
                    </span>
                    <span style={{ color: '#8b5cf6', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      0.0%
                </span>
              </div>
            </div>
              </div>

              {/* Recent Activity */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  margin: '0 0 16px 0'
                }}>
                  Recent Activity
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.9rem'
                    }}>
                      No staking activity yet
                    </div>
                    <div style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.8rem',
                      marginTop: '4px'
                    }}>
                      Start staking to see your activity here
                    </div>
                  </div>
        </div>
      </div>

              {/* Quick Actions */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  margin: '0 0 16px 0'
                }}>
                  Quick Actions
                </h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <button style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}>
                    Start New Stake
                  </button>
                  <button style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}>
                    View All Stakes
                  </button>
                  <button style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}>
                    Claim Rewards
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '30px'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 0 20px 0'
            }}>
              📚 Staking Education
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  margin: '0 0 12px 0'
                }}>
                  What is Staking?
                </h4>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Staking is the process of locking up your cryptocurrency to support network operations and earn rewards. It's like earning interest on your crypto holdings.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  margin: '0 0 12px 0'
                }}>
                  Risk Factors
                </h4>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Staking involves risks including slashing penalties, lock-up periods, and market volatility. Always research before staking.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '1.1rem',
                  margin: '0 0 12px 0'
                }}>
                  Best Practices
                </h4>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  Diversify your stakes, choose reputable validators, understand lock-up periods, and never stake more than you can afford to lose.
                </p>
              </div>
            </div>
          </div>

        {/* Footer Info */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto 0',
        textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.9rem'
        }}>
          <p>
            Data updated every 8 minutes • APY rates are estimates and may vary • 
            <span style={{ color: '#4ade80' }}> Green</span> = Low Risk • 
            <span style={{ color: '#f59e0b' }}> Orange</span> = Medium Risk • 
            <span style={{ color: '#ef4444' }}> Red</span> = High Risk
        </p>
      </div>
    </div>
    </ProtectedRoute>
  );
}

export default StakingPage;