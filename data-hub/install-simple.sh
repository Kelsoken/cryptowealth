#!/bin/bash

echo "🚀 Installing CryptoWealth Simple Data Hub..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements-simple.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p data

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

echo "✅ Installation complete!"
echo ""
echo "To start the services:"
echo "1. Start data collector: python collectors/simple_data_collector.py"
echo "2. Start API server: python api/simple_data_api.py"
echo ""
echo "API will be available at: http://localhost:5000"
