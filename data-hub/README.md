# CryptoWealth Data Hub

Een gecentraliseerd data-opslagsysteem voor live market data die door alle CryptoWealth tools wordt hergebruikt.

## 🏗️ Architectuur

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Market Data       │    │   Universal Data    │    │   Website Tools     │
│   Collector         │───▶│   API               │◀───│   (Portfolio,       │
│   (120s interval)   │    │   (Redis Cache)     │    │    Staking, etc.)   │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐
│   InfluxDB          │    │   Redis Cache       │
│   (Time Series)     │    │   (Fast Access)     │
└─────────────────────┘    └─────────────────────┘
```

## 🚀 Quick Start

### 1. Installatie

```bash
# Clone en ga naar data-hub directory
cd data-hub

# Run installatie script
chmod +x install.sh
./install.sh
```

### 2. Services Starten

```bash
# Terminal 1: Start Data Collector
python start_data_collector.py

# Terminal 2: Start API Server
python run.py
```

### 3. Testen

```bash
# Health check
curl http://localhost:5000/api/data/health

# Market prices
curl http://localhost:5000/api/data/market-prices?limit=10

# Staking data
curl http://localhost:5000/api/data/staking-data
```

## 📊 API Endpoints

### Market Data
- `GET /api/data/market-prices` - Alle coin prijzen
- `GET /api/data/coin/<symbol>` - Specifieke coin data
- `GET /api/data/search?q=<query>` - Zoek coins

### Staking Data
- `GET /api/data/staking-data` - Staking opportunities
- `GET /api/data/top-staking` - Top staking by APY

### DeFi Data
- `GET /api/data/defi-data` - DeFi protocols

### System
- `GET /api/data/health` - Health check
- `GET /api/data/market-summary` - Market samenvatting

## 🔧 Configuratie

Edit `.env` file:

```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# API
API_HOST=0.0.0.0
API_PORT=5000

# Data Collection
COLLECTION_INTERVAL=120  # seconds
CACHE_TTL=300           # 5 minutes
```

## 📈 Data Sources

- **CoinGecko**: Top 200 coins, market data
- **StakingRewards**: Staking APY data
- **DeFiLlama**: DeFi protocol data
- **Exchange APIs**: Real-time pricing

## 🛠️ Voor Developers

### Python Integration

```python
from api.universal_data_api import get_market_prices_for_tool, get_staking_data_for_tool

# Haal market prijzen op
prices = get_market_prices_for_tool(limit=100)

# Haal staking data op
staking_data = get_staking_data_for_tool(symbols=['BTC', 'ETH'])
```

### JavaScript Integration

```javascript
// Market prijzen
fetch('/api/data/market-prices?limit=50')
  .then(response => response.json())
  .then(data => console.log(data));

// Staking data
fetch('/api/data/staking-data?symbols=BTC,ETH')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 📊 Performance

- **Data Freshness**: Maximaal 2 minuten oud
- **API Response Time**: < 100ms (Redis cache)
- **Cache Hit Rate**: > 95%
- **Data Sources**: 4+ externe APIs

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:5000/api/data/health
```

### Logs
```bash
# Data collector logs
tail -f logs/market_data_collector.log

# API logs
tail -f logs/data_hub.log
```

### Redis Monitoring
```bash
redis-cli monitor
redis-cli info stats
```

## 🚨 Troubleshooting

### Redis Connection Failed
```bash
# Check Redis status
redis-cli ping

# Start Redis
redis-server
```

### No Data Available
```bash
# Check if collector is running
ps aux | grep market_data_collector

# Check Redis keys
redis-cli keys "*"
```

### API Not Responding
```bash
# Check if API is running
curl http://localhost:5000/api/data/health

# Check logs
tail -f logs/data_hub.log
```

## 🔒 Security

- Rate limiting op alle externe APIs
- Redis authentication (configureer in .env)
- CORS enabled voor web integratie
- Input validation op alle endpoints

## 📋 Roadmap

- [ ] WebSocket support voor real-time updates
- [ ] Grafana dashboards voor monitoring
- [ ] Machine learning voor data kwaliteit
- [ ] API rate limiting en authentication
- [ ] Multi-region deployment support
- [ ] Historical data analysis
- [ ] Price alerts system

## 🤝 Contributing

1. Fork de repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - zie LICENSE file voor details.
