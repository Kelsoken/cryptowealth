/**
 * Security Utilities for Safe DOM Manipulation
 * Prevents XSS attacks by providing safe alternatives to innerHTML
 */

// Safe text content setting (prevents XSS)
function safeSetText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        return true;
    }
    return false;
}

// Safe HTML content setting with sanitization
function safeSetHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element && html) {
        // Basic HTML sanitization - remove script tags and dangerous attributes
        const sanitizedHTML = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '');
        
        element.innerHTML = sanitizedHTML;
        return true;
    }
    return false;
}

// Safe content appending
function safeAppendContent(elementId, content, isHTML = false) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isHTML) {
            const sanitizedContent = content
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/vbscript:/gi, '');
            element.innerHTML += sanitizedContent;
        } else {
            element.textContent += content;
        }
        return true;
    }
    return false;
}

// Safe content clearing
function safeClearContent(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
        return true;
    }
    return false;
}

// Safe content replacement
function safeReplaceContent(elementId, newContent, isHTML = false) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isHTML) {
            const sanitizedContent = newContent
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/vbscript:/gi, '');
            element.innerHTML = sanitizedContent;
        } else {
            element.textContent = newContent;
        }
        return true;
    }
    return false;
}

// Input sanitization for user inputs
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .trim();
}

// URL validation
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// CSRF token helper
function getCSRFToken() {
    const tokenElement = document.querySelector('meta[name="csrf-token"]');
    return tokenElement ? tokenElement.getAttribute('content') : '';
}

// Safe AJAX request with CSRF protection
function safeAjaxRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        credentials: 'same-origin'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    if (finalOptions.body && typeof finalOptions.body === 'object') {
        finalOptions.body = JSON.stringify(finalOptions.body);
    }
    
    return fetch(url, finalOptions);
}

// Export functions for use in other modules
window.SecurityUtils = {
    safeSetText,
    safeSetHTML,
    safeAppendContent,
    safeClearContent,
    safeReplaceContent,
    sanitizeInput,
    isValidURL,
    getCSRFToken,
    safeAjaxRequest
};
