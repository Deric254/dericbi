use exes_data;
# 🌱 **Basic Queries**
# 1. Select customer names and join dates
SELECT customer_name, join_date FROM customers;
#✅ Purpose:# Retrieve basic customer details for onboarding analysis.
#📈 Analysis:# Monitor customer registration trends over time, useful for understanding growth velocity.
---
# 2. Get all pending orders
create view pendingorders as
SELECT * FROM orders WHERE order_status = 'Pending';
#✅ Purpose:# Extract unresolved or in-progress orders.
#📈 Analysis:# Helps identify bottlenecks or delays in the fulfillment workflow.
---
# 3. Sort products by descending price
create view Sortdescendingprice  as
SELECT * FROM products ORDER BY price desc;
#✅ Purpose:# Rank products from most to least expensive.
#📈 Analysis:# Useful for pricing strategy and identifying premium vs. budget segments.
---
# 🌿 #Intermediate Queries#
# 4. Count shops per region
create view `Count shops per region` as 
SELECT region, COUNT(*) AS shop_count FROM shops GROUP BY region;
#✅ Purpose:# Group shops by location.
#📈 Analysis:# Understand regional density of your client base, key for targeting EXES marketing.
---
# 5. Join customers and orders
create view `Join customers and orders` as
SELECT c.customer_name, o.order_amount
FROM customers c
JOIN orders o 
ON c.customer_id = o.customer_id;
#✅ Purpose:# Link purchase amounts to customer identities.
#📈 Analysis:# Great for personalized outreach and calculating lifetime value (LTV).
---
# 6. Products priced above average
create view `Products priced above average` as
SELECT product_name,price FROM products
WHERE price > (
  SELECT AVG(price) FROM products
)
order by price
;
#✅ Purpose:# Identify premium products.
#📈 Analysis:# Price benchmarking and product segmentation.
---
# 7. Categorize product pricing tiers
create view `Categorize product pricing tiers` as
SELECT product_name,price,
  CASE
    WHEN price < 50 THEN 'Budget'
    WHEN price BETWEEN 50 AND 200 THEN 'Standard'
    ELSE 'Premium'
  END AS `pricing_category: 50,51 to 200,over 200`
FROM products
order by price;
#✅ Purpose:# Conditional logic to classify products.
#📈 Analysis:# Helps visualize pricing distribution and refine inventory decisions.
---
# 🌳 #Advanced Queries#
# 8. Rank orders per customer
create view `Rank orders per customer` as
SELECT customer_id, order_amount,
  RANK() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS order_rank
FROM orders;
#✅ Purpose:# Order history ranking.
#📈 Analysis:# Prioritize recent activity for re-engagement campaigns.
---
# 9. High-value orders with CTE
create view `High-value orders with CTE` as
WITH high_value_orders AS (
  SELECT * FROM orders WHERE order_amount > 400
)
SELECT customer_id, COUNT(*) FROM high_value_orders GROUP BY customer_id;
#✅ Purpose:# Isolate high-ticket transactions.
#📈 Analysis:# Spot VIP customers for loyalty initiatives.
---
# 10. Recursively build category hierarchy
# not  working
WITH RECURSIVE category_tree AS (
  SELECT category_id, category_name, parent_id
  FROM categories
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.category_id, c.category_name, c.parent_id
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.category_id
)
SELECT * FROM category_tree;
#✅ Purpose:# Map parent-child relationships in product taxonomy.
#📈 Analysis:# Useful in structuring UI navigation and filtering logic for dashboards.
---
# 11. Pivot-style view with GROUPING SETS
# not  working
SELECT 
  IFNULL(region, 'All Regions') AS region_group,
  IFNULL(product_category, 'All Categories') AS category_group,
  SUM(sales) AS total_sales
FROM sales_data
GROUP BY region, product_category WITH ROLLUP;

#✅ Purpose:# Multi-level aggregation in one query.
#📈 Analysis:# Produces summaries by region, category, and overall—ideal for executive overviews.
---
## 🧬 #Specialty Queries#
# 12. Extract values from JSON
# not  working
SELECT 
  customer_info->>'name' AS name,
  customer_info->>'membership_level' AS level
FROM customer_profiles
WHERE customer_info->>'membership_level' = 'Gold';
#✅ Purpose:# Work with semi-structured JSON fields.
#📈 Analysis:# Segment customers by loyalty tier without schema overhaul.
---
# 13. Spot order outliers(above average order )
# working
create view `Spot order outliers(above average order )` as
SELECT customer_id, AVG(order_amount) AS avg_order
FROM orders
GROUP BY customer_id
HAVING AVG(order_amount) > (
  SELECT AVG(order_amount) + 2/* * STDDEV(order_amount)*/ FROM orders
);
#✅ Purpose:# Detect statistically high-order customers.
#📈 Analysis:# Target anomalies for fraud detection or reward campaigns.
---

# 14. Fallback for missing phone numbers
create view `Fallback for missing phone numbers` as 
SELECT customer_name, COALESCE(phone_number, 'Not Provided') FROM customers;
#✅ Purpose:# Handle NULLs cleanly.
#📈 Analysis:# Prevent gaps in communication records when exporting or building outreach lists.
---
# 15. Check if a customer has orders
create view `Check if a customer has orders` as
SELECT customer_name FROM customers
WHERE EXISTS (
  SELECT 1 FROM orders WHERE orders.customer_id = customers.customer_id
);
#✅ Purpose:# Test for relational existence.
#📈 Analysis:# Filter out inactive accounts or prioritize engaged users.











