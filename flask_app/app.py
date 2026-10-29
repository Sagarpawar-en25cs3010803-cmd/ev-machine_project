"""
Flask Companion Application for EV Market Performance & Insights
Demonstrating Python/Flask web integration and SQLite database connectivity
as specified in project requirements.
"""

import os
import sqlite3
import json
from flask import Flask, render_template, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="../dist", template_folder="templates")

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "ev_market.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index():
    # If Vite production dist exists, serve it; otherwise serve Flask companion template
    dist_index = os.path.join(os.path.dirname(__file__), "..", "dist", "index.html")
    if os.path.exists(dist_index):
        return send_from_directory(os.path.join(os.path.dirname(__file__), "..", "dist"), "index.html")
    return render_template("index.html")

@app.route("/<path:path>")
def static_proxy(path):
    dist_dir = os.path.join(os.path.dirname(__file__), "..", "dist")
    if os.path.exists(os.path.join(dist_dir, path)):
        return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, "index.html")

@app.route("/api/health")
def health():
    return jsonify({"status": "healthy", "service": "EV Market Flask API", "version": "1.0.0"})

@app.route("/api/models")
def get_models():
    limit = request.args.get("limit", default=100, type=int)
    category = request.args.get("category", default=None, type=str)
    tech = request.args.get("tech", default=None, type=str)
    
    conn = get_db_connection()
    query = "SELECT * FROM ev_market_insights WHERE 1=1"
    params = []
    
    if category and category != "All":
        query += " AND category = ?"
        params.append(category)
    if tech and tech != "All":
        query += " AND battery_tech = ?"
        params.append(tech)
        
    query += " ORDER BY annual_sales_units DESC LIMIT ?"
    params.append(limit)
    
    rows = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in rows])

@app.route("/api/analytics/market-share")
def get_market_share():
    conn = get_db_connection()
    query = """
    SELECT 
        manufacturer,
        manufacturing_country,
        SUM(annual_sales_units) AS total_sales,
        ROUND(AVG(customer_rating), 2) AS avg_rating,
        ROUND(AVG(base_price_usd), 0) AS avg_price
    FROM ev_market_insights
    GROUP BY manufacturer
    ORDER BY total_sales DESC
    LIMIT 10;
    """
    rows = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route("/api/analytics/battery-benchmark")
def get_battery_benchmark():
    conn = get_db_connection()
    query = """
    SELECT 
        battery_tech,
        COUNT(*) AS model_count,
        ROUND(AVG(driving_range_km), 1) AS avg_range_km,
        ROUND(AVG(fast_charge_mins), 1) AS avg_fast_charge_mins,
        ROUND(AVG(safety_score), 2) AS avg_safety_score
    FROM ev_market_insights
    GROUP BY battery_tech
    ORDER BY avg_range_km DESC;
    """
    rows = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting EV Market Analytics Flask Server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)

