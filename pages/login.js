import Link from 'next/link'
import { useState } from 'react'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    setTimeout(() => {
      if (formData.email === 'demo@cryptowealth.com' && formData.password === 'demo123') {
        setMessage('✅ Succesvol ingelogd! Je wordt doorgestuurd...')
        setIsLoading(false)
        
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setMessage('❌ Onjuiste inloggegevens. Probeer: demo@cryptowealth.com / demo123')
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    })
  }

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">🚀 CryptoWealth</Link>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/register">Sign Up</Link></li>
          </ul>
        </div>
      </nav>

      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        paddingTop: '80px',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
        <div className="container">
          <div style={{ 
            maxWidth: '450px', 
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '10px',
                background: 'linear-gradient(45deg, #00d4ff, #ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Welkom Terug
              </h1>
              <p style={{ opacity: 0.8 }}>
                Log in op je beveiligde account
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  E-mail Adres
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="je@email.com"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Wachtwoord
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Voer je wachtwoord in"
                />
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '30px' 
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.1)' }}
                  />
                  <span style={{ fontSize: '14px', opacity: 0.8 }}>Onthoud mij</span>
                </label>
                <Link href="#" style={{ color: '#00d4ff', fontSize: '14px' }}>
                  Wachtwoord vergeten?
                </Link>
              </div>

              {message && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '15px', 
                  borderRadius: '10px',
                  background: message.includes('✅') ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                  border: `1px solid ${message.includes('✅') ? '#00d4ff' : '#ff6b6b'}`,
                  color: message.includes('✅') ? '#00d4ff' : '#ff6b6b',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn"
                style={{ 
                  width: '100%', 
                  padding: '15px',
                  fontSize: '18px',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p style={{ opacity: 0.8 }}>
                Nog geen account? <Link href="/register" style={{ color: '#00d4ff' }}>Account aanmaken</Link>
              </p>
            </div>

            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              background: 'rgba(255, 107, 107, 0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 107, 107, 0.2)'
            }}>
              <h3 style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '1.1rem' }}>
                🧪 Demo Account
              </h3>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>
                <div style={{ marginBottom: '5px' }}><strong>E-mail:</strong> demo@cryptowealth.com</div>
                <div><strong>Wachtwoord:</strong> demo123</div>
              </div>
            </div>

            <div style={{ 
              marginTop: '20px', 
              padding: '20px', 
              background: 'rgba(0, 212, 255, 0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(0, 212, 255, 0.2)'
            }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '1.1rem' }}>
                🔒 Beveiligde Inlog
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', opacity: 0.8 }}>
                <li style={{ marginBottom: '8px' }}>✓ End-to-end encryptie</li>
                <li style={{ marginBottom: '8px' }}>✓ Brute force bescherming</li>
                <li style={{ marginBottom: '8px' }}>✓ Real-time monitoring</li>
                <li style={{ marginBottom: '8px' }}>✓ Automatische logout</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
