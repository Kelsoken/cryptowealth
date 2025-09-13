from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional
import sys
import os
from pathlib import Path

# Add the data-hub directory to Python path
data_hub_dir = Path(__file__).parent.parent
sys.path.insert(0, str(data_hub_dir))

from collectors.simple_data_collector import SimpleDataCollector

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global data collector instance
data_collector = SimpleDataCollector()

@app.route('/api/data/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'version': '1.0.0-simple',
            'cache_size': len(data_collector.cache)
        }
        
        return jsonify(health_status), 200
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@app.route('/api/data/market-prices', methods=['GET'])
def get_market_prices():
    """Get market prices for all coins"""
    try:
        limit = request.args.get('limit', 50, type=int)
        
        # Get data from cache
        market_data = data_collector.get_cached_data('market_prices')
        
        if not market_data:
            # Try to collect fresh data
            collected = data_collector.collect_all_data()
            market_data = collected.get('market_prices')
        
        if not market_data:
            return jsonify({
                'error': 'No market data available',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
        data = market_data.get('data', [])
        
        # Limit results
        data = data[:limit]
        
        return jsonify({
            'data': data,
            'count': len(data),
            'timestamp': market_data.get('timestamp'),
            'source': market_data.get('source')
        })
    
    except Exception as e:
        logger.error(f"Error getting market prices: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@app.route('/api/data/coin/<symbol>', methods=['GET'])
def get_coin_data(symbol):
    """Get data for a specific coin"""
    try:
        symbol = symbol.upper()
        
        # Get market data
        market_data = data_collector.get_cached_data('market_prices')
        coin_data = None
        
        if market_data:
            for coin in market_data.get('data', []):
                if coin['symbol'] == symbol:
                    coin_data = coin
                    break
        
        if not coin_data:
            return jsonify({
                'error': f'Coin {symbol} not found',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
        # Get staking data if available
        staking_data = data_collector.get_cached_data('staking_data')
        staking_info = None
        
        if staking_data:
            for staking in staking_data.get('data', []):
                if staking['symbol'] == symbol:
                    staking_info = staking
                    break
        
        response_data = {
            'symbol': symbol,
            'market_data': coin_data,
            'staking_data': staking_info,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        logger.error(f"Error getting coin data for {symbol}: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@app.route('/api/data/staking-data', methods=['GET'])
def get_staking_data():
    """Get staking data"""
    try:
        symbols = request.args.get('symbols', None)
        
        # Get data from cache
        staking_data = data_collector.get_cached_data('staking_data')
        
        if not staking_data:
            # Try to collect fresh data
            collected = data_collector.collect_all_data()
            staking_data = collected.get('staking_data')
        
        if not staking_data:
            return jsonify({
                'error': 'No staking data available',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
        data = staking_data.get('data', [])
        
        # Filter by symbols if provided
        if symbols:
            symbol_list = [s.strip().upper() for s in symbols.split(',')]
            data = [staking for staking in data if staking['symbol'] in symbol_list]
        
        return jsonify({
            'data': data,
            'count': len(data),
            'timestamp': staking_data.get('timestamp'),
            'source': staking_data.get('source')
        })
    
    except Exception as e:
        logger.error(f"Error getting staking data: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@app.route('/api/data/top-staking', methods=['GET'])
def get_top_staking():
    """Get top staking opportunities by APY"""
    try:
        limit = request.args.get('limit', 20, type=int)
        
        staking_data = data_collector.get_cached_data('staking_data')
        
        if not staking_data:
            # Try to collect fresh data
            collected = data_collector.collect_all_data()
            staking_data = collected.get('staking_data')
        
        if not staking_data:
            return jsonify({
                'error': 'No staking data available',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
        data = staking_data.get('data', [])
        
        # Sort by APY (descending)
        data.sort(key=lambda x: x.get('staking_apy', 0), reverse=True)
        
        # Limit results
        data = data[:limit]
        
        return jsonify({
            'data': data,
            'count': len(data),
            'timestamp': staking_data.get('timestamp'),
            'source': staking_data.get('source')
        })
    
    except Exception as e:
        logger.error(f"Error getting top staking data: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@app.route('/api/data/market-summary', methods=['GET'])
def get_market_summary():
    """Get market summary data"""
    try:
        summary = data_collector.get_cached_data('market_summary')
        
        if not summary:
            # Try to collect fresh data
            collected = data_collector.collect_all_data()
            summary = {
                'timestamp': collected['timestamp'],
                'total_coins': len(collected.get('market_prices', {}).get('data', [])),
                'total_staking': len(collected.get('staking_data', {}).get('data', [])),
                'status': 'success'
            }
        
        return jsonify(summary)
    
    except Exception as e:
        logger.error(f"Error getting market summary: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@app.route('/api/data/search', methods=['GET'])
def search_coins():
    """Search for coins by name or symbol"""
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({
                'error': 'Query parameter is required',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 400
        
        market_data = data_collector.get_cached_data('market_prices')
        
        if not market_data:
            return jsonify({
                'error': 'No market data available',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
        data = market_data.get('data', [])
        query_lower = query.lower()
        
        # Search by name or symbol
        results = []
        for coin in data:
            if (query_lower in coin['name'].lower() or 
                query_lower in coin['symbol'].lower()):
                results.append(coin)
        
        return jsonify({
            'data': results,
            'count': len(results),
            'query': query,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error searching coins: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

if __name__ == '__main__':
    # Create logs directory if it doesn't exist
    os.makedirs('logs', exist_ok=True)
    
    logger.info("Starting Simple Data API on 0.0.0.0:5000")
    print("Available endpoints:")
    print("  GET /api/data/health - Health check")
    print("  GET /api/data/market-prices - Market prices")
    print("  GET /api/data/coin/<symbol> - Specific coin data")
    print("  GET /api/data/staking-data - Staking data")
    print("  GET /api/data/top-staking - Top staking opportunities")
    print("  GET /api/data/market-summary - Market summary")
    print("  GET /api/data/search?q=<query> - Search coins")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False
    )
