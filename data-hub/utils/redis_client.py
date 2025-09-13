import redis
import json
import logging
from typing import Any, Optional, Dict, List
from config.settings import Config

class RedisClient:
    def __init__(self):
        self.client = redis.Redis(
            host=Config.REDIS_HOST,
            port=Config.REDIS_PORT,
            db=Config.REDIS_DB,
            password=Config.REDIS_PASSWORD,
            decode_responses=True
        )
        self.logger = logging.getLogger(__name__)
    
    def set_data(self, key: str, data: Any, ttl: int = None) -> bool:
        """Store data in Redis with optional TTL"""
        try:
            if ttl is None:
                ttl = Config.CACHE_TTL
            
            serialized_data = json.dumps(data)
            return self.client.setex(key, ttl, serialized_data)
        except Exception as e:
            self.logger.error(f"Error setting data for key {key}: {e}")
            return False
    
    def get_data(self, key: str) -> Optional[Any]:
        """Retrieve data from Redis"""
        try:
            data = self.client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            self.logger.error(f"Error getting data for key {key}: {e}")
            return None
    
    def delete_data(self, key: str) -> bool:
        """Delete data from Redis"""
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            self.logger.error(f"Error deleting data for key {key}: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in Redis"""
        try:
            return bool(self.client.exists(key))
        except Exception as e:
            self.logger.error(f"Error checking existence of key {key}: {e}")
            return False
    
    def get_keys(self, pattern: str = "*") -> List[str]:
        """Get all keys matching pattern"""
        try:
            return self.client.keys(pattern)
        except Exception as e:
            self.logger.error(f"Error getting keys with pattern {pattern}: {e}")
            return []
    
    def get_ttl(self, key: str) -> int:
        """Get TTL for a key"""
        try:
            return self.client.ttl(key)
        except Exception as e:
            self.logger.error(f"Error getting TTL for key {key}: {e}")
            return -1
    
    def health_check(self) -> bool:
        """Check Redis connection health"""
        try:
            return self.client.ping()
        except Exception as e:
            self.logger.error(f"Redis health check failed: {e}")
            return False

# Global Redis client instance
redis_client = RedisClient()
