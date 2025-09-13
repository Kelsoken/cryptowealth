import { useState, useEffect } from 'react';
import ProtectedRoute from '../lib/ProtectedRoute';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

function StakingPage() {
  const { user } = useAuth();
  const [stakingData, setStakingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fallback data for when API is not available
  const fallbackData = {
    data: [
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 2650,
        market_cap: 320000000000,
        staking_apy: 4.2,
        staking_details: {
          min_stake: 32,
          validator_count: 900000,
          total_staked: 32000000,
          confidence: 'high'
        }
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        current_price: 0.45,
        market_cap: 16000000000,
        staking_apy: 5.8,
        staking_details: {
          min_stake: 1,
          validator_count: 3000,
          total_staked: 24000000000,
          confidence: 'high'
        }
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        current_price: 95,
        market_cap: 42000000000,
        staking_apy: 6.5,
        staking_details: {
          min_stake: 0.1,
          validator_count: 2000,
          total_staked: 400000000,
          confidence: 'medium'
        }
      }
    ]
  };

  const displayData = stakingData || fallbackData;

  return (
    <ProtectedRoute>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h1 style={{
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Staking Dashboard
            </h1>
            <Link href="/dashboard" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              ← Back to Dashboard
            </Link>
          </div>
          
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Discover the best staking opportunities with real-time APY data
          </p>
        </div>

        {/* Content */}
        <div style={{
          maxWidth: '1200px',
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
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
            }}>
              {displayData.data?.map((coin) => (
                <div
                  key={coin.id}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
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
                    marginBottom: '16px'
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
                        Market Cap: ${(coin.market_cap / 1e9).toFixed(1)}B
                      </div>
                    </div>
                  </div>

                  {/* Staking Info */}
                  <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '1rem'
                      }}>
                        Staking APY
                      </span>
                      <span style={{
                        color: '#4ade80',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}>
                        {coin.staking_apy || coin.staking_details?.apy || 'N/A'}%
                      </span>
                    </div>
                    
                    {coin.staking_details && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '0.9rem'
                      }}>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Min Stake:</span>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {coin.staking_details.min_stake} {coin.symbol}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Validators:</span>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {coin.staking_details.validator_count?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
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

        {/* Footer Info */}
        <div style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.9rem'
        }}>
          <p>
            Data updated every 8 minutes • APY rates are estimates and may vary
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default StakingPage;