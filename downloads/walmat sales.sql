#Walmat sales deep dive
create view walmatSales as
SELECT * FROM `walmat sales`.walmart_sales limit 10 ;#data preview 
# checking table info
#PRAGMA table_info (walmat sales);

# check  where data null
select 
sum(case when store is null then 1 else 0 end) as store_nulls,
sum(case when Date is null then 1 else 0 end) as Date_nulls,
sum(case when Weekly_Sales is null then 1 else 0 end) as Weekly_Sales_nulls,
sum(case when Holiday_Flag is null then 1 else 0 end) as Holiday_Flag_nulls,
sum(case when Temperature is null then 1 else 0 end) as Temperature_nulls,
sum(case when Fuel_Price is null then 1 else 0 end) as Fuel_Price_nulls,
sum(case when CPI is null then 1 else 0 end) as CPI_nulls,
sum(case when Unemployment is null then 1 else 0 end) as Unemployment_nulls
from walmart_sales;

# check distinct items in each collumn
select distinct Store from walmart_sales;
select distinct Date from walmart_sales;
select distinct Weekly_Sales from walmart_sales;
select distinct Holiday_Flag from walmart_sales;
select distinct Temperature from walmart_sales;
select distinct Fuel_Price from walmart_sales;
select distinct CPI from walmart_sales;
select distinct Unemployment from walmart_sales;

# check duplicates 
select store ,date, count(*) as count
from walmart_sales 
group by store ,date
HAVING count(*)>1;
# date cleaning 
/*update walmart_sales
set date=str_to_date(date,'%d/%m/%y') ;
alter table walmart_sales
modify date Date;
*/
# Exploratory data analysis 
create view totalSales as
select round((sum(Weekly_Sales)/1000000000),2) as 'Total sales billion $' from walmart_sales; #total sales 

# store sales 
create view `store sales` as
 select store ,round((avg(weekly_sales)),0)as average_sales_$,round((max(weekly_sales)),0) as max_sales_$
 from walmart_sales
 group by store
 order by 2;
 
 # Temparature impact on  sales 
 create view Temparature_impact_on_sales  as
 select Temperature ,round((avg(weekly_sales)),0)as average_sales_$
 from walmart_sales
 group by Temperature
 order by 1;
 
  # Holiday impact on  sales 
  create view  Holiday_impact_on_sales  as
 select Holiday_Flag ,round((avg(weekly_sales)),0)as average_sales_$
 from walmart_sales
 group by Holiday_Flag
 order by 1;
 
 # Fuel_Price impact on sales 
 create view Fuel_Price_impact_on_sales  as
 select Fuel_Price ,round((avg(weekly_sales)),0)as average_sales_$
 from walmart_sales
 group by Fuel_Price
 order by 1;
 
  # CPI impact on  sales
  create view `CPI impact on  sales` as
 select CPI ,round((avg(weekly_sales)),0)as average_sales_$
 from walmart_sales
 group by CPI
 order by 1;
 
   # Unemployment impact  on  sales 
   create view Unemployment_impact_on_sales as
 select Unemployment ,round((avg(weekly_sales)),0)as average_sales_$
 from walmart_sales
 group by Unemployment
 order by 1;
 
    # sales trend over time  
    create view`sales trend over time` as 
 select date ,round((avg(weekly_sales)),0)as average_sales_$
 from walmart_sales
 group by date
 order by 1;