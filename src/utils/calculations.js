/**
 * Calculated Fields and Metrics Utilities for EV Market Analytics
 * Matches project specification for Calculated Measures and Performance Testing
 */

export const CALCULATED_FIELDS_METADATA = [
  {
    name: "Price per Range Unit ($/km)",
    formula: "base_price_usd / driving_range_km",
    description: "Measures consumer affordability relative to range delivered. Lower indicates higher value efficiency.",
    category: "Financial & Value"
  },
  {
    name: "Energy Efficiency (kWh/100km)",
    formula: "(battery_capacity_kwh / driving_range_km) * 100",
    description: "Evaluates powertrain and aerodynamic energy consumption. Lower is superior.",
    category: "Technical Efficiency"
  },
  {
    name: "Annual CO₂ Offset (KiloTons)",
    formula: "(annual_sales_units * co2_factor_per_category) / 1000",
    description: "Net greenhouse gas emissions avoided by displacing internal combustion engine mileage.",
    category: "Environmental Sustainability"
  },
  {
    name: "Market Share Percentage (%)",
    formula: "(manufacturer_sales / total_market_sales) * 100",
    description: "Relative market dominance of automotive manufacturers.",
    category: "Business Intelligence"
  },
  {
    name: "Fast Charge Rate Index (km/min)",
    formula: "(driving_range_km * 0.70) / fast_charge_mins",
    description: "Effective driving range added per minute of DC fast charging (10-80% SoC).",
    category: "Customer Experience"
  },
  {
    name: "Comprehensive Value Score (1-100)",
    formula: "Normalized combination of Customer Rating, Range, Fast Charging & Affordability",
    description: "Holistic scoring metric benchmarked for executive portfolio optimization.",
    category: "Strategic Analytics"
  }
];

export function computeMetrics(data) {
  if (!data || data.length === 0) {
    return {
      totalSales: 0,
      totalRevenue: 0,
      avgRangeKm: 0,
      avgRangeMi: 0,
      avgPrice: 0,
      avgRating: 0,
      totalCO2Offset: 0,
      leadingTech: "N/A",
      leadingTechShare: 0,
      leadingManufacturer: "N/A",
      avgFastChargeMins: 0,
      recordCount: 0
    };
  }

  const recordCount = data.length;
  let totalSales = 0;
  let totalRevenue = 0;
  let totalRangeKm = 0;
  let totalPrice = 0;
  let totalRating = 0;
  let totalCO2 = 0;
  let totalFastCharge = 0;

  const techCounts = {};
  const mfgSales = {};

  data.forEach(item => {
    totalSales += item.annual_sales_units;
    totalRevenue += (item.annual_sales_units * item.base_price_usd);
    totalRangeKm += item.driving_range_km;
    totalPrice += item.base_price_usd;
    totalRating += item.customer_rating;
    totalCO2 += item.co2_saved_ktons;
    totalFastCharge += item.fast_charge_mins;

    techCounts[item.battery_tech] = (techCounts[item.battery_tech] || 0) + item.annual_sales_units;
    mfgSales[item.manufacturer] = (mfgSales[item.manufacturer] || 0) + item.annual_sales_units;
  });

  // Leading battery tech by sales
  let leadingTech = "NMC";
  let maxTechSales = 0;
  Object.entries(techCounts).forEach(([tech, sales]) => {
    if (sales > maxTechSales) {
      maxTechSales = sales;
      leadingTech = tech;
    }
  });

  // Leading manufacturer by sales
  let leadingMfg = "Tesla";
  let maxMfgSales = 0;
  Object.entries(mfgSales).forEach(([mfg, sales]) => {
    if (sales > maxMfgSales) {
      maxMfgSales = sales;
      leadingMfg = mfg;
    }
  });

  return {
    totalSales,
    totalRevenue,
    avgRangeKm: Math.round(totalRangeKm / recordCount),
    avgRangeMi: Math.round((totalRangeKm / recordCount) * 0.621371),
    avgPrice: Math.round(totalPrice / recordCount),
    avgRating: (totalRating / recordCount).toFixed(2),
    totalCO2Offset: Math.round(totalCO2),
    leadingTech,
    leadingTechShare: totalSales > 0 ? ((maxTechSales / totalSales) * 100).toFixed(1) : 0,
    leadingManufacturer: leadingMfg,
    avgFastChargeMins: Math.round(totalFastCharge / recordCount),
    recordCount
  };
}

export function filterDataset(dataset, filters) {
  const startTime = performance.now();
  
  const filtered = dataset.filter(item => {
    if (filters.category && filters.category !== "All" && item.category !== filters.category) {
      return false;
    }
    if (filters.batteryTech && filters.batteryTech !== "All" && item.battery_tech !== filters.batteryTech) {
      return false;
    }
    if (filters.region && filters.region !== "All" && item.manufacturing_region !== filters.region) {
      return false;
    }
    if (filters.year && filters.year !== "All" && item.release_year !== Number(filters.year)) {
      return false;
    }
    if (filters.manufacturer && filters.manufacturer !== "All" && item.manufacturer !== filters.manufacturer) {
      return false;
    }
    if (filters.maxPrice && item.base_price_usd > filters.maxPrice) {
      return false;
    }
    if (filters.minRange && item.driving_range_km < filters.minRange) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = item.model_name.toLowerCase().includes(q);
      const matchMfg = item.manufacturer.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchMfg && !matchCat) return false;
    }
    return true;
  });

  const durationMs = (performance.now() - startTime).toFixed(2);

  return {
    data: filtered,
    metrics: computeMetrics(filtered),
    filterTimeMs: durationMs,
    selectivity: ((filtered.length / dataset.length) * 100).toFixed(1)
  };
}

