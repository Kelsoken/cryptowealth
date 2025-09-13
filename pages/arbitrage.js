import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ArbitragePage = () => {
  const [arbitrageData, setArbitrageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Arbitrage opportunities data
  const opportunities = [
    { 
      pair: 'BTC/USDT', 
      buyExchange: 'Binance', 
      sellExchange: 'Coinbase', 
      buyPrice: 43250.00, 
      sellPrice: 43580.00, 
      profit: 330.00, 
      profitPercent: 0.76, 
      volume: 1250000,
      risk: 'Low',
      timeLeft: '2h 15m'
    },
    { 
      pair: 'ETH/USDT', 
      buyExchange: 'Kraken', 
      sellExchange: 'Binance', 
      buyPrice: 2650.00, 
      sellPrice: 2680.00, 
      profit: 30.00, 
      profitPercent: 1.13, 
      volume: 850000,
      risk: 'Low',
      timeLeft: '1h 45m'
    },
    { 
      pair: 'ADA/USDT', 
      buyExchange: 'KuCoin', 
      sellExchange: 'Binance', 
      buyPrice: 0.485, 
      sellPrice: 0.492, 
      profit: 0.007, 
      profitPercent: 1.44, 
      volume: 320000,
      risk: 'Medium',
      timeLeft: '3h 20m'
    },
    { 
      pair: 'SOL/USDT', 
      buyExchange: 'FTX', 
      sellExchange: 'Binance', 
      buyPrice: 98.50, 
      sellPrice: 99.80, 
      profit: 1.30, 
      profitPercent: 1.32, 
      volume: 680000,
      risk: 'Low',
      timeLeft: '45m'
    },
    { 
      pair: 'DOT/USDT', 
      buyExchange: 'Huobi', 
      sellExchange: 'Binance', 
      buyPrice: 7.25, 
      sellPrice: 7.38, 
      profit: 0.13, 
      profitPercent: 1.79, 
      volume: 180000,
      risk: 'Medium',
      timeLeft: '2h 50m'
    },
    { 
      pair: 'MATIC/USDT', 
      buyExchange: 'Gate.io', 
      sellExchange: 'Binance', 
      buyPrice: 0.85, 
      sellPrice: 0.87, 
      profit: 0.02, 
      profitPercent: 2.35, 
      volume: 450000,
      risk: 'Low',
      timeLeft: '1h 30m'
    },
    { 
      pair: 'AVAX/USDT', 
      buyExchange: 'Binance', 
      sellExchange: 'Coinbase', 
      buyPrice: 28.50, 
      sellPrice: 29.20, 
      profit: 0.70, 
      profitPercent: 2.46, 
      volume: 520000,
      risk: 'Low',
      timeLeft: '4h 10m'
    },
    { 
      pair: 'LINK/USDT', 
      buyExchange: 'KuCoin', 
      sellExchange: 'Binance', 
      buyPrice: 14.20, 
      sellPrice: 14.55, 
      profit: 0.35, 
      profitPercent: 2.46, 
      volume: 380000,
      risk: 'Medium',
      timeLeft: '2h 25m'
    },
    { 
      pair: 'UNI/USDT', 
      buyExchange: 'Gate.io', 
      sellExchange: 'Binance', 
      buyPrice: 6.80, 
      sellPrice: 7.05, 
      profit: 0.25, 
      profitPercent: 3.68, 
      volume: 290000,
      risk: 'Medium',
      timeLeft: '1h 55m'
    },
    { 
      pair: 'ATOM/USDT', 
      buyExchange: 'Binance', 
      sellExchange: 'Kraken', 
      buyPrice: 8.45, 
      sellPrice: 8.78, 
      profit: 0.33, 
      profitPercent: 3.91, 
      volume: 220000,
      risk: 'Low',
      timeLeft: '3h 40m'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArbitrageData(opportunities);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredData = arbitrageData.filter(opp => {
    if (filter === 'all') return true;
    if (filter === 'low-risk') return opp.risk === 'Low';
    if (filter === 'medium-risk') return opp.risk === 'Medium';
    if (filter === 'high-profit') return opp.profitPercent >= 2.0;
    return true;
  });

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-500 bg-green-100';
      case 'Medium': return 'text-yellow-500 bg-yellow-100';
      case 'High': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getProfitColor = (profit) => {
    if (profit >= 2.0) return 'text-green-600 font-bold';
    if (profit >= 1.0) return 'text-blue-600 font-semibold';
    return 'text-yellow-600';
  };

  return (
    <>
      <Head>
        <title>Arbitrage Opportunities - CryptoWealth</title>
        <meta name="description" content="Discover profitable cryptocurrency arbitrage opportunities across multiple exchanges." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <span className="text-yellow-400 mr-2">✨</span>
                    CryptoWealth
                  </h1>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                    Home
                  </Link>
                  <Link href="/dashboard" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/staking" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                    Staking
                  </Link>
                  <Link href="/arbitrage" className="text-white px-3 py-2 text-sm font-medium transition-colors">
                    Arbitrage
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Arbitrage <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Opportunities</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Discover profitable price differences across exchanges and maximize your trading profits with our advanced arbitrage detection system.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Opportunities</option>
                    <option value="low-risk">Low Risk</option>
                    <option value="medium-risk">Medium Risk</option>
                    <option value="high-profit">High Profit (2%+)</option>
                  </select>
                </div>
                
                <div className="text-white/80">
                  Showing {filteredData.length} opportunities
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Arbitrage Opportunities */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map((opp, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{opp.pair}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(opp.risk)}`}>
                        {opp.risk} Risk
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/70 text-sm mb-1">Buy on {opp.buyExchange}</div>
                        <div className="text-white font-bold text-lg">${opp.buyPrice.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-white/70 text-sm mb-1">Sell on {opp.sellExchange}</div>
                        <div className="text-white font-bold text-lg">${opp.sellPrice.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-white/70 text-sm">Profit</div>
                        <div className={`text-xl font-bold ${getProfitColor(opp.profitPercent)}`}>
                          ${opp.profit.toLocaleString()} ({opp.profitPercent.toFixed(2)}%)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/70 text-sm">Volume</div>
                        <div className="text-white font-semibold">${(opp.volume / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white/70 text-sm">
                        Time remaining: <span className="text-yellow-400 font-medium">{opp.timeLeft}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105">
                        Execute Trade
                      </button>
                      <button className="bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-white/60 text-sm">Supported Exchanges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">3.91%</div>
                <div className="text-white/60 text-sm">Highest Profit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">$8.5M+</div>
                <div className="text-white/60 text-sm">Total Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/60 text-sm">Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Start Arbitrage Trading</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join our advanced arbitrage platform and start profiting from price differences across exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
                Start Trading
              </Link>
              <Link href="/dashboard" className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                View Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="text-yellow-400 mr-2">✨</span>
                  CryptoWealth
                </h3>
                <p className="text-white/60">Professional cryptocurrency trading platform with AI insights and advanced features.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Trading</h4>
                <ul className="space-y-2">
                  <li><Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link href="/staking" className="text-white/60 hover:text-white transition-colors">Staking</Link></li>
                  <li><Link href="/arbitrage" className="text-white/60 hover:text-white transition-colors">Arbitrage</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="/ai-search" className="text-white/60 hover:text-white transition-colors">AI Search</Link></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
                <ul className="space-y-2">
                  <li><Link href="/login" className="text-white/60 hover:text-white transition-colors">Login</Link></li>
                  <li><Link href="/register" className="text-white/60 hover:text-white transition-colors">Register</Link></li>
                  <li><a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 mt-8 pt-8 text-center">
              <p className="text-white/60">© 2024 CryptoWealth. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ArbitragePage;
