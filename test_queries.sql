-- ======================================
-- TEST QUERY 1
-- List all dogs and their adoption fees
-- ======================================

SELECT petid, name, breed, adoptionfee
FROM pet
WHERE species = 'dog';


-- ======================================
-- TEST QUERY 2
-- Display all orders with customer,
-- employee, and pet information
-- ======================================

SELECT 
    o.orderid,
    c.name AS customer_name,
    e.name AS employee_name,
    p.name AS pet_name,
    o.orderdate,
    o.totalamount
FROM orderinfo o
JOIN customer c ON o.customerid = c.customerid
JOIN employee e ON o.employeeid = e.employeeid
JOIN pet p ON o.petid = p.petid;


-- ======================================
-- TEST QUERY 3
-- Count number of pets by species
-- ======================================

SELECT species, COUNT(*) AS total_pets
FROM pet
GROUP BY species;


-- ======================================
-- TEST QUERY 4
-- Total revenue from all orders
-- ======================================

SELECT SUM(totalamount) AS total_revenue
FROM orderinfo;


-- ======================================
-- TEST QUERY 5
-- Find the pet with the highest adoption fee
-- ======================================

SELECT name, species, breed, adoptionfee
FROM pet
ORDER BY adoptionfee DESC
LIMIT 1;
