import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Database, 
  Download, 
  Code2, 
  CheckCircle, 
  Clock, 
  Layers,
  FileCode
} from 'lucide-react';

const PREBUILT_QUERIES = [
  {
    id: "q1",
    title: "1. Manufacturer Market Share & Global Sales (David Chen)",
    description: "Aggregates total annual sales volume, computes relative market share %, and computes average customer ratings per manufacturer.",
    sql: `SELECT 
    manufacturer,
    manufacturing_country,
    SUM(annual_sales_units) AS total_sales_units,
    ROUND(SUM(annual_sales_units * 100.0) / (SELECT SUM(annual_sales_units) FROM ev_market_insights), 2) AS market_share_pct,
    ROUND(AVG(customer_rating), 2) AS avg_customer_rating,
    ROUND(AVG(base_price_usd), 0) AS avg_selling_price_usd
FROM ev_market_insights
GROUP BY manufacturer, manufacturing_country
ORDER BY total_sales_units DESC
LIMIT 10;`,
    runner: (data) => {
      const totalAll = data.reduce((acc, d) => acc + d.annual_sales_units, 0);
      const map = {};
      data.forEach(d => {
        const key = `${d.manufacturer}__${d.manufacturing_country}`;
        if (!map[key]) {
          map[key] = {
            manufacturer: d.manufacturer,
            manufacturing_country: d.manufacturing_country,
            total_sales_units: 0,
            rating_sum: 0,
            price_sum: 0,
            count: 0
          };
        }
        map[key].total_sales_units += d.annual_sales_units;
        map[key].rating_sum += d.customer_rating;
        map[key].price_sum += d.base_price_usd;
        map[key].count += 1;
      });

      return Object.values(map)
        .sort((a, b) => b.total_sales_units - a.total_sales_units)
        .slice(0, 10)
        .map(item => ({
          manufacturer: item.manufacturer,
          manufacturing_country: item.manufacturing_country,
          total_sales_units: item.total_sales_units.toLocaleString(),
          market_share_pct: `${((item.total_sales_units / totalAll) * 100).toFixed(2)}%`,
          avg_customer_rating: (item.rating_sum / item.count).toFixed(2),
          avg_selling_price_usd: `$${Math.round(item.price_sum / item.count).toLocaleString()}`
        }));
    }
  },
  {
    id: "q2",
    title: "2. Battery Technology Adoption & Efficiency (Emily Johnson)",
    description: "Evaluates driving range, fast charge duration, price per km, and safety scores across chemistries.",
    sql: `SELECT 
    battery_tech,
    COUNT(*) AS total_models_offered,
    ROUND(AVG(driving_range_km), 1) AS avg_range_km,
    ROUND(AVG(battery_capacity_kwh), 1) AS avg_capacity_kwh,
    ROUND(AVG(price_per_km_range), 2) AS avg_price_per_km,
    ROUND(AVG(fast_charge_mins), 1) AS avg_fast_charge_mins,
    ROUND(AVG(safety_score), 2) AS avg_safety_rating
FROM ev_market_insights
GROUP BY battery_tech
ORDER BY avg_range_km DESC;`,
    runner: (data) => {
      const map = {};
      data.forEach(d => {
        if (!map[d.battery_tech]) {
          map[d.battery_tech] = {
            battery_tech: d.battery_tech,
            count: 0,
            total_range: 0,
            total_cap: 0,
            total_price_km: 0,
            total_fast_charge: 0,
            total_safety: 0
          };
        }
        map[d.battery_tech].count += 1;
        map[d.battery_tech].total_range += d.driving_range_km;
        map[d.battery_tech].total_cap += d.battery_capacity_kwh;
        map[d.battery_tech].total_price_km += d.price_per_km_range;
        map[d.battery_tech].total_fast_charge += d.fast_charge_mins;
        map[d.battery_tech].total_safety += d.safety_score;
      });

      return Object.values(map)
        .sort((a, b) => (b.total_range / b.count) - (a.total_range / a.count))
        .map(i => ({
          battery_tech: i.battery_tech,
          total_models_offered: i.count,
          avg_range_km: `${(i.total_range / i.count).toFixed(1)} km`,
          avg_capacity_kwh: `${(i.total_cap / i.count).toFixed(1)} kWh`,
          avg_price_per_km: `$${(i.total_price_km / i.count).toFixed(2)}`,
          avg_fast_charge_mins: `${(i.total_fast_charge / i.count).toFixed(1)} min`,
          avg_safety_rating: (i.total_safety / i.count).toFixed(2)
        }));
    }
  },
  {
    id: "q3",
    title: "3. Regional Sustainability & Carbon Offset (Dr. Sarah Williams)",
    description: "Computes total displaced emissions (kilo-tons CO2) and average energy consumption by manufacturing region.",
    sql: `SELECT 
    manufacturing_region,
    category,
    SUM(annual_sales_units) AS vehicles_deployed,
    ROUND(SUM(co2_saved_ktons), 2) AS total_co2_offset_ktons,
    ROUND(AVG(energy_efficiency_kwh_100km), 2) AS avg_efficiency_kwh_100km
FROM ev_market_insights
GROUP BY manufacturing_region, category
ORDER BY total_co2_offset_ktons DESC
LIMIT 12;`,
    runner: (data) => {
      const map = {};
      data.forEach(d => {
        const key = `${d.manufacturing_region}__${d.category}`;
        if (!map[key]) {
          map[key] = {
            manufacturing_region: d.manufacturing_region,
            category: d.category,
            vehicles_deployed: 0,
            co2_offset: 0,
            total_eff: 0,
            count: 0
          };
        }
        map[key].vehicles_deployed += d.annual_sales_units;
        map[key].co2_offset += d.co2_saved_ktons;
        map[key].total_eff += d.energy_efficiency_kwh_100km;
        map[key].count += 1;
      });

      return Object.values(map)
        .sort((a, b) => b.co2_offset - a.co2_offset)
        .slice(0, 12)
        .map(i => ({
          manufacturing_region: i.manufacturing_region,
          category: i.category,
          vehicles_deployed: i.vehicles_deployed.toLocaleString(),
          total_co2_offset_ktons: `${Math.round(i.co2_offset).toLocaleString()} k-tons`,
          avg_efficiency_kwh_100km: `${(i.total_eff / i.count).toFixed(2)} kWh`
        }));
    }
  },
  {
    id: "q4",
    title: "4. Category Leaders by Sales Volume (Window Function ROW_NUMBER)",
    description: "Demonstrates advanced SQL window function partitioning by vehicle category to extract top seller per segment.",
    sql: `WITH RankedModels AS (
    SELECT 
        category,
        model_name,
        manufacturer,
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
ORDER BY annual_sales_units DESC;`,
    runner: (data) => {
      const catMap = {};
      data.forEach(d => {
        if (!catMap[d.category] || d.annual_sales_units > catMap[d.category].annual_sales_units) {
          catMap[d.category] = d;
        }
      });
      return Object.values(catMap)
        .sort((a, b) => b.annual_sales_units - a.annual_sales_units)
        .map(d => ({
          category: d.category,
          model_name: d.model_name,
          manufacturer: d.manufacturer,
          annual_sales_units: d.annual_sales_units.toLocaleString(),
          driving_range_km: `${d.driving_range_km} km`,
          base_price_usd: `$${d.base_price_usd.toLocaleString()}`,
          customer_rating: `★ ${d.customer_rating}`
        }));
    }
  },
  {
    id: "q5",
    title: "5. Year-over-Year Technological Evolution (2020 - 2026)",
    description: "Chronological analysis of average range improvements, charging speed gains, and price-per-km declines.",
    sql: `SELECT 
    release_year,
    COUNT(id) AS models_launched,
    ROUND(AVG(driving_range_km), 1) AS avg_range_km,
    ROUND(AVG(base_price_usd), 0) AS avg_price_usd,
    ROUND(AVG(price_per_km_range), 2) AS avg_cost_per_km_usd,
    ROUND(AVG(fast_charge_mins), 1) AS avg_fast_charge_mins
FROM ev_market_insights
GROUP BY release_year
ORDER BY release_year ASC;`,
    runner: (data) => {
      const yearMap = {};
      data.forEach(d => {
        const y = d.release_year;
        if (!yearMap[y]) {
          yearMap[y] = {
            release_year: y,
            count: 0,
            range_sum: 0,
            price_sum: 0,
            cost_km_sum: 0,
            charge_sum: 0
          };
        }
        yearMap[y].count += 1;
        yearMap[y].range_sum += d.driving_range_km;
        yearMap[y].price_sum += d.base_price_usd;
        yearMap[y].cost_km_sum += d.price_per_km_range;
        yearMap[y].charge_sum += d.fast_charge_mins;
      });

      return Object.values(yearMap)
        .sort((a, b) => a.release_year - b.release_year)
        .map(i => ({
          release_year: i.release_year,
          models_launched: i.count,
          avg_range_km: `${(i.range_sum / i.count).toFixed(1)} km`,
          avg_price_usd: `$${Math.round(i.price_sum / i.count).toLocaleString()}`,
          avg_cost_per_km_usd: `$${(i.cost_km_sum / i.count).toFixed(2)}`,
          avg_fast_charge_mins: `${(i.charge_sum / i.count).toFixed(1)} min`
        }));
    }
  }
];

export default function SQLPlayground({ data }) {
  const [selectedQueryId, setSelectedQueryId] = useState("q1");
  const [queryResults, setQueryResults] = useState(() => PREBUILT_QUERIES[0].runner(data));
  const [executionTime, setExecutionTime] = useState(1.42);

  const activeQuery = PREBUILT_QUERIES.find(q => q.id === selectedQueryId) || PREBUILT_QUERIES[0];

  const handleRunQuery = (queryObj) => {
    const t0 = performance.now();
    const res = queryObj.runner(data);
    const t1 = performance.now();
    setQueryResults(res);
    setExecutionTime(Number((t1 - t0).toFixed(2)));
  };

  const handleSelectQuery = (id) => {
    setSelectedQueryId(id);
    const q = PREBUILT_QUERIES.find(item => item.id === id);
    if (q) handleRunQuery(q);
  };

  const handleDownloadResultsCSV = () => {
    if (!queryResults || queryResults.length === 0) return;
    const headers = Object.keys(queryResults[0]);
    const csvRows = [headers.join(',')];
    queryResults.forEach(row => {
      const values = headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`);
      csvRows.push(values.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query_results_${selectedQueryId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                SQL Data Extraction & Analytics Operations
              </h2>
              <p className="text-xs text-slate-400">
                Execute analytical SQL queries against the EV market SQLite database schema
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Table: <strong className="text-emerald-400">ev_market_insights</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Rows: <strong className="text-cyan-400">{data.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Query Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PREBUILT_QUERIES.map(q => {
          const isSelected = q.id === selectedQueryId;
          return (
            <button
              key={q.id}
              onClick={() => handleSelectQuery(q.id)}
              className={`p-3 rounded-xl text-left border text-xs transition-all ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <span className={`font-bold block truncate mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                {q.title}
              </span>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {q.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* SQL Editor & Execution Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SQL Code Window (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-300">SQL Query Statement</span>
            </div>
            <button
              onClick={() => handleRunQuery(activeQuery)}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md shadow-emerald-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Execute SQL</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed flex-1">
            {activeQuery.sql}
          </div>

          <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Dialect: SQLite / ANSI SQL</span>
            <span className="text-emerald-400">Status: Validated</span>
          </div>
        </div>

        {/* Query Output Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Execution Result Set</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {queryResults.length} records
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{executionTime} ms</span>
              </span>
              <button
                onClick={handleDownloadResultsCSV}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[380px] p-2 flex-1">
            {queryResults.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/50">
                    {Object.keys(queryResults[0]).map(key => (
                      <th key={key} className="py-2 px-3 font-semibold capitalize whitespace-nowrap">
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
                  {queryResults.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 text-slate-200 whitespace-nowrap">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No results returned.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

