create database portfolio;
# imported the data from csv'C:\Users\A\OneDrive\Desktop\Master_plan\Data_Analysis_Camp\Data_Analyst_plan\Learning_phase\datasets\Raw_datasets\Mini_Projects_datasets\portfolio_trades.csv'via import wizard
use portfolio;
SELECT * FROM portfolio.portfolio_trades;# preview the full table 
# Data inspection 
select distinct trade_id from portfolio_trades;#No issue
select distinct stock from portfolio_trades;#No issue
select distinct sector from portfolio_trades;#we have 'Technology'
select distinct price from portfolio_trades;# we have 'N/A' and 'KSh999.99'
select distinct shares from portfolio_trades;# we have negatives and zeros
select distinct trade_date from portfolio_trades;# we have 'Invalid'
select distinct account_id from portfolio_trades;# we haveblanks 
select distinct exchange from portfolio_trades;# we have 'Unknown','NSE niÃ±a' and blanks
#data cleaning 
#1.cleaning  sector by replacing 'Technology' with 'Tech'
update portfolio_trades
set sector ='Tech' where sector ='Technology';
#2.cleaning  price  by removing N/A , remove KSH and repalce nulls with average price 
#remove  N\A
update portfolio_trades
set price ='' where price ='N/A';
# remove ksh
update portfolio_trades
set price =replace(price,'KSh','');
#getting average price to imput the blanks 
select round((avg(price)),0) as average_price from portfolio_trades;
# replace the blanks with average price 
/*update portfolio_trades
set price =(
select round((avg(price)),0) as average_price from 
portfolio_trades
)
where price='';*/
set@avg_price=(
select avg(price) as average_price from portfolio_trades
);
update portfolio_trades
set price=@avg_price
where price='';
select trade_id,price from portfolio_trades where price='';#checking which null prices need imputation 
select count(trade_id) from portfolio_trades where price='';#counting  which null prices need imputation 
#tame the decimals introduced from imputation 
update portfolio_trades
set price=round(price,0);
#check the price standing 
select price from portfolio_trades ;# everything loooks nice 

# 3 clean shares  set all less than 1 shares to 1

update portfolio_trades
set shares=
case 
when shares<1 then 1 else shares
end;

# 4 clean dates  set all invalid dates to modal date 
# i first set all invalid to blanks and it was not necessary 
# set blanks  to '01/01/2025'
update portfolio_trades
set trade_date='01/01/2025'
where trade_date='';
#5 clean account collumn where blank set it to unknown 
update portfolio_trades
set account_id='Unknown'
where account_id='';

#6 clean exchange  collumn where blank, and any other thing other than NSE AND NYSE  set it to NSE 
update portfolio_trades
set exchange='NSE'
where exchange not in('NSE','NYSE');
select trade_id, exchange from portfolio_trades where exchange='NSE';
select trade_id, exchange from portfolio_trades where exchange='NYSE';

# analysis 
#add collumn trade value which is the KPI
alter table portfolio_trades
add column trade_value decimal(15,2);
update portfolio_trades
set trade_value=`price`*`shares`;
# PREVIEW THE NEWLY ADDED CLLUMN 
update portfolio_trades 
set trade_value=round(trade_value,0);
select price, shares, trade_value from portfolio_trades ;

#  select*, (price*shares) as trade_value from portfolio_trades
#1.Trade value which is price * shares
create view trade_value as select*, (price*shares) as trade_value from portfolio_trades;
#2.stocks by trade value
create view 
trade_Value_by_stocks as 
select stock,sum(trade_value) as Total_tradedvalue
from  portfolio_trades
group by stock;
#3.Sector by trade value
create view 
Sectors_by_trade_Value as 
select sector ,sum(trade_value) as Total_tradedvalue
from  portfolio_trades
group by sector
order by 1;

#4.Shares by trade value
create view 
shares_by_trade_Value as 
select shares ,round((avg(trade_value)),0) as Average_traded_value
from  portfolio_trades
group by shares
order by 1;

#5.exchange by trade value
create view 
exchange_by_trade_Value as 
select exchange ,round((avg(trade_value)),0) as Average_traded_value
from  portfolio_trades
group by exchange
order by 1;

#5.dailyTradeFrequency
create view 
dailyTradeFrequency as 
select trade_date ,round((avg(trade_value)),0) as Average_traded_value
from  portfolio_trades
group by trade_date
order by 1;

