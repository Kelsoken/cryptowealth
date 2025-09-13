import { useAdminAuth } from './adminAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login')
    }
  }, [admin, loading, router])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🔐</div>
          <div>Admin toegang wordt gecontroleerd...</div>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return children
}
