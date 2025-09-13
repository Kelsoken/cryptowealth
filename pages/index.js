import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <div className="container">
        <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '40px' }}>
          �� CryptoWealth 2.0
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '40px' }}>
          The next generation cryptocurrency platform
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h2>📊 Dashboard</h2>
            <p>Real-time portfolio tracking and analytics</p>
            <Link href="/dashboard" className="btn">View Dashboard</Link>
          </div>
          
          <div className="card">
            <h2>💰 Staking</h2>
            <p>Earn passive income through secure staking</p>
            <Link href="/staking" className="btn">Start Staking</Link>
          </div>
          
          <div className="card">
            <h2>⚡ Arbitrage</h2>
            <p>Automated profit opportunities across exchanges</p>
            <Link href="/arbitrage" className="btn">Find Arbitrage</Link>
          </div>
          
          <div className="card">
            <h2>🎁 Airdrops</h2>
            <p>Never miss profitable airdrops again</p>
            <Link href="/airdrop" className="btn">Hunt Airdrops</Link>
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', marginTop: '40px' }}>
          <h2>🧪 JavaScript Test</h2>
          <button 
            onClick={() => alert('🎉 JavaScript werkt perfect! CryptoWealth 2.0 is klaar!')}
            className="btn"
            style={{ fontSize: '18px', padding: '15px 30px' }}
          >
            Test JavaScript
          </button>
        </div>
      </div>
    </div>
  )
}
