#!/bin/bash

echo "🚀 Installing CryptoWealth Data Hub..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "�� Creating directories..."
mkdir -p logs
mkdir -p data

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

# Check Redis
echo "🔍 Checking Redis..."
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis not found. Please install Redis:"
    echo "  macOS: brew install redis"
    echo "  Ubuntu: sudo apt-get install redis-server"
    echo "  Docker: docker run -d -p 6379:6379 redis:alpine"
    exit 1
fi

# Start Redis if not running
if ! redis-cli ping &> /dev/null; then
    echo "🔄 Starting Redis..."
    redis-server --daemonize yes
fi

echo "✅ Installation complete!"
echo ""
echo "To start the services:"
echo "1. Start data collector: python start_data_collector.py"
echo "2. Start API server: python run.py"
echo ""
echo "API will be available at: http://localhost:5000"
