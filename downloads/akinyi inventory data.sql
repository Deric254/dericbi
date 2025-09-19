# full data preview
create view  akinyi_inventory as
SELECT * FROM akinyi_inventory.`inventory data`
limit 5;

#item stock levels
create view `stock levels` as
select item, sum(stock_level) as stock_level from `inventory data`
group by item
order by 2 desc
limit 5;

#stock supplier  count
create view  `supplier  count` as
select category,supplier ,count(supplier)as supplierCount  from `inventory data`
group by category,supplier
order by 3
limit 5;

#restocking frequency
create view  `restocking frequency` as
select item,count(Last_Restock) as restock_frequency
from `inventory data`
group by item
order by 2 desc
;
#stock and levels
#Clean empty stock_levels
update `inventory data`
set Stock_Level=0 
where Stock_Level='';
#change stock_level to integers
alter table `inventory data`
modify Stock_Level int ;
#post clean accesment 
select item,Stock_Level from `inventory data`;#exploring stock levels
select max(Stock_Level) from `inventory data`;#exploring maxium
select MIN(Stock_Level) from `inventory data`;#exploring minimum
select avg(Stock_Level) from `inventory data`;#exploring average

#current stock levels , below 3 is critical ,5-7 is good , above 7 is healthy
create view `stock level aert` as
select item,Stock_Level,
case 
when Stock_Level<5 then 'critical'
when Stock_Level between 5 and 7  then 'good'
when Stock_Level>7 then 'healthy'
end as `level alerts`
from  `inventory data`
;

# last restocked item vs stock level
# make last restocked date
#tell mysql how to inteprate data 
UPDATE `inventory data`
SET Last_Restock = STR_TO_DATE(REPLACE(Last_Restock, ' 0:', ' 00:'), '%m/%d/%Y %H:%i')
WHERE Last_Restock LIKE '% 0:%';

#change to date time 
alter table `inventory data`
modify Last_Restock  datetime ;

# stock turnover by item
create view `stock turnover by item` as
select item,Last_Restock,curdate() as today ,datediff(curdate(),Last_Restock) as `days difference`,Stock_Level
from `inventory data`
order by 2 desc;

# stock turnover grouped  by category
create view `stock turnover grouped  by category` as 
SELECT 
  Category,
  Item,
  Last_Restock,
  CURDATE() AS Today,
  DATEDIFF(CURDATE(), Last_Restock) AS `Days_Since_Restock`,
  Stock_Level
FROM `inventory data`
ORDER BY Category, Last_Restock DESC;




