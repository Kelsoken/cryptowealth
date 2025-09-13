/**
 * Performance Optimization Utilities
 * Implements code splitting, lazy loading, and performance monitoring
 */

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Lazy loading for components
function lazyLoadComponent(componentId, loadFunction) {
    const component = document.getElementById(componentId);
    if (component && !component.dataset.loaded) {
        loadFunction();
        component.dataset.loaded = 'true';
    }
}

// Code splitting for large JavaScript modules
class ModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.moduleCache = new Map();
    }

    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return this.moduleCache.get(moduleName);
        }

        try {
            const module = await import(`./modules/${moduleName}.js`);
            this.loadedModules.add(moduleName);
            this.moduleCache.set(moduleName, module);
            return module;
        } catch (error) {
            console.error(`Failed to load module: ${moduleName}`, error);
            return null;
        }
    }

    preloadModule(moduleName) {
        // Preload module in background
        this.loadModule(moduleName).catch(() => {});
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
    }

    startTimer(name) {
        this.metrics[name] = performance.now();
    }

    endTimer(name) {
        if (this.metrics[name]) {
            const duration = performance.now() - this.metrics[name];
            this.metrics[name] = duration;
            
            // Log slow operations
            if (duration > 100) {
                console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
            }
            
            return duration;
        }
        return 0;
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            // Send to analytics if available
            if (window.gtag) {
                window.gtag('event', 'timing_complete', {
                    name: 'load',
                    value: loadTime
                });
            }
        });
    }

    observeLongTasks() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration}ms`, entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['longtask'] });
            this.observers.push(observer);
        }
    }

    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    lazyLoadImages();
    
    // Initialize performance monitoring
    window.performanceMonitor = new PerformanceMonitor();
    window.performanceMonitor.measurePageLoad();
    window.performanceMonitor.observeLongTasks();
    
    // Initialize module loader
    window.moduleLoader = new ModuleLoader();
    
    // Preload critical modules
    window.moduleLoader.preloadModule('dashboard');
    window.moduleLoader.preloadModule('portfolio');
});

// Export for use in other modules
window.PerformanceUtils = {
    lazyLoadImages,
    lazyLoadComponent,
    debounce,
    throttle,
    ModuleLoader,
    PerformanceMonitor
};
