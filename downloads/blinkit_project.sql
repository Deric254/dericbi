-- Blink_it data has been imported from csv
-- check if full data is correctly imported  from csv
 select count(*) from blinkit_data_project;
-- cleaning the data

UPDATE blinkit_data
 SET `Item Fat Content` = 
  CASE
    WHEN `Item Fat Content` IN ('lf', 'low fat') THEN 'Low fat'
    WHEN `Item Fat Content` = 'reg' THEN 'regular'
    ELSE `Item Fat Content`
  END; 
  -- validating clean 
SELECT  distinct`Item Fat Content` FROM blinkitgrocery_project.blinkit_data;

-- kp1 1getting total sales 
select cast((sum(sales)) /1000000 as decimal(10,2))as Total_sales_millions from blinkit_data;

--  kpi 2 get average sales

select cast((avg(sales)) as decimal(10,0)) as `average sales` from blinkit_data ;

--  kpi 3 get total number of items

select count(*) as `total items`  from blinkit_data;


-- getting total sales  with low fats only

select cast((sum(sales)) /1000000 as decimal(10,2))as Total_sales_millions from blinkit_data
where `Item Fat Content`='low fat';

--  getting total sales for regular fats only

select cast((sum(sales)) /1000000 as decimal(10,2))as Total_sales_millions from blinkit_data
where `Item Fat Content`='Regular';

--  getting total sales for outlet established in 2022

select cast((sum(sales)) /1000000 as decimal(10,2))as Total_sales_millions from blinkit_data
where `Outlet Establishment Year`=2022;

--  getting average  sales for outlet established in 2022

select cast((avg(sales)) as decimal(10,0)) as `average sales` from blinkit_data 
where `Outlet Establishment Year`=2022
;

--  getting total items for outlet established in 2022

select count(*) as `total items`  from blinkit_data
where `Outlet Establishment Year`=2022
;


-- find average rating 

select cast( (avg(rating)) as decimal(10,1)) as `average rating` from blinkit_data
;

-- selecting  sales metrics together by fat content 

select `Item Fat Content`,
      cast((sum(sales)/1000 )as decimal(10,2))  as `total_sales_thousands`,
      cast( (avg(rating)) as decimal(10,1)) as `average rating`,
      count(*) as `total items`,
       cast((avg(sales)) as decimal(10,0)) as `average sales`
from blinkit_data
group by `Item Fat Content` 
order by `total_sales_thousands` desc
;


-- selecting  sales metrics together by Item_type

select  `Item Type`,
      cast((sum(sales))as decimal(10,2))  as `total_sales`,
      cast( (avg(rating)) as decimal(10,1)) as `average rating`,
      count(*) as `total items`,
       cast((avg(sales)) as decimal(10,0)) as `average sales`
from blinkit_data
group by `Item Type` 
order by `total_sales` desc
;

-- selecting  sales metrics together by Outlet Location Type
select  `Outlet Location Type`,`Item Fat Content`,
      cast((sum(sales))as decimal(10,2))  as `total_sales`
from blinkit_data
group  by `Outlet Location Type`,`Item Fat Content`
order by `Outlet Location Type` 
;

-- Advanced  sales metrics together by Outlet Location Type

#research shows mysql does not support pivot for siplicity
/*
select `Outlet Location Type` ,
isnull([`Low fat`],0) as 'Low fat',
isnull(['Regular'],0) as 'Regular fat',
from 
(select  `Outlet Location Type`,`Item Fat Content`,
      cast((sum(sales))as decimal(10,2))  as `total_sales`
from blinkit_data
group  by `Outlet Location Type`,`Item Fat Content`
) as source table
pivot
(
sum(sales)
for `Item Fat Content` in([`low fat`],[`regular`])
) as pivottable
 order by  `Outlet Location Type`*/
 

SELECT
  `Outlet Location Type`,
 cast((SUM(CASE WHEN `Item Fat Content` = 'Low fat' THEN sales ELSE 0 END)) as decimal(10,2))  AS `Low fat`,
 cast(( SUM(CASE WHEN `Item Fat Content` = 'Regular' THEN sales ELSE 0 END)) as decimal(10,2))AS `Regular fat`
FROM blinkit_data
GROUP BY `Outlet Location Type`;

-- trials to see if the above query is correct
-- Querry for tie 1 and low fat all very correcct
select cast((sum(sales)) as decimal(10,0) ) as `low fats tier 1 sales`
from blinkit_data
where 	`Item Fat Content`= 'Low fat' and `Outlet Location Type`='Tier 1';

-- Querry for tie 1 and regular fat
select cast((sum(sales)) as decimal(10,0)) as `regular fats tier 1 sales`
from blinkit_data
where 	`Item Fat Content` = 'Regular' and `Outlet Location Type`='Tier 1'
;
-- finding total sales and other metrics by outlet establishment 

-- selecting  sales metrics together by Outlet Location Type
select  `Outlet Establishment Year`,
           cast((sum(sales))as decimal(10,2))  as `total_sales`,
      cast( (avg(rating)) as decimal(10,1)) as `average rating`,
      count(*) as `total items`,
       cast((avg(sales)) as decimal(10,0)) as `average sales`
from blinkit_data
group  by `Outlet Establishment Year`
order by `Outlet Establishment Year` asc
;
-- identify percentage of sales from outlet size
-- this did not work!!!!
/*with percentagesalesperoutletsize(totalsales )
as(
select `Outlet Size`,
cast((sum(sales)) as decimal(10,0)) as totalsales 
from blinkit_data
group by `Outlet Size`
)
select sales/totalsales*100
 from percentagesalesperoutletsize
 */
 
SELECT 
  `Outlet Size`,
  CAST(SUM(sales) AS DECIMAL(10,0)) AS totalsales,
  CAST(SUM(sales) * 100 / SUM(SUM(sales)) OVER () AS DECIMAL(10,2)) AS percentage
FROM `blinkit_data`
GROUP BY `Outlet Size`
ORDER BY totalsales;
-- sales by outet location
 
SELECT 
  `Outlet Location Type`,
  CAST(SUM(sales) AS DECIMAL(10,0)) AS totalsales,
  CAST(SUM(sales) * 100 / SUM(SUM(sales)) OVER () AS DECIMAL(10,2)) AS percentage
FROM `blinkit_data`
GROUP BY `Outlet Location Type`
ORDER BY totalsales  desc; 

-- All metrics by outlet type

SELECT 
  `Outlet Type`,
  CAST(SUM(sales) AS DECIMAL(10,0)) AS totalsales,
  CAST(SUM(sales) * 100 / SUM(SUM(sales)) OVER () AS DECIMAL(10,2)) AS percentage
FROM `blinkit_data`
GROUP BY `Outlet Type`
ORDER BY totalsales  desc;




 