# ⚡ Electric Vehicle Market Performance & Insights

> **An End-to-End Business Intelligence, Data Analytics, and Interactive Storytelling Platform for the Global EV Industry**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)
![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%206-cyan.svg)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8.svg)
![Python](https://img.shields.io/badge/Backend-Python%20%7C%20Flask-blue.svg)
![Database](https://img.shields.io/badge/Database-SQLite3-amber.svg)
![Visuals](https://img.shields.io/badge/Visualizations-Recharts%20SVG-purple.svg)

---

## 📖 Executive Summary

The **Electric Vehicle (EV) Market Performance & Insights** platform is a comprehensive, production-grade business intelligence and data storytelling system. Built to bridge executive decision-making with granular automotive telemetry, the platform analyzes over **650 vehicle models** across **26 international manufacturers** from **2020 through 2026**.

The system addresses three critical industry scenarios:
1. **Emily Johnson (EV Market Strategy Director)**: Evaluating battery chemistry adoption (LFP, NMC, NCA, Sodium-Ion, Solid-State), range benchmarks across segments, and portfolio optimization.
2. **David Chen (Automotive BI Manager)**: Benchmarking OEM market share, annual sales performance, country-of-origin advantages, and customer ratings.
3. **Dr. Sarah Williams (Sustainable Mobility Research Analyst)**: Quantifying powertrain efficiency ($kWh/100km$), lifetime carbon abatement ($CO_2$ offset in million tons), and public transit fleet electrification.

---

## 🌟 Key Features

### 1. 📊 Executive BI Dashboard
- **Universal KPI Cards**: Real-time sales volume ($M units$), total market revenue, average driving range ($km$ & $miles$), dominant battery technology share, annual carbon offset, and consumer satisfaction index.
- **7 Unique Interactive Visualizations**:
  - *Top Manufacturers by Sales & Market Share* (Bar Chart)
  - *Driving Range vs Price Learning Curve (2020-2026)* (Dual-Axis Area & Spline Line Chart)
  - *Battery Chemistry Benchmark* (LFP, NMC, NCA, Sodium-Ion, Solid-State)
  - *Affordability Quadrant Scatter Matrix* (Price vs Range sweet-spots)
  - *Geographic Manufacturing Footprint* (Asia-Pacific, Europe, North America)
  - *Vehicle Segment Performance Breakdown* (SUV, Sedan, Hatchback, Truck, Bus, Two-Wheeler)
  - *Fast-Charge Rate Telemetry* (10-80% charge time vs capacity)

### 2. 🎭 Tableau-Style Interactive Story Mode (6 Scenes)
Sequential narrative scenes matching Tableau Story Points:
- **Scene 1**: *The Exponential EV Market Explosion (2020-2026)*
- **Scene 2**: *The Battery Chemistry Race: LFP vs NMC vs Solid-State*
- **Scene 3**: *Crushing 'Range Anxiety' & Reaching Price Parity*
- **Scene 4**: *Geopolitical Manufacturing Hubs & Supply Chains*
- **Scene 5**: *Sustainable Mobility & Real-World Carbon Abatement*
- **Scene 6**: *Strategic Recommendations for Automotive OEMs (2027-2030)*
- *Includes collapsible Video Presenter Scripts for recording demonstration walkthroughs!*

### 3. 👤 Persona-Driven Decision Briefings
Dedicated executive portals tailored to **Emily Johnson**, **David Chen**, and **Dr. Sarah Williams** with personalized KPI metrics, custom filtered data, and strategic advisories.

### 4. ⚡ Live SQL Query Engine & Database
- In-browser interactive query console connected to the relational SQLite schema (`ev_market_insights`).
- 5 pre-validated analytical queries including aggregations, multi-table grouping, and advanced **Window Functions (`ROW_NUMBER() OVER PARTITION`)**.
- Execution timing benchmarks in milliseconds with one-click **CSV result exports**.

### 5. 🧪 Performance Testing & Benchmark Suite
Rigorous profiling against all 4 project evaluation criteria:
- **Amount of Data Rendered to DB**: 650 records, 21 fields, 13,650 cells, SQLite indexed B-Tree storage (~134 KB).
- **Utilization of Data Filters**: Multi-attribute filtering with average query latency under $1.5\text{ ms}$ and throughput $>680,000\text{ records/sec}$.
- **Calculated Fields**: 6 mathematically verified calculated fields (Price-to-Range ratio, $kWh/100km$, $CO_2$ abatement, market share %, fast-charge rate, value score).
- **Visualization Profiling**: 7 unique charts rendering at 60 FPS with sub-2ms frame latency.
- *Includes a live 500-iteration stress testing suite.*

### 6. 📁 Dataset Explorer & Two-Way Export
- Interactive data grid with search, multi-column sorting, and pagination.
- Instant exports to **CSV** (for Tableau, Power BI, or Excel) and **JSON**.

---

## 🏗️ Architecture & Technology Stack

```
ev-market-performance-insights/
├── src/                          # Modern React 18 + Vite Frontend (Vercel Ready)
│   ├── components/               # Modular UI Components
│   │   ├── Navbar.jsx            # Top Navigation with Quick Actions
│   │   ├── KPICards.jsx          # Live Executive Metric Cards
│   │   ├── FilterBar.jsx         # Multi-Dimensional Slice & Dice Engine
│   │   ├── ExecutiveDashboard.jsx# 7 Responsive Interactive Recharts Visuals
│   │   ├── StoryMode.jsx         # 6-Scene Tableau-Style Story Engine
│   │   ├── PersonaScenarios.jsx  # Emily Johnson, David Chen & Dr. Sarah Williams
│   │   ├── SQLPlayground.jsx     # In-Browser SQL Analytics & Window Functions
│   │   ├── PerformanceTesting.jsx# 4-Pillar Stress Benchmark Suite
│   │   ├── DataTable.jsx         # Data Grid with Multi-Column Sort & CSV Export
│   │   └── ProjectDocumentation.jsx # Step-by-Step Guide & Video Walkthrough Script
│   ├── data/
│   │   └── ev_data.json          # Formatted JSON Dataset (650 records)
│   ├── utils/
│   │   └── calculations.js       # Calculated Measures & Formula Engine
│   ├── App.jsx                   # Master Application State Orchestrator
│   └── main.jsx                  # React Root Entry Point
├── database/                     # Relational Database Layer
│   ├── ev_market.db              # SQLite Database with 5 Performance B-Tree Indexes
│   └── queries.sql               # Pre-Built Analytical SQL Query Library
├── data/
│   └── ev_market_data.csv        # Raw CSV Dataset for Tableau / Power BI
├── flask_app/                    # Python / Flask Web Companion (Academic Compliance)
│   ├── app.py                    # Flask Server with REST Endpoints
│   ├── requirements.txt          # Python Dependencies
│   └── templates/                # Server-Side Rendered Companion UI
├── public/                       # Static Assets
├── vercel.json                   # Vercel Production Deployment Config
└── package.json                  # Node.js Dependencies & Build Scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (v24 recommended)
- **Python**: 3.9 or higher (optional, for Flask backend)

### 2. Run the Interactive Web Application (Frontend)
```bash
# 1. Install dependencies
npm install

# 2. Start Vite local development server
npm run dev

# 3. Open in browser: http://localhost:3000
```

### 3. Build for Production
```bash
npm run build
# Creates optimized production assets in dist/ directory (100% Vercel compatible)
```

### 4. Run the Python / Flask Companion Backend (Optional)
```bash
# 1. Install Python dependencies
pip install -r flask_app/requirements.txt

# 2. Launch Flask server
python flask_app/app.py

# 3. Access Flask API: http://localhost:5000/api/models
```

---

## ☁️ Deployment Instructions

### Deploy to GitHub
```bash
# Initialize git repository
git init
git add .
git commit -m "feat: complete ev market performance & insights system"
git branch -M main

# Link to your GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/ev-market-insights.git
git push -u origin main
```

### Deploy to Vercel (1-Click Deployment)
1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **"Add New Project"** and import the `ev-market-insights` repository.
3. Vercel automatically detects the **Vite** framework preset.
4. Click **"Deploy"**. Your live analytics dashboard will be hosted globally with free SSL in less than 30 seconds!

---

## 📊 Calculated Fields Formula Reference

| Field Name | Formula | Unit | Analytical Purpose |
| :--- | :--- | :--- | :--- |
| **Price per Range Unit** | $\frac{\text{base\_price\_usd}}{\text{driving\_range\_km}}$ | $\$ / \text{km}$ | Measures affordability relative to range efficiency |
| **Energy Consumption** | $\frac{\text{battery\_capacity\_kwh}}{\text{driving\_range\_km}} \times 100$ | $\text{kWh} / 100\text{km}$ | Evaluates powertrain and aerodynamic efficiency |
| **Annual } \text{CO}_2 \text{ Offset** | $\frac{\text{annual\_sales\_units} \times \text{co2\_factor}}{1000}$ | $\text{k-Tons}$ | Net greenhouse gas emissions displaced vs ICE |
| **Market Share** | $\frac{\text{manufacturer\_sales}}{\text{total\_global\_sales}} \times 100$ | $\%$ | Quantifies OEM industry dominance |
| **Fast Charge Rate** | $\frac{\text{driving\_range\_km} \times 0.70}{\text{fast\_charge\_mins}}$ | $\text{km} / \text{min}$ | Standardized highway recharge convenience index |

---

## 🎥 Demonstration Video Script
See [`DEMO_VIDEO_SCRIPT.md`](./DEMO_VIDEO_SCRIPT.md) for the complete 4-minute scene-by-scene presentation script with exact narration lines, screen recording actions, and timestamp guides.

---

## 📄 License
This project is open-source and distributed under the **MIT License**.

