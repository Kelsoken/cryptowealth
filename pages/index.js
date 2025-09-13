import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  Zap, 
  Bot, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch('/api/crypto/prices');
      const data = await response.json();
      if (data.success) {
        setCryptoData(data.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Market Data",
      description: "Live cryptocurrency prices and market analysis with advanced charts and indicators.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Wallet,
      title: "Portfolio Management",
      description: "Track your investments, monitor performance, and manage your crypto portfolio.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: TrendingUp,
      title: "Staking Rewards",
      description: "Earn passive income by staking your cryptocurrencies with competitive APY rates.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Zap,
      title: "Arbitrage Opportunities",
      description: "Discover price differences across exchanges and profit from market inefficiencies.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Bot,
      title: "AI-Powered Insights",
      description: "Get intelligent market analysis and trading recommendations from our AI system.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      icon: Shield,
      title: "Secure Trading",
      description: "Bank-level security with encrypted connections and secure API integrations.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10,000+", icon: Users },
    { label: "Supported Exchanges", value: "15+", icon: Globe },
    { label: "Total Volume", value: "$50M+", icon: TrendingUp },
    { label: "Success Rate", value: "99.9%", icon: CheckCircle }
  ];

  return (
    <>
      <Head>
        <title>CryptoWealth - Professional Cryptocurrency Trading Platform</title>
        <meta name="description" content="Advanced cryptocurrency trading platform with AI insights, staking rewards, and arbitrage opportunities. Join thousands of traders who trust our platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Test inline styles */}
      <div style={{ color: 'red', fontSize: '24px', padding: '20px', backgroundColor: 'yellow', margin: '10px' }}>
        Als deze tekst rood is, werkt React maar niet CSS
      </div>

      {/* JS Test */}
      <div style={{ padding: '20px', backgroundColor: 'lightblue', margin: '10px', textAlign: 'center' }}>
        <h1 style={{ color: 'darkblue', marginBottom: '20px' }}>JS Test</h1>
        <button 
          onClick={() => alert('JS werkt!')}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: 'green', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Klik mij (test JS)
        </button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-white flex items-center">
                    <Sparkles className="h-8 w-8 text-yellow-400 mr-2" />
                    CryptoWealth
                  </h1>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#features" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                    Features
                  </a>
                  <a href="#market" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                    Market
                  </a>
                  <a href="#pricing" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                    Pricing
                  </a>
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
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Professional Crypto Trading
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Advanced cryptocurrency trading platform with AI insights, staking rewards, 
                  arbitrage opportunities, and comprehensive portfolio management. 
                  Join the future of crypto trading.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                    Start Trading Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link href="/dashboard" className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                    View Dashboard
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Everything you need to succeed in cryptocurrency trading and investment
                </p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Section */}
        <section id="market" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-4">Top Cryptocurrencies</h2>
                <p className="text-xl text-white/70">Real-time market data and price movements</p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                </div>
              ) : (
                cryptoData.map((crypto, index) => (
                  <motion.div
                    key={crypto.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img 
                          src={crypto.image} 
                          alt={crypto.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h3 className="text-white font-semibold">{crypto.symbol.toUpperCase()}</h3>
                          <p className="text-white/60 text-sm">{crypto.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">${crypto.current_price.toLocaleString()}</div>
                        <div className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-white/60 text-sm">
                      Market Cap: ${(crypto.market_cap / 1000000000).toFixed(2)}B
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Trading?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of traders who trust our platform for their cryptocurrency investments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
                  Create Free Account
                </Link>
                <Link href="/ai-search" className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                  Try AI Search
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="h-6 w-6 text-yellow-400 mr-2" />
                  CryptoWealth
                </h3>
                <p className="text-white/60">
                  Professional cryptocurrency trading platform with AI insights and advanced features.
                </p>
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
}
