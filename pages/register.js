import Link from 'next/link'
import { useState } from 'react'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeToTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    setTimeout(() => {
      if (formData.password !== formData.confirmPassword) {
        setMessage('Wachtwoorden komen niet overeen')
        setIsLoading(false)
        return
      }
      
      if (!formData.agreeToTerms) {
        setMessage('Je moet akkoord gaan met de voorwaarden')
        setIsLoading(false)
        return
      }

      setMessage('✅ Account succesvol aangemaakt! Je wordt doorgestuurd...')
      setIsLoading(false)
      
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
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
            <li><Link href="/login">Login</Link></li>
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
            maxWidth: '500px', 
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
                Account Aanmaken
              </h1>
              <p style={{ opacity: 0.8 }}>
                Start je crypto reis met bank-level beveiliging
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Volledige Naam
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
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
                  placeholder="Voer je volledige naam in"
                />
              </div>

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
                  minLength="8"
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px'
                  }}
                  placeholder="Minimaal 8 karakters"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Bevestig Wachtwoord
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
                  placeholder="Herhaal je wachtwoord"
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontSize: '14px', opacity: 0.8 }}>
                    Ik ga akkoord met de Algemene Voorwaarden en Privacybeleid
                  </span>
                </label>
              </div>

              {message && (
                <div style={{ 
                  marginBottom: '20px', 
                  padding: '15px', 
                  borderRadius: '10px',
                  background: message.includes('✅') ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                  border: `1px solid ${message.includes('✅') ? '#00d4ff' : '#ff6b6b'}`,
                  color: message.includes('✅') ? '#00d4ff' : '#ff6b6b',
                  textAlign: 'center'
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
                {isLoading ? 'Account wordt aangemaakt...' : 'Account Aanmaken'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p style={{ opacity: 0.8 }}>
                Heb je al een account? <Link href="/login" style={{ color: '#00d4ff' }}>Inloggen</Link>
              </p>
            </div>

            <div style={{ 
              marginTop: '40px', 
              padding: '20px', 
              background: 'rgba(0, 212, 255, 0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(0, 212, 255, 0.2)'
            }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '1.1rem' }}>
                🔒 Bank-Level Beveiliging
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', opacity: 0.8 }}>
                <li style={{ marginBottom: '8px' }}>✓ 256-bit SSL encryptie</li>
                <li style={{ marginBottom: '8px' }}>✓ Multi-factor authenticatie</li>
                <li style={{ marginBottom: '8px' }}>✓ Cold storage voor crypto</li>
                <li style={{ marginBottom: '8px' }}>✓ Verzekerde fondsen</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
