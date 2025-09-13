import Link from 'next/link'

export default function Staking() {
  return (
    <div>
      <div className="container">
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>
          💰 Staking Rewards
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h2>🎯 Active Staking</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Ethereum 2.0:</span>
                <span style={{ fontWeight: 'bold' }}>2.5 ETH</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>APY:</span>
                <span style={{ fontWeight: 'bold' }}>5.2%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Daily Rewards:</span>
                <span style={{ fontWeight: 'bold' }}>+0.0003 ETH</span>
              </div>
            </div>
            <button className="btn">Manage Positions</button>
          </div>
          
          <div className="card">
            <h2>🚀 Available Options</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Bitcoin:</span>
                <span style={{ fontWeight: 'bold' }}>6.2% APY</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Solana:</span>
                <span style={{ fontWeight: 'bold' }}>7.8% APY</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Polkadot:</span>
                <span style={{ fontWeight: 'bold' }}>9.1% APY</span>
              </div>
            </div>
            <button className="btn">Start New Staking</button>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" className="btn">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
