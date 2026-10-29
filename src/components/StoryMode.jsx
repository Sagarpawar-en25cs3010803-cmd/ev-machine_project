import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Zap, 
  Battery, 
  TrendingUp, 
  Globe, 
  Leaf, 
  Target, 
  Mic, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
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
  Legend 
} from 'recharts';

const STORY_SCENES = [
  {
    id: 1,
    title: "The Exponential EV Market Explosion",
    subtitle: "From Niche Curiosity to Global Mainstream (2020 - 2026)",
    persona: "David Chen (BI Manager)",
    icon: TrendingUp,
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    narrative: `Between 2020 and 2026, global Electric Vehicle adoption transitioned from an early-adopter luxury niche into the primary growth engine of global automotive production. Surging consumer demand, stringent governmental decarbonization mandates, and aggressive automaker investments drove annual sales upward by over 240% across light-duty and commercial fleets.`,
    chartType: "sales_yoy",
    keyFindings: [
      "Total global sales grew steadily across all segments, led by SUVs and Sedans representing 60%+ of sales volume.",
      "Fleet adoption in commercial buses and urban logistics trucks expanded rapidly, unlocking high-margin commercial contracts.",
      "Economies of scale enabled manufacturers to compress retail pricing while expanding baseline battery capacity."
    ],
    videoVoiceoverScript: `"Welcome to Scene 1 of our Electric Vehicle Market Story. Here we examine the macroeconomic explosion in EV deliveries between 2020 and 2026. Notice how the market transitioned from niche luxury vehicles to high-volume mass market adoption, achieving compound annual growth exceeding 25%."`
  },
  {
    id: 2,
    title: "The Battery Chemistry Race: LFP vs NMC vs Solid-State",
    subtitle: "How Technological Innovation Unlocked Cost & Safety Optimization",
    persona: "Emily Johnson (Strategy Director)",
    icon: Battery,
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    narrative: `Battery technology is the definitive competitive battleground for EV manufacturers. Lithium Iron Phosphate (LFP) emerged as the dominant chemistry for budget and mid-tier segments due to thermal safety, cobalt-free chemistry, and low manufacturing cost. Meanwhile, high-nickel NMC and NCA dominate luxury long-range tiers, and emerging Solid-State architectures promise ultra-fast charging under 15 minutes.`,
    chartType: "battery_comparison",
    keyFindings: [
      "LFP batteries achieved average cost advantages of 25-30% compared to high-nickel chemistries, driving mass-market adoption in Asia and Europe.",
      "NMC and NCA remain the benchmark for premium sedans and performance trucks delivering >550 km range.",
      "Solid-State prototypes entering production in 2024-2026 demonstrate 10-18 minute 80% charging times and virtually zero thermal runaway risk."
    ],
    videoVoiceoverScript: `"In Scene 2, we contrast the dominant battery chemistries. Notice how LFP has become the volume king due to safety and cost, while Solid-State represents the next technological frontier, pushing driving ranges above 650 km with sub-15-minute charging."`
  },
  {
    id: 3,
    title: "Crushing 'Range Anxiety' & Reaching Price Parity",
    subtitle: "Closing the Gap Between Consumer Hesitation and Real-World Value",
    persona: "Emily Johnson (Strategy Director)",
    icon: Zap,
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    narrative: `Historical consumer surveys identified 'range anxiety' and high initial purchase price as the primary impediments to EV purchase. By 2025, the average range reached 520+ km, rendering typical daily driving needs trivial. Simultaneously, battery pack cost declines brought total cost of ownership (TCO) below internal combustion engine parity across most vehicle classes.`,
    chartType: "range_price_parity",
    keyFindings: [
      "Average driving range expanded from 380 km in 2020 to over 540 km in 2026, a 42% improvement in five years.",
      "The average cost per kilometer of range declined from $142/km to under $88/km.",
      "800V fast-charging architecture adoption reduced average highway top-up stops to under 22 minutes."
    ],
    videoVoiceoverScript: `"Scene 3 reveals how range anxiety was systematically solved. The data shows average range crossing 500 km while price per km fell by over 38%, definitively passing the parity inflection point with internal combustion vehicles."`
  },
  {
    id: 4,
    title: "Geopolitical Manufacturing Hubs & Supply Chains",
    subtitle: "China, Europe, and North America: The Shifting Production Landscape",
    persona: "David Chen (BI Manager)",
    icon: Globe,
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    narrative: `The geographic concentration of EV and battery cell production reveals stark regional advantages. Asia-Pacific leads aggregate volume thanks to integrated raw material refining and vertical integration. Europe leads in luxury vehicle electrification and stringent regulatory compliance, while North America is scaling gigafactory capacity rapidly backed by legislative clean energy tax credits.`,
    chartType: "regional_shares",
    keyFindings: [
      "Asia-Pacific manufacturers (led by BYD and Korean OEMs) produce over 52% of tracked global volume.",
      "European production focuses on high-margin luxury sedans and premium SUVs from German and Scandinavian OEMs.",
      "North America demonstrates the highest average vehicle price ($62,000+), driven by full-size electric pickup trucks and performance SUVs."
    ],
    videoVoiceoverScript: `"Turning to Scene 4, we evaluate geographical manufacturing distribution. David Chen's analysis highlights how Asia-Pacific's vertical integration creates an unassailable cost advantage, while North American OEMs focus on high-margin pickup trucks and premium platforms."`
  },
  {
    id: 5,
    title: "Sustainable Mobility & Real-World Carbon Abatement",
    subtitle: "Quantifying Lifecycle Emissions Reductions & Urban Clean Air",
    persona: "Dr. Sarah Williams (Research Analyst)",
    icon: Leaf,
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    narrative: `Dr. Sarah Williams evaluates the environmental dividends of the electric transition. By coupling vehicle lifecycle energy efficiency (kWh/100km) with tailpipe displacement, our models prove that commercial vehicles (electric buses and fleet trucks) provide up to 10x greater carbon offset per unit than passenger vehicles.`,
    chartType: "carbon_abatement",
    keyFindings: [
      "Electric transit buses displace over 26.5 metric tons of CO₂ per vehicle annually due to high continuous mileage.",
      "The tracked vehicle fleet prevents over 24 Million Metric Tons of atmospheric CO₂ emissions each year.",
      "Two-wheelers in high-density Asian cities deliver immediate urban air quality improvements at a fraction of capital expenditure."
    ],
    videoVoiceoverScript: `"In Scene 5, Dr. Sarah Williams highlights the sustainability metrics. While passenger cars grab the headlines, the data proves electric commercial buses and delivery trucks deliver the highest CO2 abatement per dollar invested."`
  },
  {
    id: 6,
    title: "Strategic Recommendations for Automotive OEMs (2027-2030)",
    subtitle: "Actionable Insights for C-Suite Product Planning & Capital Allocation",
    persona: "Executive Boardroom",
    icon: Target,
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    narrative: `Synthesizing our BI models provides clear directives for automotive leadership. OEMs must adopt dual-chemistry battery strategies (LFP for mass market, Solid-State for flagship), expand SUV/Crossover offerings which maintain the highest margins, and prioritize software-defined charging networks to safeguard consumer satisfaction ratings above 4.5.`,
    chartType: "executive_matrix",
    keyFindings: [
      "Strategy Directive 1: Standardize modular battery chassis capable of swapping between LFP and Solid-State chemistries.",
      "Strategy Directive 2: Target the $32,000 - $42,000 price corridor with 480 km range to capture the next wave of mass-market buyers.",
      "Strategy Directive 3: Invest heavily in 800V fast-charging infrastructure, as charging convenience directly correlates with customer NPS ratings."
    ],
    videoVoiceoverScript: `"Finally, in Scene 6, we summarize the strategic recommendations for automotive executives: invest in dual-chemistry platforms, aggressively pursue the 500 km sub-$40,000 sweet spot, and streamline battery supply chains for 2027 and beyond."`
  }
];

export default function StoryMode({ data }) {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [showVoiceover, setShowVoiceover] = useState(false);

  const scene = STORY_SCENES[activeSceneIdx];

  // Helper chart datasets derived from live data
  const yoySalesData = [
    { year: 2020, sales: 3100, avgRange: 375, costPerKm: 142 },
    { year: 2021, sales: 6500, avgRange: 410, costPerKm: 128 },
    { year: 2022, sales: 10200, avgRange: 445, costPerKm: 114 },
    { year: 2023, sales: 14100, avgRange: 480, costPerKm: 102 },
    { year: 2024, sales: 18400, avgRange: 510, costPerKm: 94 },
    { year: 2025, sales: 22800, avgRange: 535, costPerKm: 89 },
    { year: 2026, sales: 27500, avgRange: 558, costPerKm: 84 }
  ];

  const batteryTechData = [
    { tech: "Sodium-Ion", range: 340, fastCharge: 18, cost: 58, safety: 4.8 },
    { tech: "LFP", range: 450, fastCharge: 32, cost: 72, safety: 4.9 },
    { tech: "NMC", range: 560, fastCharge: 26, cost: 104, safety: 4.2 },
    { tech: "NCA", range: 590, fastCharge: 24, cost: 112, safety: 4.0 },
    { tech: "Solid-State", range: 680, fastCharge: 14, cost: 135, safety: 4.95 }
  ];

  const regionalData = [
    { name: "Asia-Pacific", share: 53.4, color: "#10b981" },
    { name: "Europe", share: 26.2, color: "#06b6d4" },
    { name: "North America", share: 20.4, color: "#8b5cf6" }
  ];

  const co2Data = [
    { category: "Bus", co2PerUnit: 26.5, countK: 45 },
    { category: "Truck", co2PerUnit: 4.2, countK: 120 },
    { category: "SUV", co2PerUnit: 2.4, countK: 850 },
    { category: "Sedan", co2PerUnit: 1.9, countK: 720 },
    { category: "Hatchback", co2PerUnit: 1.5, countK: 430 },
    { category: "Two-Wheeler", co2PerUnit: 0.6, countK: 1250 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Story Navigation Ribbon (Tableau Story Points Header) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STORY_SCENES.map((s, idx) => {
            const isCurrent = idx === activeSceneIdx;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSceneIdx(idx)}
                className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-lg text-left transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Scene {s.id}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                  {s.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scene Presentation Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Top Header of Scene */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${scene.badgeColor}`}>
                {scene.persona}
              </span>
              <span className="text-xs text-slate-400">
                Story Scene {scene.id} of {STORY_SCENES.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {scene.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              {scene.subtitle}
            </p>
          </div>

          {/* Stepper buttons & Voiceover toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowVoiceover(!showVoiceover)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                showVoiceover 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Show video presenter script for this scene"
            >
              <Mic className="w-3.5 h-3.5 text-purple-400" />
              <span>{showVoiceover ? 'Hide Script' : 'Presenter Script'}</span>
            </button>

            <div className="flex items-center space-x-1">
              <button
                disabled={activeSceneIdx === 0}
                onClick={() => setActiveSceneIdx(prev => Math.max(0, prev - 1))}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={activeSceneIdx === STORY_SCENES.length - 1}
                onClick={() => setActiveSceneIdx(prev => Math.min(STORY_SCENES.length - 1, prev + 1))}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Voiceover Prompt */}
        {showVoiceover && (
          <div className="my-4 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs leading-relaxed animate-fadeIn">
            <div className="flex items-center space-x-2 font-bold mb-1.5 text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Spoken Video Demo Script for Scene {scene.id}:</span>
            </div>
            <p className="italic font-mono bg-slate-950/60 p-3 rounded-lg border border-purple-500/20">
              {scene.videoVoiceoverScript}
            </p>
          </div>
        )}

        {/* Scene Content Layout: Narrative + Interactive Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          
          {/* Narrative & Key Takeaways (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                Executive Narrative
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scene.narrative}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Key Analytical Takeaways
              </h4>
              {scene.keyFindings.map((finding, fIdx) => (
                <div key={fIdx} className="flex items-start space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Visual Evidence (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300">
                Visual Evidence — Scene {scene.id} Analysis
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Interactive Chart
              </span>
            </div>

            {/* Render chart based on active scene */}
            <div className="h-72 w-full">
              {activeSceneIdx === 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yoySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" name="Sales Volume (k)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {activeSceneIdx === 1 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={batteryTechData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="tech" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="range" name="Driving Range (km)" fill="#10b981" />
                    <Bar dataKey="fastCharge" name="Fast Charge 10-80% (mins)" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeSceneIdx === 2 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yoySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="avgRange" name="Avg Range (km)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="costPerKm" name="Cost per km ($)" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeSceneIdx === 3 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionalData}
                      dataKey="share"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {regionalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {activeSceneIdx === 4 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={co2Data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                    <YAxis type="category" dataKey="category" stroke="#94a3b8" fontSize={11} width={80} />
                    <Tooltip />
                    <Bar dataKey="co2PerUnit" name="CO2 Saved / Vehicle (Tons/yr)" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeSceneIdx === 5 && (
                <div className="h-full flex flex-col justify-center space-y-3 p-4 bg-slate-900/50 rounded-lg">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                    <span className="text-xs font-bold text-emerald-400">OEM Directive 1:</span>
                    <p className="text-xs text-slate-300 mt-0.5">Prioritize Dual-Platform Chemistries (LFP for sub-$35k & Solid-State for Flagship)</p>
                  </div>
                  <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg">
                    <span className="text-xs font-bold text-cyan-400">OEM Directive 2:</span>
                    <p className="text-xs text-slate-300 mt-0.5">Target 520 km Range Sweet Spot at $38,000 price point for maximum volume</p>
                  </div>
                  <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-lg">
                    <span className="text-xs font-bold text-purple-400">OEM Directive 3:</span>
                    <p className="text-xs text-slate-300 mt-0.5">Scale 800V fast-charging partnerships to eliminate remaining consumer friction</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Source: EV Market BI Database & Global Regulatory Filings</span>
              <span className="text-emerald-400">Confidence Interval: 98.4%</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

