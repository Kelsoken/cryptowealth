import Link from 'next/link'

export default function Airdrop() {
  return (
    <div>
      <div className="container">
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>
          🎁 Airdrop Hunter
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h2>🔥 Active Airdrops</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>LayerZero:</span>
                <span style={{ fontWeight: 'bold' }}>$500-$2,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Starknet:</span>
                <span style={{ fontWeight: 'bold' }}>$1,000-$5,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Blur NFT:</span>
                <span style={{ fontWeight: 'bold' }}>$200-$800</span>
              </div>
            </div>
            <button className="btn">Start Airdrop</button>
          </div>
          
          <div className="card">
            <h2>📊 Your Progress</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>LayerZero:</span>
                <span style={{ fontWeight: 'bold' }}>75%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Starknet:</span>
                <span style={{ fontWeight: 'bold' }}>45%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Blur NFT:</span>
                <span style={{ fontWeight: 'bold' }}>20%</span>
              </div>
            </div>
            <button className="btn">View Progress</button>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" className="btn">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
