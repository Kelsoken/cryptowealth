import Link from 'next/link'
import ProtectedRoute from '../lib/ProtectedRoute'
import { useAuth } from '../lib/auth'

export default function Dashboard() {
  const { user } = useAuth()

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
              <li><Link href="/dashboard" style={{ color: '#00d4ff', textDecoration: 'none' }}>Dashboard</Link></li>
              <li><Link href="/staking" style={{ color: 'white', textDecoration: 'none' }}>Staking</Link></li>
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

        {/* Dashboard Content */}
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
                Dashboard
              </h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                Welkom terug, {user?.name}! Hier is je portfolio overzicht.
              </p>
            </div>

            {/* Portfolio Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Totale Waarde</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>$12,450.00</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>+5.2% vandaag</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Staking Rewards</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>$245.30</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>Deze maand</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Arbitrage Winst</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>$89.75</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>Vandaag</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Airdrop Waarde</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>$1,200.00</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>Pending</div>
              </div>
            </div>

            {/* Quick Actions */}
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
                Snelle Acties
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <Link href="/staking" style={{
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                  <div style={{ fontWeight: '600' }}>Start Staking</div>
                </Link>

                <Link href="/arbitrage" style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
                  <div style={{ fontWeight: '600' }}>Arbitrage</div>
                </Link>

                <Link href="/airdrop" style={{
                  background: 'linear-gradient(45deg, #ffa500, #00d4ff)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎁</div>
                  <div style={{ fontWeight: '600' }}>Airdrops</div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
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
                Recente Activiteit
              </h2>
              <div style={{ space: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>Staking reward ontvangen</div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>2 uur geleden</div>
                  </div>
                  <div style={{ color: '#00d4ff', fontWeight: '600' }}>+$12.50</div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>Arbitrage trade voltooid</div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>5 uur geleden</div>
                  </div>
                  <div style={{ color: '#00d4ff', fontWeight: '600' }}>+$8.75</div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>Nieuwe airdrop gedetecteerd</div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>1 dag geleden</div>
                  </div>
                  <div style={{ color: '#ff6b6b', fontWeight: '600' }}>Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
