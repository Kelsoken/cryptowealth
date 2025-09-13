import requests
import time
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional
from utils.redis_client import redis_client
from config.settings import Config

class MarketDataCollector:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'CryptoWealth-DataHub/1.0'
        })
        
        # Rate limiting
        self.last_request_times = {}
        self.rate_limits = {
            'coingecko': Config.COINGECKO_RATE_LIMIT,
            'stakingrewards': Config.STAKINGREWARDS_RATE_LIMIT,
            'defillama': Config.DEFILLAMA_RATE_LIMIT,
            'coinmarketcap': Config.COINMARKETCAP_RATE_LIMIT
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
        url = f"{Config.COINGECKO_API_URL}/coins/markets"
        params = {
            'vs_currency': 'usd',
            'order': 'market_cap_desc',
            'per_page': 200,
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
        """Collect staking data from various sources"""
        staking_data = []
        
        # Get staking data from CoinGecko
        url = f"{Config.COINGECKO_API_URL}/coins/markets"
        params = {
            'vs_currency': 'usd',
            'category': 'staking',
            'order': 'market_cap_desc',
            'per_page': 100
        }
        
        data = self._make_request(url, 'coingecko', params)
        if data:
            for coin in data:
                staking_info = {
                    'symbol': coin['symbol'].upper(),
                    'name': coin['name'],
                    'current_price': coin['current_price'],
                    'market_cap': coin['market_cap'],
                    'staking_apy': self._get_staking_apy(coin['symbol']),
                    'last_updated': datetime.now(timezone.utc).isoformat()
                }
                staking_data.append(staking_info)
        
        return {
            'source': 'staking_data',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'data': staking_data
        }
    
    def _get_staking_apy(self, symbol: str) -> float:
        """Get staking APY for a specific coin (mock data for now)"""
        # This would integrate with StakingRewards API or other sources
        apy_data = {
            'eth': 5.2,
            'ada': 4.8,
            'sol': 7.1,
            'dot': 12.5,
            'avax': 8.9,
            'matic': 4.2,
            'atom': 19.8,
            'near': 11.2
        }
        return apy_data.get(symbol.lower(), 0.0)
    
    def collect_defi_data(self) -> Optional[Dict]:
        """Collect DeFi protocol data"""
        url = f"{Config.DEFILLAMA_API_URL}/protocols"
        
        data = self._make_request(url, 'defillama')
        if data:
            # Process DeFi data
            defi_data = []
            for protocol in data[:50]:  # Top 50 protocols
                defi_info = {
                    'name': protocol['name'],
                    'tvl': protocol['tvl'],
                    'tvl_change_24h': protocol.get('change_1d', 0),
                    'category': protocol.get('category', 'Unknown'),
                    'chains': protocol.get('chains', []),
                    'last_updated': datetime.now(timezone.utc).isoformat()
                }
                defi_data.append(defi_info)
            
            return {
                'source': 'defillama',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'data': defi_data
            }
        
        return None
    
    def collect_all_data(self) -> Dict:
        """Collect all market data"""
        self.logger.info("Starting data collection...")
        
        collected_data = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'market_prices': None,
            'staking_data': None,
            'defi_data': None
        }
        
        # Collect market prices
        market_data = self.collect_coingecko_data()
        if market_data:
            collected_data['market_prices'] = market_data
            redis_client.set_data('market_prices', market_data)
            self.logger.info(f"Collected {len(market_data['data'])} market prices")
        
        # Collect staking data
        staking_data = self.collect_staking_data()
        if staking_data:
            collected_data['staking_data'] = staking_data
            redis_client.set_data('staking_data', staking_data)
            self.logger.info(f"Collected {len(staking_data['data'])} staking opportunities")
        
        # Collect DeFi data
        defi_data = self.collect_defi_data()
        if defi_data:
            collected_data['defi_data'] = defi_data
            redis_client.set_data('defi_data', defi_data)
            self.logger.info(f"Collected {len(defi_data['data'])} DeFi protocols")
        
        # Store summary data
        summary = {
            'timestamp': collected_data['timestamp'],
            'total_coins': len(market_data['data']) if market_data else 0,
            'total_staking': len(staking_data['data']) if staking_data else 0,
            'total_defi': len(defi_data['data']) if defi_data else 0,
            'status': 'success'
        }
        
        redis_client.set_data('market_summary', summary)
        
        self.logger.info("Data collection completed successfully")
        return collected_data
    
    def run_collection_loop(self):
        """Run the data collection in a loop"""
        self.logger.info(f"Starting data collection loop with {Config.COLLECTION_INTERVAL}s interval")
        
        while True:
            try:
                self.collect_all_data()
                time.sleep(Config.COLLECTION_INTERVAL)
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
            logging.FileHandler('logs/market_data_collector.log'),
            logging.StreamHandler()
        ]
    )
    
    # Create logs directory if it doesn't exist
    import os
    os.makedirs('logs', exist_ok=True)
    
    # Start collector
    collector = MarketDataCollector()
    collector.run_collection_loop()
