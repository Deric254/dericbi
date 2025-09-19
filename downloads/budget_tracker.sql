# Project 1: budget_tracker
-- KPI View: Essential Spend Ratio
CREATE view  essentialspendindex AS
SELECT (SUM(CASE WHEN `Necessity Level (Essential/Optional)` = 'Essential' THEN CAST(`Amount` AS DECIMAL(10,2)) ELSE 0 END) / SUM(CAST(`Amount` AS DECIMAL(10,2)))) * 100 AS EssentialSpendRatio
FROM budget_tracker;

-- KPI View: optional Spend Ratio
CREATE  VIEW optionalspendindex AS
SELECT (SUM(CASE WHEN `Necessity Level (Essential/Optional)` = 'optional' THEN CAST(`Amount` AS DECIMAL(10,2)) ELSE 0 END) / SUM(CAST(`Amount` AS DECIMAL(10,2)))) * 100 AS EssentialSpendRatio
FROM budget_tracker;

-- Summary View: Key Metrics
CREATE OR REPLACE VIEW budgetSummary AS
SELECT `Expense Category`, `Necessity Level (Essential/Optional)`,floor((avg(`Amount`))) AS AvgAmount, COUNT(*) AS RecordCount
FROM budget_tracker
GROUP BY `Expense Category`, `Necessity Level (Essential/Optional)`
order by 2 desc;

-- Pattern 1 : essential spend distribution in the week
CREATE OR REPLACE VIEW `essential spending distribution` AS
SELECT WEEKDAY(STR_TO_DATE(`Date`, '%Y-%m-%d')) AS Weekday, `Necessity Level (Essential/Optional)`, floor((AVG(`amount`))) AS AvgAmount
FROM budget_tracker
GROUP BY Weekday, `Necessity Level (Essential/Optional)`
HAVING `Necessity Level (Essential/Optional)` = "Essential"
ORDER BY 3 ;

-- Pattern 1.1 : optional spend distribution in the week
CREATE OR REPLACE VIEW `optional spending distribution` AS
SELECT WEEKDAY(STR_TO_DATE(`Date`, '%Y-%m-%d')) AS Weekday, `Necessity Level (Essential/Optional)`, floor((AVG(`amount`))) AS AvgAmount
FROM budget_tracker
GROUP BY Weekday, `Necessity Level (Essential/Optional)`
HAVING `Necessity Level (Essential/Optional)` = "optional"
ORDER BY 3 ;

-- Pattern 2 View: Mobile money dominates
CREATE OR REPLACE VIEW spendchannel AS
SELECT `Source (Cash, Bank Transfer, Mobile Money)` as liquidity, COUNT(*) AS TransactionCount
FROM budget_tracker
GROUP BY `Source (Cash, Bank Transfer, Mobile Money)`
ORDER BY TransactionCount DESC;

-- Pattern 3 View: Utilities and logistics in essentials
CREATE OR REPLACE VIEW AllExpenses AS
SELECT `Expense Category`, floor(sum(`Amount`)/1000000) AS TotalEssentialSpendMillions
FROM budget_tracker
WHERE `Necessity Level (Essential/Optional)` = 'Essential'
GROUP BY `Expense Category`
ORDER BY TotalEssentialSpendMillions DESC;
