import { useState, useEffect, createContext, useContext } from 'react'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const savedAdmin = localStorage.getItem('cryptowealth_admin')
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
    }
    setLoading(false)
  }, [])

  const adminLogin = (username, password) => {
    // Admin credentials - In production, use proper authentication
    const adminCredentials = {
      'admin': 'CryptoWealth2024!',
      'superadmin': 'SuperSecure2024!'
    }

    if (adminCredentials[username] && adminCredentials[username] === password) {
      const adminData = {
        id: username === 'admin' ? 1 : 2,
        username: username,
        role: username === 'admin' ? 'Administrator' : 'Super Administrator',
        loginTime: new Date().toISOString(),
        permissions: username === 'admin' 
          ? ['users', 'analytics', 'transactions'] 
          : ['users', 'analytics', 'transactions', 'system', 'settings']
      }
      setAdmin(adminData)
      localStorage.setItem('cryptowealth_admin', JSON.stringify(adminData))
      return { success: true }
    }
    return { success: false, error: 'Invalid admin credentials' }
  }

  const adminLogout = () => {
    setAdmin(null)
    localStorage.removeItem('cryptowealth_admin')
  }

  const value = {
    admin,
    adminLogin,
    adminLogout,
    loading
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
