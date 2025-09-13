import Link from 'next/link'
import ProtectedRoute from '../lib/ProtectedRoute'

export default function Staking() {
  return (
    <ProtectedRoute>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Navigation */}
        <nav style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          padding: '15px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <Link href="/" style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none'
            }}>
              🚀 CryptoWealth
            </Link>
            <ul style={{
              display: 'flex',
              gap: '30px',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              <li><Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
              <li><Link href="/staking" style={{ color: '#00d4ff', textDecoration: 'none' }}>Staking</Link></li>
              <li><Link href="/arbitrage" style={{ color: 'white', textDecoration: 'none' }}>Arbitrage</Link></li>
              <li><Link href="/airdrop" style={{ color: 'white', textDecoration: 'none' }}>Airdrops</Link></li>
              <li>
                <button onClick={() => {
                  localStorage.removeItem('cryptowealth_user')
                  window.location.href = '/'
                }} style={{
                  background: 'transparent',
                  border: '2px solid #ff6b6b',
                  color: '#ff6b6b',
                  padding: '8px 16px',
                  borderRadius: '25px',
                  cursor: 'pointer'
                }}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Staking Content */}
        <div style={{ paddingTop: '100px' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '3rem',
                marginBottom: '10px',
                background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Smart Staking
              </h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                Verdien tot 12% APY met onze geavanceerde staking algoritmes.
              </p>
            </div>

            {/* Active Staking Positions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '40px'
            }}>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '30px',
                color: '#00d4ff'
              }}>
                Actieve Staking Posities
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ color: '#00d4ff' }}>Ethereum Staking</h3>
                    <span style={{ fontSize: '1.5rem' }}>Ξ</span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Gestaked Bedrag</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>2.5 ETH</div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>APY</div>
                    <div style={{ color: '#00d4ff', fontSize: '1.2rem', fontWeight: '600' }}>8.5%</div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Dagelijkse Rewards</div>
                    <div style={{ color: '#00d4ff', fontSize: '1.2rem', fontWeight: '600' }}>+$5.20</div>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Claim Rewards
                  </button>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ color: '#00d4ff' }}>Cardano Staking</h3>
                    <span style={{ fontSize: '1.5rem' }}>◊</span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Gestaked Bedrag</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>5,000 ADA</div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>APY</div>
                    <div style={{ color: '#00d4ff', fontSize: '1.2rem', fontWeight: '600' }}>12.0%</div>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Dagelijkse Rewards</div>
                    <div style={{ color: '#00d4ff', fontSize: '1.2rem', fontWeight: '600' }}>+$1.65</div>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '10px',
                    background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Claim Rewards
                  </button>
                </div>
              </div>
            </div>

            {/* Available Staking Options */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '30px',
                color: '#00d4ff'
              }}>
                Beschikbare Staking Opties
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '15px' }}>₿</div>
                  <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Bitcoin</h3>
                  <div style={{ color: '#ff6b6b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>6.5% APY</div>
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Start Staking
                  </button>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '15px' }}>◎</div>
                  <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Solana</h3>
                  <div style={{ color: '#ff6b6b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>9.2% APY</div>
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Start Staking
                  </button>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '15px' }}>●</div>
                  <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Polkadot</h3>
                  <div style={{ color: '#ff6b6b', fontSize: '1.5rem', fontWeight: '600', marginBottom: '15px' }}>11.8% APY</div>
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Start Staking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
