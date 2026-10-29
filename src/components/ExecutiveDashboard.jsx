import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ScatterChart, 
  Scatter,
  ZAxis
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Battery, 
  Compass, 
  PieChart as PieIcon, 
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6', '#f97316'];

export default function ExecutiveDashboard({ data, metrics }) {

  // 1. Manufacturer Market Share & Sales (Top 8 + Others)
  const manufacturerData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.manufacturer]) {
        map[d.manufacturer] = { name: d.manufacturer, sales: 0, revenue: 0, models: 0 };
      }
      map[d.manufacturer].sales += d.annual_sales_units;
      map[d.manufacturer].revenue += (d.annual_sales_units * d.base_price_usd);
      map[d.manufacturer].models += 1;
    });

    const sorted = Object.values(map).sort((a, b) => b.sales - a.sales);
    return sorted.slice(0, 8).map(item => ({
      ...item,
      salesInThousands: Math.round(item.sales / 1000),
      marketShare: metrics.totalSales > 0 ? ((item.sales / metrics.totalSales) * 100).toFixed(1) : 0
    }));
  }, [data, metrics.totalSales]);

  // 2. Year-over-Year Technological Evolution (2020 - 2026)
  const yoyData = useMemo(() => {
    const yearMap = {};
    data.forEach(d => {
      const y = d.release_year;
      if (!yearMap[y]) {
        yearMap[y] = { year: y, totalRange: 0, totalPrice: 0, count: 0, sales: 0 };
      }
      yearMap[y].totalRange += d.driving_range_km;
      yearMap[y].totalPrice += d.base_price_usd;
      yearMap[y].sales += d.annual_sales_units;
      yearMap[y].count += 1;
    });

    return Object.values(yearMap).sort((a, b) => a.year - b.year).map(item => ({
      year: item.year,
      avgRangeKm: Math.round(item.totalRange / item.count),
      avgPriceUSD: Math.round(item.totalPrice / item.count),
      salesVolumeK: Math.round(item.sales / 1000),
      pricePerKm: Math.round((item.totalPrice / item.count) / (item.totalRange / item.count))
    }));
  }, [data]);

  // 3. Battery Chemistry Benchmark
  const batteryTechData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.battery_tech]) {
        map[d.battery_tech] = {
          tech: d.battery_tech,
          totalRange: 0,
          totalEfficiency: 0,
          totalFastCharge: 0,
          totalSafety: 0,
          count: 0,
          sales: 0
        };
      }
      map[d.battery_tech].totalRange += d.driving_range_km;
      map[d.battery_tech].totalEfficiency += d.energy_efficiency_kwh_100km;
      map[d.battery_tech].totalFastCharge += d.fast_charge_mins;
      map[d.battery_tech].totalSafety += d.safety_score;
      map[d.battery_tech].sales += d.annual_sales_units;
      map[d.battery_tech].count += 1;
    });

    return Object.values(map).map(item => ({
      tech: item.tech,
      avgRangeKm: Math.round(item.totalRange / item.count),
      avgEfficiency: Number((item.totalEfficiency / item.count).toFixed(1)),
      avgFastChargeMins: Math.round(item.totalFastCharge / item.count),
      safetyScore: Number((item.totalSafety / item.count).toFixed(2)),
      sharePct: metrics.totalSales > 0 ? Number(((item.sales / metrics.totalSales) * 100).toFixed(1)) : 0
    }));
  }, [data, metrics.totalSales]);

  // 4. Regional Production Distribution
  const regionData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      const reg = d.manufacturing_region;
      map[reg] = (map[reg] || 0) + d.annual_sales_units;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      percentage: metrics.totalSales > 0 ? ((value / metrics.totalSales) * 100).toFixed(1) : 0
    }));
  }, [data, metrics.totalSales]);

  // 5. Vehicle Category Breakdown
  const categoryData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.category]) {
        map[d.category] = { category: d.category, sales: 0, avgPrice: 0, count: 0, avgRating: 0 };
      }
      map[d.category].sales += d.annual_sales_units;
      map[d.category].avgPrice += d.base_price_usd;
      map[d.category].avgRating += d.customer_rating;
      map[d.category].count += 1;
    });
    return Object.values(map).map(item => ({
      category: item.category,
      salesInThousands: Math.round(item.sales / 1000),
      avgPrice: Math.round(item.avgPrice / item.count),
      avgRating: Number((item.avgRating / item.count).toFixed(2))
    })).sort((a, b) => b.salesInThousands - a.salesInThousands);
  }, [data]);

  // 6. Range vs Price Scatter Sample (sample 80 points for smooth render)
  const scatterData = useMemo(() => {
    const sample = data.length > 80 ? data.filter((_, idx) => idx % Math.ceil(data.length / 80) === 0) : data;
    return sample.map(d => ({
      name: d.model_name,
      range: d.driving_range_km,
      price: d.base_price_usd,
      sales: d.annual_sales_units,
      tech: d.battery_tech,
      category: d.category
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs backdrop-blur-md">
          <p className="font-semibold text-slate-200 mb-1">{label || payload[0].payload.name || payload[0].payload.tech}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="flex items-center space-x-2 text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="capitalize">{entry.name}:</span>
              <span className="font-bold text-white">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Row 1: Market Share & YoY Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Manufacturer Market Share */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Top Manufacturers by Annual Sales</h3>
                <p className="text-xs text-slate-400">Sales volume in thousands of units & relative market share</p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              OEM Ranking
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={manufacturerData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="salesInThousands" name="Sales (k units)" radius={[4, 4, 0, 0]}>
                  {manufacturerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: YoY Tech Evolution (Range vs Price) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Driving Range vs Price Learning Curve</h3>
                <p className="text-xs text-slate-400">Annual progression towards higher range & lower battery cost</p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              2020-2026 Trend
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yoyData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <defs>
                  <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="avgRangeKm" name="Avg Range (km)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#rangeGradient)" />
                <Line type="monotone" dataKey="pricePerKm" name="Cost per km ($)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Battery Chemistry Benchmark & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 3: Battery Tech Benchmark */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Battery className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Battery Chemistry Benchmark</h3>
                <p className="text-xs text-slate-400">Comparative driving range (km) vs fast-charging time (mins)</p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              LFP / NMC / Solid-State
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batteryTechData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="tech" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="avgRangeKm" name="Avg Range (km)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgFastChargeMins" name="Fast Charge 10-80% (mins)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Regional Distribution (Pie / Donut) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Regional Production</h3>
                <p className="text-xs text-slate-400">Global manufacturing volume</p>
              </div>
            </div>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            {regionData.map((reg, idx) => (
              <div key={reg.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{reg.name}</span>
                </div>
                <span className="font-semibold text-white">{reg.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Scatter Matrix & Category Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 5: Price vs Range Scatter Matrix */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Range vs Price Scatter Matrix</h3>
                <p className="text-xs text-slate-400">Identifying value sweet spots & premium performance thresholds</p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Affordability Matrix
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis 
                  type="number" 
                  dataKey="range" 
                  name="Range" 
                  unit=" km" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                />
                <YAxis 
                  type="number" 
                  dataKey="price" 
                  name="Price" 
                  unit=" $" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg text-xs shadow-xl backdrop-blur-md">
                          <p className="font-bold text-white">{d.name}</p>
                          <p className="text-emerald-400">Range: {d.range} km</p>
                          <p className="text-cyan-400">Price: ${d.price.toLocaleString()}</p>
                          <p className="text-amber-400">Battery: {d.tech} | {d.category}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="EV Models" data={scatterData} fill="#10b981" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Vehicle Category Dynamics */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Vehicle Category Performance</h3>
                <p className="text-xs text-slate-400">Sales volume (k units) and consumer satisfaction per segment</p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Segment Analysis
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="salesInThousands" name="Sales (k units)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

