/**
 * Error Handler and Loading State Manager
 * Provides consistent error handling and loading states across the application
 */

class ErrorHandler {
    constructor() {
        this.errorContainer = null;
        this.loadingOverlay = null;
        this.retryQueue = new Map();
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
        
        this.initialize();
    }
    
    initialize() {
        this.createErrorContainer();
        this.createLoadingOverlay();
        this.setupGlobalErrorHandling();
        
        console.log('🛡️ ErrorHandler initialized');
    }
    
    createErrorContainer() {
        this.errorContainer = document.createElement('div');
        this.errorContainer.id = 'error-container';
        this.errorContainer.className = 'error-container';
        this.errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(this.errorContainer);
    }
    
    createLoadingOverlay() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.id = 'loading-overlay';
        this.loadingOverlay.className = 'loading-overlay';
        this.loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        this.loadingOverlay.innerHTML = `
            <div class="loading-content text-center text-white">
                <div class="spinner-border mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="loading-message">Loading...</div>
            </div>
        `;
        
        document.body.appendChild(this.loadingOverlay);
    }
    
    setupGlobalErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError('Global Error', event.error);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled Promise Rejection', event.reason);
        });
    }
    
    // Show error message
    showError(message, details = null, retryCallback = null) {
        const errorId = Date.now().toString();
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger alert-dismissible fade show mb-2';
        errorElement.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="fas fa-exclamation-triangle me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <strong>Error:</strong> ${message}
                    ${details ? `<br><small class="text-muted">${details}</small>` : ''}
                    ${retryCallback ? `
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-danger" onclick="errorHandler.retry('${errorId}')">
                                <i class="fas fa-redo me-1"></i>Retry
                            </button>
                        </div>
                    ` : ''}
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        this.errorContainer.appendChild(errorElement);
        
        // Store retry callback if provided
        if (retryCallback) {
            this.retryQueue.set(errorId, retryCallback);
        }
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
            this.retryQueue.delete(errorId);
        }, 10000);
        
        console.error('Error displayed:', message, details);
    }
    
    // Show success message
    showSuccess(message, details = null) {
        const successElement = document.createElement('div');
        successElement.className = 'alert alert-success alert-dismissible fade show mb-2';
        successElement.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="fas fa-check-circle me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <strong>Success:</strong> ${message}
                    ${details ? `<br><small class="text-muted">${details}</small>` : ''}
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        this.errorContainer.appendChild(successElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.remove();
            }
        }, 5000);
        
        console.log('Success displayed:', message, details);
    }
    
    // Show warning message
    showWarning(message, details = null) {
        const warningElement = document.createElement('div');
        warningElement.className = 'alert alert-warning alert-dismissible fade show mb-2';
        warningElement.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="fas fa-exclamation-triangle me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <strong>Warning:</strong> ${message}
                    ${details ? `<br><small class="text-muted">${details}</small>` : ''}
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        this.errorContainer.appendChild(warningElement);
        
        // Auto-remove after 7 seconds
        setTimeout(() => {
            if (warningElement.parentNode) {
                warningElement.remove();
            }
        }, 7000);
        
        console.warn('Warning displayed:', message, details);
    }
    
    // Show info message
    showInfo(message, details = null) {
        const infoElement = document.createElement('div');
        infoElement.className = 'alert alert-info alert-dismissible fade show mb-2';
        infoElement.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="fas fa-info-circle me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <strong>Info:</strong> ${message}
                    ${details ? `<br><small class="text-muted">${details}</small>` : ''}
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        this.errorContainer.appendChild(infoElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (infoElement.parentNode) {
                infoElement.remove();
            }
        }, 5000);
        
        console.info('Info displayed:', message, details);
    }
    
    // Show loading overlay
    showLoading(message = 'Loading...') {
        const messageElement = this.loadingOverlay.querySelector('.loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
        this.loadingOverlay.style.display = 'flex';
    }
    
    // Hide loading overlay
    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }
    
    // Handle error with retry logic
    handleError(context, error, retryCallback = null) {
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        const errorDetails = error?.stack ? error.stack.split('\n').slice(0, 3).join('\n') : null;
        
        this.showError(`${context}: ${errorMessage}`, errorDetails, retryCallback);
        
        // Log to console for debugging
        console.error(`[${context}]`, error);
        
        // Send to error tracking service (if available)
        if (window.errorTracking) {
            window.errorTracking.captureException(error, { context });
        }
    }
    
    // Retry failed operation
    async retry(errorId) {
        const retryCallback = this.retryQueue.get(errorId);
        if (retryCallback) {
            try {
                await retryCallback();
                this.showSuccess('Operation retried successfully');
            } catch (error) {
                this.handleError('Retry Failed', error);
            }
        }
        this.retryQueue.delete(errorId);
    }
    
    // Clear all messages
    clearAll() {
        this.errorContainer.innerHTML = '';
        this.retryQueue.clear();
    }
    
    // Wrap async function with error handling
    async withErrorHandling(asyncFn, context, retryCallback = null) {
        try {
            return await asyncFn();
        } catch (error) {
            this.handleError(context, error, retryCallback);
            throw error;
        }
    }
    
    // Wrap fetch with error handling and retry logic
    async fetchWithRetry(url, options = {}, context = 'API Request') {
        let lastError = null;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return await response.json();
                
            } catch (error) {
                lastError = error;
                
                if (attempt < this.maxRetries) {
                    console.warn(`Attempt ${attempt} failed for ${url}, retrying in ${this.retryDelay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                }
            }
        }
        
        this.handleError(context, lastError);
        throw lastError;
    }
    
    // Create loading button state
    createLoadingButton(button, loadingText = 'Loading...') {
        const originalText = button.innerHTML;
        const originalDisabled = button.disabled;
        
        button.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i>${loadingText}`;
        button.disabled = true;
        
        return () => {
            button.innerHTML = originalText;
            button.disabled = originalDisabled;
        };
    }
    
    // Validate API response
    validateResponse(response, expectedFields = []) {
        if (!response) {
            throw new Error('Empty response received');
        }
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        if (expectedFields.length > 0) {
            const missingFields = expectedFields.filter(field => !(field in response));
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
        }
        
        return true;
    }
}

// Create global instance
window.errorHandler = new ErrorHandler();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
