show databases ;
use exes_data;
show tables;
select * from categories;
select* from `customer_profiles`;
select* from customers;
select* from orders;
select* from products;
select* from sales_data;
select * from  shops;

#local and non-local shops 

# Mapping sales and shops they were made 
select  sd.sale_date as date ,s.shop_id,s.shop_name,s.region,sd.sale_id,sd.region as `buyer region`,sd.sales
from shops s
join sales_data sd
on s.shop_id=sd.shop_id
;
# Mapping sales and shops they were made and sales are bought by people from the region of the shop 
select  sd.sale_date as date ,
        s.shop_id,s.shop_name,
        s.region,sd.sale_id,
        sd.region as `buyer region`,
        sd.sales
from shops s
join sales_data sd
on s.shop_id=sd.shop_id  and 
 s.region=sd.region ;
# Mapping sales and shops they were made and sales are bought by people not from the region of the shop
select  sd.sale_date as date ,
        s.shop_id,s.shop_name,s.region,
        sd.sale_id,sd.region as `buyer region`,
        sd.sales
from shops s
join sales_data sd
on s.shop_id=sd.shop_id  and 
   s.region!=sd.region
;
 
#Total Regional sales 
select "Regional",round((sum(sales)/100000),2) As `Total sales(Millions)`
from shops s
join sales_data sd
on s.shop_id=sd.shop_id  and 
   s.region=sd.region
union
#Total Non-regional sales in shops
select"Non-regional", round((sum(sales)/100000),2) As `Non regional sales (Millions)`
from shops s
join sales_data sd
on s.shop_id=sd.shop_id  and 
   s.region!=sd.region
union
#Total sales in all shops  shops
select "Total sales",round((sum(sales)/100000),2) As `Non regional sales (Millions)`
from shops s
join sales_data sd
on s.shop_id=sd.shop_id  ;

