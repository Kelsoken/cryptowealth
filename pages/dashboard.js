import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Zap, 
  Bot, 
  Shield, 
  Star,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  ExternalLink
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [stakingData, setStakingData] = useState([]);
  const [arbitrageData, setArbitrageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch portfolio data
      const portfolioResponse = await fetch('/api/portfolio/overview');
      const portfolioResult = await portfolioResponse.json();
      if (portfolioResult.success) {
        setPortfolioData(portfolioResult.data);
      }
      
      // Fetch crypto data
      const cryptoResponse = await fetch('/api/crypto/prices');
      const cryptoResult = await cryptoResponse.json();
      if (cryptoResult.success) {
        setCryptoData(cryptoResult.data.slice(0, 6));
      }
      
      // Fetch staking data
      const stakingResponse = await fetch('/api/staking/positions');
      const stakingResult = await stakingResponse.json();
      if (stakingResult.success) {
        setStakingData(stakingResult.data);
      }
      
      // Fetch arbitrage data
      const arbitrageResponse = await fetch('/api/arbitrage/opportunities');
      const arbitrageResult = await arbitrageResponse.json();
      if (arbitrageResult.success) {
        setArbitrageData(arbitrageResult.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: true },
    { name: 'Portfolio', href: '/portfolio', icon: Wallet },
    { name: 'Trading', href: '/trading', icon: TrendingUp },
    { name: 'Staking', href: '/staking', icon: TrendingUp },
    { name: 'Arbitrage', href: '/arbitrage', icon: Zap },
    { name: 'Exchanges', href: '/exchanges', icon: Settings },
  ];

  const quickActions = [
    { name: 'Add Asset', icon: Plus, href: '/portfolio/add', color: 'bg-blue-500' },
    { name: 'Start Staking', icon: TrendingUp, href: '/staking', color: 'bg-green-500' },
    { name: 'Find Arbitrage', icon: Zap, href: '/arbitrage', color: 'bg-yellow-500' },
    { name: 'AI Analysis', icon: Bot, href: '/ai-search', color: 'bg-purple-500' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - CryptoWealth</title>
        <meta name="description" content="Your personal cryptocurrency trading dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-gray-900">CryptoWealth</h1>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">CryptoWealth</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top navigation */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
                <input
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search cryptocurrencies, markets..."
                  type="search"
                />
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-x-4">
                  <span className="text-sm font-medium text-gray-500">Welcome, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Welcome section */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.username}! 👋
                </h1>
                <p className="text-gray-600">Here's what's happening with your portfolio today.</p>
              </div>

              {/* Portfolio overview */}
              {portfolioData && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Wallet className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Portfolio Value</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {showBalance ? `$${portfolioData.totalValue.toLocaleString()}` : '••••••'}
                              </div>
                              <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                              >
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <span className={`font-medium ${portfolioData.totalChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolioData.totalChange24h >= 0 ? '+' : ''}${portfolioData.totalChange24h.toLocaleString()}
                        </span>
                        <span className="text-gray-500"> in 24h</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <TrendingUp className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">24h Change</dt>
                            <dd className="text-2xl font-semibold text-gray-900">
                              {portfolioData.totalChangePercentage >= 0 ? '+' : ''}{portfolioData.totalChangePercentage.toFixed(2)}%
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {portfolioData.assets.length} assets
                        </span>
                        <span className="text-gray-500"> in portfolio</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Star className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Staking Rewards</dt>
                            <dd className="text-2xl font-semibold text-gray-900">
                              $2,450
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <span className="font-medium text-green-600">+12.5%</span>
                        <span className="text-gray-500"> this month</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Zap className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Arbitrage Profit</dt>
                            <dd className="text-2xl font-semibold text-gray-900">
                              $1,230
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <span className="font-medium text-green-600">+8.3%</span>
                        <span className="text-gray-500"> this week</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Charts and data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Portfolio performance chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Portfolio Performance</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={portfolioData?.performance?.daily || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Asset allocation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Allocation</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioData?.allocation || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ symbol, percentage }) => `${symbol} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {(portfolioData?.allocation || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Quick actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-lg shadow mb-8"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{action.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Market data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Top Cryptocurrencies</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {cryptoData.map((crypto, index) => (
                    <div key={crypto.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{crypto.symbol.toUpperCase()}</div>
                          <div className="text-sm text-gray-500">{crypto.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${crypto.current_price.toLocaleString()}
                        </div>
                        <div className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <ArrowUpRight className="inline h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="inline h-3 w-3 mr-1" />
                          )}
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 bg-gray-50 text-center">
                  <Link href="/market" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all markets
                    <ExternalLink className="inline h-3 w-3 ml-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
