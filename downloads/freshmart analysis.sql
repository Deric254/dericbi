/*============================================================
   0. Select database to use 
============================================================ */

USE freshmart_marketing_db;

/* ============================================================
   1. QUICK DATA OVERVIEW (SANITY CHECK)
   ============================================================ */

-- How many records per key table?
SELECT 'outlets' AS `Table Name`, COUNT(*) AS records FROM outlets
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'sales', COUNT(*) FROM sales
UNION ALL
SELECT 'marketing_interactions', COUNT(*) FROM marketing_interactions
UNION ALL
SELECT 'outlet_foot_traffic', COUNT(*) FROM outlet_foot_traffic
order by records 
;


/* ============================================================
   2. DATA QUALITY CHECKS
   - We inspect the main issues:
   - inconsistent locations
   - duplicate sales
   - negative / zero sales
   - NULL channels
   ============================================================ */

-- 2.1 LOCATION INCONSISTENCY (customers)
SELECT DISTINCT location
FROM customers
ORDER BY location;

-- 2.2 LOCATION INCONSISTENCY (outlets)
SELECT DISTINCT location
FROM outlets
ORDER BY location;

-- 2.3 NEGATIVE OR ZERO SALES (potential refunds / data errors)
SELECT 
    COUNT(*) AS `Total sales`,
    SUM(CASE WHEN total_sales < 0 THEN 1 ELSE 0 END) AS negative_sales,
    SUM(CASE WHEN total_sales = 0 THEN 1 ELSE 0 END) AS zero_sales
FROM sales;
#select count(*) from sales; veryfying total sales
#select * from sales where total_sales<0 and  total_sales=0; veryfying tally

-- 2.4 NULL MARKETING CHANNELS
SELECT 
    COUNT(*) AS `Total sales`,
    SUM(CASE WHEN marketing_channel IS NULL THEN 1 ELSE 0 END) AS `Null sales channel`
FROM sales;

-- 2.5 IDENTIFY DUPLICATE SALES
-- We consider duplicates as rows with exactly the same business fields:
-- outlet_id, product_id, customer_id, quantity, total_sales, discount_applied, sale_date, marketing_channel
SELECT
    outlet_id,
    product_id,
    customer_id,
    quantity,
    total_sales,
    discount_applied,
    sale_date,
    marketing_channel,
    COUNT(*) AS duplicate_count
FROM sales
GROUP BY
    outlet_id,
    product_id,
    customer_id,
    quantity,
    total_sales,
    discount_applied,
    sale_date,
    marketing_channel
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 20;



/* ============================================================
   3. DATA CLEANING LAYER
   - We will NOT destroy raw data.
   - Instead, we create CLEAN VIEWS to be used for analysis.
   - This is what a professional analyst does to stay auditable.
   ============================================================ */

-- 3.1 CLEAN LOCATIONS (customers + outlets)
-- We standardize obvious typos and casing for key Nairobi areas.

CREATE OR REPLACE VIEW vw_clean_locations AS
SELECT
    -- Standardize locations for customers
    c.customer_id,
    c.full_name,
    c.gender,
    c.age_group,
    CASE
        WHEN LOWER(c.location) IN ('westlands', 'westland', 'westlands ') THEN 'Westlands'
        WHEN LOWER(c.location) IN ('embakasi', 'embakassi') THEN 'Embakasi'
        WHEN LOWER(c.location) IN ('kasarani', 'kasaarani') THEN 'Kasarani'
        WHEN c.location IS NULL OR c.location = '' THEN 'Unknown'
        ELSE c.location
    END AS customer_location_clean,
    c.acquisition_channel,
    -- Standardize locations for outlets by joining outlets
    o.outlet_id,
    o.outlet_name,
    CASE
        WHEN LOWER(o.location) IN ('westlands', 'westland', 'westlands ') THEN 'Westlands'
        WHEN LOWER(o.location) IN ('embakasi', 'embakassi') THEN 'Embakasi'
        WHEN LOWER(o.location) IN ('kasarani', 'kasaarani') THEN 'Kasarani'
        ELSE o.location
    END AS outlet_location_clean
FROM customers c
LEFT JOIN outlets o ON 1 = 1; 
-- NOTE: This is a helper view; real outlet location cleaning will be per-outlet below.
-- We'll instead also create a separate outlet cleaning view for clarity.


-- 3.1 A CLEAN CUSTOMERS LOCATIONS

CREATE OR REPLACE VIEW vw_customers_clean AS
SELECT
    customer_id,
    full_name,
    gender,
    age_group,
    CASE
        WHEN LOWER(location) IN ('westlands', 'westland', 'westlands ') THEN 'Westlands'
        WHEN LOWER(location) IN ('embakasi', 'embakassi') THEN 'Embakasi'
        WHEN LOWER(location) IN ('kasarani', 'kasaarani') THEN 'Kasarani'
        WHEN location IS NULL OR location = '' THEN 'Unknown'
        ELSE location
    END AS location_clean,
    acquisition_channel
FROM customers;


-- 3.1B CLEAN OUTLETS LOCATIONS

CREATE OR REPLACE VIEW vw_outlets_clean AS
SELECT
    outlet_id,
    outlet_name,
    CASE
        WHEN LOWER(location) IN ('westlands', 'westland', 'westlands ') THEN 'Westlands'
        WHEN LOWER(location) IN ('embakasi', 'embakassi') THEN 'Embakasi'
        WHEN LOWER(location) IN ('kasarani', 'kasaarani') THEN 'Kasarani'
        ELSE location
    END AS location_clean,
    foot_traffic_capacity,
    opening_date
FROM outlets;


-- 3.2 CLEAN SALES
-- Steps:
--   - Remove duplicates (keep the earliest sale_id per identical row)
--   - Exclude negative/zero total_sales (treat them as anomalies / refunds for this KPI view)

CREATE OR REPLACE VIEW vw_sales_dedup AS
SELECT s.*
FROM sales s
JOIN (
    SELECT
        MIN(sale_id) AS keep_id
    FROM sales
    GROUP BY
        outlet_id,
        product_id,
        customer_id,
        quantity,
        total_sales,
        discount_applied,
        sale_date,
        marketing_channel
) k ON s.sale_id = k.keep_id;


-- Now filter out negative/zero sales to get a clean sales view for revenue analysis

CREATE OR REPLACE VIEW vw_sales_clean AS
SELECT *
FROM vw_sales_dedup
WHERE total_sales > 0;


-- 3.3 ENRICHED SALES VIEW
-- Add product info, outlet info, and customer info for easier analysis

CREATE OR REPLACE VIEW vw_sales_enriched AS
SELECT
    s.sale_id,
    s.sale_date,
    s.outlet_id,
    o.outlet_name,
    o.location_clean AS outlet_location,
    s.product_id,
    p.product_name,
    p.category,
    p.unit_cost,
    p.unit_price,
    s.customer_id,
    c.full_name,
    c.gender,
    c.age_group,
    c.location_clean AS customer_location,
    s.quantity,
    s.total_sales,
    s.discount_applied,
    s.marketing_channel,
    -- Derived profit per sale
    (s.quantity * (p.unit_price - p.unit_cost)) AS gross_profit
FROM vw_sales_clean s
JOIN vw_outlets_clean o ON s.outlet_id = o.outlet_id
JOIN products p ON s.product_id = p.product_id
LEFT JOIN vw_customers_clean c ON s.customer_id = c.customer_id;


/* ============================================================
   4. HIGH-LEVEL KEY PERFORMANCE INDICATORS 
   - Revenue, Profit, Average Basket, Time Trends
   ============================================================ */

-- 4.1 TOTAL REVENUE & GROSS PROFIT (CLEANED DATA ONLY)
create or replace view `Top KPIs` as 
SELECT
    ROUND(SUM(total_sales)/1000000 , 2)AS `Total revenue in millions`,
    ROUND(SUM(gross_profit)/1000000 , 2) AS `Total gross profit in millions`,
    ROUND(SUM(gross_profit) / SUM(total_sales) * 100, 2) AS `gross margin %`
FROM vw_sales_enriched;


-- 4.2 MONTHLY REVENUE AND PROFIT TREND
-- This highlights seasonality and periods of strong or weak performance.
create or replace view `MONTHLY REVENUE AND PROFIT TREND` as
SELECT
date_format(now(),'%y-%m') as `Year month`,
    -- DATE_FORMAT(sale_date, '%Y-%m') AS year_month,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue 'M'`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit 'M'`,
    ROUND(SUM(gross_profit) / SUM(total_sales) * 100, 2) AS `Margin %`,
    COUNT(DISTINCT outlet_id) AS `Active outlets`
FROM vw_sales_enriched
GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
ORDER BY min(sale_date);


-- 4.3 OUTLET PERFORMANCE SUMMARY
-- This tells the management  which branches are carrying the business
-- and which locations may need attention.
create or replace view `OUTLET PERFORMANCE SUMMARY` as
SELECT
    outlet_name as `Outlet name`,
    outlet_location as `Outlet location`,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue 'M'`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit 'M'`,
    ROUND(SUM(gross_profit) / SUM(total_sales) * 100, 2) AS `Margin %`,
    COUNT(DISTINCT DATE(sale_date)) AS `Active days`,
    COUNT(DISTINCT customer_id) AS `Unique customers`
FROM vw_sales_enriched
GROUP BY outlet_id, `Outlet name`, `Outlet location`
ORDER BY `Revenue 'M'` DESC;


/* ============================================================
   5. PRODUCT & CATEGORY INSIGHTS
   - What is actually driving or dragging performance?
   ============================================================ */

-- 5.1 TOP 10 PRODUCTS BY REVENUE
create or replace view `TOP 10 PRODUCTS BY REVENUE` as 
SELECT
    product_name as `Product name`,
    category,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue  M`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit`,
    ROUND(SUM(gross_profit) / SUM(total_sales) * 100, 2) AS `Margin %`,
    SUM(quantity) AS `Units sold`
FROM vw_sales_enriched
GROUP BY product_id, `Product name`, category
ORDER BY `Revenue  M` DESC
LIMIT 10;


-- 5.2 BOTTOM 10 PRODUCTS BY GROSS PROFIT
-- These may be candidates for:
--   - price review
--   - promotion
--   - delisting
create or replace view `BOTTOM 10 PRODUCTS BY GROSS PROFIT`as 
SELECT
    product_name as `Product name`,
    category,
    ROUND(SUM(total_sales)/1000000, 4) AS `Revenue M`,
    ROUND(SUM(gross_profit)/1000000, 4) AS `Gross profit`,
    ROUND(SUM(gross_profit) / NULLIF(SUM(total_sales), 0) * 100, 2) AS `Margin %`,
    SUM(quantity) AS `Units sold`
FROM vw_sales_enriched
GROUP BY product_id, `Product name`, category
HAVING SUM(total_sales) > 0
ORDER BY `Gross profit` asc
LIMIT 10;


-- 5.3 CATEGORY PERFORMANCE SUMMARY
create or replace view `CATEGORY PERFORMANCE SUMMARY` as 
SELECT
    category,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue M`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit M`,
    ROUND(SUM(gross_profit) / SUM(total_sales) * 100, 2) AS `Margin %`,
    SUM(quantity) AS `Units sold`
FROM vw_sales_enriched
GROUP BY category
ORDER BY `Revenue M` DESC;


/* ============================================================
   6. MARKETING CHANNEL & CAMPAIGN EFFECTIVENESS
   - How well are channels and campaigns actually performing?
   ============================================================ */

-- 6.1 SALES ATTRIBUTED BY MARKETING CHANNEL
-- Note: Walk-in is the  "baseline"; others are marketing-driven.
create or replace view `marketing performance` as

SELECT
    COALESCE(marketing_channel, 'Unknown') AS channel,
    COUNT(*) AS Transactions,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue M`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit M`,
    ROUND(SUM(gross_profit) / SUM(total_sales) * 100, 2) AS `Margin %`,
    COUNT(DISTINCT customer_id) AS `Unique customers`
FROM vw_sales_enriched
GROUP BY COALESCE(marketing_channel, 'Unknown')
ORDER BY `Revenue M` DESC;


-- 6.2 CAMPAIGN INTERACTION VOLUME BY CHANNEL
-- This shows which channels actually generate engagement.
create or replace view `CAMPAIGN INTERACTION VOLUME BY CHANNEL` as 
SELECT
    c.channel,
    COUNT(mi.interaction_id) AS interactions,
    COUNT(DISTINCT mi.customer_id) AS `Unique customers reached`,
    COUNT(DISTINCT mi.campaign_id) AS campaigns
FROM marketing_interactions mi
JOIN campaigns c ON mi.campaign_id = c.campaign_id
GROUP BY c.channel
ORDER BY interactions DESC;


-- 6.3 LINK CAMPAIGN PERIODS WITH SALES (HIGH LEVEL)
-- For each channel, we compare average daily revenue when campaigns are active
-- versus outside campaign periods.

-- Step 1: Build a calendar of campaign-active dates per channel
CREATE OR REPLACE VIEW vw_campaign_active_days AS
SELECT
    c.channel,
    d.calendar_date
FROM campaigns c
JOIN (
    -- Generate a date series using outlet_foot_traffic dates as calendar proxy
    SELECT DISTINCT traffic_date AS calendar_date
    FROM outlet_foot_traffic
) d
    ON d.calendar_date BETWEEN c.start_date AND c.end_date;

-- Step 2: Compare Sales on active vs non-active dates per channel (attribution by marketing_channel)
create or replace view ` Sales on active vs non-active dates per channel` as
SELECT
    COALESCE(se.marketing_channel, 'Unknown') AS channel,
    CASE 
        WHEN cad.calendar_date IS NOT NULL THEN 'Campaign Active Day'
        ELSE 'No Campaign'
    END AS campaign_status,
    ROUND(SUM(se.total_sales)/1000000, 4) AS `Revenue M`,
    ROUND(AVG(se.total_sales)/1000000, 4) AS `Avg transaction value M`,
    COUNT(*) AS Transactions
FROM vw_sales_enriched se
LEFT JOIN vw_campaign_active_days cad
    ON se.sale_date = cad.calendar_date
    AND se.marketing_channel = cad.channel
GROUP BY
    COALESCE(se.marketing_channel, 'Unknown'),
    campaign_status
ORDER BY channel, campaign_status;


/* ============================================================
   7. OUTLET FOOT TRAFFIC VS SALES CONVERSION
   - Does foot traffic translate into revenue?
   ============================================================ */

-- 7.1 DAILY OUTLET CONVERSION VIEW
-- We join foot traffic with sales to see conversion per outlet per day.

CREATE OR REPLACE VIEW vw_outlet_daily_conversion AS
SELECT
    oft.outlet_id,
    o.outlet_name,
    o.location_clean AS outlet_location,
    oft.traffic_date,
    oft.walk_ins,
    oft.conversion_rate AS planned_conversion_rate,
    COUNT(DISTINCT s.sale_id) AS transactions,
    ROUND(SUM(s.total_sales), 2) AS revenue
FROM outlet_foot_traffic oft
JOIN vw_outlets_clean o ON oft.outlet_id = o.outlet_id
LEFT JOIN vw_sales_clean s
    ON s.outlet_id = oft.outlet_id
    AND s.sale_date = oft.traffic_date
GROUP BY
    oft.outlet_id,
    o.outlet_name,
    o.location_clean,
    oft.traffic_date,
    oft.walk_ins,
    oft.conversion_rate;

-- 7.2 OUTLET-LEVEL SUMMARY: TRAFFIC VS REVENUE
create or replace view `TRAFFIC VS REVENUE` as 
SELECT
    outlet_name as `Outlet name`,
    outlet_location `Outlet location`,
    ROUND(AVG(walk_ins), 0) AS `Avg daily walk_ins`,
    ROUND(AVG(transactions), 0) AS `Avg daily transactions`,
    ROUND(AVG(revenue)/1000000, 2) AS `Avg daily revenue M`
FROM vw_outlet_daily_conversion
GROUP BY outlet_id, `Outlet name`, `Outlet location`
ORDER BY `Avg daily revenue M` DESC;


/* ============================================================
   8. CUSTOMER SEGMENT INSIGHTS
   - Which segments are most valuable?
   ============================================================ */

-- 8.1 REVENUE BY AGE GROUP & GENDER
create or replace view ` REVENUE BY AGE GROUP & GENDER` as 
SELECT
    age_group as `Age group`,
    gender,
    ROUND(SUM(total_sales) /1000000, 2) AS `Revenue M`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit M`,
    COUNT(DISTINCT customer_id) AS customers,
    (ROUND(SUM(total_sales) / NULLIF(COUNT(DISTINCT customer_id), 0), 2))/1000000 AS `Revenue per customer M`
FROM vw_sales_enriched
WHERE customer_id IS NOT NULL
GROUP BY `Age group`, gender
ORDER BY `Revenue M` DESC;


-- 8.2 TOP 10 CUSTOMER LOCATIONS (CLEAN)
create or replace view `TOP 10 CUSTOMER LOCATIONS` as 
SELECT
    customer_location as `Custormer location`,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue M`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit M`,
    COUNT(DISTINCT customer_id) AS customers
FROM vw_sales_enriched
WHERE customer_id IS NOT NULL
GROUP BY `Custormer location`
ORDER BY `Revenue M` DESC
LIMIT 10;


-- 8.3 ACQUISITION CHANNEL QUALITY
-- How do customers acquired from each channel perform over time?
create or replace view `ACQUISITION CHANNEL QUALITY` as
SELECT
    c.acquisition_channel,
    COUNT(DISTINCT c.customer_id) AS `customers acquired`,
    ROUND(SUM(se.total_sales)/1000000, 2) AS `Total revenue M`,
    (ROUND(SUM(se.total_sales) / NULLIF(COUNT(DISTINCT c.customer_id), 0), 2))/1000000 AS `Revenue per customer M`
FROM vw_customers_clean c
LEFT JOIN vw_sales_enriched se ON c.customer_id = se.customer_id
GROUP BY c.acquisition_channel
ORDER BY `Total revenue M` DESC;


   /*============================================================ 
   9. EXECUTIVE SUMMARY QUERIES
  Managements view point.
   ============================================================ */

-- 9.1 TOP 5 OUTLETS BY REVENUE VS BOTTOM 5
create  or replace view `Top vrs bottom outlets by revenue ` as 
(
    SELECT
        'Top 5' AS `Rank group`,
        outlet_name As `outlet name`,
        outlet_location as `Outlet location `,
        ROUND(SUM(total_sales)/1000000, 2) AS `Revenue M`,
        ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit M`
    FROM vw_sales_enriched
    GROUP BY outlet_id, `outlet name`, `Outlet location `
    ORDER BY `Revenue M` DESC
    LIMIT 5
)
UNION  all
(
    SELECT
        'Bottom 5' AS `Rank group`,
        outlet_name as `Outlet name`,
        outlet_location as `Outlet location`,
        ROUND(SUM(total_sales)/1000000, 2) AS `Revenue M`,
        ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit M`
    FROM vw_sales_enriched
    GROUP BY outlet_id, `Outlet name`, `Outlet location`
    ORDER BY `Revenue M` ASC
    LIMIT 5
);




-- 9.2 TOP 3 MARKETING CHANNELS BY REVENUE & CUSTOMER REACH
SELECT
    COALESCE(marketing_channel, 'Unknown') AS channel,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue m`,
    ROUND(SUM(gross_profit), 2) AS `Gross profit`,
    COUNT(DISTINCT customer_id) AS `Unique customers`
FROM vw_sales_enriched
GROUP BY COALESCE(marketing_channel, 'Unknown')
ORDER BY `Revenue m` DESC
LIMIT 5;





-- 9.3 MONTH WITH STRONGEST PERFORMANCE (REVENUE + MARGIN)
create  or replace view `MONTH WITH STRONGEST PERFORMANCE` as 
SELECT
    date_format(now(),'%y-%m') as `Year month`,
    ROUND(SUM(total_sales)/1000000, 2) AS `Revenue M`,
    ROUND(SUM(gross_profit)/1000000, 2) AS `Gross profit M`,
    ROUND(SUM(gross_profit) / SUM(total_sales) * 100, 2) AS `Margin %`
FROM vw_sales_enriched
GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
ORDER BY `Revenue M` DESC
LIMIT 1;




