import Head from 'next/head';
import Link from 'next/link';

const StakingPage = () => {

  // 50 Cryptocurrencies with staking data
  const cryptoData = [
    { symbol: 'ETH', name: 'Ethereum', apy: 5.2, minStake: 32, lockPeriod: 'Flexible', risk: 'Low', validator: 'Lido', logo: '🔷' },
    { symbol: 'ADA', name: 'Cardano', apy: 4.8, minStake: 1, lockPeriod: 'Flexible', risk: 'Low', validator: 'Cardano Pool', logo: '🔵' },
    { symbol: 'DOT', name: 'Polkadot', apy: 12.0, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Polkadot Validators', logo: '🟣' },
    { symbol: 'SOL', name: 'Solana', apy: 7.5, minStake: 1, lockPeriod: 'Flexible', risk: 'Low', validator: 'Solana Validators', logo: '🟡' },
    { symbol: 'AVAX', name: 'Avalanche', apy: 9.2, minStake: 25, lockPeriod: '14 days', risk: 'Medium', validator: 'Avalanche Validators', logo: '🔴' },
    { symbol: 'MATIC', name: 'Polygon', apy: 6.8, minStake: 1, lockPeriod: 'Flexible', risk: 'Low', validator: 'Polygon Validators', logo: '🟣' },
    { symbol: 'ATOM', name: 'Cosmos', apy: 19.5, minStake: 1, lockPeriod: '21 days', risk: 'Medium', validator: 'Cosmos Validators', logo: '⚛️' },
    { symbol: 'NEAR', name: 'NEAR Protocol', apy: 11.2, minStake: 1, lockPeriod: 'Flexible', risk: 'Low', validator: 'NEAR Validators', logo: '🟢' },
    { symbol: 'FTM', name: 'Fantom', apy: 8.7, minStake: 1, lockPeriod: 'Flexible', risk: 'Low', validator: 'Fantom Validators', logo: '🔵' },
    { symbol: 'ALGO', name: 'Algorand', apy: 4.2, minStake: 1, lockPeriod: 'Flexible', risk: 'Low', validator: 'Algorand Validators', logo: '🔵' },
    { symbol: 'XTZ', name: 'Tezos', apy: 5.8, minStake: 1, lockPeriod: 'Flexible', risk: 'Low', validator: 'Tezos Bakers', logo: '🟡' },
    { symbol: 'EGLD', name: 'MultiversX', apy: 15.3, minStake: 1, lockPeriod: 'Flexible', risk: 'Medium', validator: 'MultiversX Validators', logo: '🟠' },
    { symbol: 'ONE', name: 'Harmony', apy: 9.8, minStake: 1000, lockPeriod: '7 days', risk: 'Medium', validator: 'Harmony Validators', logo: '🟡' },
    { symbol: 'KAVA', name: 'Kava', apy: 22.1, minStake: 1, lockPeriod: '21 days', risk: 'High', validator: 'Kava Validators', logo: '🟠' },
    { symbol: 'OSMO', name: 'Osmosis', apy: 18.7, minStake: 1, lockPeriod: '14 days', risk: 'Medium', validator: 'Osmosis Validators', logo: '🟡' },
    { symbol: 'JUNO', name: 'Juno', apy: 16.4, minStake: 1, lockPeriod: '21 days', risk: 'Medium', validator: 'Juno Validators', logo: '🟣' },
    { symbol: 'SCRT', name: 'Secret Network', apy: 20.3, minStake: 1, lockPeriod: '21 days', risk: 'High', validator: 'Secret Validators', logo: '⚫' },
    { symbol: 'AKASH', name: 'Akash Network', apy: 14.6, minStake: 1, lockPeriod: '21 days', risk: 'Medium', validator: 'Akash Validators', logo: '🔵' },
    { symbol: 'REGEN', name: 'Regen Network', apy: 13.2, minStake: 1, lockPeriod: '21 days', risk: 'Medium', validator: 'Regen Validators', logo: '🟢' },
    { symbol: 'BAND', name: 'Band Protocol', apy: 11.8, minStake: 1, lockPeriod: '21 days', risk: 'Medium', validator: 'Band Validators', logo: '🟡' },
    { symbol: 'FET', name: 'Fetch.ai', apy: 17.9, minStake: 1, lockPeriod: '21 days', risk: 'Medium', validator: 'Fetch Validators', logo: '🔵' },
    { symbol: 'KSM', name: 'Kusama', apy: 16.2, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Kusama Validators', logo: '🟡' },
    { symbol: 'MOVR', name: 'Moonriver', apy: 14.8, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Moonriver Validators', logo: '🟣' },
    { symbol: 'GLMR', name: 'Moonbeam', apy: 13.5, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Moonbeam Validators', logo: '🔵' },
    { symbol: 'ASTR', name: 'Astar', apy: 12.7, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Astar Validators', logo: '🟣' },
    { symbol: 'SDN', name: 'Shiden Network', apy: 11.4, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Shiden Validators', logo: '🟡' },
    { symbol: 'PHA', name: 'Phala Network', apy: 15.6, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Phala Validators', logo: '🟣' },
    { symbol: 'CRU', name: 'Crust Network', apy: 18.3, minStake: 1, lockPeriod: '28 days', risk: 'High', validator: 'Crust Validators', logo: '🟠' },
    { symbol: 'LIT', name: 'Litentry', apy: 16.8, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Litentry Validators', logo: '🔵' },
    { symbol: 'KILT', name: 'KILT Protocol', apy: 14.2, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'KILT Validators', logo: '🟢' },
    { symbol: 'ROCO', name: 'Robonomics', apy: 13.7, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Robonomics Validators', logo: '🔴' },
    { symbol: 'PICA', name: 'Picasso', apy: 12.1, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Picasso Validators', logo: '🟡' },
    { symbol: 'TUR', name: 'Turing Network', apy: 11.9, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Turing Validators', logo: '🟣' },
    { symbol: 'DORA', name: 'Dora Factory', apy: 10.8, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Dora Validators', logo: '🟠' },
    { symbol: 'CERE', name: 'Cere Network', apy: 9.7, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Cere Validators', logo: '🔵' },
    { symbol: 'MATH', name: 'MathChain', apy: 8.9, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Math Validators', logo: '🟡' },
    { symbol: 'BONDLY', name: 'Bondly', apy: 7.6, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Bondly Validators', logo: '🟢' },
    { symbol: 'EQ', name: 'Equilibrium', apy: 6.8, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Equilibrium Validators', logo: '🔵' },
    { symbol: 'GENS', name: 'Genshiro', apy: 5.9, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Genshiro Validators', logo: '🟣' },
    { symbol: 'KAR', name: 'Karura', apy: 8.2, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Karura Validators', logo: '🟡' },
    { symbol: 'KINT', name: 'Kintsugi', apy: 7.4, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Kintsugi Validators', logo: '🟠' },
    { symbol: 'KBTC', name: 'Kintsugi BTC', apy: 6.1, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Kintsugi BTC Validators', logo: '🟡' },
    { symbol: 'KSM', name: 'Kusama', apy: 16.2, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Kusama Validators', logo: '🟡' },
    { symbol: 'PICA', name: 'Picasso', apy: 12.1, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Picasso Validators', logo: '🟡' },
    { symbol: 'TUR', name: 'Turing Network', apy: 11.9, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Turing Validators', logo: '🟣' },
    { symbol: 'DORA', name: 'Dora Factory', apy: 10.8, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Dora Validators', logo: '🟠' },
    { symbol: 'CERE', name: 'Cere Network', apy: 9.7, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Cere Validators', logo: '🔵' },
    { symbol: 'MATH', name: 'MathChain', apy: 8.9, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Math Validators', logo: '🟡' },
    { symbol: 'BONDLY', name: 'Bondly', apy: 7.6, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Bondly Validators', logo: '🟢' },
    { symbol: 'EQ', name: 'Equilibrium', apy: 6.8, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Equilibrium Validators', logo: '🔵' },
    { symbol: 'GENS', name: 'Genshiro', apy: 5.9, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Genshiro Validators', logo: '🟣' },
    { symbol: 'KAR', name: 'Karura', apy: 8.2, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Karura Validators', logo: '🟡' },
    { symbol: 'KINT', name: 'Kintsugi', apy: 7.4, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Kintsugi Validators', logo: '🟠' },
    { symbol: 'KBTC', name: 'Kintsugi BTC', apy: 6.1, minStake: 1, lockPeriod: '28 days', risk: 'Medium', validator: 'Kintsugi BTC Validators', logo: '🟡' }
  ];

  // Sort data by APY (highest first)
  const sortedData = [...cryptoData].sort((a, b) => b.apy - a.apy);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-500 bg-green-100';
      case 'Medium': return 'text-yellow-500 bg-yellow-100';
      case 'High': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getAPYColor = (apy) => {
    if (apy >= 15) return 'text-green-600 font-bold';
    if (apy >= 10) return 'text-blue-600 font-semibold';
    if (apy >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <>
      <Head>
        <title>Staking Opportunities - CryptoWealth</title>
        <meta name="description" content="Discover the best cryptocurrency staking opportunities with competitive APY rates and flexible terms." />
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
                  <Link href="/staking" className="text-white px-3 py-2 text-sm font-medium transition-colors">
                    Staking
                  </Link>
                  <Link href="/arbitrage" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
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
                Staking <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Opportunities</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Earn passive income by staking your cryptocurrencies. Choose from 50+ supported assets with competitive APY rates.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="text-center">
                <div className="text-white/80">
                  Showing {sortedData.length} of {cryptoData.length} cryptocurrencies
                </div>
                <div className="text-white/60 text-sm mt-2">
                  Sorted by APY (Highest to Lowest)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Staking Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedData.map((crypto, index) => (
                  <div
                    key={`${crypto.symbol}-${index}`}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{crypto.logo}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{crypto.symbol}</h3>
                          <p className="text-sm text-white/60">{crypto.name}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(crypto.risk)}`}>
                        {crypto.risk}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">APY</span>
                        <span className={`text-lg font-bold ${getAPYColor(crypto.apy)}`}>
                          {crypto.apy}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Min Stake</span>
                        <span className="text-white font-medium">{crypto.minStake} {crypto.symbol}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Lock Period</span>
                        <span className="text-white font-medium">{crypto.lockPeriod}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Validator</span>
                        <span className="text-white/80 text-sm">{crypto.validator}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                        Stake Now
                      </button>
                      <button className="bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/60 text-sm">Supported Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">22.1%</div>
                <div className="text-white/60 text-sm">Highest APY</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
                <div className="text-white/60 text-sm">Total Staked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-white/60 text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Staking?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users earning passive income through cryptocurrency staking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
                Start Staking Now
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

export default StakingPage;
