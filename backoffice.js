/**
 * Backoffice Manager for Crypto Staking Comparison App
 * Handles settings, API configuration, and administrative functions
 */

class BackofficeManager {
    constructor() {
        this.settings = this.loadSettings();
        this.rateLimitStatus = {};
        this.apiTestResults = {};
        
        this.initializeEventListeners();
        this.loadSettingsToUI();
        this.updateRateLimitDisplay();
        this.startRateLimitMonitoring();
    }

    /**
     * Initialize event listeners for backoffice functionality
     */
    initializeEventListeners() {
        // API provider toggles
        document.getElementById('enableCoinGecko')?.addEventListener('change', (e) => {
            this.updateAPIProvider('coinGecko', e.target.checked);
        });

        document.getElementById('enableCoinMarketCap')?.addEventListener('change', (e) => {
            this.updateAPIProvider('coinMarketCap', e.target.checked);
        });

        document.getElementById('enableStakingRewards')?.addEventListener('change', (e) => {
            this.updateAPIProvider('stakingRewards', e.target.checked);
        });

        document.getElementById('enableDeFiLlama')?.addEventListener('change', (e) => {
            this.updateAPIProvider('defiLlama', e.target.checked);
        });

        // API key inputs
        document.getElementById('coinGeckoKey')?.addEventListener('input', (e) => {
            this.updateAPIKey('coinGecko', e.target.value);
        });

        document.getElementById('coinMarketCapKey')?.addEventListener('input', (e) => {
            this.updateAPIKey('coinMarketCap', e.target.value);
        });

        document.getElementById('stakingRewardsKey')?.addEventListener('input', (e) => {
            this.updateAPIKey('stakingRewards', e.target.value);
        });

        document.getElementById('deFiLlamaKey')?.addEventListener('input', (e) => {
            this.updateAPIKey('defiLlama', e.target.value);
        });

        // Rate limit settings
        document.getElementById('requestLimit')?.addEventListener('input', (e) => {
            this.updateRateLimitSettings('requests', parseInt(e.target.value));
        });

        document.getElementById('intervalSeconds')?.addEventListener('input', (e) => {
            this.updateRateLimitSettings('interval', parseInt(e.target.value) * 1000);
        });

        // Action buttons
        document.getElementById('saveSettings')?.addEventListener('click', () => {
            this.saveAllSettings();
        });

        document.getElementById('clearCache')?.addEventListener('click', () => {
            this.clearCache();
        });

        document.getElementById('testApis')?.addEventListener('click', () => {
            this.testAPIConnections();
        });

        document.getElementById('resetSettings')?.addEventListener('click', () => {
            this.resetToDefaults();
        });
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
            return true;
        } catch (error) {
            console.warn('Failed to save settings:', error);
            return false;
        }
    }

    /**
     * Load settings into UI elements
     */
    loadSettingsToUI() {
        // API provider toggles
        document.getElementById('enableCoinGecko').checked = this.settings.apiKeys.coinGecko !== null;
        document.getElementById('enableCoinMarketCap').checked = this.settings.apiKeys.coinMarketCap !== null;
        document.getElementById('enableStakingRewards').checked = this.settings.apiKeys.stakingRewards !== null;
        document.getElementById('enableDeFiLlama').checked = this.settings.apiKeys.defiLlama !== null;

        // API keys
        document.getElementById('coinGeckoKey').value = this.settings.apiKeys.coinGecko || '';
        document.getElementById('coinMarketCapKey').value = this.settings.apiKeys.coinMarketCap || '';
        document.getElementById('stakingRewardsKey').value = this.settings.apiKeys.stakingRewards || '';
        document.getElementById('deFiLlamaKey').value = this.settings.apiKeys.defiLlama || '';

        // Rate limit settings
        document.getElementById('requestLimit').value = this.settings.rateLimits.requests;
        document.getElementById('intervalSeconds').value = this.settings.rateLimits.interval / 1000;

        // Update API status badges
        this.updateAPIStatusBadges();
    }

    /**
     * Update API provider setting
     */
    updateAPIProvider(provider, enabled) {
        if (!enabled) {
            this.settings.apiKeys[provider] = null;
        } else if (!this.settings.apiKeys[provider]) {
            // Set default key if available
            if (provider === 'coinMarketCap') {
                this.settings.apiKeys[provider] = 'demo_key';
            } else {
                this.settings.apiKeys[provider] = '';
            }
        }

        this.updateAPIStatusBadges();
        this.updateAPIKeyInputs();
    }

    /**
     * Update API key setting
     */
    updateAPIKey(provider, key) {
        this.settings.apiKeys[provider] = key || null;
        this.updateAPIStatusBadges();
    }

    /**
     * Update rate limit settings
     */
    updateRateLimitSettings(setting, value) {
        this.settings.rateLimits[setting] = value;
        
        // Update API manager if available
        if (window.apiManager) {
            apiManager.updateSettings(this.settings);
        }
    }

    /**
     * Update API status badges
     */
    updateAPIStatusBadges() {
        const badges = document.querySelectorAll('.api-status');
        
        badges.forEach(badge => {
            const parent = badge.closest('.form-check');
            if (!parent) return;

            const input = parent.querySelector('input[type="checkbox"]');
            if (!input) return;

            const provider = this.getProviderFromInputId(input.id);
            const hasKey = this.settings.apiKeys[provider] && this.settings.apiKeys[provider] !== '';
            const isEnabled = input.checked;

            if (isEnabled && hasKey) {
                badge.className = 'badge bg-success api-status';
                badge.textContent = 'Actief';
            } else if (isEnabled && !hasKey && !CONFIG.APIs[provider]?.requiresKey) {
                badge.className = 'badge bg-success api-status';
                badge.textContent = 'Actief';
            } else if (isEnabled && !hasKey && CONFIG.APIs[provider]?.requiresKey) {
                badge.className = 'badge bg-warning api-status';
                badge.textContent = 'Key vereist';
            } else {
                badge.className = 'badge bg-secondary api-status';
                badge.textContent = 'Inactief';
            }
        });
    }

    /**
     * Get provider name from input ID
     */
    getProviderFromInputId(inputId) {
        const mapping = {
            'enableCoinGecko': 'coinGecko',
            'enableCoinMarketCap': 'coinMarketCap',
            'enableStakingRewards': 'stakingRewards',
            'enableDeFiLlama': 'defiLlama'
        };
        return mapping[inputId] || '';
    }

    /**
     * Update API key input visibility and state
     */
    updateAPIKeyInputs() {
        const inputs = [
            { id: 'coinGeckoKey', provider: 'coinGecko' },
            { id: 'coinMarketCapKey', provider: 'coinMarketCap' },
            { id: 'stakingRewardsKey', provider: 'stakingRewards' },
            { id: 'deFiLlamaKey', provider: 'defiLlama' }
        ];

        inputs.forEach(({ id, provider }) => {
            const input = document.getElementById(id);
            const checkbox = document.getElementById(`enable${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
            
            if (input && checkbox) {
                input.disabled = !checkbox.checked;
                input.required = checkbox.checked && CONFIG.APIs[provider]?.requiresKey;
            }
        });
    }

    /**
     * Start monitoring rate limits
     */
    startRateLimitMonitoring() {
        setInterval(() => {
            this.updateRateLimitDisplay();
        }, 1000);
    }

    /**
     * Update rate limit display
     */
    updateRateLimitDisplay() {
        if (!window.apiManager) return;

        const rateLimitStatus = apiManager.getRateLimitStatus();
        this.rateLimitStatus = rateLimitStatus;

        // Update rate limit progress bar
        const progressBar = document.getElementById('rateLimitProgress');
        const statusText = document.querySelector('.form-text');
        
        if (progressBar && statusText) {
            // Calculate overall rate limit usage
            let totalRequests = 0;
            let totalMaxRequests = 0;
            
            Object.values(rateLimitStatus).forEach(status => {
                totalRequests += status.requests;
                totalMaxRequests += status.maxRequests;
            });

            const usagePercentage = totalMaxRequests > 0 ? (totalRequests / totalMaxRequests) * 100 : 0;
            
            progressBar.style.width = `${usagePercentage}%`;
            statusText.textContent = `Huidig verbruik: ${totalRequests}/${totalMaxRequests} requests`;
            
            // Update progress bar color based on usage
            if (usagePercentage > 80) {
                progressBar.style.background = 'var(--gradient-warning)';
            } else if (usagePercentage > 60) {
                progressBar.style.background = 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)';
            } else {
                progressBar.style.background = 'var(--gradient-success)';
            }
        }
    }

    /**
     * Test API connections
     */
    async testAPIConnections() {
        const testButton = document.getElementById('testApis');
        if (!testButton) return;

        // Disable button and show loading
        testButton.disabled = true;
        testButton.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Testen...';

        try {
            const results = await apiManager.testAPIConnections();
            this.apiTestResults = results;
            this.displayAPITestResults(results);
        } catch (error) {
            console.error('API test failed:', error);
            this.showNotification('API test mislukt: ' + error.message, 'danger');
        } finally {
            // Re-enable button
            testButton.disabled = false;
            testButton.innerHTML = '<i class="fas fa-vial me-1"></i> Test API Verbindingen';
        }
    }

    /**
     * Display API test results
     */
    displayAPITestResults(results) {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'mt-3';
        resultsContainer.innerHTML = '<h6>Test Resultaten:</h6>';

        Object.entries(results).forEach(([api, result]) => {
            const badgeClass = result.status === 'success' ? 'bg-success' : 
                              result.status === 'warning' ? 'bg-warning' : 'bg-danger';
            
            resultsContainer.innerHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${this.getAPIDisplayName(api)}:</span>
                    <span class="badge ${badgeClass}">${result.message}</span>
                </div>
            `;
        });

        // Remove existing results
        const existingResults = document.querySelector('.api-test-results');
        if (existingResults) {
            existingResults.remove();
        }

        resultsContainer.className += ' api-test-results';
        document.getElementById('testApis').parentNode.appendChild(resultsContainer);
    }

    /**
     * Get display name for API
     */
    getAPIDisplayName(api) {
        const names = {
            coinGecko: 'CoinGecko',
            coinMarketCap: 'CoinMarketCap',
            stakingRewards: 'StakingRewards',
            defiLlama: 'DeFiLlama'
        };
        return names[api] || api;
    }

    /**
     * Clear cache
     */
    clearCache() {
        if (window.apiManager) {
            apiManager.clearCache();
        }
        
        // Clear localStorage cache
        localStorage.removeItem(STORAGE_KEYS.CACHE);
        
        this.showNotification('Cache succesvol geleegd', 'success');
    }

    /**
     * Reset settings to defaults
     */
    resetToDefaults() {
        if (confirm('Weet je zeker dat je alle instellingen wilt resetten naar de standaardwaarden?')) {
            this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
            this.saveSettings();
            this.loadSettingsToUI();
            
            // Update API manager
            if (window.apiManager) {
                apiManager.updateSettings(this.settings);
            }
            
            this.showNotification('Instellingen gereset naar standaardwaarden', 'info');
        }
    }

    /**
     * Save all settings
     */
    saveAllSettings() {
        const success = this.saveSettings();
        
        if (success) {
            // Update API manager
            if (window.apiManager) {
                apiManager.updateSettings(this.settings);
            }
            
            this.showNotification('Instellingen succesvol opgeslagen', 'success');
        } else {
            this.showNotification('Fout bij opslaan van instellingen', 'danger');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    /**
     * Export settings
     */
    exportSettings() {
        const settingsData = {
            settings: this.settings,
            rateLimitStatus: this.rateLimitStatus,
            apiTestResults: this.apiTestResults,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crypto-staking-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Instellingen geëxporteerd', 'success');
    }

    /**
     * Import settings
     */
    importSettings(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.settings) {
                    this.settings = data.settings;
                    this.saveSettings();
                    this.loadSettingsToUI();
                    
                    // Update API manager
                    if (window.apiManager) {
                        apiManager.updateSettings(this.settings);
                    }
                    
                    this.showNotification('Instellingen geïmporteerd', 'success');
                } else {
                    throw new Error('Ongeldig instellingenbestand');
                }
            } catch (error) {
                this.showNotification('Fout bij importeren: ' + error.message, 'danger');
            }
        };
        
        reader.readAsText(file);
    }

    /**
     * Get current settings
     */
    getSettings() {
        return this.settings;
    }

    /**
     * Get rate limit status
     */
    getRateLimitStatus() {
        return this.rateLimitStatus;
    }

    /**
     * Get API test results
     */
    getAPITestResults() {
        return this.apiTestResults;
    }
}

// Initialize Backoffice Manager
const backofficeManager = new BackofficeManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackofficeManager;
} else {
    window.backofficeManager = backofficeManager;
}
