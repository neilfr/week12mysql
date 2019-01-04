var inquirer = require("inquirer");
var mysql = require("mysql");

var consoleTable = require('console.table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

function salesByDepartment(){
    console.log("I'm in! 1");
    var salesByDepartmentQuery = "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales , SUM(p.product_sales)-d.over_head_costs AS total_profit FROM departments d, products p WHERE d.department_name = p.department_name GROUP BY d.department_name;";
    console.log(salesByDepartmentQuery);
    connection.query(salesByDepartmentQuery, [], function(error, results) {
      if (error) throw error;
      console.table(results);
 /*     console.table([
        {
          name: 'foo',
          age: 10
        }, {
          name: 'bar',
          age: 20
        }
      ]); */
      connection.end();
    });

}

function createNewDepartment(){
    console.log("add a department!");
    inquirer
    .prompt([
      {
        type:"input",
        message: "What is the name of the department you would like to add?",
        name: "departmentName"
      },
      {
        type:"input",
        message: "What is the overhead for this department?",
        name: "departmentOverhead"
      }
    ])
    .then(function(response) {
      console.log("The department you want to add is:");
      console.log(response.departmentName);
      console.log("The department overhead is:");
      console.log(response.departmentOverhead);
      var newDepartmentQuery = 'INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?);';
      connection.query(newDepartmentQuery, [response.departmentName, response.departmentOverhead]);
      connection.end();
    });
  }

function selectAction() {
inquirer
    .prompt([
    {
        type: "list",
        message: "What do you want to do?",
        name: "action",
        choices:["View Product Sales by Department","Create New Department"]
    }
    ])
    .then(function(response) {
    console.log("Your choice is:");
    console.log(response.action);
    switch (response.action){
        case 'View Product Sales by Department':
            console.log('1');
            salesByDepartment();
            break;
        case 'Create New Department':
            console.log('2');
            createNewDepartment();
            break;
        default:
            console.log('error');
            connection.end();
    }
    });
}

connection.connect();

selectAction();