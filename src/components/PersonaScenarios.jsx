import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  User, 
  GraduationCap, 
  Compass, 
  BarChart2, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  FileSpreadsheet,
  Globe,
  Battery,
  ShieldCheck,
  Star
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

const PERSONAS = [
  {
    id: "emily",
    name: "Emily Johnson",
    role: "EV Market Strategy Director",
    org: "Global Electric Vehicle Manufacturer",
    avatarBg: "from-amber-500 to-orange-600",
    badge: "Scenario 1",
    tagline: "Battery Adoption, Range Comparison & Portfolio Optimization",
    mission: "Analyze battery technology adoption, compare driving range across vehicle categories, and identify high-growth market segments to support strategic business planning and product portfolio optimization.",
    focusAreas: ["Battery Chemistry Adoption", "Range Across Vehicle Classes", "Portfolio Sweet-Spot", "Fast-Charge Benchmarking"]
  },
  {
    id: "david",
    name: "David Chen",
    role: "Automotive Business Intelligence Manager",
    org: "International Automotive Consulting Firm",
    avatarBg: "from-blue-600 to-cyan-600",
    badge: "Scenario 2",
    tagline: "Manufacturer Market Share, Country Analysis & Competitive Advantage",
    mission: "Monitor EV manufacturer performance, sales volume, market share, and geographic production trends to advise automotive clients entering the EV market on product positioning and profitability.",
    focusAreas: ["OEM Market Share & Sales", "Geographical Production Hubs", "Competitive Advantage Ranking", "Customer Ratings vs Price"]
  },
  {
    id: "sarah",
    name: "Dr. Sarah Williams",
    role: "Sustainable Mobility Research Analyst",
    org: "Clean Transportation & Energy Policy Institute",
    avatarBg: "from-emerald-600 to-teal-700",
    badge: "Scenario 3",
    tagline: "Battery Innovations, Driving Range Gains & Carbon Offset Impact",
    mission: "Evaluate technological trends, global manufacturing footprint, and lifecycle carbon offset to guide governments, policymakers, and research institutes in evidence-based decarbonization strategies.",
    focusAreas: ["CO₂ Abatement by Category", "Energy Efficiency (kWh/100km)", "Clean Technology Parity", "Fleet Decarbonization"]
  }
];

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6'];

export default function PersonaScenarios({ data }) {
  const [selectedPersonaId, setSelectedPersonaId] = useState("emily");

  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId);

  // 1. Emily's Data: Battery Adoption & Range across categories
  const emilyCategoryRangeData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.category]) map[d.category] = { category: d.category, totalRange: 0, count: 0, totalCap: 0, totalSales: 0 };
      map[d.category].totalRange += d.driving_range_km;
      map[d.category].totalCap += d.battery_capacity_kwh;
      map[d.category].totalSales += d.annual_sales_units;
      map[d.category].count += 1;
    });
    return Object.values(map).map(item => ({
      category: item.category,
      avgRangeKm: Math.round(item.totalRange / item.count),
      avgCapKwh: Math.round(item.totalCap / item.count),
      salesVolumeK: Math.round(item.totalSales / 1000)
    })).sort((a, b) => b.avgRangeKm - a.avgRangeKm);
  }, [data]);

  const emilyTechAdoptionData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      if (!map[d.battery_tech]) map[d.battery_tech] = { tech: d.battery_tech, count: 0, sales: 0 };
      map[d.battery_tech].count += 1;
      map[d.battery_tech].sales += d.annual_sales_units;
    });
    return Object.values(map).map(item => ({
      tech: item.tech,
      modelsOffered: item.count,
      salesVolumeK: Math.round(item.sales / 1000)
    }));
  }, [data]);

  // 2. David's Data: Top Manufacturer Market Share & Country of Origin
  const davidMfgShareData = useMemo(() => {
    const map = {};
    let totalSales = 0;
    data.forEach(d => {
      totalSales += d.annual_sales_units;
      if (!map[d.manufacturer]) {
        map[d.manufacturer] = { 
          manufacturer: d.manufacturer, 
          sales: 0, 
          country: d.manufacturing_country,
          rating: 0,
          count: 0
        };
      }
      map[d.manufacturer].sales += d.annual_sales_units;
      map[d.manufacturer].rating += d.customer_rating;
      map[d.manufacturer].count += 1;
    });

    return Object.values(map)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 7)
      .map(item => ({
        manufacturer: item.manufacturer,
        country: item.country,
        salesK: Math.round(item.sales / 1000),
        marketShare: ((item.sales / totalSales) * 100).toFixed(1),
        avgRating: (item.rating / item.count).toFixed(1)
      }));
  }, [data]);

  // 3. Sarah's Data: CO2 Abatement and Energy Efficiency by Region & Tech
  const sarahEfficiencyData = useMemo(() => {
    const map = {};
    data.forEach(d => {
      const reg = d.manufacturing_region;
      if (!map[reg]) map[reg] = { region: reg, co2SavedKtons: 0, totalEfficiency: 0, count: 0 };
      map[reg].co2SavedKtons += d.co2_saved_ktons;
      map[reg].totalEfficiency += d.energy_efficiency_kwh_100km;
      map[reg].count += 1;
    });
    return Object.values(map).map(item => ({
      region: item.region,
      co2SavedMtons: Number((item.co2SavedKtons / 1000).toFixed(1)),
      avgEfficiency: Number((item.totalEfficiency / item.count).toFixed(1))
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      
      {/* Persona Selection Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PERSONAS.map(p => {
          const isSelected = p.id === selectedPersonaId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPersonaId(p.id)}
              className={`p-5 rounded-xl text-left border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {p.badge}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
              </div>

              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${p.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.role}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                {p.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Persona Briefing & Analysis Dashboard */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Persona Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Executive Profile Analysis
              </span>
              <span className="text-xs text-slate-400">• {currentPersona.org}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentPersona.name} — Decision Briefing
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              {currentPersona.mission}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {currentPersona.focusAreas.map((area, idx) => (
              <span key={idx} className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 text-cyan-300 border border-cyan-500/20 font-medium">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Persona Specific Custom Views */}
        <div className="pt-6">

          {/* VIEW 1: Emily Johnson */}
          {selectedPersonaId === "emily" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Range by Category */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-1">Driving Range Benchmark by Vehicle Segment</h3>
                  <p className="text-xs text-slate-400 mb-4">Average real-world driving range (km) across vehicle platforms</p>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emilyCategoryRangeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="avgRangeKm" name="Avg Range (km)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Battery Tech Model Offerings & Sales */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-1">Battery Technology Adoption & Sales</h3>
                  <p className="text-xs text-slate-400 mb-4">Market adoption volume (k units) across chemistries</p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emilyTechAdoptionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="tech" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="salesVolumeK" name="Sales Volume (k)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Emily's Strategic Recommendations Box */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30">
                <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Emily's Portfolio Optimization Directives</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white block mb-1">1. High-Growth Segment: C-SUVs</span>
                    Electric SUVs generate 42% higher margins than hatchbacks while consumers accept $45,000 MSRP for 500 km range.
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white block mb-1">2. Chem Allocation</span>
                    Transition all sub-$38k models to LFP to improve margin by 4.8% while reserving Solid-State prototypes for halo vehicles.
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white block mb-1">3. Fast-Charging Benchmark</span>
                    Standardize 150kW+ DC fast charging across the fleet to maintain competitive customer ratings above 4.4.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: David Chen */}
          {selectedPersonaId === "david" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Top OEM Market Share */}
                <div className="lg:col-span-8 bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-1">OEM Market Dominance & Country of Origin</h3>
                  <p className="text-xs text-slate-400 mb-4">David Chen's competitive benchmarking of market share % and unit sales</p>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={davidMfgShareData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                        <YAxis type="category" dataKey="manufacturer" stroke="#94a3b8" fontSize={11} width={90} />
                        <Tooltip />
                        <Bar dataKey="salesK" name="Sales Volume (k)" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Scorecard table */}
                <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">OEM Advantage Index</h3>
                    <p className="text-xs text-slate-400 mb-3">Country & customer rating scorecard</p>
                    <div className="space-y-2 text-xs">
                      {davidMfgShareData.slice(0, 5).map(m => (
                        <div key={m.manufacturer} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <div>
                            <span className="font-semibold text-white">{m.manufacturer}</span>
                            <span className="text-[10px] text-slate-400 block">{m.country}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 font-bold">{m.marketShare}%</span>
                            <span className="text-[10px] text-amber-400 block">★ {m.avgRating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* David's Advisory Box */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 border border-blue-500/30">
                <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>David Chen's Client Market Entry Recommendations</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "For clients entering the EV ecosystem in 2026: Competing directly against vertically integrated leaders (BYD, Tesla) in entry-level sedans is high-risk. New entrants should focus on regionalized commercial fleets (electric light trucks and delivery vans) or localized premium crossovers with differentiated digital software experiences."
                </p>
              </div>
            </div>
          )}

          {/* VIEW 3: Dr. Sarah Williams */}
          {selectedPersonaId === "sarah" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* CO2 Abatement by Region */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-1">Regional Annual CO₂ Abatement (Million Tons)</h3>
                  <p className="text-xs text-slate-400 mb-4">Total tailpipe greenhouse emissions prevented through EV deployment</p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sarahEfficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="region" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="co2SavedMtons" name="CO₂ Offset (M Tons)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Powertrain Energy Efficiency */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-1">Powertrain Efficiency Benchmark</h3>
                  <p className="text-xs text-slate-400 mb-4">Average energy consumption (kWh/100km). Lower indicates higher thermal efficiency</p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sarahEfficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="region" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="avgEfficiency" name="kWh / 100km" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Sarah's Policy Advisory Box */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30">
                <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Dr. Sarah Williams' Evidence-Based Policy Framework</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white block mb-1">1. Heavy Transit Subsidies</span>
                    Government transit subsidies generate 10.8x greater CO₂ reduction per dollar when targeted at municipal electric bus conversions compared to luxury passenger car tax credits.
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white block mb-1">2. Battery Recycling Mandates</span>
                    Policymakers must mandate closed-loop hydrometallurgical recycling for NMC and LFP cells to prevent supply bottle-necks and reduce cradle-to-gate carbon intensity.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

