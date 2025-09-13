import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Gift, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AirdropPage() {
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading airdrop data
    setTimeout(() => {
      setAirdrops([
        {
          id: 1,
          name: "Ethereum 2.0 Staking Rewards",
          token: "ETH",
          amount: "0.5 ETH",
          status: "active",
          deadline: "2024-12-31",
          participants: 15000,
          description: "Earn rewards by staking your Ethereum tokens"
        },
        {
          id: 2,
          name: "Polygon Ecosystem Airdrop",
          token: "MATIC",
          amount: "100 MATIC",
          status: "upcoming",
          deadline: "2024-11-15",
          participants: 8500,
          description: "Exclusive airdrop for early Polygon users"
        },
        {
          id: 3,
          name: "Solana DeFi Rewards",
          token: "SOL",
          amount: "2.5 SOL",
          status: "completed",
          deadline: "2024-10-01",
          participants: 25000,
          description: "Rewards for participating in Solana DeFi protocols"
        }
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-100';
      case 'upcoming': return 'text-yellow-400 bg-yellow-100';
      case 'completed': return 'text-gray-400 bg-gray-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'upcoming': return Clock;
      case 'completed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  return (
    <>
      <Head>
        <title>Airdrops - CryptoWealth</title>
        <meta name="description" content="Discover and participate in cryptocurrency airdrops to earn free tokens" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Sparkles className="h-8 w-8 text-yellow-400 mr-2" />
                  <span className="text-2xl font-bold text-white">CryptoWealth</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/staking" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Staking
                </Link>
                <Link href="/arbitrage" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Arbitrage
                </Link>
                <Link href="/login" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full mb-6">
                  <Gift className="h-8 w-8 text-yellow-400" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Crypto Airdrops
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Free Tokens Await
                  </span>
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Discover and participate in the latest cryptocurrency airdrops. 
                  Earn free tokens by completing simple tasks and being an early adopter.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Airdrops Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Available Airdrops</h2>
              <p className="text-white/70">Join these airdrops to earn free cryptocurrency</p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {airdrops.map((airdrop, index) => {
                  const StatusIcon = getStatusIcon(airdrop.status);
                  return (
                    <motion.div
                      key={airdrop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                            <Gift className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{airdrop.name}</h3>
                            <p className="text-white/60 text-sm">{airdrop.token}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(airdrop.status)}`}>
                          <StatusIcon className="h-4 w-4 inline mr-1" />
                          {airdrop.status}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">{airdrop.amount}</div>
                        <p className="text-white/70 text-sm leading-relaxed">{airdrop.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {airdrop.participants.toLocaleString()} participants
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {airdrop.deadline}
                        </div>
                      </div>

                      <button 
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                          airdrop.status === 'active' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600' 
                            : airdrop.status === 'upcoming'
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        }`}
                        disabled={airdrop.status === 'completed'}
                      >
                        {airdrop.status === 'active' && 'Participate Now'}
                        {airdrop.status === 'upcoming' && 'Coming Soon'}
                        {airdrop.status === 'completed' && 'Completed'}
                        {airdrop.status === 'active' && <ArrowRight className="h-4 w-4 inline ml-2" />}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
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
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join our platform to get notified about the latest airdrops and maximize your earnings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
                  Get Started Free
                </Link>
                <Link href="/dashboard" className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                  View Dashboard
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
                  <li><Link href="/airdrop" className="text-white/60 hover:text-white transition-colors">Airdrops</Link></li>
                  <li><Link href="/ai-search" className="text-white/60 hover:text-white transition-colors">AI Search</Link></li>
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
