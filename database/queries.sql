-- ============================================================
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
