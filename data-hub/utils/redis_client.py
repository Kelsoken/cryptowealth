import redis
import json
import logging
import os
from typing import Any, Optional, Dict, List

class RedisClient:
    def __init__(self):
        # Use Redis URL from environment
        redis_url = os.getenv('REDIS_URL', 'redis://default:34LuTofbE0p9EvGCspJBZIDwtdUSuMWr@redis-13900.c244.us-east-1-2.ec2.redns.redis-cloud.com:13900')
        
        try:
            self.client = redis.from_url(redis_url, decode_responses=True)
            # Test connection
            self.client.ping()
            self.logger = logging.getLogger(__name__)
            self.logger.info(f"Connected to Redis: {redis_url}")
        except Exception as e:
            self.logger = logging.getLogger(__name__)
            self.logger.error(f"Failed to connect to Redis: {e}")
            self.client = None
    
    def set_data(self, key: str, data: Any, ttl: int = 300) -> bool:
        """Store data in Redis with optional TTL"""
        if not self.client:
            return False
            
        try:
            serialized_data = json.dumps(data)
            return self.client.setex(key, ttl, serialized_data)
        except Exception as e:
            self.logger.error(f"Error setting data for key {key}: {e}")
            return False
    
    def get_data(self, key: str) -> Optional[Any]:
        """Retrieve data from Redis"""
        if not self.client:
            return None
            
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
        if not self.client:
            return False
            
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            self.logger.error(f"Error deleting data for key {key}: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in Redis"""
        if not self.client:
            return False
            
        try:
            return bool(self.client.exists(key))
        except Exception as e:
            self.logger.error(f"Error checking existence of key {key}: {e}")
            return False
    
    def get_keys(self, pattern: str = "*") -> List[str]:
        """Get all keys matching pattern"""
        if not self.client:
            return []
            
        try:
            return self.client.keys(pattern)
        except Exception as e:
            self.logger.error(f"Error getting keys with pattern {pattern}: {e}")
            return []
    
    def get_ttl(self, key: str) -> int:
        """Get TTL for a key"""
        if not self.client:
            return -1
            
        try:
            return self.client.ttl(key)
        except Exception as e:
            self.logger.error(f"Error getting TTL for key {key}: {e}")
            return -1
    
    def health_check(self) -> bool:
        """Check Redis connection health"""
        if not self.client:
            return False
            
        try:
            return self.client.ping()
        except Exception as e:
            self.logger.error(f"Redis health check failed: {e}")
            return False

# Global Redis client instance
redis_client = RedisClient()
