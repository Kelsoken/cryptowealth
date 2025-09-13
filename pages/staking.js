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

  // Enhanced fallback data with more coins
  const fallbackData = {
    data: [
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
        id: 'avalanche',
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
      }
    ]
  };

  const displayData = stakingData || fallbackData;

  // Filter and sort data
  const filteredData = displayData.data?.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'low-risk' && coin.risk_level === 'low') ||
                         (filterBy === 'medium-risk' && coin.risk_level === 'medium') ||
                         (filterBy === 'high-risk' && coin.risk_level === 'high');
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#4ade80';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
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
              <option value="all">All Risk Levels</option>
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
                  onClick={() => openStakingModal(coin)}
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
                </div>
              ))}
            </div>
          )}
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