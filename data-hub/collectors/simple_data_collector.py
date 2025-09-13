import requests
import time
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional

class SimpleDataCollector:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'CryptoWealth-DataHub/1.0'
        })
        
        # In-memory cache (simplified)
        self.cache = {}
        self.cache_timeout = 300  # 5 minutes
        
        # Rate limiting
        self.last_request_times = {}
        self.rate_limits = {
            'coingecko': 10,
            'stakingrewards': 10,
            'defillama': 10
        }
    
    def _rate_limit_check(self, source: str) -> bool:
        """Check if we can make a request to the source"""
        current_time = time.time()
        if source not in self.last_request_times:
            self.last_request_times[source] = []
        
        # Remove requests older than 1 minute
        self.last_request_times[source] = [
            req_time for req_time in self.last_request_times[source]
            if current_time - req_time < 60
        ]
        
        # Check if we're under the rate limit
        if len(self.last_request_times[source]) < self.rate_limits[source]:
            self.last_request_times[source].append(current_time)
            return True
        
        return False
    
    def _make_request(self, url: str, source: str, params: Dict = None) -> Optional[Dict]:
        """Make a rate-limited request"""
        if not self._rate_limit_check(source):
            self.logger.warning(f"Rate limit exceeded for {source}")
            return None
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request failed for {source}: {e}")
            return None
    
    def collect_coingecko_data(self) -> Optional[Dict]:
        """Collect market data from CoinGecko"""
        url = "https://api.coingecko.com/api/v3/coins/markets"
        params = {
            'vs_currency': 'usd',
            'order': 'market_cap_desc',
            'per_page': 50,  # Reduced for faster response
            'page': 1,
            'sparkline': False,
            'price_change_percentage': '1h,24h,7d'
        }
        
        data = self._make_request(url, 'coingecko', params)
        if data:
            # Process and structure the data
            processed_data = []
            for coin in data:
                processed_coin = {
                    'id': coin['id'],
                    'symbol': coin['symbol'].upper(),
                    'name': coin['name'],
                    'current_price': coin['current_price'],
                    'market_cap': coin['market_cap'],
                    'market_cap_rank': coin['market_cap_rank'],
                    'total_volume': coin['total_volume'],
                    'price_change_1h': coin.get('price_change_percentage_1h_in_currency', 0),
                    'price_change_24h': coin.get('price_change_percentage_24h_in_currency', 0),
                    'price_change_7d': coin.get('price_change_percentage_7d_in_currency', 0),
                    'last_updated': datetime.now(timezone.utc).isoformat()
                }
                processed_data.append(processed_coin)
            
            return {
                'source': 'coingecko',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'data': processed_data
            }
        
        return None
    
    def collect_staking_data(self) -> Optional[Dict]:
        """Collect staking data (simplified)"""
        # Mock staking data for now
        staking_data = [
            {
                'symbol': 'ETH',
                'name': 'Ethereum',
                'current_price': 2650,
                'market_cap': 320000000000,
                'staking_apy': 5.2,
                'last_updated': datetime.now(timezone.utc).isoformat()
            },
            {
                'symbol': 'ADA',
                'name': 'Cardano',
                'current_price': 0.485,
                'market_cap': 17000000000,
                'staking_apy': 4.8,
                'last_updated': datetime.now(timezone.utc).isoformat()
            },
            {
                'symbol': 'SOL',
                'name': 'Solana',
                'current_price': 98.50,
                'market_cap': 45000000000,
                'staking_apy': 7.1,
                'last_updated': datetime.now(timezone.utc).isoformat()
            },
            {
                'symbol': 'DOT',
                'name': 'Polkadot',
                'current_price': 7.25,
                'market_cap': 9000000000,
                'staking_apy': 12.5,
                'last_updated': datetime.now(timezone.utc).isoformat()
            }
        ]
        
        return {
            'source': 'staking_data',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'data': staking_data
        }
    
    def collect_all_data(self) -> Dict:
        """Collect all market data"""
        self.logger.info("Starting data collection...")
        
        collected_data = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'market_prices': None,
            'staking_data': None
        }
        
        # Collect market prices
        market_data = self.collect_coingecko_data()
        if market_data:
            collected_data['market_prices'] = market_data
            self.cache['market_prices'] = {
                'data': market_data,
                'timestamp': time.time()
            }
            self.logger.info(f"Collected {len(market_data['data'])} market prices")
        
        # Collect staking data
        staking_data = self.collect_staking_data()
        if staking_data:
            collected_data['staking_data'] = staking_data
            self.cache['staking_data'] = {
                'data': staking_data,
                'timestamp': time.time()
            }
            self.logger.info(f"Collected {len(staking_data['data'])} staking opportunities")
        
        # Store summary data
        summary = {
            'timestamp': collected_data['timestamp'],
            'total_coins': len(market_data['data']) if market_data else 0,
            'total_staking': len(staking_data['data']) if staking_data else 0,
            'status': 'success'
        }
        
        self.cache['market_summary'] = {
            'data': summary,
            'timestamp': time.time()
        }
        
        self.logger.info("Data collection completed successfully")
        return collected_data
    
    def get_cached_data(self, key: str) -> Optional[Dict]:
        """Get data from cache if not expired"""
        if key in self.cache:
            cached = self.cache[key]
            if time.time() - cached['timestamp'] < self.cache_timeout:
                return cached['data']
        return None
    
    def run_collection_loop(self):
        """Run the data collection in a loop"""
        self.logger.info("Starting data collection loop with 120s interval")
        
        # Initial collection
        self.collect_all_data()
        
        while True:
            try:
                time.sleep(120)  # 2 minutes
                self.collect_all_data()
            except KeyboardInterrupt:
                self.logger.info("Data collection stopped by user")
                break
            except Exception as e:
                self.logger.error(f"Error in collection loop: {e}")
                time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('logs/simple_data_collector.log'),
            logging.StreamHandler()
        ]
    )
    
    # Create logs directory if it doesn't exist
    import os
    os.makedirs('logs', exist_ok=True)
    
    # Start collector
    collector = SimpleDataCollector()
    collector.run_collection_loop()
