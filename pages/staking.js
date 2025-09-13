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

  useEffect(() => {
    fetchStakingData();
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

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const getAPYColor = (apy) => {
    if (apy >= 15) return '#00ff88';
    if (apy >= 10) return '#00d4ff';
    if (apy >= 5) return '#ffd700';
    return '#ff6b6b';
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return '#00ff88';
      case 'medium': return '#ffd700';
      case 'low': return '#ff6b6b';
      default: return '#888';
    }
  };

  const filteredData = stakingData?.data?.filter(coin => {
    if (filterBy === 'all') return true;
    if (filterBy === 'high-apy') return coin.staking_apy >= 10;
    if (filterBy === 'low-risk') return coin.staking_apy >= 3 && coin.staking_apy <= 8;
    return true;
  }) || [];

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'apy':
        return b.staking_apy - a.staking_apy;
      case 'market-cap':
        return b.market_cap - a.market_cap;
      case 'price':
        return b.current_price - a.current_price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.staking_apy - a.staking_apy;
    }
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #00d4ff',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Loading Staking Data...</h2>
          <p style={{ opacity: 0.8 }}>Fetching the latest staking opportunities</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 107, 107, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ff6b6b' }}>Error Loading Data</h2>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>{error}</p>
          <button
            onClick={fetchStakingData}
            style={{
              background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🚀 Staking Opportunities
        </h1>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.8,
          marginBottom: '30px'
        }}>
          Discover the best staking opportunities with real-time APY data from top 50 cryptocurrencies
        </p>
        
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', color: '#00d4ff', marginBottom: '5px' }}>
              {stakingData?.staking_coins || 0}
            </h3>
            <p style={{ opacity: 0.8 }}>Staking Coins</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', color: '#ff6b6b', marginBottom: '5px' }}>
              {stakingData?.total_coins || 0}
            </h3>
            <p style={{ opacity: 0.8 }}>Total Coins</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', color: '#00ff88', marginBottom: '5px' }}>
              {sortedData.length > 0 ? `${sortedData[0].staking_apy.toFixed(1)}%` : '0%'}
            </h3>
            <p style={{ opacity: 0.8 }}>Highest APY</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', color: '#ffd700', marginBottom: '5px' }}>
              {stakingData?.timestamp ? new Date(stakingData.timestamp).toLocaleTimeString() : '--:--'}
            </h3>
            <p style={{ opacity: 0.8 }}>Last Updated</p>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 30px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ opacity: 0.8 }}>Filter:</label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '14px'
            }}
          >
            <option value="all">All Coins</option>
            <option value="high-apy">High APY (≥10%)</option>
            <option value="low-risk">Low Risk (3-8%)</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ opacity: 0.8 }}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '14px'
            }}
          >
            <option value="apy">APY (High to Low)</option>
            <option value="market-cap">Market Cap</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>
        
        <button
          onClick={fetchStakingData}
          style={{
            background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginLeft: 'auto'
          }}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Staking Table */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {sortedData.map((coin, index) => (
            <div
              key={coin.symbol}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {/* Coin Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    marginBottom: '5px',
                    color: '#00d4ff'
                  }}>
                    {coin.symbol}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    opacity: 0.7,
                    margin: 0
                  }}>
                    {coin.name}
                  </p>
                </div>
                <div style={{
                  background: `linear-gradient(45deg, ${getAPYColor(coin.staking_apy)}, ${getAPYColor(coin.staking_apy)}88)`,
                  borderRadius: '10px',
                  padding: '8px 12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: 'white'
                  }}>
                    {coin.staking_apy.toFixed(1)}%
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    opacity: 0.9
                  }}>
                    APY
                  </div>
                </div>
              </div>

              {/* Coin Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '0 0 5px 0' }}>Price</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                    {formatPrice(coin.current_price)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '0 0 5px 0' }}>Market Cap</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                    {formatMarketCap(coin.market_cap)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '0 0 5px 0' }}>Rank</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                    #{coin.market_cap_rank}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '0 0 5px 0' }}>Type</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                    {coin.staking_type}
                  </p>
                </div>
              </div>

              {/* Staking Details */}
              <div style={{
                background: 'rgba(0, 212, 255, 0.1)',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  marginBottom: '10px',
                  color: '#00d4ff'
                }}>
                  Staking Details
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '0 0 5px 0' }}>Min Stake</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
                      {coin.min_stake > 0 ? `${coin.min_stake} ${coin.symbol}` : 'No minimum'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '0 0 5px 0' }}>Unbonding</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
                      {coin.unbonding_period > 0 ? `${coin.unbonding_period} days` : 'Instant'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confidence Badge */}
              <div style={{
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
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getConfidenceColor(coin.staking_apy_confidence)
                  }}></div>
                  <span style={{
                    fontSize: '0.8rem',
                    opacity: 0.7
                  }}>
                    {coin.staking_apy_confidence} confidence
                  </span>
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  opacity: 0.5
                }}>
                  {coin.staking_apy_source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto 0',
        textAlign: 'center',
        opacity: 0.6
      }}>
        <p style={{ fontSize: '0.9rem' }}>
          Data updated every 8 minutes from StakingRewards, CoinMarketCap, DeFiLlama, and CoinDesk
        </p>
        <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
          Last updated: {stakingData?.timestamp ? new Date(stakingData.timestamp).toLocaleString() : 'Unknown'}
        </p>
      </div>
    </div>
  );
}

export default ProtectedRoute(StakingPage);
