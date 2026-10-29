"""
Electric Vehicle Market Performance & Insights Data Generator
Generates realistic, rich synthetic market dataset matching the project specifications.
Outputs:
- SQLite database: database/ev_market.db
- CSV file: data/ev_market_data.csv
- JSON file for React UI: src/data/ev_data.json and public/ev_data.json
- SQL Analysis script: database/queries.sql
"""

import os
import json
import csv
import sqlite3
import random

random.seed(42)

MANUFACTURERS_DATA = [
    {"name": "Tesla", "country": "USA", "region": "North America", "lead_tech": "NCA", "market_tier": "Premium"},
    {"name": "BYD", "country": "China", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Mass Market"},
    {"name": "Volkswagen", "country": "Germany", "region": "Europe", "lead_tech": "NMC", "market_tier": "Mass Market"},
    {"name": "BMW", "country": "Germany", "region": "Europe", "lead_tech": "NMC", "market_tier": "Luxury"},
    {"name": "Mercedes-Benz", "country": "Germany", "region": "Europe", "lead_tech": "NMC", "market_tier": "Luxury"},
    {"name": "Hyundai", "country": "South Korea", "region": "Asia-Pacific", "lead_tech": "NMC", "market_tier": "Mass Market"},
    {"name": "Kia", "country": "South Korea", "region": "Asia-Pacific", "lead_tech": "NMC", "market_tier": "Mass Market"},
    {"name": "Rivian", "country": "USA", "region": "North America", "lead_tech": "NMC", "market_tier": "Premium"},
    {"name": "Lucid Motors", "country": "USA", "region": "North America", "lead_tech": "NMC", "market_tier": "Luxury"},
    {"name": "NIO", "country": "China", "region": "Asia-Pacific", "lead_tech": "NMC", "market_tier": "Premium"},
    {"name": "XPeng", "country": "China", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Mass Market"},
    {"name": "Geely / Zeekr", "country": "China", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Mass Market"},
    {"name": "Volvo", "country": "Sweden", "region": "Europe", "lead_tech": "NMC", "market_tier": "Luxury"},
    {"name": "Polestar", "country": "Sweden", "region": "Europe", "lead_tech": "NMC", "market_tier": "Premium"},
    {"name": "Tata Motors", "country": "India", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Budget"},
    {"name": "Mahindra", "country": "India", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Budget"},
    {"name": "Audi", "country": "Germany", "region": "Europe", "lead_tech": "NMC", "market_tier": "Luxury"},
    {"name": "Porsche", "country": "Germany", "region": "Europe", "lead_tech": "NMC", "market_tier": "Luxury"},
    {"name": "Ford", "country": "USA", "region": "North America", "lead_tech": "NMC", "market_tier": "Mass Market"},
    {"name": "General Motors", "country": "USA", "region": "North America", "lead_tech": "NMC", "market_tier": "Mass Market"},
    {"name": "Toyota", "country": "Japan", "region": "Asia-Pacific", "lead_tech": "Solid-State", "market_tier": "Mass Market"},
    {"name": "Nissan", "country": "Japan", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Mass Market"},
    {"name": "Proterra", "country": "USA", "region": "North America", "lead_tech": "NMC", "market_tier": "Fleet/Commercial"},
    {"name": "Yutong", "country": "China", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Fleet/Commercial"},
    {"name": "Ola Electric", "country": "India", "region": "Asia-Pacific", "lead_tech": "LFP", "market_tier": "Budget"},
    {"name": "Ather Energy", "country": "India", "region": "Asia-Pacific", "lead_tech": "NMC", "market_tier": "Budget"}
]

CATEGORIES = {
    "SUV": {
        "range_min": 350, "range_max": 650,
        "cap_min": 60, "cap_max": 115,
        "price_min": 38000, "price_max": 95000,
        "efficiency_base": 19.5,
        "weight_prob": 0.35
    },
    "Sedan": {
        "range_min": 400, "range_max": 750,
        "cap_min": 55, "cap_max": 110,
        "price_min": 34000, "price_max": 110000,
        "efficiency_base": 15.8,
        "weight_prob": 0.25
    },
    "Hatchback": {
        "range_min": 250, "range_max": 460,
        "cap_min": 35, "cap_max": 65,
        "price_min": 22000, "price_max": 42000,
        "efficiency_base": 14.2,
        "weight_prob": 0.15
    },
    "Truck": {
        "range_min": 380, "range_max": 620,
        "cap_min": 95, "cap_max": 180,
        "price_min": 55000, "price_max": 115000,
        "efficiency_base": 28.5,
        "weight_prob": 0.08
    },
    "Bus": {
        "range_min": 220, "range_max": 420,
        "cap_min": 180, "cap_max": 380,
        "price_min": 240000, "price_max": 480000,
        "efficiency_base": 88.0,
        "weight_prob": 0.07
    },
    "Two-Wheeler": {
        "range_min": 90, "range_max": 210,
        "cap_min": 2.5, "cap_max": 7.5,
        "price_min": 1400, "price_max": 6500,
        "efficiency_base": 3.8,
        "weight_prob": 0.10
    }
}

BATTERY_TECHS = {
    "LFP": {"name": "Lithium Iron Phosphate (LFP)", "cost_mod": 0.85, "safety_score": 4.9, "deg_rate": "Very Low", "energy_dens": "Medium"},
    "NMC": {"name": "Nickel Manganese Cobalt (NMC)", "cost_mod": 1.10, "safety_score": 4.2, "deg_rate": "Medium", "energy_dens": "High"},
    "NCA": {"name": "Nickel Cobalt Aluminum (NCA)", "cost_mod": 1.18, "safety_score": 4.0, "deg_rate": "Medium-High", "energy_dens": "Very High"},
    "Sodium-Ion": {"name": "Sodium-Ion (Na-Ion)", "cost_mod": 0.65, "safety_score": 4.8, "deg_rate": "Low", "energy_dens": "Moderate"},
    "Solid-State": {"name": "Solid-State Battery", "cost_mod": 1.45, "safety_score": 4.95, "deg_rate": "Extremely Low", "energy_dens": "Ultra High"}
}

MODEL_NAME_PATTERNS = {
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Semi"],
    "BYD": ["Seal", "Atto 3", "Dolphin", "Han EV", "Tang EV", "Song Plus", "eBus K9"],
    "Volkswagen": ["ID.3", "ID.4", "ID.5", "ID.7", "ID. Buzz", "ID.2all Concept"],
    "BMW": ["i4 eDrive40", "iX xDrive50", "i7 xDrive60", "iX3", "i5 eDrive40"],
    "Mercedes-Benz": ["EQE 350+", "EQS 450+", "EQA 250", "EQB 300", "eCitaro Bus"],
    "Hyundai": ["Ioniq 5", "Ioniq 6", "Kona Electric", "Ioniq 7", "Elec City Bus"],
    "Kia": ["EV6 GT", "EV9", "Niro EV", "EV5", "EV3"],
    "Rivian": ["R1T Adventure", "R1S Dual-Motor", "Commercial Van EDV"],
    "Lucid Motors": ["Air Pure", "Air Touring", "Air Grand Touring", "Gravity SUV"],
    "NIO": ["ET7", "ES6", "ET5 Touring", "ES8", "EC7"],
    "XPeng": ["G6 Ultra", "G9 Flagship", "P7i Performance", "X9 MPV"],
    "Geely / Zeekr": ["Zeekr 001", "Zeekr X", "Zeekr 009", "Galaxy E8"],
    "Volvo": ["EX30", "EX90", "C40 Recharge", "XC40 Recharge"],
    "Polestar": ["Polestar 2", "Polestar 3", "Polestar 4", "Polestar 5"],
    "Tata Motors": ["Nexon EV Max", "Punch EV", "Tiago EV", "Curvv EV", "Harrier EV"],
    "Mahindra": ["XUV400 Pro", "BE.05", "XEV 9e", "e-Verito"],
    "Audi": ["Q4 e-tron", "Q8 e-tron", "e-tron GT", "A6 Avant e-tron"],
    "Porsche": ["Taycan 4S", "Taycan Turbo S", "Macan Electric"],
    "Ford": ["Mustang Mach-E", "F-150 Lightning", "E-Transit Van"],
    "General Motors": ["Chevrolet Bolt EUV", "Cadillac LYRIQ", "Hummer EV", "Silverado EV", "Equinox EV"],
    "Toyota": ["bZ4X", "bZ3", "bZ Compact SUV", "Solid-State Prototype"],
    "Nissan": ["Ariya e-4ORCE", "Leaf Gen 2", "Sakura Kei EV"],
    "Proterra": ["ZX5 Electric Bus", "Catalyst E2"],
    "Yutong": ["E12 City Bus", "ICe12 Intercity", "T13 Coach"],
    "Ola Electric": ["S1 Pro Gen 2", "S1 Air", "S1 X", "Diamondhead Cruiser"],
    "Ather Energy": ["450X Gen 3", "450S", "Rizta Family"]
}

def generate_records(num_records=620):
    records = []
    years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
    
    cat_keys = list(CATEGORIES.keys())
    cat_weights = [CATEGORIES[c]["weight_prob"] for c in cat_keys]
    
    for i in range(1, num_records + 1):
        mfg = random.choice(MANUFACTURERS_DATA)
        mfg_name = mfg["name"]
        
        # Determine category based on manufacturer suitability
        if "Bus" in mfg_name or mfg_name in ["Proterra", "Yutong"]:
            cat = "Bus"
        elif mfg_name in ["Ola Electric", "Ather Energy"]:
            cat = "Two-Wheeler"
        elif mfg_name == "Rivian":
            cat = random.choice(["Truck", "SUV"])
        else:
            cat = random.choices(cat_keys, weights=cat_weights, k=1)[0]
            if cat in ["Bus", "Two-Wheeler"]:
                # switch to SUV or Sedan unless generic
                cat = random.choice(["SUV", "Sedan", "Hatchback"])

        year = random.choice(years)
        
        # Technology distribution: Solid-state appears mostly 2024-2026; Sodium-Ion 2023-2026
        tech_choices = ["LFP", "NMC", "NCA"]
        tech_weights = [0.42, 0.43, 0.15]
        if year >= 2023:
            tech_choices.append("Sodium-Ion")
            tech_weights = [0.38, 0.38, 0.12, 0.12]
        if year >= 2024:
            tech_choices.append("Solid-State")
            tech_weights = [0.34, 0.35, 0.11, 0.12, 0.08]
            
        battery_tech = random.choices(tech_choices, weights=tech_weights, k=1)[0]
        
        cfg = CATEGORIES[cat]
        # Technology modifiers on range and capacity
        tech_meta = BATTERY_TECHS[battery_tech]
        
        # Driving range (km)
        base_range = random.uniform(cfg["range_min"], cfg["range_max"])
        # Progression across years (5% improvement per year from 2020)
        year_gain = 1.0 + (year - 2020) * 0.045
        range_tech_boost = 1.25 if battery_tech == "Solid-State" else (0.90 if battery_tech == "Sodium-Ion" else 1.0)
        driving_range_km = round(base_range * year_gain * range_tech_boost, 1)
        driving_range_mi = round(driving_range_km * 0.621371, 1)
        
        # Battery capacity (kWh)
        base_cap = random.uniform(cfg["cap_min"], cfg["cap_max"])
        battery_capacity_kwh = round(base_cap * (1.1 if battery_tech == "NMC" else 1.0), 1)
        
        # Energy efficiency (kWh per 100km)
        energy_efficiency = round((battery_capacity_kwh / driving_range_km) * 100, 2)
        
        # Pricing
        base_price = random.uniform(cfg["price_min"], cfg["price_max"])
        cost_multiplier = tech_meta["cost_mod"]
        if mfg["market_tier"] == "Luxury":
            cost_multiplier *= 1.35
        elif mfg["market_tier"] == "Premium":
            cost_multiplier *= 1.15
        elif mfg["market_tier"] == "Budget":
            cost_multiplier *= 0.75
            
        # Price decrease curve over time due to battery cost parity
        learning_curve = 1.0 - (year - 2020) * 0.03
        price_usd = round(base_price * cost_multiplier * learning_curve, 0)
        
        # Price per km range ($/km)
        price_per_km = round(price_usd / driving_range_km, 2)
        
        # Annual sales units (scaled realistically based on category & year)
        if cat == "Bus":
            sales_units = random.randint(350, 4800)
        elif cat == "Two-Wheeler":
            sales_units = random.randint(12000, 185000)
        elif cat == "Truck":
            sales_units = random.randint(4500, 48000)
        else:
            base_sales = random.randint(15000, 195000)
            if mfg_name in ["Tesla", "BYD"]:
                base_sales = int(base_sales * 2.8)
            # Global EV growth multiplier per year
            sales_units = int(base_sales * (1.0 + (year - 2020) * 0.32))
            
        # Charging time 10-80% (minutes)
        if battery_tech == "Solid-State":
            fast_charge_mins = random.randint(10, 18)
        elif battery_tech == "LFP":
            fast_charge_mins = random.randint(22, 40)
        elif battery_tech == "Sodium-Ion":
            fast_charge_mins = random.randint(15, 25)
        else: # NMC / NCA
            fast_charge_mins = random.randint(18, 35)
            
        # Customer rating (1.0 to 5.0)
        rating_bias = 4.1 + (0.2 if mfg_name in ["Tesla", "Porsche", "Lucid Motors", "BYD"] else 0.0)
        rating = round(min(5.0, max(3.0, random.gauss(rating_bias, 0.35))), 1)
        
        # CO2 saved per vehicle per year (Metric Tons)
        # Average car drives 15,000 km/yr, ICE emits ~120g/km = 1.8 tons CO2/yr for cars, higher for trucks/buses
        cat_co2_factor = {"SUV": 2.4, "Sedan": 1.9, "Hatchback": 1.5, "Truck": 4.2, "Bus": 26.5, "Two-Wheeler": 0.6}
        co2_saved_tons_per_vehicle = cat_co2_factor.get(cat, 2.0)
        total_co2_offset_ktons = round((sales_units * co2_saved_tons_per_vehicle) / 1000.0, 2)
        
        # Model name selection
        avail_names = MODEL_NAME_PATTERNS.get(mfg_name, [f"{mfg_name} EV"])
        name_base = random.choice(avail_names)
        suffix = random.choice(["Standard", "Long Range", "Performance", "Ultra", "Max", "Pro", "Dual Motor", "Plus"])
        full_model_name = f"{mfg_name} {name_base} {suffix}"
        
        record = {
            "id": i,
            "model_name": full_model_name,
            "manufacturer": mfg_name,
            "category": cat,
            "release_year": year,
            "battery_tech": battery_tech,
            "battery_tech_full": tech_meta["name"],
            "battery_capacity_kwh": battery_capacity_kwh,
            "driving_range_km": driving_range_km,
            "driving_range_mi": driving_range_mi,
            "base_price_usd": price_usd,
            "annual_sales_units": sales_units,
            "fast_charge_mins": fast_charge_mins,
            "customer_rating": rating,
            "manufacturing_country": mfg["country"],
            "manufacturing_region": mfg["region"],
            "market_tier": mfg["market_tier"],
            "energy_efficiency_kwh_100km": energy_efficiency,
            "price_per_km_range": price_per_km,
            "co2_saved_ktons": total_co2_offset_ktons,
            "safety_score": tech_meta["safety_score"]
        }
        records.append(record)
        
    return records

def create_sqlite_db(records, db_path="database/ev_market.db"):
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    if os.path.exists(db_path):
        os.remove(db_path)
        
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute("""
    CREATE TABLE ev_market_insights (
        id INTEGER PRIMARY KEY,
        model_name TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        category TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        battery_tech TEXT NOT NULL,
        battery_tech_full TEXT NOT NULL,
        battery_capacity_kwh REAL NOT NULL,
        driving_range_km REAL NOT NULL,
        driving_range_mi REAL NOT NULL,
        base_price_usd REAL NOT NULL,
        annual_sales_units INTEGER NOT NULL,
        fast_charge_mins INTEGER NOT NULL,
        customer_rating REAL NOT NULL,
        manufacturing_country TEXT NOT NULL,
        manufacturing_region TEXT NOT NULL,
        market_tier TEXT NOT NULL,
        energy_efficiency_kwh_100km REAL NOT NULL,
        price_per_km_range REAL NOT NULL,
        co2_saved_ktons REAL NOT NULL,
        safety_score REAL NOT NULL
    );
    """)
    
    # Indexes for high performance analytical queries
    cur.execute("CREATE INDEX idx_mfg ON ev_market_insights(manufacturer);")
    cur.execute("CREATE INDEX idx_year ON ev_market_insights(release_year);")
    cur.execute("CREATE INDEX idx_cat ON ev_market_insights(category);")
    cur.execute("CREATE INDEX idx_tech ON ev_market_insights(battery_tech);")
    cur.execute("CREATE INDEX idx_region ON ev_market_insights(manufacturing_region);")
    
    for r in records:
        cur.execute("""
        INSERT INTO ev_market_insights VALUES (
            :id, :model_name, :manufacturer, :category, :release_year,
            :battery_tech, :battery_tech_full, :battery_capacity_kwh,
            :driving_range_km, :driving_range_mi, :base_price_usd,
            :annual_sales_units, :fast_charge_mins, :customer_rating,
            :manufacturing_country, :manufacturing_region, :market_tier,
            :energy_efficiency_kwh_100km, :price_per_km_range, :co2_saved_ktons, :safety_score
        );
        """, r)
        
    conn.commit()
    conn.close()
    print(f"Successfully generated SQLite database at {db_path} with {len(records)} rows.")

def create_csv(records, csv_path="data/ev_market_data.csv"):
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    if not records:
        return
    keys = records[0].keys()
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(records)
    print(f"Successfully saved CSV dataset to {csv_path}")

def save_json(records, json_paths):
    for jp in json_paths:
        os.makedirs(os.path.dirname(jp), exist_ok=True)
        with open(jp, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)
        print(f"Successfully saved JSON to {jp}")

def generate_sql_queries_file():
    sql_content = """-- ============================================================
-- SQL Analytics Queries for EV Market Performance & Insights
-- Designed for David Chen, Emily Johnson, & Dr. Sarah Williams
-- ============================================================

-- 1. David Chen Query: Manufacturer Market Share & Global Annual Sales
SELECT 
    manufacturer,
    manufacturing_country,
    SUM(annual_sales_units) AS total_sales_units,
    ROUND(SUM(annual_sales_units * 100.0) / (SELECT SUM(annual_sales_units) FROM ev_market_insights), 2) AS market_share_percentage,
    ROUND(AVG(customer_rating), 2) AS avg_customer_rating,
    ROUND(AVG(base_price_usd), 2) AS avg_selling_price
FROM ev_market_insights
GROUP BY manufacturer, manufacturing_country
ORDER BY total_sales_units DESC;

-- 2. Emily Johnson Query: Battery Technology Adoption & Range Efficiency
SELECT 
    battery_tech,
    COUNT(*) AS total_models_offered,
    ROUND(AVG(driving_range_km), 1) AS avg_driving_range_km,
    ROUND(AVG(battery_capacity_kwh), 1) AS avg_capacity_kwh,
    ROUND(AVG(price_per_km_range), 2) AS avg_price_per_km_usd,
    ROUND(AVG(fast_charge_mins), 1) AS avg_fast_charge_mins,
    ROUND(AVG(safety_score), 2) AS avg_safety_rating
FROM ev_market_insights
GROUP BY battery_tech
ORDER BY avg_driving_range_km DESC;

-- 3. Dr. Sarah Williams Query: Sustainability & Carbon Offset by Region & Category
SELECT 
    manufacturing_region,
    category,
    SUM(annual_sales_units) AS vehicles_deployed,
    ROUND(SUM(co2_saved_ktons), 2) AS total_co2_offset_thousand_tons,
    ROUND(AVG(energy_efficiency_kwh_100km), 2) AS avg_efficiency_kwh_per_100km
FROM ev_market_insights
GROUP BY manufacturing_region, category
ORDER BY total_co2_offset_thousand_tons DESC;

-- 4. Executive Window Function: Top Model in Each Vehicle Category by Sales
WITH RankedModels AS (
    SELECT 
        model_name,
        manufacturer,
        category,
        annual_sales_units,
        driving_range_km,
        base_price_usd,
        customer_rating,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY annual_sales_units DESC) as rank_in_cat
    FROM ev_market_insights
)
SELECT 
    category,
    model_name,
    manufacturer,
    annual_sales_units,
    driving_range_km,
    base_price_usd,
    customer_rating
FROM RankedModels
WHERE rank_in_cat = 1
ORDER BY annual_sales_units DESC;

-- 5. Year-over-Year Technological Evolution (2020 - 2026)
SELECT 
    release_year,
    COUNT(id) AS models_launched,
    ROUND(AVG(driving_range_km), 1) AS avg_range_km,
    ROUND(AVG(base_price_usd), 0) AS avg_price_usd,
    ROUND(AVG(price_per_km_range), 2) AS cost_per_km,
    ROUND(AVG(fast_charge_mins), 1) AS avg_fast_charge_mins,
    SUM(annual_sales_units) AS annual_sales_volume
FROM ev_market_insights
GROUP BY release_year
ORDER BY release_year ASC;
"""
    with open("database/queries.sql", "w", encoding="utf-8") as f:
        f.write(sql_content)
    print("Successfully created database/queries.sql")

if __name__ == "__main__":
    records = generate_records(650)
    create_sqlite_db(records)
    create_csv(records)
    save_json(records, ["src/data/ev_data.json", "public/ev_data.json"])
    generate_sql_queries_file()
    print("Data generation complete!")

