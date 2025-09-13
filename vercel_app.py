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
    return render_template('staking.html')

@app.route('/landing')
def landing():
    return render_template('landing.html')

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
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Simple demo registration
        flash('Account created successfully! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    return render_template('dashboard.html', 
                         user=session['user'],
                         crypto_data=MOCK_CRYPTO_DATA)

@app.route('/arbitrage')
def arbitrage():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    return render_template('arbitrage.html', 
                         user=session['user'],
                         arbitrage_data=MOCK_ARBITRAGE_DATA)

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
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

# Vercel entry point
def handler(request):
    return app(request.environ, start_response)

if __name__ == '__main__':
    app.run(debug=True)
