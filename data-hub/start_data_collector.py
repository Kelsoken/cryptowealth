#!/usr/bin/env python3
"""
Start the Market Data Collector Service
"""
import sys
import os
import logging
from pathlib import Path

# Add the data-hub directory to Python path
data_hub_dir = Path(__file__).parent
sys.path.insert(0, str(data_hub_dir))

from collectors.market_data_collector import MarketDataCollector

def main():
    """Start the data collector"""
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
    os.makedirs('logs', exist_ok=True)
    
    logger = logging.getLogger(__name__)
    logger.info("Starting Market Data Collector Service...")
    
    try:
        # Start collector
        collector = MarketDataCollector()
        collector.run_collection_loop()
    except KeyboardInterrupt:
        logger.info("Data collector stopped by user")
    except Exception as e:
        logger.error(f"Error starting data collector: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
