import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AISearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    
    // Simulate AI search
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: `${searchQuery} Market Analysis`,
          content: `Based on current market data, ${searchQuery} shows strong bullish momentum with increasing trading volume and positive sentiment indicators.`,
          confidence: 0.92,
          source: 'AI Analysis',
          timestamp: new Date().toISOString(),
          tags: ['market-analysis', 'sentiment', 'technical']
        },
        {
          id: 2,
          title: `${searchQuery} Price Prediction`,
          content: `Our AI model predicts ${searchQuery} could reach new highs in the next 30 days based on historical patterns and current market conditions.`,
          confidence: 0.87,
          source: 'AI Prediction',
          timestamp: new Date().toISOString(),
          tags: ['prediction', 'price-target', 'forecast']
        },
        {
          id: 3,
          title: `${searchQuery} Trading Strategy`,
          content: `Recommended trading strategy for ${searchQuery}: Consider DCA (Dollar Cost Averaging) approach with stop-loss at 5% below current price.`,
          confidence: 0.89,
          source: 'AI Strategy',
          timestamp: new Date().toISOString(),
          tags: ['strategy', 'trading', 'risk-management']
        }
      ];
      
      setSearchResults(mockResults);
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
      setLoading(false);
    }, 2000);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-500 bg-green-100';
    if (confidence >= 0.8) return 'text-blue-500 bg-blue-100';
    if (confidence >= 0.7) return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  const getTagColor = (tag) => {
    const colors = {
      'market-analysis': 'bg-blue-100 text-blue-800',
      'sentiment': 'bg-green-100 text-green-800',
      'technical': 'bg-purple-100 text-purple-800',
      'prediction': 'bg-orange-100 text-orange-800',
      'price-target': 'bg-red-100 text-red-800',
      'forecast': 'bg-indigo-100 text-indigo-800',
      'strategy': 'bg-pink-100 text-pink-800',
      'trading': 'bg-yellow-100 text-yellow-800',
      'risk-management': 'bg-gray-100 text-gray-800'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Head>
        <title>AI Search - CryptoWealth</title>
        <meta name="description" content="Get AI-powered insights and analysis for cryptocurrency trading and investment decisions." />
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
                AI-Powered <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Search</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Get intelligent insights, market analysis, and trading recommendations powered by advanced AI technology.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask about any cryptocurrency, market trend, or trading strategy..."
                    className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                
                {searchHistory.length > 0 && (
                  <div>
                    <h3 className="text-white/70 text-sm mb-2">Recent Searches:</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(term)}
                          className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-white mb-6">AI Analysis Results</h2>
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{result.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                        {Math.round(result.confidence * 100)}% Confidence
                      </span>
                    </div>
                    
                    <p className="text-white/80 mb-4 leading-relaxed">{result.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {result.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                          >
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-white/60 text-sm">
                        {result.source} • {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Features</h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Our advanced AI system provides comprehensive analysis and insights for better trading decisions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-white mb-2">Market Analysis</h3>
                <p className="text-white/70">Get real-time market sentiment and technical analysis powered by machine learning.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-white mb-2">Price Predictions</h3>
                <p className="text-white/70">Advanced forecasting models predict price movements with high accuracy.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-white mb-2">Trading Strategies</h3>
                <p className="text-white/70">Personalized trading recommendations based on your risk profile and goals.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Risk Assessment</h3>
                <p className="text-white/70">Comprehensive risk analysis for every trading opportunity and investment.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-2">Portfolio Optimization</h3>
                <p className="text-white/70">AI-driven portfolio rebalancing and optimization strategies.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Alert System</h3>
                <p className="text-white/70">Smart notifications for market opportunities and risk warnings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Use AI-Powered Trading?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who trust our AI system for better trading decisions and higher profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
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

export default AISearchPage;
