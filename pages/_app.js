import '../styles/globals.css'
import { AuthProvider } from '../lib/auth'
import { AdminAuthProvider } from '../lib/adminAuth'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Component {...pageProps} />
      </AdminAuthProvider>
    </AuthProvider>
  )
}
