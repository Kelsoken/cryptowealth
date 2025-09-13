#!/usr/bin/env python3
"""
Start the Universal Data API
"""
import sys
import os
from pathlib import Path

# Add the data-hub directory to Python path
data_hub_dir = Path(__file__).parent
sys.path.insert(0, str(data_hub_dir))

from api.universal_data_api import app, Config

def main():
    """Start the Universal Data API"""
    # Create logs directory if it doesn't exist
    os.makedirs('logs', exist_ok=True)
    
    print(f"Starting Universal Data API on {Config.API_HOST}:{Config.API_PORT}")
    print("Available endpoints:")
    print("  GET /api/data/health - Health check")
    print("  GET /api/data/market-prices - Market prices")
    print("  GET /api/data/coin/<symbol> - Specific coin data")
    print("  GET /api/data/staking-data - Staking data")
    print("  GET /api/data/top-staking - Top staking opportunities")
    print("  GET /api/data/defi-data - DeFi protocol data")
    print("  GET /api/data/market-summary - Market summary")
    print("  GET /api/data/search?q=<query> - Search coins")
    
    app.run(
        host=Config.API_HOST,
        port=Config.API_PORT,
        debug=Config.API_DEBUG
    )

if __name__ == "__main__":
    main()
