import Link from 'next/link'

export default function Arbitrage() {
  return (
    <div>
      <div className="container">
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>
          ⚡ Arbitrage Trading
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h2>🔥 Live Opportunities</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Bitcoin (BTC):</span>
                <span style={{ fontWeight: 'bold' }}>$43,250.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Coinbase:</span>
                <span style={{ fontWeight: 'bold' }}>$43,180.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Profit Potential:</span>
                <span style={{ fontWeight: 'bold', color: '#00f2fe' }}>+$70.00</span>
              </div>
            </div>
            <button className="btn">Execute Trade</button>
          </div>
          
          <div className="card">
            <h2>📊 Exchange Comparison</h2>
            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Binance:</span>
                <span style={{ fontWeight: 'bold' }}>$43,250.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Coinbase:</span>
                <span style={{ fontWeight: 'bold' }}>$43,180.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Kraken:</span>
                <span style={{ fontWeight: 'bold' }}>$43,200.00</span>
              </div>
            </div>
            <button className="btn">Update Prices</button>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" className="btn">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
