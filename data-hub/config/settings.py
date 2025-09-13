import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Redis Configuration
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', None)
    
    # InfluxDB Configuration
    INFLUXDB_URL = os.getenv('INFLUXDB_URL', 'http://localhost:8086')
    INFLUXDB_TOKEN = os.getenv('INFLUXDB_TOKEN', '')
    INFLUXDB_ORG = os.getenv('INFLUXDB_ORG', 'crypto-org')
    INFLUXDB_BUCKET = os.getenv('INFLUXDB_BUCKET', 'crypto-data')
    
    # API Configuration
    API_HOST = os.getenv('API_HOST', '0.0.0.0')
    API_PORT = int(os.getenv('API_PORT', 5000))
    API_DEBUG = os.getenv('API_DEBUG', 'False').lower() == 'true'
    
    # Data Collection
    COLLECTION_INTERVAL = int(os.getenv('COLLECTION_INTERVAL', 120))  # seconds
    CACHE_TTL = int(os.getenv('CACHE_TTL', 300))  # 5 minutes
    
    # Rate Limits (requests per minute)
    COINGECKO_RATE_LIMIT = 10
    STAKINGREWARDS_RATE_LIMIT = 10
    DEFILLAMA_RATE_LIMIT = 10
    COINMARKETCAP_RATE_LIMIT = 2
    
    # Data Sources
    COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'
    STAKINGREWARDS_API_URL = 'https://www.stakingrewards.com/api'
    DEFILLAMA_API_URL = 'https://api.llama.fi'
    COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1'
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/data_hub.log')
