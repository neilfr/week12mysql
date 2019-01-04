USE bamazon_db;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL (10,2) NOT NULL,
  PRIMARY KEY (department_id)
);