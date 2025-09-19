#preview  full dataset
SELECT * FROM supermarket_data.supermarket_dataset;
# Inspect issues in the dataset 
show columns from supermarket_dataset ;
select  distinct OrderDate from supermarket_dataset;
#check duplicates

select OrderID,count(*) as count 
from supermarket_dataset
group by OrderID
having OrderID >1 
;
# check for missing values 
select count(*) as missing 
from supermarket_dataset
WHERE Quantity IS NULL OR TotalPrice IS NULL OR DeliveryStatus IS NULL;
# Cleaning
# Validate TotalPrice
UPDATE supermarket_dataset
SET TotalPrice = Quantity * UnitPrice
WHERE ABS(TotalPrice - (Quantity * UnitPrice)) > 0.01;

#data type issue is everything is text
SELECT 
  CAST(Quantity AS UNSIGNED) AS Quantity_num,
  CAST(UnitPrice AS DECIMAL(10,2)) AS UnitPrice_num
FROM supermarket_dataset;
# dates check data type 
SELECT DISTINCT OrderDate FROM supermarket_dataset LIMIT 10;
UPDATE supermarket_dataset
SET OrderDate_clean = STR_TO_DATE(OrderDate, '%m/%d/%Y'),
    DeliveryDate_clean = STR_TO_DATE(DeliveryDate, '%m/%d/%Y');
    
# confirm
SELECT 
  COUNT(*) AS total_rows,
  COUNT(OrderDate_clean) AS cleaned_orders,
  COUNT(DeliveryDate_clean) AS cleaned_deliveries
FROM supermarket_dataset;

show columns from supermarket_dataset;
#remove redundant date 
--  Drop raw columns that have cleaned equivalents
ALTER TABLE supermarket_dataset
DROP COLUMN Quantity,
DROP COLUMN UnitPrice,
DROP COLUMN TotalPrice,
DROP COLUMN OrderDate,
DROP COLUMN DeliveryDate;

-- Step 2: Rename cleaned columns to final names
ALTER TABLE supermarket_dataset
CHANGE COLUMN Quantity_clean Quantity INT,
CHANGE COLUMN UnitPrice_clean UnitPrice FLOAT,
CHANGE COLUMN TotalPrice_clean TotalPrice FLOAT,
CHANGE COLUMN OrderDate_clean OrderDate DATETIME,
CHANGE COLUMN DeliveryDate_clean DeliveryDate DATETIME;
;
-- Add DeliveryTime as a generated column
ALTER TABLE supermarket_dataset
ADD COLUMN DeliveryTime INT GENERATED ALWAYS AS (DATEDIFF(DeliveryDate, OrderDate)) STORED;

 
#analysis
-- 3.1: Total Sales by Product Category (formatted in millions)
SELECT 
  ProductCategory,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS TotalSales_Millions
FROM supermarket_dataset
GROUP BY ProductCategory
ORDER BY TotalSales_Millions DESC;

-- 3.2: Sales by Customer Type (formatted in millions)
SELECT 
  CustomerType,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS TotalSales_Millions
FROM supermarket_dataset
GROUP BY CustomerType
ORDER BY TotalSales_Millions DESC;

-- 3.3: Average Delivery Time by Location (no formatting needed)
SELECT 
  Location,
  ROUND(AVG(DeliveryTime), 1) AS AvgDeliveryDays
FROM supermarket_dataset
WHERE DeliveryStatus = 'Delivered'
GROUP BY Location
ORDER BY AvgDeliveryDays DESC;

-- 3.4: Monthly Sales Trend (formatted in millions)
SELECT 
  DATE_FORMAT(OrderDate, '%Y-%m') AS YearMonth,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS MonthlySales_Millions
FROM supermarket_dataset
GROUP BY YearMonth
ORDER BY YearMonth;

-- 3.5: Online vs. In-Store Sales by Year (formatted in millions)
SELECT 
  YEAR(OrderDate) AS SalesYear,
  SalesChannel,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS ChannelSales_Millions
FROM supermarket_dataset
GROUP BY SalesYear, SalesChannel
ORDER BY SalesYear, ChannelSales_Millions DESC;

-- 3.6: Seasonal Sales for Beverages & Fruits (formatted in millions)
SELECT 
  ROUND(SUM(TotalPrice) / 1000000, 2) AS SeasonalSales_Millions,
  ROUND((
    SELECT SUM(TotalPrice) 
    FROM supermarket_dataset 
    WHERE MONTH(OrderDate) NOT IN (12, 1, 2) 
    AND ProductCategory IN ('Beverages', 'Fruits & Vegetables')
  ) / 1000000, 2) AS NonSeasonalSales_Millions
FROM supermarket_dataset
WHERE MONTH(OrderDate) IN (12, 1, 2)
AND ProductCategory IN ('Beverages', 'Fruits & Vegetables');

# views
CREATE OR REPLACE VIEW view_sales_by_category AS
SELECT 
  ProductCategory,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS TotalSales_Millions
FROM supermarket_dataset
GROUP BY ProductCategory
ORDER BY TotalSales_Millions DESC;


CREATE OR REPLACE VIEW view_sales_by_customer_type AS
SELECT 
  CustomerType,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS TotalSales_Millions
FROM supermarket_dataset
GROUP BY CustomerType
ORDER BY TotalSales_Millions DESC;

CREATE OR REPLACE VIEW view_avg_delivery_by_location AS
SELECT 
  Location,
  ROUND(AVG(DeliveryTime), 1) AS AvgDeliveryDays
FROM supermarket_dataset
WHERE DeliveryStatus = 'Delivered'
GROUP BY Location
ORDER BY AvgDeliveryDays DESC;

CREATE OR REPLACE VIEW view_monthly_sales_trend AS
SELECT 
  DATE_FORMAT(OrderDate, '%Y-%m') AS YearMonth,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS MonthlySales_Millions
FROM supermarket_dataset
GROUP BY YearMonth
ORDER BY YearMonth;

CREATE OR REPLACE VIEW view_sales_by_channel_year AS
SELECT 
  YEAR(OrderDate) AS SalesYear,
  SalesChannel,
  ROUND(SUM(TotalPrice) / 1000000, 2) AS ChannelSales_Millions
FROM supermarket_dataset
GROUP BY SalesYear, SalesChannel
ORDER BY SalesYear, ChannelSales_Millions DESC;


CREATE OR REPLACE VIEW view_exes_dashboard AS
SELECT 
  (SELECT ProductCategory FROM view_sales_by_category LIMIT 1) AS TopCategory,
  (SELECT ROUND(TotalSales_Millions, 2) FROM view_sales_by_category LIMIT 1) AS TopCategorySales_M,
  
  (SELECT SalesChannel FROM view_sales_by_channel_year WHERE SalesYear = YEAR(CURDATE()) ORDER BY ChannelSales_Millions DESC LIMIT 1) AS LeadingChannel,
  (SELECT ROUND(ChannelSales_Millions, 2) FROM view_sales_by_channel_year WHERE SalesYear = YEAR(CURDATE()) ORDER BY ChannelSales_Millions DESC LIMIT 1) AS LeadingChannelSales_M,
  
  (SELECT YearMonth FROM view_monthly_sales_trend ORDER BY MonthlySales_Millions DESC LIMIT 1) AS PeakMonth,
  (SELECT ROUND(MonthlySales_Millions, 2) FROM view_monthly_sales_trend ORDER BY MonthlySales_Millions DESC LIMIT 1) AS PeakMonthSales_M,
  
  (SELECT Location FROM view_avg_delivery_by_location ORDER BY AvgDeliveryDays DESC LIMIT 1) AS SlowestLocation,
  (SELECT ROUND(AvgDeliveryDays, 1) FROM view_avg_delivery_by_location ORDER BY AvgDeliveryDays DESC LIMIT 1) AS AvgDeliveryDays,
  
  (SELECT CustomerType FROM view_sales_by_customer_type ORDER BY TotalSales_Millions DESC LIMIT 1) AS TopCustomerType,
  (SELECT ROUND(TotalSales_Millions, 2) FROM view_sales_by_customer_type ORDER BY TotalSales_Millions DESC LIMIT 1) AS TopCustomerSales_M,
  
  (SELECT SeasonalSales_Millions FROM view_seasonal_sales) AS SeasonalSales_M,
  (SELECT NonSeasonalSales_Millions FROM view_seasonal_sales) AS NonSeasonalSales_M;







