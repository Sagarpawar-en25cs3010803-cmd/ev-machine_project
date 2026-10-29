import React from 'react';
import { 
  TrendingUp, 
  BatteryCharging, 
  Gauge, 
  DollarSign, 
  Leaf, 
  Star,
  Award
} from 'lucide-react';

export default function KPICards({ metrics }) {
  const cards = [
    {
      title: "Global Sales Volume",
      value: `${(metrics.totalSales / 1_000_000).toFixed(2)}M`,
      subvalue: `Total Rev: $${(metrics.totalRevenue / 1_000_000_000).toFixed(1)}B USD`,
      icon: TrendingUp,
      accent: "from-emerald-500 to-teal-600",
      pill: "+24.8% YoY",
      description: "Aggregate annual vehicle sales across tracked models"
    },
    {
      title: "Avg Driving Range",
      value: `${metrics.avgRangeKm} km`,
      subvalue: `${metrics.avgRangeMi} miles per full charge`,
      icon: Gauge,
      accent: "from-cyan-500 to-blue-600",
      pill: "+42% vs 2020",
      description: "Average real-world WLTP/EPA standardized range"
    },
    {
      title: "Dominant Battery Tech",
      value: metrics.leadingTech,
      subvalue: `${metrics.leadingTechShare}% of filtered market`,
      icon: BatteryCharging,
      accent: "from-amber-500 to-orange-600",
      pill: "Leading Tech",
      description: "Highest market share battery chemistry"
    },
    {
      title: "Annual CO₂ Abatement",
      value: `${(metrics.totalCO2Offset / 1_000).toFixed(1)}M`,
      subvalue: `Metric Tons CO₂ offset/year`,
      icon: Leaf,
      accent: "from-emerald-600 to-green-700",
      pill: "Clean Energy",
      description: "Displaced tailpipe emissions vs equivalent ICE fleet"
    },
    {
      title: "Avg Base Price",
      value: `$${metrics.avgPrice.toLocaleString()}`,
      subvalue: `$${Math.round(metrics.avgPrice / (metrics.avgRangeKm || 1))} / km range`,
      icon: DollarSign,
      accent: "from-purple-500 to-indigo-600",
      pill: "Price-Parity",
      description: "Average manufacturer suggested retail price"
    },
    {
      title: "Customer Satisfaction",
      value: `${metrics.avgRating} / 5.0`,
      subvalue: `Leader: ${metrics.leadingManufacturer}`,
      icon: Star,
      accent: "from-amber-400 to-yellow-600",
      pill: "Top Tier",
      description: "Aggregated global consumer ratings & reviews"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl bg-slate-900/70 border border-slate-800 p-4 transition-all duration-200 hover:border-slate-700 hover:shadow-lg hover:shadow-black/30 group"
          >
            {/* Top row: Title + Pill */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 truncate pr-2">
                {card.title}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                {card.pill}
              </span>
            </div>

            {/* Main Value */}
            <div className="flex items-baseline space-x-2 my-1">
              <div className="text-2xl font-extrabold text-white tracking-tight">
                {card.value}
              </div>
            </div>

            {/* Subvalue */}
            <div className="text-xs text-slate-400 font-medium truncate mb-2">
              {card.subvalue}
            </div>

            {/* Bottom accent glow bar */}
            <div className={`h-1 w-full rounded-full bg-gradient-to-r ${card.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />
          </div>
        );
      })}
    </div>
  );
}

