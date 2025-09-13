from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional
from utils.redis_client import redis_client
from config.settings import Config

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.route('/api/data/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        redis_healthy = redis_client.health_check()
        
        health_status = {
            'status': 'healthy' if redis_healthy else 'unhealthy',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'redis_connected': redis_healthy,
            'version': '1.0.0'
        }
        
        status_code = 200 if redis_healthy else 503
        return jsonify(health_status), status_code
    
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
        limit = request.args.get('limit', 100, type=int)
        symbol = request.args.get('symbol', None)
        
        # Get data from Redis
        market_data = redis_client.get_data('market_prices')
        
        if not market_data:
            return jsonify({
                'error': 'No market data available',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
        data = market_data.get('data', [])
        
        # Filter by symbol if provided
        if symbol:
            data = [coin for coin in data if coin['symbol'].upper() == symbol.upper()]
        
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
        market_data = redis_client.get_data('market_prices')
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
        staking_data = redis_client.get_data('staking_data')
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
        
        # Get data from Redis
        staking_data = redis_client.get_data('staking_data')
        
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
        
        staking_data = redis_client.get_data('staking_data')
        
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

@app.route('/api/data/defi-data', methods=['GET'])
def get_defi_data():
    """Get DeFi protocol data"""
    try:
        limit = request.args.get('limit', 50, type=int)
        category = request.args.get('category', None)
        
        defi_data = redis_client.get_data('defi_data')
        
        if not defi_data:
            return jsonify({
                'error': 'No DeFi data available',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
        data = defi_data.get('data', [])
        
        # Filter by category if provided
        if category:
            data = [protocol for protocol in data if protocol.get('category', '').lower() == category.lower()]
        
        # Limit results
        data = data[:limit]
        
        return jsonify({
            'data': data,
            'count': len(data),
            'timestamp': defi_data.get('timestamp'),
            'source': defi_data.get('source')
        })
    
    except Exception as e:
        logger.error(f"Error getting DeFi data: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 500

@app.route('/api/data/market-summary', methods=['GET'])
def get_market_summary():
    """Get market summary data"""
    try:
        summary = redis_client.get_data('market_summary')
        
        if not summary:
            return jsonify({
                'error': 'No market summary available',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }), 404
        
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
        
        market_data = redis_client.get_data('market_prices')
        
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

# Utility functions for tools
def get_market_prices_for_tool(limit: int = 100) -> List[Dict]:
    """Get market prices for use in tools"""
    try:
        market_data = redis_client.get_data('market_prices')
        if market_data:
            return market_data.get('data', [])[:limit]
        return []
    except Exception as e:
        logger.error(f"Error getting market prices for tool: {e}")
        return []

def get_staking_data_for_tool(symbols: List[str] = None) -> List[Dict]:
    """Get staking data for use in tools"""
    try:
        staking_data = redis_client.get_data('staking_data')
        if staking_data:
            data = staking_data.get('data', [])
            if symbols:
                symbol_set = set(s.upper() for s in symbols)
                data = [staking for staking in data if staking['symbol'] in symbol_set]
            return data
        return []
    except Exception as e:
        logger.error(f"Error getting staking data for tool: {e}")
        return []

if __name__ == '__main__':
    # Create logs directory if it doesn't exist
    import os
    os.makedirs('logs', exist_ok=True)
    
    logger.info(f"Starting Universal Data API on {Config.API_HOST}:{Config.API_PORT}")
    app.run(
        host=Config.API_HOST,
        port=Config.API_PORT,
        debug=Config.API_DEBUG
    )
