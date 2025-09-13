#!/usr/bin/env python3
"""
Crypto Wealth Platform - Vercel Compatible Version
Flask app optimized for serverless deployment
"""

import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Mock data for demo
MOCK_CRYPTO_DATA = [
    {"symbol": "BTC", "name": "Bitcoin", "price": 43250.00, "change": 2.45, "changeType": "positive"},
    {"symbol": "ETH", "name": "Ethereum", "price": 2650.00, "change": 1.23, "changeType": "positive"},
    {"symbol": "BNB", "name": "Binance Coin", "price": 315.00, "change": -0.87, "changeType": "negative"},
    {"symbol": "ADA", "name": "Cardano", "price": 0.485, "change": 3.21, "changeType": "positive"},
    {"symbol": "SOL", "name": "Solana", "price": 98.50, "change": 5.67, "changeType": "positive"},
    {"symbol": "DOT", "name": "Polkadot", "price": 7.25, "change": -1.45, "changeType": "negative"}
]

MOCK_STAKING_DATA = [
    {"coin": "ETH", "apy": 5.2, "amount": 2.5, "rewards": 0.13},
    {"coin": "ADA", "apy": 4.8, "amount": 1000, "rewards": 48.0},
    {"coin": "DOT", "apy": 12.0, "amount": 50, "rewards": 6.0}
]

MOCK_ARBITRAGE_DATA = [
    {"pair": "BTC/USDT", "exchange1": "Binance", "exchange2": "Coinbase", "spread": 0.5, "profit": 216.25},
    {"pair": "ETH/USDT", "exchange1": "Kraken", "exchange2": "Bitvavo", "spread": 0.3, "profit": 7.95}
]

# Routes
@app.route('/')
def home():
    return redirect(url_for('staking'))

@app.route('/staking')
def staking():
    try:
        return render_template('staking.html')
    except Exception as e:
        # Fallback if template not found
        return f"""
        <html>
        <head><title>AI Staking Advisor</title></head>
        <body>
            <h1>AI Staking Advisor</h1>
            <p>Template loading error: {str(e)}</p>
            <p>Please check the templates directory.</p>
        </body>
        </html>
        """, 500

@app.route('/landing')
def landing():
    return """
    <html>
    <head><title>CryptoWealth Landing</title></head>
    <body>
        <h1>Welcome to CryptoWealth</h1>
        <p><a href="/staking">Go to Staking Advisor</a></p>
    </body>
    </html>
    """

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Simple demo login
        if username == 'test' and password == 'test':
            session['user'] = username
            flash('Successfully logged in!', 'success')
            return redirect(url_for('staking'))
        else:
            flash('Invalid credentials', 'error')
    
    return """
    <html>
    <head><title>Login - CryptoWealth</title></head>
    <body>
        <h1>Login</h1>
        <form method="post">
            <input type="text" name="username" placeholder="Username" required><br><br>
            <input type="password" name="password" placeholder="Password" required><br><br>
            <button type="submit">Login</button>
        </form>
        <p><a href="/staking">Go to Staking Advisor</a></p>
    </body>
    </html>
    """

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Simple demo registration
        flash('Account created successfully! Please login.', 'success')
        return redirect(url_for('login'))
    
    return """
    <html>
    <head><title>Register - CryptoWealth</title></head>
    <body>
        <h1>Register</h1>
        <form method="post">
            <input type="text" name="username" placeholder="Username" required><br><br>
            <input type="email" name="email" placeholder="Email" required><br><br>
            <input type="password" name="password" placeholder="Password" required><br><br>
            <button type="submit">Register</button>
        </form>
        <p><a href="/login">Already have an account? Login</a></p>
    </body>
    </html>
    """

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    return f"""
    <html>
    <head><title>Dashboard - CryptoWealth</title></head>
    <body>
        <h1>Dashboard</h1>
        <p>Welcome, {session['user']}!</p>
        <p><a href="/staking">Go to Staking Advisor</a></p>
        <p><a href="/logout">Logout</a></p>
    </body>
    </html>
    """

@app.route('/arbitrage')
def arbitrage():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    return """
    <html>
    <head><title>Arbitrage - CryptoWealth</title></head>
    <body>
        <h1>Arbitrage Opportunities</h1>
        <p>Arbitrage feature coming soon!</p>
        <p><a href="/staking">Go to Staking Advisor</a></p>
    </body>
    </html>
    """

@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('staking'))

# API Routes
@app.route('/api/crypto/prices')
def api_crypto_prices():
    return jsonify({
        "success": True,
        "data": MOCK_CRYPTO_DATA
    })

@app.route('/api/staking/positions')
def api_staking_positions():
    return jsonify({
        "success": True,
        "data": MOCK_STAKING_DATA
    })

@app.route('/api/arbitrage/opportunities')
def api_arbitrage_opportunities():
    return jsonify({
        "success": True,
        "data": MOCK_ARBITRAGE_DATA
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return """
    <html>
    <head><title>404 - Page Not Found</title></head>
    <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p><a href="/staking">Go to Staking Advisor</a></p>
    </body>
    </html>
    """, 404

@app.errorhandler(500)
def internal_error(error):
    return """
    <html>
    <head><title>500 - Internal Server Error</title></head>
    <body>
        <h1>500 - Internal Server Error</h1>
        <p>Something went wrong on our end.</p>
        <p><a href="/staking">Go to Staking Advisor</a></p>
    </body>
    </html>
    """, 500

# Vercel entry point
def handler(request):
    return app(request.environ, start_response)

if __name__ == '__main__':
    app.run(debug=True)
