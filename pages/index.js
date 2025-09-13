import Link from 'next/link'
import { useAuth } from '../lib/auth'
import { useAdminAuth } from '../lib/adminAuth'

export default function Home() {
  const { user, logout } = useAuth()
  const { admin } = useAdminAuth()

  return (
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
            {user ? (
              <>
                <li><Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
                <li><Link href="/staking" style={{ color: 'white', textDecoration: 'none' }}>Staking</Link></li>
                <li><Link href="/arbitrage" style={{ color: 'white', textDecoration: 'none' }}>Arbitrage</Link></li>
                <li><Link href="/airdrop" style={{ color: 'white', textDecoration: 'none' }}>Airdrops</Link></li>
                <li><Link href="/admin/login" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: '600' }}>🔐 Admin</Link></li>
                <li>
                  <button onClick={logout} style={{
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
              </>
            ) : (
              <>
                <li><Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link></li>
                <li><Link href="/register" style={{
                  background: 'transparent',
                  border: '2px solid #00d4ff',
                  color: '#00d4ff',
                  padding: '8px 16px',
                  borderRadius: '25px',
                  textDecoration: 'none'
                }}>Sign Up</Link></li>
                <li><Link href="/admin/login" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: '600' }}>🔐 Admin</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {user ? `Welkom terug, ${user.name}!` : 'De Toekomst van Crypto Beleggen'}
          </h1>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '40px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            {user 
              ? 'Beheer je cryptocurrency portfolio met geavanceerde tools voor staking, arbitrage en airdrop jacht.'
              : 'Beheer je cryptocurrency portfolio met geavanceerde tools voor staking, arbitrage en airdrop jacht. Verdien meer met minder risico.'
            }
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            {user ? (
              <>
                <Link href="/dashboard" style={{
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Ga naar Dashboard
                </Link>
                <Link href="/staking" style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Start Staking
                </Link>
                <Link href="/admin/login" style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  🔐 Admin Panel
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" style={{
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Start Nu Gratis
                </Link>
                <Link href="/login" style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  Inloggen
                </Link>
                <Link href="/admin/login" style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  🔐 Admin Panel
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section - Only show for non-logged in users */}
      {!user && (
        <section style={{
          padding: '100px 0',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '3rem',
              marginBottom: '60px',
              background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Waarom CryptoWealth?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '40px',
              marginTop: '60px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  borderRadius: '20px 20px 0 0'
                }}></div>
                <span style={{ fontSize: '4rem', marginBottom: '20px', display: 'block' }}>💰</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#00d4ff' }}>Smart Staking</h3>
                <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                  Verdien tot 12% APY met onze geavanceerde staking algoritmes. 
                  Automatische herinvestering en risicobeheer inbegrepen.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  borderRadius: '20px 20px 0 0'
                }}></div>
                <span style={{ fontSize: '4rem', marginBottom: '20px', display: 'block' }}>⚡</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#00d4ff' }}>Arbitrage Trading</h3>
                <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                  Automatische arbitrage tussen exchanges. Verdien dagelijks 
                  passief inkomen zonder handmatige interventie.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                  borderRadius: '20px 20px 0 0'
                }}></div>
                <span style={{ fontSize: '4rem', marginBottom: '20px', display: 'block' }}>🎁</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#00d4ff' }}>Airdrop Hunter</h3>
                <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                  Mis nooit meer een winstgevende airdrop. Ons systeem 
                  detecteert en volgt automatisch alle kansen.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Crypto Showcase - Only show for non-logged in users */}
      {!user && (
        <section style={{
          padding: '100px 0',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '3rem',
              marginBottom: '60px',
              background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Ondersteunde Cryptocurrencies
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
              marginTop: '60px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '15px', display: 'block' }}>₿</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', color: '#00d4ff' }}>Bitcoin</div>
                <div style={{ fontSize: '1.1rem', color: '#ff6b6b', fontWeight: '600' }}>$43,250</div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '15px', display: 'block' }}>Ξ</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', color: '#00d4ff' }}>Ethereum</div>
                <div style={{ fontSize: '1.1rem', color: '#ff6b6b', fontWeight: '600' }}>$2,650</div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '15px', display: 'block' }}>◊</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', color: '#00d4ff' }}>Cardano</div>
                <div style={{ fontSize: '1.1rem', color: '#ff6b6b', fontWeight: '600' }}>$0.485</div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '15px', display: 'block' }}>◎</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', color: '#00d4ff' }}>Solana</div>
                <div style={{ fontSize: '1.1rem', color: '#ff6b6b', fontWeight: '600' }}>$98.50</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Only show for non-logged in users */}
      {!user && (
        <section style={{
          padding: '100px 0',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <h2 style={{
              fontSize: '3rem',
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Klaar om te Beginnen?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '40px',
              opacity: 0.9
            }}>
              Sluit je aan bij duizenden investeerders die al profiteren van 
              onze geavanceerde crypto tools. Start vandaag nog!
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/register" style={{
                background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Gratis Account Aanmaken
              </Link>
              <Link href="/login" style={{
                background: 'transparent',
                border: '2px solid #00d4ff',
                color: '#00d4ff',
                padding: '15px 30px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Inloggen
              </Link>
              <Link href="/admin/login" style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                🔐 Admin Panel
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '40px 0',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <p style={{ opacity: 0.7 }}>
            &copy; 2024 CryptoWealth. Alle rechten voorbehouden. | Beveiligd door bank-level encryptie
          </p>
        </div>
      </footer>
    </div>
  )
}
