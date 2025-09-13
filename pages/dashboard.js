import Link from 'next/link'

export default function Dashboard() {
  return (
    <div>
      <div className="container">
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>
          📊 Smart Dashboard
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h2>💰 Portfolio Overview</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Value:</span>
                <span style={{ fontWeight: 'bold' }}>$12,450.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>24h Change:</span>
                <span style={{ fontWeight: 'bold', color: '#00f2fe' }}>+$245.50 (+2.01%)</span>
              </div>
            </div>
            <Link href="/staking" className="btn">Manage Portfolio</Link>
          </div>
          
          <div className="card">
            <h2>🎯 Staking Rewards</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Staked:</span>
                <span style={{ fontWeight: 'bold' }}>$5,200.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>APY:</span>
                <span style={{ fontWeight: 'bold' }}>12.5%</span>
              </div>
            </div>
            <Link href="/staking" className="btn">View Staking</Link>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" className="btn">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
