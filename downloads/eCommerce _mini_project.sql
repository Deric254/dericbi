-- create database ecommerce_sales_mini;
use ecommerce_sales_mini ;
-- imported csv in to database using 
SELECT * FROM ecommerce_sales_mini.ecommerce_sales;-- preview data all of it  and found it was well
-- dropping unnecessary collumn
alter table ecommerce_sales
drop column MyUnknownColumn;
-- checking null values in every collumn 
select order_id from ecommerce_sales where order_id=null;
select product from ecommerce_sales where product=null;
select category from ecommerce_sales where category=null;
select price from ecommerce_sales where price=null;
select quantity from ecommerce_sales where quantity=null;
select date from ecommerce_sales where date=null;
select customer_id from ecommerce_sales where customer_id=null;
select `Age Bucket` from ecommerce_sales where `Age Bucket`=null;
select `Custormer age` from ecommerce_sales where `Custormer age`=null;
select region from ecommerce_sales where region=null;
select Revenue from ecommerce_sales where Revenue=null;
-- checking distinct items in each column
select  distinct order_id from ecommerce_sales ;
select distinct product from ecommerce_sales ;
select distinct category from ecommerce_sales ;
select distinct price from ecommerce_sales ;
select distinct quantity from ecommerce_sales ;
select distinct date from ecommerce_sales ;
select distinct customer_id from ecommerce_sales;
select distinct `Age Bucket` from ecommerce_sales ;
select distinct `Custormer age` from ecommerce_sales ;
select distincts region from ecommerce_sales ;
select distinct Revenue from ecommerce_sales ;
-- Analysis 
create view total_revenue as SELECT SUM(revenue) AS total_revenue FROM ecommerce_sales; 
-- revenue by products
create view `revenue by products` as select product,sum(revenue) as `total revenue`from ecommerce_sales
group by  product ;

-- revenue by categories
 create view `revenue by categories` as select category,sum(revenue) as `total revenue`from ecommerce_sales
group by  category; 

-- revenue by region
create view `revenue by region` as select region,sum(revenue) as `total revenue`from ecommerce_sales
group by  region;

-- revenue by AGE
create view `revenue by AGE` as select `Age Bucket`,sum(revenue) as `total revenue`from ecommerce_sales
group by  `Age Bucket` ;

-- revenue by Date
create view `revenue by date` as select `date`,sum(revenue) as `total revenue`from ecommerce_sales
group by  `date` ;

