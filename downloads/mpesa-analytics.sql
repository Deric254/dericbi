#imported csv via a python script
#full data preview
SELECT * FROM mpesatransactions.mpesa_dataset;
#1. Inspect data for issues to clean 
#inspect collumns and data types
show columns from mpesa_dataset;

#: Check duplicates
SELECT TransactionID, COUNT(*) AS count
FROM mpesa_dataset
GROUP BY TransactionID
HAVING count > 1;

# Check missing values
SELECT COUNT(*) AS missing
FROM mpesa_dataset
WHERE Amount IS NULL OR Status IS NULL;

#: Validate Fee
select amount, Fee
     from mpesa_dataset
    where 
    Amount <= 100  or
    Amount <= 1000 or
    Amount <= 5000 or
    Amount <= 10000 
    limit 2
;

#seasonal trend (Dec-Feb, Apr-May)
SELECT 
    round((SUM(Amount)/1000000000),2) AS `spike in billions`,
    (SELECT round((SUM(Amount)/1000000000),1) FROM mpesa_dataset WHERE MONTH(TransactionDate) NOT IN (12, 1, 2, 4, 5)) AS `other in Billions`
FROM mpesa_dataset
WHERE MONTH(TransactionDate) IN (12, 1, 2, 4, 5);

#  Analysis 
# 1: Total Transaction Amount by Type
# Identify dominant transaction types (e.g., Send Money)
create view `Total Transaction Amount by Type` as
SELECT TransactionType, round((SUM(Amount)/1000000000),2) AS `TotalAmount in Billions`
FROM mpesa_dataset
GROUP BY TransactionType
ORDER BY `TotalAmount in Billions` DESC;

#.2: Transaction Amount by User Type
# Target key users (e.g., Individuals)
create view `Transaction Amount by User Type` as
SELECT UserType,ROUND((SUM(Amount)/1000000000),1)  AS TotalAmountInBillions
FROM mpesa_dataset
GROUP BY UserType;

# Transaction Amount by Location
create view `Transaction Amount by Location` as
# Optimize services in high-volume areas (e.g., Nairobi)
SELECT Location, ROUND((SUM(Amount)/1000000000),1)  AS TotalAmountBilllions
FROM mpesa_dataset
GROUP BY Location;

# Monthly Transaction Trend
# Spot seasonal spikes for marketing
create view `Monthly Transaction Trend` as
SELECT DATE_FORMAT(TransactionDate, '%Y-%m') AS YearMonth, ROUND((SUM(Amount)/1000000000),2) AS TotalAmountBillions
FROM mpesa_dataset
GROUP BY YearMonth
ORDER BY YearMonth;

# Channel Usage by Year
# Highlight Mobile App growth
create view `Channel Usage by Year` as
SELECT YEAR(TransactionDate) AS Year, Channel, ROUND((SUM(Amount)/1000000000),2) AS TotalAmount
FROM mpesa_dataset
GROUP BY Year, Channel;

# Potential Fraud (Failed Transactions)
# Identify fraud patterns	
create view `potential frauds` as
SELECT Location, COUNT(*) AS Ponsiblefraud
FROM mpesa_dataset
WHERE Status = 'Failed'
GROUP BY Location;


# Export for Visualization
create view `Transaction type amounts` as 
SELECT TransactionType, ROUND((SUM(Amount)/1000000000),2) AS TotalAmountBillions
FROM mpesa_dataset
GROUP BY TransactionType
;
#FEE metrics
#Revenue for carrier service provider metrics 
create view `Total revenue` as
select round((SUM(fee)/1000000),2)
 as TotalRevenueMillions
 from mpesa_dataset;

#Revenue from users
 create view `Revenue from users` as
select UserType,round((SUM(fee)/1000000),2)
 as Fee_millions
 from mpesa_dataset
 group by UserType
 ;
 
 #Revenue from location
      create view `Revenue from location` as
select Location,round((SUM(fee)/1000000),2)
 as Fee_millions
 from mpesa_dataset
 group by Location
 ;
 
  #Revenue from transaction type
     create view `Revenue from transaction type` as
select TransactionType,round((SUM(fee)/1000000),2)
 as Fee_millions
 from mpesa_dataset
 group by TransactionType
 ;
 
   #Revenue from channel type
   create view `Revenue from channel type` as
select Channel,round((SUM(fee)/1000000),2)
 as Fee_millions
 from mpesa_dataset
 group by Channel
 ;
 
     #Revenue from TransactionDate
     create view `Revenue from TransactionDate` as
select monthname(TransactionDate) as month,round((SUM(fee)/1000000),3)
 as Fee_millions
 from mpesa_dataset
 group by monthname(TransactionDate)
 order by Fee_millions 
 ;
 
 
 #efficiency checks
 create view efficiency as
select Status,round((SUM(fee)/1000000),3)as Fee_millions,count(*) As TransactionCount,round(((count(*)/100000)*100),2) as percentage
 from mpesa_dataset
 group by Status
 ;














