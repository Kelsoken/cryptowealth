import { useState } from 'react'
import { useAdminAuth } from '../../lib/adminAuth'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { adminLogin } = useAdminAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    setTimeout(() => {
      const result = adminLogin(formData.username, formData.password)
      
      if (result.success) {
        setMessage('✅ Admin toegang verleend! Je wordt doorgestuurd...')
        setIsLoading(false)
        
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 2000)
      } else {
        setMessage('❌ Onjuiste admin credentials')
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        margin: '0 20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔐</div>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '10px',
            background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Admin Toegang
          </h1>
          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
            Alleen voor geautoriseerde administrators
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Admin Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
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
              placeholder="admin"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Admin Password
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
              placeholder="••••••••"
            />
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
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Verifiëren...' : 'Admin Inloggen'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 107, 107, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 107, 107, 0.2)'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '1rem' }}>
            🧪 Demo Admin Accounts
          </h3>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            <div style={{ marginBottom: '5px' }}><strong>Admin:</strong> admin / CryptoWealth2024!</div>
            <div><strong>Super Admin:</strong> superadmin / SuperSecure2024!</div>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'rgba(0, 212, 255, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 212, 255, 0.2)'
        }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '1rem' }}>
            🔒 Admin Beveiliging
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '12px', opacity: 0.8 }}>
            <li style={{ marginBottom: '5px' }}>✓ Multi-factor authenticatie</li>
            <li style={{ marginBottom: '5px' }}>✓ IP whitelisting</li>
            <li style={{ marginBottom: '5px' }}>✓ Session timeout</li>
            <li style={{ marginBottom: '5px' }}>✓ Audit logging</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a href="/" style={{ color: '#00d4ff', fontSize: '14px', textDecoration: 'none' }}>
            ← Terug naar Website
          </a>
        </div>
      </div>
    </div>
  )
}
