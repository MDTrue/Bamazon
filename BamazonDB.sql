DROP DATABASE IF EXISTS Bamazon_DB;
CREATE database Bamazon_DB;

USE Bamazon_DB;
-- create a foods_nutrition table that contains id, foodname, calories, protein, fats, carbohyrates and primary key of id 
CREATE TABLE products (
  -- Code Starts Here
  item_id INT(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR (100),
  department_name VARCHAR (100),
  price DECIMAL(10,2),
  product_sales DECIMAL(10,2),
  stock_quantity INT(10),
  PRIMARY KEY (item_id)










  -- Code Ends Here
);
SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, product_sales, stock_quantity)
 VALUES ("Zoloft", "antidepressant", 50.00, 0, 10),
        ("Prozac", "antidepressant", 75.00, 0, 10), 
        ("Paxil", "antidepresant", 100.00, 0, 10), 
        ("Valium", "anti-anxiety", 89.00, 0, 10), 
        ("Xanax", "anti-anxiety", 3.00, 0, 10), 
        ("Cymbalta", "anti-anxiety", 67.00, 0, 10), 
        ("Lithium", "mood-stabilizer", 55.50, 0, 10), 
        ("Clozapine", "mood-stabilizer", 62.05, 0, 10), 
        ("Haldol", "anti-psychotic", 7.50, 0, 10),
        ("Abilify", "anti-psychotic", 99.00, 0, 10)
