/**
 * RAG Search Frontend - JavaScript client voor RAG Search Service
 * Implementeert frontend zoekfunctionaliteit met Lunr.js index
 */

class RAGSearchClient {
    constructor() {
        this.searchIndex = null;
        this.contentIndex = {};
        this.isIndexLoaded = false;
        this.searchHistory = [];
        this.maxHistoryItems = 10;
        
        // Initializeer Lunr.js index
        this.initializeSearchIndex();
    }
    
    async initializeSearchIndex() {
        try {
            // Laad Lunr.js als het nog niet geladen is
            if (typeof lunr === 'undefined') {
                await this.loadLunrJS();
            }
            
            // Bouw search index
            this.searchIndex = lunr(function () {
                this.ref('id');
                this.field('title', { boost: 10 });
                this.field('content', { boost: 5 });
                this.field('type', { boost: 3 });
                this.field('tags', { boost: 2 });
            });
            
            // Laad content index
            await this.loadContentIndex();
            
            this.isIndexLoaded = true;
            console.log('RAG Search index initialized successfully');
            
        } catch (error) {
            console.error('Error initializing search index:', error);
        }
    }
    
    async loadLunrJS() {
        return new Promise((resolve, reject) => {
            if (typeof lunr !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lunr@2.3.9/lunr.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async loadContentIndex() {
        try {
            // Simuleer content index (in productie zou dit van de server komen)
            const mockContent = [
                {
                    id: 'staking-overview',
                    title: 'Staking Overview',
                    content: 'Staking is het proces waarbij je cryptocurrency vasthoudt om transacties te valideren en beloningen te verdienen. Op onze website vind je uitgebreide informatie over staking opportunities, educatie en strategieën.',
                    type: 'page',
                    tags: ['staking', 'crypto', 'passive income'],
                    url: '/staking'
                },
                {
                    id: 'arbitrage-guide',
                    title: 'Arbitrage Guide',
                    content: 'Arbitrage is het kopen en verkopen van dezelfde cryptocurrency op verschillende exchanges om winst te maken uit prijsverschillen. Onze platform helpt je bij het vinden van arbitrage kansen.',
                    type: 'page',
                    tags: ['arbitrage', 'trading', 'profit'],
                    url: '/arbitrage'
                },
                {
                    id: 'portfolio-management',
                    title: 'Portfolio Management',
                    content: 'Ons portfolio management systeem helpt je bij het bijhouden van je crypto investeringen, het analyseren van prestaties en het maken van weloverwogen beslissingen.',
                    type: 'page',
                    tags: ['portfolio', 'management', 'tracking'],
                    url: '/dashboard'
                },
                {
                    id: 'exchange-integration',
                    title: 'Exchange Integration',
                    content: 'We ondersteunen integratie met verschillende exchanges zoals Binance, Coinbase, Kraken en Bitvavo. Je kunt je API keys veilig koppelen voor portfolio tracking.',
                    type: 'page',
                    tags: ['exchange', 'api', 'integration'],
                    url: '/exchange-connections'
                },
                {
                    id: 'staking-conservative',
                    title: 'Conservative Staking',
                    content: 'Conservative staking met lage risico en 3-8% APY. Geschikt voor beginners en risico-averse investeerders.',
                    type: 'strategy',
                    tags: ['staking', 'conservative', 'low risk'],
                    url: '/staking-strategies'
                },
                {
                    id: 'staking-balanced',
                    title: 'Balanced Staking',
                    content: 'Balanced staking met medium risico en 8-15% APY. Goede balans tussen risico en rendement.',
                    type: 'strategy',
                    tags: ['staking', 'balanced', 'medium risk'],
                    url: '/staking-strategies'
                },
                {
                    id: 'staking-aggressive',
                    title: 'Aggressive Staking',
                    content: 'Aggressive staking met hoog risico en 15-25% APY. Voor ervaren investeerders die hogere risicos kunnen nemen.',
                    type: 'strategy',
                    tags: ['staking', 'aggressive', 'high risk'],
                    url: '/staking-strategies'
                }
            ];
            
            // Voeg content toe aan index
            mockContent.forEach(item => {
                this.searchIndex.add(item);
                this.contentIndex[item.id] = item;
            });
            
        } catch (error) {
            console.error('Error loading content index:', error);
        }
    }
    
    async searchFrontend(query, maxResults = 5) {
        if (!this.isIndexLoaded) {
            await this.initializeSearchIndex();
        }
        
        try {
            // Zoek in frontend index
            const results = this.searchIndex.search(query);
            
            // Converteer naar bruikbare format
            const searchResults = results.slice(0, maxResults).map(result => {
                const content = this.contentIndex[result.ref];
                return {
                    id: result.ref,
                    title: content.title,
                    content: content.content,
                    type: content.type,
                    url: content.url,
                    score: result.score,
                    tags: content.tags
                };
            });
            
            return searchResults;
            
        } catch (error) {
            console.error('Error in frontend search:', error);
            return [];
        }
    }
    
    async searchRAG(query, options = {}) {
        try {
            const response = await fetch('/api/rag-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    query: query,
                    ...options
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Voeg toe aan search history
            this.addToSearchHistory(query, result);
            
            return result;
            
        } catch (error) {
            console.error('Error in RAG search:', error);
            return {
                success: false,
                error: error.message,
                answer: 'Er is een netwerkfout opgetreden. Probeer het opnieuw.'
            };
        }
    }
    
    addToSearchHistory(query, result) {
        const historyItem = {
            query: query,
            timestamp: new Date().toISOString(),
            success: result.success,
            usedGemini: result.used_gemini,
            internalResults: result.internal_results_count || 0,
            responseTime: result.response_time_ms || 0
        };
        
        this.searchHistory.unshift(historyItem);
        
        // Beperk history size
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        // Sla op in localStorage
        localStorage.setItem('ragSearchHistory', JSON.stringify(this.searchHistory));
    }
    
    getSearchHistory() {
        // Laad uit localStorage als beschikbaar
        const stored = localStorage.getItem('ragSearchHistory');
        if (stored) {
            try {
                this.searchHistory = JSON.parse(stored);
            } catch (error) {
                console.error('Error parsing search history:', error);
            }
        }
        
        return this.searchHistory;
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('ragSearchHistory');
    }
    
    async getAnalytics() {
        try {
            const response = await fetch('/api/rag-search/analytics');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result.analytics;
            
        } catch (error) {
            console.error('Error getting analytics:', error);
            return null;
        }
    }
    
    async getServiceInfo() {
        try {
            const response = await fetch('/api/rag-search/info');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result.service_info;
            
        } catch (error) {
            console.error('Error getting service info:', error);
            return null;
        }
    }
    
    // Utility methods
    formatResponseTime(ms) {
        if (ms < 1000) {
            return `${ms}ms`;
        } else {
            return `${(ms / 1000).toFixed(1)}s`;
        }
    }
    
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString('nl-NL');
    }
    
    highlightSearchTerms(text, query) {
        if (!query || !text) return text;
        
        const terms = query.toLowerCase().split(' ').filter(term => term.length > 2);
        let highlightedText = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }
}

// Global instance
window.ragSearchClient = new RAGSearchClient();

// Export voor gebruik in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RAGSearchClient;
}
