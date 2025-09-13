import Link from 'next/link'
import AdminProtectedRoute from '../../lib/AdminProtectedRoute'
import { useAdminAuth } from '../../lib/adminAuth'

export default function AdminDashboard() {
  const { admin, adminLogout } = useAdminAuth()

  return (
    <AdminProtectedRoute>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        {/* Admin Navigation */}
        <nav style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 1000,
          padding: '15px 0',
          borderBottom: '1px solid rgba(255, 107, 107, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href="/admin/dashboard" style={{
                fontSize: '24px',
                fontWeight: '800',
                background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none'
              }}>
                🔐 Admin Panel
              </Link>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>
                Welkom, {admin?.username} ({admin?.role})
              </div>
            </div>
            <ul style={{
              display: 'flex',
              gap: '20px',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              <li><Link href="/admin/dashboard" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Dashboard</Link></li>
              <li><Link href="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link></li>
              <li><Link href="/admin/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link></li>
              <li><Link href="/admin/transactions" style={{ color: 'white', textDecoration: 'none' }}>Transactions</Link></li>
              <li>
                <button onClick={adminLogout} style={{
                  background: 'transparent',
                  border: '2px solid #ff6b6b',
                  color: '#ff6b6b',
                  padding: '8px 16px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Admin Dashboard Content */}
        <div style={{ paddingTop: '100px' }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '3rem',
                marginBottom: '10px',
                background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Admin Dashboard
              </h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                Platform overzicht en beheer
              </p>
            </div>

            {/* Platform Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#ff6b6b', marginBottom: '10px' }}>Totaal Gebruikers</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>15,247</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>+127 deze week</div>
              </div>

              <div style={{
                background: 'rgba(0, 212, 255, 0.1)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Actieve Staking</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>$2.5M</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>+$125K vandaag</div>
              </div>

              <div style={{
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#ffa500', marginBottom: '10px' }}>Arbitrage Volume</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>$850K</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>+$45K vandaag</div>
              </div>

              <div style={{
                background: 'rgba(0, 212, 255, 0.1)',
                borderRadius: '15px',
                padding: '30px',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Platform Revenue</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>$125K</div>
                <div style={{ color: '#00d4ff', fontSize: '0.9rem' }}>Deze maand</div>
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
                color: '#ff6b6b'
              }}>
                Snelle Acties
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <Link href="/admin/users" style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
                  <div style={{ fontWeight: '600' }}>User Management</div>
                </Link>

                <Link href="/admin/analytics" style={{
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
                  <div style={{ fontWeight: '600' }}>Analytics</div>
                </Link>

                <Link href="/admin/transactions" style={{
                  background: 'linear-gradient(45deg, #ffa500, #00d4ff)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💳</div>
                  <div style={{ fontWeight: '600' }}>Transactions</div>
                </Link>

                <div style={{
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚙️</div>
                  <div style={{ fontWeight: '600' }}>System Settings</div>
                </div>
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
                color: '#ff6b6b'
              }}>
                Recente Platform Activiteit
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
                    <div style={{ fontWeight: '600' }}>Nieuwe gebruiker geregistreerd</div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>john.doe@email.com - 5 minuten geleden</div>
                  </div>
                  <div style={{ color: '#00d4ff', fontWeight: '600' }}>+1</div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>Grote staking transactie</div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>50 ETH gestaked - 15 minuten geleden</div>
                  </div>
                  <div style={{ color: '#00d4ff', fontWeight: '600' }}>$125K</div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>Arbitrage opportunity gedetecteerd</div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>BTC prijsverschil 2.5% - 30 minuten geleden</div>
                  </div>
                  <div style={{ color: '#ffa500', fontWeight: '600' }}>Active</div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>Systeem backup voltooid</div>
                    <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Database backup - 1 uur geleden</div>
                  </div>
                  <div style={{ color: '#00d4ff', fontWeight: '600' }}>Success</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
