/**
 * ev-data.js
 * Central data store using localStorage for community-submitted EV data.
 * Pre-loaded with a seed of 30 diverse records on first load.
 */

const EV_STORAGE_KEY = 'ev_market_insights_data';

const SEED_DATA = [
  { id:1, model_name:"Tesla Model Y Long Range", manufacturer:"Tesla", category:"SUV", release_year:2024, battery_tech:"NCA", battery_capacity_kwh:82, driving_range_km:533, base_price_usd:54990, annual_sales_units:650000, fast_charge_mins:22, customer_rating:4.8, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Premium", energy_efficiency_kwh_100km:15.4, price_per_km_range:103.2, co2_saved_ktons:1265, safety_score:4.0 },
  { id:2, model_name:"BYD Seal Ultra Performance", manufacturer:"BYD", category:"Sedan", release_year:2024, battery_tech:"LFP", battery_capacity_kwh:82.56, driving_range_km:700, base_price_usd:38000, annual_sales_units:420000, fast_charge_mins:30, customer_rating:4.6, manufacturing_country:"China", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:11.8, price_per_km_range:54.3, co2_saved_ktons:798, safety_score:4.9 },
  { id:3, model_name:"BMW iX xDrive50 Long Range", manufacturer:"BMW", category:"SUV", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:111.5, driving_range_km:630, base_price_usd:87100, annual_sales_units:72000, fast_charge_mins:35, customer_rating:4.5, manufacturing_country:"Germany", manufacturing_region:"Europe", market_tier:"Luxury", energy_efficiency_kwh_100km:17.7, price_per_km_range:138.2, co2_saved_ktons:172.8, safety_score:4.2 },
  { id:4, model_name:"Hyundai Ioniq 6 Performance", manufacturer:"Hyundai", category:"Sedan", release_year:2024, battery_tech:"NMC", battery_capacity_kwh:77.4, driving_range_km:614, base_price_usd:44500, annual_sales_units:105000, fast_charge_mins:18, customer_rating:4.7, manufacturing_country:"South Korea", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:12.6, price_per_km_range:72.5, co2_saved_ktons:199.5, safety_score:4.2 },
  { id:5, model_name:"Lucid Air Grand Touring", manufacturer:"Lucid Motors", category:"Sedan", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:118, driving_range_km:837, base_price_usd:138000, annual_sales_units:8200, fast_charge_mins:22, customer_rating:4.9, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Luxury", energy_efficiency_kwh_100km:14.1, price_per_km_range:164.9, co2_saved_ktons:15.6, safety_score:4.2 },
  { id:6, model_name:"Rivian R1T Adventure Dual Motor", manufacturer:"Rivian", category:"Truck", release_year:2024, battery_tech:"NMC", battery_capacity_kwh:135, driving_range_km:505, base_price_usd:74800, annual_sales_units:52000, fast_charge_mins:25, customer_rating:4.5, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Premium", energy_efficiency_kwh_100km:26.7, price_per_km_range:148.1, co2_saved_ktons:218.4, safety_score:4.2 },
  { id:7, model_name:"Volkswagen ID.4 Pro Performance", manufacturer:"Volkswagen", category:"SUV", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:82, driving_range_km:541, base_price_usd:41990, annual_sales_units:128000, fast_charge_mins:28, customer_rating:4.3, manufacturing_country:"Germany", manufacturing_region:"Europe", market_tier:"Mass Market", energy_efficiency_kwh_100km:15.2, price_per_km_range:77.6, co2_saved_ktons:307.2, safety_score:4.2 },
  { id:8, model_name:"Polestar 4 Long Range Single Motor", manufacturer:"Polestar", category:"SUV", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:100, driving_range_km:614, base_price_usd:59900, annual_sales_units:28000, fast_charge_mins:30, customer_rating:4.4, manufacturing_country:"Sweden", manufacturing_region:"Europe", market_tier:"Premium", energy_efficiency_kwh_100km:16.3, price_per_km_range:97.6, co2_saved_ktons:67.2, safety_score:4.2 },
  { id:9, model_name:"NIO ET7 Ultra Long Range", manufacturer:"NIO", category:"Sedan", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:100, driving_range_km:1000, base_price_usd:69800, annual_sales_units:45000, fast_charge_mins:20, customer_rating:4.6, manufacturing_country:"China", manufacturing_region:"Asia-Pacific", market_tier:"Premium", energy_efficiency_kwh_100km:10.0, price_per_km_range:69.8, co2_saved_ktons:85.5, safety_score:4.2 },
  { id:10, model_name:"Tata Nexon EV Max Performance", manufacturer:"Tata Motors", category:"SUV", release_year:2024, battery_tech:"LFP", battery_capacity_kwh:40.5, driving_range_km:437, base_price_usd:22000, annual_sales_units:58000, fast_charge_mins:56, customer_rating:4.2, manufacturing_country:"India", manufacturing_region:"Asia-Pacific", market_tier:"Budget", energy_efficiency_kwh_100km:9.3, price_per_km_range:50.3, co2_saved_ktons:139.2, safety_score:4.9 },
  { id:11, model_name:"Ather 450X Gen 3 Max", manufacturer:"Ather Energy", category:"Two-Wheeler", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:3.7, driving_range_km:146, base_price_usd:2100, annual_sales_units:95000, fast_charge_mins:15, customer_rating:4.5, manufacturing_country:"India", manufacturing_region:"Asia-Pacific", market_tier:"Budget", energy_efficiency_kwh_100km:2.5, price_per_km_range:14.4, co2_saved_ktons:57.0, safety_score:4.2 },
  { id:12, model_name:"Yutong E12 City Bus Ultra", manufacturer:"Yutong", category:"Bus", release_year:2024, battery_tech:"LFP", battery_capacity_kwh:374, driving_range_km:400, base_price_usd:285000, annual_sales_units:4200, fast_charge_mins:90, customer_rating:4.1, manufacturing_country:"China", manufacturing_region:"Asia-Pacific", market_tier:"Fleet/Commercial", energy_efficiency_kwh_100km:93.5, price_per_km_range:712.5, co2_saved_ktons:111.3, safety_score:4.9 },
  { id:13, model_name:"Porsche Taycan Turbo S Performance", manufacturer:"Porsche", category:"Sedan", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:93.4, driving_range_km:512, base_price_usd:185000, annual_sales_units:18000, fast_charge_mins:22, customer_rating:4.9, manufacturing_country:"Germany", manufacturing_region:"Europe", market_tier:"Luxury", energy_efficiency_kwh_100km:18.2, price_per_km_range:361.3, co2_saved_ktons:34.2, safety_score:4.2 },
  { id:14, model_name:"Ford Mustang Mach-E GT Performance", manufacturer:"Ford", category:"SUV", release_year:2024, battery_tech:"NMC", battery_capacity_kwh:91, driving_range_km:434, base_price_usd:63900, annual_sales_units:55000, fast_charge_mins:38, customer_rating:4.2, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Mass Market", energy_efficiency_kwh_100km:21.0, price_per_km_range:147.2, co2_saved_ktons:132.0, safety_score:4.2 },
  { id:15, model_name:"Kia EV9 GT-Line Performance", manufacturer:"Kia", category:"SUV", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:99.8, driving_range_km:541, base_price_usd:55400, annual_sales_units:88000, fast_charge_mins:24, customer_rating:4.6, manufacturing_country:"South Korea", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:18.4, price_per_km_range:102.4, co2_saved_ktons:211.2, safety_score:4.2 },
  { id:16, model_name:"Mercedes-Benz EQS 450+ Luxury", manufacturer:"Mercedes-Benz", category:"Sedan", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:107.8, driving_range_km:770, base_price_usd:104400, annual_sales_units:22000, fast_charge_mins:31, customer_rating:4.7, manufacturing_country:"Germany", manufacturing_region:"Europe", market_tier:"Luxury", energy_efficiency_kwh_100km:14.0, price_per_km_range:135.6, co2_saved_ktons:41.8, safety_score:4.2 },
  { id:17, model_name:"Toyota bZ4X Long Range AWD", manufacturer:"Toyota", category:"SUV", release_year:2025, battery_tech:"Solid-State", battery_capacity_kwh:72.8, driving_range_km:650, base_price_usd:44000, annual_sales_units:65000, fast_charge_mins:12, customer_rating:4.4, manufacturing_country:"Japan", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:11.2, price_per_km_range:67.7, co2_saved_ktons:156.0, safety_score:4.95 },
  { id:18, model_name:"XPeng G6 Ultra Performance", manufacturer:"XPeng", category:"SUV", release_year:2024, battery_tech:"LFP", battery_capacity_kwh:87.5, driving_range_km:570, base_price_usd:31000, annual_sales_units:82000, fast_charge_mins:20, customer_rating:4.4, manufacturing_country:"China", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:15.4, price_per_km_range:54.4, co2_saved_ktons:196.8, safety_score:4.9 },
  { id:19, model_name:"Audi e-tron GT Quattro Performance", manufacturer:"Audi", category:"Sedan", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:93.4, driving_range_km:487, base_price_usd:106450, annual_sales_units:15000, fast_charge_mins:23, customer_rating:4.6, manufacturing_country:"Germany", manufacturing_region:"Europe", market_tier:"Luxury", energy_efficiency_kwh_100km:19.2, price_per_km_range:218.6, co2_saved_ktons:28.5, safety_score:4.2 },
  { id:20, model_name:"Chevrolet Silverado EV WT Performance", manufacturer:"General Motors", category:"Truck", release_year:2024, battery_tech:"NMC", battery_capacity_kwh:200, driving_range_km:643, base_price_usd:79800, annual_sales_units:42000, fast_charge_mins:34, customer_rating:4.3, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Mass Market", energy_efficiency_kwh_100km:31.1, price_per_km_range:124.1, co2_saved_ktons:176.4, safety_score:4.2 },
  { id:21, model_name:"BYD Dolphin Plus Standard", manufacturer:"BYD", category:"Hatchback", release_year:2024, battery_tech:"LFP", battery_capacity_kwh:44.9, driving_range_km:427, base_price_usd:22000, annual_sales_units:280000, fast_charge_mins:35, customer_rating:4.4, manufacturing_country:"China", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:10.5, price_per_km_range:51.5, co2_saved_ktons:420.0, safety_score:4.9 },
  { id:22, model_name:"Volvo EX90 Twin Performance", manufacturer:"Volvo", category:"SUV", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:111, driving_range_km:580, base_price_usd:104900, annual_sales_units:18500, fast_charge_mins:30, customer_rating:4.5, manufacturing_country:"Sweden", manufacturing_region:"Europe", market_tier:"Luxury", energy_efficiency_kwh_100km:19.1, price_per_km_range:180.9, co2_saved_ktons:44.4, safety_score:4.2 },
  { id:23, model_name:"Nissan Ariya e-4ORCE Evolve+", manufacturer:"Nissan", category:"SUV", release_year:2024, battery_tech:"LFP", battery_capacity_kwh:91, driving_range_km:520, base_price_usd:55900, annual_sales_units:28000, fast_charge_mins:30, customer_rating:4.1, manufacturing_country:"Japan", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:17.5, price_per_km_range:107.5, co2_saved_ktons:67.2, safety_score:4.9 },
  { id:24, model_name:"Zeekr 001 Ultra Long Range", manufacturer:"Geely / Zeekr", category:"Sedan", release_year:2025, battery_tech:"LFP", battery_capacity_kwh:100, driving_range_km:1032, base_price_usd:42000, annual_sales_units:95000, fast_charge_mins:25, customer_rating:4.5, manufacturing_country:"China", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:9.7, price_per_km_range:40.7, co2_saved_ktons:180.5, safety_score:4.9 },
  { id:25, model_name:"Mahindra BE.05 GT AWD", manufacturer:"Mahindra", category:"SUV", release_year:2026, battery_tech:"LFP", battery_capacity_kwh:79, driving_range_km:682, base_price_usd:29000, annual_sales_units:38000, fast_charge_mins:32, customer_rating:4.3, manufacturing_country:"India", manufacturing_region:"Asia-Pacific", market_tier:"Budget", energy_efficiency_kwh_100km:11.6, price_per_km_range:42.5, co2_saved_ktons:91.2, safety_score:4.9 },
  { id:26, model_name:"Tesla Cybertruck Dual Motor AWD", manufacturer:"Tesla", category:"Truck", release_year:2024, battery_tech:"NCA", battery_capacity_kwh:123, driving_range_km:547, base_price_usd:79990, annual_sales_units:55000, fast_charge_mins:25, customer_rating:4.3, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Premium", energy_efficiency_kwh_100km:22.5, price_per_km_range:146.2, co2_saved_ktons:231.0, safety_score:4.0 },
  { id:27, model_name:"Ola S1 Pro Gen 2 Max", manufacturer:"Ola Electric", category:"Two-Wheeler", release_year:2025, battery_tech:"LFP", battery_capacity_kwh:4.0, driving_range_km:195, base_price_usd:1900, annual_sales_units:145000, fast_charge_mins:20, customer_rating:4.0, manufacturing_country:"India", manufacturing_region:"Asia-Pacific", market_tier:"Budget", energy_efficiency_kwh_100km:2.1, price_per_km_range:9.7, co2_saved_ktons:87.0, safety_score:4.9 },
  { id:28, model_name:"Proterra ZX5 Max Electric Bus", manufacturer:"Proterra", category:"Bus", release_year:2024, battery_tech:"NMC", battery_capacity_kwh:225, driving_range_km:480, base_price_usd:799000, annual_sales_units:620, fast_charge_mins:120, customer_rating:4.2, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Fleet/Commercial", energy_efficiency_kwh_100km:46.9, price_per_km_range:1664.6, co2_saved_ktons:16.4, safety_score:4.2 },
  { id:29, model_name:"BYD Han EV Ultra Long Range", manufacturer:"BYD", category:"Sedan", release_year:2025, battery_tech:"LFP", battery_capacity_kwh:85.44, driving_range_km:715, base_price_usd:40000, annual_sales_units:210000, fast_charge_mins:28, customer_rating:4.5, manufacturing_country:"China", manufacturing_region:"Asia-Pacific", market_tier:"Mass Market", energy_efficiency_kwh_100km:11.9, price_per_km_range:55.9, co2_saved_ktons:399.0, safety_score:4.9 },
  { id:30, model_name:"Cadillac LYRIQ Sport Edition", manufacturer:"General Motors", category:"SUV", release_year:2025, battery_tech:"NMC", battery_capacity_kwh:102, driving_range_km:530, base_price_usd:63990, annual_sales_units:25000, fast_charge_mins:38, customer_rating:4.3, manufacturing_country:"USA", manufacturing_region:"North America", market_tier:"Luxury", energy_efficiency_kwh_100km:19.2, price_per_km_range:120.7, co2_saved_ktons:60.0, safety_score:4.2 }
];

function initEVData() {
  if (!localStorage.getItem(EV_STORAGE_KEY)) {
    localStorage.setItem(EV_STORAGE_KEY, JSON.stringify(SEED_DATA));
  }
}

function getEVData() {
  initEVData();
  return JSON.parse(localStorage.getItem(EV_STORAGE_KEY));
}

function saveEVData(data) {
  localStorage.setItem(EV_STORAGE_KEY, JSON.stringify(data));
}

function addEVRecord(record) {
  const data = getEVData();
  const maxId = data.reduce((m, d) => Math.max(m, d.id || 0), 0);
  record.id = maxId + 1;
  // Calculate derived fields
  record.energy_efficiency_kwh_100km = parseFloat(((record.battery_capacity_kwh / record.driving_range_km) * 100).toFixed(2));
  record.price_per_km_range = parseFloat((record.base_price_usd / record.driving_range_km).toFixed(2));
  const co2Map = { SUV: 2.4, Sedan: 1.9, Hatchback: 1.5, Truck: 4.2, Bus: 26.5, 'Two-Wheeler': 0.6 };
  record.co2_saved_ktons = parseFloat(((record.annual_sales_units * (co2Map[record.category] || 2.0)) / 1000).toFixed(2));
  const safetyMap = { LFP: 4.9, 'Solid-State': 4.95, 'Sodium-Ion': 4.8, NMC: 4.2, NCA: 4.0 };
  record.safety_score = safetyMap[record.battery_tech] || 4.2;
  const tierMap = { USA: 'Premium', Germany: 'Luxury', China: 'Mass Market', Japan: 'Mass Market', India: 'Budget', 'South Korea': 'Mass Market', Sweden: 'Luxury' };
  record.market_tier = tierMap[record.manufacturing_country] || 'Mass Market';
  const regionMap = { USA: 'North America', Germany: 'Europe', China: 'Asia-Pacific', Japan: 'Asia-Pacific', India: 'Asia-Pacific', 'South Korea': 'Asia-Pacific', Sweden: 'Europe', France: 'Europe', UK: 'Europe' };
  record.manufacturing_region = regionMap[record.manufacturing_country] || 'Other';
  data.push(record);
  saveEVData(data);
  return record;
}

function getEVById(id) {
  return getEVData().find(d => String(d.id) === String(id));
}

function deleteEVRecord(id) {
  const data = getEVData().filter(d => String(d.id) !== String(id));
  saveEVData(data);
}

// Initialize on load
initEVData();

