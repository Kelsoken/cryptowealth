import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (check localStorage) - only on client side
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('cryptowealth_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Demo login logic
    if (email === 'demo@cryptowealth.com' && password === 'demo123') {
      const userData = {
        id: 1,
        email: email,
        name: 'Demo User',
        loginTime: new Date().toISOString()
      }
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cryptowealth_user', JSON.stringify(userData))
      }
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const register = (userData) => {
    // Demo registration logic
    const newUser = {
      id: Date.now(),
      email: userData.email,
      name: userData.fullName,
      loginTime: new Date().toISOString()
    }
    setUser(newUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cryptowealth_user', JSON.stringify(newUser))
    }
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cryptowealth_user')
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
