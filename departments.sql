-- DROP DATABASE IF EXISTS Departments_DB;
-- CREATE database Departments_DB;

USE Bamazon_DB;
-- create a foods_nutrition table that contains id, foodname, calories, protein, fats, carbohyrates and primary key of id 
CREATE TABLE departments (
  -- Code Starts Here
  department_id INT(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR (100),
  over_head_costs INT(10),
  PRIMARY KEY (department_id)










  -- Code Ends Here
);
SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs)
 VALUES ("antidepressant", 1000),
        ("anti-anxiety", 2000), 
        ("mood-stabilizer", 5500), 
        ("anti-psychotic", 70000),
        ("pain-management", 76)
       
